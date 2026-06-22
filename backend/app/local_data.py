import csv
import json
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).resolve().parents[2]
LOCAL_DATA_DIR = ROOT_DIR / "rescue-kit" / "local_data"


def load_shelters() -> list[dict[str, Any]]:
    path = LOCAL_DATA_DIR / "shelters.csv"

    if not path.exists():
        return []

    shelters: list[dict[str, Any]] = []

    with path.open("r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            shelters.append(
                {
                    "id": row.get("id", ""),
                    "name": row.get("name", ""),
                    "type": row.get("type", ""),
                    "lat": float(row.get("lat", 0)),
                    "lng": float(row.get("lng", 0)),
                    "address": row.get("address", ""),
                    "capacity": int(row.get("capacity", 0)),
                    "note": row.get("note", ""),
                }
            )

    return shelters


def load_danger_zones() -> dict[str, Any]:
    path = LOCAL_DATA_DIR / "danger_zones.geojson"

    if not path.exists():
        return {
            "type": "FeatureCollection",
            "features": [],
        }

    return json.loads(path.read_text(encoding="utf-8"))
