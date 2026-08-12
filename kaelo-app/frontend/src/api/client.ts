// Accepts either a bare host or one already ending in /api, since every route
// below is written relative to the /api prefix.
const RAW_API_BASE = (import.meta as any).env?.VITE_API_URL || "/api";
const API_BASE = (() => {
  const base = String(RAW_API_BASE).replace(/\/+$/, "");
  return /\/api$/.test(base) ? base : `${base}/api`;
})();

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string> || {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

export interface Region {
  name: string;
  facility_count: number;
  source_node: string;
}

export interface Scenario {
  id: string;
  label: string;
  builtin: boolean;
  total_biweekly: number;
}

export interface Facility {
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  dhmt: string;
}

export interface Summary {
  total_facilities: number;
  total_population: number;
  dhmt_count: number;
  facility_type_counts: Record<string, number>;
  dhmt_facility_counts: Record<string, number>;
}

export interface OptimizationRequest {
  region: string;
  strategy: string;
  scenario: string;
  periods: number;
  kappa: number;
  gamma: number;
  transport_cost_per_km: number;
  shortage_penalty: number;
  holding_cost: number;
  supply_multiplier: number;
  seed: number;
  demand_multiplier: number;
  custom_demand: Record<string, Record<string, number>> | null;
}

export interface RegionDemand {
  region: string;
  facilities: string[];
  drug_classes: string[];
  demand: Record<string, Record<string, number>>;
}

export interface PeriodMetric {
  t: number;
  status: string;
  objective: number | null;
  transport_cost: number | null;
  shortage_cost: number | null;
  holding_cost: number | null;
  procurement_cost: number | null;
  unmet_pct: number | null;
  total_unmet: number | null;
  total_demand: number | null;
}

export interface OptimizationResult {
  region: string;
  strategy: string;
  periods: PeriodMetric[];
  summary: Record<string, number>;
}

export interface GeoJSON {
  type: string;
  features: Array<{
    type: string;
    geometry: { type: string; coordinates: [number, number] };
    properties: { name: string; type: string; dhmt: string };
  }>;
}

export interface PlanningRequest {
  region: string;
  strategy: string;
  scenario: string;
  kappa: number;
  gamma: number;
  transport_cost_per_km: number;
  shortage_penalty: number;
  holding_cost: number;
  initial_inventory: Record<string, Record<string, number>> | null;
  last_demand: Record<string, Record<string, number>> | null;
  custom_prices: Record<string, number> | null;
  arc_cap?: number | null;
}

export interface Shipment {
  from: string;
  to: string;
  drug: string;
  quantity: number;
  distance_km: number;
}

export interface ProcurementOrder {
  drug: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
}

export interface PlanningResult {
  region: string;
  status: string;
  solve_time_s: number;
  strategy: string;
  shipments: Shipment[];
  procurement: ProcurementOrder[];
  summary: {
    total_shipments: number;
    total_units_shipped: number;
    total_procurement_orders: number;
    total_units_procured: number;
    total_cost: number;
    total_transport_cost: number;
    total_procurement_cost: number;
    total_holding_cost: number | null;
    total_shortage_cost: number | null;
    active_routes: number;
  };
}

export const api = {
  getSummary: () => fetchJSON<Summary>("/summary"),
  getRegions: () => fetchJSON<Region[]>("/regions"),
  getRegionFacilities: (region: string) =>
    fetchJSON<Facility[]>(`/regions/${encodeURIComponent(region)}/facilities`),
  getFacilitiesGeoJSON: () => fetchJSON<GeoJSON>("/facilities/geojson"),
  getDistrictsGeoJSON: () => fetchJSON<any>("/districts/geojson"),
  getRegionDemand: (region: string, scenario = "2526") =>
    fetchJSON<RegionDemand>(
      `/regions/${encodeURIComponent(region)}/demand?scenario=${scenario}`
    ),
  optimize: (req: OptimizationRequest) =>
    fetchJSON<OptimizationResult>("/optimize", {
      method: "POST",
      body: JSON.stringify(req),
    }),
  plan: (req: PlanningRequest) =>
    fetchJSON<PlanningResult>("/plan", {
      method: "POST",
      body: JSON.stringify(req),
    }),
};
