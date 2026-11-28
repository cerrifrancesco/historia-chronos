// === MOTORE MAPPE STORICHE ANIMATE (D3.js + GeoJSON Storici Open-Source) ===

const LAND_BASE_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson";
const HIST_BASE_URL = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson/";

const HISTORICAL_STAGES = [
  {
    yearLabel: "3000 a.C.",
    title: "Prime Civiltà Fluviali (Mesopotamia ed Egitto)",
    era: "antica",
    eraLabel: "Età Antica",
    geoUrl: HIST_BASE_URL + "world_bc3000.geojson",
    center: [34, 28],
    zoom: 3.6,
    lessonUrl: "index.html?lezione=1.1",
    lessonText: "📖 Vai alla Lezione 1.1",
    description: "Lungo le valli del Tigri, dell'Eufrate e del Nilo nascono le prime città-stato, la scrittura cuneiforme e geroglifica, i sistemi di irrigazione e le prime monarchie teocratiche.",
    regions: [
      { match: ["egypt"], name: "Antico Egitto dei Faraoni", color: "#e67e22" },
      { match: ["sumer", "mesopotamia", "ur", "uruk", "babylon", "akkad", "elam"], name: "Civiltà Mesopotamiche e Vicino Oriente", color: "#facc15" }
    ],
    markers: [
      { name: "Ur e Uruk", coords: [45.6, 31.3], info: "Culla della scrittura cuneiforme e delle Ziggurat" },
      { name: "Menfi e Tebe", coords: [31.5, 26.8], info: "Centro del Regno dei Faraoni lungo il Nilo" }
    ]
  },
  {
    yearLabel: "480 a.C.",
    title: "Grecia Classica e Impero Persiano",
    era: "antica",
    eraLabel: "Età Antica",
    geoUrl: HIST_BASE_URL + "world_bc500.geojson",
    center: [34, 35],
    zoom: 3.3,
    lessonUrl: "index.html?lezione=1.6",
    lessonText: "📖 Vai alla Lezione 1.6",
    description: "Le poleis greche guidate da Atene e Sparta affrontano l'espansione dell'Impero Persiano Achemenide nelle grandi battaglie di Maratona, Termopili e Salamina.",
    regions: [
      { match: ["greek", "greece", "athens", "sparta"], name: "Poleis Greche", color: "#3b82f6" },
      { match: ["persi", "achaemenid"], name: "Impero Persiano Achemenide", color: "#facc15" }
    ],
    markers: [
      { name: "Atene & Salamina", coords: [23.7, 37.9], info: "Cuore della democrazia ateniese e vittoria navale del 480 a.C." },
      { name: "Persepoli", coords: [52.8, 29.9], info: "Capitale cerimoniale dell'Impero Persiano" }
    ]
  },
  {
    yearLabel: "323 a.C.",
    title: "L'Impero di Alessandro Magno e l'Ellenismo",
    era: "antica",
    eraLabel: "Età Antica",
    geoUrl: HIST_BASE_URL + "world_bc323.geojson",
    center: [40, 33],
    zoom: 3.1,
    lessonUrl: "index.html?lezione=1.7",
    lessonText: "📖 Vai alla Lezione 1.7",
    description: "In poco più di dieci anni Alessandro Magno unifica la Grecia e conquista l'Impero Persiano fino ai confini dell'India, diffondendo la cultura ellenistica.",
    regions: [
      { match: ["macedon", "alexander", "greek", "greece", "persi", "achaemenid"], name: "Impero di Alessandro Magno", color: "#facc15" }
    ],
    markers: [
      { name: "Pella", coords: [22.5, 40.7], info: "Punto di partenza della spedizione macedone" },
      { name: "Alessandria d'Egitto", coords: [29.9, 31.2], info: "Capitale culturale ed economica dell'età ellenistica" },
      { name: "Babilonia", coords: [44.4, 32.5], info: "Capitale asiatica dove morì Alessandro nel 323 a.C." }
    ]
  },
  {
    yearLabel: "117 d.C.",
    title: "Massima Espansione dell'Impero Romano (Traiano)",
    era: "antica",
    eraLabel: "Età Antica",
    geoUrl: HIST_BASE_URL + "world_100.geojson",
    center: [16, 40],
    zoom: 3.2,
    lessonUrl: "index.html?lezione=1.12",
    lessonText: "📖 Vai alla Lezione 1.12",
    description: "Sotto l'imperatore Traiano Roma raggiunge la sua massima estensione territoriale, controllando il Mediterraneo dalla Britannia alla Mesopotamia.",
    regions: [
      { match: ["roman"], name: "Impero Romano (Pax Romana)", color: "#ef4444" }
    ],
    markers: [
      { name: "Roma", coords: [12.5, 41.9], info: "Centro politico e giuridico dell'Impero" },
      { name: "Londinium", coords: [-0.1, 51.5], info: "Avamposto settentrionale in Britannia" },
      { name: "Ctesifonte", coords: [44.5, 33.1], info: "Limite orientale raggiunto da Traiano" }
    ]
  },
  {
    yearLabel: "476 d.C.",
    title: "Caduta dell'Occidente e Regni Romano-Barbarici",
    era: "antica",
    eraLabel: "Età Antica",
    geoUrl: HIST_BASE_URL + "world_400.geojson",
    center: [16, 43],
    zoom: 3.1,
    lessonUrl: "index.html?lezione=1.15",
    lessonText: "📖 Vai alla Lezione 1.15",
    description: "Con la deposizione di Romolo Augustolo nel 476 d.C. tramonta l'Impero Romano d'Occidente e si affermano i Regni Romano-Barbarici, mentre l'Oriente prosegue a Costantinopoli.",
    regions: [
      { match: ["western roman", "visigoth", "ostrogoth", "vandal", "frank"], name: "Occidente e Regni Romano-Barbarici", color: "#f59e0b" },
      { match: ["eastern roman", "byzantine"], name: "Impero Romano d'Oriente", color: "#a855f7" }
    ],
    markers: [
      { name: "Ravenna", coords: [12.2, 44.4], info: "Ultima capitale dell'Impero Romano d'Occidente" },
      { name: "Costantinopoli", coords: [28.9, 41.0], info: "Capitale dell'Impero d'Oriente" }
    ]
  },
  {
    yearLabel: "800 d.C.",
    title: "Il Sacro Romano Impero di Carlo Magno",
    era: "medievale",
    eraLabel: "Età Medievale",
    geoUrl: HIST_BASE_URL + "world_800.geojson",
    center: [12, 46],
    zoom: 3.3,
    lessonUrl: "index.html?epoca=medievale#percorsi",
    lessonText: "📖 Esplora Età Medievale",
    description: "Nella notte di Natale dell'800 Carlo Magno viene incoronato imperatore: nasce il Sacro Romano Impero, che unifica gran parte dell'Europa centro-occidentale.",
    regions: [
      { match: ["frank", "carolingian"], name: "Impero Carolingio", color: "#facc15" },
      { match: ["byzantine"], name: "Impero Bizantino", color: "#a855f7" },
      { match: ["abbasid", "umayyad", "andalus"], name: "Mondo Islamico", color: "#22c55e" }
    ],
    markers: [
      { name: "Aquisgrana", coords: [6.08, 50.77], info: "Sede della corte di Carlo Magno" },
      { name: "Roma", coords: [12.5, 41.9], info: "Incoronazione imperiale dell'800" }
    ]
  },
  {
    yearLabel: "1348",
    title: "Commerci Mediterranei e la Peste Nera",
    era: "medievale",
    eraLabel: "Età Medievale",
    geoUrl: HIST_BASE_URL + "world_1300.geojson",
    center: [18, 43],
    zoom: 3.1,
    lessonUrl: "index.html?epoca=medievale#percorsi",
    lessonText: "📖 Esplora Età Medievale",
    description: "Lungo le rotte commerciali tra Mar Nero, Mediterraneo ed Europa si diffonde la Peste Nera del 1347-1348, con profonde conseguenze demografiche ed economiche.",
    regions: [
      { match: ["venice", "genoa", "france", "england", "holy roman", "castile", "aragon", "byzantine"], name: "Aree Europee e Mediterranee", color: "#ef4444" }
    ],
    markers: [
      { name: "Caffa", coords: [35.3, 45.0], info: "Scoglio commerciale sul Mar Nero legato alla diffusione del contagio" },
      { name: "Venezia & Genova", coords: [12.3, 45.4], info: "Grandi rotte marittime del Basso Medioevo" }
    ]
  },
  {
    yearLabel: "1492",
    title: "Scoperte Geografiche ed Espansione Atlantica",
    era: "moderna",
    eraLabel: "Età Moderna",
    geoUrl: HIST_BASE_URL + "world_1492.geojson",
    center: [-25, 22],
    zoom: 2.1,
    lessonUrl: "index.html?epoca=moderna#percorsi",
    lessonText: "📖 Esplora Età Moderna",
    description: "Con i viaggi di Cristoforo Colombo e Vasco da Gama il baricentro economico mondiale si sposta dal Mediterraneo all'Oceano Atlantico.",
    regions: [
      { match: ["spain", "castile", "aragon"], name: "Corona di Spagna", color: "#f59e0b" },
      { match: ["portugal"], name: "Regno del Portogallo", color: "#22c55e" },
      { match: ["ottoman"], name: "Impero Ottomano", color: "#ef4444" }
    ],
    markers: [
      { name: "Siviglia & Lisbona", coords: [-6.0, 37.3], info: "Porti principali delle esplorazioni atlantiche" },
      { name: "San Salvador", coords: [-74.5, 24.0], info: "Primo approdo di Colombo nell'ottobre 1492" }
    ]
  },
  {
    yearLabel: "1815",
    title: "L'Europa dopo Napoleone e il Congresso di Vienna",
    era: "moderna",
    eraLabel: "Età Moderna",
    geoUrl: HIST_BASE_URL + "world_1815.geojson",
    center: [14, 48],
    zoom: 3.2,
    lessonUrl: "index.html?epoca=moderna#percorsi",
    lessonText: "📖 Esplora Età Moderna",
    description: "Dopo la sconfitta di Napoleone, le potenze europee ridisegnano l'assetto continentale al Congresso di Vienna inaugurando l'età della Restaurazione.",
    regions: [
      { match: ["austrian", "prussia", "russian", "france", "united kingdom", "britain"], name: "Grandi Potenze Europee", color: "#3b82f6" },
      { match: ["italy", "sardinia", "papal", "two sicilies"], name: "Stati della Penisola Italiana", color: "#facc15" }
    ],
    markers: [
      { name: "Vienna", coords: [16.37, 48.2], info: "Sede del Congresso (1814-1815)" },
      { name: "Waterloo", coords: [4.4, 50.68], info: "Sconfitta definitiva di Napoleone nel 1815" }
    ]
  },
  {
    yearLabel: "1914",
    title: "La Prima Guerra Mondiale: Alleanze in Campo",
    era: "contemporanea",
    eraLabel: "Età Contemporanea",
    geoUrl: HIST_BASE_URL + "world_1914.geojson",
    center: [16, 48],
    zoom: 3.0,
    lessonUrl: "index.html?epoca=contemporanea#percorsi",
    lessonText: "📖 Esplora Età Contemporanea",
    description: "Nell'estate del 1914 il sistema delle alleanze trasforma una crisi balcanica in un conflitto globale tra Intesa e Imperi Centrali.",
    regions: [
      { match: ["france", "united kingdom", "britain", "russia", "serbia", "belgium"], name: "Intesa e Alleati Iniziali", color: "#3b82f6" },
      { match: ["german", "austria", "ottoman"], name: "Imperi Centrali", color: "#ef4444" }
    ],
    markers: [
      { name: "Sarajevo", coords: [18.4, 43.85], info: "Attentato del 28 giugno 1914 che fa scattare la crisi" },
      { name: "Berlino", coords: [13.4, 52.52], info: "Centro dell'Impero Tedesco" }
    ]
  },
  {
    yearLabel: "1945",
    title: "Fine della Seconda Guerra Mondiale e Nuovo Assetto",
    era: "contemporanea",
    eraLabel: "Età Contemporanea",
    geoUrl: HIST_BASE_URL + "world_1945.geojson",
    center: [15, 42],
    zoom: 2.3,
    lessonUrl: "index.html?epoca=contemporanea#percorsi",
    lessonText: "📖 Esplora Età Contemporanea",
    description: "Con la fine del conflitto nel 1945 si chiude l'epoca dei regimi fascisti e nazisti in Europa e si aprono i nuovi equilibri mondiali.",
    regions: [
      { match: ["united states", "america", "united kingdom", "britain", "france", "italy"], name: "Alleati Occidentali", color: "#3b82f6" },
      { match: ["soviet", "ussr", "russia"], name: "Unione Sovietica", color: "#ef4444" }
    ],
    markers: [
      { name: "Berlino", coords: [13.4, 52.52], info: "Punto simbolico della fine della guerra in Europa" },
      { name: "Yalta", coords: [34.16, 44.49], info: "Conferenza sul dopoguerra (febbraio 1945)" }
    ]
  },
  {
    yearLabel: "1992",
    title: "Nascita dell'Unione Europea (Trattato di Maastricht)",
    era: "contemporanea",
    eraLabel: "Età Contemporanea",
    geoUrl: HIST_BASE_URL + "world_1994.geojson",
    center: [12, 49],
    zoom: 3.3,
    lessonUrl: "index.html?epoca=contemporanea#percorsi",
    lessonText: "📖 Esplora Età Contemporanea",
    description: "Dopo la fine della Guerra Fredda, il Trattato di Maastricht del 1992 segna una tappa decisiva nell'integrazione europea.",
    regions: [
      { match: ["italy", "france", "germany", "spain", "portugal", "belgium", "netherlands", "luxembourg", "ireland", "united kingdom", "britain", "denmark", "greece"], name: "Paesi Europei Protagonisti", color: "#facc15" }
    ],
    markers: [
      { name: "Maastricht", coords: [5.69, 50.85], info: "Firma del Trattato istitutivo dell'Unione Europea (1992)" },
      { name: "Bruxelles", coords: [4.35, 50.85], info: "Cuore istituzionale europeo" }
    ]
  }
];

