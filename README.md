# RescueMap OS  
# 레스큐맵 OS

**Open-source disaster response kit for location clues, vulnerable-user check-ins, and post-disaster failure-map reporting.**  
**재난 상황에서 위치 단서, 취약계층 체크인, 재난 후 실패 지도 생성을 돕는 오픈소스 재난 대응 키트입니다.**

---

## 1. Project Overview  
## 1. 프로젝트 개요

RescueMap OS is an open-source disaster response platform designed to help citizens, vulnerable users, guardians, schools, welfare centers, and local institutions record location clues, share emergency status, and generate post-disaster failure maps.

RescueMap OS는 시민, 취약계층, 보호자, 학교, 복지기관, 지역 기관이 재난 상황에서 위치 단서와 상태를 기록하고, 재난 이후에는 실패 지도를 생성할 수 있도록 돕는 오픈소스 재난 대응 플랫폼입니다.

This project does **not** make life-critical decisions on behalf of users.  
It does **not** provide AI-based indoor escape routing.

본 프로젝트는 사용자의 생명 판단을 자동화하지 않습니다.  
또한 AI 기반 실내 탈출 경로 안내를 제공하지 않습니다.

Instead, RescueMap OS focuses on a safer and more realistic disaster-response principle:

대신 RescueMap OS는 더 안전하고 현실적인 재난 대응 원칙에 집중합니다.

1. **Before disaster:** build evacuation memory  
   **재난 전:** 대피 기억을 만든다.

2. **During disaster:** leave location and status clues  
   **재난 중:** 위치와 상태 단서를 남긴다.

3. **After disaster:** generate failure maps for future improvement  
   **재난 후:** 실패 지도를 만들어 다음 대응을 개선한다.

---

## 2. Why This Project Matters  
## 2. 개발 배경

In real disaster situations, people may not be able to calmly search information or operate complex applications.  
Indoor GPS can be inaccurate, networks may fail, and vulnerable users may need different support flows.

실제 재난 상황에서는 사용자가 침착하게 정보를 검색하거나 복잡한 앱을 조작하기 어렵습니다.  
실내 GPS는 부정확할 수 있고, 통신망은 불안정할 수 있으며, 취약계층은 일반 사용자와 다른 지원 흐름이 필요할 수 있습니다.

Many disaster applications focus on alerts, shelters, and basic safety guides.  
However, actual disaster response also requires location clues, check-in flows, vulnerable-user support, institutional confirmation, and post-disaster analysis.

기존 재난 서비스는 재난 알림, 대피소 안내, 행동요령 제공에 집중하는 경우가 많습니다.  
하지만 실제 대응 과정에서는 위치 단서, 체크인 흐름, 취약계층 지원, 기관 확인, 재난 이후 분석까지 연결되는 구조가 필요합니다.

RescueMap OS was designed to fill this gap as an open-source kit that can be customized by local communities, schools, welfare centers, and public institutions.

RescueMap OS는 이러한 문제를 해결하기 위해 지역, 학교, 복지기관, 공공기관이 직접 수정해 사용할 수 있는 오픈소스 재난 대응 키트로 설계되었습니다.

---

## 3. Key Features  
## 3. 주요 기능

### 3.1 Three-Button Status Sharing  
### 3.1 3버튼 상태 공유

Users can quickly share one of three emergency states:

사용자는 위기 상황에서 세 가지 상태 중 하나를 빠르게 공유할 수 있습니다.

- Safe / 안전함
- Moving / 이동 중
- Need Help / 도움 필요

The system records the selected status together with time, disaster type, vulnerable mode, and location clues.

시스템은 선택된 상태와 함께 시간, 재난 유형, 취약 모드, 위치 단서를 함께 기록합니다.

---

### 3.2 Indoor Isolation Clue Logging  
### 3.2 실내 고립 위치 단서 기록

Instead of giving risky AI-based indoor escape directions, the system records clues that may help guardians, institutions, or responders understand the user's last known situation.

RescueMap OS는 위험할 수 있는 AI 기반 실내 탈출 안내를 제공하지 않고, 보호자·기관·구조자가 사용자의 마지막 상황을 이해하는 데 도움이 되는 단서를 기록합니다.

Possible clues include:

기록 가능한 위치 단서는 다음과 같습니다.

- Building name / 건물명
- Floor / 층수
- Room or zone / 호실 또는 구역
- Last GPS location / 마지막 GPS 위치
- QR/NFC location tag / QR 또는 NFC 위치 태그
- Wi-Fi/BLE proximity clue / Wi-Fi 또는 BLE 근접 단서

---

### 3.3 Vulnerable-User Modes  
### 3.3 취약계층 맞춤 모드

Disaster risk is not the same for everyone.  
RescueMap OS provides optional vulnerable-user modes so that users can receive support flows that better match their situation.

재난 위험은 모든 사람에게 동일하지 않습니다.  
RescueMap OS는 사용자의 상황에 맞는 지원 흐름을 제공하기 위해 선택형 취약 모드를 제공합니다.

Current sample modes include:

현재 샘플 모드는 다음과 같습니다.

- Elderly mode / 노인 모드
- Disabled mobility-support mode / 장애인 이동지원 모드
- Isolated youth mode / 고립 청년 모드
- Night-return mode / 야간 귀가 모드
- Infection-sensitive mode / 감염병 취약 모드

These modes are not labels for discrimination.  
They exist to provide different support options for different needs.

이 모드는 사용자를 낙인찍기 위한 분류가 아닙니다.  
상황별로 필요한 도움을 다르게 제공하기 위한 선택형 지원 구조입니다.

---

### 3.4 Guardian and Institution Check-in Chain  
### 3.4 보호자·기관 체크인 체인

