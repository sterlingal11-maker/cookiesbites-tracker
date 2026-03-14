import { createClient } from "@supabase/supabase-js";

// ─── Supabase connection ───────────────────────────────────────────
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

export const isSupabaseConfigured = () => !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// ─── Storage bucket: "cb-media" ───────────────────────────────────
// All user-uploaded files (event photos/videos, catalog photos,
// meal photos, logo) are stored here as real files.
// The database only stores the public URL, not the raw bytes.

const BUCKET = "cb-media";

/**
 * Upload a File object to Supabase Storage.
 * Returns the public URL on success, or null on failure.
 * Falls back to base64 data URL if Supabase is not configured.
 */
export async function uploadFile(file, folder = "misc") {
  // No Supabase → fall back to base64 (offline / unconfigured)
  if (!supabase) return readAsDataURL(file);

  const ext  = file.name.split(".").pop() || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) {
    console.error("[uploadFile]", error.message);
    // Fall back to base64 so the UI still works
    return readAsDataURL(file);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data?.publicUrl ?? null;
}

/** Helper: read File as base64 data URL (Promise) */
export function readAsDataURL(file) {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = (e) => resolve(e.target.result);
    r.readAsDataURL(file);
  });
}

// ─── Table: cb_app_data  (key TEXT PRIMARY KEY, value JSONB) ──────

export async function cloudGet(key) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("cb_app_data")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) { console.error("[cloudGet]", key, error.message); return null; }
    return data?.value ?? null;
  } catch (e) {
    console.error("[cloudGet]", key, e);
    return null;
  }
}

export async function cloudSet(key, value) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("cb_app_data")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) { console.error("[cloudSet]", key, error.message); return false; }
    return true;
  } catch (e) {
    console.error("[cloudSet]", key, e);
    return false;
  }
}

export async function cloudGetAll(keys) {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase
      .from("cb_app_data")
      .select("key, value")
      .in("key", keys);
    if (error) { console.error("[cloudGetAll]", error.message); return {}; }
    const map = {};
    (data || []).forEach(row => { map[row.key] = row.value; });
    return map;
  } catch (e) {
    console.error("[cloudGetAll]", e);
    return {};
  }
}
