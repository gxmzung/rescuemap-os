import { useEffect, useMemo, useState, type ReactNode } from "react";
import RescueMapView from "./components/RescueMapView";
import { createStatus, fetchIncidents, updateIncidentCheckin, generateFailureReport, type CheckinStatus } from "./api";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  CircleHelp,
  CloudRain,
  Database,
  FileText,
  Flame,
  Footprints,
  HeartPulse,
  Layers3,
  MapPin,
  Moon,
  Radio,
  Satellite,
  ShieldAlert,
  UserRoundCheck,
  Wifi,
  HardDrive,
  Send,
  Eye,
  CheckCheck,
  MapPinned,
} from "lucide-react";

type ViewType = "citizen" | "admin" | "layers" | "kit";
type StatusType = "safe" | "moving" | "help";

type Disaster = {
  id: string;
  label: string;
  desc: string;
  tone: string;
  icon: ReactNode;
};

type Mode = {
  id: string;
  label: string;
  desc: string;
  weight: number;
};

type Incident = {
  id: string;
  status: StatusType;
  disaster: string;
  mode: string;
  location: string;
  risk: number;
  checkin: CheckinStatus;
  time: string;
};

type FlowStep = {
  label: string;
  desc: string;
  done: boolean;
  icon: ReactNode;
};

const disasters: Disaster[] = [
  { id: "fire", label: "화재", desc: "연기·정전·실내 고립 위험", tone: "red", icon: <Flame size={22} /> },
  { id: "flood", label: "폭우/침수", desc: "하천·저지대·지하차도 위험", tone: "blue", icon: <CloudRain size={22} /> },
  { id: "collapse", label: "지진/붕괴", desc: "낙하물·출입구 차단 위험", tone: "stone", icon: <Building2 size={22} /> },
  { id: "night", label: "야간 귀가 위험", desc: "고립 동선·보호자 체크인", tone: "purple", icon: <Moon size={22} /> },
  { id: "infection", label: "감염병", desc: "격리·증상·기관 연결", tone: "green", icon: <HeartPulse size={22} /> },
];

const modes: Mode[] = [
  { id: "general", label: "일반 모드", desc: "기본 상태 공유", weight: 1 },
  { id: "elderly", label: "고령자 모드", desc: "큰 글씨·보호자 확인", weight: 1.18 },
  { id: "disabled", label: "장애인 이동지원", desc: "계단 회피·이동 도움", weight: 1.32 },
  { id: "isolated", label: "고립 청년 모드", desc: "무응답·비상 연락망", weight: 1.12 },
  { id: "night", label: "야간 귀가 모드", desc: "안전지점·보호자 체크인", weight: 1.16 },
];

const statusMeta: Record<
  StatusType,
  { label: string; desc: string; risk: number; icon: ReactNode; className: string }
> = {
  safe: {
    label: "안전함",
    desc: "현재 안전하거나 대피 완료",
    risk: 15,
    icon: <CheckCircle2 size={30} />,
    className: "safe",
  },
  moving: {
    label: "이동 중",
    desc: "대피소 또는 안전지점으로 이동 중",
    risk: 45,
    icon: <Footprints size={30} />,
    className: "moving",
  },
  help: {
    label: "도움 필요",
    desc: "고립, 이동 어려움, 위험 상황",
    risk: 85,
    icon: <CircleHelp size={30} />,
    className: "help",
  },
};

const baseIncidents: Incident[] = [
  {
    id: "RM-001",
    status: "help",
    disaster: "화재",
    mode: "장애인 이동지원",
    location: "배재대학교 P관 3층 서쪽 복도",
    risk: 92,
    checkin: "기관 확인 대기",
    time: "방금 전",
  },
  {
    id: "RM-002",
    status: "moving",
    disaster: "폭우/침수",
    mode: "고령자 모드",
    location: "정문 인근 저지대 보행로",
    risk: 68,
    checkin: "보호자 확인" as any,
    time: "3분 전",
  },
  {
    id: "RM-003",
    status: "help",
    disaster: "야간 귀가 위험",
    mode: "야간 귀가 모드",
    location: "후문 원룸가 골목",
    risk: 74,
    checkin: "미확인",
    time: "7분 전",
  },
];

