import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, User, Bot } from "lucide-react";

import {
  Container,
  Section,
  Stack,
  Button,
  Segmented,
} from "@tokyo3rdhq/magi-design-system";

import { useI18n } from "../I18nProvider";
import { useSeo } from "../seo/useSeo";

/**
 * Home — the entry point.
 *
 * Layout (lobehub-icons inspired):
 *   [Left: eyebrow + headline + subhead, left-aligned]
 *   [Right: sidebar card (~280px)]
 *     └── Tab switcher (Human / Agent with icons)
 *         ├── Human panel: single box, 3 step titles vertically stacked
 *         └── Agent panel: single line prompt + copy icon
 *     └── Doc links (llms.txt · agents.md)
 */
export function HomePage() {
  const navigate = useNavigate();
  const { ts, dict } = useI18n();
  useSeo("/");

  const [tab, setTab] = useState<"human" | "agent">("human");
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(dict.home.agentPromptInline);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API may be blocked.
    }
  };

  const renderTab = (
    opt: { value: string; label: string },
    state: { active: boolean; disabled: boolean; onSelect: () => void }
  ) => (
    <button
      type="button"
      role="radio"
      aria-checked={state.active}
      disabled={state.disabled}
      tabIndex={state.active ? 0 : -1}
      onClick={state.onSelect}
      className={`magi-segmented-item ${state.active ? "magi-segmented-item--active" : ""}`}
      style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%", height: "100%" }}
    >
      {opt.value === "human" ? <User size={14} aria-hidden="true" /> : <Bot size={14} aria-hidden="true" />}
      <span>{opt.label}</span>
    </button>
  );

  return (
    <Section className="tfi-home-section">
      <Container>
        <div className="tfi-home-columns">
          {/* Left-aligned intro block */}
          <Stack gap="4" className="tfi-home-intro">
            <span className="magi-eyebrow">{ts("home.eyebrow")}</span>
            <h1 className="magi-display tfi-home-headline">{ts("home.headline")}</h1>
            <p className="magi-body-lg tfi-home-subhead">{ts("home.subhead")}</p>
          </Stack>

        {/* Right sidebar card */}
        <div className="tfi-home-sidebar">
          {/* Tab switcher — Human / Agent with icons */}
          <Segmented
            value={tab}
            onChange={(v) => setTab(v as "human" | "agent")}
            options={[
              { value: "human", label: ts("home.humanTab") },
              { value: "agent", label: ts("home.agentTab") },
            ]}
            children={renderTab}
            className="tfi-home-tabs"
          />

          {/* Content panel */}
          <div className="tfi-home-panel">
            {tab === "human" && (
              <div className="tfi-home-human-panel" data-testid="home-human-panel">
                <ol className="tfi-home-steps">
                  <li className="tfi-home-step">{ts("home.step1Title")}</li>
                  <li className="tfi-home-step">{ts("home.step2Title")}</li>
                  <li className="tfi-home-step">{ts("home.step3Title")}</li>
                </ol>
                <div className="tfi-home-cta">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/browse")}
                    className="tfi-home-browse-btn"
                  >
                    {ts("home.browseModelsButton")}
                  </Button>
                </div>
              </div>
            )}

            {tab === "agent" && (
              <div className="tfi-home-agent-panel" data-testid="home-agent-panel">
                <div className="tfi-home-agent-row">
                  <code className="tfi-home-agent-prompt" data-testid="home-agent-prompt">
                    {dict.home.agentPromptInline}
                  </code>
                  <button
                    type="button"
                    aria-label={ts("home.agentCopyButton")}
                    data-testid="home-agent-copy"
                    className={`tfi-home-copy-btn ${copied ? "tfi-home-copied" : ""}`}
                    onClick={onCopy}
                  >
                    <Copy size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Shared doc links */}
          <div className="tfi-home-links">
            <a href="/llms.txt" target="_blank" rel="noreferrer" className="tfi-home-link">llms.txt</a>
            <span className="tfi-home-separator" aria-hidden="true">·</span>
            <a href="/agents.md" target="_blank" rel="noreferrer" className="tfi-home-link">agents.md</a>
          </div>
        </div>
        </div>
      </Container>
    </Section>
  );
}
