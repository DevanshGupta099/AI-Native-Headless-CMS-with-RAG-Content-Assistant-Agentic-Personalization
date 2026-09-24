export interface SegmentDefinition {
  id: string;
  name: string;
  ruleJson: Record<string, unknown>;
}

export interface ContentVariantData {
  id: string;
  contentItemId: string;
  segmentId: string;
  variantBody: Record<string, unknown>;
}

export interface DeliveryContext {
  contentId: string;
  sessionId: string;
  traits?: Record<string, unknown>;
  referrer?: string;
  isNewVisitor?: boolean;
}

export interface DeliveryResolution {
  contentItemId: string;
  servedVariantId?: string | null;
  matchedSegmentId?: string | null;
  body: Record<string, unknown>;
  isFallback: boolean;
}
