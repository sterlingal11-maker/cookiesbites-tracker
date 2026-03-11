import { useState, useRef, useMemo, useEffect } from "react";

// ─── MOBILE DETECTION HOOK ────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ─── THEME ────────────────────────────────────────────────────────
const T = {
  bg: "#0D0D0D",
  surface: "#141414",
  card: "#1A1A1A",
  border: "#252525",
  accent: "#E8C547",
  accentSoft: "rgba(232,197,71,0.10)",
  text: "#EDEBE4",
  textMuted: "#7A7670",
  textDim: "#4A4844",
  success: "#3DB86A",
  warning: "#D4900A",
  danger: "#D94F4F",
  info: "#4880D4",
  restaurant: "#D4724A",
  delivery: "#4A98D4",
  catering: "#9A4AD4",
};
const fmt = (n) => {
  const v = Math.round(n || 0);
  return v.toLocaleString("en-US") + " XAF";
};
const fmtShort = (n) => {
  const v = Math.round(n || 0);
  if (v >= 1000000)
    return (v / 1000000).toFixed(1).replace(/\.0$/, "") + "M XAF";
  if (v >= 1000)
    return (
      (v / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "k XAF"
    );
  return v.toLocaleString("en-US") + " XAF";
};

const APP_TODAY = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
function getPeriodRange(period, customFrom, customTo) {
  const d = new Date(APP_TODAY);
  const y = d.getFullYear(),
    m = d.getMonth();
  const dow = d.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  switch (period) {
    case "today":
      return [new Date(d), new Date(d)];
    case "this_week": {
      const mon = new Date(d);
      mon.setDate(d.getDate() + mondayOffset);
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      return [mon, sun];
    }
    case "last_week": {
      const mon = new Date(d);
      mon.setDate(d.getDate() + mondayOffset - 7);
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      return [mon, sun];
    }
    case "this_month":
      return [new Date(y, m, 1), new Date(y, m + 1, 0)];
    case "last_month":
      return [new Date(y, m - 1, 1), new Date(y, m, 0)];
    case "last_7": {
      const s = new Date(d);
      s.setDate(d.getDate() - 6);
      return [s, new Date(d)];
    }
    case "last_30": {
      const s = new Date(d);
      s.setDate(d.getDate() - 29);
      return [s, new Date(d)];
    }
    case "last_90": {
      const s = new Date(d);
      s.setDate(d.getDate() - 89);
      return [s, new Date(d)];
    }
    case "ytd":
      return [new Date(y, 0, 1), new Date(d)];
    case "custom":
      return [
        customFrom ? new Date(customFrom) : new Date(y, 0, 1),
        customTo ? new Date(customTo) : new Date(d),
      ];
    default:
      return [new Date(y, 0, 1), new Date(d)];
  }
}
const inRange = (dateStr, from, to) => {
  const d = new Date(dateStr);
  return d >= from && d <= to;
};
const fmtDate = (d) =>
  d.toLocaleDateString("fr-CM", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const PERIOD_LABELS = {
  today: "Today",
  this_week: "This Week",
  last_week: "Last Week",
  this_month: "This Month",
  last_month: "Last Month",
  last_7: "Last 7 Days",
  last_30: "Last 30 Days",
  last_90: "Last 90 Days",
  ytd: "Year to Date",
  custom: "Custom Range",
};

// ─── INITIAL DATA ─────────────────────────────────────────────────
const INIT_BIZ = {
  name: "Cookies Bites",
  tagline: "Catering & Restaurant Services",
  address: "Rue Njo Njo, Akwa",
  city: "Douala, Cameroun",
  phone: "+237 6XX XXX XXX",
  phone2: "",
  email: "cookiesbites@email.cm",
  website: "",
  rccm: "",
  taxId: "",
  paymentTerms:
    "Payment accepted by Cash, Mobile Money (MoMo), and Bank Transfer.",
  bankName: "",
  bankAccount: "",
  footer:
    "Thank you for choosing Cookies Bites — we look forward to serving you!",
};

const CAT_CATS = [
  { id: 1, name: "🍚 Rice Dishes" },
  { id: 2, name: "🍗 Chicken" },
  { id: 3, name: "🥩 Beef & Goat" },
  { id: 4, name: "🐟 Fish & Seafood" },
  { id: 5, name: "🫙 Stews & Sauces" },
  { id: 6, name: "🌿 Vegetarian" },
  { id: 7, name: "🍟 Sides" },
  { id: 8, name: "🍰 Desserts" },
  { id: 9, name: "🍹 Drinks" },
  { id: 10, name: "🎉 Add-ons" },
  { id: 11, name: "🚗 Logistics" },
  { id: 12, name: "👨‍🍳 Staffing" },
  { id: 13, name: "🏢 Corporate" },
  { id: 14, name: "🎊 Seasonal" },
  { id: 15, name: "🍽️ Starters" },
  { id: 16, name: "🥂 Service Styles" },
  { id: 17, name: "🏕️ Equipment" },
];

const CAT_ITEMS = [];

// ─── MEALS (Restaurant menu items with inventory linking) ─────────
const INIT_MEALS = [];

const INIT_EVENTS = [];

const INIT_INVENTORY = [];

const INIT_SALES = [];

const INIT_INVOICES = [];

const INIT_PROPOSALS = [];

// ─── OVERHEAD / EXPENSE ENTRY TYPES ──────────────────────────────
// entryType: "opex"   = direct operating expense (hits P&L)
//            "capex"  = asset purchase (hits Balance Sheet as Fixed Asset, depreciated)
//            "liability_payment" = payment against an existing liability (AP / loan)
// paymentStatus: "paid" | "unpaid" (unpaid = Accounts Payable)

const OVERHEAD_CATS = [
  "Rent & Premises",
  "Utilities",
  "Personnel",
  "Transportation",
  "Marketing",
  "Equipment",
  "Insurance",
  "Professional Fees",
  "Subscriptions",
  "Maintenance",
  "Other",
];
const OVERHEAD_FREQ = ["Monthly", "Quarterly", "Annually", "One-time"];
const OVERHEAD_ASSET_CATS = [
  "Equipment",
  "Furniture & Fixtures",
  "Vehicles",
  "Technology / IT",
  "Leasehold Improvements",
  "Other Asset",
];

const ENTRY_TYPES = [
  {
    value: "opex",
    label: "Operating Expense",
    icon: "📋",
    desc: "Regular expense — rent, salaries, utilities, marketing…",
  },
  {
    value: "capex",
    label: "Asset Purchase",
    icon: "🏗️",
    desc: "Purchase of a fixed asset — equipment, vehicle, furniture…",
  },
  {
    value: "liability_payment",
    label: "Liability / AP Payment",
    icon: "💳",
    desc: "Payment against a supplier debt, loan, or payable balance",
  },
];

const INIT_OVERHEADS = [];

// ─── HELPERS ──────────────────────────────────────────────────────
const eCOGS = (c) =>
  (c?.inventory || 0) +
  (c?.labor || 0) +
  (c?.transport || 0) +
  (c?.overhead || 0);
const propTotal = (lines, disc = 0) =>
  lines.reduce((s, l) => s + l.qty * l.price, 0) - disc;
const orderTotal = (s) => s.plates * s.pricePerPlate + (s.deliveryFee || 0);

// Compute COGS for a restaurant sale using meal ingredient-level costing when available,
// falling back to catalog cost-rate estimate
const orderCOGS = (s, catalogItems, meals) => {
  // Try meals data first (ingredient-level costing)
  if (meals && meals.length) {
    const meal = meals.find(
      (m) =>
        m.name.toLowerCase() === s.meal.toLowerCase() ||
        m.name.toLowerCase().includes(s.meal.toLowerCase().split(" ")[0])
    );
    if (meal) {
      // ingredient cost requires inventory — pass 0 if no inventory context (inventory is computed inside getMealTotalCost)
      // We store a cached costPerPlate on the meal object if available via ingredientLinks
      // Fall through to catalog if meal has no costing data set up
      const hasCost =
        meal.laborCost > 0 ||
        (meal.otherCosts && meal.otherCosts.length > 0) ||
        (meal.ingredientLinks && meal.ingredientLinks.length > 0);
      if (hasCost) {
        // Use laborCost + otherCosts; ingredient cost needs inventory, approximate from catalogItems
        const cat = catalogItems.find((i) =>
          i.name.toLowerCase().includes(s.meal.toLowerCase().split(" ")[0])
        );
        const ingCost = cat ? cat.costPerUnit : 0;
        const otherCost = (meal.otherCosts || []).reduce(
          (a, c) => a + Number(c.amount || 0),
          0
        );
        return (
          s.plates * (ingCost + Number(meal.laborCost || 0) + otherCost) +
          (s.deliveryFee || 0) * 0.4
        );
      }
    }
  }
  // Fallback: catalog cost-rate
  const item = catalogItems.find((i) =>
    i.name.toLowerCase().includes(s.meal.toLowerCase().split(" ")[0])
  );
  const costRate = item ? item.costPerUnit / item.price : 0.45;
  return (
    s.plates * s.pricePerPlate * Math.min(costRate, 0.75) +
    (s.deliveryFee || 0) * 0.4
  );
};

// Compute total inventory stock value
const inventoryValue = (inventory) =>
  inventory.reduce((s, i) => s + (i.stock || 0) * (i.costPerUnit || 0), 0);

// Separate overheads by entry type for financial reports
const splitOverheads = (overheads) => {
  const opex = overheads.filter((o) => (o.entryType || "opex") === "opex");
  const capex = overheads.filter((o) => (o.entryType || "opex") === "capex");
  const liabPay = overheads.filter(
    (o) => (o.entryType || "opex") === "liability_payment"
  );
  // Unpaid opex = Accounts Payable
  const ap = opex
    .filter((o) => o.paymentStatus === "unpaid")
    .reduce((s, o) => s + Number(o.amount), 0);
  // Unpaid capex = still owed on assets
  const capexAP = capex
    .filter((o) => o.paymentStatus === "unpaid")
    .reduce((s, o) => s + Number(o.amount), 0);
  // Total fixed assets (all capex entries regardless of payment status)
  const fixedAssets = capex.reduce((s, o) => s + Number(o.amount), 0);
  // Total opex paid (hits P&L)
  const totalOpex = opex.reduce((s, o) => s + Number(o.amount), 0);
  const paidOpex = opex
    .filter((o) => o.paymentStatus !== "unpaid")
    .reduce((s, o) => s + Number(o.amount), 0);
  // Total liability payments made (reduces AP / loan balance)
  const totalLiabPaid = liabPay.reduce((s, o) => s + Number(o.amount), 0);
  return {
    opex,
    capex,
    liabPay,
    ap,
    capexAP,
    fixedAssets,
    totalOpex,
    paidOpex,
    totalLiabPaid,
  };
};
const daysOD = (due) => {
   const d = Math.floor((APP_TODAY - new Date(due)) / 86400000);
  return d > 0 ? d : 0;
};
const ageBucket = (days) => {
  if (days === 0) return "Current";
  if (days <= 7) return "1–7 days";
  if (days <= 30) return "8–30 days";
  if (days <= 60) return "31–60 days";
  return "61+ days";
};
const TODAY_LABEL = APP_TODAY.toLocaleDateString("fr-CM", { day: "2-digit", month: "short", year: "numeric" });
const TODAY_ISO = APP_TODAY.toISOString().slice(0, 10);
const THIS_YEAR = APP_TODAY.getFullYear();

const PIPELINE_PHASES = [
  "Lead / Inquiry",
  "Quotation Sent",
  "Confirmed",
  "Planning",
  "Procurement / Prep",
  "Cooking / Packing",
  "Delivery / Setup",
  "Event Completed",
  "Invoice Issued",
  "Paid",
  "Closed / Archived",
  "Cancelled",
];

// ─── STYLES ───────────────────────────────────────────────────────
const S = {
  app: {
    fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
    background: T.bg,
    color: T.text,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontSize: 13,
  },
  topbar: {
    background: T.surface,
    borderBottom: `1px solid ${T.border}`,
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    height: 50,
    flexShrink: 0,
  },
  nav: { display: "flex", gap: 3, overflowX: "auto", flex: 1 },
  navBtn: (a) => ({
    background: a ? T.accentSoft : "transparent",
    color: a ? T.accent : T.textMuted,
    border: `1px solid ${a ? T.accent : "transparent"}`,
    borderRadius: 5,
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
    transition: "all 0.12s",
  }),
  main: {
    flex: 1,
    padding: "16px 20px",
    maxWidth: 1400,
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  mainMobile: {
    flex: 1,
    padding: "12px 12px 80px",
    width: "100%",
    boxSizing: "border-box",
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: 700,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  subtitle: { color: T.textMuted, fontSize: 11, marginBottom: 16 },
  grid: (n) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${n},1fr)`,
    gap: 10,
  }),
  gridMobile: { display: "grid", gridTemplateColumns: "1fr", gap: 10 },
  grid2Mobile: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  card: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: 14,
  },
  cardMobile: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: 12,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: T.textMuted,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  kpi: { fontSize: 20, fontWeight: 800, letterSpacing: -0.3, color: T.accent },
  kpiSub: { fontSize: 10, color: T.textMuted, marginTop: 1 },
  badge: (c) => ({
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
    background: `${c}20`,
    color: c,
  }),
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "6px 9px",
    textAlign: "left",
    fontSize: 10,
    fontWeight: 700,
    color: T.textMuted,
    letterSpacing: 0.3,
    borderBottom: `1px solid ${T.border}`,
    whiteSpace: "nowrap",
  },
  td: {
    padding: "7px 9px",
    fontSize: 12,
    borderBottom: `1px solid ${T.border}18`,
    verticalAlign: "middle",
  },
  btn: (v) => ({
    background:
      v === "primary"
        ? T.accent
        : v === "success"
        ? T.success
        : v === "danger"
        ? T.danger
        : "transparent",
    color:
      v === "primary"
        ? T.bg
        : v === "success" || v === "danger"
        ? "#fff"
        : T.text,
    border: v === "ghost" ? `1px solid ${T.border}` : "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 12,
    transition: "all 0.12s",
    whiteSpace: "nowrap",
  }),
  input: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 6,
    padding: "6px 9px",
    color: T.text,
    fontSize: 12,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 6,
    padding: "6px 9px",
    color: T.text,
    fontSize: 12,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: T.textMuted,
    display: "block",
    marginBottom: 3,
  },
  row: { display: "flex", gap: 8, alignItems: "center" },
  divider: {
    border: "none",
    borderTop: `1px solid ${T.border}`,
    margin: "10px 0",
  },
  pb: (col) => ({
    height: 3,
    borderRadius: 3,
    background: `${col}25`,
    position: "relative",
    overflow: "hidden",
  }),
  pbf: (pct, col) => ({
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `${Math.min(100, pct)}%`,
    background: col,
    borderRadius: 3,
  }),
  sectionTitle: { fontSize: 13, fontWeight: 700, marginBottom: 10 },
  tag: {
    display: "inline-block",
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 3,
    padding: "1px 4px",
    fontSize: 10,
    marginRight: 3,
    color: T.textMuted,
  },
};

// Responsive grid: on mobile, cols > 2 collapse to 1 (or 2 for small items)
const rGrid = (n, isMobile, forceCols) => {
  if (!isMobile) return S.grid(n);
  if (forceCols) return S.grid(forceCols);
  return n <= 2 ? S.grid(n) : S.gridMobile;
};
const Badge = ({ color = T.accent, children }) => (
  <span style={S.badge(color)}>{children}</span>
);
const Divider = () => <hr style={S.divider} />;
const PBar = ({ pct, color = T.accent }) => (
  <div style={S.pb(color)}>
    <div style={S.pbf(pct, color)} />
  </div>
);

// Wraps tables for horizontal scroll on mobile
const TableScroll = ({ children }) => (
  <div
    style={{
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
      marginLeft: -12,
      marginRight: -12,
      paddingLeft: 12,
      paddingRight: 12,
    }}
  >
    {children}
  </div>
);

// Mobile stat row (replaces multi-column grid on mobile)
function MobileStatRow({ items }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(items.length, 2)}, 1fr)`,
        gap: 8,
        marginBottom: 12,
      }}
    >
      {items.map((item, i) => (
        <div key={i} style={{ ...S.cardMobile, padding: "10px 12px" }}>
          <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 2 }}>
            {item.icon} {item.label}
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: item.color || T.accent,
            }}
          >
            {item.value}
          </div>
          {item.sub && (
            <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>
              {item.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Mobile bottom nav
function MobileNav({ tab, setTab, tabs }) {
  const visible = tabs.slice(0, 5); // show first 5 in bottom bar
  const overflow = tabs.slice(5);
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      {showMore && (
        <div
          style={{
            position: "fixed",
            bottom: 60,
            left: 0,
            right: 0,
            zIndex: 900,
            background: T.surface,
            borderTop: `1px solid ${T.border}`,
            padding: 8,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
          }}
        >
          {overflow.map((t) => (
            <button
              key={t.id}
              style={{
                ...S.navBtn(tab === t.id),
                textAlign: "left",
                padding: "10px 12px",
                fontSize: 13,
              }}
              onClick={() => {
                setTab(t.id);
                setShowMore(false);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: T.surface,
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          height: 58,
          alignItems: "stretch",
        }}
      >
        {visible.map((t) => {
          const active = tab === t.id;
          const icon = t.label.split(" ")[0];
          const name = t.label
            .split(" ")
            .slice(1)
            .join(" ")
            .replace(" & ", "/")
            .replace(" Delivery", "");
          return (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setShowMore(false);
              }}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                borderTop: active
                  ? `2px solid ${T.accent}`
                  : "2px solid transparent",
                transition: "all 0.12s",
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: active ? 700 : 500,
                  color: active ? T.accent : T.textMuted,
                  lineHeight: 1,
                }}
              >
                {name.slice(0, 8)}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setShowMore(!showMore)}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            borderTop: overflow.some((t) => t.id === tab)
              ? `2px solid ${T.accent}`
              : "2px solid transparent",
          }}
        >
          <span style={{ fontSize: 18 }}>☰</span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 500,
              color: overflow.some((t) => t.id === tab)
                ? T.accent
                : T.textMuted,
            }}
          >
            More
          </span>
        </button>
      </div>
    </>
  );
}

function KpiCard({ label, value, sub, color = T.accent, icon = "" }) {
  return (
    <div style={S.card}>
      <div style={S.cardTitle}>
        {icon} {label}
      </div>
      <div style={{ ...S.kpi, color }}>{value}</div>
      {sub && <div style={S.kpiSub}>{sub}</div>}
    </div>
  );
}

function PhaseBadge({ phase }) {
  const c = {
    "Lead / Inquiry": T.info,
    "Quotation Sent": T.warning,
    Confirmed: T.success,
    Planning: T.catering,
    "Procurement / Prep": T.warning,
    "Cooking / Packing": T.restaurant,
    "Delivery / Setup": T.delivery,
    "Event Completed": T.success,
    "Invoice Issued": T.accent,
    Paid: "#3DE890",
    "Closed / Archived": T.textDim,
    Cancelled: T.danger,
  };
  return <Badge color={c[phase] || T.textMuted}>{phase}</Badge>;
}

// ─── MEDIA UPLOADER ───────────────────────────────────────────────
function MediaGallery({ media, onAdd, onDelete, title = "Event Media" }) {
  const fileRef = useRef();
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((f) => {
      const r = new FileReader();
      r.onload = (ev) => {
        const isVideo = f.type.startsWith("video/");
        onAdd({
          id: Date.now() + Math.random(),
          src: ev.target.result,
          type: isVideo ? "video" : "image",
          name: f.name,
          uploadedAt: TODAY_LABEL,
        });
      };
      r.readAsDataURL(f);
    });
    e.target.value = "";
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: T.textMuted,
            textTransform: "uppercase",
            letterSpacing: 0.7,
          }}
        >
          {title} ({media.length})
        </div>
        <button
          style={{ ...S.btn("ghost"), fontSize: 10, padding: "3px 8px" }}
          onClick={() => fileRef.current.click()}
        >
          📎 Upload Photos/Videos
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFiles}
        />
      </div>
      {media.length === 0 ? (
        <div
          style={{
            padding: "20px 0",
            textAlign: "center",
            color: T.textDim,
            fontSize: 11,
            border: `1px dashed ${T.border}`,
            borderRadius: 8,
            cursor: "pointer",
          }}
          onClick={() => fileRef.current.click()}
        >
          <div style={{ fontSize: 24, marginBottom: 4 }}>📷</div>
          <div>Click to upload event photos & videos</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 6,
          }}
        >
          {media.map((m) => (
            <div
              key={m.id}
              style={{
                position: "relative",
                borderRadius: 7,
                overflow: "hidden",
                border: `1px solid ${T.border}`,
                aspectRatio: "1",
                background: T.surface,
              }}
            >
              {m.type === "video" ? (
                <video
                  src={m.src}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  controls={false}
                  onClick={(e) => {
                    e.currentTarget.paused
                      ? e.currentTarget.play()
                      : e.currentTarget.pause();
                  }}
                />
              ) : (
                <img
                  src={m.src}
                  alt={m.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0.4)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0)")
                }
              >
                <button
                  style={{
                    position: "absolute",
                    top: 3,
                    right: 3,
                    background: T.danger,
                    border: "none",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    fontSize: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0";
                  }}
                  onClick={() => onDelete(m.id)}
                >
                  ✕
                </button>
                {m.type === "video" && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 3,
                      left: 3,
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      fontSize: 8,
                      padding: "1px 4px",
                      borderRadius: 3,
                    }}
                  >
                    ▶ VIDEO
                  </div>
                )}
              </div>
            </div>
          ))}
          <div
            style={{
              border: `1px dashed ${T.border}`,
              borderRadius: 7,
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.textDim,
              fontSize: 20,
            }}
            onClick={() => fileRef.current.click()}
          >
            +
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LOGO + BRAND ─────────────────────────────────────────────────
function LogoArea({ logo, setLogo, biz, onSettings }) {
  const ref = useRef();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {logo?.src ? (
        <img
          src={logo.src}
          alt="logo"
          style={{
            height: 30,
            maxWidth: 110,
            objectFit: "contain",
            borderRadius: 3,
          }}
        />
      ) : (
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: T.accent,
            letterSpacing: -0.3,
            whiteSpace: "nowrap",
          }}
        >
          {biz.name}
        </div>
      )}
      <button
        style={{ ...S.btn("ghost"), fontSize: 10, padding: "2px 6px" }}
        onClick={() => ref.current.click()}
      >
        ↑ Logo
      </button>
      {logo?.src && (
        <button
          style={{
            background: "none",
            border: "none",
            color: T.textDim,
            cursor: "pointer",
            fontSize: 10,
          }}
          onClick={() => setLogo(null)}
        >
          ✕
        </button>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = (ev) => setLogo({ src: ev.target.result });
          r.readAsDataURL(f);
        }}
      />
      {onSettings && (
        <button
          style={{ ...S.btn("ghost"), fontSize: 10, padding: "2px 6px" }}
          onClick={onSettings}
        >
          ⚙️ Settings
        </button>
      )}
    </div>
  );
}

// ─── BAR CHART ────────────────────────────────────────────────────
function BarChart({ data, height = 140 }) {
  if (!data || !data.length)
    return (
      <div
        style={{
          color: T.textMuted,
          fontSize: 11,
          textAlign: "center",
          padding: 20,
        }}
      >
        No data
      </div>
    );
  const maxVal = Math.max(...data.map((d) => d.sales || 0), 1);
  const barW = Math.max(18, Math.min(48, Math.floor(560 / data.length) - 6));
  return (
    <div style={{ overflowX: "auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
          height: height + 28,
          paddingBottom: 24,
          minWidth: data.length * (barW + 4),
          position: "relative",
        }}
      >
        {[0, 25, 50, 75, 100].map((pct) => (
          <div
            key={pct}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 24 + (pct / 100) * height,
              borderTop: `1px solid ${T.border}40`,
              pointerEvents: "none",
            }}
          />
        ))}
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              minWidth: barW,
              position: "relative",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: 1,
                alignItems: "flex-end",
                height,
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: T.restaurant,
                  borderRadius: "3px 3px 0 0",
                  height: d.sales ? (d.sales / maxVal) * height : 1,
                  minHeight: 1,
                  transition: "height 0.3s",
                }}
              />
              <div
                style={{
                  flex: 1,
                  background: T.success,
                  borderRadius: "3px 3px 0 0",
                  height:
                    d.profit && d.profit > 0 ? (d.profit / maxVal) * height : 1,
                  minHeight: 1,
                  opacity: 0.85,
                  transition: "height 0.3s",
                }}
              />
            </div>
            <div
              style={{
                fontSize: 9,
                color: T.textMuted,
                marginTop: 3,
                whiteSpace: "nowrap",
                textAlign: "center",
                overflow: "hidden",
                maxWidth: barW + 4,
              }}
            >
              {d.label}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 14,
          fontSize: 10,
          color: T.textMuted,
          marginTop: 2,
        }}
      >
        <span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              background: T.restaurant,
              borderRadius: 2,
              marginRight: 3,
            }}
          />
          Sales
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              background: T.success,
              borderRadius: 2,
              marginRight: 3,
            }}
          />
          Gross Profit
        </span>
      </div>
    </div>
  );
}

// ─── PERIOD SELECTOR ──────────────────────────────────────────────
function PeriodSelector({
  period,
  setPeriod,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  range,
}) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div style={{ marginBottom: 12 }}>
        <select
          style={{ ...S.select, marginBottom: 6 }}
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          {Object.entries(PERIOD_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        {period === "custom" && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="date"
              style={{ ...S.input, flex: 1, padding: "6px 7px" }}
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
            />
            <span style={{ color: T.textMuted, fontSize: 11, flexShrink: 0 }}>
              →
            </span>
            <input
              type="date"
              style={{ ...S.input, flex: 1, padding: "6px 7px" }}
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
            />
          </div>
        )}
        <div style={{ fontSize: 10, color: T.textDim, marginTop: 4 }}>
          {fmtDate(range[0])} – {fmtDate(range[1])}
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {Object.entries(PERIOD_LABELS).map(
          ([k, v]) =>
            k !== "custom" && (
              <button
                key={k}
                style={S.navBtn(period === k)}
                onClick={() => setPeriod(k)}
              >
                {v}
              </button>
            )
        )}
        <button
          style={S.navBtn(period === "custom")}
          onClick={() => setPeriod("custom")}
        >
          Custom
        </button>
      </div>
      {period === "custom" && (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            type="date"
            style={{ ...S.input, width: 130, padding: "4px 7px" }}
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
          />
          <span style={{ color: T.textMuted, fontSize: 11 }}>to</span>
          <input
            type="date"
            style={{ ...S.input, width: 130, padding: "4px 7px" }}
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
          />
        </div>
      )}
      <div
        style={{
          fontSize: 10,
          color: T.textDim,
          marginLeft: 4,
          whiteSpace: "nowrap",
        }}
      >
        {fmtDate(range[0])} – {fmtDate(range[1])}
      </div>
    </div>
  );
}

