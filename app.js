/* AAW Preflight Checklist - stable single-file logic
   - localStorage persistence
   - Edit loads saved data (no blank)
   - Delete works
   - Reports buttons work
   - Print renders FULL checklist
   - Print shows checkbox states reliably (uses ☑ / ☐)
*/

const STORE_KEY = "aaw_preflight_rows_v1";

const $ = (id) => document.getElementById(id);

function uid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getAll() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setAll(rows) {
  localStorage.setItem(STORE_KEY, JSON.stringify(rows));
}

function getById(id) {
  return getAll().find((r) => r.id === id) || null;
}

function upsert(row) {
  const rows = getAll();
  const idx = rows.findIndex((r) => r.id === row.id);
  if (idx >= 0) rows[idx] = row;
  else rows.unshift(row);
  setAll(rows);
}

function removeById(id) {
  const rows = getAll().filter((r) => r.id !== id);
  setAll(rows);
}

function qp(name) {
  const u = new URL(location.href);
  return u.searchParams.get(name);
}

function fmtDate(d) {
  return d || "";
}

function checked(id) {
  const el = $(id);
  return !!(el && el.checked);
}
function val(id) {
  const el = $(id);
  return el ? (el.value || "").trim() : "";
}
function setVal(id, v) {
  const el = $(id);
  if (el) el.value = v || "";
}
function radioVal(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : "";
}
function setRadio(name, value) {
  if (!value) return;
  const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (el) el.checked = true;
}
function setCheck(id, v) {
  const el = $(id);
  if (el) el.checked = !!v;
}

function collectForm() {
  return {
    date: val("date"),
    flight: val("flight"),
    tail: val("tail"),
    crew: val("crew"),
    completedBy: val("completedBy"),
    missedNotes: val("missedNotes"),

    confVent: radioVal("confVent"),
    confChargers: radioVal("confChargers"),
    confDocs: radioVal("confDocs"),

    // Bag set checks + notes/assets
    jumpBag: checked("jumpBag"),
    jumpBag_note: val("jumpBag_note"),

    airwayBag: checked("airwayBag"),
    airwayBag_note: val("airwayBag_note"),

    medBag: checked("medBag"),
    medBag_note: val("medBag_note"),

    supplyBag: checked("supplyBag"),
    supplyBag_note: val("supplyBag_note"),

    cleaningBag: checked("cleaningBag"),
    cleaningBag_note: val("cleaningBag_note"),

    cardiacMonitor: checked("cardiacMonitor"),
    cardiacMonitor_asset: val("cardiacMonitor_asset"),

    ventilator: checked("ventilator"),
    ventilator_asset: val("ventilator_asset"),

    portableSuction: checked("portableSuction"),
    portableSuction_asset: val("portableSuction_asset"),

    epoc: checked("epoc"),
    epoc_asset: val("epoc_asset"),

    ivPumps: checked("ivPumps"),
    ivPumps_asset: val("ivPumps_asset"),

    computerBag: checked("computerBag"),
    computerBag_asset: val("computerBag_asset"),

    companyPhone: checked("companyPhone"),
    companyPhone_asset: val("companyPhone_asset"),

    otherBag: checked("otherBag"),
    otherBag_note: val("otherBag_note"),

    // Special equipment
    pedsBag: checked("pedsBag"),
    pedsBag_note: val("pedsBag_note"),

    pedimate: checked("pedimate"),
    pedimate_note: val("pedimate_note"),

    neomate: checked("neomate"),
    neomate_note: val("neomate_note"),

    syringePumps: checked("syringePumps"),
    syringePumps_asset: val("syringePumps_asset"),

    isoCapsule: checked("isoCapsule"),
    isoCapsule_note: val("isoCapsule_note"),

    alineCable: checked("alineCable"),
    alineCable_note: val("alineCable_note"),

    // O2
    o2_method: val("o2_method"),
    o2_psi: val("o2_psi"),
    o2_tv: val("o2_tv"),
    o2_rr: val("o2_rr"),
    o2_fio2: val("o2_fio2"),
    o2_mtank: val("o2_mtank"),
    o2_ptank: val("o2_ptank"),
    o2_total: val("o2_total"),
    o2_withpt: val("o2_withpt"),
    o2_extra: val("o2_extra"),
  };
}

