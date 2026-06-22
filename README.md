# RescueMap OS

**RescueMap OS** is an open-source disaster response kit for location clues, vulnerable-user check-ins, and post-disaster failure-map reporting.

## Core Idea

RescueMap OS does not make life-critical decisions for users.

It does not provide AI-based indoor escape routing.

Instead, it focuses on three principles:

1. **Before disaster**: build evacuation memory
2. **During disaster**: leave location and status clues
3. **After disaster**: generate failure maps for future improvement

## Why This Project Matters

In real disaster situations, users may not be able to calmly search information or operate complex apps.

Indoor GPS can be inaccurate, networks may fail, and vulnerable users may require different support flows.

RescueMap OS focuses on leaving useful clues rather than giving risky automated escape directions.

## Key Features

- 3-button status sharing: Safe / Moving / Need Help
- Building, floor, room, and zone-based location clue logging
- Vulnerable-user modes
- Guardian and institution check-in chain
- Public map and risk layers
- Post-disaster failure-map report
- Editable open-source disaster response kit

## What This Project Does Not Do

- No AI-based life-or-death decision making
- No automatic indoor escape routing
- No medical diagnosis
- No rescue success guarantee
- No always-on location tracking

## Open-source Kit Structure

```text
rescue-kit/
├── disaster_protocols/
├── vulnerable_modes/
├── local_data/
└── report_templates/
Frontend MVP

The current frontend MVP includes:

disaster type selection
vulnerable-user mode selection
three-button status sharing
location clue preview
ethics and safety principles
Running the Frontend MVP
cd frontend
npm install
npm run dev

Local development URL:

http://localhost:5173/
MVP Stack
Frontend: React + Vite + TypeScript
Backend: FastAPI
Database: SQLite or PostgreSQL/PostGIS
Map: Leaflet or MapLibre GL
Data: YAML, CSV, GeoJSON, JSON
StellaVision Coffee Chat Note

This project is related to spatial data, status information, public risk layers, and decision-support dashboards.

The future direction may include public geospatial data and Sentinel/SAR-based flood reference layers.

License

MIT License

Author

Lee Youngjun
Paejae University, Department of Computer Science
GitHub: @gxmzung
