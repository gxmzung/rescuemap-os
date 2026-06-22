from fastapi import APIRouter, HTTPException
from app.models import StatusCreate, Incident, CheckinUpdate
from app.mock_data import incidents, layers, kit_structure

router = APIRouter()


@router.get("/")
def root():
    return {
        "service": "RescueMap OS Mock API",
        "description": "Open-source disaster response kit mock backend",
        "status": "running",
    }


@router.get("/api/incidents")
def get_incidents():
    return {
        "count": len(incidents),
        "items": incidents,
    }


@router.post("/api/status", response_model=Incident)
def create_status(payload: StatusCreate):
    new_id = f"RM-{len(incidents) + 1:03d}"

    incident = Incident(
        id=new_id,
        status=payload.status,
        disaster=payload.disaster,
        mode=payload.mode,
        location=payload.location,
        risk=payload.risk,
        checkin="기관 확인 대기" if payload.status == "help" else "기관 전송 대기",
        time="방금 전",
    )

    incidents.insert(0, incident)
    return incident


@router.patch("/api/incidents/{incident_id}/checkin", response_model=Incident)
def update_checkin(incident_id: str, payload: CheckinUpdate):
    for index, incident in enumerate(incidents):
        if incident.id == incident_id:
            updated = incident.model_copy(update={"checkin": payload.checkin})
            incidents[index] = updated
            return updated

    raise HTTPException(status_code=404, detail="Incident not found")


@router.get("/api/layers")
def get_layers():
    return {
        "count": len(layers),
        "items": layers,
    }


@router.get("/api/kit")
def get_kit_structure():
    return kit_structure


@router.get("/api/failure-report")
def get_failure_report_preview():
    failure_candidates = [
        item for item in incidents if item.checkin == "실패지도 후보" or item.status == "help"
    ]

    return {
        "title": "Post-disaster Failure Map Report Preview",
        "summary": "익명화된 도움 요청, 고립 위치, 체크인 지연 기록을 기반으로 실패지도 후보를 생성합니다.",
        "candidate_count": len(failure_candidates),
        "candidate_locations": [item.location for item in failure_candidates],
    }
