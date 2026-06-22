from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any

REPORT_DIR = Path(__file__).resolve().parents[1] / "reports"


def build_failure_report(incidents: list[dict[str, Any]]) -> dict[str, Any]:
    failure_candidates = [
        item for item in incidents
        if item["checkin"] == "실패지도 후보" or item["status"] == "help"
    ]

    location_counts = Counter(item["location"] for item in failure_candidates)
    disaster_counts = Counter(item["disaster"] for item in failure_candidates)
    mode_counts = Counter(item["mode"] for item in failure_candidates)

    high_risk = [
        item for item in failure_candidates
        if int(item["risk"]) >= 80
    ]

    return {
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_incidents": len(incidents),
        "failure_candidate_count": len(failure_candidates),
        "high_risk_count": len(high_risk),
        "top_locations": location_counts.most_common(5),
        "disaster_summary": disaster_counts.most_common(),
        "mode_summary": mode_counts.most_common(),
        "items": failure_candidates,
    }


def render_failure_report_markdown(report: dict[str, Any]) -> str:
    lines = [
        "# RescueMap OS Failure Map Report",
        "",
        "## 1. Report Summary",
        "",
        f"- Generated at: {report['generated_at']}",
        f"- Total incident records: {report['total_incidents']}",
        f"- Failure-map candidates: {report['failure_candidate_count']}",
        f"- High-risk candidates: {report['high_risk_count']}",
        "",
        "## 2. Top Failure Locations",
        "",
    ]

    if report["top_locations"]:
        for location, count in report["top_locations"]:
            lines.append(f"- {location}: {count} case(s)")
    else:
        lines.append("- No failure-map candidates found.")

    lines += [
        "",
        "## 3. Disaster Type Summary",
        "",
    ]

    if report["disaster_summary"]:
        for disaster, count in report["disaster_summary"]:
            lines.append(f"- {disaster}: {count} case(s)")
    else:
        lines.append("- No disaster summary available.")

    lines += [
        "",
        "## 4. Vulnerable Mode Summary",
        "",
    ]

    if report["mode_summary"]:
        for mode, count in report["mode_summary"]:
            lines.append(f"- {mode}: {count} case(s)")
    else:
        lines.append("- No vulnerable mode summary available.")

    lines += [
        "",
        "## 5. Candidate Records",
        "",
        "| ID | Status | Disaster | Mode | Location | Risk | Check-in |",
        "|---|---|---|---|---|---:|---|",
    ]

    for item in report["items"]:
        lines.append(
            f"| {item['id']} | {item['status']} | {item['disaster']} | "
            f"{item['mode']} | {item['location']} | {item['risk']} | {item['checkin']} |"
        )

    lines += [
        "",
        "## 6. Notes",
        "",
        "This report is a post-disaster improvement artifact.",
        "It is not a rescue command, medical diagnosis, or automated life-critical decision.",
        "",
        "RescueMap OS uses this report to identify repeated failure locations, delayed check-ins,",
        "and vulnerable-user support gaps for future disaster response planning.",
    ]

    return "\n".join(lines)


def save_failure_report(markdown: str) -> Path:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"failure_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
    path = REPORT_DIR / filename
    path.write_text(markdown, encoding="utf-8")
    return path
