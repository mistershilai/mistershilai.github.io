"""
data_loader.py: Load and clean all static datasets once at startup.
Extracted from national_pipeline/run_cms_two.py and national_pipeline.ipynb.
"""

import re
from pathlib import Path

import numpy as np
import os
import pandas as pd
import yaml
from scipy.spatial import cKDTree

# Repo root (4 levels up from this file), overridable because the deployed
# image lays the tree out differently from the research repo: there the app
# sits under app/, in the container backend/ and data/ are siblings.
BASE_DIR = Path(os.environ.get("KAELO_DATA_ROOT") or
                Path(__file__).resolve().parent.parent.parent.parent)

# Read config.yaml — if missing, default to production mode
_cfg_path = BASE_DIR / "config.yaml"
_cfg = yaml.safe_load(_cfg_path.read_text()) if _cfg_path.exists() else {}
DEBUG = _cfg.get("debug", False)

DATA_APP = BASE_DIR / "data" / "debug" / "app" if DEBUG else BASE_DIR / "data" / "app"

if DEBUG:
    import logging
    logging.getLogger(__name__).warning("DEBUG MODE — loading data from %s", DATA_APP)

# Demand scenarios. Volumes come from user input; the CMS procurement
# workbook that previously populated them is withheld from this build.
BUILTIN_SCENARIOS = [
    {"id": "2526", "label": "2025-26"},
    {"id": "2627", "label": "2026-27"},
]
BUILTIN_SCENARIO_IDS = {s["id"] for s in BUILTIN_SCENARIOS}


def _clean_matrix(df: pd.DataFrame) -> pd.DataFrame:
    df.index = df.index.astype(str).str.replace("\ufeff", "").str.strip()
    df.columns = df.columns.astype(str).str.replace("\ufeff", "").str.strip()
    df.index = df.index.str.replace(r"\s+", " ", regex=True)
    df.columns = df.columns.str.replace(r"\s+", " ", regex=True)
    return df


def clean_fac_name(x: str) -> str:
    s = str(x).replace("\ufeff", "").replace("\xa0", " ")
    return " ".join(s.split()).strip()


def nearest_facilities(pop_df, fac_df, subtype, n=1):
    if subtype == "Clinic":
        sub = fac_df[fac_df["Service Delivery Type"].str.lower().isin(
            ["clinic", "clinic with maternity"]
        )]
    elif subtype == "Hospital":
        sub = fac_df[
            fac_df["Service Delivery Type"].str.lower().isin(
                ["primary hospital", "district hospital"]
            )
            | (
                (fac_df["Service Delivery Type"].str.lower() == "referral hospital")
                & fac_df["Facility Name"].str.contains(
                    "Princess Marina|Nyangabgwe", case=False, na=False
                )
            )
        ]
    else:
        sub = fac_df[fac_df["Service Delivery Type"].str.lower() == subtype.lower()]
    if sub.empty:
        return pop_df
    tree = cKDTree(sub[["latitude", "longitude"]].to_numpy())
    dist, idx = tree.query(pop_df[["latitude", "longitude"]].to_numpy(), k=n)
    dist = dist[:, None] if n == 1 else dist
    idx = idx[:, None] if n == 1 else idx
    nearest = [
        sub.iloc[idx[:, i]].reset_index(drop=True).add_suffix(f"_{i+1}")
        for i in range(n)
    ]
    merged = pd.concat(nearest, axis=1)
    merged["crow_dist_km_1"] = dist[:, 0]
    return pd.concat([pop_df.reset_index(drop=True), merged], axis=1)


def _attach_assigned_dhmt(result_df, fac_df, subtype):
    fac_lookup = fac_df[["Facility Name", "DHMT"]].copy()
    fac_lookup["Facility Name"] = fac_lookup["Facility Name"].astype(str).str.strip()
    fac_lookup["DHMT"] = fac_lookup["DHMT"].astype(str).str.strip()
    overrides = {
        "Mowana Health Post": "Mahalapye",
        "Phuduhudu Health Post": "Kgalagadi North",
        "Tshwaane Health Post": "Kweneng",
    }
    fac_lookup["DHMT"] = fac_lookup.apply(
        lambda r: overrides.get(r["Facility Name"], r["DHMT"]), axis=1
    )
    fac_lookup = fac_lookup.drop_duplicates(subset=["Facility Name"])
    col = "Facility Name_1"
    out = result_df.copy()
    out[col] = out[col].astype(str).str.strip()
    out = out.merge(fac_lookup, left_on=col, right_on="Facility Name", how="left")
    tag = subtype.lower().replace(" ", "_")
    out = out.rename(columns={"DHMT": f"assigned_dhmt_{tag}"})
    return out.drop(columns=["Facility Name"])


