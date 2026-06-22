import {
  CircleMarker,
  MapContainer,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

type LayerState = {
  id: string;
  active: boolean;
};

type RescueMapViewProps = {
  variant: "citizen" | "admin" | "layers";
  layers?: LayerState[];
};

const CENTER: [number, number] = [36.3218, 127.3672];

const userPoint: [number, number] = [36.3218, 127.3672];
const shelterPoint: [number, number] = [36.3233, 127.3691];
const firePoint: [number, number] = [36.3204, 127.3654];
const welfarePoint: [number, number] = [36.3244, 127.3659];
const emergencyPoint: [number, number] = [36.3189, 127.3696];

const sarFloodArea: [number, number][] = [
  [36.3194, 127.3639],
  [36.3222, 127.3631],
  [36.3244, 127.3661],
  [36.3229, 127.3693],
  [36.3198, 127.3682],
];

const dangerZone: [number, number][] = [
  [36.3192, 127.3651],
  [36.3208, 127.3642],
  [36.3217, 127.3661],
  [36.3201, 127.3674],
];

const evacuationRoute: [number, number][] = [
  userPoint,
  [36.3224, 127.3681],
  shelterPoint,
];

function isActive(layers: LayerState[] | undefined, id: string) {
  if (!layers) return true;
  const target = layers.find((item) => item.id === id);
  return target?.active ?? true;
}

export default function RescueMapView({ variant, layers }: RescueMapViewProps) {
  const showShelter = isActive(layers, "shelter");
  const showDanger = isActive(layers, "danger");
  const showUser = isActive(layers, "user");
  const showSar = isActive(layers, "sar");
  const showWelfare = isActive(layers, "welfare");
  const showEmergency = isActive(layers, "emergency");

  return (
    <div className={`mapShell ${variant}`}>
      <MapContainer
        center={CENTER}
        zoom={16}
        scrollWheelZoom={false}
        className="leafletMap"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showSar && (
          <Polygon
            positions={sarFloodArea}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#3b82f6",
              fillOpacity: 0.22,
              weight: 2,
            }}
          >
            <Tooltip permanent direction="center">
              SAR 침수 참고
            </Tooltip>
            <Popup>
              Sentinel/SAR 기반 침수 추정 Mock Layer입니다.
              실시간 구조 명령용이 아니라 위험 참고용입니다.
            </Popup>
          </Polygon>
        )}

        {showDanger && (
          <Polygon
            positions={dangerZone}
            pathOptions={{
              color: "#dc2626",
              fillColor: "#ef4444",
              fillOpacity: 0.28,
              weight: 2,
            }}
          >
            <Tooltip permanent direction="center">
              위험구역
            </Tooltip>
            <Popup>화재·침수·고립 위험이 높은 참고 구역입니다.</Popup>
          </Polygon>
        )}

        {variant !== "citizen" && (
          <Polyline
            positions={evacuationRoute}
            pathOptions={{
              color: "#0f766e",
              weight: 4,
              dashArray: "8 8",
            }}
          >
            <Tooltip>대피 참고 동선</Tooltip>
          </Polyline>
        )}

        {showUser && (
          <CircleMarker
            center={userPoint}
            radius={12}
            pathOptions={{
              color: "#f59e0b",
              fillColor: "#f59e0b",
              fillOpacity: 0.9,
            }}
          >
            <Tooltip permanent direction="top">
              사용자 단서
            </Tooltip>
            <Popup>
              위치 단서: 배재대학교 P관 3층 서쪽 복도
            </Popup>
          </CircleMarker>
        )}

        {showShelter && (
          <CircleMarker
            center={shelterPoint}
            radius={11}
            pathOptions={{
              color: "#047857",
              fillColor: "#10b981",
              fillOpacity: 0.9,
            }}
          >
            <Tooltip permanent direction="right">
              대피소
            </Tooltip>
            <Popup>근처 대피소 Mock 데이터</Popup>
          </CircleMarker>
        )}

        {showDanger && (
          <CircleMarker
            center={firePoint}
            radius={11}
            pathOptions={{
              color: "#991b1b",
              fillColor: "#ef4444",
              fillOpacity: 0.9,
            }}
          >
            <Tooltip permanent direction="left">
              화재 발생
            </Tooltip>
            <Popup>위험 발생 지점 Mock 데이터</Popup>
          </CircleMarker>
        )}

        {showWelfare && (
          <CircleMarker
            center={welfarePoint}
            radius={10}
            pathOptions={{
              color: "#7c3aed",
              fillColor: "#8b5cf6",
              fillOpacity: 0.85,
            }}
          >
            <Tooltip permanent direction="top">
              복지시설
            </Tooltip>
          </CircleMarker>
        )}

        {showEmergency && (
          <CircleMarker
            center={emergencyPoint}
            radius={10}
            pathOptions={{
              color: "#0369a1",
              fillColor: "#0ea5e9",
              fillOpacity: 0.85,
            }}
          >
            <Tooltip permanent direction="bottom">
              응급기관
            </Tooltip>
          </CircleMarker>
        )}
      </MapContainer>

      {variant === "admin" && (
        <div className="mapOverlayAlert">
          SAR/위험구역 + 사용자 단서 겹침
          <br />
          우선 확인 필요
        </div>
      )}

      {variant === "layers" && (
        <div className="mapOverlayNote">
          SAR는 실시간 구조 명령이 아닌 침수 참고 레이어입니다.
        </div>
      )}
    </div>
  );
}
