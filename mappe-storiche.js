// === MODALITÀ ISPEZIONE VIDEO: TUTTE LE CARTE DAL REPOSITORY GITHUB ===

const LAND_BASE_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson";
const GH_API_GEOJSON_URL = "https://api.github.com/repos/aourednik/historical-basemaps/contents/geojson";
const RAW_GEOJSON_BASE = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/";

let allHistoricalMaps = []; // Lista ordinata di tutte le cartine trovate
let currentIdx = 0;
let playInterval = null;

let d3Svg = null;
let d3Projection = null;
let d3Path = null;
let d3Zoom = null;
let landLayer = null;
let histLayer = null;
let currentK = 1;
const cacheGeo = new Map();

// Palette di colori per distinguere le diverse entità presenti nella carta
const PALETTE = [
  "#e67e22", "#3b82f6", "#facc15", "#22c55e", "#a855f7",
  "#ef4444", "#06b6d4", "#ec4899", "#84cc16", "#f97316",
  "#6366f1", "#14b8a6", "#eab308", "#f43f5e", "#8b5cf6"
];

document.addEventListener("DOMContentLoaded", async () => {
  initD3Stage();
  await loadLandBase();
  await loadAllMapsFromGitHub();
});

function initD3Stage() {
  const container = document.getElementById("historicalMapCanvas");
  if (!container || typeof d3 === "undefined") return;

  const width = container.clientWidth || 900;
  const height = container.clientHeight || 490;

  d3Svg = d3.select("#historicalMapCanvas")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`);

  d3Projection = d3.geoNaturalEarth1()
    .scale(width / 5.3)
    .translate([width / 2, height / 2]);

  d3Path = d3.geoPath().projection(d3Projection);

  const rootGroup = d3Svg.append("g");
  landLayer = rootGroup.append("g");
  histLayer = rootGroup.append("g");

  d3Zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      currentK = event.transform.k || 1;
      rootGroup.attr("transform", event.transform);
      landLayer.selectAll("path").attr("stroke-width", 0.6 / currentK);
      histLayer.selectAll("path").attr("stroke-width", 0.9 / currentK);
    });

  d3Svg.call(d3Zoom);
}

async function loadLandBase() {
  if (!landLayer) return;
  try {
    const land = await d3.json(LAND_BASE_URL);
    landLayer.selectAll("path")
      .data(land.features || [])
      .enter()
      .append("path")
      .attr("d", d3Path)
      .attr("fill", "#232b38")
      .attr("stroke", "#475569")
      .attr("stroke-width", 0.6);
  } catch (e) {
    console.warn("Errore sfondo terre emerse:", e);
  }
}

// Converte nomi tipo "world_bc3000.geojson" o "world_1945.geojson" in un numero per ordinare cronologicamente
function parseYearFromFilename(filename) {
  const clean = filename.replace(".geojson", "").replace("world_", "");
  if (clean.startsWith("bc")) {
    const num = parseInt(clean.replace("bc", ""), 10);
    return isNaN(num) ? -999999 : -num;
  }
  const num = parseInt(clean, 10);
  return isNaN(num) ? 999999 : num;
}

function formatYearLabel(filename) {
  const clean = filename.replace(".geojson", "").replace("world_", "");
  if (clean.startsWith("bc")) {
    return `${clean.replace("bc", "")} a.C.`;
  }
  return `${clean} d.C.`;
}

async function loadAllMapsFromGitHub() {
  setStatus("Recupero elenco cartine da GitHub...");
  try {
    const res = await fetch(GH_API_GEOJSON_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const items = await res.json();

    allHistoricalMaps = items
      .filter(f => f.type === "file" && f.name.endsWith(".geojson"))
      .map(f => ({
        filename: f.name,
        url: f.download_url || (RAW_GEOJSON_BASE + f.name),
        sortYear: parseYearFromFilename(f.name),
        label: formatYearLabel(f.name)
      }))
      .sort((a, b) => a.sortYear - b.sortYear);

    if (!allHistoricalMaps.length) {
      setStatus("Nessun file .geojson trovato nella cartella.");
      return;
    }

    renderPills();
    await showMapAt(0);
  } catch (err) {
    console.error("Errore lettura cartelle GitHub:", err);
    setStatus("Errore nel leggere l'elenco file su GitHub (possibile limite API o rete).");
  }
}

function renderPills() {
  const row = document.getElementById("timelinePillsRow");
  const slider = document.getElementById("timelineSlider");
  if (!row || !slider) return;

  slider.min = "0";
  slider.max = String(allHistoricalMaps.length - 1);
  slider.value = String(currentIdx);

  row.innerHTML = allHistoricalMaps.map((m, idx) => `
    <button type="button" class="step-pill ${idx === currentIdx ? "active" : ""}" onclick="selectTimelineIndex(${idx})">
      ${m.label}
    </button>
  `).join("");
}

// Manteniamo compatibili i nomi delle funzioni richiamate dall'HTML
function filterTimelineEra() {
  stopTimelinePlayback();
  renderPills();
  showMapAt(0);
}

function selectTimelineIndex(idx) {
  stopTimelinePlayback();
  showMapAt(idx);
}

function stepTimeline(delta) {
  stopTimelinePlayback();
  if (!allHistoricalMaps.length) return;
  const next = (currentIdx + delta + allHistoricalMaps.length) % allHistoricalMaps.length;
  showMapAt(next);
}

function toggleTimelinePlayback() {
  const btn = document.getElementById("btnTimelinePlay");
  if (playInterval) {
    stopTimelinePlayback();
    return;
  }
  if (!allHistoricalMaps.length) return;
  if (btn) btn.textContent = "⏸ Pausa";

  // Avanza come un video ogni 1,4 secondi dalla prima all'ultima cartina
  playInterval = setInterval(async () => {
    const next = currentIdx + 1;
    if (next >= allHistoricalMaps.length) {
      stopTimelinePlayback();
      return;
    }
    await showMapAt(next);
  }, 1400);
}

function stopTimelinePlayback() {
  if (playInterval) {
    clearInterval(playInterval);
    playInterval = null;
  }
  const btn = document.getElementById("btnTimelinePlay");
  if (btn) btn.textContent = "▶ Play";
}

function resetHistoricalMapZoom() {
  if (!d3Svg || !d3Zoom) return;
  d3Svg.transition().duration(400).call(d3Zoom.transform, d3.zoomIdentity);
}

function getEntityName(feature) {
  const p = feature.properties || {};
  return p.NAME || p.name || p.SUBJECTO || p.PARTOF || p.FORM || p.CONTINENT || "Senza nome";
}

function colorForName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

async function showMapAt(idx) {
  if (idx < 0 || idx >= allHistoricalMaps.length || !histLayer) return;
  currentIdx = idx;
  const item = allHistoricalMaps[idx];

  const slider = document.getElementById("timelineSlider");
  if (slider) slider.value = String(idx);

  document.querySelectorAll("#timelinePillsRow .step-pill").forEach((pill, i) => {
    pill.classList.toggle("active", i === idx);
    if (i === idx) pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });

  const eraBadge = document.getElementById("timelineEraBadge");
  const yearTitle = document.getElementById("timelineYearTitle");
  const detailDesc = document.getElementById("timelineDetailDesc");
  const legendEl = document.getElementById("timelineLegend");

  if (eraBadge) eraBadge.textContent = `Cartina ${idx + 1} di ${allHistoricalMaps.length}`;
  if (yearTitle) yearTitle.textContent = `${item.label} — File: ${item.filename}`;
  setStatus(`Caricamento ${item.filename}...`);

  try {
    if (!cacheGeo.has(item.url)) {
      const geo = await d3.json(item.url);
      cacheGeo.set(item.url, geo);
    }
  } catch (err) {
    console.error("Errore caricamento carta:", item.url, err);
    setStatus(`Errore su ${item.filename}`);
    if (detailDesc) detailDesc.textContent = `Impossibile caricare ${item.filename}.`;
    return;
  }

  const geoData = cacheGeo.get(item.url);
  const features = geoData.features || [];
  const tooltip = document.getElementById("mapHoverTooltip");

  // Raccoglie i nomi unici presenti nella cartina per capire come è strutturata
  const uniqueNames = [...new Set(features.map(getEntityName))];
  if (detailDesc) {
    detailDesc.textContent = `Poligoni nella cartina: ${features.length} | Entità/etichette distinte rilevate: ${uniqueNames.length}. Passa sopra una zona per vedere il nome esatto nel dataset.`;
  }
  if (legendEl) {
    legendEl.innerHTML = uniqueNames.slice(0, 18).map(n => `
      <span style="display:inline-flex;align-items:center;gap:6px;background:#121418;padding:4px 9px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);font-size:0.78rem;">
        <span style="width:10px;height:10px;border-radius:2px;background:${colorForName(n)};display:inline-block;"></span>
        ${n}
      </span>
    `).join("") + (uniqueNames.length > 18 ? `<span style="color:#9ba1a6;font-size:0.78rem;">+${uniqueNames.length - 18} altre...</span>` : "");
  }

  histLayer.selectAll("*").remove();

  histLayer.selectAll("path")
    .data(features)
    .enter()
    .append("path")
    .attr("d", d3Path)
    .attr("fill", d => colorForName(getEntityName(d)))
    .attr("fill-opacity", 0.72)
    .attr("stroke", "#111827")
    .attr("stroke-width", 0.9 / currentK)
    .on("mousemove", (event, d) => {
      if (!tooltip) return;
      const name = getEntityName(d);
      const props = d.properties || {};
      const extra = Object.entries(props)
        .slice(0, 4)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" · ");

      tooltip.style.display = "block";
      tooltip.style.left = `${event.offsetX + 12}px`;
      tooltip.style.top = `${event.offsetY - 34}px`;
      tooltip.innerHTML = `<strong style="color:#facc15;">${name}</strong>${extra ? `<br><span style="color:#cbd5e1;font-size:0.75rem;">${extra}</span>` : ""}`;
    })
    .on("mouseleave", () => {
      if (tooltip) tooltip.style.display = "none";
    });

  setStatus(`${item.label} (${idx + 1}/${allHistoricalMaps.length})`);
}

function setStatus(msg) {
  const badge = document.getElementById("mapStatusBadge");
  if (badge) badge.textContent = msg;
}
