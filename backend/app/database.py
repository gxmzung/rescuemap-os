import sqlite3
from pathlib import Path
from typing import Any

DB_PATH = Path(__file__).resolve().parents[1] / "data" / "rescuemap.db"


def get_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return dict(row)


def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS incidents (
            num INTEGER PRIMARY KEY AUTOINCREMENT,
            id TEXT UNIQUE NOT NULL,
            status TEXT NOT NULL,
            disaster TEXT NOT NULL,
            mode TEXT NOT NULL,
            location TEXT NOT NULL,
            risk INTEGER NOT NULL,
            checkin TEXT NOT NULL,
            time TEXT NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS risk_layers (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL,
            type TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT NOT NULL,
            warning TEXT
        )
        """
    )

    cur.execute("SELECT COUNT(*) AS count FROM incidents")
    incident_count = cur.fetchone()["count"]

    if incident_count == 0:
        seed_incidents = [
            (
                "RM-001",
                "help",
                "화재",
                "장애인 이동지원",
                "배재대학교 P관 3층 서쪽 복도",
                92,
                "기관 확인 대기",
                "방금 전",
            ),
            (
                "RM-002",
                "moving",
                "폭우/침수",
                "고령자 모드",
                "정문 인근 저지대 보행로",
                68,
                "기관 확인 완료",
                "3분 전",
            ),
            (
                "RM-003",
                "help",
                "야간 귀가 위험",
                "야간 귀가 모드",
                "후문 원룸가 골목",
                74,
                "미확인",
                "7분 전",
            ),
        ]

        cur.executemany(
            """
            INSERT INTO incidents
            (id, status, disaster, mode, location, risk, checkin, time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            seed_incidents,
        )

    cur.execute("SELECT COUNT(*) AS count FROM risk_layers")
    layer_count = cur.fetchone()["count"]

    if layer_count == 0:
        seed_layers = [
            (
                "shelter",
                "대피소",
                "public_data",
                "학교·공공 대피소 위치",
                "active",
                None,
            ),
            (
                "danger",
                "위험구역",
                "geojson",
                "하천·저지대·지하차도 위험구역",
                "active",
                None,
            ),
            (
                "user",
                "사용자 단서",
                "status_event",
                "상태 공유 시 기록된 위치 단서",
                "active",
                None,
            ),
            (
                "sar",
                "SAR 침수 참고",
                "mock_reference_layer",
                "Sentinel/SAR 기반 침수 추정 Mock Layer",
                "active",
                "실시간 구조 명령용이 아닌 위험 참고용 레이어입니다.",
            ),
        ]

        cur.executemany(
            """
            INSERT INTO risk_layers
            (id, label, type, description, status, warning)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            seed_layers,
        )

    conn.commit()
    conn.close()


def list_incidents():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM incidents ORDER BY num DESC")
    rows = [row_to_dict(row) for row in cur.fetchall()]
    conn.close()
    return rows


def create_incident(payload):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) AS count FROM incidents")
    count = cur.fetchone()["count"]
    next_id = f"RM-{count + 1:03d}"

    checkin = "기관 확인 대기" if payload.status == "help" else "기관 전송 대기"

    cur.execute(
        """
        INSERT INTO incidents
        (id, status, disaster, mode, location, risk, checkin, time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            next_id,
            payload.status,
            payload.disaster,
            payload.mode,
            payload.location,
            payload.risk,
            checkin,
            "방금 전",
        ),
    )

    conn.commit()

    cur.execute("SELECT * FROM incidents WHERE id = ?", (next_id,))
    row = row_to_dict(cur.fetchone())
    conn.close()
    return row


def update_incident_checkin(incident_id: str, checkin: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "UPDATE incidents SET checkin = ? WHERE id = ?",
        (checkin, incident_id),
    )

    if cur.rowcount == 0:
        conn.close()
        return None

    conn.commit()

    cur.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
    row = row_to_dict(cur.fetchone())
    conn.close()
    return row


def list_layers():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM risk_layers")
    rows = [row_to_dict(row) for row in cur.fetchall()]
    conn.close()
    return rows