const layerItems = [
  { id: "shelter", label: "대피소", desc: "학교·공공 대피소 위치", active: true },
  { id: "danger", label: "위험구역", desc: "하천·저지대·지하차도", active: true },
  { id: "user", label: "사용자 단서", desc: "상태 공유 위치 기록", active: true },
  { id: "sar", label: "SAR 침수 참고", desc: "Sentinel/SAR 기반 침수 추정 Mock", active: true },
  { id: "welfare", label: "복지시설", desc: "취약계층 지원 기관", active: false },
  { id: "emergency", label: "응급기관", desc: "병원·소방서·경찰서", active: false },
];

export default function App() {
  const [view, setView] = useState<ViewType>("citizen");
  const [selectedDisaster, setSelectedDisaster] = useState("fire");
  const [selectedMode, setSelectedMode] = useState("disabled");
  const [status, setStatus] = useState<StatusType>("help");
  const [incidents, setIncidents] = useState<Incident[]>(baseIncidents);
  const [layers, setLayers] = useState(layerItems);
  const [lastIncidentId, setLastIncidentId] = useState("RM-001");
  const [saved, setSaved] = useState(true);
  const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "connected" | "error">("idle");
  const [apiMessage, setApiMessage] = useState("Mock API 연결 전");
  const [reportMessage, setReportMessage] = useState("아직 생성된 실패지도 리포트가 없습니다.");

  const disaster = disasters.find((item) => item.id === selectedDisaster) ?? disasters[0];
  const mode = modes.find((item) => item.id === selectedMode) ?? modes[0];
  const selectedIncident = incidents.find((item) => item.id === lastIncidentId) ?? incidents[0];

  useEffect(() => {
    async function loadIncidents() {
      try {
        setApiStatus("loading");
        const items = await fetchIncidents();
        setIncidents(items);
        if (items[0]) setLastIncidentId(items[0].id);
        setApiStatus("connected");
        setApiMessage("FastAPI Mock Backend 연결 완료");
      } catch {
        setApiStatus("error");
        setApiMessage("백엔드 연결 실패 · 화면은 로컬 Mock 데이터로 동작 중");
      }
    }

    loadIncidents();
  }, []);

  const risk = useMemo(() => {
    return Math.min(100, Math.round(statusMeta[status].risk * mode.weight));
  }, [status, mode]);

  const helpCount = incidents.filter((item) => item.status === "help").length;
  const pendingCount = incidents.filter(
    (item) => item.checkin === "미확인" || item.checkin === "기관 확인 대기" || item.checkin === "기관 전송 대기"
  ).length;
  const failureCount = incidents.filter((item) => item.checkin === "실패지도 후보").length;
  const avgRisk = Math.round(
    incidents.reduce((sum, item) => sum + item.risk, 0) / incidents.length
  );

  const flowSteps: FlowStep[] = [
    { label: "상태 선택", desc: statusMeta[status].label, done: true, icon: <CircleHelp /> },
    { label: "위치 단서 저장", desc: "P관 3층 서쪽 복도", done: true, icon: <MapPin /> },
    { label: "로컬 저장", desc: saved ? "기록 생성 완료" : "대기 중", done: saved, icon: <HardDrive /> },
    { label: "기관 전송", desc: saved ? "대시보드 반영 가능" : "전송 전", done: saved, icon: <Send /> },
    { label: "기관 확인", desc: selectedIncident?.checkin ?? "대기", done: selectedIncident?.checkin === "기관 확인 완료" || selectedIncident?.checkin === "실패지도 후보", icon: <Eye /> },
  ];

  async function sendStatus() {
    try {
      setApiStatus("loading");

      const newIncident = await createStatus({
        status,
        disaster: disaster.label,
        mode: mode.label,
        location: "배재대학교 P관 3층 서쪽 복도",
        building: "P관",
        floor: "3층",
        zone: "서쪽 복도",
        risk,
      });

      setIncidents([newIncident, ...incidents]);
      setLastIncidentId(newIncident.id);
      setSaved(true);
      setApiStatus("connected");
      setApiMessage(`${newIncident.id} 기록이 FastAPI Mock Backend에 생성되었습니다`);
      setView("admin");
    } catch {
      const fallbackIncident: Incident = {
        id: `RM-${String(incidents.length + 1).padStart(3, "0")}`,
        status,
        disaster: disaster.label,
        mode: mode.label,
        location: "배재대학교 P관 3층 서쪽 복도",
        risk,
        checkin: "기관 확인 대기",
        time: "방금 전",
      };

      setIncidents([fallbackIncident, ...incidents]);
      setLastIncidentId(fallbackIncident.id);
      setSaved(true);
      setApiStatus("error");
      setApiMessage("API 연결 실패 · 로컬 Mock 데이터로 기록되었습니다");
      setView("admin");
    }
  }

  async function updateIncident(next: Incident["checkin"]) {
    try {
      const updated = await updateIncidentCheckin(selectedIncident.id, next);
      setIncidents((prev) =>
        prev.map((item) => item.id === updated.id ? updated : item)
      );
      setApiStatus("connected");
      setApiMessage(`${updated.id} 체크인 상태가 '${updated.checkin}'으로 변경되었습니다`);
    } catch {
      setIncidents((prev) =>
        prev.map((item) => item.id === selectedIncident.id ? { ...item, checkin: next } : item)
      );
      setApiStatus("error");
      setApiMessage("API 연결 실패 · 화면에서만 체크인 상태를 변경했습니다");
    }
  }

  async function handleGenerateReport() {
    try {
      const result = await generateFailureReport();
      setReportMessage(`${result.filename} 생성 완료 · 후보 ${result.candidate_count}건`);
      setApiStatus("connected");
      setApiMessage("실패지도 리포트가 backend/reports 폴더에 생성되었습니다");
    } catch {
      setReportMessage("실패지도 리포트 생성 실패 · 백엔드 연결을 확인하세요");
      setApiStatus("error");
      setApiMessage("실패지도 리포트 생성 API 호출 실패");
    }
  }

  function toggleLayer(id: string) {
    setLayers((prev) =>
      prev.map((item) => item.id === id ? { ...item, active: !item.active } : item)
    );
  }

  return (
    <main className={`app ${view === "admin" || view === "layers" ? "dark" : "light"}`}>
      <header className="topbar">
        <div className="brand">
          <div className="brandIcon"><ShieldAlert size={24} /></div>
          <div>
            <strong>RescueMap OS</strong>
            <span>재난 대응 오픈소스 키트</span>
          </div>
        </div>

        <nav className="tabs">
          <button className={view === "citizen" ? "active" : ""} onClick={() => setView("citizen")}>시민용</button>
          <button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>기관 대시보드</button>
          <button className={view === "layers" ? "active" : ""} onClick={() => setView("layers")}>SAR·위험 레이어</button>
          <button className={view === "kit" ? "active" : ""} onClick={() => setView("kit")}>오픈소스 키트</button>
        </nav>
      </header>

      <div className={`apiBanner ${apiStatus}`}>
        <strong>API 상태</strong>
        <span>{apiMessage}</span>
      </div>

      {view === "citizen" && (
        <section className="page citizen">
          <section className="hero citizenHero">
            <div>
              <div className="badge warm"><MapPin size={18} />위치 정보는 상태 공유 시에만 기록됩니다</div>
              <h1>재난 상황에서 빠르게 상태를 남기세요</h1>
              <p>복잡한 신고 양식 대신 재난 유형, 취약 모드, 위치 단서, 현재 상태를 최소 입력으로 남깁니다.</p>
            </div>

            <div className="locationBox">
              <div className="boxHead"><strong>위치 단서 입력</strong><span>선택 입력</span></div>
              <div className="inputGrid">
                <input placeholder="건물 예) P관" defaultValue="P관" />
                <input placeholder="층 예) 3층" defaultValue="3층" />
                <input placeholder="호실/구역" defaultValue="서쪽 복도" />
                <input placeholder="주변 단서" defaultValue="엘리베이터 근처" />
              </div>
              <div className="chips">
                <span>엘리베이터 없음</span>
                <span>연기 냄새</span>
                <span>전기 문제</span>
                <span>직접 입력</span>
              </div>
            </div>
          </section>

          <section className="flowPanel panel">
            <div className="flowHead">
              <div>
                <h2>작동 흐름</h2>
                <p>사용자가 상태를 남기면 기록은 먼저 로컬에 저장되고, 네트워크가 가능할 때 기관 대시보드로 전송됩니다.</p>
              </div>
              <div className="syncPill"><Wifi size={16} />오프라인 우선 저장</div>
            </div>
            <div className="flowSteps">
              {flowSteps.map((step, index) => (
                <div key={step.label} className={`flowStep ${step.done ? "done" : ""}`}>
                  <div className="flowIcon">{step.icon}</div>
                  <strong>{index + 1}. {step.label}</strong>
                  <span>{step.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="split">
            <div className="panel">
              <h2>1. 재난 유형</h2>
              <div className="choiceGrid">
                {disasters.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDisaster(item.id)}
                    className={`choice tone-${item.tone} ${selectedDisaster === item.id ? "selected" : ""}`}
                  >
                    <div>{item.icon}</div>
                    <strong>{item.label}</strong>
                    <p>{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel">
              <h2>2. 취약계층 모드</h2>
              <div className="modeList">
                {modes.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMode(item.id)}
                    className={`mode ${selectedMode === item.id ? "selected" : ""}`}
                  >
                    <UserRoundCheck size={20} />
                    <div>
                      <strong>{item.label}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>3. 상태 공유</h2>
            <p className="sectionDesc">아래 세 가지 중 하나만 선택해도 구조 단서가 생성됩니다.</p>
            <div className="statusGrid">
              {(Object.keys(statusMeta) as StatusType[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setStatus(key);
                    setSaved(true);
                  }}
                  className={`status ${statusMeta[key].className} ${status === key ? "selected" : ""}`}
                >
                  {statusMeta[key].icon}
                  <strong>{statusMeta[key].label}</strong>
                  <span>{statusMeta[key].desc}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="split resultSplit">
            <div className="panel recordPanel">
              <h2>상태 기록 미리보기</h2>
              <div className="successNotice">
                <CheckCircle2 size={20} />
                {statusMeta[status].label} 기록이 생성되었습니다. 로컬 저장 후 기관 대시보드로 전송할 수 있습니다.
              </div>
              <div className="recordRows">
                <p><strong>상태</strong><span>{statusMeta[status].label}</span></p>
                <p><strong>재난 유형</strong><span>{disaster.label}</span></p>
                <p><strong>취약 모드</strong><span>{mode.label}</span></p>
                <p><strong>위치 단서</strong><span>배재대학교 P관 3층 서쪽 복도</span></p>
                <p><strong>위험 점수</strong><span>{risk}점 · 참고용</span></p>
                <p><strong>동기화</strong><span>로컬 저장 후 네트워크 복구 시 전송</span></p>
              </div>
              <button className="primary" onClick={sendStatus}>기관 대시보드로 기록 보내기</button>
            </div>

            <div className="panel shelterPanel">
              <h2>근처 대피소 / 행동카드</h2>
              <RescueMapView variant="citizen" />
              <p>대피소와 위험구역은 지역 데이터 파일을 기반으로 표시됩니다.</p>
            </div>
          </section>
        </section>
      )}

      {view === "admin" && (
        <section className="page admin">
          <div className="adminHero">
            <div>
              <div className="badge blue"><Radio size={18} />Institution Control Dashboard</div>
              <h1>실시간 재난 대응 현황</h1>
              <p>시민이 남긴 기록은 기관 화면에서 위치·위험도·체크인 상태로 이어집니다.</p>
            </div>
          </div>

          <div className="stats">
            <div className="stat danger"><AlertTriangle /><span>도움 필요</span><strong>{helpCount}건</strong></div>
            <div className="stat warning"><Radio /><span>미확인/기관 대기</span><strong>{pendingCount}건</strong></div>
            <div className="stat info"><ShieldAlert /><span>평균 위험 점수</span><strong>{avgRisk}점</strong></div>
            <div className="stat green"><FileText /><span>실패지도 후보</span><strong>{failureCount}건</strong></div>
          </div>

          <section className="adminLayout">
            <div className="darkPanel">
              <h2>도움 요청 목록</h2>
              <div className="incidentList">
                {incidents.map((item) => (
                  <article
                    key={item.id}
                    className={`incident ${selectedIncident.id === item.id ? "active" : ""}`}
                    onClick={() => setLastIncidentId(item.id)}
                  >
                    <div className="incidentTop"><strong>{item.id}</strong><span>{item.time}</span></div>
                    <p>{item.location}</p>
                    <div className="tags">
                      <span>{statusMeta[item.status].label}</span>
                      <span>{item.disaster}</span>
                      <span>{item.mode}</span>
                      <span>{item.checkin}</span>
                    </div>
                    <div className="riskBar"><span style={{ width: `${item.risk}%` }} /></div>
                    <small>위험 점수 {item.risk}점 · 참고용 우선순위</small>
                  </article>
                ))}
              </div>
            </div>

            <div className="darkPanel mapPanel">
              <div className="mapHeader">
                <h2>현장 지도</h2>
                <button onClick={() => setView("layers")}>SAR 레이어 보기</button>
              </div>
              <RescueMapView variant="admin" />
              <div className="mapLegend">
                <span>SAR 침수 참고</span>
                <span>위험 구역</span>
                <span>대피소</span>
                <span>사용자 단서</span>
              </div>
            </div>

            <div className="darkPanel detailPanel">
              <h2>선택 신고 상세</h2>
              <div className="detailCard">
                <strong>{selectedIncident.id}</strong>
                <p>{selectedIncident.mode} · {selectedIncident.disaster} · {statusMeta[selectedIncident.status].label}</p>
                <p>위치 단서: {selectedIncident.location}</p>
                <p>현재 단계: {selectedIncident.checkin}</p>
                <p>위험 점수: {selectedIncident.risk}점 · 참고용</p>

                <div className="actionButtons">
                  <button onClick={() => updateIncident("기관 확인 대기")}><Eye size={16} />기관 확인 대기</button>
                  <button onClick={() => updateIncident("기관 확인 완료")}><CheckCheck size={16} />기관 확인 완료</button>
                  <button onClick={() => updateIncident("실패지도 후보")}><MapPinned size={16} />실패지도 후보 등록</button>
                </div>
              </div>

              <div className="processBox">
                <strong>처리 흐름</strong>
                <span>시민 기록 → 기관 확인 → 현장 참고 → 익명화 → 실패지도 리포트</span>
              </div>

              <div className="reportBox">
                <strong>재난 후 실패지도 리포트</strong>
                <span>{reportMessage}</span>
                <button onClick={handleGenerateReport}>실패지도 리포트 생성</button>
              </div>
            </div>
          </section>
        </section>
      )}

      {view === "layers" && (
        <section className="page layersPage">
          <div className="adminHero">
            <div>
              <div className="badge blue"><Satellite size={18} />SAR & Public Data Risk Layers</div>
              <h1>SAR·공공데이터 위험 레이어</h1>
              <p>SAR는 사람 추적이나 실시간 탈출 지시가 아니라, 침수 가능 영역을 이해하기 위한 참고 레이어입니다.</p>
            </div>
          </div>

          <section className="layerLayout">
            <div className="darkPanel">
              <h2>데이터 레이어</h2>
              <div className="layerList">
                {layers.map((item) => (
                  <button
                    key={item.id}
                    className={item.active ? "on" : ""}
                    onClick={() => toggleLayer(item.id)}
                  >
                    <Layers3 size={18} />
                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.desc}</span>
                    </div>
                    <em>{item.active ? "ON" : "OFF"}</em>
                  </button>
                ))}
              </div>
            </div>

            <div className="darkPanel layerMapPanel">
              <h2>위험 레이어 지도</h2>
              <RescueMapView variant="layers" layers={layers} />
              <div className="notice">
                사용자 위치 단서가 SAR 침수 참고 영역 또는 위험구역과 겹치면 관리자 화면에서 우선 확인 대상으로 표시됩니다.
              </div>
            </div>

            <div className="darkPanel">
              <h2>데이터 사용 원칙</h2>
              <div className="sourceRows">
                <p><strong>SAR</strong><span>침수 가능 영역 참고용 Mock Layer</span></p>
                <p><strong>공공데이터</strong><span>대피소·위험구역·응급기관</span></p>
                <p><strong>사용자 단서</strong><span>상태 공유 시에만 기록</span></p>
                <p><strong>주의</strong><span>구조 명령 또는 자동 판단에 사용하지 않음</span></p>
              </div>
            </div>
          </section>
        </section>
      )}

      {view === "kit" && (
        <section className="page kitPage">
          <section className="hero kitHero">
            <div>
              <div className="badge warm"><Database size={18} />Editable Open-source Kit</div>
              <h1>지역이 직접 수정하는 재난 대응 키트</h1>
              <p>지역·학교·복지기관이 재난 프로토콜, 취약계층 모드, 대피소 데이터, 위험구역 데이터를 직접 수정할 수 있습니다.</p>
            </div>
          </section>

          <div className="kitCards">
            <div className="kitCard"><strong>disaster_protocols</strong><span>재난 행동카드 YAML</span></div>
            <div className="kitCard"><strong>vulnerable_modes</strong><span>취약계층 모드 YAML</span></div>
            <div className="kitCard"><strong>local_data</strong><span>대피소 CSV / 위험구역 GeoJSON</span></div>
            <div className="kitCard"><strong>report_templates</strong><span>실패지도 Markdown</span></div>
          </div>

          <pre className="tree">{`rescue-kit/
├── disaster_protocols/
│   ├── fire.yml
│   ├── flood.yml
│   └── earthquake.yml
├── vulnerable_modes/
│   ├── elderly.yml
│   └── disabled.yml
├── local_data/
│   ├── shelters.csv
│   └── danger_zones.geojson
└── report_templates/
    └── failure_report.md`}</pre>
        </section>
      )}
    </main>
  );
}
