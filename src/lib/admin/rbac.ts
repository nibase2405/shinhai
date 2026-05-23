import type { AdminPermission, AdminRole } from "@/types/admin";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: string;
  permission: AdminPermission;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  admin: "Admin",
  editor: "Editor",
  ads_manager: "Ads Manager",
  merchant: "Merchant",
  user: "User"
};

const rolePermissions: Record<AdminRole, AdminPermission[]> = {
  admin: [
    "dashboard:read",
    "content:manage",
    "map:manage",
    "affiliate:manage",
    "ads:manage",
    "users:manage",
    "taxonomy:manage",
    "seo:manage",
    "media:manage",
    "merchants:manage",
    "roles:manage",
    "import_export:manage",
    "settings:manage",
    "audit:read"
  ],
  editor: [
    "dashboard:read",
    "content:manage",
    "map:manage",
    "taxonomy:manage",
    "seo:manage",
    "media:manage",
    "import_export:manage"
  ],
  ads_manager: ["dashboard:read", "affiliate:manage", "ads:manage", "merchants:manage"],
  merchant: ["dashboard:read", "merchants:manage", "map:manage"],
  user: []
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "總覽",
    items: [
      { href: "/admin/dashboard", label: "儀表板", icon: "dashboard", permission: "dashboard:read" }
    ]
  },
  {
    label: "內容營運",
    items: [
      { href: "/admin/articles", label: "文章管理", icon: "articles", permission: "content:manage" },
      { href: "/admin/xiaohongshu-import", label: "小紅書匯入", icon: "importExport", permission: "content:manage" },
      { href: "/admin/attractions", label: "景點管理", icon: "attractions", permission: "content:manage" },
      { href: "/admin/food", label: "美食管理", icon: "food", permission: "content:manage" },
      { href: "/admin/hotels", label: "住宿管理", icon: "hotels", permission: "content:manage" },
      { href: "/admin/map", label: "地圖資料", icon: "map", permission: "map:manage" }
    ]
  },
  {
    label: "成長與變現",
    items: [
      { href: "/admin/affiliate-links", label: "Affiliate Links", icon: "affiliate", permission: "affiliate:manage" },
      { href: "/admin/travelpayouts", label: "Travelpayouts", icon: "affiliate", permission: "affiliate:manage" },
      { href: "/admin/affiliate-clicks", label: "點擊統計", icon: "clicks", permission: "affiliate:manage" },
      { href: "/admin/ads", label: "廣告版位", icon: "ads", permission: "ads:manage" },
      { href: "/admin/merchants", label: "商家廣告", icon: "merchants", permission: "merchants:manage" }
    ]
  },
  {
    label: "SEO 與素材",
    items: [
      { href: "/admin/categories", label: "分類管理", icon: "categories", permission: "taxonomy:manage" },
      { href: "/admin/tags", label: "標籤管理", icon: "tags", permission: "taxonomy:manage" },
      { href: "/admin/seo", label: "SEO 中心", icon: "seo", permission: "seo:manage" },
      { href: "/admin/media", label: "媒體庫", icon: "media", permission: "media:manage" }
    ]
  },
  {
    label: "系統",
    items: [
      { href: "/admin/users", label: "會員管理", icon: "users", permission: "users:manage" },
      { href: "/admin/roles", label: "權限管理", icon: "roles", permission: "roles:manage" },
      { href: "/admin/import-export", label: "匯入匯出", icon: "importExport", permission: "import_export:manage" },
      { href: "/admin/settings", label: "系統設定", icon: "settings", permission: "settings:manage" },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: "audit", permission: "audit:read" }
    ]
  }
];

export function normalizeAdminRole(role?: string | null): AdminRole {
  if (role === "admin" || role === "editor" || role === "ads_manager" || role === "merchant" || role === "user") {
    return role;
  }

  return "user";
}

export function hasAdminPermission(role: AdminRole, permission: AdminPermission) {
  return rolePermissions[role].includes(permission);
}

export function canAccessAdmin(role: AdminRole) {
  return rolePermissions[role].length > 0;
}

export function getVisibleAdminNavGroups(role: AdminRole) {
  return ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => hasAdminPermission(role, item.permission))
  })).filter((group) => group.items.length > 0);
}