function fillForm(item) {
  // IMPORTANT: only set if element exists (prevents break if layout changes)
  setVal("date", item.date);
  setVal("flight", item.flight);
  setVal("tail", item.tail);
  setVal("crew", item.crew);
  setVal("completedBy", item.completedBy);
  setVal("missedNotes", item.missedNotes);

  setRadio("confVent", item.confVent);
  setRadio("confChargers", item.confChargers);
  setRadio("confDocs", item.confDocs);

  [
    "jumpBag","airwayBag","medBag","supplyBag","cleaningBag",
    "cardiacMonitor","ventilator","portableSuction","epoc","ivPumps","computerBag","companyPhone","otherBag",
    "pedsBag","pedimate","neomate","syringePumps","isoCapsule","alineCable"
  ].forEach(k => setCheck(k, item[k]));

  [
    "jumpBag_note","airwayBag_note","medBag_note","supplyBag_note","cleaningBag_note",
    "cardiacMonitor_asset","ventilator_asset","portableSuction_asset","epoc_asset","ivPumps_asset","computerBag_asset","companyPhone_asset",
    "otherBag_note","pedsBag_note","pedimate_note","neomate_note","syringePumps_asset","isoCapsule_note","alineCable_note",
    "o2_method","o2_psi","o2_tv","o2_rr","o2_fio2","o2_mtank","o2_ptank","o2_total","o2_withpt","o2_extra"
  ].forEach(k => setVal(k, item[k]));
}

function initPreflightPage() {
  const form = $("preflightForm");
  if (!form) return;

  const id = qp("id");
  const submitBtn = $("submitBtn");

  if (id) {
    const item = getById(id);
    if (item) {
      fillForm(item);
      if (submitBtn) submitBtn.textContent = "Update";
    } else {
      if (submitBtn) submitBtn.textContent = "Submit";
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = collectForm();

    // Required fields
    if (!payload.date || !payload.flight || !payload.tail || !payload.crew || !payload.completedBy) {
      alert("Please complete Date, Flight, Tail, Crew, and Completed by.");
      return;
    }

    const isEdit = !!id;

    const existing = isEdit ? getById(id) : null;

    const row = {
      id: isEdit ? id : uid(),
      ...payload,
      updatedAt: new Date().toISOString(),
      createdAt: isEdit ? (existing?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    };

    upsert(row);
    location.href = "history.html";
  });
}

function filterRows(rows, { flight, tail, crew, from, to }) {
  const f = (flight || "").toLowerCase();
  const t = (tail || "").toLowerCase();
  const c = (crew || "").toLowerCase();

  return rows.filter((r) => {
    if (f && !(r.flight || "").toLowerCase().includes(f)) return false;
    if (t && !(r.tail || "").toLowerCase().includes(t)) return false;
    if (c && !(r.crew || "").toLowerCase().includes(c)) return false;

    if (from && (r.date || "") < from) return false;
    if (to && (r.date || "") > to) return false;
    return true;
  });
}

function initHistoryPage() {
  const tbody = $("historyBody");
  if (!tbody) return;

  const inputs = {
    flight: $("hFlight"),
    tail: $("hTail"),
    crew: $("hCrew"),
    from: $("hFrom"),
    to: $("hTo"),
  };

  const render = () => {
    const rows = filterRows(getAll(), {
      flight: inputs.flight?.value || "",
      tail: inputs.tail?.value || "",
      crew: inputs.crew?.value || "",
      from: inputs.from?.value || "",
      to: inputs.to?.value || "",
    });

    tbody.innerHTML = rows.map((r) => `
      <tr>
        <td>${fmtDate(r.date)}</td>
        <td>${escapeHtml(r.flight)}</td>
        <td>${escapeHtml(r.tail)}</td>
        <td>${escapeHtml(r.crew)}</td>
        <td>${escapeHtml(r.completedBy)}</td>
        <td>
          <div class="actions-row">
            <button class="ghost" type="button" data-edit="${r.id}">Edit</button>
            <button class="ghost danger" type="button" data-del="${r.id}">Delete</button>
          </div>
        </td>
      </tr>
    `).join("");

    tbody.querySelectorAll("[data-edit]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-edit");
        location.href = `preflight.html?id=${encodeURIComponent(id)}`;
      });
    });

    tbody.querySelectorAll("[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-del");
        if (!confirm("Delete this checklist?")) return;
        removeById(id);
        render();
      });
    });
  };

  Object.values(inputs).forEach(i => i && i.addEventListener("input", render));
  render();
}