Emergency status sharing should not end with a single message.  
RescueMap OS is designed to connect the user, guardian, welfare worker, school or institution manager, and response organization through a check-in flow.

도움 요청은 단순히 한 번 전송되는 것으로 끝나서는 안 됩니다.  
RescueMap OS는 사용자, 보호자, 복지 담당자, 학교·기관 관리자, 대응 기관을 체크인 흐름으로 연결하도록 설계되었습니다.

This makes it easier to see:

이를 통해 다음 사항을 확인할 수 있습니다.

- Who has checked the request / 누가 요청을 확인했는지
- Which users are still unconfirmed / 아직 확인되지 않은 사용자는 누구인지
- Which cases may require institutional response / 기관 대응이 필요한 상황은 무엇인지

---

### 3.5 Open Disaster Response Kit  
### 3.5 오픈소스 재난 대응 키트

RescueMap OS is not only an application.  
It is also an editable open-source disaster response kit.

RescueMap OS는 단순한 앱이 아닙니다.  
지역과 기관이 직접 수정할 수 있는 오픈소스 재난 대응 키트입니다.

The kit includes:

키트는 다음과 같은 데이터 구조를 포함합니다.

```text
rescue-kit/
├── disaster_protocols/
├── vulnerable_modes/
├── local_data/
└── report_templates/
Disaster protocols: YAML
재난 행동 프로토콜: YAML
Vulnerable-user modes: YAML
취약계층 모드: YAML
Shelter data: CSV
대피소 데이터: CSV
Danger zones: GeoJSON
위험구역 데이터: GeoJSON
Failure reports: Markdown
실패 지도 리포트: Markdown
3.6 Public Data and Risk Layers
3.6 공공데이터 및 위험 레이어

The project can be extended with public geospatial data and disaster-risk layers.

본 프로젝트는 공공 공간정보와 재난 위험 레이어를 활용하도록 확장할 수 있습니다.

Possible data layers include:

활용 가능한 데이터 레이어는 다음과 같습니다.

Shelter locations / 대피소 위치
Rivers and lowlands / 하천 및 저지대
Underground roads and underpasses / 지하차도 및 지하공간
Hospitals, fire stations, and police stations / 병원, 소방서, 경찰서
Welfare facilities / 복지시설
OpenStreetMap road data / OpenStreetMap 도로 데이터
Future Sentinel/SAR-based flood reference layers / 향후 Sentinel/SAR 기반 침수 참고 레이어
3.7 Post-Disaster Failure Map
3.7 재난 후 실패 지도

After a disaster, anonymized records can be converted into a failure-map report.

재난 이후에는 익명화된 기록을 실패 지도 리포트로 전환할 수 있습니다.

The report may include:

리포트에는 다음 내용이 포함될 수 있습니다.

Repeated isolation points / 반복 고립 지점
Delayed check-in areas / 체크인 지연 지역
Shelter accessibility issues / 대피소 접근성 문제
Network failure cases / 통신 장애 사례
Vulnerable-user support gaps / 취약계층 지원 공백

This helps communities and institutions improve their future disaster-response plans.

이를 통해 지역사회와 기관은 다음 재난 대응 체계를 개선할 수 있습니다.

4. Current MVP Status
4. 현재 MVP 상태

The current frontend MVP includes:

현재 프론트엔드 MVP는 다음 기능을 포함합니다.

Disaster type selection / 재난 유형 선택
Vulnerable-user mode selection / 취약 모드 선택
Three-button status sharing / 3버튼 상태 공유
Location clue preview / 위치 단서 미리보기
Ethics and safety principles / 윤리적 설계 원칙 표시

This MVP intentionally excludes AI-based indoor escape routing and automated life-critical decision making.

현재 MVP는 의도적으로 AI 기반 실내 탈출 경로 안내와 자동 생명 판단 기능을 제외했습니다.

5. Running the Frontend MVP
5. 프론트엔드 MVP 실행 방법
cd frontend
npm install
npm run dev

Local development URL:

로컬 개발 주소:

http://localhost:5173/
6. Tech Stack
6. 기술 스택
Frontend: React, Vite, TypeScript
Backend: FastAPI
Database: SQLite or PostgreSQL/PostGIS
Map: Leaflet or MapLibre GL
Data: YAML, CSV, GeoJSON, JSON
Collaboration: GitHub, Issues, Pull Requests, Markdown Docs
7. What This Project Does Not Do
7. 본 프로젝트가 하지 않는 것
No AI-based life-or-death decision making
AI 기반 생명 판단을 하지 않습니다.
No automatic indoor escape routing
자동 실내 탈출 경로 안내를 하지 않습니다.
No medical diagnosis
의료 진단을 하지 않습니다.
No rescue success guarantee
구조 성공을 보장하지 않습니다.
No always-on location tracking
위치를 상시 추적하지 않습니다.
8. Ethics and Safety
8. 윤리 및 안전 원칙

In a real disaster, building layouts may change quickly.
Stairs may be blocked, smoke may spread, power may fail, and indoor maps may become outdated.

실제 재난 상황에서는 건물 구조가 빠르게 변할 수 있습니다.
계단이 막히거나, 연기가 퍼지거나, 전기가 끊기거나, 실내 지도가 더 이상 실제 상황과 맞지 않을 수 있습니다.

For that reason, RescueMap OS does not tell users which indoor route to take.
Instead, it helps users leave useful clues so that people can find and support them.

따라서 RescueMap OS는 사용자에게 실내 이동 경로를 직접 지시하지 않습니다.
대신 사람이 사람을 더 빨리 찾고 지원할 수 있도록 위치와 상태 단서를 남기는 데 집중합니다.

9. License
9. 라이선스

MIT License

10. Author
10. 제작자

Lee Youngjun
Paejae University, Department of Computer Science
GitHub: @gxmzung
