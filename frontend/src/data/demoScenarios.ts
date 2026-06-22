import type { StatusCreatePayload } from "../api";

export type DemoScenario = {
  id: string;
  region: string;
  title: string;
  summary: string;
  payload: StatusCreatePayload;
  expectedFlow: string[];
};

export const demoScenarios: DemoScenario[] = [
  {
    id: "seoul-flood",
    region: "서울",
    title: "서울 도심 침수 취약자 도움 요청",
    summary: "집중호우 상황에서 지하공간 접근 위험과 사용자 위치 단서가 겹치는 시나리오입니다.",
    payload: {
      status: "help",
      disaster: "폭우/침수",
      mode: "고령자 모드",
      location: "서울 도심 지하보행로 인근",
      building: "도심 지하보행로",
      floor: "B1",
      zone: "출구 인근",
      risk: 94,
    },
    expectedFlow: [
      "사용자가 도움 필요 상태를 남김",
      "위치 단서가 기관 대시보드로 전송됨",
      "침수 위험 레이어와 사용자 단서가 겹침",
      "기관 담당자가 우선 확인 대상으로 분류",
      "사후 실패지도 후보로 등록 가능",
    ],
  },
  {
    id: "busan-typhoon",
    region: "부산",
    title: "부산 해안 태풍 접근 위험",
    summary: "해안가 강풍·침수 상황에서 대피소와 위험구역을 함께 확인하는 시나리오입니다.",
    payload: {
      status: "moving",
      disaster: "태풍/강풍",
      mode: "일반 모드",
      location: "부산 해운대 해안 접근로",
      building: "해안 접근로",
      floor: "지상",
      zone: "방파제 인근",
      risk: 77,
    },
    expectedFlow: [
      "사용자가 이동 중 상태를 남김",
      "기관이 해안 위험구역과 대피소를 확인",
      "대피 동선이 위험구역과 가까운지 검토",
      "필요 시 안내 메시지 또는 현장 확인으로 연결",
    ],
  },
  {
    id: "daejeon-campus-fire",
    region: "대전",
    title: "대전 학교 건물 화재 고립",
    summary: "건물·층·구역 위치 단서를 이용해 실내 고립 가능성을 남기는 시나리오입니다.",
    payload: {
      status: "help",
      disaster: "화재",
      mode: "장애인 이동지원",
      location: "대전 학교 건물 3층 서쪽 복도",
      building: "학교 건물",
      floor: "3층",
      zone: "서쪽 복도",
      risk: 98,
    },
    expectedFlow: [
      "사용자가 건물·층·구역 단서를 남김",
      "AI 경로 안내 없이 위치 단서만 기록",
      "기관 담당자가 고립 가능성을 확인",
      "재난 종료 후 반복 고립 구역으로 분석 가능",
    ],
  },
  {
    id: "jeju-typhoon",
    region: "제주",
    title: "제주 태풍·폭우 취약지역 체크인",
    summary: "태풍과 폭우 상황에서 취약계층 체크인 흐름을 확인하는 시나리오입니다.",
    payload: {
      status: "help",
      disaster: "태풍/폭우",
      mode: "고립 청년 모드",
      location: "제주 도심 저지대 원룸가",
      building: "원룸가",
      floor: "2층",
      zone: "저지대 골목",
      risk: 88,
    },
    expectedFlow: [
      "사용자가 도움 필요 상태를 남김",
      "보호자 또는 기관 체크인 대기 상태로 등록",
      "지역 위험구역과 사용자 단서가 함께 표시",
      "사후 취약계층 확인 실패 지점으로 분석 가능",
    ],
  },
];
