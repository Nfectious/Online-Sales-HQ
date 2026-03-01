import { useState } from "react";

const LISTINGS = [
  { name: "Railroad Spikes", price: 1.00, shipRev: 0, cogs: 0.10, shipCost: 9.50, pack: 0.10, fvf: 12.9, promo: 2.5 },
  { name: "Cedar Table Legs (4-set)", price: 49.99, shipRev: 0, cogs: 15.00, shipCost: 8.00, pack: 1.00, fvf: 12.9, promo: 6.0 },
  { name: "Cedar Logs (lot of 2)", price: 26.99, shipRev: 0, cogs: 5.00, shipCost: 6.50, pack: 0.75, fvf: 12.9, promo: 4.5 },
  { name: "Cedar Shavings (1 oz)", price: 9.99, shipRev: 0, cogs: 0.25, shipCost: 4.50, pack: 0.25, fvf: 12.9, promo: 7.0 },
  { name: "Xbox Ice Breaker Controller", price: 72.99, shipRev: 0, cogs: 60.00, shipCost: 7.50, pack: 1.00, fvf: 12.9, promo: 3.5 },
];

function calcProfit(v) {
  const revenue = v.price + v.shipRev;
  const fvfFee = -(revenue * (v.fvf / 100) + 0.30);
  const promoFee = -(v.price * (v.promo / 100));
  const totalFees = fvfFee + promoFee;
  const totalCosts = -(v.cogs + v.shipCost + v.pack + (v.store || 0));
  const net = revenue + totalFees + totalCosts;
  const margin = revenue > 0 ? (net / revenue) * 100 : 0;
  const breakEven = ((v.shipRev * (v.fvf / 100)) + 0.30 + v.cogs + v.shipCost + v.pack + (v.store || 0))
    / (1 - v.fvf / 100 - v.promo / 100);
  return { revenue, fvfFee, promoFee, totalFees, totalCosts, net, margin, breakEven };
}

const fmt = (n) => n < 0 ? `-$${Math.abs(n).toFixed(2)}` : `$${n.toFixed(2)}`;
const pct = (n) => `${n.toFixed(1)}%`;

function NumInput({ label, value, onChange, prefix, suffix, step = "0.01" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, color: "#6688AA", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", background: "#0D1B2A", border: "1px solid #1E3A5F", borderRadius: 8 }}>
        {prefix && <span style={{ paddingLeft: 12, color: "#4A90D9", fontSize: 15 }}>{prefix}</span>}
        <input
          type="number"
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "#4A90D9", fontSize: 18, fontWeight: 700, padding: "12px 8px",
            fontFamily: "monospace", minWidth: 0
          }}
        />
        {suffix && <span style={{ paddingRight: 12, color: "#6688AA", fontSize: 13 }}>{suffix}</span>}
      </div>
    </div>
  );
}

