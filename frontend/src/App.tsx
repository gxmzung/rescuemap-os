import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  CircleHelp,
  CloudRain,
  FileText,
  Flame,
  Footprints,
  HeartPulse,
  LayoutDashboard,
  MapPin,
  Moon,
  Radio,
  ShieldAlert,
  Siren,
  UserRoundCheck,
} from "lucide-react";

type DisasterType = {
  id: string;
  label: string;
  desc: string;
  tone: string;
  icon: ReactNode;
};

type VulnerableMode = {
  id: string;
  label: string;
  desc: string;
  weight: number;
};

type StatusType = "safe" | "moving" | "help";
type ViewType = "citizen" | "admin" | "kit";

type Incident = {
  id: string;
  status: StatusType;
  disasterType: string;
  vulnerableMode: string;
  location: string;
  riskScore: number;
  checkin: "보호자 확인" | "기관 확인 대기" | "미확인";
  createdAt: string;
};

const disasters: DisasterType[] = [
  {
    id: "flood",
    label: "폭우/침수",
    desc: "하천·저지대·지하차도 접근 위험",
    tone: "blue",
    icon: <CloudRain size={22} />,
  },
  {
    id: "fire",
    label: "화재",
    desc: "연기·정전·건물 내부 고립 위험",
    tone: "red",
    icon: <Flame size={22} />,
  },
  {
    id: "collapse",
    label: "지진/붕괴",
    desc: "낙하물·출입구 차단·구조물 위험",
    tone: "stone",
    icon: <Building2 size={22} />,
  },
  {
    id: "night",
    label: "야간 귀가 위험",
    desc: "보호자 체크인·안전지점 확인",
    tone: "purple",
    icon: <Moon size={22} />,
  },
  {
    id: "infection",
    label: "감염병",
    desc: "증상 체크·격리·기관 연결",
    tone: "green",
    icon: <HeartPulse size={22} />,
  },
];

const modes: VulnerableMode[] = [
  {
    id: "general",
    label: "일반 모드",
    desc: "기본 대피 행동카드와 상태 공유",
    weight: 1.0,
  },
  {
    id: "elderly",
    label: "노인 모드",
    desc: "큰 글씨, 보호자 체크인, 이동 도움 요청",
    weight: 1.2,
  },
  {
    id: "disabled",
    label: "장애인 이동지원 모드",
    desc: "계단 회피, 접근 가능한 대피소, 이동 지원",
    weight: 1.3,
  },
  {
    id: "isolated_youth",
    label: "고립 청년 모드",
    desc: "무응답 체크, 비상 연락망, 도움 요청 기록",
    weight: 1.1,
  },
  {
    id: "night_return",
    label: "야간 귀가 모드",
    desc: "보호자 위치 공유, 안전지점 체크인",
    weight: 1.15,
  },
];

const statusMeta: Record<
  StatusType,
  { label: string; desc: string; risk: number; className: string; icon: ReactNode }
> = {
  safe: {
    label: "안전함",
    desc: "현재 안전하거나 대피 완료 상태",
    risk: 15,
    className: "safe",
    icon: <CheckCircle2 size={28} />,
  },
  moving: {
    label: "이동 중",
    desc: "대피소 또는 안전지점으로 이동 중",
    risk: 45,
    className: "moving",
    icon: <Footprints size={28} />,
  },
  help: {
    label: "도움 필요",
    desc: "고립, 이동 어려움, 위험 상황",
    risk: 85,
    className: "help",
    icon: <CircleHelp size={28} />,
  },
};

const initialIncidents: Incident[] = [
  {
    id: "RM-001",
    status: "help",
    disasterType: "화재",
    vulnerableMode: "장애인 이동지원 모드",
    location: "배재대학교 P관 3층 서쪽 복도",
    riskScore: 92,
    checkin: "기관 확인 대기",
    createdAt: "방금 전",
  },
  {
    id: "RM-002",
    status: "moving",
    disasterType: "폭우/침수",
    vulnerableMode: "노인 모드",
    location: "정문 인근 저지대 보행로",
    riskScore: 68,
    checkin: "보호자 확인",
    createdAt: "3분 전",
  },
  {
    id: "RM-003",
    status: "help",
    disasterType: "야간 귀가 위험",
    vulnerableMode: "야간 귀가 모드",
    location: "후문 원룸가 골목",
    riskScore: 74,
    checkin: "미확인",
    createdAt: "7분 전",
  },
];

