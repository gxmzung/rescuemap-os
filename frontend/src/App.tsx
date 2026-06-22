import { useMemo, useState, type ReactNode } from "react";
import {
  ShieldAlert,
  MapPin,
  UserRoundCheck,
  Siren,
  Flame,
  CloudRain,
  HeartPulse,
  Moon,
  Building2,
  CheckCircle2,
  Footprints,
  CircleHelp,
  LayoutDashboard,
  AlertTriangle,
  Radio,
  FileText,
} from "lucide-react";

type DisasterType = {
  id: string;
  label: string;
  desc: string;
  icon: ReactNode;
};

type VulnerableMode = {
  id: string;
  label: string;
  desc: string;
  weight: number;
};

type StatusType = "safe" | "moving" | "help";
type ViewType = "user" | "admin";

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
    icon: <CloudRain size={22} />,
  },
  {
    id: "fire",
    label: "화재",
    desc: "연기·정전·건물 내부 고립 위험",
    icon: <Flame size={22} />,
  },
  {
    id: "collapse",
    label: "지진/붕괴",
    desc: "낙하물·출입구 차단·구조물 위험",
    icon: <Building2 size={22} />,
  },
  {
    id: "night",
    label: "야간 귀가 위험",
    desc: "보호자 체크인·안전지점 확인",
    icon: <Moon size={22} />,
  },
  {
    id: "infection",
    label: "감염병",
    desc: "증상 체크·격리·기관 연결",
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
  { label: string; desc: string; risk: number; icon: ReactNode }
> = {
  safe: {
    label: "안전함",
    desc: "현재 안전하거나 대피 완료 상태를 공유합니다.",
    risk: 15,
    icon: <CheckCircle2 size={24} />,
  },
  moving: {
    label: "이동 중",
    desc: "대피소 또는 안전지점으로 이동 중임을 남깁니다.",
    risk: 45,
    icon: <Footprints size={24} />,
  },
  help: {
    label: "도움 필요",
    desc: "고립, 이동 어려움, 위험 상황을 보호자/기관에 남깁니다.",
    risk: 85,
    icon: <CircleHelp size={24} />,
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
  const [view, setView] = useState<ViewType>("user");
  const [selectedDisaster, setSelectedDisaster] = useState("flood");
  const [selectedMode, setSelectedMode] = useState("general");
  const [status, setStatus] = useState<StatusType | null>(null);
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
        network: "로컬 저장 후 네트워크 복구 시 동기화",
        riskScore,
      }
    : null;

  function saveMockIncident() {
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
  const unconfirmedCount = incidents.filter(
    (item) => item.checkin === "미확인" || item.checkin === "기관 확인 대기"
  ).length;
  const avgRisk = Math.round(
    incidents.reduce((sum, item) => sum + item.riskScore, 0) / incidents.length
  );

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <div className="eyebrow">
            <ShieldAlert size={18} />
            Open-source Disaster Response Kit
          </div>
          <h1>RescueMap OS</h1>
          <p>
            재난 상황에서 사람을 대신 판단하지 않고, 사용자의 위치 단서와
            상태를 남겨 보호자·기관이 확인할 수 있도록 돕는 오픈소스 재난 대응
            키트입니다.
          </p>
        </div>

        <div className="hero-card">
          <Siren size={28} />
          <strong>핵심 원칙</strong>
          <span>재난 전: 대피 기억</span>
          <span>재난 중: 위치·상태 기록</span>
          <span>재난 후: 실패 지도</span>
        </div>
      </section>

      <div className="view-tabs">
        <button className={view === "user" ? "active" : ""} onClick={() => setView("user")}>
          <MapPin size={18} />
          시민 상태 공유 화면
        </button>
        <button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>
          <LayoutDashboard size={18} />
          기관 관리자 대시보드
        </button>
      </div>

      {view === "user" ? (
        <>
          <section className="grid">
            <div className="panel">
              <h2>1. 재난 유형 선택</h2>
              <div className="card-list">
                {disasters.map((item) => (
                  <button
                    key={item.id}
                    className={`select-card ${selectedDisaster === item.id ? "active" : ""}`}
                    onClick={() => setSelectedDisaster(item.id)}
                  >
                    <div className="card-icon">{item.icon}</div>
                    <div>
                      <strong>{item.label}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel">
              <h2>2. 취약 모드 선택</h2>
              <div className="card-list">
                {modes.map((item) => (
                  <button
                    key={item.id}
                    className={`select-card ${selectedMode === item.id ? "active" : ""}`}
                    onClick={() => setSelectedMode(item.id)}
                  >
                    <div className="card-icon">
                      <UserRoundCheck size={22} />
                    </div>
                    <div>
                      <strong>{item.label}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="status-panel">
            <div>
              <h2>3. 3버튼 상태 공유</h2>
              <p>
                재난 상황에서는 복잡한 입력 대신 최소 행동만 남깁니다. 위치
                정보는 상시 추적하지 않고, 사용자가 상태를 공유할 때만 기록됩니다.
              </p>
            </div>

            <div className="status-buttons">
              {(Object.keys(statusMeta) as StatusType[]).map((key) => (
                <button
                  key={key}
                  className={`status-button ${status === key ? "active" : ""}`}
                  onClick={() => setStatus(key)}
                >
                  {statusMeta[key].icon}
                  <strong>{statusMeta[key].label}</strong>
                  <span>{statusMeta[key].desc}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="result-section">
            <div className="result-card">
              <div className="result-title">
                <MapPin size={22} />
                <h2>상태 기록 미리보기</h2>
              </div>

              {statusRecord ? (
                <>
                  <div className="record">
                    <p><strong>상태</strong><span>{statusRecord.status}</span></p>
                    <p><strong>재난 유형</strong><span>{statusRecord.disasterType}</span></p>
                    <p><strong>취약 모드</strong><span>{statusRecord.vulnerableMode}</span></p>
                    <p><strong>위치 단서</strong><span>{statusRecord.location}</span></p>
                    <p><strong>위험 점수</strong><span>{statusRecord.riskScore}점 / 참고용</span></p>
                    <p><strong>기록 시간</strong><span>{statusRecord.time}</span></p>
                    <p><strong>동기화</strong><span>{statusRecord.network}</span></p>
                  </div>
                  <button className="primary-action" onClick={saveMockIncident}>
                    관리자 대시보드에 기록 보내기
                  </button>
                </>
              ) : (
                <p className="empty">
                  아직 상태가 선택되지 않았습니다. 위기 상황에서는 3개의 버튼 중
                  하나만 눌러도 구조 단서가 남습니다.
                </p>
              )}
            </div>

            <div className="ethics-card">
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
        </>
      ) : (
        <section className="admin-shell">
          <div className="admin-stats">
            <div className="stat-card">
              <AlertTriangle size={24} />
              <span>도움 필요</span>
              <strong>{helpCount}건</strong>
            </div>
            <div className="stat-card">
              <Radio size={24} />
              <span>미확인/기관 대기</span>
              <strong>{unconfirmedCount}건</strong>
            </div>
            <div className="stat-card">
              <ShieldAlert size={24} />
              <span>평균 위험 점수</span>
              <strong>{avgRisk}점</strong>
            </div>
            <div className="stat-card">
              <FileText size={24} />
              <span>실패 지도 후보</span>
              <strong>3구역</strong>
            </div>
          </div>

          <div className="admin-grid">
            <div className="admin-panel">
              <h2>도움 요청 및 상태 기록</h2>
              <div className="incident-list">
                {incidents.map((item) => (
                  <div key={item.id} className="incident-card">
                    <div>
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
                    <div className="risk-line">
                      <span style={{ width: `${item.riskScore}%` }} />
                    </div>
                    <small>위험 점수 {item.riskScore}점 · 참고용 우선순위</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-panel">
              <h2>실패 지도 요약</h2>
              <div className="failure-map">
                <div className="map-point high">P관 3층</div>
                <div className="map-point mid">정문 저지대</div>
                <div className="map-point mid">후문 골목</div>
              </div>
              <p>
                재난 종료 후 도움 요청, 고립 위치, 체크인 지연, 대피소 접근성
                문제를 익명화하여 실패 지도 리포트로 전환합니다.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