class AppData:
    """Singleton-like container holding all loaded data."""

    def __init__(self):
        self.loaded = False
        self.dhmt_list: list[str] = []
        # Which inputs are present. This build ships without data, and a
        # deployment may legitimately have only some of it, so a missing file
        # disables the features that need it instead of killing startup.
        self.available: dict[str, bool] = {}

    def _try(self, key: str, fn):
        try:
            fn()
            self.available[key] = True
        except FileNotFoundError as e:
            self.available[key] = False
            print(f"[data] optional input missing, {key} disabled: {e.filename}")
        except Exception as e:
            self.available[key] = False
            print(f"[data] failed to load {key}: {e}")

    def load(self):
        if self.loaded:
            return
        self._try("population", self._load_population)
        self._try("facilities", self._load_facilities)
        self._try("matrices", self._load_matrices)
        self._try("age", self._load_age_data)
        self._try("admissions", self._load_admissions)
        self._try("glm", self._load_glm_artifacts)

        if self.available.get("population") and self.available.get("facilities"):
            self._try("assignments", self._compute_facility_assignments)
            self._try("pop_shares", self._compute_pop_shares)

        self.loaded = True

    @property
    def demand_model_available(self) -> bool:
        """Baseline demand needs the admissions estimates and GLM artifacts."""
        return all(self.available.get(k) for k in
                   ("population", "facilities", "age", "admissions", "glm", "pop_shares"))

    @property
    def network_available(self) -> bool:
        """Facility network and routing, enough to describe the problem."""
        return all(self.available.get(k) for k in ("facilities", "matrices"))

    # Population
    def _load_population(self):
        pop = pd.read_csv(
            DATA_APP / "census_population_2022_geocoded_final_uniform.csv"
        )
        pop.columns = (
            pop.columns.str.strip().str.lower().str.replace(" ", "_").str.replace("/", "_")
        )
        pop.rename(
            columns={"city_town_village": "city/town/village", "census_district": "district"},
            inplace=True,
        )
        pop["district_norm"] = pop["district"].astype(str).str.strip().str.lower()
        pop = pop.dropna(subset=["latitude", "longitude"]).copy()
        self.pop = pop

    # Facilities
    def _load_facilities(self):
        fac = pd.read_csv(DATA_APP / "facilities_with_warehouses.csv")
        fac["DHMT_norm"] = fac["DHMT"].astype(str).str.strip()
        fac["Facility_norm"] = fac["Facility Name"].astype(str).str.strip()
        ware = fac[fac["Is_Warehouse"] == True].copy()
        DHMT_WAREHOUSE_MAP = ware.groupby("DHMT_norm")["Facility_norm"].first().to_dict()
        CMS_NAME = "Central Medical Stores (CMS)"
        all_dhmts = fac["DHMT_norm"].dropna().unique()
        self.DHMT_SOURCE_MAP = {
            dhmt: DHMT_WAREHOUSE_MAP.get(dhmt, CMS_NAME) for dhmt in all_dhmts
        }
        self.CMS_NAME = CMS_NAME

        fac.columns = fac.columns.str.strip()
        # tolerate either the raw "Latitude/Longitude" headers or the lowercase
        # "latitude/longitude" headers written back by _save_facilities
        latlon_rename = {c: c.lower() for c in fac.columns if c.lower() in ("latitude", "longitude")}
        fac = fac.rename(columns=latlon_rename)
        fac = fac.dropna(subset=["latitude", "longitude"])
        fac["Service Delivery Type"] = (
            fac["Service Delivery Type"]
            .astype(str).str.strip().str.replace(r"\s+", " ", regex=True)
        )
        fac = fac[~fac["Facility Name"].str.contains("prison|school", case=False, na=False)]
        self.fac = fac
        self.dhmt_list = sorted(fac["DHMT"].dropna().astype(str).str.strip().unique().tolist())

    # Distance / time matrices
    def _load_matrices(self):
        self.dist_matrix_df = _clean_matrix(
            pd.read_csv(DATA_APP / "distance_matrix_named.csv", index_col=0)
        )
        self.time_matrix_df = _clean_matrix(
            pd.read_csv(DATA_APP / "duration_matrix_named.csv", index_col=0)
        )

    # Age breakdown
    def _load_age_data(self):
        age_df = pd.read_csv(DATA_APP / "botswana_population_age_breakdown.csv")
        age_df["AgeGroup"] = (
            age_df["AgeGroup"].astype(str).str.replace("–", "-", regex=False).str.strip()
        )
        age_df = age_df.rename(
            columns={"DistrictName": "district", "AgeGroup": "agegroup", "Population": "pop"}
        )
        age_df["pop"] = pd.to_numeric(age_df["pop"], errors="coerce").fillna(0)
        age_df["share"] = age_df["pop"] / age_df.groupby("district")["pop"].transform("sum")
        age_df["district_key"] = age_df["district"].astype(str).str.strip().str.lower()
        self.age_df = age_df

    # Derived admissions estimates; separate so a build without them still runs.
    def _load_admissions(self):
        district_adm = pd.read_csv(DATA_APP / "district_admissions_estimates_2021.csv")
        district_adm = district_adm.rename(columns={
            "Health District": "district",
            "Estimated Admissions 2021": "annual_admissions_est",
        })
        district_adm["district"] = district_adm["district"].astype(str).str.strip()
        district_adm["annual_admissions_est"] = pd.to_numeric(
            district_adm["annual_admissions_est"], errors="coerce"
        )
        district_adm["district_key"] = district_adm["district"].apply(
            lambda s: re.sub(r"\s+", " ", str(s)).strip().lower()
        )
        self.district_adm = district_adm

    # GLM artifacts
    def _load_glm_artifacts(self):
        ART_DIR = DATA_APP / "glm"
        p_class = pd.read_csv(ART_DIR / "p_class.csv")
        m_ak = pd.read_csv(ART_DIR / "m_ak.csv")

        self.age_map = {
            "<1": "<1", "1-5": "1-5",
            "6 to 10 years": "6-10", "11 to 15 years": "11-15",
            "16 to 20 years": "16-20", "21 to 25 years": "21-25",
            "26 to 30 years": "26-30", "31 to 35 years": "31-35",
            "36 to 40 years": "36-40", "41 to 45 years": "41-45",
            "46 to 50 years": "46-50", "51 to 55 years": "51-55",
            "56 to 60 years": "56-60", "61 to 65 years": "61-65",
            "66+": "66+",
        }
        # p_class ships with raw labels ("11 to 15 years", "CAI") while the rest
        # of the pipeline uses normalized ones ("11-15", "cai"). Without this the
        # demand join matches nothing and every facility comes out at zero.
        p_class["agegroup"] = p_class["agegroup"].replace(self.age_map)
        p_class["infectionstatus"] = (
            p_class["infectionstatus"].astype(str).str.strip().str.lower()
        )
        self.p_class = p_class

        m_ak["agegroup"] = m_ak["agegroup"].replace(self.age_map)
        m_ak["infectionstatus"] = m_ak["infectionstatus"].astype(str).str.strip().str.lower()
        m_ak["patients"] = pd.to_numeric(m_ak["patients"], errors="coerce").fillna(0)
        m_ak["m_ak"] = pd.to_numeric(m_ak["m_ak"], errors="coerce").fillna(0)
        self.m_ak = m_ak

        tmp = m_ak.copy()
        pi = tmp.groupby(["agegroup", "infectionstatus"], as_index=False)["patients"].sum()
        den = pi.groupby("agegroup")["patients"].transform("sum")
        pi["pi_inf_given_a"] = np.where(den > 0, pi["patients"] / den, 0.0)
        pi = pi[["agegroup", "infectionstatus", "pi_inf_given_a"]]
        pi["agegroup"] = pi["agegroup"].replace(self.age_map)
        self.pi_inf_given_a = pi

    # Demand scenarios. Totals are no longer reported: they were sums over the
    # withheld CMS procurement table.
    def list_scenarios(self) -> list:
        return [
            {"id": s["id"], "label": s["label"], "builtin": True, "total_biweekly": 0.0}
            for s in BUILTIN_SCENARIOS
        ]

    def scenario_exists(self, scenario_id: str) -> bool:
        return any(s["id"] == scenario_id for s in BUILTIN_SCENARIOS)

    # Facility assignments
    def _compute_facility_assignments(self):
        _pop = self.pop.copy()
        _pop["total_population"] = pd.to_numeric(
            _pop["total_population"].astype(str).str.replace(",", "", regex=False),
            errors="coerce",
        )
        _pop["pop_id"] = _pop.index

        raw_results = {}
        for subtype in ["Health Post", "Clinic", "Hospital"]:
            raw_results[subtype] = nearest_facilities(_pop, self.fac, subtype)

        self.results_with_dhmt = {}
        for subtype in raw_results:
            self.results_with_dhmt[subtype] = _attach_assigned_dhmt(
                raw_results[subtype], self.fac, subtype
            )
        self._raw_results = raw_results

    # National population share per facility
    def _compute_pop_shares(self):
        _rename = {
            "Facility Name_1": "facility_name",
            "crow_dist_km_1": "dist_km",
            "total_population": "pop_total",
        }
        _cols = ["pop_id", "Facility Name_1", "crow_dist_km_1", "total_population"]

        frames = []
        for subtype, ft in [("Clinic", "clinic"), ("Health Post", "health_post"), ("Hospital", "hospital")]:
            df_ = self._raw_results[subtype][_cols].rename(columns=_rename).copy()
            df_["facility_type"] = ft
            frames.append(df_)

        choices = pd.concat(frames, ignore_index=True)
        choices["dist_km"] = pd.to_numeric(choices["dist_km"], errors="coerce")
        choices = choices.dropna(subset=["facility_name", "dist_km"])
        choices["facility_name"] = choices["facility_name"].map(clean_fac_name)
        choices = choices.sort_values(["pop_id", "dist_km"])
        closest = choices.drop_duplicates(subset=["pop_id"], keep="first")

        pop_fac_national = closest.groupby("facility_name", as_index=True)["pop_total"].sum().rename("pop_total")
        national_pop = pop_fac_national.sum()
        self.pop_fac_share = (pop_fac_national / national_pop).rename("pop_share")
        self.national_pop = national_pop

    # Public accessors
    def get_facilities_for_region(self, dhmt: str) -> pd.DataFrame:
        """Return facilities belonging to the given DHMT."""
        fac = self.fac.copy()
        fac["_norm"] = fac["DHMT"].astype(str).str.strip().str.lower()
        return fac[fac["_norm"] == dhmt.strip().lower()].drop(columns=["_norm"])

    def get_facility_summary(self) -> dict:
        """Return summary statistics about facilities."""
        if not self.available.get("facilities"):
            return {
                "total_facilities": 0, "total_population": 0, "dhmt_count": 0,
                "facility_type_counts": {}, "dhmt_facility_counts": {},
                "data_available": False,
            }
        fac = self.fac
        type_counts = fac["Service Delivery Type"].value_counts().to_dict()
        dhmt_counts = fac["DHMT"].astype(str).str.strip().value_counts().to_dict()
        return {
            "total_facilities": len(fac),
            "total_population": int(getattr(self, "national_pop", 0) or 0),
            "dhmt_count": len([d for d in self.dhmt_list if d.strip() not in ("", "--")]),
            "facility_type_counts": type_counts,
            "dhmt_facility_counts": {k: v for k, v in dhmt_counts.items() if k.strip() not in ("", "--")},
        }

    def get_all_facilities_geojson(self) -> dict:
        """Return all facilities as GeoJSON for map display."""
        # An empty FeatureCollection lets the map render its basemap instead of
        # erroring when no facility data is configured.
        if not self.available.get("facilities"):
            return {"type": "FeatureCollection", "features": []}
        features = []
        for _, row in self.fac.iterrows():
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(row["longitude"]), float(row["latitude"])],
                },
                "properties": {
                    "name": str(row.get("Facility Name", "")),
                    "type": str(row.get("Service Delivery Type", "")),
                    "dhmt": str(row.get("DHMT", "")),
                },
            })
        return {"type": "FeatureCollection", "features": features}

    def get_districts_geojson(self) -> dict:
        """Load Botswana district boundary polygons and enrich with facility stats."""
        if not (DATA_APP / "botswana.geojson").exists():
            return {"type": "FeatureCollection", "features": []}
        import json
        geo_path = DATA_APP / "botswana.geojson"
        with open(geo_path) as f:
            geo = json.load(f)

        # Map administrative districts to DHMTs that fall within them
        district_to_dhmts = {
            "Central District": ["Boteti", "Mahalapye", "Serowe-Palapye", "Tutume"],
            "Chobe District": ["Chobe"],
            "Ghanzi District": ["Ghanzi"],
            "Kgalagadi District": ["Kgalagadi North", "Kgalagadi South"],
            "Kgatleng District": ["Kgatleng"],
            "Kweneng District": ["Kweneng"],
            "North-East District": ["North East", "Greater Francistown"],
            "North-West District": ["Ngami", "Okavango"],
            "South-East District": ["Greater Gaborone"],
            "Southern District": ["Southern", "Greater Lobatse", "Greater Phikwe"],
        }

        dhmt_counts = self.fac["DHMT"].astype(str).str.strip().value_counts().to_dict()

        for feat in geo["features"]:
            props = feat.get("properties", {})
            name = props.get("shapeName", "")
            dhmts = district_to_dhmts.get(name, [])
            total = sum(dhmt_counts.get(d, 0) for d in dhmts)
            props["facility_count"] = total
            props["dhmts"] = dhmts

        return geo


# Module-level singleton
app_data = AppData()
