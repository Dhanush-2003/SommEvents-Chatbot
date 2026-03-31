/* =========================================================
   SommEvents – Analytics Dashboard
   Standalone admin page. Authenticates via service_role key.
   ========================================================= */

(function () {
  "use strict";

  const SUPABASE_URL = "https://sxaisrcdheafiqerqwyu.supabase.co";
  let supabase = null;

  /* ---- DOM refs ---- */
  const gate       = document.getElementById("auth-gate");
  const dashboard  = document.getElementById("dashboard");
  const keyInput   = document.getElementById("auth-key");
  const authBtn    = document.getElementById("auth-submit");
  const periodSel  = document.getElementById("period-select");
  const refreshBtn = document.getElementById("refresh-btn");
  const dateRange  = document.getElementById("date-range");

  /* ---- Auth ---- */
  authBtn.addEventListener("click", authenticate);
  keyInput.addEventListener("keydown", (e) => { if (e.key === "Enter") authenticate(); });

  const saved = sessionStorage.getItem("somm_dash_key");
  if (saved) { keyInput.value = saved; authenticate(); }

  async function authenticate() {
    const key = keyInput.value.trim();
    if (!key) return;

    supabase = window.supabase.createClient(SUPABASE_URL, key);

    const { data, error } = await supabase.from("sessions").select("id", { count: "exact", head: true });
    if (error) {
      alert("Invalid key or connection error.\n\n" + error.message);
      supabase = null;
      return;
    }

    sessionStorage.setItem("somm_dash_key", key);
    gate.classList.add("hidden");
    dashboard.classList.remove("hidden");
    loadDashboard();
  }

  /* ---- Period filter ---- */
  periodSel.addEventListener("change", loadDashboard);
  refreshBtn.addEventListener("click", loadDashboard);

  function getSince() {
    const days = parseInt(periodSel.value);
    if (days === 0) return null;
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
  }

  /* ---- Load all data ---- */
  async function loadDashboard() {
    const since = getSince();
    dateRange.textContent = since
      ? `Since ${new Date(since).toLocaleDateString()}`
      : "All time";

    const [sessions, leads, dropoffs] = await Promise.all([
      fetchSessions(since),
      fetchLeads(since),
      fetchDropoffs(since)
    ]);

    renderKPIs(sessions, leads, dropoffs);
    renderLeadsChart(leads);
    renderRatingsChart(sessions);
    renderDropoffTable(dropoffs);
    renderTagsTable(sessions);
    renderLeadsTable(leads);
  }

  /* ---- Fetch helpers ---- */
  async function fetchSessions(since) {
    let q = supabase.from("sessions").select("*").order("created_at", { ascending: false });
    if (since) q = q.gte("created_at", since);
    const { data } = await q;
    return data || [];
  }

  async function fetchLeads(since) {
    let q = supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (since) q = q.gte("created_at", since);
    const { data } = await q;
    return data || [];
  }

  async function fetchDropoffs(since) {
    let q = supabase.from("dropoffs").select("*").order("created_at", { ascending: false });
    if (since) q = q.gte("created_at", since);
    const { data } = await q;
    return data || [];
  }

  /* ---- KPIs ---- */
  function renderKPIs(sessions, leads, dropoffs) {
    const totalSessions = sessions.length;
    const totalLeads = leads.length;
    const conversion = totalSessions > 0
      ? ((totalLeads / totalSessions) * 100).toFixed(1) + "%"
      : "—";

    const rated = sessions.filter(s => s.rating != null);
    const avgRating = rated.length > 0
      ? (rated.reduce((sum, s) => sum + s.rating, 0) / rated.length).toFixed(1) + " ★"
      : "—";

    const avgMessages = totalSessions > 0
      ? (sessions.reduce((sum, s) => sum + (s.message_count || 0), 0) / totalSessions).toFixed(1)
      : "—";

    setText("kpi-sessions", totalSessions);
    setText("kpi-leads", totalLeads);
    setText("kpi-conversion", conversion);
    setText("kpi-rating", avgRating);
    setText("kpi-dropoffs", dropoffs.length);
    setText("kpi-avg-messages", avgMessages);
  }

  /* ---- Leads Over Time Chart ---- */
  let leadsChart = null;

  function renderLeadsChart(leads) {
    const grouped = groupByDate(leads, "captured_at");
    const labels = Object.keys(grouped).sort();
    const values = labels.map(l => grouped[l]);

    if (leadsChart) leadsChart.destroy();
    leadsChart = new Chart(document.getElementById("chart-leads"), {
      type: "bar",
      data: {
        labels: labels.map(l => formatDateLabel(l)),
        datasets: [{
          label: "Leads",
          data: values,
          backgroundColor: "rgba(133,0,3,0.7)",
          borderRadius: 4,
          maxBarThickness: 40
        }]
      },
      options: chartOptions("Leads captured per day")
    });
  }

  /* ---- Ratings Distribution Chart ---- */
  let ratingsChart = null;

  function renderRatingsChart(sessions) {
    const counts = [0, 0, 0, 0, 0];
    sessions.forEach(s => {
      if (s.rating >= 1 && s.rating <= 5) counts[s.rating - 1]++;
    });

    if (ratingsChart) ratingsChart.destroy();
    ratingsChart = new Chart(document.getElementById("chart-ratings"), {
      type: "doughnut",
      data: {
        labels: ["1 ★", "2 ★", "3 ★", "4 ★", "5 ★"],
        datasets: [{
          data: counts,
          backgroundColor: [
            "#c0392b", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60"
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom", labels: { color: "#aaa", font: { size: 11 } } }
        }
      }
    });
  }

  /* ---- Drop-off Table ---- */
  function renderDropoffTable(dropoffs) {
    const counts = {};
    dropoffs.forEach(d => {
      const node = d.dropped_at_node || "unknown";
      counts[node] = (counts[node] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const tbody = document.querySelector("#table-dropoffs tbody");
    tbody.innerHTML = sorted.length === 0
      ? '<tr><td colspan="2" style="color:var(--text-secondary)">No data</td></tr>'
      : sorted.map(([node, count]) => `<tr><td>${esc(node)}</td><td>${count}</td></tr>`).join("");
  }

  /* ---- Tags Table ---- */
  function renderTagsTable(sessions) {
    const counts = {};
    sessions.forEach(s => {
      (s.tags || []).forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const tbody = document.querySelector("#table-tags tbody");
    tbody.innerHTML = sorted.length === 0
      ? '<tr><td colspan="2" style="color:var(--text-secondary)">No data</td></tr>'
      : sorted.map(([tag, count]) => `<tr><td>${esc(tag)}</td><td>${count}</td></tr>`).join("");
  }

  /* ---- Recent Leads Table ---- */
  function renderLeadsTable(leads) {
    const recent = leads.slice(0, 10);
    const tbody = document.querySelector("#table-leads tbody");
    tbody.innerHTML = recent.length === 0
      ? '<tr><td colspan="3" style="color:var(--text-secondary)">No leads yet</td></tr>'
      : recent.map(l =>
          `<tr><td>${esc(l.name || "—")}</td><td>${esc(l.email || "—")}</td><td>${formatDateLabel(l.captured_at)}</td></tr>`
        ).join("");
  }

  /* ---- Utilities ---- */
  function setText(id, val) { document.getElementById(id).textContent = val; }

  function esc(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function groupByDate(rows, dateField) {
    const out = {};
    rows.forEach(r => {
      if (!r[dateField]) return;
      const day = r[dateField].substring(0, 10);
      out[day] = (out[day] || 0) + 1;
    });
    return out;
  }

  function formatDateLabel(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
  }

  function chartOptions(title) {
    return {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        x: {
          ticks: { color: "#888", font: { size: 11 } },
          grid: { color: "rgba(255,255,255,0.04)" }
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#888", font: { size: 11 }, stepSize: 1 },
          grid: { color: "rgba(255,255,255,0.04)" }
        }
      }
    };
  }

})();
