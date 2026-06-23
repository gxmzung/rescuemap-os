# RescueMap OS

![Status](https://img.shields.io/badge/status-Prototype-blue)
![Focus](https://img.shields.io/badge/focus-Disaster%20Response-red)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20FastAPI-green)
![OpenSource](https://img.shields.io/badge/open--source-Disaster%20Kit-orange)

**Open-source disaster response kit**  
Location Clues · Vulnerable-User Check-ins · Failure-Map Reporting · Local Data Layers

---

## Overview

**RescueMap OS** is an open-source disaster response support platform.

It helps citizens record location clues and status updates during disaster or isolation situations, while institutions can review requests, check vulnerable-user status, and generate post-disaster failure-map reports.

RescueMap OS does **not** replace emergency services.  
It is a prototype for disaster information sharing, local response support, and post-disaster improvement.

---

## Problem

During disasters, information is often fragmented:

- Citizens may not know how to explain their location.
- Vulnerable users may need check-in support.
- Institutions need a simple view of requests and risk clues.
- Local shelters and danger-zone data may be outdated or scattered.
- After the disaster, repeated failure points are often not documented well.

---

## Core Features

### Citizen Status Sharing

- Disaster type selection
- Vulnerable-user mode
- Location clue input
- Safe / Moving / Need Help status
- Offline-first flow concept

### Institution Dashboard

- Incident list
- Risk score reference
- Check-in status
- Failure-map candidate registration

### Map Layers

- Shelter layer
- Danger-zone layer
- Citizen location clue layer
- SAR flood reference mock layer
- Local data extension structure

### Open Source Disaster Kit

- Disaster protocols
- Vulnerable-user modes
- Local shelter data
- Danger-zone data
- Report templates

---

## System Flow

Citizen Status Report  
→ Location Clue  
→ Backend API  
→ Institution Dashboard  
→ Check-in Update  
→ Failure-Map Candidate  
→ Post-Disaster Report

---

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- CSS
- lucide-react

### Backend

- FastAPI
- SQLite
- JSON / CSV / GeoJSON
- Swagger API Docs

### Data

- Local shelter CSV
- Danger-zone GeoJSON
- Disaster protocol YAML
- Report Markdown

---

## Project Structure

- `frontend/` — React dashboard and citizen UI
- `backend/` — FastAPI backend and local data API
- `rescue-kit/` — Disaster protocols, local data, vulnerable modes, report templates
- `assets/` — Screenshots and visual materials
- `docs/` — Product, architecture, roadmap, ethics, validation, and technical notes

---

## Documentation

### Core

- [Project Overview](docs/00_Project_Overview.md)
- [Product Plan](docs/01_Product_Plan.md)
- [System Architecture](docs/02_System_Architecture.md)

### Open Source and Safety

- [Open Source Strategy](docs/03_OpenSource_Strategy.md)
- [Ethics and Safety](docs/04_Ethics_and_Safety.md)

### Technical

- [System Context](docs/06_SYSTEM_CONTEXT.md)
- [Data Flow](docs/07_DATA_FLOW.md)
- [SQLite Persistence](docs/11_SQLITE_PERSISTENCE.md)
- [Failure Map Report](docs/12_FAILURE_MAP_REPORT.md)
- [Map Layer System](docs/13_MAP_LAYER_SYSTEM.md)
- [Nationwide Data Model](docs/14_NATIONWIDE_DATA_MODEL.md)
- [Scenario Runner](docs/15_SCENARIO_RUNNER.md)

### Validation

- [Limitations](docs/08_LIMITATIONS.md)
- [Roadmap](docs/09_ROADMAP.md)
- [Validation Status](docs/10_VALIDATION_STATUS.md)

---

## Current Status

RescueMap OS is currently in prototype stage.

Implemented or partially implemented:

- Citizen status sharing screen
- Institution dashboard
- SAR and public-data risk layer concept
- Open-source disaster kit structure
- FastAPI mock backend
- SQLite persistence
- Failure-map report generation
- Local CSV / GeoJSON map layer structure
- Nationwide scenario runner concept

---

## Run Locally

### Frontend

Move to `frontend/`, install packages, and run the Vite development server.

Frontend URL: `http://localhost:5173`

### Backend

Move to `backend/`, install Python dependencies, and run the FastAPI server.

Backend URL: `http://127.0.0.1:8000`  
Swagger Docs: `http://127.0.0.1:8000/docs`

---

## Limitations

RescueMap OS does not provide:

- AI-based life-or-death decision making
- Indoor evacuation route guidance
- Medical diagnosis
- Rescue success guarantees
- Continuous location tracking
- Official emergency dispatch

This project should be understood as a disaster information support prototype.

---

## Author

**Lee Youngjun**  
Department of Computer Science, Paejae University  
GitHub: [@gxmzung](https://github.com/gxmzung)

---

## License

MIT License