function SingleCalc() {
  const [v, setV] = useState({ price: 29.99, shipRev: 0, cogs: 12.00, shipCost: 6.00, pack: 0.50, fvf: 12.9, promo: 5.0, store: 0 });
  const upd = (key) => (val) => setV(prev => ({ ...prev, [key]: val }));
  const r = calcProfit(v);

  return (
    <div>
      {/* Result summary card at top */}
      <div style={{
        background: r.net >= 0 ? "rgba(0,200,100,0.08)" : "rgba(255,60,60,0.08)",
        border: `1px solid ${r.net >= 0 ? "#00C864" : "#FF4455"}`,
        borderRadius: 12, padding: "16px 20px", marginBottom: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div>
          <div style={{ fontSize: 11, color: "#6688AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Net Profit</div>
          <div style={{ fontSize: 32, fontWeight: 900, fontFamily: "monospace", color: r.net >= 0 ? "#00C864" : "#FF4455" }}>
            {fmt(r.net)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#6688AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Margin</div>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "monospace", color: r.margin >= 0 ? "#88CCAA" : "#FF4455" }}>
            {pct(r.margin)}
          </div>
          <div style={{ fontSize: 11, color: "#FF7788", marginTop: 2 }}>Break-even: {fmt(r.breakEven)}</div>
        </div>
      </div>

      {/* Fee breakdown */}
      <div style={{ background: "#0A1628", border: "1px solid #1A2E48", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
        {[
          ["Revenue", fmt(r.revenue), "#CCDDEE"],
          ["FVF Fee", fmt(r.fvfFee), "#FF6677"],
          ["Promoted Fee", fmt(r.promoFee), "#FF6677"],
          ["COGS + Ship + Pack", fmt(r.totalCosts), "#FF6677"],
        ].map(([label, val, color]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #111E30" }}>
            <span style={{ fontSize: 13, color: "#6688AA" }}>{label}</span>
            <span style={{ fontSize: 14, fontFamily: "monospace", fontWeight: 700, color }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Inputs */}
      <div style={{ fontSize: 11, color: "#4A90D9", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
        ▶ Edit Values
      </div>
      <NumInput label="Sale Price" value={v.price} onChange={upd("price")} prefix="$" />
      <NumInput label="Shipping Charged to Buyer" value={v.shipRev} onChange={upd("shipRev")} prefix="$" />
      <NumInput label="Cost of Goods (COGS)" value={v.cogs} onChange={upd("cogs")} prefix="$" />
      <NumInput label="Actual Shipping Cost" value={v.shipCost} onChange={upd("shipCost")} prefix="$" />
      <NumInput label="Packaging & Supplies" value={v.pack} onChange={upd("pack")} prefix="$" />
      <NumInput label="FVF Rate" value={v.fvf} onChange={upd("fvf")} suffix="%" step="0.1" />
      <NumInput label="Promoted Listing Rate" value={v.promo} onChange={upd("promo")} suffix="%" step="0.1" />
    </div>
  );
}

function ListingCard({ row, i, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const r = calcProfit(row);

  return (
    <div style={{ background: "#0A1628", border: "1px solid #1A2E48", borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
      {/* Header row - always visible */}
      <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={() => setOpen(o => !o)} style={{ flex: 1, minWidth: 0, cursor: "pointer" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#CCDDEE", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {row.name}
          </div>
          <div style={{ fontSize: 12, color: "#4A6A88", marginTop: 2 }}>
            {fmt(row.price)} sale · {fmt(r.totalFees)} fees
          </div>
        </div>
        <div onClick={() => setOpen(o => !o)} style={{ marginLeft: 12, textAlign: "right", flexShrink: 0, cursor: "pointer" }}>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "monospace", color: r.net >= 0 ? "#00C864" : "#FF4455" }}>{fmt(r.net)}</div>
          <div style={{ fontSize: 11, color: "#6688AA" }}>{pct(r.margin)} margin</div>
        </div>
        <div onClick={() => setOpen(o => !o)} style={{ marginLeft: 10, color: "#4A6A88", fontSize: 14, cursor: "pointer" }}>{open ? "▲" : "▼"}</div>
        <button onClick={() => onDelete(i)} style={{
          marginLeft: 10, background: "rgba(255,60,60,0.1)", border: "1px solid #3A1020",
          borderRadius: 6, color: "#FF4455", fontSize: 16, width: 32, height: 32,
          cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700
        }}>✕</button>
      </div>

      {/* Expanded edit area */}
      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1A2E48" }}>
          <div style={{ marginTop: 12, marginBottom: 10 }}>
            <label style={{ fontSize: 11, color: "#6688AA", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>Listing Name</label>
            <input value={row.name} onChange={e => onUpdate("name")(e.target.value)}
              style={{ width: "100%", background: "#0D1B2A", border: "1px solid #1E3A5F", borderRadius: 8, color: "#CCDDEE", fontSize: 15, padding: "10px 12px", outline: "none", boxSizing: "border-box" }} />
          </div>
          {[
            ["Sale Price", "price", "$", null],
            ["Ship Rev", "shipRev", "$", null],
            ["COGS", "cogs", "$", null],
            ["Ship Cost", "shipCost", "$", null],
            ["Packaging", "pack", "$", null],
            ["FVF %", "fvf", null, "%"],
            ["Promo %", "promo", null, "%"],
          ].map(([label, key, pre, suf]) => (
            <NumInput key={key} label={label} value={row[key]} onChange={onUpdate(key)} prefix={pre} suffix={suf} step={suf === "%" ? "0.1" : "0.01"} />
          ))}
        </div>
      )}
    </div>
  );
}

function ListingsTracker() {
  const [rows, setRows] = useState(LISTINGS.map(l => ({ ...l, store: 0 })));

  const updRow = (i, key) => (val) => setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const delRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const totals = rows.reduce((acc, row) => {
    const r = calcProfit(row);
    return { revenue: acc.revenue + r.revenue, fees: acc.fees + r.totalFees, net: acc.net + r.net };
  }, { revenue: 0, fees: 0, net: 0 });

  return (
    <div>
      {/* Totals bar */}
      <div style={{ background: "rgba(0,200,100,0.07)", border: "1px solid #003322", borderRadius: 10, padding: "14px 16px", marginBottom: 16, display: "flex", justifyContent: "space-around" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#6688AA", textTransform: "uppercase", letterSpacing: 1 }}>Revenue</div>
          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: "#CCDDEE" }}>{fmt(totals.revenue)}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#6688AA", textTransform: "uppercase", letterSpacing: 1 }}>eBay Fees</div>
          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: "#FF6677" }}>{fmt(totals.fees)}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#6688AA", textTransform: "uppercase", letterSpacing: 1 }}>Net</div>
          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: totals.net >= 0 ? "#00C864" : "#FF4455" }}>{fmt(totals.net)}</div>
        </div>
      </div>

      {rows.map((row, i) => (
        <ListingCard key={i} row={row} i={i} onUpdate={(key) => updRow(i, key)} onDelete={delRow} />
      ))}

      <button onClick={() => setRows(prev => [...prev, { name: "New Listing", price: 0, shipRev: 0, cogs: 0, shipCost: 0, pack: 0, fvf: 12.9, promo: 5.0, store: 0 }])}
        style={{ width: "100%", marginTop: 8, background: "transparent", border: "1px dashed #1E3A5F", borderRadius: 10, color: "#4A90D9", padding: "14px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
        + Add Listing
      </button>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("single");

  return (
    <div style={{ background: "#060E1A", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#CCDDEE", padding: "20px 16px", maxWidth: 500, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: "#2A5A8A", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>moredealsonline</div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#DDEEFF" }}>eBay Profit Calculator</h1>
        <div style={{ fontSize: 12, color: "#4A6A88", marginTop: 2 }}>Basic Store · 12.9% FVF + Promoted Listings</div>
      </div>

      {/* Tab toggle */}
      <div style={{ display: "flex", background: "#0A1628", border: "1px solid #1A2E48", borderRadius: 10, padding: 4, marginBottom: 20 }}>
        {[["single", "Single Listing"], ["tracker", "All Listings"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, background: tab === id ? "#0F3460" : "transparent",
            border: "none", borderRadius: 7, color: tab === id ? "#DDEEFF" : "#4A6A88",
            padding: "10px 8px", cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.15s"
          }}>{label}</button>
        ))}
      </div>

      {tab === "single" ? <SingleCalc /> : <ListingsTracker />}
    </div>
  );
}