function initReportsPage() {
  const tbody = $("reportsBody");
  if (!tbody) return;

  const rFlight = $("rFlight");
  const rFrom = $("rFrom");
  const rTo = $("rTo");

  const render = () => {
    const rows = filterRows(getAll(), {
      flight: rFlight?.value || "",
      tail: "",
      crew: "",
      from: rFrom?.value || "",
      to: rTo?.value || "",
    });

    tbody.innerHTML = rows.map((r) => `
      <tr>
        <td><input type="radio" name="pickReport" value="${r.id}"></td>
        <td>${fmtDate(r.date)}</td>
        <td>${escapeHtml(r.flight)}</td>
        <td>${escapeHtml(r.tail)}</td>
        <td>${escapeHtml(r.crew)}</td>
        <td>${escapeHtml(r.completedBy)}</td>
      </tr>
    `).join("");
  };

  $("refreshReports")?.addEventListener("click", () => render());
  [rFlight, rFrom, rTo].forEach(el => el && el.addEventListener("input", render));

  $("printReport")?.addEventListener("click", () => {
    const picked = document.querySelector('input[name="pickReport"]:checked');
    if (!picked) return alert("Select a row first.");
    const id = picked.value;
    location.href = `print.html?id=${encodeURIComponent(id)}&from=reports`;
  });

  // Email stays as-is (since you said email is working now)
  render();
}

function initPrintPage() {
  const out = $("printContent");
  if (!out) return;

  const id = qp("id");
  const from = qp("from") || "reports";
  const item = id ? getById(id) : null;

  $("printBtn")?.addEventListener("click", () => window.print());
  $("exitBtn")?.addEventListener("click", () => {
    if (from === "history") location.href = "history.html";
    else location.href = "reports.html";
  });

  if (!item) {
    out.innerHTML = `<strong>Could not load checklist.</strong> Go back and try again.`;
    return;
  }

  out.innerHTML = renderPrintTemplate(item);
}

/* ===== PRINT RENDER HELPERS ===== */

// This is the ONLY change to print behavior:
// show checkboxes as ☑ / ☐ so they ALWAYS show in print/PDF.
function renderCheckRow(label, isChecked, rightText) {
  const box = isChecked ? "☑" : "☐";
  const right = rightText
    ? `<span style="margin-left:auto; min-width:220px; border-bottom:1px solid #111; display:inline-block; padding:2px 0;">${escapeHtml(rightText)}</span>`
    : `<span style="margin-left:auto; min-width:220px; border-bottom:1px solid #111; display:inline-block; padding:2px 0;"></span>`;

  return `
    <div style="display:flex; align-items:center; gap:10px; padding:4px 0;">
      <div style="width:18px; font-size:16px; line-height:1;">${box}</div>
      <div style="font-weight:800; min-width:180px;">${escapeHtml(label)}</div>
      ${right}
    </div>
  `;
}

function renderYesNo(question, value) {
  const yes = value === "YES";
  const no = value === "NO";
  return `
    <div style="margin-top:10px;">
      <div style="font-weight:800;">${escapeHtml(question)}</div>
      <div style="display:flex; gap:18px; align-items:center; margin-top:6px;">
        <label style="display:flex; gap:6px; align-items:center;"><input type="radio" ${yes ? "checked" : ""} /> YES</label>
        <label style="display:flex; gap:6px; align-items:center;"><input type="radio" ${no ? "checked" : ""} /> NO</label>
      </div>
    </div>
  `;
}

