from fastapi import APIRouter, HTTPException
from app.models import StatusCreate, Incident, CheckinUpdate
from app.report import build_failure_report, render_failure_report_markdown, save_failure_report
from app.database import (
    list_incidents,
    create_incident,
    update_incident_checkin,
    list_layers,
)

router = APIRouter()


kit_structure = {
    "rescue-kit": {
        "disaster_protocols": [
            "fire.yml",
            "flood.yml",
            "earthquake.yml",
            "infection.yml",
            "night_return.yml",
        ],
        "vulnerable_modes": [
            "elderly.yml",
            "disabled.yml",
            "isolated_youth.yml",
            "night_return.yml",
        ],
        "local_data": [
            "shelters.csv",
            "danger_zones.geojson",
        ],
        "report_templates": [
            "failure_report.md",
        ],
    }
}


@router.get("/")
def root():
    return {
        "service": "RescueMap OS API",
        "description": "Open-source disaster response kit backend",
        "storage": "SQLite",
        "status": "running",
    }


@router.get("/api/incidents")
def get_incidents():
    items = list_incidents()
    return {
        "count": len(items),
        "items": items,
    }


@router.post("/api/status", response_model=Incident)
def create_status(payload: StatusCreate):
    return create_incident(payload)


@router.patch("/api/incidents/{incident_id}/checkin", response_model=Incident)
def update_checkin(incident_id: str, payload: CheckinUpdate):
    updated = update_incident_checkin(incident_id, payload.checkin)

    if updated is None:
        raise HTTPException(status_code=404, detail="Incident not found")

    return updated


@router.get("/api/layers")
def get_layers():
    items = list_layers()
    return {
        "count": len(items),
        "items": items,
    }


@router.get("/api/kit")
def get_kit_structure():
    return kit_structure


@router.get("/api/failure-report")
def get_failure_report_preview():
    items = list_incidents()
    report = build_failure_report(items)

    return {
        "title": "Post-disaster Failure Map Report Preview",
        "summary": "익명화된 도움 요청, 고립 위치, 체크인 지연 기록을 기반으로 실패지도 후보를 생성합니다.",
        "generated_at": report["generated_at"],
        "total_incidents": report["total_incidents"],
        "candidate_count": report["failure_candidate_count"],
        "high_risk_count": report["high_risk_count"],
        "top_locations": report["top_locations"],
        "disaster_summary": report["disaster_summary"],
        "mode_summary": report["mode_summary"],
        "candidate_locations": [item["location"] for item in report["items"]],
    }


@router.post("/api/failure-report/generate")
def generate_failure_report():
    items = list_incidents()
    report = build_failure_report(items)
    markdown = render_failure_report_markdown(report)
    path = save_failure_report(markdown)

    return {
        "message": "Failure map report generated",
        "filename": path.name,
        "path": str(path),
        "candidate_count": report["failure_candidate_count"],
    }


@router.get("/api/failure-report/markdown")
def get_failure_report_markdown():
    items = list_incidents()
    report = build_failure_report(items)
    markdown = render_failure_report_markdown(report)

    return {
        "markdown": markdown,
    }
