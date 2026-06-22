# RescueMap OS

**RescueMap OS** is an open-source disaster response kit designed to help citizens, vulnerable users, guardians, schools, welfare centers, and local institutions record location clues, share status, and generate post-disaster failure maps.

## Core Concept

RescueMap OS does **not** make life-critical decisions on behalf of users.  
It does **not** provide AI-based indoor escape routing.

Instead, it focuses on three principles:

1. **Before disaster**: build evacuation memory  
2. **During disaster**: leave location and status clues  
3. **After disaster**: generate failure maps for future improvement  

## Why This Project Matters

In real disaster situations, users may not be able to calmly search information or operate complex apps.  
Indoor GPS can be inaccurate, networks may fail, and vulnerable users may require different support flows.

RescueMap OS provides a simple structure:

- 3-button status sharing
- building/floor/zone-based location clues
- vulnerable-user modes
- guardian/institution check-in chain
- public map and risk layers
- post-disaster failure-map reporting
- editable open-source disaster response data kit

## Key Features

### 1. Three-Button Status Sharing

Users can quickly choose one of three states:

- Safe
- Moving
- Need Help

### 2. Indoor Isolation Clue Logging

Instead of giving risky AI-based indoor directions, the system records clues such as:

- building name
- floor
- room
- zone
- last GPS
- QR/NFC location tag
- Wi-Fi/BLE proximity clue

### 3. Vulnerable User Modes

Optional modes include:

- elderly mode
- disabled mode
- isolated youth mode
- night-return mode
- infection-sensitive mode

### 4. Open Disaster Protocol Kit

Disaster protocols are managed as editable YAML files.

```text
rescue-kit/
├── disaster_protocols/
├── vulnerable_modes/
├── local_data/
└── report_templates/
cat > README.md <<'EOF'
# RescueMap OS

**RescueMap OS** is an open-source disaster response kit designed to help citizens, vulnerable users, guardians, schools, welfare centers, and local institutions record location clues, share status, and generate post-disaster failure maps.

## Core Concept

RescueMap OS does **not** make life-critical decisions on behalf of users.  
It does **not** provide AI-based indoor escape routing.

Instead, it focuses on three principles:

1. **Before disaster**: build evacuation memory  
2. **During disaster**: leave location and status clues  
3. **After disaster**: generate failure maps for future improvement  

## Why This Project Matters

In real disaster situations, users may not be able to calmly search information or operate complex apps.  
Indoor GPS can be inaccurate, networks may fail, and vulnerable users may require different support flows.

RescueMap OS provides a simple structure:

- 3-button status sharing
- building/floor/zone-based location clues
- vulnerable-user modes
- guardian/institution check-in chain
- public map and risk layers
- post-disaster failure-map reporting
- editable open-source disaster response data kit

## Key Features

### 1. Three-Button Status Sharing

Users can quickly choose one of three states:

- Safe
- Moving
- Need Help

### 2. Indoor Isolation Clue Logging

Instead of giving risky AI-based indoor directions, the system records clues such as:

- building name
- floor
- room
- zone
- last GPS
- QR/NFC location tag
- Wi-Fi/BLE proximity clue

### 3. Vulnerable User Modes

Optional modes include:

- elderly mode
- disabled mode
- isolated youth mode
- night-return mode
- infection-sensitive mode

### 4. Open Disaster Protocol Kit

Disaster protocols are managed as editable YAML files.

```text
rescue-kit/
├── disaster_protocols/
├── vulnerable_modes/
├── local_data/
└── report_templates/

---

## .gitignore

```bash
cat > .gitignore <<'EOF'
# OS
.DS_Store
Thumbs.db

# Node
node_modules/
dist/
.env
.env.local

# Python
__pycache__/
*.pyc
.venv/
venv/

# Database
*.db
*.sqlite
*.sqlite3

# Logs
logs/
*.log

# Build
build/

## Running the Frontend MVP

```bash
cd frontend
npm install
npm run dev
Local development URL:

http://localhost:5173/
Current MVP Status

The current frontend MVP includes:

disaster type selection
vulnerable-user mode selection
three-button status sharing
location clue preview
ethics and safety principles

This MVP intentionally excludes AI-based indoor escape routing and automated life-critical decision making.
