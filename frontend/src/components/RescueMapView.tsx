import { useEffect, useState } from "react";
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
import {
  fetchDangerZones,
  fetchShelters,
  type DangerZoneFeatureCollection,
  type Shelter,
} from "../api";

type LayerState = {
  id: string;
  active: boolean;
};

type RescueMapViewProps = {
  variant: "citizen" | "admin" | "layers";
  layers?: LayerState[];
};

const CENTER: [number, number] = [36.5, 127.8];

const REGION_CENTERS: Record<string, [number, number]> = {
  전국: [36.5, 127.8],
  대전: [36.3218, 127.3672],
  서울: [37.5663, 126.9780],
  부산: [35.1688, 129.0570],
  광주: [35.1595, 126.8526],
  대구: [35.8838, 128.6038],
  인천: [37.4563, 126.7052],
  제주: [33.4996, 126.5312],
};


const userPoint: [number, number] = [36.3218, 127.3672];
const firePoint: [number, number] = [36.3204, 127.3654];
const welfarePoint: [number, number] = [36.3244, 127.3659];
const emergencyPoint: [number, number] = [36.3189, 127.3696];

const evacuationRoute: [number, number][] = [
  userPoint,
  [36.3224, 127.3681],
  [36.3233, 127.3691],
];

const fallbackSarFloodArea: [number, number][] = [
  [36.3194, 127.3639],
  [36.3222, 127.3631],
  [36.3244, 127.3661],
  [36.3229, 127.3693],
  [36.3198, 127.3682],
];

function isActive(layers: LayerState[] | undefined, id: string) {
  if (!layers) return true;
  const target = layers.find((item) => item.id === id);
  return target?.active ?? true;
}

function geoJsonPolygonToLatLngs(coordinates: number[][][]): [number, number][] {
  const firstRing = coordinates[0] ?? [];
  return firstRing.map(([lng, lat]) => [lat, lng]);
}

export default function RescueMapView({ variant, layers }: RescueMapViewProps) {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [dangerZones, setDangerZones] = useState<DangerZoneFeatureCollection | null>(null);
  const [dataSource, setDataSource] = useState<"api" | "fallback">("fallback");
  const [selectedRegion, setSelectedRegion] = useState("전국");

  const showShelter = isActive(layers, "shelter");
  const showDanger = isActive(layers, "danger");
  const showUser = isActive(layers, "user");
  const showSar = isActive(layers, "sar");
  const showWelfare = isActive(layers, "welfare");
  const showEmergency = isActive(layers, "emergency");

  useEffect(() => {
    async function loadLocalData() {
      try {
        const [shelterItems, dangerZoneItems] = await Promise.all([
          fetchShelters(),
          fetchDangerZones(),
        ]);

        setShelters(shelterItems);
        setDangerZones(dangerZoneItems);
        setDataSource("api");
      } catch {
        setShelters([
          {
            id: "SHELTER-FALLBACK",
            region: "대전",
            name: "근처 대피소 Mock",
            type: "fallback",
            lat: 36.3233,
            lng: 127.3691,
            address: "Mock address",
            capacity: 200,
            note: "API 연결 실패 시 표시되는 fallback 대피소",
          },
        ]);
        setDangerZones(null);
        setDataSource("fallback");
      }
    }

    loadLocalData();
  }, []);

  const dangerFeatures = dangerZones?.features ?? [];
  const filteredShelters = selectedRegion === "전국"
    ? shelters
    : shelters.filter((item) => item.region === selectedRegion);

  const filteredDangerFeatures = selectedRegion === "전국"
    ? dangerFeatures
    : dangerFeatures.filter((feature) => feature.properties.region === selectedRegion);

  const mapCenter = REGION_CENTERS[selectedRegion] ?? CENTER;
  const mapZoom = selectedRegion === "전국" ? 7 : 13;

  return (
    <div className={`mapShell ${variant}`}>
      <div className="regionSelector">
        {Object.keys(REGION_CENTERS).map((region) => (
          <button
            key={region}
            className={selectedRegion === region ? "active" : ""}
            onClick={() => setSelectedRegion(region)}
          >
            {region}
          </button>
        ))}
      </div>
      <MapContainer
        key={selectedRegion}
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={false}
        className="leafletMap"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showSar && (
          <Polygon
            positions={fallbackSarFloodArea}
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

        {showDanger &&
          filteredDangerFeatures.map((feature) => (
            <Polygon
              key={feature.properties.id}
              positions={geoJsonPolygonToLatLngs(feature.geometry.coordinates)}
              pathOptions={{
                color: feature.properties.risk_level === "high" ? "#dc2626" : "#f97316",
                fillColor: feature.properties.risk_level === "high" ? "#ef4444" : "#f59e0b",
                fillOpacity: 0.28,
                weight: 2,
              }}
            >
              <Tooltip permanent direction="center">
                {feature.properties.name}
              </Tooltip>
              <Popup>
                <strong>{feature.properties.name}</strong>
                <br />
                {feature.properties.description}
                <br />
                위험도: {feature.properties.risk_level}
              </Popup>
            </Polygon>
          ))}

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
            <Popup>위치 단서: 배재대학교 P관 3층 서쪽 복도</Popup>
          </CircleMarker>
        )}

        {showShelter &&
          filteredShelters.map((shelter) => (
            <CircleMarker
              key={shelter.id}
              center={[shelter.lat, shelter.lng]}
              radius={10}
              pathOptions={{
                color: "#047857",
                fillColor: "#10b981",
                fillOpacity: 0.9,
              }}
            >
              <Tooltip permanent direction="right">
                {shelter.name}
              </Tooltip>
              <Popup>
                <strong>{shelter.name}</strong>
                <br />
                {shelter.address}
                <br />
                수용 규모: {shelter.capacity}명
                <br />
                {shelter.note}
              </Popup>
            </CircleMarker>
          ))}

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

      <div className={`mapDataBadge ${dataSource}`}>
        {dataSource === "api" ? "rescue-kit local_data 연결됨" : "fallback 지도 데이터"}
      </div>

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
