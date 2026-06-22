import { useState } from "react";
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
} from "lucide-react";

type DisasterType = {
  id: string;
  label: string;
  desc: string;
  icon: JSX.Element;
};

type VulnerableMode = {
  id: string;
  label: string;
  desc: string;
};

type StatusType = "safe" | "moving" | "help";

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
  },
  {
    id: "elderly",
    label: "노인 모드",
    desc: "큰 글씨, 보호자 체크인, 이동 도움 요청",
  },
  {
    id: "disabled",
    label: "장애인 이동지원 모드",
    desc: "계단 회피, 접근 가능한 대피소, 이동 지원",
  },
  {
    id: "isolated_youth",
    label: "고립 청년 모드",
    desc: "무응답 체크, 비상 연락망, 도움 요청 기록",
  },
  {
    id: "night_return",
    label: "야간 귀가 모드",
    desc: "보호자 위치 공유, 안전지점 체크인",
  },
];

const statusMeta: Record<
  StatusType,
  { label: string; desc: string; icon: JSX.Element }
> = {
  safe: {
    label: "안전함",
    desc: "현재 안전하거나 대피 완료 상태를 공유합니다.",
    icon: <CheckCircle2 size={24} />,
  },
  moving: {
    label: "이동 중",
    desc: "대피소 또는 안전지점으로 이동 중임을 남깁니다.",
    icon: <Footprints size={24} />,
  },
  help: {
    label: "도움 필요",
    desc: "고립, 이동 어려움, 위험 상황을 보호자/기관에 남깁니다.",
    icon: <CircleHelp size={24} />,
  },
};

export default function App() {
  const [selectedDisaster, setSelectedDisaster] = useState("flood");
  const [selectedMode, setSelectedMode] = useState("general");
  const [status, setStatus] = useState<StatusType | null>(null);

  const disaster = disasters.find((item) => item.id === selectedDisaster);
  const mode = modes.find((item) => item.id === selectedMode);

  const statusRecord = status
    ? {
        status: statusMeta[status].label,
        disasterType: disaster?.label,
        vulnerableMode: mode?.label,
        location: "배재대학교 P관 3층 서쪽 복도",
        time: new Date().toLocaleString("ko-KR"),
        network: "로컬 저장 후 네트워크 복구 시 동기화",
      }
    : null;

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

      <section className="grid">
        <div className="panel">
          <h2>1. 재난 유형 선택</h2>
          <div className="card-list">
            {disasters.map((item) => (
              <button
                key={item.id}
                className={`select-card ${
                  selectedDisaster === item.id ? "active" : ""
                }`}
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
                className={`select-card ${
                  selectedMode === item.id ? "active" : ""
                }`}
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
            재난 상황에서는 복잡한 입력 대신 최소 행동만 남깁니다. 위치 정보는
            상시 추적하지 않고, 사용자가 상태를 공유할 때만 기록됩니다.
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
            <div className="record">
              <p>
                <strong>상태</strong>
                <span>{statusRecord.status}</span>
              </p>
              <p>
                <strong>재난 유형</strong>
                <span>{statusRecord.disasterType}</span>
              </p>
              <p>
                <strong>취약 모드</strong>
                <span>{statusRecord.vulnerableMode}</span>
              </p>
              <p>
                <strong>위치 단서</strong>
                <span>{statusRecord.location}</span>
              </p>
              <p>
                <strong>기록 시간</strong>
                <span>{statusRecord.time}</span>
              </p>
              <p>
                <strong>동기화</strong>
                <span>{statusRecord.network}</span>
              </p>
            </div>
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
    </main>
  );
}
