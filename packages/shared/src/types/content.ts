import { ContentType, ContentStatus } from '../constants';

export interface ContentItemSummary {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  status: ContentStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentVersionSummary {
  id: string;
  contentItemId: string;
  versionNo: number;
  bodyJson: Record<string, unknown>;
  metaJson?: Record<string, unknown> | null;
  createdAt: string;
}

export interface ContentItemDetail extends ContentItemSummary {
  currentVersion?: ContentVersionSummary;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ContentListResponse {
  data: ContentItemSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    timestamp: string;
  };
}
