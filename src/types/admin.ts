export type AdminRole = "admin" | "editor" | "ads_manager" | "merchant" | "user";

export type AdminPermission =
  | "dashboard:read"
  | "content:manage"
  | "map:manage"
  | "affiliate:manage"
  | "ads:manage"
  | "users:manage"
  | "taxonomy:manage"
  | "seo:manage"
  | "media:manage"
  | "merchants:manage"
  | "roles:manage"
  | "import_export:manage"
  | "settings:manage"
  | "audit:read";

export type AdminRecordValue = string | number | boolean | null | undefined | string[] | number[];

export type AdminRecord = {
  id: string;
  [key: string]: AdminRecordValue;
};

export type AdminFieldType =
  | "text"
  | "textarea"
  | "number"
  | "url"
  | "select"
  | "boolean"
  | "datetime"
  | "tags";

export type AdminFieldOption = {
  label: string;
  value: string;
};

export type AdminField = {
  key: string;
  label: string;
  type?: AdminFieldType;
  placeholder?: string;
  options?: AdminFieldOption[];
  span?: "full" | "half";
  readOnly?: boolean;
};

export type AdminColumn = {
  key: string;
  label: string;
  sortable?: boolean;
  status?: boolean;
  align?: "left" | "right" | "center";
};

export type AdminFilter = {
  key: string;
  label: string;
  options: AdminFieldOption[];
};

export type AdminBulkAction = {
  id: string;
  label: string;
  kind: "set-status" | "set-active" | "delete" | "custom";
  key?: string;
  value?: AdminRecordValue;
  confirm?: string;
};

export type AdminStat = {
  label: string;
  value: string | number;
  helper?: string;
  trend?: string;
};

export type AdminFeatureSection = {
  title: string;
  description?: string;
  items: string[];
};

export type AdminResourceConfig = {
  title: string;
  description: string;
  resourceLabel: string;
  apiResource?: string;
  rows: AdminRecord[];
  columns: AdminColumn[];
  fields: AdminField[];
  filters?: AdminFilter[];
  bulkActions?: AdminBulkAction[];
  searchableKeys?: string[];
  dbFields?: string[];
  stats?: AdminStat[];
  featureSections?: AdminFeatureSection[];
};