let filteredStages = [...HISTORICAL_STAGES];
let currentStageIdx = 0;
let playTimer = null;

let d3Svg = null;
let d3Projection = null;
let d3Path = null;
let d3Zoom = null;
let landLayer = null;
let historicalLayer = null;
let markersLayer = null;
let currentZoomK = 1;
const geoCache = new Map();

document.addEventListener("DOMContentLoaded", async () => {
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
    .scale(width / 5.2)
    .translate([width / 2, height / 2]);

  d3Path = d3.geoPath().projection(d3Projection);

  const mapGroup = d3Svg.append("g").attr("class", "map-zoom-layer");
  landLayer = mapGroup.append("g").attr("class", "land-layer");
  historicalLayer = mapGroup.append("g").attr("class", "historical-layer");
  markersLayer = mapGroup.append("g").attr("class", "markers-layer");

  d3Zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      currentZoomK = event.transform.k || 1;
      mapGroup.attr("transform", event.transform);

      landLayer.selectAll("path").attr("stroke-width", 0.7 / currentZoomK);
      historicalLayer.selectAll("path").attr("stroke-width", 1.3 / currentZoomK);
      markersLayer.selectAll("g.hist-marker").attr("transform", d => {
        const coords = d3Projection(d.coords);
        if (!coords) return "";
        return `translate(${coords[0]}, ${coords[1]}) scale(${1 / currentZoomK})`;
      });
    });

  d3Svg.call(d3Zoom);

  try {
    const landData = await d3.json(LAND_BASE_URL);
    landLayer.selectAll("path")
      .data(landData.features || [])
      .enter()
      .append("path")
      .attr("d", d3Path)
      .attr("fill", "#27303f")
      .attr("stroke", "#475569")
      .attr("stroke-width", 0.7);
  } catch (err) {
    console.warn("Sfondo terre emerse non caricato:", err);
  }

  renderTimelinePills();
  selectTimelineIndex(0);
});

