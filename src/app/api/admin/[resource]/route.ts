import { type NextRequest, NextResponse } from "next/server";
import { getCurrentAdminProfile } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AdminPermission } from "@/types/admin";

const resourceMap: Record<string, { table: string; permission: AdminPermission }> = {
  articles: { table: "articles", permission: "content:manage" },
  attractions: { table: "attractions", permission: "content:manage" },
  food: { table: "restaurants", permission: "content:manage" },
  hotels: { table: "hotels", permission: "content:manage" },
  "affiliate-links": { table: "affiliate_links", permission: "affiliate:manage" },
  ads: { table: "ads", permission: "ads:manage" },
  users: { table: "profiles", permission: "users:manage" },
  categories: { table: "categories", permission: "taxonomy:manage" },
  tags: { table: "tags", permission: "taxonomy:manage" },
  media: { table: "media_assets", permission: "media:manage" },
  merchants: { table: "merchants", permission: "merchants:manage" },
  settings: { table: "site_settings", permission: "settings:manage" }
};

async function getAdminTable(resource: string) {
  const config = resourceMap[resource];
  const profile = await getCurrentAdminProfile();
  const supabase = createSupabaseAdminClient();

  if (!config) {
    return { error: NextResponse.json({ error: "Unknown resource" }, { status: 404 }) };
  }

  if (!profile || !supabase) {
    return { error: NextResponse.json({ error: "Admin role and Supabase service role are required." }, { status: 403 }) };
  }

  return { table: config.table, supabase };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  const guard = await getAdminTable(resource);
  if (guard.error) return guard.error;

  const body = (await request.json()) as { values?: Record<string, unknown> };
  const db = guard.supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db.from(guard.table).insert(body.values ?? {}).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  const guard = await getAdminTable(resource);
  if (guard.error) return guard.error;

  const body = (await request.json()) as { id?: string; values?: Record<string, unknown> };
  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const db = guard.supabase as unknown as LooseSupabaseClient;
  const { data, error } = await db.from(guard.table).update(body.values ?? {}).eq("id", body.id).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  const guard = await getAdminTable(resource);
  if (guard.error) return guard.error;

  const body = (await request.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const db = guard.supabase as unknown as LooseSupabaseClient;
  const { error } = await db.from(guard.table).delete().eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

type LooseSupabaseClient = {
  from: (table: string) => {
    insert: (values: Record<string, unknown>) => {
      select: () => { single: () => Promise<{ data: unknown; error: { message: string } | null }> };
    };
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: string) => {
        select: () => { single: () => Promise<{ data: unknown; error: { message: string } | null }> };
      };
    };
    delete: () => {
      eq: (column: string, value: string) => Promise<{ error: { message: string } | null }>;
    };
  };
};
