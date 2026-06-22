from app.models import Incident

incidents: list[Incident] = [
    Incident(
        id="RM-001",
        status="help",
        disaster="화재",
        mode="장애인 이동지원",
        location="배재대학교 P관 3층 서쪽 복도",
        risk=92,
        checkin="기관 확인 대기",
        time="방금 전",
    ),
    Incident(
        id="RM-002",
        status="moving",
        disaster="폭우/침수",
        mode="고령자 모드",
        location="정문 인근 저지대 보행로",
        risk=68,
        checkin="기관 확인 완료",
        time="3분 전",
    ),
    Incident(
        id="RM-003",
        status="help",
        disaster="야간 귀가 위험",
        mode="야간 귀가 모드",
        location="후문 원룸가 골목",
        risk=74,
        checkin="미확인",
        time="7분 전",
    ),
]

layers = [
    {
        "id": "shelter",
        "label": "대피소",
        "type": "public_data",
        "description": "학교·공공 대피소 위치",
        "status": "active",
    },
    {
        "id": "danger",
        "label": "위험구역",
        "type": "geojson",
        "description": "하천·저지대·지하차도 위험구역",
        "status": "active",
    },
    {
        "id": "user",
        "label": "사용자 단서",
        "type": "status_event",
        "description": "상태 공유 시 기록된 위치 단서",
        "status": "active",
    },
    {
        "id": "sar",
        "label": "SAR 침수 참고",
        "type": "mock_reference_layer",
        "description": "Sentinel/SAR 기반 침수 추정 Mock Layer",
        "status": "active",
        "warning": "실시간 구조 명령용이 아닌 위험 참고용 레이어입니다.",
    },
]

kit_structure = {
    "rescue-kit": {
        "disaster_protocols": ["fire.yml", "flood.yml", "earthquake.yml", "infection.yml", "night_return.yml"],
        "vulnerable_modes": ["elderly.yml", "disabled.yml", "isolated_youth.yml", "night_return.yml"],
        "local_data": ["shelters.csv", "danger_zones.geojson"],
        "report_templates": ["failure_report.md"],
    }
}