export default function App() {
  const [view, setView] = useState<ViewType>("citizen");
  const [selectedDisaster, setSelectedDisaster] = useState("fire");
  const [selectedMode, setSelectedMode] = useState("disabled");
  const [status, setStatus] = useState<StatusType | null>("help");
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

  const disaster = disasters.find((item) => item.id === selectedDisaster);
  const mode = modes.find((item) => item.id === selectedMode);

  const riskScore = useMemo(() => {
    if (!status || !mode) return 0;
    return Math.min(100, Math.round(statusMeta[status].risk * mode.weight));
  }, [status, mode]);

  const statusRecord = status
    ? {
        status: statusMeta[status].label,
        disasterType: disaster?.label ?? "-",
        vulnerableMode: mode?.label ?? "-",
        location: "배재대학교 P관 3층 서쪽 복도",
        time: new Date().toLocaleString("ko-KR"),
        sync: "로컬 저장 후 네트워크 복구 시 전송",
        riskScore,
      }
    : null;

  function sendToDashboard() {
    if (!statusRecord || !status) return;

    const newIncident: Incident = {
      id: `RM-${String(incidents.length + 1).padStart(3, "0")}`,
      status,
      disasterType: statusRecord.disasterType,
      vulnerableMode: statusRecord.vulnerableMode,
      location: statusRecord.location,
      riskScore: statusRecord.riskScore,
      checkin: status === "help" ? "기관 확인 대기" : "보호자 확인",
      createdAt: "방금 전",
    };

    setIncidents([newIncident, ...incidents]);
    setView("admin");
  }

  const helpCount = incidents.filter((item) => item.status === "help").length;
  const pendingCount = incidents.filter(
    (item) => item.checkin === "미확인" || item.checkin === "기관 확인 대기"
  ).length;
  const avgRisk = Math.round(
    incidents.reduce((sum, item) => sum + item.riskScore, 0) / incidents.length
  );

  return (
    <main className={view === "admin" ? "app admin-theme" : "app citizen-theme"}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <ShieldAlert size={22} />
          </div>
          <div>
            <strong>RescueMap OS</strong>
            <span>Open-source Disaster Response Kit</span>
          </div>
        </div>

        <nav className="nav-tabs">
          <button className={view === "citizen" ? "active" : ""} onClick={() => setView("citizen")}>
            시민 상태 공유
          </button>
          <button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>
            기관 대시보드
          </button>
          <button className={view === "kit" ? "active" : ""} onClick={() => setView("kit")}>
            오픈소스 키트
          </button>
        </nav>
      </header>

      {view === "citizen" && (
        <section className="citizen-page">
          <section className="citizen-hero">
            <div>
              <div className="safety-badge">
                <Siren size={18} />
                위치 정보는 상태 공유 시에만 기록됩니다
              </div>
              <h1>지금 어떤 상황인가요?</h1>
              <p>
                재난 상황에서는 복잡한 입력보다 빠른 상태 공유가 중요합니다.
                재난 유형과 필요한 지원 모드를 선택한 뒤, 현재 상태를 남겨주세요.
              </p>
            </div>

            <div className="emergency-summary">
              <strong>핵심 원칙</strong>
              <span>재난 전: 대피 기억</span>
              <span>재난 중: 위치·상태 기록</span>
              <span>재난 후: 실패 지도</span>
            </div>
          </section>

          <section className="citizen-grid">
            <div className="white-panel">
              <h2>1. 재난 유형 선택</h2>
              <div className="disaster-grid">
                {disasters.map((item) => (
                  <button
                    key={item.id}
                    className={`choice-card tone-${item.tone} ${
                      selectedDisaster === item.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedDisaster(item.id)}
                  >
                    <div className="choice-icon">{item.icon}</div>
                    <div>
                      <strong>{item.label}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="white-panel">
              <h2>2. 취약 모드 선택</h2>
              <div className="mode-list">
                {modes.map((item) => (
                  <button
                    key={item.id}
                    className={`mode-card ${selectedMode === item.id ? "active" : ""}`}
                    onClick={() => setSelectedMode(item.id)}
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

          <section className="white-panel status-share">
            <div className="section-head">
              <div>
                <h2>3. 3버튼 상태 공유</h2>
                <p>
                  위기 상황에서 길게 입력하지 않아도 됩니다. 아래 세 가지 중 하나만 선택하면 위치와 상태 단서가 남습니다.
                </p>
              </div>
            </div>

            <div className="status-grid">
              {(Object.keys(statusMeta) as StatusType[]).map((key) => (
                <button
                  key={key}
                  className={`status-big ${statusMeta[key].className} ${
                    status === key ? "active" : ""
                  }`}
                  onClick={() => setStatus(key)}
                >
                  {statusMeta[key].icon}
                  <strong>{statusMeta[key].label}</strong>
                  <span>{statusMeta[key].desc}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="citizen-result">
            <div className="white-panel record-panel">
              <div className="result-title">
                <MapPin size={22} />
                <h2>상태 기록 미리보기</h2>
              </div>

              {statusRecord ? (
                <>
                  <div className="record-list">
                    <p><strong>상태</strong><span>{statusRecord.status}</span></p>
                    <p><strong>재난 유형</strong><span>{statusRecord.disasterType}</span></p>
                    <p><strong>취약 모드</strong><span>{statusRecord.vulnerableMode}</span></p>
                    <p><strong>위치 단서</strong><span>{statusRecord.location}</span></p>
                    <p><strong>위험 점수</strong><span>{statusRecord.riskScore}점 · 참고용</span></p>
                    <p><strong>기록 시간</strong><span>{statusRecord.time}</span></p>
                    <p><strong>동기화</strong><span>{statusRecord.sync}</span></p>
                  </div>

                  <button className="send-button" onClick={sendToDashboard}>
                    기관 대시보드로 기록 보내기
                  </button>
                </>
              ) : (
                <div className="empty-state">
                  아직 상태가 선택되지 않았습니다.
                </div>
              )}
            </div>

            <div className="white-panel ethics-panel">
              <h2>윤리적 설계 원칙</h2>
              <ul>
                <li>AI 기반 실내 탈출 경로 안내를 제공하지 않습니다.</li>
                <li>사용자의 생명 판단을 자동화하지 않습니다.</li>
                <li>위치 정보는 상시 추적하지 않습니다.</li>
                <li>위험 점수는 구조 명령이 아닌 참고 지표입니다.</li>
                <li>재난 후 데이터는 익명화된 실패 지도로 전환합니다.</li>
              </ul>
            </div>
          </section>
        </section>
      )}

      {view === "admin" && (
        <section className="admin-page">
          <div className="admin-hero">
            <div>
              <div className="admin-badge">
                <LayoutDashboard size={18} />
                Institution Control Dashboard
              </div>
              <h1>기관 관리자 대시보드</h1>
              <p>
                수신된 상태 기록, 도움 요청, 체크인 상태, 위험 점수, 실패 지도 후보를 확인합니다.
              </p>
            </div>
          </div>

          <div className="admin-stats">
            <div className="stat-card danger">
              <AlertTriangle size={26} />
              <span>도움 필요</span>
              <strong>{helpCount}건</strong>
            </div>
            <div className="stat-card warning">
              <Radio size={26} />
              <span>미확인/기관 대기</span>
              <strong>{pendingCount}건</strong>
            </div>
            <div className="stat-card info">
              <ShieldAlert size={26} />
              <span>평균 위험 점수</span>
              <strong>{avgRisk}점</strong>
            </div>
            <div className="stat-card report">
              <FileText size={26} />
              <span>실패 지도 후보</span>
              <strong>3구역</strong>
            </div>
          </div>

          <section className="admin-grid">
            <div className="admin-panel">
              <h2>도움 요청 및 상태 기록</h2>
              <div className="incident-list">
                {incidents.map((item) => (
                  <div key={item.id} className="incident-card">
                    <div className="incident-top">
                      <strong>{item.id}</strong>
                      <span>{item.createdAt}</span>
                    </div>
                    <p>{item.location}</p>
                    <div className="incident-meta">
                      <span>{statusMeta[item.status].label}</span>
                      <span>{item.disasterType}</span>
                      <span>{item.vulnerableMode}</span>
                      <span>{item.checkin}</span>
                    </div>
                    <div className="risk-track">
                      <span style={{ width: `${item.riskScore}%` }} />
                    </div>
                    <small>위험 점수 {item.riskScore}점 · 구조 명령이 아닌 참고용 우선순위</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-panel">
              <h2>실패 지도 후보</h2>
              <div className="failure-map">
                <div className="map-label label-high">P관 3층</div>
                <div className="map-label label-mid one">정문 저지대</div>
                <div className="map-label label-mid two">후문 골목</div>
              </div>
              <p>
                재난 종료 후 도움 요청, 고립 위치, 체크인 지연, 대피소 접근성 문제를 익명화하여 실패 지도 리포트로 전환합니다.
              </p>
            </div>
          </section>
        </section>
      )}

      {view === "kit" && (
        <section className="kit-page">
          <div className="white-panel kit-hero">
            <h1>오픈소스 재난 대응 키트</h1>
            <p>
              RescueMap OS는 하나의 고정 앱이 아니라, 지역·학교·복지기관이 자기 환경에 맞게 수정할 수 있는 데이터 키트 구조를 가집니다.
            </p>
          </div>

          <div className="kit-grid">
            <div className="kit-card">
              <strong>disaster_protocols</strong>
              <span>재난 유형별 행동 프로토콜 YAML</span>
            </div>
            <div className="kit-card">
              <strong>vulnerable_modes</strong>
              <span>취약계층 맞춤 모드 YAML</span>
            </div>
            <div className="kit-card">
              <strong>local_data</strong>
              <span>대피소 CSV / 위험구역 GeoJSON</span>
            </div>
            <div className="kit-card">
              <strong>report_templates</strong>
              <span>재난 후 실패 지도 리포트 Markdown</span>
            </div>
          </div>

          <pre className="tree-view">{`rescue-kit/
├── disaster_protocols/
│   ├── flood.yml
│   ├── fire.yml
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
