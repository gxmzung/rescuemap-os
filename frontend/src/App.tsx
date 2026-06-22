import { useMemo, useState, type ReactNode } from "react";
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
  Map,
  MapPin,
  Moon,
  Radio,
  Satellite,
  ShieldAlert,
  UserRoundCheck,
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
  checkin: "미확인" | "보호자 확인" | "기관 확인 대기" | "기관 확인 완료";
  time: string;
};

const disasters: Disaster[] = [
  {
    id: "fire",
    label: "화재",
    desc: "연기·정전·실내 고립 위험",
    tone: "red",
    icon: <Flame size={22} />,
  },
  {
    id: "flood",
    label: "폭우/침수",
    desc: "하천·저지대·지하차도 위험",
    tone: "blue",
    icon: <CloudRain size={22} />,
  },
  {
    id: "collapse",
    label: "지진/붕괴",
    desc: "낙하물·출입구 차단 위험",
    tone: "stone",
    icon: <Building2 size={22} />,
  },
  {
    id: "night",
    label: "야간 귀가 위험",
    desc: "고립 동선·보호자 체크인",
    tone: "purple",
    icon: <Moon size={22} />,
  },
  {
    id: "infection",
    label: "감염병",
    desc: "격리·증상·기관 연결",
    tone: "green",
    icon: <HeartPulse size={22} />,
  },
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
    checkin: "보호자 확인",
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

  const disaster = disasters.find((item) => item.id === selectedDisaster) ?? disasters[0];
  const mode = modes.find((item) => item.id === selectedMode) ?? modes[0];

  const risk = useMemo(() => {
    return Math.min(100, Math.round(statusMeta[status].risk * mode.weight));
  }, [status, mode]);

  const helpCount = incidents.filter((item) => item.status === "help").length;
  const pendingCount = incidents.filter(
    (item) => item.checkin === "미확인" || item.checkin === "기관 확인 대기"
  ).length;
  const avgRisk = Math.round(
    incidents.reduce((sum, item) => sum + item.risk, 0) / incidents.length
  );

  function sendStatus() {
    const newIncident: Incident = {
      id: `RM-${String(incidents.length + 1).padStart(3, "0")}`,
      status,
      disaster: disaster.label,
      mode: mode.label,
      location: "배재대학교 P관 3층 서쪽 복도",
      risk,
      checkin: status === "help" ? "기관 확인 대기" : "보호자 확인",
      time: "방금 전",
    };

    setIncidents([newIncident, ...incidents]);
    setView("admin");
  }

  function toggleLayer(id: string) {
    setLayers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  }

  return (
    <main className={`app ${view === "admin" || view === "layers" ? "dark" : "light"}`}>
      <header className="topbar">
        <div className="brand">
          <div className="brandIcon">
            <ShieldAlert size={24} />
          </div>
          <div>
            <strong>RescueMap OS</strong>
            <span>재난 대응 오픈소스 키트</span>
          </div>
        </div>

        <nav className="tabs">
          <button className={view === "citizen" ? "active" : ""} onClick={() => setView("citizen")}>
            시민용
          </button>
          <button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>
            기관 대시보드
          </button>
          <button className={view === "layers" ? "active" : ""} onClick={() => setView("layers")}>
            SAR·위험 레이어
          </button>
          <button className={view === "kit" ? "active" : ""} onClick={() => setView("kit")}>
            오픈소스 키트
          </button>
        </nav>
      </header>

      {view === "citizen" && (
        <section className="page citizen">
          <section className="hero citizenHero">
            <div>
              <div className="badge warm">
                <MapPin size={18} />
                위치 정보는 상태 공유 시에만 기록됩니다
              </div>
              <h1>재난 상황에서 빠르게 상태를 남기세요</h1>
              <p>
                복잡한 신고 양식 대신 재난 유형, 취약 모드, 위치 단서, 현재 상태를 최소 입력으로 남깁니다.
              </p>
            </div>

            <div className="locationBox">
              <div className="boxHead">
                <strong>위치 단서 입력</strong>
                <span>선택 입력</span>
              </div>
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
            <p className="sectionDesc">
              위기 상황에서는 아래 세 가지 중 하나만 선택해도 구조 단서가 남습니다.
            </p>
            <div className="statusGrid">
              {(Object.keys(statusMeta) as StatusType[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setStatus(key)}
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
              <h2>근처 대피소</h2>
              <div className="miniMap lightMap">
                <span className="pin shelter">대피소</span>
                <span className="pin danger">화재</span>
                <span className="pin user">내 위치</span>
              </div>
              <p>지도 정보는 예시이며, 실제 서비스에서는 공공데이터와 지역 설정 파일을 연결합니다.</p>
            </div>
          </section>
        </section>
      )}

      {view === "admin" && (
        <section className="page admin">
          <div className="adminHero">
            <div>
              <div className="badge blue">
                <Radio size={18} />
                Institution Control Dashboard
              </div>
              <h1>실시간 재난 대응 현황</h1>
              <p>도움 요청, 미확인 사용자, 위험 점수, 체크인 상태를 지도와 함께 확인합니다.</p>
            </div>
          </div>

          <div className="stats">
            <div className="stat danger"><AlertTriangle /><span>도움 필요</span><strong>{helpCount}건</strong></div>
            <div className="stat warning"><Radio /><span>미확인/기관 대기</span><strong>{pendingCount}건</strong></div>
            <div className="stat info"><ShieldAlert /><span>평균 위험 점수</span><strong>{avgRisk}점</strong></div>
            <div className="stat green"><FileText /><span>실패지도 후보</span><strong>3구역</strong></div>
          </div>

          <section className="adminLayout">
            <div className="darkPanel">
              <h2>도움 요청 목록</h2>
              <div className="incidentList">
                {incidents.map((item) => (
                  <article key={item.id} className="incident">
                    <div className="incidentTop">
                      <strong>{item.id}</strong>
                      <span>{item.time}</span>
                    </div>
                    <p>{item.location}</p>
                    <div className="tags">
                      <span>{statusMeta[item.status].label}</span>
                      <span>{item.disaster}</span>
                      <span>{item.mode}</span>
                      <span>{item.checkin}</span>
                    </div>
                    <div className="riskBar"><span style={{ width: `${item.risk}%` }} /></div>
                    <small>위험 점수 {item.risk}점 · 사람 확인을 위한 참고용 우선순위</small>
                  </article>
                ))}
              </div>
            </div>

            <div className="darkPanel mapPanel">
              <div className="mapHeader">
                <h2>현장 지도</h2>
                <button onClick={() => setView("layers")}>레이어 상세</button>
              </div>
              <div className="bigMap">
                <span className="mapBlob sar">SAR 침수 참고</span>
                <span className="mapBlob fire">화재 발생</span>
                <span className="mapBlob shelter">대피소</span>
                <span className="mapBlob user">사용자 단서</span>
              </div>
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
                <strong>RM-001</strong>
                <p>장애인 이동지원 모드 · 화재 · 도움 필요</p>
                <p>위치 단서: P관 3층 서쪽 복도</p>
                <p>체크인: 기관 확인 대기</p>
                <button>기관 확인 완료 처리</button>
              </div>
              <div className="ethicsBox">
                위험 점수는 구조 명령이 아니라 사람이 먼저 확인할 대상을 정리하기 위한 참고 지표입니다.
              </div>
            </div>
          </section>
        </section>
      )}

      {view === "layers" && (
        <section className="page layersPage">
          <div className="adminHero">
            <div>
              <div className="badge blue">
                <Satellite size={18} />
                SAR & Public Data Risk Layers
              </div>
              <h1>SAR·공공데이터 위험 레이어</h1>
              <p>
                SAR는 사람 추적이나 실시간 탈출 지시가 아니라, 침수 가능 영역을 이해하기 위한 참고 레이어로 사용합니다.
              </p>
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
              <div className="layerMap">
                {layers.find((item) => item.id === "sar")?.active && <span className="sarArea">SAR 침수 추정 영역</span>}
                {layers.find((item) => item.id === "danger")?.active && <span className="dangerArea">위험구역</span>}
                {layers.find((item) => item.id === "shelter")?.active && <span className="shelterMark">대피소</span>}
                {layers.find((item) => item.id === "user")?.active && <span className="userMark">사용자 단서</span>}
              </div>
              <div className="notice">
                Sentinel/SAR 기반 레이어는 MVP 단계에서 Mock Reference Layer로 구현되며, 고도화 단계에서 실제 데이터와 연결합니다.
              </div>
            </div>

            <div className="darkPanel">
              <h2>데이터 출처 계획</h2>
              <div className="sourceRows">
                <p><strong>대피소</strong><span>공공데이터 CSV</span></p>
                <p><strong>위험구역</strong><span>GeoJSON 지역 데이터</span></p>
                <p><strong>도로/하천</strong><span>OpenStreetMap</span></p>
                <p><strong>SAR</strong><span>Sentinel/SAR 침수 참고 레이어</span></p>
                <p><strong>보고서</strong><span>익명화된 실패 지도 Markdown</span></p>
              </div>
            </div>
          </section>
        </section>
      )}

      {view === "kit" && (
        <section className="page kitPage">
          <section className="hero kitHero">
            <div>
              <div className="badge warm">
                <Database size={18} />
                Editable Open-source Kit
              </div>
              <h1>지역이 직접 수정하는 재난 대응 키트</h1>
              <p>
                RescueMap OS는 하나의 고정 앱이 아니라, 지역·학교·복지기관이 자기 환경에 맞게 수정할 수 있는 데이터 구조를 제공합니다.
              </p>
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
