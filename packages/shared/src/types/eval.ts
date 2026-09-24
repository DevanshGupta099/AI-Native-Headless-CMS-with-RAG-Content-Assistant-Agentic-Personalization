import { EvalType } from '../constants';

export interface EvalRunInput {
  evalType: EvalType;
  targetId?: string;
  sampleSize?: number;
}

export interface EvalResultData {
  id: string;
  evalType: EvalType;
  targetId?: string | null;
  score: number;
  detailsJson: Record<string, unknown>;
  createdAt: string;
}
