import { PlayCircle, MapPin, Route } from "lucide-react";
import { demoScenarios, type DemoScenario } from "../data/demoScenarios";

type ScenarioPanelProps = {
  onRunScenario: (scenario: DemoScenario) => void;
  selectedScenarioId?: string;
};

export default function ScenarioPanel({
  onRunScenario,
  selectedScenarioId,
}: ScenarioPanelProps) {
  return (
    <section className="scenarioPanel">
      <div className="scenarioHead">
        <div>
          <h2>전국 재난 시나리오</h2>
          <p>
            버튼을 누르면 시민 상태 기록이 생성되고 기관 대시보드 흐름으로 연결됩니다.
          </p>
        </div>
      </div>

      <div className="scenarioGrid">
        {demoScenarios.map((scenario) => (
          <article
            key={scenario.id}
            className={`scenarioCard ${
              selectedScenarioId === scenario.id ? "active" : ""
            }`}
          >
            <div className="scenarioRegion">
              <MapPin size={16} />
              {scenario.region}
            </div>

            <h3>{scenario.title}</h3>
            <p>{scenario.summary}</p>

            <div className="scenarioFlow">
              {scenario.expectedFlow.slice(0, 3).map((step, index) => (
                <span key={step}>
                  <Route size={13} />
                  {index + 1}. {step}
                </span>
              ))}
            </div>

            <button onClick={() => onRunScenario(scenario)}>
              <PlayCircle size={18} />
              시나리오 실행
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
