import { RunEvalSchema, RunEvalInput, EvalResultData, EvalType } from '@contentpilot/shared';

export { RunEvalSchema };
export type { RunEvalInput, EvalResultData, EvalType };

export interface RetrievalMetricResult {
  queryId: string;
  query: string;
  hits: number;
  precisionAtK: number;
  matchedKeywords: string[];
}

export interface RetrievalEvalDetails {
  totalQueriesEvaluated: number;
  averagePrecisionAtK: number;
  k: number;
  queryBreakdown: RetrievalMetricResult[];
}

export interface AgentEvalDetails {
  totalActionLogs: number;
  completedTasks: number;
  failedTasks: number;
  completionRate: number;
  stepSuccessRate: number;
  totalStepsEvaluated: number;
}

export interface PersonalizationEvalDetails {
  totalImpressions: number;
  personalizedImpressions: number;
  defaultImpressions: number;
  variantServingRate: number;
  ruleEngineAccuracy: number;
}

export interface EvalSummary {
  retrievalPrecision: { score: number; lastEvaluatedAt: string | null } | null;
  agentReliability: { score: number; lastEvaluatedAt: string | null } | null;
  personalizationCorrectness: { score: number; lastEvaluatedAt: string | null } | null;
}
