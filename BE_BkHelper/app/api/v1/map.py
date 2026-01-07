from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter()

# app/api/v1/map.py → app/
BASE_DIR = Path(__file__).resolve().parents[2]
MAP_DIR = BASE_DIR / "db" / "map"


@router.get("/{map_name}")
def get_map(map_name: str):
    file_path = MAP_DIR / f"{map_name}.json"

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Map not found")

    return FileResponse(file_path, media_type="application/json")