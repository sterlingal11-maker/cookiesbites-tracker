import { createClient } from "@supabase/supabase-js";

// ─── Supabase connection ───────────────────────────────────────────
// These are set in .env.local (never commit secrets to git)
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

export const isSupabaseConfigured = () => !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// ─── Table: cb_app_data  (key TEXT PRIMARY KEY, value JSONB) ──────
// Prefixed with "cb_" so it never conflicts with any other app
// (e.g. Delightful Meals) sharing the same Supabase project.

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

// Load all keys in one query — avoids N round trips on initial load
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
