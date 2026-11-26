// === MOTORE MAPPE STORICHE ANIMATE (D3.js + TopoJSON) ===

const HISTORICAL_STAGES = [
  {
    yearLabel: "3000 a.C.",
    title: "Prime Civiltà Fluviali (Mesopotamia ed Egitto)",
    era: "antica",
    eraLabel: "Età Antica",
    center: [36, 30],
    zoom: 3.4,
    lessonUrl: "lezioni/1.1.html",
    lessonText: "📖 Vai alla Lezione 1.1",
    description: "Lungo le valli del Tigri, dell'Eufrate e del Nilo nascono le prime città-stato, la scrittura cuneiforme e geroglifica, i sistemi di irrigazione e le prime monarchie teocratiche.",
    regions: [
      { ids: ["368", "760"], name: "Civiltà Mesopotamiche (Sumeri)", color: "#d4af37" },
      { ids: ["818"], name: "Antico Egitto dei Faraoni", color: "#e67e22" }
    ],
    markers: [
      { name: "Ur e Uruk (Sumeri)", coords: [45.6, 31.3], info: "Culla della scrittura cuneiforme e delle Ziggurat" },
      { name: "Menfi e Tebe (Egitto)", coords: [31.2, 29.8], info: "Centro del Regno dei Faraoni lungo il Nilo" }
    ]
  },
  {
    yearLabel: "480 a.C.",
    title: "Grecia Classica e Impero Persiano",
    era: "antica",
    eraLabel: "Età Antica",
    center: [34, 35],
    zoom: 3.2,
    lessonUrl: "lezioni/1.6.html",
    lessonText: "📖 Vai alla Lezione 1.6",
    description: "Le poleis greche guidate da Atene e Sparta respingono l'espansione dell'immenso Impero Persiano Achemenide nelle battaglie di Maratona, Termopili e Salamina.",
    regions: [
      { ids: ["300"], name: "Poleis Greche (Atene e Sparta)", color: "#3b82f6" },
      { ids: ["364", "368", "792", "760", "818"], name: "Impero Persiano Achemenide", color: "#d4af37" }
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
    center: [45, 33],
    zoom: 2.7,
    lessonUrl: "lezioni/1.7.html",
    lessonText: "📖 Vai alla Lezione 1.7",
    description: "In poco più di dieci anni Alessandro Magno conquista l'intero Impero Persiano fino ai confini dell'India, diffondendo la lingua e la cultura greca in tutto il Mediterraneo orientale.",
    regions: [
      { ids: ["300", "807", "100", "792", "760", "368", "818", "364", "004", "586"], name: "Impero di Alessandro Magno", color: "#d4af37" }
    ],
    markers: [
      { name: "Pella (Macedonia)", coords: [22.5, 40.7], info: "Punto di partenza della spedizione macedone" },
      { name: "Alessandria d'Egitto", coords: [29.9, 31.2], info: "Capitale culturale ed economica dell'età ellenistica" },
      { name: "Babilonia", coords: [44.4, 32.5], info: "Capitale asiatica dove morì Alessandro nel 323 a.C." }
    ]
  },
  {
    yearLabel: "117 d.C.",
    title: "Massima Espansione dell'Impero Romano (Traiano)",
    era: "antica",
    eraLabel: "Età Antica",
    center: [16, 41],
    zoom: 2.7,
    lessonUrl: "lezioni/1.12.html",
    lessonText: "📖 Vai alla Lezione 1.12",
    description: "Sotto l'imperatore Traiano Roma raggiunge la sua massima estensione territoriale, controllando l'intero bacino del Mediterraneo (Mare Nostrum) dalla Britannia alla Mesopotamia.",
    regions: [
      { ids: ["380", "250", "724", "620", "826", "056", "528", "756", "040", "348", "642", "100", "300", "792", "760", "368", "818", "434", "788", "012", "504", "191", "688"], name: "Impero Romano (Pax Romana)", color: "#dc2626" }
    ],
    markers: [
      { name: "Roma (Caput Mundi)", coords: [12.5, 41.9], info: "Centro politico, giuridico e monumentale dell'Impero" },
      { name: "Londinium (Britannia)", coords: [-0.1, 51.5], info: "Avamposto settentrionale dell'Impero" },
      { name: "Ctesifonte", coords: [44.5, 33.1], info: "Limite orientale raggiunto da Traiano nel 116 d.C." }
    ]
  },
  {
    yearLabel: "476 d.C.",
    title: "Caduta dell'Occidente e Regni Romano-Barbarici",
    era: "antica",
    eraLabel: "Età Antica",
    center: [15, 43],
    zoom: 2.8,
    lessonUrl: "lezioni/1.15.html",
    lessonText: "📖 Vai alla Lezione 1.15",
    description: "Con la deposizione di Romolo Augustolo nel 476 d.C. crolla l'Impero Romano d'Occidente, sostituito dai Regni Romano-Barbarici, mentre l'Impero d'Oriente sopravvive a Costantinopoli.",
    regions: [
      { ids: ["380", "250", "724", "620", "012", "788"], name: "Regni Romano-Barbarici (Occidente)", color: "#f59e0b" },
      { ids: ["300", "100", "792", "760", "818"], name: "Impero Romano d'Oriente (Bizantino)", color: "#8b5cf6" }
    ],
    markers: [
      { name: "Ravenna", coords: [12.2, 44.4], info: "Ultima capitale dell'Impero Romano d'Occidente" },
      { name: "Costantinopoli", coords: [28.9, 41.0], info: "Capitale dell'Impero Romano d'Oriente" }
    ]
  },
  {
    yearLabel: "800 d.C.",
    title: "Il Sacro Romano Impero di Carlo Magno",
    era: "medievale",
    eraLabel: "Età Medievale",
    center: [10, 46],
    zoom: 3.1,
    lessonUrl: "index.html#percorsi",
    lessonText: "📖 Esplora Età Medievale",
    description: "Nella notte di Natale dell'800 Papa Leone III incorona Carlo Magno imperatore: nasce il Sacro Romano Impero, che unifica gran parte dell'Europa centro-occidentale sotto il sistema feudale.",
    regions: [
      { ids: ["250", "276", "056", "528", "756", "040", "380"], name: "Sacro Romano Impero Carolingio", color: "#d4af37" },
      { ids: ["724", "620"], name: "Al-Andalus (Califfato Omayyade)", color: "#10b981" },
      { ids: ["300", "792"], name: "Impero Bizantino", color: "#8b5cf6" }
    ],
    markers: [
      { name: "Aquisgrana", coords: [6.08, 50.77], info: "Capitale e sede della corte di Carlo Magno" },
      { name: "Roma", coords: [12.5, 41.9], info: "Sede del Papato e dell'incoronazione imperiale dell'800" }
    ]
  },
  {
    yearLabel: "1348",
    title: "Commerci Mediterranei e la Peste Nera",
    era: "medievale",
    eraLabel: "Età Medievale",
    center: [18, 43],
    zoom: 2.9,
    lessonUrl: "index.html#percorsi",
    lessonText: "📖 Esplora Età Medievale",
    description: "Le Repubbliche Marinare italiane dominano le rotte commerciali tra Oriente e Occidente, ma proprio lungo le vie carovaniere e marittime si diffonde la Peste Nera del 1347-1348.",
    regions: [
      { ids: ["380", "250", "724", "826", "276", "300", "792"], name: "Area colpita dalla Peste Nera e dalle rotte mercantili", color: "#ef4444" }
    ],
    markers: [
      { name: "Caffa (Crimea)", coords: [35.3, 45.0], info: "Colonia genovese da cui partì il contagio via mare" },
      { name: "Venezia & Genova", coords: [12.3, 45.4], info: "Grandi potenze navali e commerciali del Basso Medioevo" }
    ]
  },
  {
    yearLabel: "1492",
    title: "Scoperte Geografiche ed Espansione Atlantica",
    era: "moderna",
    eraLabel: "Età Moderna",
    center: [-30, 22],
    zoom: 1.7,
    lessonUrl: "index.html#percorsi",
    lessonText: "📖 Esplora Età Moderna",
    description: "Con i viaggi di Cristoforo Colombo e Vasco da Gama il baricentro economico mondiale si sposta dal Mediterraneo all'Oceano Atlantico, dando inizio agli imperi coloniali europei.",
    regions: [
      { ids: ["724", "484", "604", "170", "032"], name: "Sfera d'influenza Spagnola (Trattato di Tordesillas)", color: "#f59e0b" },
      { ids: ["620", "076", "024", "356"], name: "Rotte e basi Portoghesi", color: "#10b981" }
    ],
    markers: [
      { name: "Siviglia & Lisbona", coords: [-6.0, 37.3], info: "Porti principali delle esplorazioni atlantiche" },
      { name: "San Salvador (Caraibi)", coords: [-74.5, 24.0], info: "Primo approdo di Cristoforo Colombo il 12 ottobre 1492" }
    ]
  },
  {
    yearLabel: "1815",
    title: "L'Europa dopo Napoleone e il Congresso di Vienna",
    era: "moderna",
    eraLabel: "Età Moderna",
    center: [14, 48],
    zoom: 2.9,
    lessonUrl: "index.html#percorsi",
    lessonText: "📖 Esplora Età Moderna",
    description: "Dopo la sconfitta di Napoleone a Waterloo, le grandi potenze europee ridisegnano i confini al Congresso di Vienna secondo i principi di legittimità ed equilibrio.",
    regions: [
      { ids: ["250", "826", "040", "276", "643"], name: "Grandi Potenze del Congresso di Vienna", color: "#3b82f6" },
      { ids: ["380"], name: "Italia frammentata post-Restaurazione", color: "#d4af37" }
    ],
    markers: [
      { name: "Vienna", coords: [16.37, 48.2], info: "Sede del Congresso (1814-1815) e della Restaurazione" },
      { name: "Waterloo", coords: [4.4, 50.68], info: "Sconfitta definitiva di Napoleone Bonaparte (1815)" }
    ]
  },
  {
    yearLabel: "1914",
    title: "La Prima Guerra Mondiale (Alleanze in Campo)",
    era: "contemporanea",
    eraLabel: "Età Contemporanea",
    center: [16, 48],
    zoom: 2.8,
    lessonUrl: "index.html#percorsi",
    lessonText: "📖 Esplora Età Contemporanea",
    description: "L'attentato di Sarajevo innesca il sistema delle alleanze europee: la Triplice Intesa affronta gli Imperi Centrali in un conflitto mondiale di logoramento.",
    regions: [
      { ids: ["250", "826", "643", "380", "688"], name: "Triplice Intesa e Alleati", color: "#3b82f6" },
      { ids: ["276", "040", "348", "792", "100"], name: "Imperi Centrali", color: "#ef4444" }
    ],
    markers: [
      { name: "Sarajevo", coords: [18.4, 43.85], info: "Attentato all'arciduca Francesco Ferdinando (28 giugno 1914)" },
      { name: "Fronte Occidentale (Verdun)", coords: [5.38, 49.16], info: "Simbolo della guerra di trincea" }
    ]
  },
  {
    yearLabel: "1945",
    title: "Fine della Seconda Guerra Mondiale e Guerra Fredda",
    era: "contemporanea",
    eraLabel: "Età Contemporanea",
    center: [15, 38],
    zoom: 1.6,
    lessonUrl: "index.html#percorsi",
    lessonText: "📖 Esplora Età Contemporanea",
    description: "Con la sconfitta delle potenze dell'Asse nel 1945 il mondo si divide in due blocchi contrapposti guidati da Stati Uniti e Unione Sovietica.",
    regions: [
      { ids: ["840", "826", "250", "380", "276", "392"], name: "Blocco Occidentale (USA e Alleati)", color: "#3b82f6" },
      { ids: ["643", "616", "642", "100", "348", "203"], name: "Blocco Sovietico (URSS e Patto di Varsavia)", color: "#dc2626" }
    ],
    markers: [
      { name: "Berlino", coords: [13.4, 52.52], info: "Simbolo della divisione dell'Europa in due blocchi" },
      { name: "Yalta (Crimea)", coords: [34.16, 44.49], info: "Conferenza sul nuovo assetto geopolitico post-bellico" }
    ]
  },
  {
    yearLabel: "1992",
    title: "Nascita dell'Unione Europea (Trattato di Maastricht)",
    era: "contemporanea",
    eraLabel: "Età Contemporanea",
    center: [12, 49],
    zoom: 3.1,
    lessonUrl: "index.html#percorsi",
    lessonText: "📖 Esplora Età Contemporanea",
    description: "Dopo il crollo del Muro di Berlino e la fine dell'URSS, il Trattato di Maastricht getta le basi dell'Unione Europea e della moneta unica.",
    regions: [
      { ids: ["380", "250", "276", "724", "620", "056", "528", "442", "372", "826", "208", "300"], name: "Paesi firmatari del Trattato di Maastricht", color: "#d4af37" }
    ],
    markers: [
      { name: "Maastricht", coords: [5.69, 50.85], info: "Firma del Trattato istitutivo dell'Unione Europea (1992)" },
      { name: "Bruxelles", coords: [4.35, 50.85], info: "Sede delle principali istituzioni europee" }
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
let countriesLayer = null;
let markersLayer = null;

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("historicalMapCanvas");
  if (!container || typeof d3 === "undefined" || typeof topojson === "undefined") return;

  const width = container.clientWidth || 900;
  const height = container.clientHeight || 460;

  d3Svg = d3.select("#historicalMapCanvas")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`);

  d3Projection = d3.geoNaturalEarth1()
    .scale(width / 5.4)
    .translate([width / 2, height / 2]);

  d3Path = d3.geoPath().projection(d3Projection);

  const mapGroup = d3Svg.append("g").attr("class", "map-zoom-layer");
  countriesLayer = mapGroup.append("g").attr("class", "countries-layer");
  markersLayer = mapGroup.append("g").attr("class", "markers-layer");

  d3Zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      mapGroup.attr("transform", event.transform);
    });

  d3Svg.call(d3Zoom);

  try {
    const worldData = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
    const countries = topojson.feature(worldData, worldData.objects.countries).features;

    countriesLayer.selectAll("path")
      .data(countries)
      .enter()
      .append("path")
      .attr("d", d3Path)
      .attr("fill", "#222733")
      .attr("stroke", "#374151")
      .attr("stroke-width", 0.6)
      .style("transition", "fill 0.45s ease");
  } catch (err) {
    console.error("Errore caricamento mappa:", err);
  }

  renderTimelinePills();
  selectTimelineIndex(0);
});

function renderTimelinePills() {
  const row = document.getElementById("timelinePillsRow");
  const slider = document.getElementById("timelineSlider");
  if (!row || !slider) return;

  slider.max = String(filteredStages.length - 1);
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
  selectTimelineIndex(0);
}

function selectTimelineIndex(idx) {
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

  // Aggiorna legenda
  const legendEl = document.getElementById("timelineLegend");
  if (legendEl) {
    legendEl.innerHTML = stage.regions.map(r => `
      <span style="display: inline-flex; align-items: center; gap: 6px; background: #121418; padding: 5px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);">
        <span style="width: 11px; height: 11px; border-radius: 3px; background: ${r.color}; display: inline-block;"></span>
        ${r.name}
      </span>
    `).join("");
  }

  updateMapVisuals(stage);
}

function updateMapVisuals(stage) {
  if (!countriesLayer || !markersLayer || !d3Projection) return;

  // Mappa ID paese -> colore e nome impero
  const regionLookup = new Map();
  stage.regions.forEach(reg => {
    reg.ids.forEach(id => regionLookup.set(String(id).padStart(3, "0"), reg));
  });

  const tooltip = document.getElementById("mapHoverTooltip");

  countriesLayer.selectAll("path")
    .attr("fill", d => {
      const code = String(d.id).padStart(3, "0");
      return regionLookup.has(code) ? regionLookup.get(code).color : "#222733";
    })
    .attr("fill-opacity", d => {
      const code = String(d.id).padStart(3, "0");
      return regionLookup.has(code) ? 0.78 : 1;
    })
    .on("mousemove", (event, d) => {
      const code = String(d.id).padStart(3, "0");
      const info = regionLookup.get(code);
      if (info && tooltip) {
        tooltip.style.display = "block";
        tooltip.style.left = `${event.offsetX + 12}px`;
        tooltip.style.top = `${event.offsetY - 28}px`;
        tooltip.innerHTML = `<strong>${info.name}</strong>`;
      } else if (tooltip) {
        tooltip.style.display = "none";
      }
    })
    .on("mouseleave", () => {
      if (tooltip) tooltip.style.display = "none";
    });

  // Aggiorna marcatori eventi/capitali
  markersLayer.selectAll("*").remove();

  const markerGroups = markersLayer.selectAll("g.hist-marker")
    .data(stage.markers)
    .enter()
    .append("g")
    .attr("class", "hist-marker")
    .attr("transform", d => {
      const [x, y] = d3Projection(d.coords);
      return `translate(${x}, ${y})`;
    })
    .style("cursor", "pointer");

  markerGroups.append("circle")
    .attr("r", 6)
    .attr("fill", "#f3e5ab")
    .attr("stroke", "#121418")
    .attr("stroke-width", 2);

  markerGroups.append("text")
    .attr("x", 9)
    .attr("y", 4)
    .text(d => d.name)
    .attr("fill", "#f5f6f8")
    .attr("font-size", "11px")
    .attr("font-weight", "600")
    .style("text-shadow", "0 1px 4px #000");

  markerGroups.on("mousemove", (event, d) => {
    if (!tooltip) return;
    tooltip.style.display = "block";
    tooltip.style.left = `${event.offsetX + 12}px`;
    tooltip.style.top = `${event.offsetY - 36}px`;
    tooltip.innerHTML = `<strong style="color:#d4af37;">${d.name}</strong><br>${d.info}`;
  }).on("mouseleave", () => {
    if (tooltip) tooltip.style.display = "none";
  });

  // Zoom animato fluido verso l'area protagonista dell'epoca
  const container = document.getElementById("historicalMapCanvas");
  const w = container.clientWidth || 900;
  const h = container.clientHeight || 460;
  const [cx, cy] = d3Projection(stage.center);
  const k = stage.zoom || 2.5;

  d3Svg.transition()
    .duration(850)
    .call(
      d3Zoom.transform,
      d3.zoomIdentity.translate(w / 2 - cx * k, h / 2 - cy * k).scale(k)
    );
}

function stepTimeline(delta) {
  stopTimelinePlayback();
  const next = (currentStageIdx + delta + filteredStages.length) % filteredStages.length;
  selectTimelineIndex(next);
}

function toggleTimelinePlayback() {
  const btn = document.getElementById("btnTimelinePlay");
  if (playTimer) {
    stopTimelinePlayback();
    return;
  }
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
