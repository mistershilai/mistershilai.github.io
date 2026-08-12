#!/usr/bin/env python3
"""Create (or update) the Kaelo API Space on Hugging Face and upload the backend.

Prerequisites:
    pip install huggingface_hub
    hf auth login          # or set HF_TOKEN

Usage:
    python kaelo-app/deploy/hf-space/deploy.py [--name kaelo-api] [--origin https://elliotlee.info]

Uploads only what the API needs: this file's Dockerfile and README.md, plus
backend/. No data is included.
"""

import argparse
import shutil
import sys
import tempfile
from pathlib import Path

try:
    from huggingface_hub import HfApi
except ImportError:
    sys.exit("huggingface_hub is not installed. Run: pip install huggingface_hub")

HERE = Path(__file__).resolve().parent
APP_ROOT = HERE.parent.parent  # kaelo-app/


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", default="kaelo-api", help="Space name (default: kaelo-api)")
    ap.add_argument("--origin", default="https://elliotlee.info",
                    help="Site origin allowed by CORS")
    ap.add_argument("--private", action="store_true", help="Create the Space private")
    args = ap.parse_args()

    api = HfApi()
    try:
        who = api.whoami()
    except Exception:
        sys.exit("Not logged in to Hugging Face. Run: hf auth login")
    user = who["name"]
    repo_id = f"{user}/{args.name}"

    print(f"Space: {repo_id}")
    api.create_repo(repo_id=repo_id, repo_type="space", space_sdk="docker",
                    private=args.private, exist_ok=True)

    # Assemble exactly what should be published.
    with tempfile.TemporaryDirectory() as tmp:
        payload = Path(tmp) / "space"
        payload.mkdir()
        shutil.copy(HERE / "README.md", payload / "README.md")
        shutil.copy(HERE / "Dockerfile", payload / "Dockerfile")
        shutil.copytree(
            APP_ROOT / "backend",
            payload / "backend",
            ignore=shutil.ignore_patterns("__pycache__", "*.pyc", "*.db"),
        )
        print("Uploading:", ", ".join(sorted(p.name for p in payload.iterdir())))
        api.upload_folder(folder_path=str(payload), repo_id=repo_id, repo_type="space",
                          commit_message="Deploy Kaelo API")

    try:
        api.add_space_variable(repo_id=repo_id, key="CORS_ORIGINS", value=args.origin)
        print(f"Set CORS_ORIGINS={args.origin}")
    except Exception as e:
        print(f"Could not set CORS_ORIGINS automatically ({e}). "
              f"Set it under Settings -> Variables.")

    url = f"https://{user.lower()}-{args.name.lower()}.hf.space"
    print("\nSpace:      https://huggingface.co/spaces/" + repo_id)
    print("API base:   " + url)
    print("Health:     " + url + "/api/health")
    print("\nThen point the site at it:")
    print(f"  npx vercel env add VITE_API_URL production   # {url}")
    print(f"  npx vercel env add PUBLIC_KAELO_API_URL production   # {url}")


if __name__ == "__main__":
    main()
