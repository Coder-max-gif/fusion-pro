/**
 * Single source of truth for the three FUSION AI strategy profiles.
 *
 * IMPORTANT: The target ranges below are PROPOSED / ILLUSTRATIVE figures from
 * the project brief. They are not verified performance, forecasts or promises.
 * Any UI that displays them must also display the "not guaranteed" label.
 */

export type BotId = "safe" | "core" | "nova";
export type RiskLevel = "Low" | "Moderate" | "High";

export interface Bot {
  id: BotId;
  name: string;
  shortName: string;
  min: number;
  max: number;
  risk: RiskLevel;
  /** 1–3, used only for the visual risk meter (not a quantitative risk score). */
  riskTier: 1 | 2 | 3;
  character: string;
  tagline: string;
  description: string;
  profile: string;
  downside: string;
  riskStatement: string;
  traits: string[];
}

export const TARGET_LABEL = "Illustrative target — not guaranteed";

export const BOTS: Bot[] = [
  {
    id: "safe",
    name: "FUSION SAFE",
    shortName: "SAFE",
    min: 1,
    max: 2,
    risk: "Low",
    riskTier: 1,
    character: "Calm · Protective · Precise · Stable",
    tagline: "The guardian of the fleet.",
    description:
      "Designed around a more conservative trading approach. Returns are not assured and losses remain possible.",
    profile: "Conservative strategy profile with the lowest proposed target range of the three.",
    downside: "Losses are still possible. A lower target does not mean no risk.",
    riskStatement:
      "Lower-risk profile, but not risk-free. You could lose part of the capital allocated to trading.",
    traits: ["Conservative approach", "Lowest proposed target", "Losses remain possible"],
  },
  {
    id: "core",
    name: "FUSION CORE",
    shortName: "CORE",
    min: 5,
    max: 10,
    risk: "Moderate",
    riskTier: 2,
    character: "Analytical · Adaptive · Balanced · Responsive",
    tagline: "The strategist at the centre.",
    description:
      "A more active strategy profile with increased volatility and risk compared with FUSION SAFE.",
    profile: "More active strategy profile balancing a higher proposed target against higher risk.",
    downside: "Higher volatility and a greater possibility of losses.",
    riskStatement:
      "Moderate-risk profile with higher volatility. Losses can be larger and more frequent than with SAFE.",
    traits: ["More active approach", "Higher volatility", "Greater possibility of loss"],
  },
  {
    id: "nova",
    name: "FUSION NOVA",
    shortName: "NOVA",
    min: 10,
    max: 15,
    risk: "High",
    riskTier: 3,
    character: "Powerful · Aggressive · High-energy · Unpredictable",
    tagline: "The supernova. Handle with care.",
    description:
      "An aggressive strategy profile with substantial risk. You could lose all capital allocated to the trading account.",
    profile: "Aggressive strategy profile with the highest proposed target and the highest risk.",
    downside: "Very high risk. The trading account could lose a substantial amount or be completely lost.",
    riskStatement:
      "High-risk profile. Substantial or total loss of the capital allocated to the trading account is possible.",
    traits: ["Aggressive approach", "Very high risk", "Total account loss possible"],
  },
];

export const getBot = (id: BotId) => BOTS.find((b) => b.id === id)!;

export const BOT_ACCENT: Record<BotId, { color: string; soft: string }> = {
  safe: { color: "#3fd8ff", soft: "rgb(63 216 255 / 0.14)" },
  core: { color: "#9478ff", soft: "rgb(148 120 255 / 0.16)" },
  nova: { color: "#ff8a3d", soft: "rgb(255 138 61 / 0.15)" },
};