function setMapStatus(text) {
  const badge = document.getElementById("mapStatusBadge");
  if (badge) badge.textContent = text;
}

function getFeatureLabel(feat) {
  const p = feat.properties || {};
  return p.NAME || p.name || p.SUBJECTO || p.PARTOF || p.FORM || "";
}

function renderTimelinePills() {
  const row = document.getElementById("timelinePillsRow");
  const slider = document.getElementById("timelineSlider");
  if (!row || !slider) return;

  slider.max = String(Math.max(0, filteredStages.length - 1));
  row.innerHTML = filteredStages.map((st, i) => `
    <button type="button" class="step-pill ${i === currentStageIdx ? "active" : ""}" onclick="selectTimelineIndex(${i})">
      ${st.yearLabel}
    </button>
  `).join("");
}

function filterTimelineEra(era, btn) {
  stopTimelinePlayback();
  document.querySelectorAll("#eraFilterBar .era-filter-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  filteredStages = era === "all"
    ? [...HISTORICAL_STAGES]
    : HISTORICAL_STAGES.filter(s => s.era === era);

  currentStageIdx = 0;
  renderTimelinePills();
  if (filteredStages.length > 0) {
    selectTimelineIndex(0);
  } else {
    document.getElementById("timelineYearTitle").textContent = "Nessuna tappa per questa epoca";
    document.getElementById("timelineDetailDesc").textContent = "Seleziona 'Tutte le Epoche' oppure aggiungi nuove tappe per questo periodo.";
    if (historicalLayer) historicalLayer.selectAll("*").remove();
    if (markersLayer) markersLayer.selectAll("*").remove();
  }
}

async function selectTimelineIndex(idx) {
  if (idx < 0 || idx >= filteredStages.length) return;
  currentStageIdx = idx;
  const stage = filteredStages[idx];

  const slider = document.getElementById("timelineSlider");
  if (slider) slider.value = String(idx);

  document.querySelectorAll("#timelinePillsRow .step-pill").forEach((pill, i) => {
    pill.classList.toggle("active", i === idx);
  });

  document.getElementById("timelineEraBadge").textContent = stage.eraLabel;
  document.getElementById("timelineYearTitle").textContent = `${stage.yearLabel} — ${stage.title}`;
  document.getElementById("timelineDetailDesc").textContent = stage.description;

  const lessonLink = document.getElementById("timelineLessonLink");
  if (lessonLink) {
    lessonLink.href = stage.lessonUrl;
    lessonLink.textContent = stage.lessonText;
  }

  const legendEl = document.getElementById("timelineLegend");
  if (legendEl) {
    legendEl.innerHTML = stage.regions.map(r => `
      <span style="display: inline-flex; align-items: center; gap: 7px; background: #121418; padding: 6px 11px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.12); color: #f5f6f8;">
        <span style="width: 12px; height: 12px; border-radius: 3px; background: ${r.color}; display: inline-block;"></span>
        ${r.name}
      </span>
    `).join("");
  }

  await updateMapVisuals(stage);
}

function findMatchedRegion(label, stage) {
  const clean = String(label || "").toLowerCase();
  if (!clean) return null;
  for (const reg of stage.regions) {
    if (reg.match.some(key => clean.includes(key.toLowerCase()))) {
      return reg;
    }
  }
  return null;
}

async function updateMapVisuals(stage) {
  if (!historicalLayer || !markersLayer || !d3Projection) return;

  setMapStatus(`Caricamento carta storica (${stage.yearLabel})...`);

  try {
    if (!geoCache.has(stage.geoUrl)) {
      const data = await d3.json(stage.geoUrl);
      geoCache.set(stage.geoUrl, data);
    }
  } catch (err) {
    console.error("Errore caricamento GeoJSON storico:", err);
    setMapStatus("Impossibile caricare il dataset storico remoto");
    return;
  }

  const geoData = geoCache.get(stage.geoUrl);
  const features = geoData.features || [];
  const tooltip = document.getElementById("mapHoverTooltip");

  historicalLayer.selectAll("*").remove();

  historicalLayer.selectAll("path")
    .data(features)
    .enter()
    .append("path")
    .attr("d", d3Path)
    .attr("fill", d => {
      const matched = findMatchedRegion(getFeatureLabel(d), stage);
      return matched ? matched.color : "#3b4659";
    })
    .attr("fill-opacity", d => {
      const matched = findMatchedRegion(getFeatureLabel(d), stage);
      return matched ? 0.85 : 0.35;
    })
    .attr("stroke", d => {
      const matched = findMatchedRegion(getFeatureLabel(d), stage);
      return matched ? "#fef08a" : "#64748b";
    })
    .attr("stroke-width", 1.2)
    .style("cursor", "pointer")
    .on("mousemove", (event, d) => {
      const rawName = getFeatureLabel(d);
      const matched = findMatchedRegion(rawName, stage);
      if (!tooltip) return;

      const labelText = matched
        ? `<strong style="color:${matched.color};">${matched.name}</strong>${rawName ? `<br><span style="color:#cbd5e1;font-size:0.78rem;">Fonte: ${rawName}</span>` : ""}`
        : `<strong>${rawName || "Entità storica"}</strong>`;

      tooltip.style.display = "block";
      tooltip.style.left = `${event.offsetX + 12}px`;
      tooltip.style.top = `${event.offsetY - 34}px`;
      tooltip.innerHTML = labelText;
    })
    .on("mouseleave", () => {
      if (tooltip) tooltip.style.display = "none";
    });

  const container = document.getElementById("historicalMapCanvas");
  const w = container.clientWidth || 900;
  const h = container.clientHeight || 490;
  const centerProj = d3Projection(stage.center) || [w / 2, h / 2];
  const [cx, cy] = centerProj;
  const k = stage.zoom || 2.5;

  markersLayer.selectAll("*").remove();

  const markerGroups = markersLayer.selectAll("g.hist-marker")
    .data(stage.markers)
    .enter()
    .append("g")
    .attr("class", "hist-marker")
    .attr("transform", d => {
      const p = d3Projection(d.coords);
      if (!p) return "";
      return `translate(${p[0]}, ${p[1]}) scale(${1 / k})`;
    })
    .style("cursor", "pointer");

  markerGroups.append("circle")
    .attr("r", 6)
    .attr("fill", "#fef08a")
    .attr("stroke", "#121418")
    .attr("stroke-width", 2);

  markerGroups.append("text")
    .attr("x", 10)
    .attr("y", 4)
    .text(d => d.name)
    .attr("fill", "#ffffff")
    .attr("font-size", "12.5px")
    .attr("font-weight", "700")
    .style("paint-order", "stroke")
    .style("stroke", "#0b0e14")
    .style("stroke-width", "3.5px");

  markerGroups.on("mousemove", (event, d) => {
    if (!tooltip) return;
    tooltip.style.display = "block";
    tooltip.style.left = `${event.offsetX + 12}px`;
    tooltip.style.top = `${event.offsetY - 38}px`;
    tooltip.innerHTML = `<strong style="color:#facc15;">${d.name}</strong><br>${d.info}`;
  }).on("mouseleave", () => {
    if (tooltip) tooltip.style.display = "none";
  });

  d3Svg.transition()
    .duration(800)
    .call(
      d3Zoom.transform,
      d3.zoomIdentity.translate(w / 2 - cx * k, h / 2 - cy * k).scale(k)
    );

  setMapStatus(`Epoca storica: ${stage.yearLabel}`);
}

function stepTimeline(delta) {
  stopTimelinePlayback();
  if (!filteredStages.length) return;
  const next = (currentStageIdx + delta + filteredStages.length) % filteredStages.length;
  selectTimelineIndex(next);
}

function toggleTimelinePlayback() {
  const btn = document.getElementById("btnTimelinePlay");
  if (playTimer) {
    stopTimelinePlayback();
    return;
  }
  if (!filteredStages.length) return;
  if (btn) btn.textContent = "⏸ Pausa";
  playTimer = setInterval(() => {
    const next = (currentStageIdx + 1) % filteredStages.length;
    selectTimelineIndex(next);
  }, 3200);
}

function stopTimelinePlayback() {
  if (playTimer) {
    clearInterval(playTimer);
    playTimer = null;
  }
  const btn = document.getElementById("btnTimelinePlay");
  if (btn) btn.textContent = "▶ Play";
}

function resetHistoricalMapZoom() {
  selectTimelineIndex(currentStageIdx);
}
