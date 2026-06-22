export type StatusType = "safe" | "moving" | "help";

export type CheckinStatus =
  | "미확인"
  | "로컬 저장"
  | "기관 전송 대기"
  | "기관 확인 대기"
  | "기관 확인 완료"
  | "실패지도 후보";

export type Incident = {
  id: string;
  status: StatusType;
  disaster: string;
  mode: string;
  location: string;
  risk: number;
  checkin: CheckinStatus;
  time: string;
};

export type StatusCreatePayload = {
  status: StatusType;
  disaster: string;
  mode: string;
  location: string;
  building?: string;
  floor?: string;
  zone?: string;
  risk: number;
};

const API_BASE = "http://127.0.0.1:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchIncidents(): Promise<Incident[]> {
  const data = await request<{ count: number; items: Incident[] }>("/api/incidents");
  return data.items;
}

export async function createStatus(payload: StatusCreatePayload): Promise<Incident> {
  return request<Incident>("/api/status", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateIncidentCheckin(
  incidentId: string,
  checkin: CheckinStatus
): Promise<Incident> {
  return request<Incident>(`/api/incidents/${incidentId}/checkin`, {
    method: "PATCH",
    body: JSON.stringify({ checkin }),
  });
}

export async function fetchLayers() {
  return request("/api/layers");
}

export async function fetchKit() {
  return request("/api/kit");
}

export async function fetchFailureReport() {
  return request("/api/failure-report");
}


export async function generateFailureReport(): Promise<{
  message: string;
  filename: string;
  path: string;
  candidate_count: number;
}> {
  return request("/api/failure-report/generate", {
    method: "POST",
  });
}

export async function fetchFailureReportMarkdown(): Promise<{ markdown: string }> {
  return request("/api/failure-report/markdown");
}

export type Shelter = {
  id: string;
  region: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  address: string;
  capacity: number;
  note: string;
};

export type DangerZoneFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: {
      id: string;
      region: string;
      name: string;
      risk_type: string;
      risk_level: string;
      description: string;
    };
    geometry: {
      type: "Polygon";
      coordinates: number[][][];
    };
  }>;
};

export async function fetchShelters(): Promise<Shelter[]> {
  const data = await request<{ count: number; items: Shelter[] }>("/api/local-data/shelters");
  return data.items;
}

export async function fetchDangerZones(): Promise<DangerZoneFeatureCollection> {
  return request<DangerZoneFeatureCollection>("/api/local-data/danger-zones");
}
