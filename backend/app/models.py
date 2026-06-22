from pydantic import BaseModel
from typing import Literal, Optional


StatusType = Literal["safe", "moving", "help"]
CheckinStatus = Literal[
    "미확인",
    "로컬 저장",
    "기관 전송 대기",
    "기관 확인 대기",
    "기관 확인 완료",
    "실패지도 후보",
]


class StatusCreate(BaseModel):
    status: StatusType
    disaster: str
    mode: str
    location: str
    building: Optional[str] = None
    floor: Optional[str] = None
    zone: Optional[str] = None
    risk: int


class Incident(BaseModel):
    id: str
    status: StatusType
    disaster: str
    mode: str
    location: str
    risk: int
    checkin: CheckinStatus
    time: str


class CheckinUpdate(BaseModel):
    checkin: CheckinStatus