function renderLine(label, value) {
  return `
    <div style="display:flex; gap:10px; align-items:center; margin:6px 0;">
      <div style="width:140px; font-weight:900;">${escapeHtml(label)}:</div>
      <div style="flex:1; border-bottom:1px solid #111; padding:2px 0;">${escapeHtml(value || "")}</div>
    </div>
  `;
}

function renderPrintTemplate(item) {
  return `
    <div style="border:2px solid #111; padding:14px;">
      <div style="border:2px solid #111; padding:10px; text-align:center; font-weight:900; letter-spacing:0.6px;">
        PREFLIGHT EQUIPMENT CHECK LIST
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-top:12px;">
        <div>
          <div style="display:flex; gap:10px; align-items:center; margin:8px 0;">
            <div style="width:70px; font-weight:800;">Date:</div>
            <div style="flex:1; border-bottom:1px solid #111; padding:2px 0;">${escapeHtml(item.date || "")}</div>
          </div>
          <div style="display:flex; gap:10px; align-items:center; margin:8px 0;">
            <div style="width:70px; font-weight:800;">Tail:</div>
            <div style="flex:1; border-bottom:1px solid #111; padding:2px 0;">${escapeHtml(item.tail || "")}</div>
          </div>
        </div>

        <div>
          <div style="display:flex; gap:10px; align-items:center; margin:8px 0;">
            <div style="width:70px; font-weight:800;">Flight:</div>
            <div style="flex:1; border-bottom:1px solid #111; padding:2px 0;">${escapeHtml(item.flight || "")}</div>
          </div>
          <div style="display:flex; gap:10px; align-items:center; margin:8px 0;">
            <div style="width:70px; font-weight:800;">Crew:</div>
            <div style="flex:1; border-bottom:1px solid #111; padding:2px 0;">${escapeHtml(item.crew || "")}</div>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-top:14px;">
        <div style="border:2px solid #111; padding:10px;">
          <div style="font-weight:900; border-bottom:1px solid #111; padding-bottom:6px;">BAG SET</div>
          ${renderCheckRow("JUMP BAG", item.jumpBag, item.jumpBag_note)}
          ${renderCheckRow("AIRWAY BAG", item.airwayBag, item.airwayBag_note)}
          ${renderCheckRow("MEDICATION BAG", item.medBag, item.medBag_note)}
          ${renderCheckRow("SUPPLY / TRAUMA BAG", item.supplyBag, item.supplyBag_note)}
          ${renderCheckRow("CLEANING BAG", item.cleaningBag, item.cleaningBag_note)}
          ${renderCheckRow("CARDIAC MONITOR", item.cardiacMonitor, item.cardiacMonitor_asset)}
          ${renderCheckRow("VENTILATOR", item.ventilator, item.ventilator_asset)}
          ${renderCheckRow("PORTABLE SUCTION", item.portableSuction, item.portableSuction_asset)}
          ${renderCheckRow("EPOC", item.epoc, item.epoc_asset)}
          ${renderCheckRow("IV PUMPS X-4", item.ivPumps, item.ivPumps_asset)}
          ${renderCheckRow("COMPUTER / COMPUTER BAG", item.computerBag, item.computerBag_asset)}
          ${renderCheckRow("COMPANY CELL PHONE", item.companyPhone, item.companyPhone_asset)}
          ${renderCheckRow("OTHER", item.otherBag, item.otherBag_note)}

          <div style="margin-top:14px; font-weight:900; border-top:1px solid #111; padding-top:10px;">SPECIAL EQUIPMENTS</div>
          ${renderCheckRow("PEDIATRIC BAG", item.pedsBag, item.pedsBag_note)}
          ${renderCheckRow("PEDIMATE", item.pedimate, item.pedimate_note)}
          ${renderCheckRow("NEOMATE", item.neomate, item.neomate_note)}
          ${renderCheckRow("SYRINGE PUMPS", item.syringePumps, item.syringePumps_asset)}
          ${renderCheckRow("TRANSPORT ISO CAPSULE", item.isoCapsule, item.isoCapsule_note)}
          ${renderCheckRow("A-LINE CABLE / ATTACHMENTS", item.alineCable, item.alineCable_note)}

          <div style="margin-top:14px; font-weight:900; border-top:1px solid #111; padding-top:10px;">OXYGEN CALCULATION</div>
          ${renderLine("METHOD", item.o2_method)}
          ${renderLine("PSI", item.o2_psi)}
          ${renderLine("TIDAL VOLUME", item.o2_tv)}
          ${renderLine("RESP. RATE", item.o2_rr)}
          ${renderLine("FIO2", item.o2_fio2)}
          ${renderLine("M-TANK", item.o2_mtank)}
          ${renderLine("PORTABLE TANK", item.o2_ptank)}
          ${renderLine("TOTAL TIME", item.o2_total)}
          ${renderLine("TIME WITH PATIENT", item.o2_withpt)}
          ${renderLine("EXTRA", item.o2_extra)}
        </div>

        <div style="border:2px solid #111; padding:10px;">
          <div style="font-weight:900; border-bottom:1px solid #111; padding-bottom:6px;">Equipment missed or misplaced</div>
          <div style="border:1px solid #111; min-height:120px; padding:10px; margin-top:10px; white-space:pre-wrap;">${escapeHtml(item.missedNotes || "")}</div>

          <div style="margin-top:14px; font-weight:900; border-top:1px solid #111; padding-top:10px;">Confirmations</div>
          ${renderYesNo("Ventilator circuit on supply & airway bag?", item.confVent)}
          ${renderYesNo("All chargers available/accountable?", item.confChargers)}
          ${renderYesNo("All documents collected (incl. international list)?", item.confDocs)}

          <div style="margin-top:14px; font-weight:900;">Completed by</div>
          <div style="border-bottom:1px solid #111; padding:2px 0; margin-top:6px;">${escapeHtml(item.completedBy || "")}</div>
        </div>
      </div>

      <div style="margin-top:10px; font-size:12px; color:#111;">
        Please return this sheet to the binder by the equipment cabinets after verifying your equipment before you leave.
      </div>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* Boot per page */
document.addEventListener("DOMContentLoaded", () => {
  initPreflightPage();
  initHistoryPage();
  initReportsPage();
  initPrintPage();
});

// EMAIL PDF (Reports page) - clean version (no alert + clickable link)
document.addEventListener("DOMContentLoaded", () => {
  const emailBtn = document.getElementById("emailPdfBtn");
  if (!emailBtn) return;

  function getSelectedPreflightId() {
    const checked = document.querySelector('input[name="selectedRow"]:checked');
    return checked ? checked.value : null;
  }

  emailBtn.addEventListener("click", () => {
    const id = getSelectedPreflightId();

    // If nothing selected, do nothing (NO alert)
    if (!id) return;

    const url = `${location.origin}/print.html?id=${encodeURIComponent(id)}&from=reports`;

    const subject = "Preflight Checklist";
    const body = [
      "Hi,",
      "",
      "Please open this link to print/save the PDF:",
      url,
      "",
      "Thank you."
    ].join("\n");

    window.location.href =
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});

// --- EMAIL PDF (robust binding) ---
document.addEventListener("click", (e) => {
  const btn = e.target.closest("#emailPdfBtn");
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  // Find ANY checked radio on the page (works even if the name isn't "selectedRow")
  const checkedRadio = document.querySelector('input[type="radio"]:checked');

  if (!checkedRadio) {
    alert("Please select a preflight first.");
    return;
  }

  // Most setups store the preflight id in radio.value
  const id = checkedRadio.value;

  if (!id || id.length < 5) {
    console.warn("Email PDF: selected radio value looks empty/invalid:", id);
    alert("I found a selected row, but it doesn’t have an ID value. (Radio value is blank.)");
    return;
  }

  // Build a link to the printable page
  const printUrl = `${location.origin}/print.html?id=${encodeURIComponent(id)}&from=reports`;

  const subject = "Preflight Checklist";
  const body =
    `Hi,\n\n` +
    `Please open this link to print/save the PDF:\n\n${printUrl}\n\n` +
    `Thank you.`;

  // Trigger default mail app (Outlook if configured in Windows)
  window.location.href =
    `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
