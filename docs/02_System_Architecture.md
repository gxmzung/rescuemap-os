# System Architecture

## 1. High-level Architecture

User App
→ Local Storage
→ Status Sharing API
→ Database
→ Admin Dashboard
→ Failure-map Report

## 2. Frontend

Recommended stack:

- React
- Vite
- TypeScript
- Leaflet or MapLibre GL

Main screens:

- Home
- Disaster Type Selection
- Vulnerable Mode Selection
- Status Sharing
- Location Clue Logging
- Shelter Map
- Offline Card

## 3. Backend

Recommended stack:

- FastAPI
- SQLite for MVP
- PostgreSQL/PostGIS for advanced geospatial features

Main API examples:

- POST /api/status
- GET /api/incidents
- GET /api/incidents/{id}
- POST /api/checkin
- GET /api/shelters
- GET /api/danger-zones
- POST /api/reports/failure-map

## 4. Data Types

Status Event:

- status
- disaster_type
- vulnerable_mode
- latitude
- longitude
- building_name
- floor
- zone
- room
- network_status
- battery_level
- created_at

Shelter:

- name
- type
- latitude
- longitude
- accessibility
- capacity
- address
- source

Danger Zone:

- name
- type
- risk_level
- geometry
- source

## 5. Offline-first Principle

Status events should be saved locally first.

If the network is available, the app sends the event to the server.

If the network is unavailable, the event remains in a sync queue until the connection is restored.