// ─── PRINT/DOC ENGINE ─────────────────────────────────────────────
const PRINT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',Arial,sans-serif;color:#1a1a1a;background:#fff;padding:40px;font-size:13px;line-height:1.5}
.doc-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #1a1a1a}
.brand-block img{height:50px;max-width:160px;object-fit:contain}
.brand-name{font-size:26px;font-weight:900;letter-spacing:-1px;color:#1a1a1a;line-height:1}
.brand-sub{font-size:11px;color:#666;margin-top:5px;line-height:1.7}
.doc-ref-block{text-align:right}
.doc-type{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;margin-bottom:4px}
.doc-number{font-size:28px;font-weight:900;color:#1a1a1a;letter-spacing:-0.5px}
.doc-meta{font-size:11px;color:#666;margin-top:4px;line-height:1.8}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
.party-box{background:#f8f8f8;border-radius:8px;padding:14px 16px}
.party-label{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-bottom:8px}
.party-name{font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:2px}
.party-detail{font-size:11px;color:#555;line-height:1.7}
.status-banner{border-radius:8px;padding:12px 16px;margin-bottom:24px;display:flex;align-items:center;gap:12}
.status-banner.paid{background:#f0fdf4;border:1.5px solid #86efac}
.status-banner.partial{background:#fffbeb;border:1.5px solid #fde68a}
.status-banner.unpaid{background:#fff5f5;border:1.5px solid #fca5a5}
.status-icon{font-size:22px}
.status-text strong{font-size:14px;display:block;margin-bottom:1px}
.status-text span{font-size:11px;color:#555}
.items-section{margin-bottom:28px}
.section-heading{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-bottom:10px}
table{width:100%;border-collapse:collapse}
thead tr{background:#1a1a1a;color:#fff}
thead th{padding:10px 12px;text-align:left;font-size:11px;font-weight:600;letter-spacing:0.3px}
thead th.tr{text-align:right}thead th.tc{text-align:center}
tbody tr:nth-child(even){background:#fafafa}
tbody td{padding:10px 12px;font-size:12px;color:#333;border-bottom:1px solid #ebebeb}
tbody td.tr{text-align:right;font-weight:600}tbody td.tc{text-align:center}tbody td.bold{font-weight:700;color:#1a1a1a}
.totals-block{display:flex;justify-content:flex-end;margin-bottom:28px}
.totals-inner{width:320px;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5}
.total-row{display:flex;justify-content:space-between;padding:9px 14px;font-size:12px;border-bottom:1px solid #ebebeb}
.total-row:last-child{border-bottom:none}
.total-row.grand{background:#1a1a1a;color:#fff;padding:12px 14px}
.total-row.grand .label{font-size:13px;font-weight:700}
.total-row.grand .value{font-size:16px;font-weight:900}
.total-row .label{color:#555}.total-row .value{font-weight:700;color:#1a1a1a}
.total-row.highlight .value{color:#16a34a;font-size:14px}
.total-row.danger .value{color:#dc2626}
.total-row.discount .value{color:#dc2626}
.payment-box{background:#f8f8f8;border-radius:8px;padding:14px 16px;margin-bottom:28px}
.payment-box h4{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;margin-bottom:10px}
.payment-row{display:flex;justify-content:space-between;font-size:12px;padding:3px 0;color:#333}
.payment-row strong{color:#1a1a1a}
.receipt-hero{background:#1a1a1a;color:#fff;border-radius:10px;padding:28px;text-align:center;margin-bottom:28px}
.receipt-hero .rh-label{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#aaa;margin-bottom:6px}
.receipt-hero .rh-amount{font-size:42px;font-weight:900;letter-spacing:-2px;line-height:1}
.receipt-hero .rh-sub{font-size:12px;color:#aaa;margin-top:8px}
.notes-box{background:#f8f8f8;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:12px;color:#555;line-height:1.6}
.notes-box strong{color:#1a1a1a;font-size:10px;letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:5px}
.terms-box{border-top:1px solid #e5e5e5;padding-top:14px;margin-bottom:20px}
.terms-box p{font-size:11px;color:#777;line-height:1.7;margin-bottom:4px}
.doc-footer{border-top:2px solid #1a1a1a;padding-top:14px;display:flex;justify-content:space-between;align-items:center}
.doc-footer-left{font-size:11px;color:#666}.doc-footer-right{font-size:12px;font-weight:700;color:#1a1a1a}
.catalog-intro{background:#1a1a1a;color:#fff;padding:20px 24px;border-radius:10px;margin-bottom:28px}
.catalog-intro h2{font-size:20px;font-weight:900;margin-bottom:4px}
.catalog-intro p{font-size:11px;color:#aaa;line-height:1.6}
.cat-section{margin-bottom:32px;break-inside:avoid}
.cat-heading{font-size:14px;font-weight:800;color:#1a1a1a;padding:8px 0;border-bottom:2px solid #1a1a1a;margin-bottom:14px}
.cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.cat-item{border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;break-inside:avoid}
.cat-item-photo{width:100%;height:120px;object-fit:cover;display:block}
.cat-item-photo-placeholder{width:100%;height:80px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:22px}
.cat-item-body{padding:10px 12px}
.cat-item-name{font-size:12px;font-weight:700;color:#1a1a1a;margin-bottom:2px}
.cat-item-desc{font-size:10px;color:#666;margin-bottom:6px;line-height:1.5}
.cat-item-footer{display:flex;justify-content:space-between;align-items:center}
.cat-item-price{font-size:13px;font-weight:800;color:#1a1a1a}
.cat-item-unit{font-size:10px;color:#999;background:#f0f0f0;padding:2px 6px;border-radius:10px}
.cat-tag{display:inline-block;font-size:9px;background:#1a1a1a;color:#fff;padding:1px 6px;border-radius:10px;margin-right:3px;margin-top:3px}
@media print{body{padding:20px}.no-print{display:none!important}.cat-section{page-break-inside:avoid}}
`;

function getBizHTML(biz, logo) {
  const img = logo?.src
    ? `<img src="${logo.src}" alt="logo"/>`
    : `<div class="brand-name">${biz.name}</div>`;
  const sub = [
    biz.tagline,
    biz.address,
    biz.city,
    biz.phone,
    biz.phone2,
    biz.email,
    biz.website,
  ]
    .filter(Boolean)
    .join("<br/>");
  return { img, sub };
}
function headerHTML(biz, logo, docType, docNum, dateIssued, dateDue) {
  const { img, sub } = getBizHTML(biz, logo);
  return `<div class="doc-header"><div class="brand-block">${img}<div class="brand-sub">${sub}</div></div><div class="doc-ref-block"><div class="doc-type">${docType}</div><div class="doc-number">${docNum}</div><div class="doc-meta">Issued: ${dateIssued}${
    dateDue ? `<br>Due: ${dateDue}` : ""
  }</div></div></div>`;
}
function partiesHTML(fl, fh, tl, th) {
  return `<div class="parties"><div class="party-box"><div class="party-label">${fl}</div>${fh}</div><div class="party-box"><div class="party-label">${tl}</div>${th}</div></div>`;
}
function footerHTML(biz) {
  return `<div class="doc-footer"><div class="doc-footer-left">${
    biz.footer || "Thank you for your business!"
  }</div><div class="doc-footer-right">${biz.name} — ${biz.city}</div></div>`;
}
function buildInvoiceHTML(inv, evt, biz, logo) {
  const bal = inv.total - inv.paid;
  const stClass =
    inv.paid >= inv.total ? "paid" : inv.paid > 0 ? "partial" : "unpaid";
  const stIcon = inv.paid >= inv.total ? "✅" : inv.paid > 0 ? "⏳" : "❌";
  const stText =
    inv.paid >= inv.total
      ? "Fully Paid"
      : inv.paid > 0
      ? "Partially Paid — balance outstanding"
      : "Unpaid — payment required";
  const lines = evt
    ? [
        {
          desc: `${evt.serviceStyle} Catering – ${evt.guests} guests × ${fmt(
            evt.pricePerHead
          )}/head`,
          total: evt.guests * evt.pricePerHead,
        },
        ...(evt.addOns > 0
          ? [{ desc: "Add-ons & extras", total: evt.addOns }]
          : []),
        ...(evt.discount > 0
          ? [
              {
                desc: "Discount applied",
                total: -evt.discount,
                cls: "discount",
              },
            ]
          : []),
      ]
    : [{ desc: "Services rendered", total: inv.total }];
  const rows = lines
    .map(
      (l, i) =>
        `<tr><td class="bold">${l.desc}</td><td class="tc">${
          i === 0 && evt ? evt.guests : 1
        }</td><td class="tr">${fmt(l.total)}</td><td class="tr ${
          l.cls || ""
        }">${fmt(l.total)}</td></tr>`
    )
    .join("");
  return `${headerHTML(
    biz,
    logo,
    "INVOICE",
    inv.num,
    inv.issued,
    inv.due
  )}${partiesHTML(
    "From",
    `<div class="party-name">${biz.name}</div><div class="party-detail">${[
      biz.address,
      biz.city,
      biz.phone,
      biz.email,
    ]
      .filter(Boolean)
      .join("<br/>")}</div>`,
    "Bill To",
    `<div class="party-name">${inv.client}</div><div class="party-detail">${
      inv.clientPhone || ""
    }${
      evt ? `<br>${evt.name}<br>${evt.eventDate} · ${evt.location}` : ""
    }</div>`
  )}<div class="status-banner ${stClass}"><div class="status-icon">${stIcon}</div><div class="status-text"><strong>${
    inv.status
  }</strong><span>${stText}</span></div></div><div class="items-section"><div class="section-heading">Line Items</div><table><thead><tr><th>Description</th><th class="tc">Qty</th><th class="tr">Unit Amount</th><th class="tr">Total (XAF)</th></tr></thead><tbody>${rows}</tbody></table></div><div class="totals-block"><div class="totals-inner"><div class="total-row"><span class="label">Invoice Total</span><span class="value">${fmt(
    inv.total
  )}</span></div><div class="total-row highlight"><span class="label">Amount Paid</span><span class="value">${fmt(
    inv.paid
  )}</span></div><div class="total-row ${
    bal > 0 ? "danger" : "highlight"
  } grand"><span class="label">Balance Due</span><span class="value">${fmt(
    bal
  )}</span></div></div></div><div class="payment-box"><h4>Payment Information</h4><div class="payment-row"><span>Accepted methods:</span><strong>${
    biz.paymentTerms || "Cash · Mobile Money (MoMo) · Bank Transfer"
  }</strong></div><div class="payment-row"><span>Payment due:</span><strong>${
    inv.due
  }</strong></div>${
    biz.bankName
      ? `<div class="payment-row"><span>Bank:</span><strong>${biz.bankName} ${
          biz.bankAccount ? `· Acc: ${biz.bankAccount}` : ""
        }</strong></div>`
      : ""
  }${
    inv.notes
      ? `<div class="payment-row"><span>Notes:</span><strong>${inv.notes}</strong></div>`
      : ""
  }</div><div class="terms-box"><p><strong>Terms:</strong> Payment is due by the date indicated. All services are provided as per the event agreement.</p></div>${footerHTML(
    biz
  )}`;
}
function buildReceiptHTML(inv, biz, logo) {
  const rcn = inv.num.replace("INV", "RCT");
  const bal = inv.total - inv.paid;
  return `${headerHTML(
    biz,
    logo,
    "RECEIPT",
    rcn,
    TODAY_LABEL,
    null
  )}${partiesHTML(
    "From",
    `<div class="party-name">${biz.name}</div><div class="party-detail">${[
      biz.address,
      biz.city,
      biz.phone,
    ]
      .filter(Boolean)
      .join("<br/>")}</div>`,
    "Received From",
    `<div class="party-name">${inv.client}</div><div class="party-detail">${
      inv.clientPhone || ""
    }</div>`
  )}<div class="receipt-hero"><div class="rh-label">Payment Received</div><div class="rh-amount">${fmt(
    inv.paid
  )}</div><div class="rh-sub">Against invoice ${
    inv.num
  } · ${TODAY_LABEL}</div></div><div class="items-section"><div class="section-heading">Payment Breakdown</div><table><thead><tr><th>Description</th><th class="tr">Amount (XAF)</th></tr></thead><tbody><tr><td class="bold">Payment against ${
    inv.num
  }</td><td class="tr" style="color:#16a34a;font-size:14px;font-weight:800">${fmt(
    inv.paid
  )}</td></tr><tr><td>Invoice Total</td><td class="tr">${fmt(
    inv.total
  )}</td></tr><tr><td>Remaining Balance</td><td class="tr" style="color:${
    bal > 0 ? "#dc2626" : "#16a34a"
  };font-weight:700">${fmt(
    bal
  )}</td></tr></tbody></table></div><div class="payment-box"><h4>Payment Details</h4><div class="payment-row"><span>Status:</span><strong style="color:${
    inv.status === "Paid" ? "#16a34a" : "#b45309"
  }">${
    inv.status
  }</strong></div><div class="payment-row"><span>Reference Invoice:</span><strong>${
    inv.num
  }</strong></div>${
    inv.notes
      ? `<div class="payment-row"><span>Notes:</span><strong>${inv.notes}</strong></div>`
      : ""
  }</div><div class="notes-box"><strong>Important</strong>This receipt confirms payment received by ${
    biz.name
  }. Please retain for your records.</div>${footerHTML(biz)}`;
}
function buildProposalHTML(prop, biz, logo) {
  const sub = prop.lines.reduce((s, l) => s + l.qty * l.price, 0);
  const total = sub - (prop.discount || 0);
  const deposit = total * 0.5;
  const rows = prop.lines
    .map(
      (l) =>
        `<tr><td class="bold">${l.name}</td><td class="tc">${
          l.unitType
        }</td><td class="tc">${l.qty}</td><td class="tr">${fmt(
          l.price
        )}</td><td class="tr">${fmt(l.qty * l.price)}</td></tr>`
    )
    .join("");
  return `${headerHTML(
    biz,
    logo,
    "PROPOSAL",
    prop.num,
    TODAY_LABEL,
    null
  )}${partiesHTML(
    "From",
    `<div class="party-name">${biz.name}</div><div class="party-detail">${[
      biz.address,
      biz.city,
      biz.phone,
      biz.email,
    ]
      .filter(Boolean)
      .join("<br/>")}</div>`,
    "Prepared For",
    `<div class="party-name">${prop.client}</div><div class="party-detail">${
      prop.clientPhone || ""
    }<br>${prop.eventType} · ${prop.plannedDate || "Date TBD"}<br>${
      prop.guests
    } guests · ${prop.location}</div>`
  )}<div class="items-section"><div class="section-heading">Proposed Services</div><table><thead><tr><th>Service / Item</th><th class="tc">Unit</th><th class="tc">Qty</th><th class="tr">Unit Price</th><th class="tr">Total (XAF)</th></tr></thead><tbody>${rows}</tbody></table></div><div class="totals-block"><div class="totals-inner"><div class="total-row"><span class="label">Subtotal</span><span class="value">${fmt(
    sub
  )}</span></div>${
    prop.discount > 0
      ? `<div class="total-row discount"><span class="label">Discount</span><span class="value">– ${fmt(
          prop.discount
        )}</span></div>`
      : ""
  }<div class="total-row grand"><span class="label">TOTAL</span><span class="value">${fmt(
    total
  )}</span></div></div></div><div class="payment-box"><h4>Payment Schedule</h4><div class="payment-row"><span>Deposit Required (50%):</span><strong>${fmt(
    deposit
  )}</strong></div><div class="payment-row"><span>Balance Due (before event):</span><strong>${fmt(
    total - deposit
  )}</strong></div><div class="payment-row"><span>Payment methods:</span><strong>${
    biz.paymentTerms || "Cash · MoMo · Bank Transfer"
  }</strong></div></div>${
    prop.notes
      ? `<div class="notes-box"><strong>Notes</strong>${prop.notes}</div>`
      : ""
  }<div class="terms-box"><p><strong>Validity:</strong> This proposal is valid for 14 days from the issue date.</p><p><strong>Confirmation:</strong> A signed acceptance and deposit confirms your booking.</p><p><strong>Cancellation:</strong> Deposits are non-refundable within 7 days of the event date.</p></div>${footerHTML(
    biz
  )}`;
}
function buildOrderReceiptHTML(sale, biz, logo) {
  const total = orderTotal(sale);
  const rcn = `RCT-2026-${String(sale.id).padStart(4, "0")}`;
  return `${headerHTML(
    biz,
    logo,
    "RECEIPT",
    rcn,
    sale.date,
    null
  )}${partiesHTML(
    "From",
    `<div class="party-name">${biz.name}</div><div class="party-detail">${[
      biz.address,
      biz.city,
      biz.phone,
    ]
      .filter(Boolean)
      .join("<br/>")}</div>`,
    "Customer",
    sale.type === "Delivery"
      ? `<div class="party-name">${
          sale.clientName || "Walk-in"
        }</div><div class="party-detail">${sale.deliveryAddress}</div>`
      : `<div class="party-name">Walk-in Customer</div><div class="party-detail">${sale.type} Order</div>`
  )}<div class="receipt-hero"><div class="rh-label">Payment Received</div><div class="rh-amount">${fmt(
    total
  )}</div><div class="rh-sub">${sale.method} · ${
    sale.date
  }</div></div><div class="items-section"><div class="section-heading">Order Details</div><table><thead><tr><th>Item</th><th class="tc">Qty</th><th class="tr">Unit Price</th><th class="tr">Amount (XAF)</th></tr></thead><tbody><tr><td class="bold">${
    sale.meal
  }</td><td class="tc">${sale.plates} plate${
    sale.plates > 1 ? "s" : ""
  }</td><td class="tr">${fmt(sale.pricePerPlate)}</td><td class="tr">${fmt(
    sale.plates * sale.pricePerPlate
  )}</td></tr>${
    sale.deliveryFee > 0
      ? `<tr><td>Delivery Fee</td><td class="tc">—</td><td class="tr">${fmt(
          sale.deliveryFee
        )}</td><td class="tr">${fmt(sale.deliveryFee)}</td></tr>`
      : ""
  }</tbody></table></div><div class="totals-block"><div class="totals-inner"><div class="total-row grand"><span class="label">TOTAL PAID</span><span class="value">${fmt(
    total
  )}</span></div></div></div><div class="notes-box"><strong>Thank you!</strong>We appreciate your order. Come back soon!</div>${footerHTML(
    biz
  )}`;
}
function buildCatalogHTML(items, categories, biz, logo) {
  const catMap = {};
  categories.forEach((c) => {
    catMap[c.id] = c.name;
  });
  const byCat = {};
  items.forEach((i) => {
    if (!byCat[i.catId]) byCat[i.catId] = [];
    byCat[i.catId].push(i);
  });
  const brandImg = logo?.src
    ? `<img src="${logo.src}" alt="logo" style="height:40px;max-width:150px;object-fit:contain;filter:brightness(0)invert(1);margin-bottom:8px"/>`
    : `<div style="font-size:24px;font-weight:900;margin-bottom:4px">${biz.name}</div>`;
  const sections = Object.entries(byCat)
    .map(([catId, its]) => {
      const cards = its
        .map(
          (i) =>
            `<div class="cat-item">${
              i.photo
                ? `<img src="${i.photo}" alt="${i.name}" class="cat-item-photo"/>`
                : `<div class="cat-item-photo-placeholder">📷</div>`
            }<div class="cat-item-body"><div class="cat-item-name">${
              i.name
            }</div>${
              i.description
                ? `<div class="cat-item-desc">${i.description}</div>`
                : ""
            }<div class="cat-item-footer"><div class="cat-item-price">${fmt(
              i.price
            )}</div><div class="cat-item-unit">${i.unitType}</div></div>${
              i.tags && i.tags.length
                ? `<div>${i.tags
                    .map((t) => `<span class="cat-tag">${t}</span>`)
                    .join("")}</div>`
                : ""
            }</div></div>`
        )
        .join("");
      return `<div class="cat-section"><div class="cat-heading">${
        catMap[catId] || "Other"
      }</div><div class="cat-grid">${cards}</div></div>`;
    })
    .join("");
  return `<div class="catalog-intro">${brandImg}<h2>Services Catalog</h2><p>${[
    biz.tagline,
    biz.city,
    biz.phone,
    biz.email,
  ]
    .filter(Boolean)
    .join(" · ")}<br>${
    items.length
  } items · Valid as of ${TODAY_LABEL}</p></div><p style="font-size:11px;color:#777;margin-bottom:24px;line-height:1.7">Prices subject to confirmation based on guest count, location and event specifics. Contact us for custom packages.</p>${sections}${footerHTML(
    biz
  )}`;
}
function printDoc(title, html) {
  const w = window.open("", "_blank", "width=860,height=940");
  w.document.write(
    `<!DOCTYPE html><html><head><title>${title}</title><style>${PRINT_CSS}</style></head><body>${html}<div class="no-print" style="position:fixed;bottom:20px;right:20px;display:flex;gap:8px"><button onclick="window.print()" style="background:#1a1a1a;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer">🖨️ Print / Save PDF</button><button onclick="window.close()" style="background:#f0f0f0;color:#1a1a1a;border:none;padding:10px 20px;border-radius:8px;font-family:inherit;font-size:13px;cursor:pointer">✕</button></div></body></html>`
  );
  w.document.close();
  w.focus();
}
function DocModal({ doc, onClose }) {
  if (!doc) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.82)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          width: "100%",
          maxWidth: 760,
          maxHeight: "92vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: T.surface,
            gap: 8,
            flexShrink: 0,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 12, flex: 1 }}>
            {doc.title}
          </div>
          <button
            style={{ ...S.btn("primary"), fontSize: 11, padding: "4px 10px" }}
            onClick={doc.onPrint}
          >
            🖨️ Open Print Preview
          </button>
          <button
            style={{ ...S.btn("ghost"), fontSize: 11, padding: "4px 10px" }}
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            background: "#fff",
            fontFamily: "'Inter',Arial,sans-serif",
            fontSize: 13,
            padding: 0,
          }}
          dangerouslySetInnerHTML={{
            __html: `<style>${PRINT_CSS}</style><div style="padding:28px">${doc.html}</div>`,
          }}
        />
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────
function SettingsModal({ biz, setBiz, onClose }) {
  const [draft, setDraft] = useState({ ...biz });
  const [pwSection, setPwSection] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState(null);

  // Staff account management
  const [staffSection, setStaffSection] = useState(false);
  const existingStaff = loadAuth()?.staff || null;
  const [staffEmail, setStaffEmail] = useState(existingStaff?.email || "");
  const [staffPw, setStaffPw] = useState("");
  const [staffPw2, setStaffPw2] = useState("");
  const [staffMsg, setStaffMsg] = useState(null);
  const [confirmRemoveStaff, setConfirmRemoveStaff] = useState(false);

  const save = () => { setBiz(draft); onClose(); };

  const handleChangePw = () => {
    setPwMsg(null);
    const auth = loadAuth();
    if (!auth) { setPwMsg({ type: "error", text: "No credentials found. Please reload." }); return; }
    if (!currentPw) { setPwMsg({ type: "error", text: "Enter your current password." }); return; }
    if (hashPassword(currentPw) !== auth.owner.hash) { setPwMsg({ type: "error", text: "Current password is incorrect." }); return; }
    if (newPw.length < 6) { setPwMsg({ type: "error", text: "New password must be at least 6 characters." }); return; }
    if (newPw !== confirmPw) { setPwMsg({ type: "error", text: "Passwords do not match." }); return; }
    saveOwnerAuth(auth.owner.email, newPw);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setPwMsg({ type: "success", text: "Password updated successfully." });
  };

  const handleSaveStaff = () => {
    setStaffMsg(null);
    if (!staffEmail.trim()) { setStaffMsg({ type: "error", text: "Staff email is required." }); return; }
    if (!existingStaff && staffPw.length < 6) { setStaffMsg({ type: "error", text: "Password must be at least 6 characters." }); return; }
    if (!existingStaff && staffPw !== staffPw2) { setStaffMsg({ type: "error", text: "Passwords do not match." }); return; }
    if (staffPw && staffPw.length < 6) { setStaffMsg({ type: "error", text: "Password must be at least 6 characters." }); return; }
    if (staffPw && staffPw !== staffPw2) { setStaffMsg({ type: "error", text: "Passwords do not match." }); return; }
    // If password left blank on edit, keep existing hash
    const auth = loadAuth();
    if (existingStaff && !staffPw) {
      saveStaffAuth(staffEmail, null); // save email update only — keep hash
      // Actually just update email while preserving hash manually
      const existing = loadAuth() || {};
      localStorage.setItem("cb_auth_v2", JSON.stringify({
        ...existing,
        staff: { email: staffEmail.trim().toLowerCase(), hash: existingStaff.hash }
      }));
    } else {
      saveStaffAuth(staffEmail, staffPw);
    }
    setStaffPw(""); setStaffPw2("");
    setStaffMsg({ type: "success", text: existingStaff ? "Staff account updated." : "Staff account created successfully." });
  };

  const handleRemoveStaff = () => {
    const existing = loadAuth() || {};
    localStorage.setItem("cb_auth_v2", JSON.stringify({ ...existing, staff: null }));
    setStaffEmail(""); setStaffPw(""); setStaffPw2("");
    setStaffMsg({ type: "success", text: "Staff account removed." });
    setConfirmRemoveStaff(false);
  };
  const F = ({ label, k, placeholder, area }) => (
    <div>
      <label style={S.label}>{label}</label>
      {area ? (
        <textarea
          style={{ ...S.input, height: 64, resize: "vertical" }}
          value={draft[k] || ""}
          onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
          placeholder={placeholder || ""}
        />
      ) : (
        <input
          style={S.input}
          value={draft[k] || ""}
          onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
          placeholder={placeholder || ""}
        />
      )}
    </div>
  );
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          width: "100%",
          maxWidth: 620,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "12px 18px",
            borderBottom: `1px solid ${T.border}`,
            background: T.surface,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            ⚙️ Business Settings
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              color: T.textMuted,
              cursor: "pointer",
              fontSize: 16,
            }}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 20, overflow: "auto", flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T.textMuted,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Company Identity
          </div>
          <div style={S.grid(2)}>
            <F label="Company Name" k="name" />
            <F label="Tagline" k="tagline" />
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 10,
              fontWeight: 700,
              color: T.textMuted,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Contact & Location
          </div>
          <div style={S.grid(2)}>
            <F label="Street Address" k="address" />
            <F label="City / Country" k="city" />
            <F label="Primary Phone" k="phone" />
            <F label="Secondary Phone" k="phone2" />
            <F label="Email" k="email" />
            <F label="Website" k="website" />
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 10,
              fontWeight: 700,
              color: T.textMuted,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Legal & Banking
          </div>
          <div style={S.grid(2)}>
            <F label="RCCM / Business Reg. No." k="rccm" />
            <F label="Tax ID / NIU" k="taxId" />
            <F label="Bank Name" k="bankName" />
            <F label="Bank Account Number" k="bankAccount" />
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 10,
              fontWeight: 700,
              color: T.textMuted,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Document Defaults
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <F label="Payment Terms" k="paymentTerms" area />
            <F label="Document Footer Message" k="footer" area />
          </div>

          {/* ── CHANGE PASSWORD ── */}
          <div style={{ marginTop: 18 }}>
            <button
              style={{
                background: "none", border: "none", padding: 0, cursor: "pointer",
                fontSize: 10, fontWeight: 700, color: T.textMuted,
                letterSpacing: 0.8, textTransform: "uppercase",
                display: "flex", alignItems: "center", gap: 5,
              }}
              onClick={() => { setPwSection(!pwSection); setPwMsg(null); }}
            >
              {pwSection ? "▾" : "▸"} 🔒 Change Password
            </button>
            {pwSection && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={S.label}>Current Password</label>
                  <input type="password" style={S.input} value={currentPw}
                    onChange={e => { setCurrentPw(e.target.value); setPwMsg(null); }}
                    placeholder="Your current password" autoComplete="current-password" />
                </div>
                <div style={S.grid(2)}>
                  <div>
                    <label style={S.label}>New Password</label>
                    <input type="password" style={S.input} value={newPw}
                      onChange={e => { setNewPw(e.target.value); setPwMsg(null); }}
                      placeholder="Min. 6 characters" autoComplete="new-password" />
                  </div>
                  <div>
                    <label style={S.label}>Confirm New Password</label>
                    <input type="password" style={S.input} value={confirmPw}
                      onChange={e => { setConfirmPw(e.target.value); setPwMsg(null); }}
                      placeholder="Re-enter new password" autoComplete="new-password" />
                  </div>
                </div>
                {pwMsg && (
                  <div style={{
                    background: pwMsg.type === "success" ? `${T.success}15` : `${T.danger}15`,
                    border: `1px solid ${pwMsg.type === "success" ? T.success : T.danger}40`,
                    borderRadius: 6, padding: "7px 12px", fontSize: 12,
                    color: pwMsg.type === "success" ? T.success : T.danger,
                  }}>
                    {pwMsg.type === "success" ? "✓" : "⚠️"} {pwMsg.text}
                  </div>
                )}
                <div>
                  <button style={{ ...S.btn("ghost"), borderColor: T.accent, color: T.accent }} onClick={handleChangePw}>
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── STAFF ACCOUNT ── */}
          <div style={{ marginTop: 14 }}>
            <button
              style={{
                background: "none", border: "none", padding: 0, cursor: "pointer",
                fontSize: 10, fontWeight: 700, color: T.textMuted,
                letterSpacing: 0.8, textTransform: "uppercase",
                display: "flex", alignItems: "center", gap: 5,
              }}
              onClick={() => { setStaffSection(!staffSection); setStaffMsg(null); setConfirmRemoveStaff(false); }}
            >
              {staffSection ? "▾" : "▸"} 👤 Staff Account
              {existingStaff && <span style={{ ...S.badge(T.info), marginLeft: 4 }}>Active</span>}
            </button>
            {staffSection && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Info banner */}
                <div style={{
                  background: `${T.info}10`, border: `1px solid ${T.info}30`,
                  borderRadius: 7, padding: "8px 12px", fontSize: 11, color: T.textMuted,
                }}>
                  👤 Staff can only access <strong style={{ color: T.text }}>Restaurant &amp; Delivery</strong> and <strong style={{ color: T.text }}>Invoices &amp; AR</strong>. They cannot access financial reports, settings, or any other section.
                </div>

                <div style={S.grid(2)}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={S.label}>Staff Email</label>
                    <input style={S.input} type="email" value={staffEmail}
                      onChange={e => { setStaffEmail(e.target.value); setStaffMsg(null); }}
                      placeholder="staff@example.com" autoComplete="off" />
                  </div>
                  <div>
                    <label style={S.label}>{existingStaff ? "New Password (leave blank to keep)" : "Password"}</label>
                    <input style={S.input} type="password" value={staffPw}
                      onChange={e => { setStaffPw(e.target.value); setStaffMsg(null); }}
                      placeholder={existingStaff ? "Leave blank to keep current" : "Min. 6 characters"} autoComplete="new-password" />
                  </div>
                  <div>
                    <label style={S.label}>Confirm Password</label>
                    <input style={S.input} type="password" value={staffPw2}
                      onChange={e => { setStaffPw2(e.target.value); setStaffMsg(null); }}
                      placeholder="Re-enter password" autoComplete="new-password" />
                  </div>
                </div>

                {staffMsg && (
                  <div style={{
                    background: staffMsg.type === "success" ? `${T.success}15` : `${T.danger}15`,
                    border: `1px solid ${staffMsg.type === "success" ? T.success : T.danger}40`,
                    borderRadius: 6, padding: "7px 12px", fontSize: 12,
                    color: staffMsg.type === "success" ? T.success : T.danger,
                  }}>
                    {staffMsg.type === "success" ? "✓" : "⚠️"} {staffMsg.text}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button style={{ ...S.btn("primary") }} onClick={handleSaveStaff}>
                    {existingStaff ? "Update Staff Account" : "Create Staff Account"}
                  </button>
                  {existingStaff && !confirmRemoveStaff && (
                    <button style={{ ...S.btn("ghost"), color: T.danger, borderColor: `${T.danger}50` }}
                      onClick={() => setConfirmRemoveStaff(true)}>
                      Remove Staff Account
                    </button>
                  )}
                  {existingStaff && confirmRemoveStaff && (
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: T.danger }}>Are you sure?</span>
                      <button style={{ ...S.btn("danger") }} onClick={handleRemoveStaff}>Yes, Remove</button>
                      <button style={S.btn("ghost")} onClick={() => setConfirmRemoveStaff(false)}>Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            padding: "12px 18px",
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <button style={S.btn("ghost")} onClick={onClose}>
            Cancel
          </button>
          <button style={S.btn("primary")} onClick={save}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────
function Dashboard({
  events,
  sales,
  invoices,
  catalogItems,
  overheads,
  inventory,
  meals,
}) {
  const [period, setPeriod] = useState("ytd");
  const [customFrom, setCustomFrom] = useState(`${THIS_YEAR}-01-01`);
  const [customTo, setCustomTo] = useState(TODAY_ISO);
  const range = useMemo(
    () => getPeriodRange(period, customFrom, customTo),
    [period, customFrom, customTo]
  );
  const pSales = useMemo(
    () => sales.filter((s) => inRange(s.date, range[0], range[1])),
    [sales, range]
  );
  const pEvents = useMemo(
    () => events.filter((e) => inRange(e.eventDate, range[0], range[1])),
    [events, range]
  );
  const rdRev = pSales.reduce((s, r) => s + orderTotal(r), 0);
  const rdCOGS = pSales.reduce(
    (s, r) => s + orderCOGS(r, catalogItems, meals),
    0
  );
  const catRev = pEvents.reduce((s, e) => s + e.revenue, 0);
  const catCOGS = pEvents.reduce((s, e) => s + eCOGS(e.costs), 0);
  const totalRev = catRev + rdRev;
  const totalCOGS = catCOGS + rdCOGS;
  const gp = totalRev - totalCOGS;
  const gm = totalRev ? ((gp / totalRev) * 100).toFixed(1) : 0;
  // Period overheads (opex only — capex & liability payments don't hit P&L)
  const pOverheads = useMemo(
    () =>
      (overheads || []).filter(
        (o) =>
          inRange(o.date, range[0], range[1]) &&
          (o.entryType || "opex") === "opex"
      ),
    [overheads, range]
  );
  const totalOverheads = pOverheads.reduce((s, o) => s + Number(o.amount), 0);
  const netProfit = gp - totalOverheads;
  const cashRcvd = invoices.reduce((s, i) => s + i.paid, 0);
  const arOut = invoices.reduce((s, i) => s + (i.total - i.paid), 0);
  const delFees = pSales
    .filter((s) => s.type === "Delivery")
    .reduce((s, r) => s + (r.deliveryFee || 0), 0);
  const chartData = useMemo(() => {
    const days = Math.ceil((range[1] - range[0]) / 86400000) + 1;
    const groups = {};
    if (days <= 14) {
      for (let i = 0; i < days; i++) {
        const d = new Date(range[0]);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString("fr-CM", {
          day: "2-digit",
          month: "2-digit",
        });
        groups[key] = { label, sales: 0, cogs: 0 };
      }
      pSales.forEach((s) => {
        if (groups[s.date]) {
          groups[s.date].sales += orderTotal(s);
          groups[s.date].cogs += orderCOGS(s, catalogItems, meals);
        }
      });
    } else if (days <= 90) {
      pSales.forEach((s) => {
        const d = new Date(s.date);
        const wk = new Date(d);
        const dow = d.getDay();
        const off = dow === 0 ? -6 : 1 - dow;
        wk.setDate(d.getDate() + off);
        const key = wk.toISOString().slice(0, 10);
        const label = `W${Math.ceil(wk.getDate() / 7)} ${wk.toLocaleDateString(
          "fr-CM",
          { month: "short" }
        )}`;
        if (!groups[key]) groups[key] = { label, sales: 0, cogs: 0 };
        groups[key].sales += orderTotal(s);
        groups[key].cogs += orderCOGS(s, catalogItems, meals);
      });
      pEvents.forEach((e) => {
        const d = new Date(e.eventDate);
        const wk = new Date(d);
        const dow = d.getDay();
        const off = dow === 0 ? -6 : 1 - dow;
        wk.setDate(d.getDate() + off);
        const key = wk.toISOString().slice(0, 10);
        const label = `W${Math.ceil(wk.getDate() / 7)} ${wk.toLocaleDateString(
          "fr-CM",
          { month: "short" }
        )}`;
        if (!groups[key]) groups[key] = { label, sales: 0, cogs: 0 };
        groups[key].sales += e.revenue;
        groups[key].cogs += eCOGS(e.costs);
      });
    } else {
      pSales.forEach((s) => {
        const key = s.date.slice(0, 7);
        const d = new Date(s.date);
        const label = d.toLocaleDateString("fr-CM", {
          month: "short",
          year: "2-digit",
        });
        if (!groups[key]) groups[key] = { label, sales: 0, cogs: 0 };
        groups[key].sales += orderTotal(s);
        groups[key].cogs += orderCOGS(s, catalogItems, meals);
      });
      pEvents.forEach((e) => {
        const key = e.eventDate.slice(0, 7);
        const d = new Date(e.eventDate);
        const label = d.toLocaleDateString("fr-CM", {
          month: "short",
          year: "2-digit",
        });
        if (!groups[key]) groups[key] = { label, sales: 0, cogs: 0 };
        groups[key].sales += e.revenue;
        groups[key].cogs += eCOGS(e.costs);
      });
    }
    return Object.keys(groups)
      .sort()
      .map((k) => ({ ...groups[k], profit: groups[k].sales - groups[k].cogs }));
  }, [pSales, pEvents, range, catalogItems]);
  const arBuckets = {};
  invoices.forEach((inv) => {
    const bal = inv.total - inv.paid;
    if (bal <= 0) return;
    const b = ageBucket(daysOD(inv.due));
    arBuckets[b] = (arBuckets[b] || 0) + bal;
  });
  const mealMap = {};
  pSales.forEach((s) => {
    mealMap[s.meal] = (mealMap[s.meal] || 0) + s.plates * s.pricePerPlate;
  });
  const topMeals = Object.entries(mealMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const isMobile = useIsMobile();
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 4,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div>
          <div style={S.pageTitle}>📊 Dashboard</div>
          <div style={S.subtitle}>Cookies Bites · {PERIOD_LABELS[period]}</div>
        </div>
      </div>
      <PeriodSelector
        period={period}
        setPeriod={setPeriod}
        customFrom={customFrom}
        setCustomFrom={setCustomFrom}
        customTo={customTo}
        setCustomTo={setCustomTo}
        range={range}
      />
      {isMobile ? (
        <>
          <MobileStatRow
            items={[
              { label: "Revenue", value: fmtShort(totalRev), icon: "💰" },
              {
                label: "Gross Profit",
                value: fmtShort(gp),
                icon: "📈",
                color: T.success,
              },
              {
                label: "Net Profit",
                value: fmtShort(netProfit),
                icon: "🏦",
                color: netProfit >= 0 ? T.success : T.danger,
              },
              {
                label: "AR Outstanding",
                value: fmtShort(arOut),
                icon: "⚠️",
                color: T.danger,
              },
            ]}
          />
          <div style={{ ...S.cardMobile, marginBottom: 10 }}>
            <div style={S.cardTitle}>Revenue by Line</div>
            {[
              { label: "🍽️ Restaurant", val: rdRev, color: T.restaurant },
              { label: "🎉 Catering", val: catRev, color: T.catering },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 3,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600 }}>
                    {item.label}
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 800, color: item.color }}
                  >
                    {fmt(item.val)}
                  </span>
                </div>
                <PBar
                  pct={totalRev ? (item.val / totalRev) * 100 : 0}
                  color={item.color}
                />
              </div>
            ))}
            <div
              style={{
                borderTop: `1px solid ${T.border}`,
                paddingTop: 8,
                marginTop: 4,
              }}
            >
              {[
                ["COGS", totalCOGS, T.danger],
                ["Gross Profit", gp, T.success],
              ].map(([k, v, c]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "3px 0",
                    fontSize: 11,
                  }}
                >
                  <span style={{ color: T.textMuted }}>{k}</span>
                  <span style={{ fontWeight: 700, color: c }}>{fmt(v)}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...S.cardMobile, marginBottom: 10 }}>
            <div style={S.cardTitle}>Top Meals</div>
            {topMeals.map(([meal, rev], i) => (
              <div
                key={meal}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    background: T.accent,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 800,
                    color: T.bg,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {meal}
                  </div>
                  <PBar
                    pct={topMeals[0] ? (rev / topMeals[0][1]) * 100 : 0}
                    color={T.restaurant}
                  />
                </div>
                <div
                  style={{ fontSize: 11, fontWeight: 700, color: T.restaurant }}
                >
                  {fmtShort(rev)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...S.cardMobile, marginBottom: 10 }}>
            <div style={S.cardTitle}>Open Invoices</div>
            {invoices
              .filter((i) => i.total - i.paid > 0)
              .map((inv, i) => {
                const bal = inv.total - inv.paid;
                const days = daysOD(inv.due);
                return (
                  <div
                    key={i}
                    style={{
                      padding: "8px 0",
                      borderBottom: `1px solid ${T.border}15`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700 }}>
                        {inv.client}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: T.danger,
                        }}
                      >
                        {fmt(bal)}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: T.textMuted }}>
                      {inv.num} ·{" "}
                      {days > 0 ? (
                        <span style={{ color: T.danger }}>{days}d overdue</span>
                      ) : (
                        `Due ${inv.due}`
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <>
          <div style={S.grid(5)}>
            <KpiCard
              label="Total Revenue"
              value={fmtShort(totalRev)}
              sub={fmt(totalRev)}
              icon="💰"
            />
            <KpiCard
              label="Gross Profit"
              value={fmtShort(gp)}
              sub={`${gm}% margin`}
              color={T.success}
              icon="📈"
            />
            <KpiCard
              label="Net Profit"
              value={fmtShort(netProfit)}
              sub={`after ${fmtShort(totalOverheads)} overhead`}
              color={netProfit >= 0 ? T.success : T.danger}
              icon="🏦"
            />
            <KpiCard
              label="Cash Received"
              value={fmtShort(cashRcvd)}
              sub={fmt(cashRcvd)}
              color={T.delivery}
              icon="💵"
            />
            <KpiCard
              label="AR Outstanding"
              value={fmtShort(arOut)}
              sub={fmt(arOut)}
              color={T.danger}
              icon="⚠️"
            />
          </div>
          <div style={{ ...S.grid(2), marginTop: 10 }}>
            <div style={S.card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <div style={S.cardTitle}>Sales & Profit Chart</div>
                <div style={{ fontSize: 10, color: T.textDim }}>
                  {chartData.length} pts
                </div>
              </div>
              <BarChart data={chartData} height={140} />
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>
                Revenue by Line ({PERIOD_LABELS[period]})
              </div>
              {[
                {
                  label: "🍽️ Rest. & Delivery",
                  val: rdRev,
                  color: T.restaurant,
                  sub: `incl. ${fmt(delFees)} delivery fees`,
                },
                {
                  label: "🎉 Catering Events",
                  val: catRev,
                  color: T.catering,
                  sub: `${pEvents.length} events`,
                },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 3,
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 10, color: T.textDim }}>
                        {item.sub}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: item.color,
                        }}
                      >
                        {fmt(item.val)}
                      </div>
                      <div style={{ fontSize: 10, color: T.textMuted }}>
                        {totalRev
                          ? ((item.val / totalRev) * 100).toFixed(0)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                  <PBar
                    pct={totalRev ? (item.val / totalRev) * 100 : 0}
                    color={item.color}
                  />
                </div>
              ))}
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 10,
                  borderTop: `1px solid ${T.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.textMuted,
                    marginBottom: 8,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Cost Breakdown
                </div>
                {[
                  ["Revenue", totalRev, T.text],
                  ["COGS", totalCOGS, T.danger],
                  ["Gross Profit", gp, T.success],
                ].map(([k, v, c]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      fontSize: 11,
                      borderBottom: `1px solid ${T.border}12`,
                    }}
                  >
                    <span style={{ color: T.textMuted }}>{k}</span>
                    <span style={{ fontWeight: 700, color: c }}>{fmt(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ ...S.grid(3), marginTop: 10 }}>
            <div style={S.card}>
              <div style={S.cardTitle}>AR Aging (All Open)</div>
              {[
                "Current",
                "1–7 days",
                "8–30 days",
                "31–60 days",
                "61+ days",
              ].map((b) => {
                const v = arBuckets[b] || 0;
                const c =
                  b === "Current"
                    ? T.success
                    : b.includes("61")
                    ? T.danger
                    : T.warning;
                return (
                  <div
                    key={b}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 0",
                      borderBottom: `1px solid ${T.border}15`,
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 11, color: T.textMuted }}>
                      {b}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: v > 0 ? c : T.textDim,
                      }}
                    >
                      {fmt(v)}
                    </span>
                  </div>
                );
              })}
              <div
                style={{
                  marginTop: 8,
                  paddingTop: 8,
                  borderTop: `1px solid ${T.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700 }}>Total AR</span>
                <span
                  style={{ fontSize: 12, fontWeight: 800, color: T.danger }}
                >
                  {fmt(arOut)}
                </span>
              </div>
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>
                Top Meals by Revenue ({PERIOD_LABELS[period]})
              </div>
              {topMeals.length === 0 && (
                <div style={{ color: T.textDim, fontSize: 11 }}>
                  No sales in this period
                </div>
              )}
              {topMeals.map(([meal, rev], i) => (
                <div
                  key={meal}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      background: T.accent,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 800,
                      color: T.bg,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {meal}
                    </div>
                    <PBar
                      pct={topMeals[0] ? (rev / topMeals[0][1]) * 100 : 0}
                      color={T.restaurant}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: T.restaurant,
                      flexShrink: 0,
                    }}
                  >
                    {fmt(rev)}
                  </div>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>Open Invoices</div>
              {invoices
                .filter((i) => i.total - i.paid > 0)
                .sort((a, b) => b.total - b.paid - (a.total - a.paid))
                .map((inv, i) => {
                  const bal = inv.total - inv.paid;
                  const days = daysOD(inv.due);
                  return (
                    <div
                      key={i}
                      style={{
                        marginBottom: 8,
                        paddingBottom: 8,
                        borderBottom: `1px solid ${T.border}15`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700 }}>
                            {inv.client}
                          </div>
                          <div style={{ fontSize: 10, color: T.textMuted }}>
                            {inv.num} · Due {inv.due}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 800,
                              color: T.danger,
                            }}
                          >
                            {fmt(bal)}
                          </div>
                          {days > 0 && (
                            <div style={{ fontSize: 10, color: T.danger }}>
                              {days}d overdue
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div style={{ ...S.card, marginTop: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div style={S.cardTitle}>
                Detailed Summary · {PERIOD_LABELS[period]}
              </div>
              <div style={{ fontSize: 10, color: T.textMuted }}>
                {fmtDate(range[0])} – {fmtDate(range[1])}
              </div>
            </div>
            <TableScroll>
              <table style={S.table}>
                <thead>
                  <tr>
                    {[
                      "Period",
                      "R&D Sales",
                      "R&D COGS",
                      "Cat. Revenue",
                      "Cat. COGS",
                      "Total Revenue",
                      "Gross Profit",
                      "GM%",
                      "Overheads",
                      "Net Profit",
                    ].map((h) => (
                      <th key={h} style={S.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...S.td, fontWeight: 700 }}>
                      {PERIOD_LABELS[period]}
                    </td>
                    <td style={{ ...S.td, color: T.restaurant }}>
                      {fmt(rdRev)}
                    </td>
                    <td style={{ ...S.td, color: T.textMuted }}>
                      {fmt(rdCOGS)}
                    </td>
                    <td style={{ ...S.td, color: T.catering }}>
                      {fmt(catRev)}
                    </td>
                    <td style={{ ...S.td, color: T.textMuted }}>
                      {fmt(catCOGS)}
                    </td>
                    <td style={{ ...S.td, fontWeight: 700 }}>
                      {fmt(totalRev)}
                    </td>
                    <td style={{ ...S.td, color: T.success, fontWeight: 700 }}>
                      {fmt(gp)}
                    </td>
                    <td style={{ ...S.td, color: T.accent, fontWeight: 700 }}>
                      {gm}%
                    </td>
                    <td style={{ ...S.td, color: T.warning }}>
                      {fmt(totalOverheads)}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        color: netProfit >= 0 ? T.success : T.danger,
                        fontWeight: 800,
                      }}
                    >
                      {fmt(netProfit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </TableScroll>
          </div>
        </>
      )}
    </div>
  );
}

// ─── CATERING (with add event, status dropdown, media) ─────────────
function CateringPage({ events, setEvents, logo, biz }) {
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState("All");
  const [doc, setDoc] = useState(null);
  const [addingEvent, setAddingEvent] = useState(false);
  const [mediaEventId, setMediaEventId] = useState(null);
  const [newEvt, setNewEvt] = useState({
    name: "",
    clientName: "",
    clientPhone: "",
    eventDate: "",
    location: "",
    eventType: "Wedding",
    serviceStyle: "Buffet",
    guests: "",
    pricePerHead: "",
    addOns: 0,
    discount: 0,
    phase: "Lead / Inquiry",
    notes: "",
    costs: { inventory: 0, labor: 0, transport: 0, overhead: 0 },
  });
  const isMobile = useIsMobile();

  const filtered =
    filter === "All" ? events : events.filter((e) => e.phase === filter);
  const evt = sel != null ? events.find((e) => e.id === sel) : null;
  const mediaEvt =
    mediaEventId != null ? events.find((e) => e.id === mediaEventId) : null;
  const openDoc = (title, html) =>
    setDoc({ title, html, onPrint: () => printDoc(title, html) });

  const saveEvent = () => {
    const revenue =
      newEvt.guests * newEvt.pricePerHead +
      Number(newEvt.addOns) -
      Number(newEvt.discount);
    const e = {
      ...newEvt,
      id: Date.now(),
      revenue,
      guests: Number(newEvt.guests),
      pricePerHead: Number(newEvt.pricePerHead),
      addOns: Number(newEvt.addOns),
      discount: Number(newEvt.discount),
      media: [],
      costs: {
        inventory: Number(newEvt.costs.inventory),
        labor: Number(newEvt.costs.labor),
        transport: Number(newEvt.costs.transport),
        overhead: Number(newEvt.costs.overhead),
      },
    };
    setEvents((prev) => [...prev, e]);
    setAddingEvent(false);
    setNewEvt({
      name: "",
      clientName: "",
      clientPhone: "",
      eventDate: "",
      location: "",
      eventType: "Wedding",
      serviceStyle: "Buffet",
      guests: "",
      pricePerHead: "",
      addOns: 0,
      discount: 0,
      phase: "Lead / Inquiry",
      notes: "",
      costs: { inventory: 0, labor: 0, transport: 0, overhead: 0 },
    });
  };

  const updatePhase = (id, phase) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, phase } : e)));
    if (evt && evt.id === id) {
      /* already reactive */
    }
  };

  const addMedia = (id, mediaItem) =>
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, media: [...(e.media || []), mediaItem] } : e
      )
    );
  const deleteMedia = (id, mediaId) =>
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, media: (e.media || []).filter((m) => m.id !== mediaId) }
          : e
      )
    );

  return (
    <div>
      <DocModal doc={doc} onClose={() => setDoc(null)} />

      {/* Media lightbox modal */}
      {mediaEvt && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 1500,
            display: "flex",
            flexDirection: "column",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMediaEventId(null);
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: T.surface,
            }}
          >
            <div style={{ fontWeight: 700 }}>
              📷 Media — {mediaEvt.name} ({(mediaEvt.media || []).length} files)
            </div>
            <button
              style={{ ...S.btn("ghost"), fontSize: 11 }}
              onClick={() => setMediaEventId(null)}
            >
              ✕ Close
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            <MediaGallery
              media={mediaEvt.media || []}
              onAdd={(m) => addMedia(mediaEvt.id, m)}
              onDelete={(mid) => deleteMedia(mediaEvt.id, mid)}
              title="Event Photos & Videos"
            />
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <div>
          <div style={S.pageTitle}>🎉 Catering Pipeline</div>
          <div style={S.subtitle}>
            {events.length} events ·{" "}
            {fmt(events.reduce((s, e) => s + e.revenue, 0))} total pipeline
          </div>
        </div>
        <button
          style={S.btn("primary")}
          onClick={() => setAddingEvent(!addingEvent)}
        >
          + New Event
        </button>
      </div>

      {/* Add Event Form */}
      {addingEvent && (
        <div style={{ ...S.card, marginBottom: 14, borderColor: T.accent }}>
          <div style={S.sectionTitle}>Add New Catering Event</div>
          <div style={S.grid(3)}>
            <div>
              <label style={S.label}>Event Name</label>
              <input
                style={S.input}
                value={newEvt.name}
                onChange={(e) => setNewEvt({ ...newEvt, name: e.target.value })}
                placeholder="e.g. Kamga Wedding · MTN Staff Party"
              />
            </div>
            <div>
              <label style={S.label}>Client Name</label>
              <input
                style={S.input}
                value={newEvt.clientName}
                onChange={(e) =>
                  setNewEvt({ ...newEvt, clientName: e.target.value })
                }
              />
            </div>
            <div>
              <label style={S.label}>Client Phone</label>
              <input
                style={S.input}
                value={newEvt.clientPhone}
                onChange={(e) =>
                  setNewEvt({ ...newEvt, clientPhone: e.target.value })
                }
              />
            </div>
            <div>
              <label style={S.label}>Event Date</label>
              <input
                type="date"
                style={S.input}
                value={newEvt.eventDate}
                onChange={(e) =>
                  setNewEvt({ ...newEvt, eventDate: e.target.value })
                }
              />
            </div>
            <div>
              <label style={S.label}>Location</label>
              <input
                style={S.input}
                value={newEvt.location}
                onChange={(e) =>
                  setNewEvt({ ...newEvt, location: e.target.value })
                }
              />
            </div>
            <div>
              <label style={S.label}>Event Type</label>
              <select
                style={S.select}
                value={newEvt.eventType}
                onChange={(e) =>
                  setNewEvt({ ...newEvt, eventType: e.target.value })
                }
              >
                {[
                  "Wedding",
                  "Corporate",
                  "Birthday",
                  "Private",
                  "Funeral",
                  "Other",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={S.label}>Service Style</label>
              <select
                style={S.select}
                value={newEvt.serviceStyle}
                onChange={(e) =>
                  setNewEvt({ ...newEvt, serviceStyle: e.target.value })
                }
              >
                {[
                  "Buffet",
                  "Plated",
                  "Cocktail",
                  "Family Style",
                  "Box Lunch",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={S.label}>Guest Count</label>
              <input
                type="number"
                style={S.input}
                value={newEvt.guests}
                onChange={(e) =>
                  setNewEvt({ ...newEvt, guests: e.target.value })
                }
              />
            </div>
            <div>
              <label style={S.label}>Price per Head (XAF)</label>
              <input
                type="number"
                style={S.input}
                value={newEvt.pricePerHead}
                onChange={(e) =>
                  setNewEvt({ ...newEvt, pricePerHead: e.target.value })
                }
              />
            </div>
            <div>
              <label style={S.label}>Add-ons (XAF)</label>
              <input
                type="number"
                style={S.input}
                value={newEvt.addOns}
                onChange={(e) =>
                  setNewEvt({ ...newEvt, addOns: e.target.value })
                }
              />
            </div>
            <div>
              <label style={S.label}>Discount (XAF)</label>
              <input
                type="number"
                style={S.input}
                value={newEvt.discount}
                onChange={(e) =>
                  setNewEvt({ ...newEvt, discount: e.target.value })
                }
              />
            </div>
            <div>
              <label style={S.label}>Pipeline Stage</label>
              <select
                style={S.select}
                value={newEvt.phase}
                onChange={(e) =>
                  setNewEvt({ ...newEvt, phase: e.target.value })
                }
              >
                {PIPELINE_PHASES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.textMuted,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Estimated Costs (XAF)
            </div>
            <div style={S.grid(4)}>
              {["inventory", "labor", "transport", "overhead"].map((k) => (
                <div key={k}>
                  <label style={S.label}>
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </label>
                  <input
                    type="number"
                    style={S.input}
                    value={newEvt.costs[k]}
                    onChange={(e) =>
                      setNewEvt({
                        ...newEvt,
                        costs: { ...newEvt.costs, [k]: e.target.value },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <label style={S.label}>Notes</label>
            <textarea
              style={{ ...S.input, height: 56 }}
              value={newEvt.notes}
              onChange={(e) => setNewEvt({ ...newEvt, notes: e.target.value })}
            />
          </div>
          <div
            style={{
              marginTop: 10,
              padding: 10,
              background: T.surface,
              borderRadius: 7,
              fontSize: 12,
              display: "flex",
              gap: 20,
            }}
          >
            <span>
              Est. Revenue:{" "}
              <strong style={{ color: T.accent }}>
                {fmt(
                  Number(newEvt.guests) * Number(newEvt.pricePerHead) +
                    Number(newEvt.addOns) -
                    Number(newEvt.discount)
                )}
              </strong>
            </span>
            <span>
              Est. COGS:{" "}
              <strong style={{ color: T.danger }}>
                {fmt(
                  Object.values(newEvt.costs).reduce((s, v) => s + Number(v), 0)
                )}
              </strong>
            </span>
          </div>
          <div style={{ ...S.row, marginTop: 10, justifyContent: "flex-end" }}>
            <button
              style={S.btn("ghost")}
              onClick={() => setAddingEvent(false)}
            >
              Cancel
            </button>
            <button
              style={S.btn("primary")}
              onClick={saveEvent}
              disabled={!newEvt.name || !newEvt.clientName}
            >
              Save Event
            </button>
          </div>
        </div>
      )}

      <div
        style={{ display: "flex", gap: 3, marginBottom: 14, flexWrap: "wrap" }}
      >
        {isMobile ? (
          <select
            style={{ ...S.select, maxWidth: 200 }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {["All", ...PIPELINE_PHASES].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        ) : (
          ["All", ...PIPELINE_PHASES.slice(0, 7)].map((p) => (
            <button
              key={p}
              style={S.navBtn(filter === p)}
              onClick={() => setFilter(p)}
            >
              {p}
            </button>
          ))
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: !isMobile && evt ? "1fr 360px" : "1fr",
          gap: 10,
        }}
      >
        <div>
          {filtered.map((e) => {
            const cogs = eCOGS(e.costs);
            const profit = e.revenue - cogs;
            const margin = e.revenue
              ? ((profit / e.revenue) * 100).toFixed(0)
              : 0;
            const mediaCount = (e.media || []).length;
            return (
              <div
                key={e.id}
                style={{
                  ...S.card,
                  marginBottom: 8,
                  cursor: "pointer",
                  borderColor: sel === e.id ? T.accent : T.border,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                  onClick={() => setSel(e.id === sel ? null : e.id)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}
                    >
                      {e.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: T.textMuted,
                        marginBottom: 5,
                      }}
                    >
                      {e.clientName} · {e.eventDate} · {e.location}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <PhaseBadge phase={e.phase} />
                      <Badge color={T.textMuted}>{e.serviceStyle}</Badge>
                      <Badge color={T.delivery}>{e.guests} guests</Badge>
                      {mediaCount > 0 && (
                        <Badge color={T.info}>📷 {mediaCount}</Badge>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      marginLeft: 10,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{ fontSize: 13, fontWeight: 800, color: T.accent }}
                    >
                      {fmt(e.revenue)}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: profit >= 0 ? T.success : T.danger,
                      }}
                    >
                      Profit: {fmt(profit)} ({margin}%)
                    </div>
                  </div>
                </div>
                {/* Inline status + media row */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginTop: 8,
                    alignItems: "center",
                  }}
                  onClick={(ev) => ev.stopPropagation()}
                >
                  <div style={{ flex: 1 }}>
                    <select
                      style={{ ...S.select, fontSize: 11, padding: "4px 8px" }}
                      value={e.phase}
                      onChange={(ev) => updatePhase(e.id, ev.target.value)}
                    >
                      {PIPELINE_PHASES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    style={{
                      ...S.btn("ghost"),
                      fontSize: 10,
                      padding: "4px 8px",
                      borderColor: T.info,
                      color: T.info,
                    }}
                    onClick={() => setMediaEventId(e.id)}
                  >
                    📷 Media {mediaCount > 0 ? `(${mediaCount})` : ""}
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div
              style={{
                color: T.textMuted,
                padding: 20,
                textAlign: "center",
                fontSize: 12,
              }}
            >
              No events in this phase
            </div>
          )}
        </div>

        {evt && (
          <div
            style={{
              ...S.card,
              position: "sticky",
              top: 14,
              alignSelf: "start",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  flex: 1,
                  minWidth: 0,
                  marginRight: 6,
                }}
              >
                {evt.name}
              </div>
              <button
                onClick={() => setSel(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: T.textMuted,
                  cursor: "pointer",
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={S.label}>Pipeline Stage</label>
              <select
                style={S.select}
                value={evt.phase}
                onChange={(e) => updatePhase(evt.id, e.target.value)}
              >
                {PIPELINE_PHASES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <Divider />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 7,
                fontSize: 11,
                marginBottom: 8,
              }}
            >
              {[
                ["Client", evt.clientName],
                ["Phone", evt.clientPhone],
                ["Date", evt.eventDate],
                ["Location", evt.location],
                ["Type", evt.eventType],
                ["Style", evt.serviceStyle],
                ["Guests", evt.guests],
                ["Price/Head", fmt(evt.pricePerHead)],
              ].map(([k, v]) => (
                <div key={k}>
                  <span style={{ color: T.textMuted, fontSize: 10 }}>{k}:</span>
                  <br />
                  <strong style={{ fontSize: 11 }}>{v}</strong>
                </div>
              ))}
            </div>
            <Divider />
            {[
              ["Guests × Price/Head", evt.guests * evt.pricePerHead],
              ["Add-ons", evt.addOns],
              ["Discount", -evt.discount],
              ["TOTAL", evt.revenue],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  padding: "3px 0",
                  borderBottom:
                    k === "TOTAL"
                      ? `1px solid ${T.accent}`
                      : `1px solid ${T.border}12`,
                  fontWeight: k === "TOTAL" ? 700 : 400,
                }}
              >
                <span style={{ color: k === "TOTAL" ? T.text : T.textMuted }}>
                  {k}
                </span>
                <span
                  style={{
                    color:
                      k === "TOTAL" ? T.accent : v < 0 ? T.danger : "inherit",
                  }}
                >
                  {v < 0 ? `-${fmt(-v)}` : fmt(v)}
                </span>
              </div>
            ))}
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: T.textMuted,
                marginTop: 9,
                marginBottom: 5,
              }}
            >
              COSTS (COGS)
            </div>
            {[
              ["Inventory", evt.costs.inventory],
              ["Labor", evt.costs.labor],
              ["Transport", evt.costs.transport],
              ["Overhead", evt.costs.overhead],
              ["TOTAL COGS", eCOGS(evt.costs)],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  padding: "3px 0",
                  borderBottom: `1px solid ${T.border}12`,
                  fontWeight: k === "TOTAL COGS" ? 700 : 400,
                }}
              >
                <span style={{ color: T.textMuted }}>{k}</span>
                <span
                  style={{ color: k === "TOTAL COGS" ? T.danger : "inherit" }}
                >
                  {fmt(v)}
                </span>
              </div>
            ))}
            <div
              style={{
                marginTop: 8,
                padding: 8,
                background: T.surface,
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700 }}>
                  Gross Profit
                </span>
                <span
                  style={{ fontSize: 12, fontWeight: 800, color: T.success }}
                >
                  {fmt(evt.revenue - eCOGS(evt.costs))}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: T.textMuted }}>Margin</span>
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: T.accent }}
                >
                  {evt.revenue
                    ? (
                        ((evt.revenue - eCOGS(evt.costs)) / evt.revenue) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
            <Divider />
            {/* Media section in side panel */}
            <MediaGallery
              media={evt.media || []}
              onAdd={(m) => addMedia(evt.id, m)}
              onDelete={(mid) => deleteMedia(evt.id, mid)}
              title="Event Media"
            />
            <Divider />
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              <button
                style={{
                  ...S.btn("primary"),
                  fontSize: 10,
                  padding: "4px 9px",
                }}
                onClick={() => {
                  const inv = {
                    num: `INV-${THIS_YEAR}-${String(evt.id).padStart(4, "0")}`,
                    client: evt.clientName,
                    clientPhone: evt.clientPhone,
                    issued: evt.eventDate,
                    due: evt.eventDate,
                    total: evt.revenue,
                    paid: 0,
                    status: "Unpaid",
                    notes: "",
                  };
                  openDoc(
                    `Invoice – ${evt.name}`,
                    buildInvoiceHTML(inv, evt, biz, logo)
                  );
                }}
              >
                📄 Invoice
              </button>
              <button
                style={{ ...S.btn("ghost"), fontSize: 10, padding: "4px 9px" }}
                onClick={() => {
                  const inv = {
                    num: `INV-${THIS_YEAR}-${String(evt.id).padStart(4, "0")}`,
                    client: evt.clientName,
                    clientPhone: evt.clientPhone,
                    issued: evt.eventDate,
                    due: evt.eventDate,
                    total: evt.revenue,
                    paid: evt.revenue,
                    status: "Paid",
                    notes: "",
                  };
                  openDoc(
                    `Receipt – ${evt.name}`,
                    buildReceiptHTML(inv, biz, logo)
                  );
                }}
              >
                🧾 Receipt
              </button>
            </div>
            {evt.notes && (
              <div
                style={{
                  fontSize: 10,
                  color: T.textMuted,
                  background: T.surface,
                  padding: 7,
                  borderRadius: 5,
                  marginTop: 7,
                }}
              >
                {evt.notes}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CATALOG ──────────────────────────────────────────────────────
function CatalogPage({ categories, items, setItems, logo, biz }) {
  const [selCat, setSelCat] = useState(null);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [ni, setNi] = useState({
    catId: 1,
    name: "",
    unitType: "Per head",
    price: "",
    costPerUnit: "",
    tags: "",
    description: "",
    photo: null,
  });
  const [doc, setDoc] = useState(null);
  const photoRef = useRef();
  const filtered = items.filter(
    (i) =>
      (!selCat || i.catId === selCat) &&
      (!search || i.name.toLowerCase().includes(search.toLowerCase()))
  );
  const handlePhoto = (e, forItem = null) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      if (forItem != null) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === forItem ? { ...it, photo: ev.target.result } : it
          )
        );
      } else {
        setNi((n) => ({ ...n, photo: ev.target.result }));
      }
    };
    r.readAsDataURL(f);
  };
  const save = () => {
    if (!ni.name || !ni.price) return;
    const item = {
      ...ni,
      price: Number(ni.price),
      costPerUnit: Number(ni.costPerUnit) || 0,
      tags:
        typeof ni.tags === "string"
          ? ni.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : ni.tags,
    };
    if (editId != null) {
      setItems((prev) =>
        prev.map((it) => (it.id === editId ? { ...item, id: editId } : it))
      );
      setEditId(null);
    } else {
      setItems((prev) => [...prev, { ...item, id: Date.now() }]);
    }
    setAdding(false);
    setNi({
      catId: 1,
      name: "",
      unitType: "Per head",
      price: "",
      costPerUnit: "",
      tags: "",
      description: "",
      photo: null,
    });
  };
  const startEdit = (item) => {
    setNi({
      ...item,
      price: String(item.price),
      costPerUnit: String(item.costPerUnit || ""),
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags,
    });
    setEditId(item.id);
    setAdding(true);
  };
  const openDoc = (title, html) =>
    setDoc({ title, html, onPrint: () => printDoc(title, html) });

  return (
    <div>
      <DocModal doc={doc} onClose={() => setDoc(null)} />
      <div style={S.pageTitle}>📦 Catering Catalog</div>
      <div style={S.subtitle}>
        {items.length} items · Click any item photo to replace it
      </div>
      <div style={{ ...S.row, marginBottom: 12 }}>
        <button
          style={S.btn("primary")}
          onClick={() =>
            openDoc(
              "Services Catalog",
              buildCatalogHTML(items, categories, biz, logo)
            )
          }
        >
          🖨️ Print Catalog
        </button>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "175px 1fr", gap: 10 }}
      >
        <div style={{ ...S.card, padding: 10, alignSelf: "start" }}>
          <div style={S.cardTitle}>Categories</div>
          <div
            onClick={() => setSelCat(null)}
            style={{
              padding: "4px 6px",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 11,
              background: !selCat ? T.accentSoft : "transparent",
              color: !selCat ? T.accent : T.text,
              marginBottom: 2,
            }}
          >
            All ({items.length})
          </div>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelCat(cat.id === selCat ? null : cat.id)}
              style={{
                padding: "4px 6px",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 11,
                background: selCat === cat.id ? T.accentSoft : "transparent",
                color: selCat === cat.id ? T.accent : T.textMuted,
                marginBottom: 1,
              }}
            >
              {cat.name} ({items.filter((i) => i.catId === cat.id).length})
            </div>
          ))}
        </div>
        <div>
          <div style={{ ...S.row, marginBottom: 10 }}>
            <input
              style={{ ...S.input, flex: 1 }}
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              style={S.btn("primary")}
              onClick={() => {
                setAdding(!adding);
                setEditId(null);
                setNi({
                  catId: 1,
                  name: "",
                  unitType: "Per head",
                  price: "",
                  costPerUnit: "",
                  tags: "",
                  description: "",
                  photo: null,
                });
              }}
            >
              {adding && editId == null ? "Cancel" : "+ Add Item"}
            </button>
          </div>
          {adding && (
            <div style={{ ...S.card, marginBottom: 12, borderColor: T.accent }}>
              <div style={S.sectionTitle}>
                {editId != null ? "Edit Item" : "New Item"}
              </div>
              <div style={S.grid(3)}>
                <div>
                  <label style={S.label}>Item Name</label>
                  <input
                    style={S.input}
                    value={ni.name}
                    onChange={(e) => setNi({ ...ni, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={S.label}>Category</label>
                  <select
                    style={S.select}
                    value={ni.catId}
                    onChange={(e) =>
                      setNi({ ...ni, catId: Number(e.target.value) })
                    }
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Unit Type</label>
                  <select
                    style={S.select}
                    value={ni.unitType}
                    onChange={(e) => setNi({ ...ni, unitType: e.target.value })}
                  >
                    {[
                      "Per head",
                      "Per tray",
                      "Per platter",
                      "Per item",
                      "Per hour",
                      "Per day",
                      "Flat fee",
                    ].map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Sale Price (XAF)</label>
                  <input
                    style={S.input}
                    type="number"
                    value={ni.price}
                    onChange={(e) => setNi({ ...ni, price: e.target.value })}
                  />
                </div>
                <div>
                  <label style={S.label}>Cost / Unit (XAF)</label>
                  <input
                    style={S.input}
                    type="number"
                    value={ni.costPerUnit}
                    onChange={(e) =>
                      setNi({ ...ni, costPerUnit: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label style={S.label}>Photo</label>
                  <div
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    {ni.photo && (
                      <img
                        src={ni.photo}
                        alt="p"
                        style={{
                          width: 32,
                          height: 32,
                          objectFit: "cover",
                          borderRadius: 4,
                          border: `1px solid ${T.border}`,
                        }}
                      />
                    )}
                    <button
                      style={{
                        ...S.btn("ghost"),
                        fontSize: 11,
                        padding: "4px 8px",
                      }}
                      onClick={() => photoRef.current.click()}
                    >
                      {ni.photo ? "Change" : "Upload"}
                    </button>
                    {ni.photo && (
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: T.danger,
                          cursor: "pointer",
                          fontSize: 11,
                        }}
                        onClick={() => setNi({ ...ni, photo: null })}
                      >
                        ✕
                      </button>
                    )}
                    <input
                      ref={photoRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handlePhoto(e)}
                    />
                  </div>
                </div>
                <div style={{ gridColumn: "span 3" }}>
                  <label style={S.label}>Description</label>
                  <input
                    style={S.input}
                    value={ni.description}
                    onChange={(e) =>
                      setNi({ ...ni, description: e.target.value })
                    }
                  />
                </div>
                <div style={{ gridColumn: "span 3" }}>
                  <label style={S.label}>Tags (comma-separated)</label>
                  <input
                    style={S.input}
                    value={ni.tags}
                    onChange={(e) => setNi({ ...ni, tags: e.target.value })}
                  />
                </div>
              </div>
              <div
                style={{ ...S.row, marginTop: 10, justifyContent: "flex-end" }}
              >
                <button
                  style={S.btn("ghost")}
                  onClick={() => {
                    setAdding(false);
                    setEditId(null);
                  }}
                >
                  Cancel
                </button>
                <button style={S.btn("primary")} onClick={save}>
                  {editId != null ? "Update" : "Save"}
                </button>
              </div>
            </div>
          )}
          <div style={S.grid(3)}>
            {filtered.map((item) => {
              const cat = categories.find((c) => c.id === item.catId);
              const margin =
                item.costPerUnit && item.price
                  ? (
                      ((item.price - item.costPerUnit) / item.price) *
                      100
                    ).toFixed(0)
                  : null;
              return (
                <div
                  key={item.id}
                  style={{ ...S.card, padding: 0, overflow: "hidden" }}
                >
                  <div
                    style={{
                      height: 110,
                      background: T.surface,
                      position: "relative",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const inp = document.createElement("input");
                      inp.type = "file";
                      inp.accept = "image/*";
                      inp.onchange = (e) => handlePhoto(e, item.id);
                      inp.click();
                    }}
                  >
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: T.textDim,
                          gap: 3,
                        }}
                      >
                        <div style={{ fontSize: 24 }}>📷</div>
                        <div style={{ fontSize: 9 }}>Click to upload</div>
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        background: "rgba(0,0,0,0.55)",
                        color: "#fff",
                        fontSize: 8,
                        padding: "2px 5px",
                        borderRadius: 3,
                      }}
                    >
                      📷
                    </div>
                  </div>
                  <div style={{ padding: 9 }}>
                    <div
                      style={{ fontSize: 11, fontWeight: 700, marginBottom: 1 }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: T.textMuted,
                        marginBottom: 4,
                      }}
                    >
                      {cat?.name}
                    </div>
                    {item.description && (
                      <div
                        style={{
                          fontSize: 9,
                          color: T.textDim,
                          marginBottom: 5,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 3,
                      }}
                    >
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          setItems((prev) =>
                            prev.map((it) =>
                              it.id === item.id
                                ? { ...it, price: Number(e.target.value) }
                                : it
                            )
                          )
                        }
                        style={{
                          ...S.input,
                          width: 90,
                          padding: "3px 5px",
                          fontSize: 12,
                          fontWeight: 800,
                          color: T.accent,
                        }}
                      />
                      <span style={{ fontSize: 9, color: T.textMuted }}>
                        XAF / {item.unitType}
                      </span>
                    </div>
                    {item.costPerUnit > 0 && (
                      <div
                        style={{
                          fontSize: 9,
                          color: T.textMuted,
                          marginBottom: 4,
                        }}
                      >
                        Cost: {fmt(item.costPerUnit)}{" "}
                        {margin && (
                          <span style={{ color: T.success }}>
                            · Margin: {margin}%
                          </span>
                        )}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: 3,
                        alignItems: "center",
                        flexWrap: "wrap",
                        marginTop: 4,
                      }}
                    >
                      {(Array.isArray(item.tags) ? item.tags : []).map((t) => (
                        <span key={t} style={S.tag}>
                          {t}
                        </span>
                      ))}
                      <button
                        style={{
                          ...S.btn("ghost"),
                          fontSize: 9,
                          padding: "1px 5px",
                          marginLeft: "auto",
                        }}
                        onClick={() => startEdit(item)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div
              style={{
                color: T.textMuted,
                padding: 20,
                textAlign: "center",
                fontSize: 12,
              }}
            >
              No items found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PROPOSALS (with inventory linking) ───────────────────────────
function ProposalsPage({
  proposals,
  setProposals,
  catalogItems,
  catalogCategories,
  inventory,
  logo,
  biz,
}) {
  const [sel, setSel] = useState(null);
  const [building, setBuilding] = useState(false);
  const [draft, setDraft] = useState({
    client: "",
    clientPhone: "",
    eventType: "",
    plannedDate: "",
    guests: "",
    location: "",
    discount: 0,
    notes: "",
    lines: [],
    inventoryLinks: [],
  });
  const [pickCat, setPickCat] = useState(null);
  const [doc, setDoc] = useState(null);
  const [showInvLink, setShowInvLink] = useState(null); // proposal index
  const openDoc = (title, html) =>
    setDoc({ title, html, onPrint: () => printDoc(title, html) });

  const addLine = (item) =>
    setDraft((d) => ({
      ...d,
      lines: [
        ...d.lines,
        {
          itemId: item.id,
          name: item.name,
          qty: item.unitType === "Per head" ? d.guests : 1,
          price: item.price,
          unitType: item.unitType,
        },
      ],
    }));
  const saveDraft = () => {
    const p = {
      ...draft,
      id: proposals.length + 1,
      num: `PROP-${THIS_YEAR}-${String(proposals.length + 1).padStart(4, "0")}`,
      status: "Draft",
    };
    setProposals((prev) => [...prev, p]);
    setBuilding(false);
    setDraft({
      client: "",
      clientPhone: "",
      eventType: "",
      plannedDate: "",
      guests: "",
      location: "",
      discount: 0,
      notes: "",
      lines: [],
      inventoryLinks: [],
    });
  };
  const updateLine = (pi, li, field, value) => {
    const u = [...proposals];
    u[pi] = {
      ...u[pi],
      lines: u[pi].lines.map((l, i) =>
        i === li ? { ...l, [field]: Number(value) } : l
      ),
    };
    setProposals(u);
  };
  const stColor = {
    Draft: T.textMuted,
    Sent: T.info,
    Negotiation: T.warning,
    Approved: T.success,
    Declined: T.danger,
    "Converted to Event": T.catering,
  };

  const toggleInventoryLink = (propIdx, invId) => {
    const u = [...proposals];
    const links = u[propIdx].inventoryLinks || [];
    const has = links.includes(invId);
    u[propIdx] = {
      ...u[propIdx],
      inventoryLinks: has
        ? links.filter((id) => id !== invId)
        : [...links, invId],
    };
    setProposals(u);
  };
  const toggleDraftInvLink = (invId) => {
    const has = (draft.inventoryLinks || []).includes(invId);
    setDraft({
      ...draft,
      inventoryLinks: has
        ? draft.inventoryLinks.filter((id) => id !== invId)
        : [...(draft.inventoryLinks || []), invId],
    });
  };

  return (
    <div>
      <DocModal doc={doc} onClose={() => setDoc(null)} />
      <div style={S.pageTitle}>📋 Proposals</div>
      <div style={S.subtitle}>Build and send proposals to clients</div>
      <div style={{ ...S.row, marginBottom: 14 }}>
        <button style={S.btn("primary")} onClick={() => setBuilding(!building)}>
          + New Proposal
        </button>
      </div>

      {building && (
        <div style={{ ...S.card, marginBottom: 14, borderColor: T.accent }}>
          <div style={S.sectionTitle}>Build Proposal</div>
          <div style={S.grid(3)}>
            <div>
              <label style={S.label}>Client Name</label>
              <input
                style={S.input}
                value={draft.client}
                onChange={(e) => setDraft({ ...draft, client: e.target.value })}
              />
            </div>
            <div>
              <label style={S.label}>Client Phone</label>
              <input
                style={S.input}
                value={draft.clientPhone}
                onChange={(e) =>
                  setDraft({ ...draft, clientPhone: e.target.value })
                }
              />
            </div>
            <div>
              <label style={S.label}>Event Type</label>
              <input
                style={S.input}
                value={draft.eventType}
                onChange={(e) =>
                  setDraft({ ...draft, eventType: e.target.value })
                }
              />
            </div>
            <div>
              <label style={S.label}>Planned Date</label>
              <input
                type="date"
                style={S.input}
                value={draft.plannedDate}
                onChange={(e) =>
                  setDraft({ ...draft, plannedDate: e.target.value })
                }
              />
            </div>
            <div>
              <label style={S.label}>Guest Count</label>
              <input
                type="number"
                style={S.input}
                value={draft.guests}
                onChange={(e) =>
                  setDraft({ ...draft, guests: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label style={S.label}>Location</label>
              <input
                style={S.input}
                value={draft.location}
                onChange={(e) =>
                  setDraft({ ...draft, location: e.target.value })
                }
              />
            </div>
            <div>
              <label style={S.label}>Discount (XAF)</label>
              <input
                type="number"
                style={S.input}
                value={draft.discount}
                onChange={(e) =>
                  setDraft({ ...draft, discount: Number(e.target.value) })
                }
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={S.label}>Notes</label>
              <input
                style={S.input}
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
            </div>
          </div>
          <Divider />
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 7 }}>
            Select items from catalog:
          </div>
          <div
            style={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              marginBottom: 9,
            }}
          >
            {catalogCategories.map((c) => (
              <button
                key={c.id}
                style={S.navBtn(pickCat === c.id)}
                onClick={() => setPickCat(pickCat === c.id ? null : c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div style={S.grid(4)}>
            {catalogItems
              .filter((i) => !pickCat || i.catId === pickCat)
              .map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...S.card,
                    padding: 0,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => addLine(item)}
                >
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt=""
                      style={{ width: "100%", height: 60, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 40,
                        background: T.surface,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: T.textDim,
                        fontSize: 16,
                      }}
                    >
                      📷
                    </div>
                  )}
                  <div style={{ padding: 7 }}>
                    <div
                      style={{ fontSize: 11, fontWeight: 700, marginBottom: 1 }}
                    >
                      {item.name}
                    </div>
                    <div style={{ fontSize: 10, color: T.textMuted }}>
                      {item.unitType}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: T.accent,
                        marginTop: 2,
                      }}
                    >
                      {fmt(item.price)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {draft.lines.length > 0 && (
            <>
              <Divider />
              <div className="tbl-wrap">
                <table style={S.table}>
                  <thead>
                    <tr>
                      {[
                        "Item",
                        "Unit",
                        "Qty",
                        "Unit Price (XAF)",
                        "Total",
                        "",
                      ].map((h) => (
                        <th key={h} style={S.th}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {draft.lines.map((l, i) => (
                      <tr key={i}>
                        <td style={S.td}>{l.name}</td>
                        <td style={S.td}>{l.unitType}</td>
                        <td style={S.td}>
                          <input
                            type="number"
                            style={{
                              ...S.input,
                              width: 58,
                              padding: "3px 5px",
                            }}
                            value={l.qty}
                            onChange={(e) => {
                              const ls = [...draft.lines];
                              ls[i] = { ...ls[i], qty: Number(e.target.value) };
                              setDraft({ ...draft, lines: ls });
                            }}
                          />
                        </td>
                        <td style={S.td}>
                          <input
                            type="number"
                            style={{
                              ...S.input,
                              width: 100,
                              padding: "3px 5px",
                              color: T.accent,
                              fontWeight: 700,
                            }}
                            value={l.price}
                            onChange={(e) => {
                              const ls = [...draft.lines];
                              ls[i] = {
                                ...ls[i],
                                price: Number(e.target.value),
                              };
                              setDraft({ ...draft, lines: ls });
                            }}
                          />
                        </td>
                        <td
                          style={{ ...S.td, fontWeight: 700, color: T.accent }}
                        >
                          {fmt(l.qty * l.price)}
                        </td>
                        <td style={S.td}>
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              color: T.danger,
                              cursor: "pointer",
                              fontSize: 13,
                            }}
                            onClick={() =>
                              setDraft({
                                ...draft,
                                lines: draft.lines.filter((_, j) => j !== i),
                              })
                            }
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ textAlign: "right", marginTop: 7 }}>
                {draft.discount > 0 && (
                  <div style={{ fontSize: 11, color: T.textMuted }}>
                    Discount: -{fmt(draft.discount)}
                  </div>
                )}
                <div style={{ fontSize: 13, fontWeight: 800, color: T.accent }}>
                  TOTAL: {fmt(propTotal(draft.lines, draft.discount))}
                </div>
              </div>
            </>
          )}
          {/* Inventory linking in draft */}
          <Divider />
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T.textMuted,
              marginBottom: 7,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Link Inventory Items (for costing reference)
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {inventory.map((inv) => {
              const linked = (draft.inventoryLinks || []).includes(inv.id);
              return (
                <div
                  key={inv.id}
                  onClick={() => toggleDraftInvLink(inv.id)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    cursor: "pointer",
                    background: linked ? `${T.accent}20` : T.surface,
                    border: `1px solid ${linked ? T.accent : T.border}`,
                    color: linked ? T.accent : T.textMuted,
                    fontWeight: linked ? 700 : 400,
                  }}
                >
                  {linked ? "✓ " : ""}
                  {inv.name} ({inv.unit}) — {fmt(inv.costPerUnit)}
                </div>
              );
            })}
          </div>
          {(draft.inventoryLinks || []).length > 0 && (
            <div
              style={{
                marginTop: 8,
                padding: 8,
                background: T.surface,
                borderRadius: 6,
                fontSize: 11,
              }}
            >
              Est. Ingredient Cost:{" "}
              <strong style={{ color: T.danger }}>
                {fmt(
                  inventory
                    .filter((i) => draft.inventoryLinks.includes(i.id))
                    .reduce(
                      (s, i) =>
                        s + i.costPerUnit * i.usedPerPlate * draft.guests,
                      0
                    )
                )}
              </strong>
              <span style={{ color: T.textDim, marginLeft: 6 }}>
                based on {draft.guests} guests
              </span>
            </div>
          )}
          <div style={{ ...S.row, marginTop: 10, justifyContent: "flex-end" }}>
            <button style={S.btn("ghost")} onClick={() => setBuilding(false)}>
              Cancel
            </button>
            <button style={S.btn("primary")} onClick={saveDraft}>
              Save Proposal
            </button>
          </div>
        </div>
      )}

      {proposals.map((p, i) => {
        const total = propTotal(p.lines, p.discount);
        return (
          <div key={p.id} style={{ ...S.card, marginBottom: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                cursor: "pointer",
              }}
              onClick={() => setSel(sel === i ? null : i)}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>
                  {p.num} — {p.client}
                </div>
                <div
                  style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}
                >
                  {p.eventType} · {p.plannedDate || "Date TBD"} · {p.guests}{" "}
                  guests · {p.location}
                </div>
                <Badge color={stColor[p.status] || T.textMuted}>
                  {p.status}
                </Badge>
                {(p.inventoryLinks || []).length > 0 && (
                  <span style={{ ...S.badge(T.info), marginLeft: 4 }}>
                    📦 {p.inventoryLinks.length} linked
                  </span>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.accent }}>
                  {fmt(total)}
                </div>
                <div style={{ fontSize: 10, color: T.textMuted }}>
                  {p.lines.length} items
                </div>
              </div>
            </div>

            {sel === i && (
              <div style={{ marginTop: 10 }}>
                <Divider />
                <div
                  style={{ fontSize: 10, color: T.textMuted, marginBottom: 7 }}
                >
                  ✏️ Qty and unit price are editable below
                </div>
                <table style={{ ...S.table, marginBottom: 8 }}>
                  <thead>
                    <tr>
                      {[
                        "Service / Item",
                        "Unit",
                        "Qty",
                        "Unit Price (XAF)",
                        "Total",
                      ].map((h) => (
                        <th key={h} style={S.th}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {p.lines.map((l, j) => (
                      <tr key={j}>
                        <td style={{ ...S.td, fontWeight: 600 }}>{l.name}</td>
                        <td style={S.td}>{l.unitType}</td>
                        <td style={S.td}>
                          <input
                            type="number"
                            style={{
                              ...S.input,
                              width: 60,
                              padding: "3px 5px",
                            }}
                            value={l.qty}
                            onChange={(e) =>
                              updateLine(i, j, "qty", e.target.value)
                            }
                          />
                        </td>
                        <td style={S.td}>
                          <input
                            type="number"
                            style={{
                              ...S.input,
                              width: 100,
                              padding: "3px 5px",
                              color: T.accent,
                              fontWeight: 700,
                            }}
                            value={l.price}
                            onChange={(e) =>
                              updateLine(i, j, "price", e.target.value)
                            }
                          />
                        </td>
                        <td
                          style={{ ...S.td, fontWeight: 700, color: T.accent }}
                        >
                          {fmt(l.qty * l.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textAlign: "right", marginBottom: 10 }}>
                  {p.discount > 0 && (
                    <div style={{ fontSize: 11, color: T.textMuted }}>
                      Discount: -{fmt(p.discount)}
                    </div>
                  )}
                  <div
                    style={{ fontSize: 13, fontWeight: 800, color: T.accent }}
                  >
                    TOTAL: {fmt(total)}
                  </div>
                  <div style={{ fontSize: 10, color: T.textMuted }}>
                    Deposit (50%): {fmt(total * 0.5)}
                  </div>
                </div>

                {/* Inventory Links section */}
                <div style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: T.textMuted,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      📦 Linked Inventory / Ingredients
                    </div>
                    <button
                      style={{
                        ...S.btn("ghost"),
                        fontSize: 10,
                        padding: "2px 7px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInvLink(showInvLink === i ? null : i);
                      }}
                    >
                      {showInvLink === i ? "Done" : "Edit Links"}
                    </button>
                  </div>
                  {showInvLink === i && (
                    <div
                      style={{
                        display: "flex",
                        gap: 5,
                        flexWrap: "wrap",
                        marginBottom: 8,
                      }}
                    >
                      {inventory.map((inv) => {
                        const linked = (p.inventoryLinks || []).includes(
                          inv.id
                        );
                        return (
                          <div
                            key={inv.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleInventoryLink(i, inv.id);
                            }}
                            style={{
                              padding: "3px 9px",
                              borderRadius: 20,
                              fontSize: 11,
                              cursor: "pointer",
                              background: linked ? `${T.accent}20` : T.surface,
                              border: `1px solid ${
                                linked ? T.accent : T.border
                              }`,
                              color: linked ? T.accent : T.textMuted,
                            }}
                          >
                            {linked ? "✓ " : ""}
                            {inv.name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {(p.inventoryLinks || []).length > 0 ? (
                    <div
                      style={{
                        background: T.surface,
                        borderRadius: 7,
                        padding: 10,
                      }}
                    >
                      <div className="tbl-wrap">
                        <table style={S.table}>
                          <thead>
                            <tr>
                              <th style={S.th}>Ingredient</th>
                              <th style={S.th}>Unit</th>
                              <th style={S.th}>Cost/Unit</th>
                              <th style={S.th}>Used/Plate</th>
                              <th style={S.th}>Est. Total Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inventory
                              .filter((inv) =>
                                (p.inventoryLinks || []).includes(inv.id)
                              )
                              .map((inv) => (
                                <tr key={inv.id}>
                                  <td style={{ ...S.td, fontWeight: 600 }}>
                                    {inv.name}
                                  </td>
                                  <td style={S.td}>{inv.unit}</td>
                                  <td style={S.td}>{fmt(inv.costPerUnit)}</td>
                                  <td style={S.td}>{inv.usedPerPlate}</td>
                                  <td
                                    style={{
                                      ...S.td,
                                      color: T.danger,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {fmt(
                                      inv.usedPerPlate *
                                        inv.costPerUnit *
                                        p.guests
                                    )}
                                  </td>
                                </tr>
                              ))}
                            <tr>
                              <td
                                colSpan={4}
                                style={{
                                  ...S.td,
                                  fontWeight: 700,
                                  textAlign: "right",
                                }}
                              >
                                Total Ingredient Cost ({p.guests} guests):
                              </td>
                              <td
                                style={{
                                  ...S.td,
                                  color: T.danger,
                                  fontWeight: 800,
                                  fontSize: 13,
                                }}
                              >
                                {fmt(
                                  inventory
                                    .filter((inv) =>
                                      (p.inventoryLinks || []).includes(inv.id)
                                    )
                                    .reduce(
                                      (s, inv) =>
                                        s +
                                        inv.usedPerPlate *
                                          inv.costPerUnit *
                                          p.guests,
                                      0
                                    )
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: T.textDim }}>
                      No inventory items linked. Click "Edit Links" to connect
                      ingredients for costing.
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  <button
                    style={{
                      ...S.btn("primary"),
                      fontSize: 11,
                      padding: "4px 9px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDoc(
                        `Proposal – ${p.num}`,
                        buildProposalHTML(p, biz, logo)
                      );
                    }}
                  >
                    🖨️ Print Proposal
                  </button>
                  <button
                    style={{
                      ...S.btn("ghost"),
                      fontSize: 11,
                      padding: "4px 9px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const u = [...proposals];
                      u[i] = { ...p, status: "Sent" };
                      setProposals(u);
                    }}
                  >
                    ✉️ Mark Sent
                  </button>
                  <button
                    style={{
                      ...S.btn("ghost"),
                      fontSize: 11,
                      padding: "4px 9px",
                      borderColor: T.success,
                      color: T.success,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const u = [...proposals];
                      u[i] = { ...p, status: "Approved" };
                      setProposals(u);
                    }}
                  >
                    ✓ Approve
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── RESTAURANT & DELIVERY (with Meals tab) ─────────────────────
function RestaurantPage({
  sales,
  setSales,
  inventory,
  setInventory,
  catalogItems,
  meals,
  setMeals,
  logo,
  biz,
}) {
  const [tab, setTab] = useState("orders");
  const [filterType, setFilterType] = useState("All");
  const [addSale, setAddSale] = useState(false);
  const [doc, setDoc] = useState(null);
  const EMPTY = {
    date: TODAY_ISO,
    meal: "",
    plates: "",
    pricePerPlate: "",
    method: "Cash",
    type: "Dine-in",
    deliveryFee: 0,
    deliveryAddress: "",
    clientName: "",
  };
  const [ns, setNs] = useState(EMPTY);
  const [addingInv, setAddingInv] = useState(false);
  const [editInvId, setEditInvId] = useState(null);
  const [ni, setNi] = useState({
    name: "",
    category: "Ingredient",
    unit: "kg",
    stock: "",
    reorderAt: "",
    costPerUnit: "",
    usedPerPlate: "",
    linkedMeals: "",
  });
  const [invCategories, setInvCategories] = useState([
    "Ingredient", "Packaging", "Fuel", "Beverage", "Cleaning", "Other",
  ]);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatValue, setNewCatValue] = useState("");
  // Meals state
  const [addingMeal, setAddingMeal] = useState(false);
  const [editMealId, setEditMealId] = useState(null);
  const EMPTY_MEAL = {
    name: "",
    description: "",
    price: "",
    category: "Main",
    photo: null,
    active: true,
    ingredientLinks: [],
    laborCost: "",
    otherCosts: [],
    availablePortions: "",
  };
  const [nm, setNm] = useState(EMPTY_MEAL);
  const [importFromCatalog, setImportFromCatalog] = useState(false);
  const [editIngLinks, setEditIngLinks] = useState(null); // meal id
  const [expandedMeal, setExpandedMeal] = useState(null); // meal id for costing panel
  const mealPhotoRef = useRef();
  const isMobile = useIsMobile();

  const openDoc = (title, html) =>
    setDoc({ title, html, onPrint: () => printDoc(title, html) });
  const filtered =
    filterType === "All" ? sales : sales.filter((s) => s.type === filterType);
  const todayRev = sales
    .filter((s) => s.date === TODAY_ISO)
    .reduce((s, r) => s + orderTotal(r), 0);
  const weekRev = sales.reduce((s, r) => s + orderTotal(r), 0);
  const delRev = sales
    .filter((s) => s.type === "Delivery")
    .reduce((s, r) => s + orderTotal(r), 0);
  const delFees = sales
    .filter((s) => s.type === "Delivery")
    .reduce((s, r) => s + (r.deliveryFee || 0), 0);
  const dineRev = sales
    .filter((s) => s.type === "Dine-in")
    .reduce((s, r) => s + orderTotal(r), 0);
  const tkRev = sales
    .filter((s) => s.type === "Takeaway")
    .reduce((s, r) => s + orderTotal(r), 0);
  const byMeal = {};
  sales.forEach((s) => {
    byMeal[s.meal] = (byMeal[s.meal] || 0) + s.plates * s.pricePerPlate;
  });
  const lowStock = inventory.filter((i) => i.stock <= i.reorderAt);
  const typeColor = {
    "Dine-in": T.restaurant,
    Takeaway: T.warning,
    Delivery: T.delivery,
  };
  const totalStockValue = inventory.reduce(
    (s, i) => s + i.stock * i.costPerUnit,
    0
  );

  const saveSale = () => {
    const sale = {
      ...ns,
      id: Date.now(),
      plates: Number(ns.plates),
      pricePerPlate: Number(ns.pricePerPlate),
      deliveryFee: Number(ns.deliveryFee || 0),
    };
    setSales((prev) => [...prev, sale]);
    setInventory((prev) =>
      prev.map((item) => {
        const mealLower = ns.meal.toLowerCase();
        const linked =
          Array.isArray(item.linkedMeals) &&
          item.linkedMeals.some(
            (m) =>
              mealLower.includes(m.toLowerCase().split(" ")[0]) ||
              m.toLowerCase().includes(mealLower.split(" ")[0])
          );
        if (linked && item.usedPerPlate > 0)
          return {
            ...item,
            stock: Math.max(
              0,
              item.stock - item.usedPerPlate * Number(ns.plates)
            ),
          };
        return item;
      })
    );
    setAddSale(false);
    setNs(EMPTY);
  };
  const saveInv = () => {
    const item = {
      ...ni,
      stock: Number(ni.stock),
      reorderAt: Number(ni.reorderAt),
      costPerUnit: Number(ni.costPerUnit),
      usedPerPlate: Number(ni.usedPerPlate || 0),
      linkedMeals: ni.linkedMeals
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (editInvId != null) {
      setInventory((prev) =>
        prev.map((it) =>
          it.id === editInvId ? { ...item, id: editInvId } : it
        )
      );
      setEditInvId(null);
    } else {
      setInventory((prev) => [...prev, { ...item, id: Date.now() }]);
    }
    setAddingInv(false);
    setNi({
      name: "",
      category: "Ingredient",
      unit: "kg",
      stock: "",
      reorderAt: "",
      costPerUnit: "",
      usedPerPlate: "",
      linkedMeals: "",
    });
  };
  const startEditInv = (item) => {
    setNi({
      ...item,
      linkedMeals: Array.isArray(item.linkedMeals)
        ? item.linkedMeals.join(", ")
        : "",
    });
    setEditInvId(item.id);
    setAddingInv(true);
  };
  const deleteInv = (id) =>
    setInventory((prev) => prev.filter((it) => it.id !== id));

  // Meals
  const saveMeal = () => {
    if (!nm.name || !nm.price) return;
    const meal = {
      ...nm,
      price: Number(nm.price),
      laborCost: Number(nm.laborCost || 0),
      availablePortions: Number(nm.availablePortions || 0),
      otherCosts: nm.otherCosts || [],
    };
    if (editMealId != null) {
      setMeals((prev) =>
        prev.map((m) => (m.id === editMealId ? { ...meal, id: editMealId } : m))
      );
      setEditMealId(null);
    } else {
      setMeals((prev) => [...prev, { ...meal, id: Date.now() }]);
    }
    setAddingMeal(false);
    setNm(EMPTY_MEAL);
  };
  const startEditMeal = (meal) => {
    setNm({
      ...meal,
      price: String(meal.price),
      laborCost: String(meal.laborCost || ""),
      availablePortions: String(meal.availablePortions || ""),
      otherCosts: meal.otherCosts || [],
    });
    setEditMealId(meal.id);
    setAddingMeal(true);
  };
  const importMealFromCatalog = (catItem) => {
    const exists = meals.find((m) => m.name === catItem.name);
    if (exists) return;
    const meal = {
      id: Date.now(),
      name: catItem.name,
      description: catItem.description || "",
      price: catItem.price,
      category: "Imported",
      photo: catItem.photo,
      active: true,
      ingredientLinks: [],
      laborCost: 0,
      otherCosts: [],
      availablePortions: 0,
    };
    setMeals((prev) => [...prev, meal]);
  };
  const toggleIngredientLink = (mealId, invId) => {
    setMeals((prev) =>
      prev.map((m) => {
        if (m.id !== mealId) return m;
        const links = m.ingredientLinks || [];
        const has = links.some((l) => l.inventoryId === invId);
        return {
          ...m,
          ingredientLinks: has
            ? links.filter((l) => l.inventoryId !== invId)
            : [
                ...links,
                {
                  inventoryId: invId,
                  qty:
                    inventory.find((i) => i.id === invId)?.usedPerPlate || 0.1,
                },
              ],
        };
      })
    );
  };
  const updateIngQty = (mealId, invId, qty) => {
    setMeals((prev) =>
      prev.map((m) => {
        if (m.id !== mealId) return m;
        return {
          ...m,
          ingredientLinks: m.ingredientLinks.map((l) =>
            l.inventoryId === invId ? { ...l, qty: Number(qty) } : l
          ),
        };
      })
    );
  };
  const getMealIngCost = (meal) =>
    (meal.ingredientLinks || []).reduce((s, l) => {
      const inv = inventory.find((i) => i.id === l.inventoryId);
      return s + (inv ? inv.costPerUnit * l.qty : 0);
    }, 0);
  const getMealTotalCost = (meal) =>
    getMealIngCost(meal) +
    Number(meal.laborCost || 0) +
    (meal.otherCosts || []).reduce((s, c) => s + Number(c.amount || 0), 0);

  return (
    <div>
      <DocModal doc={doc} onClose={() => setDoc(null)} />
      <div style={S.pageTitle}>🍽️ Restaurant & Delivery</div>
      <div style={S.subtitle}>Orders · Meals · Inventory · Production</div>
      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
        {[
          ["orders", "📋 Orders"],
          ["meals", "🍲 Meals"],
          ["inventory", "📦 Inventory"],
          ["batches", "🍳 Batches"],
        ].map(([t, label]) => (
          <button key={t} style={S.navBtn(tab === t)} onClick={() => setTab(t)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── ORDERS TAB ── */}
      {tab === "orders" && (
        <>
          <div style={S.grid(4)}>
            <KpiCard label="Today's Revenue" value={fmt(todayRev)} icon="📅" />
            <KpiCard label="Week Total" value={fmt(weekRev)} icon="📆" />
            <KpiCard
              label="Delivery Revenue"
              value={fmt(delRev)}
              color={T.delivery}
              icon="🛵"
              sub={`incl. ${fmt(delFees)} fees`}
            />
            <KpiCard
              label="Best Seller"
              value={
                Object.entries(byMeal).sort((a, b) => b[1] - a[1])[0]?.[0] ||
                "—"
              }
              icon="⭐"
              color={T.restaurant}
            />
          </div>
          <div style={{ ...S.card, marginTop: 10, marginBottom: 10 }}>
            <div style={S.cardTitle}>Revenue by Fulfillment (Week)</div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {[
                { label: "🪑 Dine-in", val: dineRev, color: T.restaurant },
                { label: "🥡 Takeaway", val: tkRev, color: T.warning },
                { label: "🛵 Delivery", val: delRev, color: T.delivery },
              ].map((item) => (
                <div key={item.label} style={{ minWidth: 130 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: T.textMuted,
                      marginBottom: 2,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{ fontSize: 15, fontWeight: 800, color: item.color }}
                  >
                    {fmt(item.val)}
                  </div>
                  <PBar
                    pct={weekRev ? (item.val / weekRev) * 100 : 0}
                    color={item.color}
                  />
                </div>
              ))}
            </div>
          </div>
          {lowStock.length > 0 && (
            <div
              style={{
                background: `${T.warning}12`,
                border: `1px solid ${T.warning}40`,
                borderRadius: 6,
                padding: 8,
                marginBottom: 8,
                fontSize: 11,
              }}
            >
              <strong style={{ color: T.warning }}>⚠️ Low Stock:</strong>{" "}
              {lowStock
                .map((i) => `${i.name} (${i.stock} ${i.unit})`)
                .join(" · ")}
            </div>
          )}
          <div style={{ ...S.row, marginBottom: 9, flexWrap: "wrap", gap: 5 }}>
            <div style={{ display: "flex", gap: 3 }}>
              {["All", "Dine-in", "Takeaway", "Delivery"].map((t) => (
                <button
                  key={t}
                  style={S.navBtn(filterType === t)}
                  onClick={() => setFilterType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              style={S.btn("primary")}
              onClick={() => setAddSale(!addSale)}
            >
              + Record Order
            </button>
          </div>
          {addSale && (
            <div style={{ ...S.card, marginBottom: 10, borderColor: T.accent }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div style={S.sectionTitle}>New Order</div>
                {ns.meal && (
                  <div style={{ fontSize: 11, color: T.textMuted }}>
                    Auto-deduct:{" "}
                    <strong style={{ color: T.accent }}>
                      {inventory
                        .filter((i) =>
                          i.linkedMeals?.some((m) =>
                            ns.meal
                              .toLowerCase()
                              .includes(m.toLowerCase().split(" ")[0])
                          )
                        )
                        .map((i) => i.name)
                        .join(", ") || "no matches"}
                    </strong>
                  </div>
                )}
              </div>
              <div style={S.grid(3)}>
                <div>
                  <label style={S.label}>Date</label>
                  <input
                    type="date"
                    style={S.input}
                    value={ns.date}
                    onChange={(e) => setNs({ ...ns, date: e.target.value })}
                  />
                </div>
                <div>
                  <label style={S.label}>Meal</label>
                  <select
                    style={S.select}
                    value={ns.meal}
                    onChange={(e) => {
                      const m = meals.find((ml) => ml.name === e.target.value);
                      setNs({
                        ...ns,
                        meal: e.target.value,
                        pricePerPlate: m ? m.price : ns.pricePerPlate,
                      });
                    }}
                  >
                    {meals
                      .filter((m) => m.active)
                      .map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    <option value="">-- other --</option>
                  </select>
                </div>
                <div>
                  <label style={S.label}>Fulfillment</label>
                  <select
                    style={S.select}
                    value={ns.type}
                    onChange={(e) =>
                      setNs({
                        ...ns,
                        type: e.target.value,
                        deliveryFee: e.target.value === "Delivery" ? 2000 : 0,
                      })
                    }
                  >
                    <option>Dine-in</option>
                    <option>Takeaway</option>
                    <option>Delivery</option>
                  </select>
                </div>
                <div>
                  <label style={S.label}>Plates</label>
                  <input
                    type="number"
                    style={S.input}
                    value={ns.plates}
                    onChange={(e) => setNs({ ...ns, plates: e.target.value })}
                  />
                </div>
                <div>
                  <label style={S.label}>Price/Plate (XAF)</label>
                  <input
                    type="number"
                    style={S.input}
                    value={ns.pricePerPlate}
                    onChange={(e) =>
                      setNs({ ...ns, pricePerPlate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label style={S.label}>Payment Method</label>
                  <select
                    style={S.select}
                    value={ns.method}
                    onChange={(e) => setNs({ ...ns, method: e.target.value })}
                  >
                    {["Cash", "Mobile Money", "Bank Transfer", "Card"].map(
                      (m) => (
                        <option key={m}>{m}</option>
                      )
                    )}
                  </select>
                </div>
                {ns.type === "Delivery" && (
                  <>
                    <div>
                      <label style={S.label}>Client Name</label>
                      <input
                        style={S.input}
                        value={ns.clientName}
                        onChange={(e) =>
                          setNs({ ...ns, clientName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label style={S.label}>Delivery Address</label>
                      <input
                        style={S.input}
                        value={ns.deliveryAddress}
                        onChange={(e) =>
                          setNs({ ...ns, deliveryAddress: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label style={S.label}>Delivery Fee (XAF)</label>
                      <input
                        type="number"
                        style={S.input}
                        value={ns.deliveryFee}
                        onChange={(e) =>
                          setNs({ ...ns, deliveryFee: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              <div
                style={{ ...S.row, marginTop: 8, justifyContent: "flex-end" }}
              >
                <button
                  style={S.btn("ghost")}
                  onClick={() => {
                    setAddSale(false);
                    setNs(EMPTY);
                  }}
                >
                  Cancel
                </button>
                <button style={S.btn("primary")} onClick={saveSale}>
                  Save & Deduct Inventory
                </button>
              </div>
            </div>
          )}
          {isMobile ? (
            <div>
              {[...filtered].reverse().map((s) => (
                <div key={s.id} style={{ ...S.cardMobile, marginBottom: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 4,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>
                        {s.meal}
                      </div>
                      <div style={{ fontSize: 10, color: T.textMuted }}>
                        {s.date} · {s.plates} plates
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: T.restaurant,
                        }}
                      >
                        {fmt(orderTotal(s))}
                      </div>
                      <Badge color={typeColor[s.type] || T.textMuted}>
                        {s.type}
                      </Badge>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      color: T.textMuted,
                    }}
                  >
                    <span>
                      {s.method} · {fmt(s.pricePerPlate)}/plate
                    </span>
                    {s.deliveryFee > 0 && (
                      <span style={{ color: T.delivery }}>
                        +{fmt(s.deliveryFee)} del.
                      </span>
                    )}
                  </div>
                  {s.type === "Delivery" && s.clientName && (
                    <div
                      style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}
                    >
                      📍 {s.clientName} · {s.deliveryAddress}
                    </div>
                  )}
                  <div style={{ marginTop: 6, textAlign: "right" }}>
                    <button
                      style={{
                        ...S.btn("ghost"),
                        fontSize: 10,
                        padding: "2px 7px",
                      }}
                      onClick={() =>
                        openDoc(
                          `Receipt – Order #${s.id}`,
                          buildOrderReceiptHTML(s, biz, logo)
                        )
                      }
                    >
                      🧾 Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tbl-wrap">
              <table style={S.table}>
                <thead>
                  <tr>
                    {[
                      "Date",
                      "Meal",
                      "Plates",
                      "Price/Plate",
                      "Del. Fee",
                      "Total",
                      "Method",
                      "Type",
                      "Client / Address",
                      "",
                    ].map((h) => (
                      <th key={h} style={S.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...filtered].reverse().map((s) => (
                    <tr key={s.id}>
                      <td style={S.td}>{s.date}</td>
                      <td style={{ ...S.td, fontWeight: 700 }}>{s.meal}</td>
                      <td style={S.td}>{s.plates}</td>
                      <td style={S.td}>{fmt(s.pricePerPlate)}</td>
                      <td
                        style={{
                          ...S.td,
                          color: s.deliveryFee > 0 ? T.delivery : T.textDim,
                        }}
                      >
                        {s.deliveryFee > 0 ? fmt(s.deliveryFee) : "—"}
                      </td>
                      <td
                        style={{
                          ...S.td,
                          fontWeight: 700,
                          color: T.restaurant,
                        }}
                      >
                        {fmt(orderTotal(s))}
                      </td>
                      <td style={S.td}>{s.method}</td>
                      <td style={S.td}>
                        <Badge color={typeColor[s.type] || T.textMuted}>
                          {s.type}
                        </Badge>
                      </td>
                      <td style={{ ...S.td, fontSize: 11, color: T.textMuted }}>
                        {s.type === "Delivery" ? (
                          <span>
                            {s.clientName && (
                              <strong
                                style={{ color: T.text, display: "block" }}
                              >
                                {s.clientName}
                              </strong>
                            )}
                            {s.deliveryAddress}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td style={S.td}>
                        <button
                          style={{
                            ...S.btn("ghost"),
                            fontSize: 10,
                            padding: "2px 6px",
                          }}
                          onClick={() =>
                            openDoc(
                              `Receipt – Order #${s.id}`,
                              buildOrderReceiptHTML(s, biz, logo)
                            )
                          }
                        >
                          🧾
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── MEALS TAB ── */}
      {tab === "meals" && (
        <>
          <div style={{ ...S.row, marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
            <div style={{ ...S.card, flex: 1, padding: 10, minWidth: 160 }}>
              <div style={S.cardTitle}>Active Meals</div>
              <div style={{ ...S.kpi, fontSize: 18 }}>
                {meals.filter((m) => m.active).length}
              </div>
            </div>
            <div style={{ ...S.card, flex: 1, padding: 10, minWidth: 160 }}>
              <div style={S.cardTitle}>Avg. Price</div>
              <div style={{ ...S.kpi, fontSize: 18 }}>
                {meals.length
                  ? fmt(meals.reduce((s, m) => s + m.price, 0) / meals.length)
                  : "—"}
              </div>
            </div>
            <div style={{ ...S.card, flex: 1, padding: 10, minWidth: 160 }}>
              <div style={S.cardTitle}>With Costing</div>
              <div style={{ ...S.kpi, fontSize: 18, color: T.success }}>
                {
                  meals.filter(
                    (m) =>
                      (m.ingredientLinks || []).length > 0 ||
                      Number(m.laborCost || 0) > 0 ||
                      (m.otherCosts || []).length > 0
                  ).length
                }
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                style={S.btn("ghost")}
                onClick={() => setImportFromCatalog(!importFromCatalog)}
              >
                ⬇ Import from Catalog
              </button>
              <button
                style={S.btn("primary")}
                onClick={() => {
                  setAddingMeal(!addingMeal);
                  setEditMealId(null);
                  setNm(EMPTY_MEAL);
                }}
              >
                {addingMeal && !editMealId ? "Cancel" : "+ New Meal"}
              </button>
            </div>
          </div>

          {/* Import from catalog panel */}
          {importFromCatalog && (
            <div
              style={{ ...S.card, marginBottom: 12, borderColor: T.delivery }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div style={S.sectionTitle}>⬇ Import from Catalog</div>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: T.textMuted,
                    cursor: "pointer",
                  }}
                  onClick={() => setImportFromCatalog(false)}
                >
                  ×
                </button>
              </div>
              <div
                style={{ fontSize: 11, color: T.textMuted, marginBottom: 10 }}
              >
                Click any catalog item to add it to your meal menu.
                Already-imported items are greyed out.
              </div>
              <div style={S.grid(4)}>
                {catalogItems.map((ci) => {
                  const already = meals.some((m) => m.name === ci.name);
                  return (
                    <div
                      key={ci.id}
                      onClick={() => !already && importMealFromCatalog(ci)}
                      style={{
                        ...S.card,
                        padding: 0,
                        overflow: "hidden",
                        cursor: already ? "default" : "pointer",
                        opacity: already ? 0.5 : 1,
                        border: `1px solid ${already ? T.border : T.delivery}`,
                      }}
                    >
                      {ci.photo ? (
                        <img
                          src={ci.photo}
                          alt=""
                          style={{
                            width: "100%",
                            height: 70,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            height: 50,
                            background: T.surface,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                            color: T.textDim,
                          }}
                        >
                          🍽️
                        </div>
                      )}
                      <div style={{ padding: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 700 }}>
                          {ci.name}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: T.accent,
                            fontWeight: 700,
                          }}
                        >
                          {fmt(ci.price)}
                        </div>
                        {already && (
                          <div style={{ fontSize: 9, color: T.success }}>
                            ✓ Already imported
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add / edit meal form */}
          {addingMeal && (
            <div style={{ ...S.card, marginBottom: 12, borderColor: T.accent }}>
              <div style={S.sectionTitle}>
                {editMealId ? "✏️ Edit Meal" : "➕ New Meal"}
              </div>

              {/* Basic Info */}
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  marginBottom: 6,
                }}
              >
                Basic Info
              </div>
              <div style={S.grid(3)}>
                <div>
                  <label style={S.label}>Meal Name</label>
                  <input
                    style={S.input}
                    value={nm.name}
                    onChange={(e) => setNm({ ...nm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={S.label}>Category</label>
                  <select
                    style={S.select}
                    value={nm.category}
                    onChange={(e) => setNm({ ...nm, category: e.target.value })}
                  >
                    {[
                      "Main",
                      "Starter",
                      "Side",
                      "Dessert",
                      "Drink",
                      "Imported",
                      "Other",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Photo</label>
                  <div
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    {nm.photo && (
                      <img
                        src={nm.photo}
                        alt="m"
                        style={{
                          width: 32,
                          height: 32,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    )}
                    <button
                      style={{
                        ...S.btn("ghost"),
                        fontSize: 11,
                        padding: "4px 8px",
                      }}
                      onClick={() => mealPhotoRef.current.click()}
                    >
                      {nm.photo ? "Change" : "Upload"}
                    </button>
                    {nm.photo && (
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: T.danger,
                          cursor: "pointer",
                        }}
                        onClick={() => setNm({ ...nm, photo: null })}
                      >
                        ✕
                      </button>
                    )}
                    <input
                      ref={mealPhotoRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files[0];
                        if (!f) return;
                        const r = new FileReader();
                        r.onload = (ev) =>
                          setNm((n) => ({ ...n, photo: ev.target.result }));
                        r.readAsDataURL(f);
                      }}
                    />
                  </div>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={S.label}>Description</label>
                  <input
                    style={S.input}
                    value={nm.description}
                    onChange={(e) =>
                      setNm({ ...nm, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label style={S.label}>Active</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 6,
                    }}
                  >
                    <input
                      type="checkbox"
                      id="meal-active"
                      checked={nm.active}
                      onChange={(e) =>
                        setNm({ ...nm, active: e.target.checked })
                      }
                    />
                    <label
                      htmlFor="meal-active"
                      style={{ fontSize: 11, color: T.textMuted }}
                    >
                      Available for orders
                    </label>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Costing Section */}
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  marginBottom: 8,
                }}
              >
                💰 Costing (per portion)
              </div>

              {/* Ingredient Links */}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.text,
                  marginBottom: 6,
                }}
              >
                🧂 Ingredients / Inventory
              </div>
              <div
                style={{
                  background: T.surface,
                  borderRadius: 7,
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                {inventory.map((inv) => {
                  const link = (nm.ingredientLinks || []).find(
                    (l) => l.inventoryId === inv.id
                  );
                  return (
                    <div
                      key={inv.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 5,
                        fontSize: 11,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!link}
                        onChange={() => {
                          const links = nm.ingredientLinks || [];
                          const has = links.some(
                            (l) => l.inventoryId === inv.id
                          );
                          setNm({
                            ...nm,
                            ingredientLinks: has
                              ? links.filter((l) => l.inventoryId !== inv.id)
                              : [
                                  ...links,
                                  {
                                    inventoryId: inv.id,
                                    qty: inv.usedPerPlate || 0.1,
                                  },
                                ],
                          });
                        }}
                      />
                      <span style={{ flex: 1, color: T.textMuted }}>
                        {inv.name}
                      </span>
                      <span
                        style={{ fontSize: 10, color: T.textDim, minWidth: 60 }}
                      >
                        {fmt(inv.costPerUnit)}/{inv.unit}
                      </span>
                      {link && (
                        <>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            style={{
                              ...S.input,
                              width: 65,
                              padding: "3px 5px",
                              fontSize: 11,
                            }}
                            value={link.qty}
                            onChange={(e) =>
                              setNm({
                                ...nm,
                                ingredientLinks: nm.ingredientLinks.map((l) =>
                                  l.inventoryId === inv.id
                                    ? { ...l, qty: Number(e.target.value) }
                                    : l
                                ),
                              })
                            }
                          />
                          <span
                            style={{
                              fontSize: 10,
                              color: T.textDim,
                              minWidth: 30,
                            }}
                          >
                            {inv.unit}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: T.danger,
                              fontWeight: 700,
                              minWidth: 70,
                              textAlign: "right",
                            }}
                          >
                            {fmt(inv.costPerUnit * link.qty)}
                          </span>
                        </>
                      )}
                      {!link && (
                        <span
                          style={{
                            fontSize: 11,
                            color: T.textDim,
                            minWidth: 185,
                            textAlign: "right",
                          }}
                        >
                          —
                        </span>
                      )}
                    </div>
                  );
                })}
                {(nm.ingredientLinks || []).length > 0 && (
                  <div
                    style={{
                      borderTop: `1px solid ${T.border}`,
                      marginTop: 6,
                      paddingTop: 6,
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ color: T.textMuted }}>
                      Ingredient subtotal:
                    </span>
                    <span style={{ color: T.danger }}>
                      {fmt(
                        (nm.ingredientLinks || []).reduce((s, l) => {
                          const inv = inventory.find(
                            (i) => i.id === l.inventoryId
                          );
                          return s + (inv ? inv.costPerUnit * l.qty : 0);
                        }, 0)
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Labor Cost */}
              <div style={S.grid(2)}>
                <div>
                  <label style={S.label}>👨‍🍳 Labor Cost per Portion (XAF)</label>
                  <input
                    type="number"
                    min="0"
                    style={S.input}
                    value={nm.laborCost}
                    onChange={(e) =>
                      setNm({ ...nm, laborCost: e.target.value })
                    }
                    placeholder="e.g. 200"
                  />
                </div>
              </div>

              {/* Other Costs */}
              <div style={{ marginTop: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.text }}>
                    📋 Other Costs per Portion
                  </div>
                  <button
                    style={{
                      ...S.btn("ghost"),
                      fontSize: 10,
                      padding: "2px 8px",
                    }}
                    onClick={() =>
                      setNm({
                        ...nm,
                        otherCosts: [
                          ...(nm.otherCosts || []),
                          { label: "", amount: "" },
                        ],
                      })
                    }
                  >
                    + Add
                  </button>
                </div>
                {(nm.otherCosts || []).map((oc, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      marginBottom: 5,
                    }}
                  >
                    <input
                      style={{ ...S.input, flex: 2 }}
                      placeholder="Label (e.g. Packaging)"
                      value={oc.label}
                      onChange={(e) =>
                        setNm({
                          ...nm,
                          otherCosts: nm.otherCosts.map((c, i) =>
                            i === idx ? { ...c, label: e.target.value } : c
                          ),
                        })
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      style={{ ...S.input, flex: 1 }}
                      placeholder="Amount (XAF)"
                      value={oc.amount}
                      onChange={(e) =>
                        setNm({
                          ...nm,
                          otherCosts: nm.otherCosts.map((c, i) =>
                            i === idx ? { ...c, amount: e.target.value } : c
                          ),
                        })
                      }
                    />
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: T.danger,
                        cursor: "pointer",
                        fontSize: 14,
                        padding: "0 4px",
                      }}
                      onClick={() =>
                        setNm({
                          ...nm,
                          otherCosts: nm.otherCosts.filter((_, i) => i !== idx),
                        })
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <Divider />

              {/* Pricing */}
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  marginBottom: 8,
                }}
              >
                🏷️ Pricing & Availability
              </div>
              <div style={S.grid(2)}>
                <div>
                  <label style={S.label}>Selling Price per Portion (XAF)</label>
                  <input
                    type="number"
                    style={{ ...S.input, color: T.accent, fontWeight: 700 }}
                    value={nm.price}
                    onChange={(e) => setNm({ ...nm, price: e.target.value })}
                    placeholder="e.g. 4500"
                  />
                </div>
                <div>
                  <label style={S.label}>Available Portions (batch qty)</label>
                  <input
                    type="number"
                    min="0"
                    style={S.input}
                    value={nm.availablePortions}
                    onChange={(e) =>
                      setNm({ ...nm, availablePortions: e.target.value })
                    }
                    placeholder="e.g. 30"
                  />
                </div>
              </div>

              {/* Live cost summary */}
              {(Number(nm.price) > 0 ||
                Number(nm.laborCost) > 0 ||
                (nm.ingredientLinks || []).length > 0) &&
                (() => {
                  const ingC = (nm.ingredientLinks || []).reduce((s, l) => {
                    const inv = inventory.find((i) => i.id === l.inventoryId);
                    return s + (inv ? inv.costPerUnit * l.qty : 0);
                  }, 0);
                  const labC = Number(nm.laborCost || 0);
                  const othC = (nm.otherCosts || []).reduce(
                    (s, c) => s + Number(c.amount || 0),
                    0
                  );
                  const totalC = ingC + labC + othC;
                  const price = Number(nm.price || 0);
                  const portions = Number(nm.availablePortions || 0);
                  const profit = price - totalC;
                  const margin =
                    price > 0 ? ((profit / price) * 100).toFixed(0) : null;
                  const totalValue = price * portions;
                  const totalProfit = profit * portions;
                  return (
                    <div
                      style={{
                        marginTop: 12,
                        background: T.surface,
                        borderRadius: 8,
                        padding: 12,
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        gap: 10,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            color: T.textMuted,
                            marginBottom: 2,
                          }}
                        >
                          Total Cost/Portion
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: T.danger,
                          }}
                        >
                          {fmt(totalC)}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            color: T.textMuted,
                            marginBottom: 2,
                          }}
                        >
                          Profit/Portion
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: profit >= 0 ? T.success : T.danger,
                          }}
                        >
                          {fmt(profit)}
                        </div>
                        {margin && (
                          <div style={{ fontSize: 9, color: T.textMuted }}>
                            {margin}% margin
                          </div>
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            color: T.textMuted,
                            marginBottom: 2,
                          }}
                        >
                          Total Meal Value
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: T.accent,
                          }}
                        >
                          {portions > 0 ? fmt(totalValue) : "—"}
                        </div>
                        {portions > 0 && (
                          <div style={{ fontSize: 9, color: T.textMuted }}>
                            {portions} portions × {fmt(price)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            color: T.textMuted,
                            marginBottom: 2,
                          }}
                        >
                          Total Profit
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: totalProfit >= 0 ? T.success : T.danger,
                          }}
                        >
                          {portions > 0 ? fmt(totalProfit) : "—"}
                        </div>
                      </div>
                    </div>
                  );
                })()}

              <div
                style={{ ...S.row, marginTop: 12, justifyContent: "flex-end" }}
              >
                <button
                  style={S.btn("ghost")}
                  onClick={() => {
                    setAddingMeal(false);
                    setEditMealId(null);
                    setNm(EMPTY_MEAL);
                  }}
                >
                  Cancel
                </button>
                <button style={S.btn("primary")} onClick={saveMeal}>
                  {editMealId ? "Update Meal" : "Save Meal"}
                </button>
              </div>
            </div>
          )}

          {/* Meals list */}
          <div style={isMobile ? S.gridMobile : S.grid(3)}>
            {meals.map((meal) => {
              const ingCost = getMealIngCost(meal);
              const totalCost = getMealTotalCost(meal);
              const portions = Number(meal.availablePortions || 0);
              const profit = meal.price - totalCost;
              const margin =
                meal.price > 0 && totalCost > 0
                  ? (((meal.price - totalCost) / meal.price) * 100).toFixed(0)
                  : null;
              const totalValue = meal.price * portions;
              const totalProfit = profit * portions;
              const isExpanded = expandedMeal === meal.id;
              const marginColor = margin
                ? Number(margin) > 40
                  ? T.success
                  : Number(margin) > 20
                  ? T.warning
                  : T.danger
                : T.textMuted;
              return (
                <div
                  key={meal.id}
                  style={{
                    ...S.card,
                    padding: 0,
                    overflow: "hidden",
                    opacity: meal.active ? 1 : 0.6,
                  }}
                >
                  {/* Photo */}
                  <div
                    style={{
                      height: 90,
                      background: T.surface,
                      position: "relative",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const inp = document.createElement("input");
                      inp.type = "file";
                      inp.accept = "image/*";
                      inp.onchange = (e) => {
                        const f = e.target.files[0];
                        if (!f) return;
                        const r = new FileReader();
                        r.onload = (ev) =>
                          setMeals((prev) =>
                            prev.map((m) =>
                              m.id === meal.id
                                ? { ...m, photo: ev.target.result }
                                : m
                            )
                          );
                        r.readAsDataURL(f);
                      };
                      inp.click();
                    }}
                  >
                    {meal.photo ? (
                      <img
                        src={meal.photo}
                        alt={meal.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: T.textDim,
                          gap: 2,
                        }}
                      >
                        <div style={{ fontSize: 24 }}>🍽️</div>
                        <div style={{ fontSize: 9 }}>Click to upload</div>
                      </div>
                    )}
                    {!meal.active && (
                      <div
                        style={{
                          position: "absolute",
                          top: 4,
                          left: 4,
                          background: T.danger,
                          color: "#fff",
                          fontSize: 9,
                          padding: "2px 5px",
                          borderRadius: 3,
                        }}
                      >
                        INACTIVE
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        background: "rgba(0,0,0,0.55)",
                        color: "#fff",
                        fontSize: 8,
                        padding: "2px 4px",
                        borderRadius: 3,
                      }}
                    >
                      📷
                    </div>
                  </div>

                  <div style={{ padding: 10 }}>
                    {/* Name & category */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 2,
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700 }}>
                        {meal.name}
                      </div>
                      <Badge color={T.textMuted}>{meal.category}</Badge>
                    </div>
                    {meal.description && (
                      <div
                        style={{
                          fontSize: 10,
                          color: T.textDim,
                          marginBottom: 6,
                          lineHeight: 1.4,
                        }}
                      >
                        {meal.description}
                      </div>
                    )}

                    {/* Price row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      <input
                        type="number"
                        value={meal.price}
                        onChange={(e) =>
                          setMeals((prev) =>
                            prev.map((m) =>
                              m.id === meal.id
                                ? { ...m, price: Number(e.target.value) }
                                : m
                            )
                          )
                        }
                        style={{
                          ...S.input,
                          width: 90,
                          padding: "3px 5px",
                          fontSize: 13,
                          fontWeight: 800,
                          color: T.accent,
                        }}
                      />
                      <span style={{ fontSize: 10, color: T.textMuted }}>
                        XAF/portion
                      </span>
                    </div>

                    {/* Quick cost summary bar */}
                    <div
                      style={{
                        background: T.surface,
                        borderRadius: 6,
                        padding: "6px 8px",
                        marginBottom: 6,
                        fontSize: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 2,
                        }}
                      >
                        <span style={{ color: T.textMuted }}>
                          Cost/portion:
                        </span>
                        <span style={{ color: T.danger, fontWeight: 700 }}>
                          {totalCost > 0 ? fmt(totalCost) : "—"}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 2,
                        }}
                      >
                        <span style={{ color: T.textMuted }}>
                          Profit/portion:
                        </span>
                        <span
                          style={{
                            color: profit >= 0 ? T.success : T.danger,
                            fontWeight: 700,
                          }}
                        >
                          {totalCost > 0 ? fmt(profit) : "—"}
                        </span>
                      </div>
                      {margin && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 2,
                          }}
                        >
                          <span style={{ color: T.textMuted }}>Margin:</span>
                          <span style={{ color: marginColor, fontWeight: 700 }}>
                            {margin}%
                          </span>
                        </div>
                      )}
                      <div
                        style={{
                          borderTop: `1px solid ${T.border}30`,
                          marginTop: 4,
                          paddingTop: 4,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: T.textMuted }}>
                          {portions > 0
                            ? `${portions} portions available`
                            : "Portions not set"}
                        </span>
                      </div>
                      {portions > 0 && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: 2,
                            }}
                          >
                            <span style={{ color: T.textMuted }}>
                              Total value:
                            </span>
                            <span style={{ color: T.accent, fontWeight: 700 }}>
                              {fmt(totalValue)}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: 2,
                            }}
                          >
                            <span style={{ color: T.textMuted }}>
                              Total profit:
                            </span>
                            <span
                              style={{
                                color: totalProfit >= 0 ? T.success : T.danger,
                                fontWeight: 700,
                              }}
                            >
                              {fmt(totalProfit)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Expanded costing detail */}
                    {isExpanded && (
                      <div
                        style={{
                          background: `${T.surface}88`,
                          borderRadius: 6,
                          padding: 8,
                          marginBottom: 6,
                          fontSize: 10,
                        }}
                      >
                        {(meal.ingredientLinks || []).length > 0 && (
                          <>
                            <div
                              style={{
                                fontWeight: 700,
                                color: T.textMuted,
                                marginBottom: 4,
                              }}
                            >
                              🧂 Ingredients
                            </div>
                            {meal.ingredientLinks.map((l) => {
                              const inv = inventory.find(
                                (i) => i.id === l.inventoryId
                              );
                              if (!inv) return null;
                              return (
                                <div
                                  key={l.inventoryId}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 2,
                                  }}
                                >
                                  <span style={{ color: T.textDim }}>
                                    {inv.name} × {l.qty}
                                    {inv.unit}
                                  </span>
                                  <span style={{ color: T.danger }}>
                                    {fmt(inv.costPerUnit * l.qty)}
                                  </span>
                                </div>
                              );
                            })}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                borderTop: `1px solid ${T.border}30`,
                                marginTop: 3,
                                paddingTop: 3,
                                fontWeight: 700,
                              }}
                            >
                              <span style={{ color: T.textMuted }}>
                                Ingredients subtotal
                              </span>
                              <span style={{ color: T.danger }}>
                                {fmt(ingCost)}
                              </span>
                            </div>
                          </>
                        )}
                        {Number(meal.laborCost || 0) > 0 && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: 4,
                            }}
                          >
                            <span style={{ color: T.textMuted }}>👨‍🍳 Labor</span>
                            <span style={{ color: T.danger }}>
                              {fmt(meal.laborCost)}
                            </span>
                          </div>
                        )}
                        {(meal.otherCosts || [])
                          .filter((c) => Number(c.amount) > 0)
                          .map((c, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 2,
                              }}
                            >
                              <span style={{ color: T.textMuted }}>
                                📋 {c.label || "Other"}
                              </span>
                              <span style={{ color: T.danger }}>
                                {fmt(c.amount)}
                              </span>
                            </div>
                          ))}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderTop: `1px solid ${T.border}`,
                            marginTop: 5,
                            paddingTop: 5,
                            fontWeight: 800,
                          }}
                        >
                          <span style={{ color: T.text }}>Total Cost</span>
                          <span style={{ color: T.danger }}>
                            {fmt(totalCost)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <button
                        style={{
                          ...S.btn("ghost"),
                          fontSize: 9,
                          padding: "2px 6px",
                        }}
                        onClick={() => startEditMeal(meal)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        style={{
                          ...S.btn("ghost"),
                          fontSize: 9,
                          padding: "2px 6px",
                          borderColor: isExpanded ? T.accent : T.border,
                          color: isExpanded ? T.accent : T.text,
                        }}
                        onClick={() =>
                          setExpandedMeal(isExpanded ? null : meal.id)
                        }
                      >
                        💰 {isExpanded ? "Hide Cost" : "View Cost"}
                      </button>
                      <button
                        style={{
                          ...S.btn("ghost"),
                          fontSize: 9,
                          padding: "2px 6px",
                          color: meal.active ? T.danger : T.success,
                        }}
                        onClick={() =>
                          setMeals((prev) =>
                            prev.map((m) =>
                              m.id === meal.id ? { ...m, active: !m.active } : m
                            )
                          )
                        }
                      >
                        {meal.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {meals.length === 0 && (
            <div
              style={{ color: T.textMuted, padding: 30, textAlign: "center" }}
            >
              No meals yet. Add a new meal or import from the catalog.
            </div>
          )}
        </>
      )}

      {/* ── INVENTORY TAB ── */}
      {tab === "inventory" && (
        <>
          <div style={{ ...S.row, marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
            <div style={{ ...S.card, flex: 1, padding: 10, minWidth: 180 }}>
              <div style={S.cardTitle}>Total Stock Value</div>
              <div style={{ ...S.kpi, fontSize: 18 }}>
                {fmt(totalStockValue)}
              </div>
            </div>
            <div style={{ ...S.card, flex: 1, padding: 10, minWidth: 180 }}>
              <div style={S.cardTitle}>Low Stock Items</div>
              <div
                style={{
                  ...S.kpi,
                  fontSize: 18,
                  color: lowStock.length > 0 ? T.danger : T.success,
                }}
              >
                {lowStock.length}
              </div>
            </div>
            <div style={{ ...S.card, flex: 1, padding: 10, minWidth: 180 }}>
              <div style={S.cardTitle}>Total SKUs</div>
              <div style={{ ...S.kpi, fontSize: 18 }}>{inventory.length}</div>
            </div>
            <button
              style={{ ...S.btn("primary"), alignSelf: "center" }}
              onClick={() => {
                setAddingInv(!addingInv);
                setEditInvId(null);
                setShowNewCatInput(false);
                setNewCatValue("");
                setNi({
                  name: "",
                  category: "Ingredient",
                  unit: "kg",
                  stock: "",
                  reorderAt: "",
                  costPerUnit: "",
                  usedPerPlate: "",
                  linkedMeals: "",
                });
              }}
            >
              + Add Item
            </button>
          </div>
          {addingInv && (
            <div style={{ ...S.card, marginBottom: 12, borderColor: T.accent }}>
              <div style={S.sectionTitle}>
                {editInvId != null
                  ? "Edit Inventory Item"
                  : "New Inventory Item"}
              </div>
              <div style={S.grid(4)}>
                <div>
                  <label style={S.label}>Item Name</label>
                  <input
                    style={S.input}
                    value={ni.name}
                    onChange={(e) => setNi({ ...ni, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={S.label}>Category</label>
                  {showNewCatInput ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      <input
                        style={{ ...S.input, flex: 1 }}
                        autoFocus
                        placeholder="New category name…"
                        value={newCatValue}
                        onChange={(e) => setNewCatValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const trimmed = newCatValue.trim();
                            if (trimmed && !invCategories.includes(trimmed)) {
                              setInvCategories((prev) => [...prev, trimmed]);
                              setNi({ ...ni, category: trimmed });
                            } else if (trimmed) {
                              setNi({ ...ni, category: trimmed });
                            }
                            setNewCatValue("");
                            setShowNewCatInput(false);
                          }
                          if (e.key === "Escape") {
                            setNewCatValue("");
                            setShowNewCatInput(false);
                          }
                        }}
                      />
                      <button
                        style={{ ...S.btn("primary"), padding: "4px 8px", fontSize: 11 }}
                        onClick={() => {
                          const trimmed = newCatValue.trim();
                          if (trimmed && !invCategories.includes(trimmed)) {
                            setInvCategories((prev) => [...prev, trimmed]);
                            setNi({ ...ni, category: trimmed });
                          } else if (trimmed) {
                            setNi({ ...ni, category: trimmed });
                          }
                          setNewCatValue("");
                          setShowNewCatInput(false);
                        }}
                      >
                        ✓
                      </button>
                      <button
                        style={{ ...S.btn("ghost"), padding: "4px 8px", fontSize: 11 }}
                        onClick={() => { setNewCatValue(""); setShowNewCatInput(false); }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 4 }}>
                      <select
                        style={{ ...S.select, flex: 1 }}
                        value={ni.category}
                        onChange={(e) => setNi({ ...ni, category: e.target.value })}
                      >
                        {invCategories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      <button
                        title="Add new category"
                        style={{
                          ...S.btn("ghost"),
                          padding: "4px 8px",
                          fontSize: 13,
                          flexShrink: 0,
                          borderColor: T.accent,
                          color: T.accent,
                        }}
                        onClick={() => setShowNewCatInput(true)}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label style={S.label}>Unit</label>
                  <input
                    style={S.input}
                    value={ni.unit}
                    placeholder="kg, L, pack…"
                    onChange={(e) => setNi({ ...ni, unit: e.target.value })}
                  />
                </div>
                <div>
                  <label style={S.label}>Current Stock</label>
                  <input
                    type="number"
                    style={S.input}
                    value={ni.stock}
                    onChange={(e) => setNi({ ...ni, stock: e.target.value })}
                  />
                </div>
                <div>
                  <label style={S.label}>Reorder At (min)</label>
                  <input
                    type="number"
                    style={S.input}
                    value={ni.reorderAt}
                    onChange={(e) =>
                      setNi({ ...ni, reorderAt: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label style={S.label}>Cost per Unit (XAF)</label>
                  <input
                    type="number"
                    style={S.input}
                    value={ni.costPerUnit}
                    onChange={(e) =>
                      setNi({ ...ni, costPerUnit: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label style={S.label}>Used per Plate</label>
                  <input
                    type="number"
                    style={S.input}
                    value={ni.usedPerPlate}
                    placeholder="e.g. 0.15"
                    onChange={(e) =>
                      setNi({ ...ni, usedPerPlate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label style={S.label}>Linked Meals (comma-sep.)</label>
                  <input
                    style={S.input}
                    value={ni.linkedMeals}
                    placeholder="e.g. Rice & Chicken, Stew…"
                    onChange={(e) =>
                      setNi({ ...ni, linkedMeals: e.target.value })
                    }
                  />
                </div>
              </div>
              <div
                style={{ ...S.row, marginTop: 10, justifyContent: "flex-end" }}
              >
                <button
                  style={S.btn("ghost")}
                  onClick={() => {
                    setAddingInv(false);
                    setEditInvId(null);
                    setShowNewCatInput(false);
                    setNewCatValue("");
                  }}
                >
                  Cancel
                </button>
                <button style={S.btn("primary")} onClick={saveInv}>
                  {editInvId != null ? "Update" : "Add to Inventory"}
                </button>
              </div>
            </div>
          )}
          {lowStock.length > 0 && (
            <div
              style={{
                background: `${T.danger}12`,
                border: `1px solid ${T.danger}40`,
                borderRadius: 6,
                padding: 9,
                marginBottom: 10,
                fontSize: 11,
              }}
            >
              <strong style={{ color: T.danger }}>⚠️ Reorder Needed:</strong>{" "}
              {lowStock
                .map(
                  (i) =>
                    `${i.name} (${Math.round(i.stock * 10) / 10} ${
                      i.unit
                    } — min ${i.reorderAt})`
                )
                .join(" · ")}
            </div>
          )}
          <div className="tbl-wrap">
            <table style={S.table}>
              <thead>
                <tr>
                  {[
                    "Item",
                    "Category",
                    "Unit",
                    "Stock",
                    "Reorder At",
                    "Cost/Unit",
                    "Used/Plate",
                    "Stock Value",
                    "Linked Meals",
                    "Status",
                    "",
                  ].map((h) => (
                    <th key={h} style={S.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const low = item.stock <= item.reorderAt;
                  const platesRemaining =
                    item.usedPerPlate > 0
                      ? Math.floor(item.stock / item.usedPerPlate)
                      : null;
                  return (
                    <tr key={item.id}>
                      <td style={{ ...S.td, fontWeight: 700 }}>{item.name}</td>
                      <td style={S.td}>{item.category}</td>
                      <td style={S.td}>{item.unit}</td>
                      <td
                        style={{
                          ...S.td,
                          fontWeight: 700,
                          color: low ? T.danger : T.success,
                        }}
                      >
                        {Math.round(item.stock * 100) / 100}
                      </td>
                      <td style={S.td}>{item.reorderAt}</td>
                      <td style={S.td}>{fmt(item.costPerUnit)}</td>
                      <td style={{ ...S.td, color: T.textMuted }}>
                        {item.usedPerPlate > 0 ? (
                          <span>
                            {item.usedPerPlate}{" "}
                            <span style={{ fontSize: 10, color: T.textDim }}>
                              {platesRemaining != null &&
                                `(~${platesRemaining} plates)`}
                            </span>
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td style={{ ...S.td, color: T.accent, fontWeight: 700 }}>
                        {fmt(item.stock * item.costPerUnit)}
                      </td>
                      <td style={{ ...S.td, fontSize: 11, color: T.textMuted }}>
                        {(item.linkedMeals || []).join(", ") || "—"}
                      </td>
                      <td style={S.td}>
                        {low ? (
                          <Badge color={T.danger}>Low</Badge>
                        ) : (
                          <Badge color={T.success}>OK</Badge>
                        )}
                      </td>
                      <td style={S.td}>
                        <div style={{ display: "flex", gap: 3 }}>
                          <button
                            style={{
                              ...S.btn("ghost"),
                              fontSize: 10,
                              padding: "2px 6px",
                            }}
                            onClick={() => startEditInv(item)}
                          >
                            Edit
                          </button>
                          <button
                            style={{
                              ...S.btn("ghost"),
                              fontSize: 10,
                              padding: "2px 6px",
                            }}
                            onClick={() => {
                              const qty = prompt(
                                `Restock ${item.name}\nCurrent: ${item.stock} ${item.unit}\nAdd quantity:`
                              );
                              if (qty && !isNaN(Number(qty)))
                                setInventory((prev) =>
                                  prev.map((it) =>
                                    it.id === item.id
                                      ? { ...it, stock: it.stock + Number(qty) }
                                      : it
                                  )
                                );
                            }}
                          >
                            + Restock
                          </button>
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              color: T.danger,
                              cursor: "pointer",
                              fontSize: 11,
                            }}
                            onClick={() => {
                              if (window.confirm(`Delete ${item.name}?`))
                                deleteInv(item.id);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ ...S.card, marginTop: 10 }}>
            <div style={S.cardTitle}>Inventory Cost Intelligence</div>
            <div style={S.grid(4)}>
              {[...new Set(inventory.flatMap((i) => i.linkedMeals || []))]
                .filter(Boolean)
                .map((mealName) => {
                  const cost = inventory
                    .filter((i) => (i.linkedMeals || []).includes(mealName))
                    .reduce((s, i) => s + i.usedPerPlate * i.costPerUnit, 0);
                  const salePrice =
                    sales.find((s) => s.meal === mealName)?.pricePerPlate || 0;
                  const margin =
                    salePrice > 0
                      ? (((salePrice - cost) / salePrice) * 100).toFixed(0)
                      : null;
                  return (
                    <div key={mealName} style={{ ...S.card, padding: 10 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          marginBottom: 4,
                        }}
                      >
                        {mealName}
                      </div>
                      <div style={{ fontSize: 11, color: T.textMuted }}>
                        Ing. Cost:{" "}
                        <span style={{ fontWeight: 700, color: T.danger }}>
                          {fmt(cost)}
                        </span>
                      </div>
                      {salePrice > 0 && (
                        <div style={{ fontSize: 11, color: T.textMuted }}>
                          Sale:{" "}
                          <span style={{ fontWeight: 700 }}>
                            {fmt(salePrice)}
                          </span>
                        </div>
                      )}
                      {margin && (
                        <div style={{ fontSize: 11, color: T.textMuted }}>
                          Margin:{" "}
                          <span
                            style={{
                              fontWeight: 700,
                              color:
                                margin > 40
                                  ? T.success
                                  : margin > 20
                                  ? T.warning
                                  : T.danger,
                            }}
                          >
                            {margin}%
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}

      {tab === "batches" && (
        <div style={{ color: T.textMuted, padding: 36, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🍳</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>
            Production Batches
          </div>
          <div style={{ fontSize: 11 }}>
            Record daily meal yields — e.g. Jollof Rice · 25 plates · Cost:
            47.500 XAF · Cost/plate: 1.900 XAF
          </div>
        </div>
      )}
    </div>
  );
}

// ─── INVOICES ─────────────────────────────────────────────────────
function InvoicesPage({ invoices, setInvoices, events, logo, biz }) {
  const [doc, setDoc] = useState(null);
  const openDoc = (title, html) =>
    setDoc({ title, html, onPrint: () => printDoc(title, html) });
  const totalAR = invoices.reduce((s, i) => s + (i.total - i.paid), 0);
  const totalPaid = invoices.reduce((s, i) => s + i.paid, 0);
  const recordPmt = (idx, amount) => {
    const u = [...invoices];
    const inv = { ...u[idx] };
    inv.paid = Math.min(inv.paid + Number(amount), inv.total);
    inv.status =
      inv.paid >= inv.total
        ? "Paid"
        : inv.paid > 0
        ? "Partially Paid"
        : "Unpaid";
    u[idx] = inv;
    setInvoices(u);
  };
  const stColor = {
    Paid: T.success,
    "Partially Paid": T.warning,
    Unpaid: T.danger,
    Cancelled: T.textDim,
  };
  return (
    <div>
      <DocModal doc={doc} onClose={() => setDoc(null)} />
      <div style={S.pageTitle}>🧾 Invoices & Payments</div>
      <div style={S.grid(4)}>
        <KpiCard
          label="AR Outstanding"
          value={fmt(totalAR)}
          color={T.danger}
          icon="⚠️"
        />
        <KpiCard
          label="Total Collected"
          value={fmt(totalPaid)}
          color={T.success}
          icon="✅"
        />
        <KpiCard
          label="Unpaid Invoices"
          value={invoices.filter((i) => i.status === "Unpaid").length}
          color={T.warning}
          icon="📬"
        />
        <KpiCard
          label="Total Invoiced"
          value={fmt(invoices.reduce((s, i) => s + i.total, 0))}
          icon="📄"
        />
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="tbl-wrap">
          <table style={S.table}>
            <thead>
              <tr>
                {[
                  "Invoice #",
                  "Client",
                  "Issued",
                  "Due",
                  "Total",
                  "Paid",
                  "Balance",
                  "OD",
                  "Status",
                  "Documents",
                  "Action",
                ].map((h) => (
                  <th key={h} style={S.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => {
                const bal = inv.total - inv.paid;
                const od = daysOD(inv.due);
                const evt = events.find((e) => e.id === inv.eventId);
                return (
                  <tr key={inv.id}>
                    <td
                      style={{
                        ...S.td,
                        fontWeight: 700,
                        color: T.accent,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {inv.num}
                    </td>
                    <td style={{ ...S.td, fontWeight: 700 }}>{inv.client}</td>
                    <td style={{ ...S.td, whiteSpace: "nowrap" }}>
                      {inv.issued}
                    </td>
                    <td style={{ ...S.td, whiteSpace: "nowrap" }}>{inv.due}</td>
                    <td style={{ ...S.td, fontWeight: 600 }}>
                      {fmt(inv.total)}
                    </td>
                    <td style={{ ...S.td, color: T.success }}>
                      {fmt(inv.paid)}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        fontWeight: 700,
                        color: bal > 0 ? T.danger : T.success,
                      }}
                    >
                      {fmt(bal)}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        color: od > 0 ? T.danger : T.success,
                        fontSize: 11,
                      }}
                    >
                      {od > 0 ? `${od}d` : "—"}
                    </td>
                    <td style={S.td}>
                      <Badge color={stColor[inv.status] || T.textMuted}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: 3 }}>
                        <button
                          style={{
                            ...S.btn("ghost"),
                            fontSize: 10,
                            padding: "3px 7px",
                          }}
                          onClick={() =>
                            openDoc(
                              `Invoice ${inv.num}`,
                              buildInvoiceHTML(inv, evt, biz, logo)
                            )
                          }
                        >
                          📄 Invoice
                        </button>
                        {inv.paid > 0 && (
                          <button
                            style={{
                              ...S.btn("ghost"),
                              fontSize: 10,
                              padding: "3px 7px",
                            }}
                            onClick={() =>
                              openDoc(
                                `Receipt ${inv.num.replace("INV", "RCT")}`,
                                buildReceiptHTML(inv, biz, logo)
                              )
                            }
                          >
                            🧾 Receipt
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={S.td}>
                      {bal > 0 && (
                        <button
                          style={{
                            ...S.btn("primary"),
                            padding: "3px 8px",
                            fontSize: 11,
                          }}
                          onClick={() => {
                            const a = prompt(
                              `Record payment – ${inv.num}\nBalance: ${fmt(
                                bal
                              )}\n\nEnter amount (XAF):`
                            );
                            if (a && !isNaN(Number(a))) recordPmt(i, a);
                          }}
                        >
                          + Pmt
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ ...S.card, marginTop: 10 }}>
          <div style={S.cardTitle}>AR Aging Detail</div>
          {invoices
            .filter((i) => i.total - i.paid > 0)
            .map((inv, i) => {
              const bal = inv.total - inv.paid;
              const days = daysOD(inv.due);
              const b = ageBucket(days);
              const bc = {
                Current: T.success,
                "1–7 days": T.warning,
                "8–30 days": T.warning,
                "31–60 days": T.danger,
                "61+ days": T.danger,
              }[b];
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "7px 0",
                    borderBottom: `1px solid ${T.border}15`,
                  }}
                >
                  <div>
                    <span
                      style={{ fontWeight: 700, fontSize: 12, marginRight: 6 }}
                    >
                      {inv.client}
                    </span>
                    <span style={{ fontSize: 11, color: T.textMuted }}>
                      {inv.num}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <Badge color={bc}>{b}</Badge>
                    <span
                      style={{ fontWeight: 800, color: T.danger, fontSize: 12 }}
                    >
                      {fmt(bal)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// ─── OVERHEAD EXPENSES PAGE ───────────────────────────────────────
function OverheadsPage({ overheads, setOverheads }) {
  const [subTab, setSubTab] = useState("list");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const EMPTY_OH = {
    date: TODAY_ISO,
    category: "Rent & Premises",
    description: "",
    amount: "",
    frequency: "Monthly",
    vendor: "",
    entryType: "opex",
    paymentStatus: "paid",
    assetName: "",
  };
  const [form, setForm] = useState(EMPTY_OH);
  const [filterCat, setFilterCat] = useState("All");
  const [filterYear, setFilterYear] = useState(String(THIS_YEAR));
  const [filterMonth, setFilterMonth] = useState("All");
  const isMobile = useIsMobile();

  const years = [...new Set(overheads.map((o) => o.date.slice(0, 4)))]
    .sort()
    .reverse();
  const months = [
    "All",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const monthNames = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
    All: "All",
  };

  const filtered = overheads.filter((o) => {
    if (filterCat !== "All" && o.category !== filterCat) return false;
    if (filterYear !== "All" && !o.date.startsWith(filterYear)) return false;
    if (filterMonth !== "All" && o.date.slice(5, 7) !== filterMonth)
      return false;
    return true;
  });

  const totalFiltered = filtered.reduce((s, o) => s + Number(o.amount), 0);

  // Summary stats — only opex counts as "overhead expenses" for P&L
  const opexYTD = overheads.filter(
    (o) => o.date.startsWith("2026") && (o.entryType || "opex") === "opex"
  );
  const capexYTD = overheads.filter(
    (o) => o.date.startsWith("2026") && o.entryType === "capex"
  );
  const liabYTD = overheads.filter(
    (o) => o.date.startsWith("2026") && o.entryType === "liability_payment"
  );
  const totalYTD = opexYTD.reduce((s, o) => s + Number(o.amount), 0);
  const totalCapexYTD = capexYTD.reduce((s, o) => s + Number(o.amount), 0);
  const totalLiabYTD = liabYTD.reduce((s, o) => s + Number(o.amount), 0);
  const apTotal = overheads
    .filter((o) => o.paymentStatus === "unpaid")
    .reduce((s, o) => s + Number(o.amount), 0);
  const byCategory = {};
  opexYTD.forEach((o) => {
    byCategory[o.category] = (byCategory[o.category] || 0) + Number(o.amount);
  });
  const sortedCats = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  const saveOverhead = () => {
    if (!form.description || !form.amount) return;
    const item = { ...form, amount: Number(form.amount) };
    if (editId != null) {
      setOverheads((prev) =>
        prev.map((o) => (o.id === editId ? { ...item, id: editId } : o))
      );
      setEditId(null);
    } else {
      setOverheads((prev) => [...prev, { ...item, id: Date.now() }]);
    }
    setAdding(false);
    setForm(EMPTY_OH);
  };
  const startEdit = (o) => {
    setForm({ ...o, amount: String(o.amount) });
    setEditId(o.id);
    setAdding(true);
    setSubTab("list");
  };
  const deleteItem = (id) =>
    setOverheads((prev) => prev.filter((o) => o.id !== id));

  const catColors = {
    "Rent & Premises": T.catering,
    Utilities: T.delivery,
    Personnel: T.accent,
    Transportation: T.restaurant,
    Marketing: T.info,
    Equipment: T.warning,
    Insurance: "#9A7AD4",
    "Professional Fees": "#4AD4C0",
    Subscriptions: "#D4A44A",
    Maintenance: "#7AD44A",
    Other: T.textMuted,
  };

  return (
    <div>
      <div style={S.pageTitle}>🏢 Expenses, Assets & Liabilities</div>
      <div style={S.subtitle}>
        Track operating expenses, asset purchases, and liability payments — each
        flows correctly to P&L, Balance Sheet & Cash Flows
      </div>

      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
        {[
          ["list", "📋 Expense Ledger"],
          ["summary", "📊 Expenses Summary"],
        ].map(([t, label]) => (
          <button
            key={t}
            style={S.navBtn(subTab === t)}
            onClick={() => setSubTab(t)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── SUMMARY SUB-TAB ── */}
      {subTab === "summary" && (
        <div>
          <div style={S.grid(3)}>
            <div style={S.card}>
              <div style={S.cardTitle}>Operating Expenses (YTD)</div>
              <div style={{ ...S.kpi, color: T.danger }}>{fmt(totalYTD)}</div>
              <div style={S.kpiSub}>Jan – Feb 2026 · hits P&L</div>
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>Asset Purchases (YTD)</div>
              <div style={{ ...S.kpi, color: T.warning }}>
                {fmt(totalCapexYTD)}
              </div>
              <div style={S.kpiSub}>
                {capexYTD.length} items · on Balance Sheet
              </div>
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>Accounts Payable (unpaid)</div>
              <div
                style={{ ...S.kpi, color: apTotal > 0 ? T.danger : T.success }}
              >
                {fmt(apTotal)}
              </div>
              <div style={S.kpiSub}>Across all entry types</div>
            </div>
          </div>

          <div style={{ ...S.grid(2), marginTop: 10 }}>
            <div style={S.card}>
              <div style={S.cardTitle}>By Category (YTD 2026)</div>
              {sortedCats.map(([cat, amt]) => (
                <div key={cat} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 3,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: catColors[cat] || T.textMuted,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 11, fontWeight: 600 }}>
                        {cat}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: catColors[cat] || T.text,
                        }}
                      >
                        {fmt(amt)}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: T.textMuted,
                          marginLeft: 6,
                        }}
                      >
                        {totalYTD ? ((amt / totalYTD) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  </div>
                  <PBar
                    pct={totalYTD ? (amt / totalYTD) * 100 : 0}
                    color={catColors[cat] || T.textMuted}
                  />
                </div>
              ))}
            </div>

            <div style={S.card}>
              <div style={S.cardTitle}>Monthly Breakdown (2026)</div>
              {["01", "02"].map((mo) => {
                const moTotal = overheads
                  .filter(
                    (o) =>
                      o.date.startsWith(`2026-${mo}`) &&
                      (o.entryType || "opex") === "opex"
                  )
                  .reduce((s, o) => s + Number(o.amount), 0);
                const moCats = {};
                overheads
                  .filter(
                    (o) =>
                      o.date.startsWith(`2026-${mo}`) &&
                      (o.entryType || "opex") === "opex"
                  )
                  .forEach((o) => {
                    moCats[o.category] =
                      (moCats[o.category] || 0) + Number(o.amount);
                  });
                return (
                  <div
                    key={mo}
                    style={{
                      marginBottom: 14,
                      paddingBottom: 14,
                      borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700 }}>
                        {monthNames[mo]} 2026
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: T.danger,
                        }}
                      >
                        {fmt(moTotal)}
                      </div>
                    </div>
                    {Object.entries(moCats)
                      .sort((a, b) => b[1] - a[1])
                      .map(([cat, amt]) => (
                        <div
                          key={cat}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 10,
                            padding: "2px 0",
                          }}
                        >
                          <span style={{ color: T.textMuted }}>{cat}</span>
                          <span style={{ color: T.text, fontWeight: 600 }}>
                            {fmt(amt)}
                          </span>
                        </div>
                      ))}
                  </div>
                );
              })}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                <span>TOTAL YTD</span>
                <span style={{ color: T.danger }}>{fmt(totalYTD)}</span>
              </div>
            </div>
          </div>

          {/* Frequency breakdown */}
          <div style={{ ...S.card, marginTop: 10 }}>
            <div style={S.cardTitle}>By Frequency Type (YTD)</div>
            <div style={S.grid(4)}>
              {OVERHEAD_FREQ.map((freq) => {
                const amt = overheads
                  .filter(
                    (o) =>
                      o.frequency === freq &&
                      o.date.startsWith("2026") &&
                      (o.entryType || "opex") === "opex"
                  )
                  .reduce((s, o) => s + Number(o.amount), 0);
                return amt > 0 ? (
                  <div
                    key={freq}
                    style={{
                      background: T.surface,
                      borderRadius: 7,
                      padding: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: T.textMuted,
                        marginBottom: 3,
                      }}
                    >
                      {freq}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: T.warning,
                      }}
                    >
                      {fmt(amt)}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── LIST SUB-TAB ── */}
      {subTab === "list" && (
        <>
          {/* Filters & add */}
          <div style={{ ...S.row, marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
            <select
              style={{ ...S.select, width: 150 }}
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="All">All Categories</option>
              {OVERHEAD_CATS.map((c) => (
                <option key={c}>{c}</option>
              ))}
              {OVERHEAD_ASSET_CATS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              style={{ ...S.select, width: 90 }}
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="All">All Years</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <select
              style={{ ...S.select, width: 90 }}
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {monthNames[m]}
                </option>
              ))}
            </select>
            <div style={{ flex: 1 }} />
            <div
              style={{ fontSize: 11, color: T.textMuted, alignSelf: "center" }}
            >
              {filtered.length} items ·{" "}
              <strong style={{ color: T.danger }}>{fmt(totalFiltered)}</strong>
            </div>
            <button
              style={S.btn("primary")}
              onClick={() => {
                setAdding(!adding);
                setEditId(null);
                setForm(EMPTY_OH);
              }}
            >
              {adding && !editId ? "Cancel" : "+ Add Entry"}
            </button>
          </div>

          {adding && (
            <div style={{ ...S.card, marginBottom: 12, borderColor: T.accent }}>
              <div style={S.sectionTitle}>
                {editId ? "✏️ Edit Entry" : "➕ New Entry"}
              </div>

              {/* Entry Type Selector */}
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>Entry Type</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ENTRY_TYPES.map((et) => (
                    <button
                      key={et.value}
                      onClick={() =>
                        setForm({
                          ...form,
                          entryType: et.value,
                          category:
                            et.value === "capex" ? "Equipment" : form.category,
                        })
                      }
                      style={{
                        ...S.btn(
                          form.entryType === et.value ? "primary" : "ghost"
                        ),
                        fontSize: 11,
                        padding: "6px 12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        minHeight: "auto",
                        height: "auto",
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>
                        {et.icon} {et.label}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 400,
                          opacity: 0.75,
                          marginTop: 2,
                          textAlign: "left",
                        }}
                      >
                        {et.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={S.grid(3)}>
                <div>
                  <label style={S.label}>Date</label>
                  <input
                    type="date"
                    style={S.input}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <label style={S.label}>
                    {form.entryType === "capex" ? "Asset Category" : "Category"}
                  </label>
                  <select
                    style={S.select}
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {(form.entryType === "capex"
                      ? OVERHEAD_ASSET_CATS
                      : OVERHEAD_CATS
                    ).map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Frequency</label>
                  <select
                    style={S.select}
                    value={form.frequency}
                    onChange={(e) =>
                      setForm({ ...form, frequency: e.target.value })
                    }
                  >
                    {OVERHEAD_FREQ.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div
                  style={{
                    gridColumn: form.entryType === "capex" ? "1" : "span 2",
                  }}
                >
                  <label style={S.label}>Description</label>
                  <input
                    style={S.input}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder={
                      form.entryType === "capex"
                        ? "e.g. Industrial blender purchase"
                        : form.entryType === "liability_payment"
                        ? "e.g. Payment – supplier balance / loan instalment"
                        : "e.g. Monthly rent – Office/Premises"
                    }
                  />
                </div>
                {form.entryType === "capex" && (
                  <div>
                    <label style={S.label}>Asset Name (for register)</label>
                    <input
                      style={S.input}
                      value={form.assetName}
                      onChange={(e) =>
                        setForm({ ...form, assetName: e.target.value })
                      }
                      placeholder="e.g. Gas Cooker, Chest Freezer"
                    />
                  </div>
                )}
                <div>
                  <label style={S.label}>Amount (XAF)</label>
                  <input
                    type="number"
                    min="0"
                    style={{ ...S.input, color: T.danger, fontWeight: 700 }}
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={S.label}>Vendor / Payee</label>
                  <input
                    style={S.input}
                    value={form.vendor}
                    onChange={(e) =>
                      setForm({ ...form, vendor: e.target.value })
                    }
                    placeholder="e.g. ENEO, Propriétaire, Fournisseur Bassa..."
                  />
                </div>
                <div>
                  <label style={S.label}>Payment Status</label>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    {[
                      ["paid", "✅ Paid"],
                      ["unpaid", "⏳ Unpaid / AP"],
                    ].map(([v, l]) => (
                      <button
                        key={v}
                        onClick={() => setForm({ ...form, paymentStatus: v })}
                        style={{
                          ...S.btn(
                            form.paymentStatus === v
                              ? v === "paid"
                                ? "success"
                                : "danger"
                              : "ghost"
                          ),
                          fontSize: 11,
                          flex: 1,
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div
                style={{ ...S.row, marginTop: 10, justifyContent: "flex-end" }}
              >
                <button
                  style={S.btn("ghost")}
                  onClick={() => {
                    setAdding(false);
                    setEditId(null);
                    setForm(EMPTY_OH);
                  }}
                >
                  Cancel
                </button>
                <button style={S.btn("primary")} onClick={saveOverhead}>
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          )}

          {/* Table / Cards */}
          {isMobile ? (
            <div>
              {[...filtered]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((o) => {
                  const et = ENTRY_TYPES.find(
                    (e) => e.value === (o.entryType || "opex")
                  );
                  return (
                    <div
                      key={o.id}
                      style={{ ...S.cardMobile, marginBottom: 8 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 4,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              marginBottom: 2,
                            }}
                          >
                            {o.description}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 4,
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                ...S.badge(
                                  et?.value === "capex"
                                    ? T.warning
                                    : et?.value === "liability_payment"
                                    ? T.info
                                    : T.textMuted
                                ),
                                fontSize: 9,
                              }}
                            >
                              {et?.icon}{" "}
                              {et?.value === "opex"
                                ? "Expense"
                                : et?.value === "capex"
                                ? "Asset"
                                : "Liab.Pay"}
                            </span>
                            <span
                              style={{
                                ...S.badge(
                                  catColors[o.category] || T.textMuted
                                ),
                                fontSize: 9,
                              }}
                            >
                              {o.category}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            textAlign: "right",
                            flexShrink: 0,
                            marginLeft: 8,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 800,
                              color:
                                o.entryType === "capex"
                                  ? T.warning
                                  : o.entryType === "liability_payment"
                                  ? T.info
                                  : T.danger,
                            }}
                          >
                            {fmt(o.amount)}
                          </div>
                          <Badge
                            color={
                              o.paymentStatus === "unpaid"
                                ? T.danger
                                : T.success
                            }
                          >
                            {o.paymentStatus === "unpaid" ? "Unpaid" : "Paid"}
                          </Badge>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 10,
                          color: T.textMuted,
                        }}
                      >
                        <span>
                          {o.date}
                          {o.vendor ? ` · ${o.vendor}` : ""}
                        </span>
                        <Badge color={T.textMuted}>{o.frequency}</Badge>
                      </div>
                      <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
                        <button
                          style={{
                            ...S.btn("ghost"),
                            fontSize: 10,
                            padding: "3px 8px",
                          }}
                          onClick={() => startEdit(o)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          style={{
                            ...S.btn("ghost"),
                            fontSize: 10,
                            padding: "3px 8px",
                            color: T.danger,
                          }}
                          onClick={() => deleteItem(o.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <div className="tbl-wrap">
                <table style={S.table}>
                  <thead>
                    <tr>
                      {[
                        "Date",
                        "Type",
                        "Category",
                        "Description",
                        "Vendor",
                        "Freq",
                        "Amount (XAF)",
                        "Status",
                        "",
                      ].map((h) => (
                        <th key={h} style={S.th}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...filtered]
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((o) => {
                        const et = ENTRY_TYPES.find(
                          (e) => e.value === (o.entryType || "opex")
                        );
                        return (
                          <tr key={o.id}>
                            <td
                              style={{
                                ...S.td,
                                whiteSpace: "nowrap",
                                color: T.textMuted,
                              }}
                            >
                              {o.date}
                            </td>
                            <td style={S.td}>
                              <span
                                style={{
                                  ...S.badge(
                                    et?.value === "capex"
                                      ? T.warning
                                      : et?.value === "liability_payment"
                                      ? T.info
                                      : T.textMuted
                                  ),
                                  fontSize: 10,
                                }}
                              >
                                {et?.icon}{" "}
                                {et?.value === "opex"
                                  ? "Expense"
                                  : et?.value === "capex"
                                  ? "Asset"
                                  : "Liab.Pay"}
                              </span>
                            </td>
                            <td style={S.td}>
                              <span
                                style={{
                                  ...S.badge(
                                    catColors[o.category] || T.textMuted
                                  ),
                                  fontSize: 10,
                                }}
                              >
                                {o.category}
                              </span>
                            </td>
                            <td style={{ ...S.td, fontWeight: 600 }}>
                              {o.description}
                              {o.assetName ? (
                                <span
                                  style={{ fontSize: 10, color: T.textMuted }}
                                >
                                  {" "}
                                  · {o.assetName}
                                </span>
                              ) : (
                                ""
                              )}
                            </td>
                            <td
                              style={{
                                ...S.td,
                                color: T.textMuted,
                                fontSize: 11,
                              }}
                            >
                              {o.vendor || "—"}
                            </td>
                            <td style={S.td}>
                              <Badge color={T.textMuted}>{o.frequency}</Badge>
                            </td>
                            <td
                              style={{
                                ...S.td,
                                fontWeight: 700,
                                color:
                                  o.entryType === "capex"
                                    ? T.warning
                                    : o.entryType === "liability_payment"
                                    ? T.info
                                    : T.danger,
                              }}
                            >
                              {fmt(o.amount)}
                            </td>
                            <td style={S.td}>
                              <Badge
                                color={
                                  o.paymentStatus === "unpaid"
                                    ? T.danger
                                    : T.success
                                }
                              >
                                {o.paymentStatus === "unpaid"
                                  ? "Unpaid"
                                  : "Paid"}
                              </Badge>
                            </td>
                            <td style={S.td}>
                              <div style={{ display: "flex", gap: 4 }}>
                                <button
                                  style={{
                                    ...S.btn("ghost"),
                                    fontSize: 10,
                                    padding: "2px 6px",
                                  }}
                                  onClick={() => startEdit(o)}
                                >
                                  Edit
                                </button>
                                <button
                                  style={{
                                    ...S.btn("ghost"),
                                    fontSize: 10,
                                    padding: "2px 6px",
                                    color: T.danger,
                                  }}
                                  onClick={() => deleteItem(o.id)}
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {filtered.length === 0 && (
            <div
              style={{ color: T.textMuted, textAlign: "center", padding: 30 }}
            >
              No expenses found for the selected filters.
            </div>
          )}
          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                background: T.surface,
                borderRadius: 7,
                padding: "8px 14px",
                fontSize: 12,
              }}
            >
              <span style={{ color: T.textMuted }}>Filtered Total: </span>
              <strong style={{ color: T.danger }}>{fmt(totalFiltered)}</strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────
// Build report periods dynamically based on current year
function buildReportPeriods() {
  const now = new Date();
  const y = now.getFullYear();
  const py = y - 1; // previous year
  const monthNames = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  const monthLabels = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];
  const monthEnds = [31,28,31,30,31,30,31,31,30,31,30,31];
  // adjust Feb for leap year
  if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) monthEnds[1] = 29;
  const pyFebEnd = ((py % 4 === 0 && py % 100 !== 0) || py % 400 === 0) ? 29 : 28;

  const todayStr = now.toISOString().slice(0, 10);
  const periods = [
    { id: "ytd_current", label: `Year to Date ${y}`, from: `${y}-01-01`, to: todayStr },
    { id: `annual_${y}`, label: `Full Year ${y}`, from: `${y}-01-01`, to: `${y}-12-31` },
    { id: `annual_${py}`, label: `Full Year ${py}`, from: `${py}-01-01`, to: `${py}-12-31` },
    { id: `q1_${y}`, label: `Q1 ${y} (Jan–Mar)`, from: `${y}-01-01`, to: `${y}-03-31` },
    { id: `q2_${y}`, label: `Q2 ${y} (Apr–Jun)`, from: `${y}-04-01`, to: `${y}-06-30` },
    { id: `q3_${y}`, label: `Q3 ${y} (Jul–Sep)`, from: `${y}-07-01`, to: `${y}-09-30` },
    { id: `q4_${y}`, label: `Q4 ${y} (Oct–Dec)`, from: `${y}-10-01`, to: `${y}-12-31` },
    { id: `q4_${py}`, label: `Q4 ${py} (Oct–Dec)`, from: `${py}-10-01`, to: `${py}-12-31` },
  ];
  // Add all months of current year up to current month
  for (let i = 0; i <= now.getMonth(); i++) {
    const mm = String(i + 1).padStart(2, "0");
    const end = String(monthEnds[i]).padStart(2, "0");
    periods.push({ id: `${monthNames[i]}_${y}`, label: `${monthLabels[i]} ${y}`, from: `${y}-${mm}-01`, to: `${y}-${mm}-${end}` });
  }
  // Add last 3 months of previous year
  for (let i = 9; i <= 11; i++) {
    const mm = String(i + 1).padStart(2, "0");
    const end = i === 1 ? String(pyFebEnd).padStart(2, "0") : String(monthEnds[i]).padStart(2, "0");
    periods.push({ id: `${monthNames[i]}_${py}`, label: `${monthLabels[i]} ${py}`, from: `${py}-${mm}-01`, to: `${py}-${mm}-${end}` });
  }
  return periods;
}
const REPORT_PERIODS = buildReportPeriods();

function buildReportData({
  periodId,
  events,
  sales,
  invoices,
  overheads,
  catalogItems,
  inventory,
  meals,
}) {
  const p = REPORT_PERIODS.find((r) => r.id === periodId) || REPORT_PERIODS[0];
  const from = new Date(p.from),
    to = new Date(p.to);

  const pSales = sales.filter((s) => inRange(s.date, from, to));
  const pEvents = events.filter((e) => inRange(e.eventDate, from, to));
  const pOverheads = overheads.filter((o) => inRange(o.date, from, to));
  const pInvoices = invoices.filter((inv) => {
    const evt = events.find((e) => e.id === inv.eventId);
    return evt ? inRange(evt.eventDate, from, to) : false;
  });

  // Revenue
  const rdRevenue = pSales.reduce((s, r) => s + orderTotal(r), 0);
  const catRevenue = pEvents.reduce((s, e) => s + e.revenue, 0);
  const totalRevenue = rdRevenue + catRevenue;

  // COGS — use meal-level costing for restaurant, event costs for catering
  const rdCOGS = pSales.reduce(
    (s, r) => s + orderCOGS(r, catalogItems, meals),
    0
  );
  const catCOGS = pEvents.reduce((s, e) => s + eCOGS(e.costs), 0);
  const totalCOGS = rdCOGS + catCOGS;
  const grossProfit = totalRevenue - totalCOGS;

  // Overhead split — only opex hits P&L
  const oh = splitOverheads(pOverheads);
  const ohByCategory = {};
  pOverheads
    .filter((o) => (o.entryType || "opex") === "opex")
    .forEach((o) => {
      ohByCategory[o.category] =
        (ohByCategory[o.category] || 0) + Number(o.amount);
    });
  const totalOverheads = oh.totalOpex; // only opex reduces profit
  const operatingProfit = grossProfit - totalOverheads;

  // AR / Cash
  const cashReceived = invoices
    .filter((i) => inRange(i.issued || i.due, from, to))
    .reduce((s, i) => s + i.paid, 0);
  const arOutstanding = invoices.reduce((s, i) => s + (i.total - i.paid), 0); // all-time open balance
  const pCashReceived = pInvoices.reduce((s, i) => s + i.paid, 0);
  const restaurantCash = pSales.reduce((s, r) => s + orderTotal(r), 0); // assumed collected at sale

  // Balance sheet components (all-time cumulative for BS)
  const allOh = splitOverheads(overheads);
  const invValue = inventoryValue(inventory || []);

  // Accounts Payable = unpaid opex + unpaid capex (owed to suppliers/landlords)
  const totalAP = allOh.ap + allOh.capexAP;
  // Fixed assets = all capex purchases (gross, no depreciation for simplicity)
  const fixedAssetValue = allOh.fixedAssets;
  // Cumulative all-time net profit (retained earnings proxy)
  const allTimeSalesRevenue =
    sales.reduce((s, r) => s + orderTotal(r), 0) +
    events.reduce((s, e) => s + e.revenue, 0);
  const allTimeCOGS =
    sales.reduce((s, r) => s + orderCOGS(r, catalogItems, meals), 0) +
    events.reduce((s, e) => s + eCOGS(e.costs), 0);
  const allTimeOpex = overheads
    .filter((o) => (o.entryType || "opex") === "opex")
    .reduce((s, o) => s + Number(o.amount), 0);
  const retainedEarnings = allTimeSalesRevenue - allTimeCOGS - allTimeOpex;
  const totalCashReceived =
    invoices.reduce((s, i) => s + i.paid, 0) +
    sales.reduce((s, r) => s + orderTotal(r), 0);

  return {
    period: p,
    from,
    to,
    rdRevenue,
    catRevenue,
    totalRevenue,
    rdCOGS,
    catCOGS,
    totalCOGS,
    grossProfit,
    ohByCategory,
    totalOverheads,
    operatingProfit,
    cashReceived,
    arOutstanding,
    pCashReceived,
    restaurantCash,
    // Balance sheet
    invValue,
    fixedAssetValue,
    totalAP,
    retainedEarnings,
    allOh,
    allTimeCOGS,
    allTimeSalesRevenue,
    allTimeOpex,
    totalCashReceived,
    // cash flows
    paidOpexInPeriod: oh.paidOpex,
    liabPayInPeriod: pOverheads
      .filter((o) => o.entryType === "liability_payment")
      .reduce((s, o) => s + Number(o.amount), 0),
    capexInPeriod: oh.fixedAssets,
    pSales,
    pEvents,
    pInvoices,
    pOverheads,
    gm: totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0,
    om:
      totalRevenue > 0
        ? ((operatingProfit / totalRevenue) * 100).toFixed(1)
        : 0,
  };
}

function ReportsPage({
  events,
  sales,
  invoices,
  overheads,
  catalogItems,
  biz,
  inventory,
  meals,
}) {
  const [reportType, setReportType] = useState("pl");
  const [periodId, setPeriodId] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const monthNames = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
    const candidateId = `${monthNames[now.getMonth()]}_${y}`;
    // fall back to ytd period if no matching preset
    const found = REPORT_PERIODS.find(p => p.id === candidateId);
    return found ? candidateId : "ytd_current";
  });

  const d = useMemo(
    () =>
      buildReportData({
        periodId,
        events,
        sales,
        invoices,
        overheads,
        catalogItems,
        inventory: inventory || [],
        meals: meals || [],
      }),
    [
      periodId,
      events,
      sales,
      invoices,
      overheads,
      catalogItems,
      inventory,
      meals,
    ]
  );

  const printReport = (title) => {
    const html = buildReportHTML(title, d, biz);
    printDoc(title, html);
  };

  const Row = ({ label, value, bold, color, indent, borderTop, large }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: `${large ? 8 : 5}px ${indent ? 16 : 0}px`,
        borderTop: borderTop ? `1px solid ${T.border}` : "none",
      }}
    >
      <span
        style={{
          fontSize: indent ? 11 : 12,
          color: indent ? T.textMuted : T.text,
          fontWeight: bold ? 700 : 400,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: large ? 14 : 12,
          fontWeight: bold ? 800 : 600,
          color: color || T.text,
        }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 4,
        }}
      >
        <div>
          <div style={S.pageTitle}>📑 Financial Reports</div>
          <div style={S.subtitle}>
            Profit & Loss · Balance Sheet · Cash Flows — includes overhead
            expenses
          </div>
        </div>
      </div>

      {/* Report Controls */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 3 }}>
          {[
            ["pl", "📊 P&L"],
            ["bs", "🏦 Balance Sheet"],
            ["cf", "💸 Cash Flows"],
          ].map(([t, label]) => (
            <button
              key={t}
              style={S.navBtn(reportType === t)}
              onClick={() => setReportType(t)}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          style={{ ...S.select, width: 200 }}
          value={periodId}
          onChange={(e) => setPeriodId(e.target.value)}
        >
          <optgroup label="Annual">
            {REPORT_PERIODS.filter((p) => p.id.startsWith("annual")).map(
              (p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              )
            )}
          </optgroup>
          <optgroup label="Quarterly">
            {REPORT_PERIODS.filter((p) => p.id.startsWith("q")).map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Monthly">
            {REPORT_PERIODS.filter(
              (p) => !p.id.startsWith("annual") && !p.id.startsWith("q")
            ).map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </optgroup>
        </select>
        <button
          style={S.btn("primary")}
          onClick={() =>
            printReport(
              reportType === "pl"
                ? "Profit & Loss Statement"
                : reportType === "bs"
                ? "Balance Sheet"
                : "Statement of Cash Flows"
            )
          }
        >
          🖨️ Print / Export
        </button>
        <div style={{ fontSize: 10, color: T.textDim }}>
          {fmtDate(d.from)} – {fmtDate(d.to)}
        </div>
      </div>

      {/* ── P&L REPORT ── */}
      {reportType === "pl" && (
        <div style={{ ...S.grid(2), gap: 12 }}>
          <div>
            {/* Revenue */}
            <div style={S.card}>
              <div style={{ ...S.cardTitle, marginBottom: 12 }}>
                PROFIT & LOSS STATEMENT
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.accent,
                  marginBottom: 6,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Revenue
              </div>
              <Row
                label="Restaurant & Delivery Sales"
                value={fmt(d.rdRevenue)}
                indent
              />
              <Row
                label="Catering Events Revenue"
                value={fmt(d.catRevenue)}
                indent
              />
              <Row
                label="Total Revenue"
                value={fmt(d.totalRevenue)}
                bold
                borderTop
                large
              />

              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.danger,
                  margin: "14px 0 6px",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Cost of Goods Sold (Direct)
              </div>
              <Row
                label="Restaurant & Delivery COGS"
                value={fmt(d.rdCOGS)}
                indent
              />
              <Row label="Catering Events COGS" value={fmt(d.catCOGS)} indent />
              <Row label="Total COGS" value={fmt(d.totalCOGS)} bold borderTop />
              <Row
                label="Gross Profit"
                value={fmt(d.grossProfit)}
                bold
                borderTop
                large
                color={d.grossProfit >= 0 ? T.success : T.danger}
              />
              <Row
                label="Gross Margin"
                value={`${d.gm}%`}
                bold
                color={
                  Number(d.gm) >= 40
                    ? T.success
                    : Number(d.gm) >= 25
                    ? T.warning
                    : T.danger
                }
              />

              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.warning,
                  margin: "14px 0 6px",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Operating Expenses (Overhead)
              </div>
              {Object.entries(d.ohByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amt]) => (
                  <Row key={cat} label={cat} value={fmt(amt)} indent />
                ))}
              {Object.keys(d.ohByCategory).length === 0 && (
                <div
                  style={{
                    fontSize: 11,
                    color: T.textDim,
                    padding: "4px 16px",
                  }}
                >
                  No overhead expenses recorded for this period.
                </div>
              )}
              <Row
                label="Total Operating Expenses"
                value={fmt(d.totalOverheads)}
                bold
                borderTop
              />
              <Row
                label="Operating Profit (EBIT)"
                value={fmt(d.operatingProfit)}
                bold
                borderTop
                large
                color={d.operatingProfit >= 0 ? T.success : T.danger}
              />
              <Row
                label="Operating Margin"
                value={`${d.om}%`}
                bold
                color={
                  Number(d.om) >= 20
                    ? T.success
                    : Number(d.om) >= 5
                    ? T.warning
                    : T.danger
                }
              />

              <div
                style={{
                  margin: "12px 0 6px",
                  padding: "10px 12px",
                  background:
                    d.operatingProfit >= 0 ? `${T.success}15` : `${T.danger}15`,
                  borderRadius: 8,
                  border: `1px solid ${
                    d.operatingProfit >= 0 ? T.success : T.danger
                  }30`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: T.textMuted,
                    marginBottom: 2,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Net Profit / (Loss)
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: d.operatingProfit >= 0 ? T.success : T.danger,
                  }}
                >
                  {fmt(d.operatingProfit)}
                </div>
                <div style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>
                  {d.period.label} · Net Margin: {d.om}%
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* KPI summary */}
            <div style={S.card}>
              <div style={S.cardTitle}>Period KPIs</div>
              {[
                {
                  label: "Total Revenue",
                  value: fmt(d.totalRevenue),
                  color: T.accent,
                },
                {
                  label: "Gross Profit",
                  value: fmt(d.grossProfit),
                  color: T.success,
                },
                {
                  label: "Gross Margin",
                  value: `${d.gm}%`,
                  color: Number(d.gm) >= 40 ? T.success : T.warning,
                },
                {
                  label: "Total Overheads",
                  value: fmt(d.totalOverheads),
                  color: T.danger,
                },
                {
                  label: "Operating Profit",
                  value: fmt(d.operatingProfit),
                  color: d.operatingProfit >= 0 ? T.success : T.danger,
                },
                {
                  label: "Operating Margin",
                  value: `${d.om}%`,
                  color: Number(d.om) >= 20 ? T.success : T.warning,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "7px 0",
                    borderBottom: `1px solid ${T.border}15`,
                  }}
                >
                  <span style={{ fontSize: 11, color: T.textMuted }}>
                    {item.label}
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 800, color: item.color }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ ...S.card, marginTop: 10 }}>
              <div style={S.cardTitle}>
                Overhead Breakdown ({d.period.label})
              </div>
              {Object.entries(d.ohByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amt]) => (
                  <div key={cat} style={{ marginBottom: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 2,
                      }}
                    >
                      <span style={{ fontSize: 11 }}>{cat}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: T.warning,
                        }}
                      >
                        {fmt(amt)}
                      </span>
                    </div>
                    <PBar
                      pct={
                        d.totalOverheads ? (amt / d.totalOverheads) * 100 : 0
                      }
                      color={T.warning}
                    />
                  </div>
                ))}
              {Object.keys(d.ohByCategory).length === 0 && (
                <div style={{ color: T.textDim, fontSize: 11 }}>
                  No overhead expenses in this period.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── BALANCE SHEET ── */}
      {reportType === "bs" && (
        <div style={S.grid(2)}>
          <div style={S.card}>
            <div style={{ ...S.cardTitle, marginBottom: 4 }}>BALANCE SHEET</div>
            <div style={{ fontSize: 10, color: T.textDim, marginBottom: 14 }}>
              As at {fmtDate(d.to)} · Based on recorded transactions
            </div>

            {/* ── ASSETS ── */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.success,
                marginBottom: 6,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Assets
            </div>

            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: T.textMuted,
                margin: "0 0 4px 8px",
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              Current Assets
            </div>
            <Row
              label="Cash & Cash Equivalents (est.)"
              value={fmt(Math.max(0, d.retainedEarnings * 0.6))}
              indent
            />
            <Row
              label="Accounts Receivable (open invoices)"
              value={fmt(d.arOutstanding)}
              indent
            />
            <Row label="Inventory at Cost" value={fmt(d.invValue)} indent />
            {(() => {
              const totalCurrent =
                Math.max(0, d.retainedEarnings * 0.6) +
                d.arOutstanding +
                d.invValue;
              return (
                <Row
                  label="Total Current Assets"
                  value={fmt(totalCurrent)}
                  bold
                  borderTop
                />
              );
            })()}

            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: T.textMuted,
                margin: "10px 0 4px 8px",
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              Non-Current Assets
            </div>
            {d.allOh.capex.length === 0 ? (
              <Row
                label="Fixed Assets (no capex recorded)"
                value={fmt(0)}
                indent
              />
            ) : (
              d.allOh.capex.map((a) => (
                <Row
                  key={a.id}
                  label={`${a.assetName || a.description}`}
                  value={fmt(a.amount)}
                  indent
                />
              ))
            )}
            <Row
              label="Total Fixed Assets (gross)"
              value={fmt(d.fixedAssetValue)}
              bold
              borderTop
            />

            {(() => {
              const totalCurrent =
                Math.max(0, d.retainedEarnings * 0.6) +
                d.arOutstanding +
                d.invValue;
              return (
                <Row
                  label="TOTAL ASSETS"
                  value={fmt(totalCurrent + d.fixedAssetValue)}
                  bold
                  borderTop
                  large
                  color={T.success}
                />
              );
            })()}

            {/* ── LIABILITIES ── */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.danger,
                margin: "18px 0 6px",
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Liabilities
            </div>

            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: T.textMuted,
                margin: "0 0 4px 8px",
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              Current Liabilities
            </div>
            <Row
              label="Accounts Payable (unpaid opex)"
              value={fmt(d.allOh.ap)}
              indent
            />
            <Row
              label="Payable on Asset Purchases"
              value={fmt(d.allOh.capexAP)}
              indent
            />
            {(() => {
              const totalCurrLiab = d.allOh.ap + d.allOh.capexAP;
              return (
                <Row
                  label="Total Current Liabilities"
                  value={fmt(totalCurrLiab)}
                  bold
                  borderTop
                />
              );
            })()}

            {/* Liability payments made reduce any outstanding loan balance */}
            {d.allOh.liabPay.length > 0 && (
              <>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.textMuted,
                    margin: "10px 0 4px 8px",
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                  }}
                >
                  Long-term Liabilities
                </div>
                <Row
                  label="Loans / Financing (payments made)"
                  value={`(${fmt(d.allOh.totalLiabPaid)} paid)`}
                  indent
                />
              </>
            )}
            {(() => {
              const totalLiab = d.allOh.ap + d.allOh.capexAP;
              return (
                <Row
                  label="TOTAL LIABILITIES"
                  value={fmt(totalLiab)}
                  bold
                  borderTop
                  large
                  color={T.danger}
                />
              );
            })()}

            {/* ── EQUITY ── */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.accent,
                margin: "18px 0 6px",
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Equity
            </div>
            <Row
              label="Retained Earnings (cumulative net profit)"
              value={fmt(d.retainedEarnings)}
              indent
              color={d.retainedEarnings >= 0 ? T.success : T.danger}
            />
            <Row
              label="Owner's Capital (est.)"
              value={fmt(d.fixedAssetValue > 0 ? 0 : 450000)}
              indent
            />
            {(() => {
              const equity =
                d.retainedEarnings + (d.fixedAssetValue > 0 ? 0 : 450000);
              return (
                <Row
                  label="TOTAL EQUITY"
                  value={fmt(equity)}
                  bold
                  borderTop
                  large
                  color={T.accent}
                />
              );
            })()}

            {/* Balance check */}
            {(() => {
              const totalCurrent =
                Math.max(0, d.retainedEarnings * 0.6) +
                d.arOutstanding +
                d.invValue;
              const totalAssets = totalCurrent + d.fixedAssetValue;
              const totalLiab = d.allOh.ap + d.allOh.capexAP;
              const equity =
                d.retainedEarnings + (d.fixedAssetValue > 0 ? 0 : 450000);
              const diff = Math.abs(totalAssets - (totalLiab + equity));
              return (
                <div
                  style={{
                    marginTop: 14,
                    padding: "8px 12px",
                    background:
                      diff < 50000 ? `${T.success}15` : `${T.warning}15`,
                    borderRadius: 8,
                    border: `1px solid ${
                      diff < 50000 ? T.success : T.warning
                    }30`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: T.textMuted,
                      marginBottom: 2,
                    }}
                  >
                    Balance Check (Assets vs Liabilities + Equity)
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: diff < 50000 ? T.success : T.warning,
                    }}
                  >
                    {diff < 50000
                      ? "✅ Reasonably balanced"
                      : `⚠️ Difference: ${fmt(
                          diff
                        )} — cash balance is estimated`}
                  </div>
                  <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>
                    Cash is estimated at 60% of retained earnings. Record full
                    bookkeeping for exact balance.
                  </div>
                </div>
              );
            })()}
          </div>

          <div>
            <div style={S.card}>
              <div style={S.cardTitle}>Key Ratios & Notes</div>
              {(() => {
                const totalCurrent =
                  Math.max(0, d.retainedEarnings * 0.6) +
                  d.arOutstanding +
                  d.invValue;
                const totalCurrLiab = d.allOh.ap + d.allOh.capexAP;
                const currentRatio =
                  totalCurrLiab > 0
                    ? (totalCurrent / totalCurrLiab).toFixed(2)
                    : "∞";
                const quickAssets =
                  Math.max(0, d.retainedEarnings * 0.6) + d.arOutstanding;
                const quickRatio =
                  totalCurrLiab > 0
                    ? (quickAssets / totalCurrLiab).toFixed(2)
                    : "∞";
                return [
                  {
                    label: "Current Ratio",
                    value: currentRatio,
                    note: "Current Assets / Current Liabilities · >1.5 healthy",
                  },
                  {
                    label: "Quick Ratio",
                    value: quickRatio,
                    note: "Liquid Assets / Current Liabilities · >1.0 good",
                  },
                  {
                    label: "Accounts Receivable",
                    value: fmt(d.arOutstanding),
                    note: "Total unpaid client invoices",
                  },
                  {
                    label: "Accounts Payable",
                    value: fmt(d.allOh.ap + d.allOh.capexAP),
                    note: "Total unpaid expenses & asset purchases",
                  },
                  {
                    label: "Inventory at Cost",
                    value: fmt(d.invValue),
                    note: "Current stock value",
                  },
                  {
                    label: "Fixed Assets (gross)",
                    value: fmt(d.fixedAssetValue),
                    note: `${d.allOh.capex.length} asset purchase(s) recorded`,
                  },
                  {
                    label: "Gross Margin",
                    value: `${d.gm}%`,
                    note: `${
                      Number(d.gm) >= 40
                        ? "✅ Healthy"
                        : Number(d.gm) >= 25
                        ? "⚠️ Watch"
                        : "❌ Low"
                    }`,
                  },
                  {
                    label: "Operating Margin",
                    value: `${d.om}%`,
                    note: `After overheads of ${fmt(d.totalOverheads)}`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "7px 0",
                      borderBottom: `1px solid ${T.border}15`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 600 }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: T.accent,
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}
                    >
                      {item.note}
                    </div>
                  </div>
                ));
              })()}
            </div>
            <div style={{ ...S.card, marginTop: 10 }}>
              <div style={S.cardTitle}>Accounts Payable Detail</div>
              {(overheads || []).filter((o) => o.paymentStatus === "unpaid")
                .length === 0 ? (
                <div style={{ fontSize: 11, color: T.textDim }}>
                  No unpaid expenses recorded.
                </div>
              ) : (
                (overheads || [])
                  .filter((o) => o.paymentStatus === "unpaid")
                  .map((o) => (
                    <div
                      key={o.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "6px 0",
                        borderBottom: `1px solid ${T.border}15`,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600 }}>
                          {o.description}
                        </div>
                        <div style={{ fontSize: 10, color: T.textMuted }}>
                          {o.vendor || "—"} · {o.date} ·{" "}
                          <Badge
                            color={
                              (o.entryType || "opex") === "capex"
                                ? T.warning
                                : T.danger
                            }
                          >
                            {(o.entryType || "opex") === "capex"
                              ? "Asset"
                              : "Expense"}
                          </Badge>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: T.danger,
                        }}
                      >
                        {fmt(o.amount)}
                      </span>
                    </div>
                  ))
              )}
              {(overheads || []).filter((o) => o.paymentStatus === "unpaid")
                .length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: `1px solid ${T.border}`,
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  <span>Total AP</span>
                  <span style={{ color: T.danger }}>
                    {fmt(
                      (overheads || [])
                        .filter((o) => o.paymentStatus === "unpaid")
                        .reduce((s, o) => s + Number(o.amount), 0)
                    )}
                  </span>
                </div>
              )}
            </div>
            {d.allOh.capex.length > 0 && (
              <div style={{ ...S.card, marginTop: 10 }}>
                <div style={S.cardTitle}>Fixed Assets Register</div>
                {d.allOh.capex.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "6px 0",
                      borderBottom: `1px solid ${T.border}15`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600 }}>
                        {a.assetName || a.description}
                      </div>
                      <div style={{ fontSize: 10, color: T.textMuted }}>
                        {a.vendor} · {a.date} ·{" "}
                        <Badge
                          color={
                            a.paymentStatus === "paid" ? T.success : T.danger
                          }
                        >
                          {a.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </Badge>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: T.warning,
                      }}
                    >
                      {fmt(a.amount)}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: `1px solid ${T.border}`,
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  <span>Total Fixed Assets</span>
                  <span style={{ color: T.warning }}>
                    {fmt(d.fixedAssetValue)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CASH FLOWS ── */}
      {reportType === "cf" && (
        <div style={S.grid(2)}>
          <div style={S.card}>
            <div style={{ ...S.cardTitle, marginBottom: 4 }}>
              STATEMENT OF CASH FLOWS
            </div>
            <div style={{ fontSize: 10, color: T.textDim, marginBottom: 14 }}>
              Period: {fmtDate(d.from)} – {fmtDate(d.to)}
            </div>

            {/* Operating */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.success,
                marginBottom: 6,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Operating Activities
            </div>
            <Row
              label="Cash from Restaurant Sales (collected)"
              value={fmt(d.rdRevenue)}
              indent
            />
            <Row
              label="Cash from Catering Invoices (collected)"
              value={fmt(d.pCashReceived)}
              indent
            />
            <Row
              label="Total Cash Inflows"
              value={fmt(d.rdRevenue + d.pCashReceived)}
              bold
              borderTop
              color={T.success}
            />
            <Row
              label="Payments for COGS (inventory & direct)"
              value={`(${fmt(d.totalCOGS)})`}
              indent
              color={T.danger}
            />
            <Row
              label="Overhead Expense Payments (paid)"
              value={`(${fmt(d.paidOpexInPeriod)})`}
              indent
              color={T.danger}
            />
            <Row
              label="Liability / AP Payments"
              value={`(${fmt(d.liabPayInPeriod)})`}
              indent
              color={T.danger}
            />
            <Row
              label="Total Cash Outflows (operating)"
              value={`(${fmt(
                d.totalCOGS + d.paidOpexInPeriod + d.liabPayInPeriod
              )})`}
              bold
              borderTop
              color={T.danger}
            />
            {(() => {
              const netOps =
                d.rdRevenue +
                d.pCashReceived -
                d.totalCOGS -
                d.paidOpexInPeriod -
                d.liabPayInPeriod;
              return (
                <Row
                  label="Net Cash from Operations"
                  value={fmt(netOps)}
                  bold
                  borderTop
                  large
                  color={netOps >= 0 ? T.success : T.danger}
                />
              );
            })()}

            {/* Investing */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.warning,
                margin: "16px 0 6px",
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Investing Activities
            </div>
            {d.pOverheads.filter(
              (o) => o.entryType === "capex" && o.paymentStatus === "paid"
            ).length === 0 ? (
              <Row
                label="No asset purchases paid this period"
                value={fmt(0)}
                indent
              />
            ) : (
              d.pOverheads
                .filter(
                  (o) => o.entryType === "capex" && o.paymentStatus === "paid"
                )
                .map((a) => (
                  <Row
                    key={a.id}
                    label={`Asset: ${a.assetName || a.description}`}
                    value={`(${fmt(a.amount)})`}
                    indent
                    color={T.warning}
                  />
                ))
            )}
            {(() => {
              const paidCapex = d.pOverheads
                .filter(
                  (o) => o.entryType === "capex" && o.paymentStatus === "paid"
                )
                .reduce((s, o) => s + Number(o.amount), 0);
              return (
                <Row
                  label="Net Cash from Investing"
                  value={fmt(-paidCapex)}
                  bold
                  borderTop
                  color={paidCapex > 0 ? T.warning : T.text}
                />
              );
            })()}

            {/* Financing */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.info,
                margin: "16px 0 6px",
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Financing Activities
            </div>
            <Row label="Owner Capital Contributions" value="—" indent />
            <Row
              label="Loan Repayments made"
              value={
                d.liabPayInPeriod > 0 ? `(${fmt(d.liabPayInPeriod)})` : fmt(0)
              }
              indent
              color={T.info}
            />
            <Row
              label="Net Cash from Financing"
              value={fmt(0)}
              bold
              borderTop
            />

            {(() => {
              const paidCapex = d.pOverheads
                .filter(
                  (o) => o.entryType === "capex" && o.paymentStatus === "paid"
                )
                .reduce((s, o) => s + Number(o.amount), 0);
              const netOps =
                d.rdRevenue +
                d.pCashReceived -
                d.totalCOGS -
                d.paidOpexInPeriod -
                d.liabPayInPeriod;
              const netCash = netOps - paidCapex;
              return (
                <div
                  style={{
                    marginTop: 14,
                    background: T.surface,
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <Row
                    label="Net Change in Cash"
                    value={fmt(netCash)}
                    bold
                    large
                    color={netCash >= 0 ? T.success : T.danger}
                  />
                  {d.arOutstanding > 0 && (
                    <div
                      style={{ fontSize: 10, color: T.textMuted, marginTop: 6 }}
                    >
                      ⚠️ Collecting {fmt(d.arOutstanding)} in outstanding AR
                      would further improve cash.
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          <div>
            <div style={S.card}>
              <div style={S.cardTitle}>Cash Flow Summary</div>
              {(() => {
                const paidCapex = d.pOverheads
                  .filter(
                    (o) => o.entryType === "capex" && o.paymentStatus === "paid"
                  )
                  .reduce((s, o) => s + Number(o.amount), 0);
                const netOps =
                  d.rdRevenue +
                  d.pCashReceived -
                  d.totalCOGS -
                  d.paidOpexInPeriod -
                  d.liabPayInPeriod;
                const netCash = netOps - paidCapex;
                return [
                  {
                    label: "💰 Total Cash Inflows",
                    value: d.rdRevenue + d.pCashReceived,
                    color: T.success,
                  },
                  {
                    label: "🛒 COGS Outflows",
                    value: d.totalCOGS,
                    color: T.danger,
                  },
                  {
                    label: "🏢 Overhead Paid",
                    value: d.paidOpexInPeriod,
                    color: T.warning,
                  },
                  {
                    label: "💳 Liability Payments",
                    value: d.liabPayInPeriod,
                    color: T.info,
                  },
                  {
                    label: "🏗️ Asset Purchases (paid)",
                    value: paidCapex,
                    color: T.warning,
                  },
                  {
                    label: "📊 Net Cash Flow",
                    value: netCash,
                    color: netCash >= 0 ? T.success : T.danger,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: `1px solid ${T.border}15`,
                    }}
                  >
                    <span style={{ fontSize: 11, color: T.textMuted }}>
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: item.color,
                      }}
                    >
                      {fmt(Math.abs(item.value))}
                    </span>
                  </div>
                ));
              })()}
            </div>
            <div style={{ ...S.card, marginTop: 10 }}>
              <div style={S.cardTitle}>
                Accruals (Earned but not yet Collected)
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: `1px solid ${T.border}15`,
                }}
              >
                <span style={{ fontSize: 11, color: T.textMuted }}>
                  AR Outstanding (client owes)
                </span>
                <span
                  style={{ fontSize: 13, fontWeight: 800, color: T.danger }}
                >
                  {fmt(d.arOutstanding)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                }}
              >
                <span style={{ fontSize: 11, color: T.textMuted }}>
                  AP Outstanding (we owe)
                </span>
                <span
                  style={{ fontSize: 13, fontWeight: 800, color: T.warning }}
                >
                  {fmt(d.allOh.ap + d.allOh.capexAP)}
                </span>
              </div>
              <div style={{ fontSize: 10, color: T.textDim, marginTop: 4 }}>
                Net position:{" "}
                {fmt(d.arOutstanding - d.allOh.ap - d.allOh.capexAP)}
              </div>
            </div>
            <div style={{ ...S.card, marginTop: 10 }}>
              <div style={S.cardTitle}>Overhead Paid vs Unpaid</div>
              {d.pOverheads.filter((o) => (o.entryType || "opex") === "opex")
                .length === 0 ? (
                <div style={{ fontSize: 11, color: T.textDim }}>
                  No opex in this period.
                </div>
              ) : (
                [
                  ["Paid", d.paidOpexInPeriod, T.success],
                  ["Unpaid (AP)", d.allOh.ap, T.danger],
                ].map(([label, val, color]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 0",
                      borderBottom: `1px solid ${T.border}12`,
                    }}
                  >
                    <span style={{ fontSize: 11, color: T.textMuted }}>
                      {label}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color }}>
                      {fmt(val)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildReportHTML(title, d, biz) {
  const fmtN = (n) => Math.round(n || 0).toLocaleString("en-US") + " XAF";
  const rows = (items) =>
    items
      .map(
        ([label, value, bold, color]) =>
          `<tr style="${
            bold ? "font-weight:700;" : ""
          }"><td style="padding:7px 12px;font-size:12px;color:${
            color || "#333"
          }">${label}</td><td style="padding:7px 12px;font-size:12px;text-align:right;font-weight:${
            bold ? 700 : 500
          };color:${color || "#111"}">${value}</td></tr>`
      )
      .join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;background:#fff;padding:40px;font-size:13px}
  h1{font-size:22px;font-weight:900;letter-spacing:-0.5px;margin-bottom:4px}
  .sub{color:#888;font-size:12px;margin-bottom:24px}.section{margin-bottom:20px}
  .section-title{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #1a1a1a}
  table{width:100%;border-collapse:collapse;margin-bottom:12px}
  tr:nth-child(even) td{background:#fafafa}
  td{padding:7px 12px;font-size:12px;border-bottom:1px solid #ebebeb}
  .total-row td{font-weight:800;font-size:13px;background:#1a1a1a;color:#fff;padding:10px 12px}
  .highlight{background:#f0fdf4!important}.danger{background:#fff5f5!important}
  .kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
  .kpi{background:#f8f8f8;border-radius:8px;padding:12px 14px}
  .kpi .label{font-size:10px;color:#888;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px}
  .kpi .value{font-size:18px;font-weight:900;color:#1a1a1a}
  @media print{body{padding:20px}}</style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1a1a1a;padding-bottom:16px;margin-bottom:20px">
    <div><div style="font-size:24px;font-weight:900">${
      biz.name
    }</div><div style="font-size:11px;color:#888">${biz.tagline} · ${
    biz.city
  }</div></div>
    <div style="text-align:right"><div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px">${title}</div>
    <div style="font-size:18px;font-weight:900">${d.period.label}</div>
    <div style="font-size:11px;color:#888">${d.from.toLocaleDateString(
      "fr-CM",
      { day: "2-digit", month: "short", year: "numeric" }
    )} – ${d.to.toLocaleDateString("fr-CM", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}</div></div>
  </div>
  <div class="kpi-grid">
    <div class="kpi"><div class="label">Total Revenue</div><div class="value">${fmtN(
      d.totalRevenue
    )}</div></div>
    <div class="kpi"><div class="label">Gross Profit</div><div class="value">${fmtN(
      d.grossProfit
    )}</div></div>
    <div class="kpi"><div class="label">Net Profit</div><div class="value" style="color:${
      d.operatingProfit >= 0 ? "#16a34a" : "#dc2626"
    }">${fmtN(d.operatingProfit)}</div></div>
  </div>
  <div class="section"><div class="section-title">Revenue</div><table>
    ${rows([
      ["Restaurant & Delivery Sales", fmtN(d.rdRevenue), false, "#333"],
      ["Catering Events Revenue", fmtN(d.catRevenue), false, "#333"],
    ])}
    <tr class="total-row"><td>Total Revenue</td><td style="text-align:right">${fmtN(
      d.totalRevenue
    )}</td></tr></table></div>
  <div class="section"><div class="section-title">Cost of Goods Sold</div><table>
    ${rows([
      ["Restaurant & Delivery COGS", fmtN(d.rdCOGS), false, "#333"],
      ["Catering Events COGS", fmtN(d.catCOGS), false, "#333"],
    ])}
    <tr class="total-row"><td>Total COGS</td><td style="text-align:right">${fmtN(
      d.totalCOGS
    )}</td></tr>
    <tr class="highlight"><td style="font-weight:700;padding:8px 12px">Gross Profit</td><td style="text-align:right;font-weight:800;color:#16a34a;padding:8px 12px">${fmtN(
      d.grossProfit
    )}</td></tr></table></div>
  <div class="section"><div class="section-title">Operating Expenses (Overhead)</div><table>
    ${Object.entries(d.ohByCategory)
      .map(
        ([cat, amt]) =>
          `<tr><td style="padding:7px 12px;padding-left:20px;color:#555">${cat}</td><td style="padding:7px 12px;text-align:right;color:#333;font-weight:500">${fmtN(
            amt
          )}</td></tr>`
      )
      .join("")}
    ${
      Object.keys(d.ohByCategory).length === 0
        ? '<tr><td colspan="2" style="padding:10px 12px;color:#aaa">No overhead expenses recorded for this period.</td></tr>'
        : ""
    }
    <tr class="total-row"><td>Total Operating Expenses</td><td style="text-align:right">${fmtN(
      d.totalOverheads
    )}</td></tr>
    <tr style="${
      d.operatingProfit >= 0 ? "background:#f0fdf4" : "background:#fff5f5"
    }"><td style="font-weight:800;padding:10px 12px;font-size:14px">NET PROFIT / (LOSS)</td><td style="text-align:right;font-weight:900;font-size:16px;padding:10px 12px;color:${
    d.operatingProfit >= 0 ? "#16a34a" : "#dc2626"
  }">${fmtN(d.operatingProfit)}</td></tr></table></div>
  <div style="margin-top:30px;padding-top:16px;border-top:1px solid #ddd;text-align:center;font-size:11px;color:#aaa">Generated by ${
    biz.name
  } · ${new Date().toLocaleDateString()} · ${title}</div>
  </body></html>`;
}

// ─── AUTH HELPERS ─────────────────────────────────────────────────
// Roles: "owner" = full access | "staff" = restaurant + invoices only
const AUTH_KEY   = "cb_auth_v2";   // { owner: {email,hash}, staff: {email,hash} | null }
const SESSION_KEY = "cb_session_v2"; // { role: "owner"|"staff", expires }
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

const STAFF_TABS = ["restaurant", "invoices"]; // tabs staff can access

function hashPassword(pw) {
  let h = 0x811c9dc5;
  for (let i = 0; i < pw.length; i++) {
    h ^= pw.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

function loadAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || null; } catch { return null; }
}
function saveOwnerAuth(email, pw) {
  const existing = loadAuth() || {};
  localStorage.setItem(AUTH_KEY, JSON.stringify({
    ...existing,
    owner: { email: email.trim().toLowerCase(), hash: hashPassword(pw) }
  }));
}
function saveStaffAuth(email, pw) {
  const existing = loadAuth() || {};
  localStorage.setItem(AUTH_KEY, JSON.stringify({
    ...existing,
    staff: pw ? { email: email.trim().toLowerCase(), hash: hashPassword(pw) } : null
  }));
}
function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (s && Date.now() < s.expires) return s;
    localStorage.removeItem(SESSION_KEY);
    return null;
  } catch { return null; }
}
function saveSession(role) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ role, expires: Date.now() + SESSION_DURATION }));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const auth = loadAuth();
  const isFirstTime = !auth?.owner;
  const [email, setEmail] = useState(isFirstTime ? "cookiesbites@email.cm" : "");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    if (!email.trim()) { setError("Email is required."); return; }
    if (!pw) { setError("Password is required."); return; }

    if (isFirstTime) {
      // First-time owner setup
      if (pw.length < 6) { setError("Password must be at least 6 characters."); return; }
      if (pw !== pw2) { setError("Passwords do not match."); return; }
      saveOwnerAuth(email, pw);
      saveSession("owner");
      setLoading(true);
      setTimeout(() => onLogin("owner"), 400);
      return;
    }

    const emailLower = email.trim().toLowerCase();

    // Check owner
    if (auth.owner && emailLower === auth.owner.email && hashPassword(pw) === auth.owner.hash) {
      saveSession("owner");
      setLoading(true);
      setTimeout(() => onLogin("owner"), 400);
      return;
    }
    // Check staff
    if (auth.staff && emailLower === auth.staff.email && hashPassword(pw) === auth.staff.hash) {
      saveSession("staff");
      setLoading(true);
      setTimeout(() => onLogin("staff"), 400);
      return;
    }

    setError("Incorrect email or password.");
  };

  return (
    <div style={{
      fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
      background: T.bg,
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input:focus{border-color:#E8C547!important;box-shadow:0 0 0 2px rgba(232,197,71,0.07)!important;outline:none}
        button:hover{opacity:0.85}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
      <div style={{ width: "100%", maxWidth: 380, animation: "fadeIn 0.35s ease" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: T.accentSoft,
            border: `2px solid ${T.accent}`, borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, margin: "0 auto 12px",
          }}>🍪</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.accent, letterSpacing: -0.5 }}>
            Cookies Bites
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 3 }}>
            Business Tracker · cookiesbites.app
          </div>
        </div>

        {/* Card */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "28px 28px 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
            {isFirstTime ? "👋 Welcome! Set up your account" : "Sign in"}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 22 }}>
            {isFirstTime
              ? "Create the owner credentials to get started."
              : "Enter your credentials to continue."}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Email address</label>
            <input style={{ ...S.input, fontSize: 14 }} type="email" autoComplete="email"
              value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="your@email.com" />
          </div>

          <div style={{ marginBottom: isFirstTime ? 14 : 20 }}>
            <label style={S.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input style={{ ...S.input, fontSize: 14, paddingRight: 40 }}
                type={showPw ? "text" : "password"}
                autoComplete={isFirstTime ? "new-password" : "current-password"}
                value={pw} onChange={e => { setPw(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder={isFirstTime ? "Choose a password (min. 6 chars)" : ""} />
              <button style={{
                position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: T.textMuted,
                cursor: "pointer", fontSize: 14, padding: "0 2px",
              }} onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {isFirstTime && (
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Confirm password</label>
              <input style={{ ...S.input, fontSize: 14 }}
                type={showPw ? "text" : "password"} autoComplete="new-password"
                value={pw2} onChange={e => { setPw2(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="Re-enter your password" />
            </div>
          )}

          {error && (
            <div style={{
              background: `${T.danger}15`, border: `1px solid ${T.danger}40`,
              borderRadius: 7, padding: "8px 12px", fontSize: 12, color: T.danger, marginBottom: 16,
            }}>⚠️ {error}</div>
          )}

          <button style={{
            ...S.btn("primary"), width: "100%", padding: "10px 16px", fontSize: 14,
            fontWeight: 700, borderRadius: 8, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1,
          }} onClick={handleSubmit} disabled={loading}>
            {loading
              ? <span style={{ display: "inline-block", width: 16, height: 16, border: `2px solid ${T.bg}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
              : (isFirstTime ? "Create Account & Sign In" : "Sign In →")}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 10, color: T.textDim }}>
          Session expires after 8 hours · Owner &amp; Staff accounts supported
        </div>
      </div>
    </div>
  );
}

// ─── IMPORT MODAL ─────────────────────────────────────────────────
// Uses SheetJS loaded dynamically from CDN — no npm install needed
function useSheetJS() {
  const [ready, setReady] = useState(!!window.XLSX);
  useEffect(() => {
    if (window.XLSX) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}

function parseXLDate(v) {
  if (!v && v !== 0) return "";
  if (typeof v === "number") {
    const d = new Date(Math.round((v - 25569) * 86400000));
    return d.toISOString().slice(0, 10);
  }
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  return isNaN(d) ? s : d.toISOString().slice(0, 10);
}

function getSheet(wb, keyword) {
  const key = wb.SheetNames.find(n => n.toLowerCase().includes(keyword.toLowerCase()));
  return key ? window.XLSX.utils.sheet_to_json(wb.Sheets[key], { defval: "" }) : [];
}

function parseWorkbook(wb) {
  const ts = Date.now();

  // Catalog
  const catalog = getSheet(wb, "Catalog").map((r, i) => ({
    id: ts + i,
    name: String(r["Item Name *"] || r["Item Name"] || "").trim(),
    catId: null,
    _catName: String(r["Category *"] || r["Category"] || "").trim(),
    unitType: String(r["Unit Type *"] || r["Unit Type"] || "Per item").trim(),
    price: Number(r["Price\n(XAF) *"] || r["Price (XAF) *"] || r["Price (XAF)"] || r["Price"] || 0),
    costPerUnit: Number(r["Cost / Unit\n(XAF)"] || r["Cost / Unit (XAF)"] || r["Cost/Unit"] || 0),
    description: String(r["Description"] || "").trim(),
    tags: String(r["Tags\n(comma-sep)"] || r["Tags"] || "").split(",").map(t => t.trim()).filter(Boolean),
    photo: null,
  })).filter(r => r.name);

  // Meals
  const meals = getSheet(wb, "Meal").map((r, i) => ({
    id: ts + 10000 + i,
    name: String(r["Meal Name *"] || r["Meal Name"] || "").trim(),
    description: String(r["Description"] || "").trim(),
    price: Number(r["Price\n(XAF) *"] || r["Price (XAF) *"] || r["Price (XAF)"] || r["Price"] || 0),
    category: String(r["Category"] || "Main").trim(),
    active: String(r["Active"] || "Yes").trim().toLowerCase() !== "no",
    laborCost: Number(r["Labour Cost\n(XAF/plate)"] || r["Labour Cost (XAF/plate)"] || r["Labour Cost"] || 0),
    availablePortions: Number(r["Available\nPortions"] || r["Available Portions"] || 0),
    ingredientLinks: [],
    otherCosts: [],
    photo: null,
  })).filter(r => r.name);

  // Inventory
  const inventory = getSheet(wb, "Inventory").map((r, i) => ({
    id: ts + 20000 + i,
    name: String(r["Item Name *"] || r["Item Name"] || "").trim(),
    category: String(r["Category *"] || r["Category"] || "Ingredient").trim(),
    unit: String(r["Unit\n(kg/L/pack…) *"] || r["Unit"] || "kg").trim(),
    stock: Number(r["Current Stock *"] || r["Current Stock"] || 0),
    reorderAt: Number(r["Reorder Level\n(min alert)"] || r["Reorder Level"] || r["Reorder At"] || 0),
    costPerUnit: Number(r["Cost / Unit\n(XAF)"] || r["Cost / Unit (XAF)"] || r["Cost/Unit"] || 0),
    usedPerPlate: Number(r["Used / Plate\n(optional)"] || r["Used / Plate"] || 0),
    linkedMeals: [],
  })).filter(r => r.name);

  // Events
  const events = getSheet(wb, "Event").map((r, i) => {
    const guests = Number(r["Guests *"] || r["Guests"] || 0);
    const pph = Number(r["Price/Head\n(XAF)"] || r["Price/Head (XAF)"] || r["Price/Head"] || 0);
    const addOns = Number(r["Add-Ons\n(XAF)"] || r["Add-Ons (XAF)"] || r["Add-Ons"] || 0);
    const discount = Number(r["Discount\n(XAF)"] || r["Discount (XAF)"] || r["Discount"] || 0);
    return {
      id: ts + 30000 + i,
      name: String(r["Event Name *"] || r["Event Name"] || "").trim(),
      clientName: String(r["Client Name *"] || r["Client Name"] || "").trim(),
      clientPhone: String(r["Client Phone"] || "").trim(),
      eventDate: parseXLDate(r["Event Date *\n(YYYY-MM-DD)"] || r["Event Date *"] || r["Event Date"] || ""),
      location: String(r["Location"] || "").trim(),
      eventType: String(r["Event Type *"] || r["Event Type"] || "Other").trim(),
      serviceStyle: String(r["Service Style *"] || r["Service Style"] || "Buffet").trim(),
      guests, pricePerHead: pph, addOns, discount,
      phase: String(r["Phase *"] || r["Phase"] || "Lead / Inquiry").trim(),
      notes: String(r["Notes"] || "").trim(),
      revenue: guests * pph + addOns - discount,
      costs: { inventory: 0, labor: 0, transport: 0, overhead: 0 },
      media: [],
    };
  }).filter(r => r.name);

  // Sales
  const sales = getSheet(wb, "Sales").map((r, i) => ({
    id: ts + 40000 + i,
    date: parseXLDate(r["Date *\n(YYYY-MM-DD)"] || r["Date *"] || r["Date"] || ""),
    meal: String(r["Meal Name *"] || r["Meal Name"] || "").trim(),
    plates: Number(r["Plates /\nUnits *"] || r["Plates / Units *"] || r["Plates"] || 1),
    pricePerPlate: Number(r["Price / Plate\n(XAF) *"] || r["Price / Plate (XAF)"] || r["Price/Plate"] || 0),
    method: String(r["Payment\nMethod * \u25bc"] || r["Payment Method *"] || r["Payment Method"] || "Cash").trim(),
    type: String(r["Order Type *\n\u25bc"] || r["Order Type *"] || r["Order Type"] || "Dine-in").trim(),
    deliveryFee: Number(r["Delivery Fee\n(XAF)"] || r["Delivery Fee (XAF)"] || r["Delivery Fee"] || 0),
    clientName: String(r["Client Name\n(delivery only)"] || r["Client Name"] || "").trim(),
    deliveryAddress: "",
  })).filter(r => r.meal);

  // Invoices
  const invoices = getSheet(wb, "Invoice").map((r, i) => {
    const total = Number(r["Total Amount\n(XAF) *"] || r["Total Amount (XAF)"] || r["Total Amount"] || 0);
    const paid = Number(r["Amount Paid\n(XAF)"] || r["Amount Paid (XAF)"] || r["Amount Paid"] || 0);
    const status = paid >= total && total > 0 ? "Paid" : paid > 0 ? "Partially Paid" : "Unpaid";
    return {
      id: ts + 50000 + i,
      num: String(r["Invoice # *"] || r["Invoice #"] || `INV-${THIS_YEAR}-${String(i+1).padStart(4,"0")}`).trim(),
      client: String(r["Client Name *"] || r["Client Name"] || "").trim(),
      clientPhone: String(r["Client Phone"] || "").trim(),
      issued: parseXLDate(r["Issue Date *\n(YYYY-MM-DD)"] || r["Issue Date *"] || r["Issue Date"] || ""),
      due: parseXLDate(r["Due Date *\n(YYYY-MM-DD)"] || r["Due Date *"] || r["Due Date"] || ""),
      total, paid, status,
      notes: String(r["Notes"] || "").trim(),
    };
  }).filter(r => r.client);

  // Overheads
  const overheads = getSheet(wb, "Overhead").map((r, i) => ({
    id: ts + 60000 + i,
    date: parseXLDate(r["Date *\n(YYYY-MM-DD)"] || r["Date *"] || r["Date"] || ""),
    entryType: String(r["Entry Type *\n\u25bc"] || r["Entry Type *"] || r["Entry Type"] || "opex").trim(),
    category: String(r["Category *\n\u25bc"] || r["Category *"] || r["Category"] || "Other").trim(),
    description: String(r["Description *"] || r["Description"] || "").trim(),
    amount: Number(r["Amount\n(XAF) *"] || r["Amount (XAF) *"] || r["Amount (XAF)"] || r["Amount"] || 0),
    frequency: String(r["Frequency *\n\u25bc"] || r["Frequency *"] || r["Frequency"] || "One-time").trim(),
    vendor: String(r["Vendor / Supplier"] || r["Vendor"] || "").trim(),
    paymentStatus: String(r["Payment Status *\n\u25bc"] || r["Payment Status *"] || r["Payment Status"] || "paid").trim(),
    assetName: String(r["Asset Name\n(capex only)"] || r["Asset Name"] || "").trim(),
  })).filter(r => r.description);

  return { catalog, meals, inventory, events, sales, invoices, overheads };
}

function ImportModal({ onClose, onImport }) {
  const xlsxReady = useSheetJS();
  const fileRef = useRef();
  const [stage, setStage] = useState("idle");
  const [preview, setPreview] = useState(null);
  const [err, setErr] = useState("");
  const [counts, setCounts] = useState(null);

  const parse = (file) => {
    if (!file) return;
    if (!xlsxReady || !window.XLSX) { setErr("Parser still loading — please wait a moment and try again."); return; }
    setStage("parsing"); setErr("");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = window.XLSX.read(e.target.result, { type: "array", cellDates: false });
        const data = parseWorkbook(wb);
        setPreview(data);
        setCounts({
          "Catalog Items": data.catalog.length,
          "Meals": data.meals.length,
          "Inventory": data.inventory.length,
          "Catering Events": data.events.length,
          "Restaurant Sales": data.sales.length,
          "Invoices": data.invoices.length,
          "Overheads": data.overheads.length,
        });
        setStage("preview");
      } catch(e2) {
        setErr("Could not parse file: " + e2.message);
        setStage("error");
      }
    };
    reader.onerror = () => { setErr("Could not read file."); setStage("error"); };
    reader.readAsArrayBuffer(file);
  };

  const doImport = () => {
    if (!preview) return;
    setStage("importing");
    setTimeout(() => { onImport(preview); setStage("done"); }, 500);
  };

  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;
  const populated = counts ? Object.entries(counts).filter(([, v]) => v > 0) : [];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, width:"100%", maxWidth:540, maxHeight:"92vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, background:T.surface, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontWeight:800, fontSize:15 }}>⬆ Import Data from Excel</div>
            <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>Upload the Cookies Bites Import Template (.xlsx)</div>
          </div>
          <button style={{ background:"none", border:"none", color:T.textMuted, cursor:"pointer", fontSize:20, lineHeight:1 }} onClick={onClose}>×</button>
        </div>

        <div style={{ padding:18, overflowY:"auto", flex:1 }}>
          {/* Idle / Error */}
          {(stage === "idle" || stage === "error") && (
            <>
              {!xlsxReady && <div style={{ textAlign:"center", fontSize:11, color:T.textMuted, marginBottom:10 }}>⏳ Loading file parser…</div>}
              <div
                style={{ border:`2px dashed ${T.accent}`, borderRadius:10, padding:"32px 20px", textAlign:"center", cursor:xlsxReady?"pointer":"default", background:T.accentSoft, marginBottom:12 }}
                onClick={() => xlsxReady && fileRef.current.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if(f) parse(f); }}
              >
                <div style={{ fontSize:40, marginBottom:10 }}>📊</div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:5 }}>Click to browse or drag & drop</div>
                <div style={{ fontSize:11, color:T.textMuted }}>CookiesBites_Import_Template.xlsx</div>
                <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display:"none" }} onChange={e => e.target.files[0] && parse(e.target.files[0])} />
              </div>
              {err && <div style={{ background:`${T.danger}15`, border:`1px solid ${T.danger}40`, borderRadius:7, padding:"9px 12px", fontSize:12, color:T.danger, marginBottom:10 }}>⚠️ {err}</div>}
              <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:8, padding:"10px 13px", fontSize:11, color:T.textMuted, lineHeight:1.75 }}>
                <div style={{ fontWeight:700, color:T.text, marginBottom:3 }}>⚠️ Before importing</div>
                This will <strong style={{ color:T.danger }}>replace all existing data</strong> for each sheet that has rows.
                Sheets with 0 rows will not be changed. Make sure you are using the official template.
              </div>
            </>
          )}

          {/* Parsing spinner */}
          {stage === "parsing" && (
            <div style={{ textAlign:"center", padding:"50px 0" }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ width:38, height:38, border:`3px solid ${T.accent}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite", margin:"0 auto 14px" }} />
              <div style={{ fontWeight:700 }}>Reading file…</div>
              <div style={{ fontSize:11, color:T.textMuted, marginTop:4 }}>Parsing all sheets</div>
            </div>
          )}

          {/* Preview */}
          {stage === "preview" && counts && (
            <>
              <div style={{ background:`${T.success}12`, border:`1px solid ${T.success}40`, borderRadius:8, padding:"10px 13px", fontSize:12, color:T.success, fontWeight:700, marginBottom:13 }}>
                ✅ File parsed — {total} record{total !== 1 ? "s" : ""} found across {populated.length} sheet{populated.length !== 1 ? "s" : ""}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:13 }}>
                {Object.entries(counts).map(([label, count]) => (
                  <div key={label} style={{ background:count > 0 ? T.accentSoft : T.surface, border:`1px solid ${count > 0 ? T.accent : T.border}`, borderRadius:8, padding:"9px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:11, color:count > 0 ? T.text : T.textMuted }}>{label}</span>
                    <span style={{ fontSize:14, fontWeight:800, color:count > 0 ? T.accent : T.textDim }}>{count}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:`${T.warning}12`, border:`1px solid ${T.warning}40`, borderRadius:8, padding:"9px 13px", fontSize:11, color:T.textMuted, lineHeight:1.7 }}>
                ⚠️ Clicking <strong style={{ color:T.text }}>Import Now</strong> will overwrite existing records in each populated sheet. Sheets with 0 rows will be left unchanged.
              </div>
            </>
          )}

          {/* Importing */}
          {stage === "importing" && (
            <div style={{ textAlign:"center", padding:"50px 0" }}>
              <div style={{ width:38, height:38, border:`3px solid ${T.accent}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite", margin:"0 auto 14px" }} />
              <div style={{ fontWeight:700 }}>Importing…</div>
            </div>
          )}

          {/* Done */}
          {stage === "done" && (
            <div style={{ textAlign:"center", padding:"36px 0" }}>
              <div style={{ fontSize:52, marginBottom:12 }}>✅</div>
              <div style={{ fontWeight:800, fontSize:16, marginBottom:6 }}>Import Complete!</div>
              <div style={{ fontSize:12, color:T.textMuted, marginBottom:20 }}>{total} records loaded into the platform.</div>
              <button style={{ ...S.btn("primary"), fontSize:13, padding:"9px 22px" }} onClick={onClose}>Close & View Data</button>
            </div>
          )}
        </div>

        {/* Footer */}
        {(stage === "idle" || stage === "error" || stage === "preview") && (
          <div style={{ padding:"11px 18px", borderTop:`1px solid ${T.border}`, display:"flex", justifyContent:"flex-end", gap:8 }}>
            <button style={S.btn("ghost")} onClick={onClose}>Cancel</button>
            {stage === "preview" && <button style={S.btn("primary")} onClick={doImport}>⬆ Import Now</button>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "📊 Dashboard" },
  { id: "catering", label: "🎉 Catering" },
  { id: "proposals", label: "📋 Proposals" },
  { id: "catalog", label: "📦 Catalog" },
  { id: "restaurant", label: "🍽️ Restaurant & Delivery" },
  { id: "invoices", label: "🧾 Invoices & AR" },
  { id: "overheads", label: "🏢 Overheads" },
  { id: "reports", label: "📑 Reports" },
  { id: "studio", label: "🤖 AI Studio", ownerOnly: true },
];

export default function App() {
  const [authed, setAuthed] = useState(() => !!loadSession());
  const [role, setRole] = useState(() => loadSession()?.role || "owner");
  const isOwner = role === "owner";
  const visibleTabs = isOwner ? TABS : TABS.filter(t => STAFF_TABS.includes(t.id) && !t.ownerOnly);
  const [tab, setTab] = useState(() => {
    const sess = loadSession();
    if (sess?.role === "staff") return "restaurant";
    return "dashboard";
  });
  const [events, setEvents] = useState(INIT_EVENTS);
  const [sales, setSales] = useState(INIT_SALES);
  const [invoices, setInvoices] = useState(INIT_INVOICES);
  const [proposals, setProposals] = useState(INIT_PROPOSALS);
  const [catalogItems, setCatalogItems] = useState(CAT_ITEMS);
  const [catalogCategories] = useState(CAT_CATS);
  const [inventory, setInventory] = useState(INIT_INVENTORY);
  const [meals, setMeals] = useState(INIT_MEALS);
  const [overheads, setOverheads] = useState(INIT_OVERHEADS);
  const [logo, setLogo] = useState(null);
  const [biz, setBiz] = useState(INIT_BIZ);
  const [showSettings, setShowSettings] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = () => {
    clearSession();
    setAuthed(false);
  };

  const handleImport = (data) => {
    if (data.catalog.length)    setCatalogItems(data.catalog);
    if (data.meals.length)      setMeals(data.meals);
    if (data.inventory.length)  setInventory(data.inventory);
    if (data.events.length)     setEvents(data.events);
    if (data.sales.length)      setSales(data.sales);
    if (data.invoices.length)   setInvoices(data.invoices);
    if (data.overheads.length)  setOverheads(data.overheads);
  };

  if (!authed) {
    return <LoginScreen onLogin={(r) => {
      setRole(r);
      // Redirect staff to their first allowed tab
      if (r === "staff") setTab("restaurant");
      setAuthed(true);
    }} />;
  }

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#141414}
        ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}
        input:focus,select:focus,textarea:focus{border-color:#E8C547!important;box-shadow:0 0 0 2px rgba(232,197,71,0.07)!important;outline:none}
        button:hover{opacity:0.80}
        tr:hover td{background:rgba(255,255,255,0.015)}
        textarea{background:#141414;border:1px solid #252525;border-radius:6px;padding:6px 9px;color:#EDEBE4;font-size:12px;width:100%;box-sizing:border-box;font-family:inherit}
        input[type=number]::-webkit-inner-spin-button{opacity:0.5}
        /* ── MOBILE RESPONSIVE ── */
        @media(max-width:767px){
          /* Prevent iOS zoom on inputs */
          input,select,textarea{font-size:16px!important}
          /* All fixed-column grids collapse on mobile */
          [style*="repeat(3"],[style*="repeat(4"],[style*="repeat(5"]{
            grid-template-columns:1fr!important;
          }
          /* 2-col grids stay 2-col unless very narrow */
          [style*="repeat(2"]{
            grid-template-columns:1fr 1fr!important;
          }
          /* Tables scroll horizontally */
          table{min-width:480px}
          /* Cards get less padding */
          [style*="padding: 14"]{padding:10px!important}
          /* Sticky sidebar panels go full-width */
          [style*="360px"]{grid-template-columns:1fr!important}
          [style*="position: sticky"]{position:static!important;max-height:none!important}
          /* Ensure buttons are tappable */
          button{min-height:34px}
        }
        /* Wrap all table containers */
        .tbl-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
      `}</style>

      {showSettings && isOwner && (
        <SettingsModal
          biz={biz}
          setBiz={setBiz}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showImport && isOwner && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      )}

      {/* ── TOPBAR ── */}
      {isMobile ? (
        <div
          style={{
            background: T.surface,
            borderBottom: `1px solid ${T.border}`,
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 48,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: T.accent,
              letterSpacing: -0.3,
            }}
          >
            {logo?.src ? (
              <img
                src={logo.src}
                alt="logo"
                style={{ height: 28, maxWidth: 100, objectFit: "contain" }}
              />
            ) : (
              biz.name
            )}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
              color: isOwner ? T.accent : T.info,
              background: isOwner ? T.accentSoft : `${T.info}18`,
              border: `1px solid ${isOwner ? T.accent : T.info}40`,
              borderRadius: 20, padding: "1px 7px",
            }}>{isOwner ? "OWNER" : "STAFF"}</span>
            {isOwner && (
              <button
                style={{ ...S.btn("ghost"), fontSize: 10, padding: "3px 7px", color: T.accent, border: `1px solid ${T.accent}50` }}
                onClick={() => setShowImport(true)}
              >
                ⬆
              </button>
            )}
            {isOwner && (
              <button
                style={{ ...S.btn("ghost"), fontSize: 11, padding: "4px 8px" }}
                onClick={() => setShowSettings(true)}
              >
                ⚙️
              </button>
            )}
            <button
              title="Sign out"
              style={{ ...S.btn("ghost"), fontSize: 11, padding: "4px 8px", color: T.textMuted }}
              onClick={handleLogout}
            >
              ⏻
            </button>
          </div>
        </div>
      ) : (
        <div style={S.topbar}>
          <LogoArea
            logo={logo}
            setLogo={setLogo}
            biz={biz}
            onSettings={isOwner ? () => setShowSettings(true) : null}
          />
          <div
            style={{
              width: 1,
              height: 18,
              background: T.border,
              flexShrink: 0,
            }}
          />
          <div style={S.nav}>
            {visibleTabs.map((t) => (
              <button
                key={t.id}
                style={S.navBtn(tab === t.id)}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
              color: isOwner ? T.accent : T.info,
              background: isOwner ? T.accentSoft : `${T.info}18`,
              border: `1px solid ${isOwner ? T.accent : T.info}40`,
              borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap",
            }}>{isOwner ? "👑 Owner" : "👤 Staff"}</span>
            <div style={{ fontSize: 10, color: T.textMuted, whiteSpace: "nowrap" }}>
              📍{biz.city} · {TODAY_LABEL}
            </div>
            {isOwner && (
              <button
                title="Import data from Excel"
                style={{ ...S.btn("ghost"), fontSize: 11, padding: "4px 10px", color: T.accent, border: `1px solid ${T.accent}50` }}
                onClick={() => setShowImport(true)}
              >
                ⬆ Import
              </button>
            )}
            <button
              title="Sign out"
              style={{ ...S.btn("ghost"), fontSize: 11, padding: "4px 10px" }}
              onClick={handleLogout}
            >
              ⏻ Sign Out
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={isMobile ? S.mainMobile : S.main}>
        {tab === "dashboard" && (
          <Dashboard
            events={events}
            sales={sales}
            invoices={invoices}
            catalogItems={catalogItems}
            overheads={overheads}
            inventory={inventory}
            meals={meals}
          />
        )}
        {tab === "catering" && (
          <CateringPage
            events={events}
            setEvents={setEvents}
            logo={logo}
            biz={biz}
          />
        )}
        {tab === "proposals" && (
          <ProposalsPage
            proposals={proposals}
            setProposals={setProposals}
            catalogItems={catalogItems}
            catalogCategories={catalogCategories}
            inventory={inventory}
            logo={logo}
            biz={biz}
          />
        )}
        {tab === "catalog" && (
          <CatalogPage
            categories={catalogCategories}
            items={catalogItems}
            setItems={setCatalogItems}
            logo={logo}
            biz={biz}
          />
        )}
        {tab === "restaurant" && (
          <RestaurantPage
            sales={sales}
            setSales={setSales}
            inventory={inventory}
            setInventory={setInventory}
            catalogItems={catalogItems}
            meals={meals}
            setMeals={setMeals}
            logo={logo}
            biz={biz}
          />
        )}
        {tab === "invoices" && (
          <InvoicesPage
            invoices={invoices}
            setInvoices={setInvoices}
            events={events}
            logo={logo}
            biz={biz}
          />
        )}
        {tab === "overheads" && (
          <OverheadsPage overheads={overheads} setOverheads={setOverheads} />
        )}
        {tab === "reports" && (
          <ReportsPage
            events={events}
            sales={sales}
            invoices={invoices}
            overheads={overheads}
            catalogItems={catalogItems}
            biz={biz}
            inventory={inventory}
            meals={meals}
          />
        )}
        {tab === "studio" && isOwner && (
          <AIStudioPage
            biz={biz}
            events={events}
            meals={meals}
            catalogItems={catalogItems}
            logo={logo}
          />
        )}
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      {isMobile && <MobileNav tab={tab} setTab={setTab} tabs={visibleTabs} />}
    </div>
  );
}

// ─── AI STUDIO ────────────────────────────────────────────────────
// Content creation hub powered by Claude API
// Uses live app data (events, meals, catalog) as context

const STUDIO_TOOLS = [
  {
    id: "caption",
    icon: "✍️",
    label: "Social Caption",
    desc: "Write captions for Instagram, Facebook or WhatsApp",
    platforms: ["Instagram", "Facebook", "WhatsApp Status", "TikTok"],
    color: "#E4405F",
    prompt: (ctx, opts) =>
      `You are a social media copywriter for ${ctx.biz}, a catering and restaurant business in Douala, Cameroon.
Write a ${opts.platform} caption that is engaging, authentic and uses a warm West/Central African tone.
Tone: ${opts.tone}. Language: ${opts.lang === "fr" ? "French" : "English"}.
${opts.topic ? `Topic / context: ${opts.topic}` : ""}
${opts.mediaDesc ? `The post includes this image/video: ${opts.mediaDesc}` : ""}
${ctx.menuSnippet ? `Current menu highlights: ${ctx.menuSnippet}` : ""}
${ctx.upcomingEvent ? `Upcoming event context: ${ctx.upcomingEvent}` : ""}
Include relevant hashtags at the end. Keep it natural, not corporate.
Do NOT use emojis excessively — 2–4 max. Output only the caption text, ready to copy-paste.`,
  },
  {
    id: "menu",
    icon: "🍽️",
    label: "Menu Description",
    desc: "Write mouthwatering descriptions for menu items",
    color: "#FF6B35",
    prompt: (ctx, opts) =>
      `You are a food copywriter for ${ctx.biz}, a catering and restaurant in Douala, Cameroon.
Write a short, appetizing description (2–3 sentences) for: ${opts.topic || "our signature dish"}.
Tone: ${opts.tone}. Language: ${opts.lang === "fr" ? "French" : "English"}.
${opts.mediaDesc ? `The dish looks like this: ${opts.mediaDesc}` : ""}
${ctx.menuSnippet ? `Other menu items for context: ${ctx.menuSnippet}` : ""}
Focus on taste, texture, and local ingredients. Make it feel premium and inviting.
Output only the description, no titles or labels.`,
  },
  {
    id: "promo",
    icon: "📣",
    label: "Promotional Flyer Text",
    desc: "Generate text for digital flyers and event promotions",
    color: "#F4C430",
    prompt: (ctx, opts) =>
      `You are a marketing copywriter for ${ctx.biz}, catering & restaurant, Douala, Cameroon.
Write promotional flyer text for: ${opts.topic || "a special offer or event"}.
Tone: ${opts.tone}. Language: ${opts.lang === "fr" ? "French" : "English"}.
${ctx.upcomingEvent ? `Event details: ${ctx.upcomingEvent}` : ""}
${opts.mediaDesc ? `Visual context: ${opts.mediaDesc}` : ""}
Structure: catchy headline → 2 short body lines → clear call-to-action → contact/booking info placeholder.
Keep it punchy and direct. Output only the flyer text, formatted with line breaks.`,
  },
  {
    id: "email",
    icon: "📧",
    label: "Client Email / Message",
    desc: "Draft professional emails for catering proposals and follow-ups",
    color: "#4A90D9",
    prompt: (ctx, opts) =>
      `You are writing on behalf of ${ctx.biz}, a catering and restaurant business in Douala, Cameroon.
Draft a professional ${opts.emailType || "follow-up"} email to a catering client.
Tone: ${opts.tone}. Language: ${opts.lang === "fr" ? "French" : "English"}.
Context: ${opts.topic || "following up after a proposal or event inquiry"}.
${ctx.upcomingEvent ? `Event reference: ${ctx.upcomingEvent}` : ""}
Keep it warm but professional. Include a clear subject line first, then the email body.
Use [CLIENT NAME] as placeholder. Sign off as the ${ctx.biz} team.`,
  },
  {
    id: "review",
    icon: "⭐",
    label: "Review Response",
    desc: "Craft thoughtful responses to customer reviews",
    color: "#3DB86A",
    prompt: (ctx, opts) =>
      `You manage customer relations for ${ctx.biz}, catering & restaurant, Douala, Cameroon.
Write a ${opts.sentiment === "negative" ? "gracious, empathetic response to a negative" : "warm response to a positive"} customer review.
Language: ${opts.lang === "fr" ? "French" : "English"}.
Review content: "${opts.topic || "sample customer feedback"}"
Be human, specific, and professional. Under 5 sentences. Do not be defensive.
Output only the response text.`,
  },
  {
    id: "story",
    icon: "📖",
    label: "Brand Story / About",
    desc: "Write compelling brand copy for your website or profile",
    color: "#9B59B6",
    prompt: (ctx, opts) =>
      `Write brand story / about section copy for ${ctx.biz}, a catering and restaurant business based in ${ctx.city}.
Tone: ${opts.tone}. Language: ${opts.lang === "fr" ? "French" : "English"}.
${opts.topic ? `Key points to include: ${opts.topic}` : ""}
${ctx.menuSnippet ? `Menu highlights to weave in: ${ctx.menuSnippet}` : ""}
Emphasise authenticity, quality, and local roots. 3–4 short paragraphs.
Output only the brand copy, no commentary.`,
  },
  {
    id: "analyze",
    icon: "📊",
    label: "Analyze Uploaded Image",
    desc: "Get AI insights and content suggestions from a photo",
    color: "#E8C547",
    mediaRequired: true,
    prompt: (ctx, opts) =>
      `You are a food and hospitality marketing expert reviewing content for ${ctx.biz}, Douala, Cameroon.
Analyze this image and provide:
1. A brief description of what you see
2. What's working well visually (lighting, composition, appeal)
3. 3 specific content ideas this image could be used for (social post, flyer, menu item)
4. A ready-to-use Instagram caption for this image
Language: ${opts.lang === "fr" ? "French" : "English"}.`,
  },
  {
    id: "review_request",
    icon: "🌟",
    label: "Request a Review",
    desc: "Generate polite, personalised messages asking customers to leave a Google or social media review",
    color: "#FBBC04",
    prompt: (ctx, opts) =>
      `You are writing on behalf of ${ctx.biz}, a catering and restaurant business in Douala, Cameroon.
Write a warm, genuine, and polite message asking a satisfied customer to leave a review.
Channel: ${opts.reviewChannel}. Language: ${opts.lang === "fr" ? "French" : "English"}.
Tone: ${opts.tone}.
${opts.customerName ? `Address the customer by name: ${opts.customerName}` : "Use a friendly generic greeting."}
${opts.occasion ? `The occasion / service they experienced: ${opts.occasion}` : ""}
${ctx.menuSnippet ? `Menu context: ${ctx.menuSnippet}` : ""}
${opts.reviewChannel === "Google" && opts.googleReviewLink ? `Include this Google review link prominently: ${opts.googleReviewLink}` : ""}
${opts.reviewChannel === "Facebook" && opts.facebookLink ? `Include this Facebook page link: ${opts.facebookLink}` : ""}
${opts.reviewChannel === "WhatsApp" ? "This is a WhatsApp message — keep it conversational, warm and short (max 4 sentences before the link)." : ""}
${opts.reviewChannel === "General / Multi-platform" ? `Include all available review links. Google: ${opts.googleReviewLink || "[Google Review Link]"}. Facebook: ${opts.facebookLink || "[Facebook Link]"}.` : ""}
Guidelines:
- Do NOT be pushy or transactional — make it feel like a heartfelt personal request
- Mention how much reviews help a small local business
- Make leaving the review sound effortless (one click)
- End with genuine thanks and an invitation to return
- If WhatsApp: do NOT include a formal subject line, make it feel like a personal text
- If Email/General: include a warm subject line at the top
Output only the ready-to-send message. No commentary.`,
  },
];

const TONES = ["Professional", "Casual & Friendly", "Exciting & Bold", "Warm & Personal", "Luxurious"];
const EMAIL_TYPES = ["Follow-up", "Proposal introduction", "Thank you after event", "Booking confirmation", "Payment reminder"];

function AIStudioPage({ biz, events, meals, catalogItems, logo }) {
  const isMobile = useIsMobile();

  // Context derived from app data
  const menuSnippet = meals.slice(0, 5).map(m => `${m.name} (${fmt(m.price)})`).join(", ");
  const catSnippet = catalogItems.slice(0, 6).map(c => c.name).join(", ");
  const nextEvent = events
    .filter(e => e.eventDate >= TODAY_ISO && e.phase !== "Cancelled")
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate))[0];
  const upcomingEvent = nextEvent
    ? `${nextEvent.name} — ${nextEvent.eventType} for ${nextEvent.guests} guests on ${nextEvent.eventDate} at ${nextEvent.location || "TBD"}`
    : "";

  const appCtx = {
    biz: biz.name,
    city: biz.city,
    menuSnippet: menuSnippet || catSnippet,
    upcomingEvent,
  };

  // UI state
  const [tool, setTool] = useState(null);
  const [opts, setOpts] = useState({
    platform: "Instagram", tone: "Warm & Personal", lang: "en",
    topic: "", emailType: "Follow-up", sentiment: "positive", mediaDesc: "",
    reviewChannel: "WhatsApp", customerName: "", occasion: "",
    googleReviewLink: "", facebookLink: "",
  });
  const [uploadedImage, setUploadedImage] = useState(null); // { src, base64, mime }
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]); // [{tool, output, ts}]
  const [showHistory, setShowHistory] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    instagram: "", facebook: "", tiktok: "", whatsapp: "",
    google: "",
  });
  const [showSocial, setShowSocial] = useState(false);
  const imgRef = useRef();

  const activeTool = STUDIO_TOOLS.find(t => t.id === tool);

  const handleImageUpload = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(",")[1];
      setUploadedImage({ src: e.target.result, base64, mime: file.type });
      setOpts(o => ({ ...o, mediaDesc: "" }));
    };
    reader.readAsDataURL(file);
  };

  const generate = async () => {
    if (!activeTool) return;
    setLoading(true); setError(""); setOutput("");

    // Merge saved platform links so prompts always have them even if not typed per-session
    const mergedOpts = {
      ...opts,
      googleReviewLink: opts.googleReviewLink || socialLinks.google,
      facebookLink: opts.facebookLink || socialLinks.facebook,
    };
    const systemPrompt = activeTool.prompt(appCtx, mergedOpts);

    try {
      const messages = [];

      if (uploadedImage && activeTool.id === "analyze") {
        messages.push({
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: uploadedImage.mime, data: uploadedImage.base64 } },
            { type: "text", text: systemPrompt },
          ],
        });
      } else {
        messages.push({ role: "user", content: systemPrompt });
      }

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
      setOutput(text);
      setHistory(h => [{ tool: activeTool.label, output: text, ts: new Date().toLocaleTimeString() }, ...h.slice(0, 9)]);
    } catch (e) {
      setError(e.message || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  // ── Social links panel ────────────────────────────────────────────
  const SocialPanel = () => (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>🔗 Platform Links</div>
        <button style={{ ...S.btn("ghost"), fontSize: 11, padding: "3px 8px" }} onClick={() => setShowSocial(false)}>✕</button>
      </div>
      <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
        Add your links once — they'll be used across all tools for quick-open buttons and auto-inserted into review request messages.
      </div>

      {/* Review links section */}
      <div style={{ fontSize: 10, fontWeight: 700, color: T.accent, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 8 }}>⭐ Review Links</div>
      {[
        { key: "google", icon: "🔍", label: "Google Business Review Link", ph: "https://g.page/r/YOUR_PLACE_ID/review", help: "Find it in Google Business Profile → Get more reviews" },
        { key: "facebook", icon: "👤", label: "Facebook Page URL", ph: "https://facebook.com/cookiesbites" },
      ].map(s => (
        <div key={s.key} style={{ marginBottom: 10 }}>
          <label style={S.label}>{s.icon} {s.label}</label>
          <input style={S.input} value={socialLinks[s.key]} onChange={e => setSocialLinks(l => ({ ...l, [s.key]: e.target.value }))} placeholder={s.ph} />
          {s.help && <div style={{ fontSize: 10, color: T.textDim, marginTop: 3 }}>ℹ️ {s.help}</div>}
        </div>
      ))}

      {/* Social links section */}
      <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: 0.6, textTransform: "uppercase", margin: "14px 0 8px" }}>📱 Social Media</div>
      {[
        { key: "instagram", icon: "📷", label: "Instagram URL", ph: "https://instagram.com/cookiesbites" },
        { key: "tiktok", icon: "🎵", label: "TikTok URL", ph: "https://tiktok.com/@cookiesbites" },
        { key: "whatsapp", icon: "💬", label: "WhatsApp Business Number", ph: "+237 6XX XXX XXX", help: "Numbers only used for WhatsApp links" },
      ].map(s => (
        <div key={s.key} style={{ marginBottom: 10 }}>
          <label style={S.label}>{s.icon} {s.label}</label>
          <input style={S.input} value={socialLinks[s.key]} onChange={e => setSocialLinks(l => ({ ...l, [s.key]: e.target.value }))} placeholder={s.ph} />
          {s.help && <div style={{ fontSize: 10, color: T.textDim, marginTop: 3 }}>ℹ️ {s.help}</div>}
        </div>
      ))}
      <div style={{ fontSize: 10, color: T.textDim, marginTop: 10, padding: "8px 10px", background: T.card, borderRadius: 6 }}>
        🔒 Saved in your browser only. Never sent to any server.
      </div>
    </div>
  );

  // ── Tool card grid ────────────────────────────────────────────────
  if (!tool) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={S.pageTitle}>🤖 AI Studio</div>
            <div style={S.subtitle}>Generate content powered by Claude — captions, menus, emails, promotions and more</div>
          </div>
          <button
            style={{ ...S.btn("ghost"), fontSize: 11, padding: "5px 11px", flexShrink: 0 }}
            onClick={() => setShowSocial(s => !s)}
          >
            🔗 Social Links
          </button>
        </div>

        {showSocial && <SocialPanel />}

        {/* Context banner */}
        {(menuSnippet || upcomingEvent) && (
          <div style={{ background: T.accentSoft, border: `1px solid ${T.accent}30`, borderRadius: 8, padding: "9px 13px", marginBottom: 16, fontSize: 11, color: T.textMuted, lineHeight: 1.7 }}>
            <span style={{ fontWeight: 700, color: T.accent }}>✓ App data loaded — </span>
            {menuSnippet && <span>menu items, </span>}
            {upcomingEvent && <span>upcoming event ({nextEvent?.name}), </span>}
            <span>business profile ready as AI context.</span>
          </div>
        )}

        {/* Tool grid */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {STUDIO_TOOLS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTool(t.id); setOutput(""); setError(""); }}
              style={{
                background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 12, padding: "16px 16px 14px",
                textAlign: "left", cursor: "pointer",
                transition: "all 0.15s",
                display: "flex", flexDirection: "column", gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.background = `${t.color}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.card; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>{t.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{t.label}</div>
                  {t.mediaRequired && <span style={{ fontSize: 9, color: t.color, fontWeight: 700, letterSpacing: 0.5 }}>MEDIA REQUIRED</span>}
                </div>
              </div>
              <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.5 }}>{t.desc}</div>
              <div style={{ marginTop: 4, fontSize: 10, color: t.color, fontWeight: 700 }}>
                {history.filter(h => h.tool === t.label).length > 0 && `${history.filter(h => h.tool === t.label).length} generated this session`}
              </div>
            </button>
          ))}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <button
              style={{ ...S.btn("ghost"), fontSize: 11, marginBottom: 10 }}
              onClick={() => setShowHistory(h => !h)}
            >
              {showHistory ? "▲" : "▼"} Session History ({history.length})
            </button>
            {showHistory && history.map((h, i) => (
              <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 13px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{h.tool}</span>
                  <span style={{ fontSize: 10, color: T.textMuted }}>{h.ts}</span>
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, whiteSpace: "pre-wrap", lineHeight: 1.6, maxHeight: 80, overflow: "hidden" }}>{h.output}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Active tool workspace ─────────────────────────────────────────
  return (
    <div>
      {/* Back + header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <button style={{ ...S.btn("ghost"), fontSize: 11, padding: "4px 10px" }} onClick={() => { setTool(null); setOutput(""); setUploadedImage(null); }}>
          ← Back
        </button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{activeTool.icon} {activeTool.label}</div>
          <div style={{ fontSize: 11, color: T.textMuted }}>{activeTool.desc}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
        {/* LEFT: Options */}
        <div>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: 0.5, marginBottom: 12, textTransform: "uppercase" }}>Options</div>

            {/* Language */}
            <div style={{ marginBottom: 10 }}>
              <label style={S.label}>Language</label>
              <div style={{ display: "flex", gap: 6 }}>
                {["en", "fr"].map(l => (
                  <button key={l} style={{
                    ...S.btn(opts.lang === l ? "primary" : "ghost"),
                    flex: 1, fontSize: 12,
                  }} onClick={() => setOpts(o => ({ ...o, lang: l }))}>
                    {l === "en" ? "🇬🇧 English" : "🇫🇷 Français"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone (not for analyze) */}
            {activeTool.id !== "analyze" && (
              <div style={{ marginBottom: 10 }}>
                <label style={S.label}>Tone</label>
                <select style={S.select} value={opts.tone} onChange={e => setOpts(o => ({ ...o, tone: e.target.value }))}>
                  {TONES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            )}

            {/* Platform (caption only) */}
            {activeTool.id === "caption" && (
              <div style={{ marginBottom: 10 }}>
                <label style={S.label}>Platform</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {activeTool.platforms.map(p => (
                    <button key={p} style={{
                      ...S.btn(opts.platform === p ? "primary" : "ghost"),
                      fontSize: 11, padding: "4px 9px",
                    }} onClick={() => setOpts(o => ({ ...o, platform: p }))}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Email type */}
            {activeTool.id === "email" && (
              <div style={{ marginBottom: 10 }}>
                <label style={S.label}>Email type</label>
                <select style={S.select} value={opts.emailType} onChange={e => setOpts(o => ({ ...o, emailType: e.target.value }))}>
                  {EMAIL_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            )}

            {/* Sentiment (review) */}
            {activeTool.id === "review" && (
              <div style={{ marginBottom: 10 }}>
                <label style={S.label}>Review sentiment</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {["positive", "negative"].map(s => (
                    <button key={s} style={{
                      ...S.btn(opts.sentiment === s ? (s === "negative" ? "danger" : "success") : "ghost"),
                      flex: 1, fontSize: 12,
                    }} onClick={() => setOpts(o => ({ ...o, sentiment: s }))}>
                      {s === "positive" ? "⭐ Positive" : "⚠️ Negative"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Review Request — dedicated options */}
            {activeTool.id === "review_request" && (
              <>
                {/* Channel selector */}
                <div style={{ marginBottom: 10 }}>
                  <label style={S.label}>Send via / Platform</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[
                      { id: "WhatsApp", icon: "💬", color: "#25D366" },
                      { id: "Google", icon: "🔍", color: "#FBBC04" },
                      { id: "Facebook", icon: "👤", color: "#1877F2" },
                      { id: "SMS / Text", icon: "📱", color: "#4A90D9" },
                      { id: "General / Multi-platform", icon: "🌐", color: T.accent },
                    ].map(ch => (
                      <button key={ch.id} style={{
                        ...S.btn(opts.reviewChannel === ch.id ? "ghost" : "ghost"),
                        fontSize: 11, padding: "4px 9px",
                        border: `1px solid ${opts.reviewChannel === ch.id ? ch.color : T.border}`,
                        color: opts.reviewChannel === ch.id ? ch.color : T.textMuted,
                        background: opts.reviewChannel === ch.id ? `${ch.color}15` : "transparent",
                        fontWeight: opts.reviewChannel === ch.id ? 700 : 400,
                      }} onClick={() => setOpts(o => ({ ...o, reviewChannel: ch.id }))}>
                        {ch.icon} {ch.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer name */}
                <div style={{ marginBottom: 10 }}>
                  <label style={S.label}>Customer name <span style={{ color: T.textDim }}>(optional — personalises the message)</span></label>
                  <input style={S.input} value={opts.customerName}
                    onChange={e => setOpts(o => ({ ...o, customerName: e.target.value }))}
                    placeholder="e.g. Marie, Mr. Ngando…" />
                </div>

                {/* Occasion */}
                <div style={{ marginBottom: 10 }}>
                  <label style={S.label}>What did they experience? <span style={{ color: T.textDim }}>(optional)</span></label>
                  <input style={S.input} value={opts.occasion}
                    onChange={e => setOpts(o => ({ ...o, occasion: e.target.value }))}
                    placeholder="e.g. Wedding catering for 120 guests, Delivery order last Sunday…" />
                </div>

                {/* Google review link (contextual) */}
                {(opts.reviewChannel === "Google" || opts.reviewChannel === "General / Multi-platform") && (
                  <div style={{ marginBottom: 10 }}>
                    <label style={S.label}>🔍 Google Review Link</label>
                    <input style={{
                      ...S.input,
                      border: `1px solid ${socialLinks.google ? T.accent : "#FBBC0460"}`,
                    }}
                      value={opts.googleReviewLink || socialLinks.google}
                      onChange={e => setOpts(o => ({ ...o, googleReviewLink: e.target.value }))}
                      placeholder="https://g.page/r/YOUR_PLACE_ID/review" />
                    {!socialLinks.google && !opts.googleReviewLink && (
                      <div style={{ fontSize: 10, color: "#FBBC04", marginTop: 3 }}>
                        ⚠️ No Google link saved yet — add it in 🔗 Platform Links or paste it above
                      </div>
                    )}
                    {(socialLinks.google && !opts.googleReviewLink) && (
                      <div style={{ fontSize: 10, color: T.success, marginTop: 3 }}>
                        ✓ Using saved Google link
                      </div>
                    )}
                  </div>
                )}

                {/* Facebook link (contextual) */}
                {(opts.reviewChannel === "Facebook" || opts.reviewChannel === "General / Multi-platform") && (
                  <div style={{ marginBottom: 10 }}>
                    <label style={S.label}>👤 Facebook Page Link</label>
                    <input style={{
                      ...S.input,
                      border: `1px solid ${socialLinks.facebook ? T.accent : "#1877F260"}`,
                    }}
                      value={opts.facebookLink || socialLinks.facebook}
                      onChange={e => setOpts(o => ({ ...o, facebookLink: e.target.value }))}
                      placeholder="https://facebook.com/cookiesbites" />
                  </div>
                )}

                {/* WhatsApp tip */}
                {opts.reviewChannel === "WhatsApp" && (
                  <div style={{ background: "#25D36615", border: "1px solid #25D36640", borderRadius: 7, padding: "8px 11px", marginBottom: 10, fontSize: 11, color: T.textMuted }}>
                    💬 After generating, use the <strong style={{ color: T.text }}>Send on WhatsApp</strong> button to pre-fill the message directly into a WhatsApp chat.
                    {!socialLinks.whatsapp && <span style={{ color: "#25D366" }}> Add your WhatsApp number in 🔗 Platform Links first.</span>}
                  </div>
                )}
              </>
            )}

            {/* Topic / context */}
            {activeTool.id !== "analyze" && activeTool.id !== "review_request" && (
              <div style={{ marginBottom: 10 }}>
                <label style={S.label}>
                  {activeTool.id === "review" ? "Paste review text" : activeTool.id === "email" ? "Context / key points" : "Topic / additional context"}
                  {" "}<span style={{ color: T.textDim }}>(optional)</span>
                </label>
                <textarea
                  rows={3}
                  style={{ ...S.input, resize: "vertical", fontFamily: "inherit" }}
                  value={opts.topic}
                  onChange={e => setOpts(o => ({ ...o, topic: e.target.value }))}
                  placeholder={
                    activeTool.id === "menu" ? "Dish name, key ingredients, style…" :
                    activeTool.id === "promo" ? "Event name, date, offer details…" :
                    activeTool.id === "email" ? "Client name, event details, key asks…" :
                    activeTool.id === "review" ? "Paste the customer review here…" :
                    activeTool.id === "story" ? "Founding story, values, key differentiators…" :
                    "What is this post about?"
                  }
                />
              </div>
            )}

            {/* Image upload — skip for review_request */}
            {activeTool.id !== "review_request" && <div style={{ marginBottom: 14 }}>
              <label style={S.label}>
                {activeTool.mediaRequired ? "Upload image * (required)" : "Upload image (optional — for visual context)"}
              </label>
              <div
                style={{
                  border: `2px dashed ${uploadedImage ? T.accent : T.border}`,
                  borderRadius: 8, padding: uploadedImage ? 0 : "16px 12px",
                  textAlign: "center", cursor: "pointer",
                  background: uploadedImage ? "transparent" : T.surface,
                  overflow: "hidden",
                }}
                onClick={() => imgRef.current.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handleImageUpload(e.dataTransfer.files[0]); }}
              >
                {uploadedImage ? (
                  <div style={{ position: "relative" }}>
                    <img src={uploadedImage.src} alt="upload" style={{ width: "100%", maxHeight: 160, objectFit: "cover", display: "block" }} />
                    <button
                      style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", fontSize: 12 }}
                      onClick={e => { e.stopPropagation(); setUploadedImage(null); }}
                    >×</button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>🖼️</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>Click or drag image here</div>
                    <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>JPG, PNG, WebP</div>
                  </>
                )}
                <input ref={imgRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => handleImageUpload(e.target.files[0])} />
              </div>
              {uploadedImage && activeTool.id !== "analyze" && (
                <div style={{ marginTop: 8 }}>
                  <label style={S.label}>Describe the image (helps AI write better)</label>
                  <input style={S.input} value={opts.mediaDesc}
                    onChange={e => setOpts(o => ({ ...o, mediaDesc: e.target.value }))}
                    placeholder="e.g. Steaming jollof rice plated elegantly on white plate" />
                </div>
              )}
            </div>

            </div>}

            {/* App data context preview */}
            <div style={{ background: T.surface, borderRadius: 8, padding: "9px 11px", marginBottom: 12, fontSize: 10, color: T.textMuted, lineHeight: 1.7 }}>
              <div style={{ fontWeight: 700, color: T.accent, marginBottom: 3 }}>📡 Live context from your app</div>
              {menuSnippet && <div>Menu: {menuSnippet.slice(0, 80)}{menuSnippet.length > 80 ? "…" : ""}</div>}
              {upcomingEvent && <div>Next event: {upcomingEvent.slice(0, 70)}…</div>}
              {!menuSnippet && !upcomingEvent && <div style={{ color: T.textDim }}>Add meals and events to enrich AI context</div>}
            </div>

            <button
              style={{
                ...S.btn("primary"), width: "100%", fontSize: 13, padding: "9px",
                opacity: (loading || (activeTool.mediaRequired && !uploadedImage)) ? 0.5 : 1,
                cursor: (loading || (activeTool.mediaRequired && !uploadedImage)) ? "not-allowed" : "pointer",
              }}
              onClick={generate}
              disabled={loading || (activeTool.mediaRequired && !uploadedImage)}
            >
              {loading ? "✨ Generating…" : `✨ Generate ${activeTool.label}`}
            </button>
          </div>
        </div>

        {/* RIGHT: Output */}
        <div>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, minHeight: 300, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: 0.5, marginBottom: 10, textTransform: "uppercase" }}>Generated Content</div>

            {/* Loading spinner */}
            {loading && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <div style={{ width: 32, height: 32, border: `3px solid ${T.accent}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                <div style={{ fontSize: 12, color: T.textMuted }}>Writing for you…</div>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div style={{ background: `${T.danger}15`, border: `1px solid ${T.danger}40`, borderRadius: 8, padding: "10px 13px", fontSize: 12, color: T.danger }}>
                ⚠️ {error}
              </div>
            )}

            {/* Output */}
            {output && !loading && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{
                  flex: 1, whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.75,
                  color: T.text, background: T.surface, borderRadius: 8, padding: "12px 13px",
                  minHeight: 200,
                }}>
                  {output}
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={{ ...S.btn("primary"), fontSize: 11, padding: "5px 12px" }} onClick={copy}>
                    {copied ? "✓ Copied!" : "📋 Copy"}
                  </button>
                  <button style={{ ...S.btn("ghost"), fontSize: 11, padding: "5px 12px" }} onClick={generate}>
                    🔄 Regenerate
                  </button>

                  {/* Review Request — dedicated action buttons */}
                  {activeTool.id === "review_request" && (
                    <>
                      {/* WhatsApp send */}
                      {socialLinks.whatsapp && (
                        <a
                          href={`https://wa.me/${socialLinks.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(output.slice(0, 1000))}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ ...S.btn("ghost"), fontSize: 11, padding: "5px 12px", color: "#25D366", border: `1px solid #25D36650`, textDecoration: "none", display: "inline-block", fontWeight: 700 }}
                        >
                          💬 Send on WhatsApp
                        </a>
                      )}
                      {/* Copy Google link */}
                      {(opts.googleReviewLink || socialLinks.google) && (
                        <button style={{ ...S.btn("ghost"), fontSize: 11, padding: "5px 12px", color: "#FBBC04", border: "1px solid #FBBC0450" }}
                          onClick={() => { navigator.clipboard.writeText(opts.googleReviewLink || socialLinks.google); }}>
                          🔍 Copy Google Link
                        </button>
                      )}
                      {/* Open Facebook review tab */}
                      {(opts.facebookLink || socialLinks.facebook) && (
                        <button style={{ ...S.btn("ghost"), fontSize: 11, padding: "5px 12px", color: "#1877F2", border: "1px solid #1877F250" }}
                          onClick={() => window.open((opts.facebookLink || socialLinks.facebook) + "/reviews", "_blank")}>
                          👤 Open Facebook Reviews
                        </button>
                      )}
                    </>
                  )}

                  {/* Social quick-open buttons for all other tools */}
                  {activeTool.id !== "review_request" && (
                    <>
                      {socialLinks.instagram && (
                        <button style={{ ...S.btn("ghost"), fontSize: 11, padding: "5px 12px", color: "#E4405F", border: `1px solid #E4405F50` }}
                          onClick={() => window.open(socialLinks.instagram, "_blank")}>
                          📷 Open Instagram
                        </button>
                      )}
                      {socialLinks.facebook && (
                        <button style={{ ...S.btn("ghost"), fontSize: 11, padding: "5px 12px", color: "#1877F2", border: `1px solid #1877F250` }}
                          onClick={() => window.open(socialLinks.facebook, "_blank")}>
                          👤 Open Facebook
                        </button>
                      )}
                      {socialLinks.whatsapp && (
                        <a
                          href={`https://wa.me/${socialLinks.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(output.slice(0, 1000))}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ ...S.btn("ghost"), fontSize: 11, padding: "5px 12px", color: "#25D366", border: `1px solid #25D36650`, textDecoration: "none", display: "inline-block" }}
                        >
                          💬 Share on WhatsApp
                        </a>
                      )}
                      {socialLinks.tiktok && (
                        <button style={{ ...S.btn("ghost"), fontSize: 11, padding: "5px 12px" }}
                          onClick={() => window.open(socialLinks.tiktok, "_blank")}>
                          🎵 Open TikTok
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!output && !loading && !error && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: T.textDim }}>
                <div style={{ fontSize: 36 }}>{activeTool.icon}</div>
                <div style={{ fontSize: 12 }}>Set your options and click Generate</div>
              </div>
            )}
          </div>

          {/* Clipboard hint */}
          {output && (
            <div style={{ marginTop: 8, fontSize: 10, color: T.textDim, textAlign: "center", lineHeight: 1.6 }}>
              Copy the content above, then paste into your social media app or email client.
              {Object.values(socialLinks).some(Boolean) ? " Use the quick-open buttons to jump straight there." : " Add your social links via 🔗 Social Links to get quick-open buttons."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
