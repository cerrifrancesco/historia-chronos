let currentContinentFilter = null; // null = schermata iniziale
let currentAmericasSubFilter = 'all';
let currenciesMapInitialized = false;

function normalizeText(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function getCardHighlightTag(nation) {
  if (nation.region && nation.region.includes('/')) {
    return nation.region.split('/').pop().trim();
  }
  if (nation.region) return nation.region.trim();
  if (nation.language) return nation.language.split(',')[0].trim();
  return nation.continent;
}

function sortNationsAlphabetically(list) {
  return [...list].sort((a, b) =>
    (a.name || '').localeCompare(b.name || '', 'it', { sensitivity: 'base' })
  );
}

function renderNations(data) {
  const grid = document.getElementById('nationsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const sortedData = sortNationsAlphabetically(data);

  if (!sortedData.length) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 30px;">Nessuna nazione trovata con i filtri selezionati.</div>`;
    return;
  }

  sortedData.forEach(nation => {
    const card = document.createElement('div');
    card.className = 'nation-card';
    card.onclick = () => openNationDetail(nation.id);
    const badgeText = getCardHighlightTag(nation);
    card.innerHTML = `
      <img src="${nation.flagImg}" alt="${nation.name}" class="nation-flag-thumb">
      <div class="nation-info">
        <h4>${nation.name}</h4>
        <span>${nation.continent} • ${nation.capital}</span>
        <div><span class="nation-badge-pill">${badgeText}</span></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function populateSubareaSelect(baseList) {
  const select = document.getElementById('subareaFilterSelect');
  if (!select || !Array.isArray(baseList)) return;
  const previous = select.value;
  const tags = Array.from(new Set(baseList.map(n => getCardHighlightTag(n)).filter(Boolean))).sort();
  select.innerHTML = `<option value="all">Tutte le sotto-aree / lingue (${baseList.length})</option>` +
    tags.map(t => `<option value="${t.replace(/"/g, '&quot;')}">${t}</option>`).join('');
  if (tags.includes(previous)) {
    select.value = previous;
  } else {
    select.value = 'all';
  }
}

const NORTH_AMERICA_IDS = new Set([
  'antigua-e-barbuda', 'bahamas', 'barbados', 'belize', 'canada', 'costa-rica',
  'cuba', 'dominica', 'el-salvador', 'giamaica', 'grenada', 'guatemala',
  'haiti', 'honduras', 'messico', 'nicaragua', 'panama', 'repubblica-dominicana',
  'saint-kitts-e-nevis', 'saint-lucia', 'saint-vincent-e-grenadine',
  'stati-uniti-d-america', 'stati-uniti', 'trinidad-e-tobago'
]);

const SOUTH_AMERICA_IDS = new Set([
  'argentina', 'bolivia', 'brasile', 'cile', 'colombia', 'ecuador',
  'guyana', 'paraguay', 'peru', 'suriname', 'uruguay', 'venezuela'
]);

function getAmericaSubarea(nation) {
  const reg = (nation.region || '').toLowerCase();
  if (reg.includes('settentrionale') || reg.includes('nord') || reg.includes('caraibi') || reg.includes('centrale')) {
    return 'America settentrionale';
  }
  if (reg.includes('meridionale') || reg.includes('sud')) {
    return 'America meridionale';
  }
  const cleanId = (nation.id || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (NORTH_AMERICA_IDS.has(cleanId)) return 'America settentrionale';
  if (SOUTH_AMERICA_IDS.has(cleanId)) return 'America meridionale';
  return 'Americhe';
}

const MAP_NAME_TO_ID = {
  'afghanistan': 'afghanistan',
  'albania': 'albania',
  'algeria': 'algeria',
  'andorra': 'andorra',
  'angola': 'angola',
  'antigua and barbuda': 'antigua-e-barbuda',
  'argentina': 'argentina',
  'armenia': 'armenia',
  'australia': 'australia',
  'austria': 'austria',
  'azerbaijan': 'azerbaigian',
  'bahamas': 'bahamas',
  'bahrain': 'bahrein',
  'bangladesh': 'bangladesh',
  'barbados': 'barbados',
  'belarus': 'bielorussia',
  'belgium': 'belgio',
  'belize': 'belize',
  'benin': 'benin',
  'bhutan': 'bhutan',
  'bolivia': 'bolivia',
  'bosnia and herz.': 'bosnia-erzegovina',
  'bosnia and herzegovina': 'bosnia-erzegovina',
  'botswana': 'botswana',
  'brazil': 'brasile',
  'brunei': 'brunei',
  'bulgaria': 'bulgaria',
  'burkina faso': 'burkina-faso',
  'burundi': 'burundi',
  'cambodia': 'cambogia',
  'cameroon': 'camerun',
  'canada': 'canada',
  'cape verde': 'capo-verde',
  'cabo verde': 'capo-verde',
  'central african rep.': 'repubblica-centrafricana',
  'central african republic': 'repubblica-centrafricana',
  'chad': 'ciad',
  'chile': 'cile',
  'china': 'cina',
  'colombia': 'colombia',
  'comoros': 'comore',
  'congo': 'repubblica-del-congo',
  'dem. rep. congo': 'repubblica-democratica-del-congo',
  'democratic republic of the congo': 'repubblica-democratica-del-congo',
  'costa rica': 'costa-rica',
  'croatia': 'croazia',
  'cuba': 'cuba',
  'cyprus': 'cipro',
  'czechia': 'repubblica-ceca',
  'czech rep.': 'repubblica-ceca',
  'denmark': 'danimarca',
  'djibouti': 'gibuti',
  'dominica': 'dominica',
  'dominican rep.': 'repubblica-dominicana',
  'dominican republic': 'repubblica-dominicana',
  'ecuador': 'ecuador',
  'egypt': 'egitto',
  'el salvador': 'el-salvador',
  'eq. guinea': 'guinea-equatoriale',
  'equatorial guinea': 'guinea-equatoriale',
  'eritrea': 'eritrea',
  'estonia': 'estonia',
  'eswatini': 'eswatini',
  'swaziland': 'eswatini',
  'ethiopia': 'etiopia',
  'fiji': 'figi',
  'finland': 'finlandia',
  'france': 'francia',
  'gabon': 'gabon',
  'gambia': 'gambia',
  'georgia': 'georgia',
  'germany': 'germania',
  'ghana': 'ghana',
  'greece': 'grecia',
  'grenada': 'grenada',
  'guatemala': 'guatemala',
  'guinea': 'guinea',
  'guinea-bissau': 'guinea-bissau',
  'guyana': 'guyana',
  'haiti': 'haiti',
  'honduras': 'honduras',
  'hungary': 'ungheria',
  'iceland': 'islanda',
  'india': 'india',
  'indonesia': 'indonesia',
  'iran': 'iran',
  'iraq': 'iraq',
  'ireland': 'irlanda',
  'israel': 'israele',
  'italy': 'italia',
  'ivory coast': 'costa-d-avorio',
  "cote d'ivoire": 'costa-d-avorio',
  'jamaica': 'giamaica',
  'japan': 'giappone',
  'jordan': 'giordania',
  'kazakhstan': 'kazakistan',
  'kenya': 'kenya',
  'kiribati': 'kiribati',
  'north korea': 'corea-del-nord',
  'south korea': 'corea-del-sud',
  'kuwait': 'kuwait',
  'kyrgyzstan': 'kirghizistan',
  'laos': 'laos',
  'latvia': 'lettonia',
  'lebanon': 'libano',
  'lesotho': 'lesotho',
  'liberia': 'liberia',
  'libya': 'libia',
  'liechtenstein': 'liechtenstein',
  'lithuania': 'lituania',
  'luxembourg': 'lussemburgo',
  'madagascar': 'madagascar',
  'malawi': 'malawi',
  'malaysia': 'malaysia',
  'maldives': 'maldive',
  'mali': 'mali',
  'malta': 'malta',
  'marshall is.': 'isole-marshall',
  'marshall islands': 'isole-marshall',
  'mauritania': 'mauritania',
  'mauritius': 'mauritius',
  'mexico': 'messico',
  'micronesia': 'micronesia-stati-federati-di',
  'moldova': 'moldavia',
  'monaco': 'monaco',
  'mongolia': 'mongolia',
  'montenegro': 'montenegro',
  'morocco': 'marocco',
  'mozambique': 'mozambico',
  'myanmar': 'myanmar',
  'namibia': 'namibia',
  'nauru': 'nauru',
  'nepal': 'nepal',
  'netherlands': 'paesi-bassi',
  'new zealand': 'nuova-zelanda',
  'nicaragua': 'nicaragua',
  'niger': 'niger',
  'nigeria': 'nigeria',
  'north macedonia': 'macedonia-del-nord',
  'norway': 'norvegia',
  'oman': 'oman',
  'pakistan': 'pakistan',
  'palau': 'palau',
  'panama': 'panama',
  'papua new guinea': 'papua-nuova-guinea',
  'paraguay': 'paraguay',
  'peru': 'peru',
  'philippines': 'filippine',
  'poland': 'polonia',
  'portugal': 'portogallo',
  'qatar': 'qatar',
  'romania': 'romania',
  'russia': 'russia',
  'rwanda': 'ruanda',
  'saint kitts and nevis': 'saint-kitts-e-nevis',
  'saint lucia': 'saint-lucia',
  'st. vincent and the grenadines': 'saint-vincent-e-grenadine',
  'saint vincent and the grenadines': 'saint-vincent-e-grenadine',
  'samoa': 'samoa',
  'san marino': 'san-marino',
  'sao tome and principe': 'sao-tome-e-principe',
  'saudi arabia': 'arabia-saudita',
  'senegal': 'senegal',
  'serbia': 'serbia',
  'seychelles': 'seychelles',
  'sierra leone': 'sierra-leone',
  'singapore': 'singapore',
  'slovakia': 'slovacchia',
  'slovenia': 'slovenia',
  'solomon is.': 'isole-salomone',
  'solomon islands': 'isole-salomone',
  'somalia': 'somalia',
  'south africa': 'sudafrica',
  'south sudan': 'sudan-del-sud',
  'spain': 'spagna',
  'sri lanka': 'sri-lanka',
  'sudan': 'sudan',
  'suriname': 'suriname',
  'sweden': 'svezia',
  'switzerland': 'svizzera',
  'syria': 'siria',
  'taiwan': 'taiwan',
  'tajikistan': 'tagikistan',
  'tanzania': 'tanzania',
  'thailand': 'thailandia',
  'timor-leste': 'timor-est',
  'togo': 'togo',
  'tonga': 'tonga',
  'trinidad and tobago': 'trinidad-e-tobago',
  'tunisia': 'tunisia',
  'turkey': 'turchia',
  'turkmenistan': 'turkmenistan',
  'tuvalu': 'tuvalu',
  'uganda': 'uganda',
  'ukraine': 'ucraina',
  'united arab emirates': 'emirati-arabi-uniti',
  'united kingdom': 'regno-unito',
  'united states of america': 'stati-uniti',
  'united states': 'stati-uniti',
  'uruguay': 'uruguay',
  'uzbekistan': 'uzbekistan',
  'vanuatu': 'vanuatu',
  'vatican': 'vaticano',
  'venezuela': 'venezuela',
  'vietnam': 'vietnam',
  'yemen': 'yemen',
  'zambia': 'zambia',
  'zimbabwe': 'zimbabwe'
};

const MAP_ALIASES = {
  'united states of america': ['stati uniti', 'stati uniti d america', 'usa'],
  'united states': ['stati uniti', 'stati uniti d america', 'usa'],
  'united kingdom': ['regno unito', 'gran bretagna'],
  'russia': ['russia', 'federazione russa'],
  'south korea': ['corea del sud', 'repubblica di corea'],
  'north korea': ['corea del nord', 'corea popolare'],
  'dem rep congo': ['repubblica democratica del congo', 'rd congo'],
  'congo': ['repubblica del congo', 'congo'],
  'ivory coast': ['costa d avorio', 'cote d ivoire'],
  'czechia': ['repubblica ceca', 'cechia'],
  'dominican rep': ['repubblica dominicana'],
  'central african rep': ['repubblica centrafricana'],
  'bosnia and herz': ['bosnia ed erzegovina', 'bosnia erzegovina']
};

function findNationByMapName(rawName) {
  const normMapName = normalizeText(rawName);
  if (!normMapName || !Array.isArray(nationsData)) return null;

  if (MAP_NAME_TO_ID[normMapName]) {
    const targetId = normalizeText(MAP_NAME_TO_ID[normMapName]);
    const byId = nationsData.find(n => normalizeText(n.id) === targetId);
    if (byId) return byId;
  }

  const aliases = MAP_ALIASES[normMapName] || [];
  for (const alias of aliases) {
    const normAlias = normalizeText(alias);
    const foundAlias = nationsData.find(n => {
      const nName = normalizeText(n.name);
      const nOff = normalizeText(n.official);
      const nId = normalizeText(n.id);
      return nName === normAlias || nId === normAlias || nOff.includes(normAlias);
    });
    if (foundAlias) return foundAlias;
  }

  return nationsData.find(n => {
    const nName = normalizeText(n.name);
    const nOff = normalizeText(n.official);
    const nId = normalizeText(n.id);
    return (
      nName === normMapName ||
      nId === normMapName ||
      nOff.includes(normMapName) ||
      normMapName.includes(nName)
    );
  }) || null;
}

function handleMapCountryClick(feature) {
  const rawName = (feature && feature.properties && feature.properties.name) || 'Territorio';
  const banner = document.getElementById('mapSelectedBanner');
  const nameEl = document.getElementById('mapSelectedName');
  const statusEl = document.getElementById('mapSelectedStatus');
  const openBtn = document.getElementById('mapOpenNationBtn');
  if (!banner || !nameEl || !statusEl || !openBtn) return;

  const normMapName = normalizeText(rawName);

  if (normMapName === 'antarctica') {
    banner.style.display = 'flex';
    nameEl.innerText = 'Antartide';
    statusEl.innerText = 'Continente polare australe • 0 nazioni (Trattato Antartico)';
    openBtn.innerText = 'Apri scheda Antartide →';
    openBtn.style.display = 'inline-block';
    openBtn.onclick = () => {
      const antBtn = Array.from(document.querySelectorAll('.continent-btn'))
        .find(b => normalizeText(b.textContent) === 'antartide');
      filterContinent('Antartide', antBtn);
    };
    return;
  }

  openBtn.innerText = 'Apri scheda nazione →';
  const matched = findNationByMapName(rawName);

  banner.style.display = 'flex';
  nameEl.innerText = matched ? matched.name : rawName;

  if (matched) {
    statusEl.innerText = `${matched.continent} • Capitale: ${matched.capital}`;
    openBtn.style.display = 'inline-block';
    openBtn.onclick = () => openNationDetail(matched.id);
  } else {
    statusEl.innerText = 'Scheda non ancora presente nell\'archivio caricato';
    openBtn.style.display = 'none';
    openBtn.onclick = null;
  }
}

// --- INSERISCI QUI IL TUO ARRAY const nationsData = [ ... ]; ---
function applyNationFilters() {
  const query = normalizeText(document.getElementById('nationSearchInput')?.value || '');
  const introBox = document.getElementById('introExplorerBox');
  const antarcticaBox = document.getElementById('antarcticaBox');
  const grid = document.getElementById('nationsGrid');

  if (currentContinentFilter === null) {
    if (query.length > 0) {
      if (introBox) introBox.style.display = 'none';
      if (antarcticaBox) antarcticaBox.style.display = 'none';
      if (grid) grid.style.display = 'grid';
    } else {
      if (grid) grid.style.display = 'none';
      if (antarcticaBox) antarcticaBox.style.display = 'none';
      if (introBox) introBox.style.display = 'block';
      return;
    }
  }

  if (currentContinentFilter === 'Antartide' && !query) {
    return;
  }

  let pool = currentContinentFilter && currentContinentFilter !== 'all' && currentContinentFilter !== 'Antartide'
    ? nationsData.filter(n => n.continent === currentContinentFilter)
    : nationsData.slice();

  if (currentContinentFilter === 'Americhe' && currentAmericasSubFilter !== 'all') {
    pool = pool.filter(n => getAmericaSubarea(n) === currentAmericasSubFilter);
  }

  populateSubareaSelect(pool);

  const activeTagNow = document.getElementById('subareaFilterSelect')?.value || 'all';
  const filtered = pool.filter(n => {
    const matchesTag = activeTagNow === 'all' || getCardHighlightTag(n) === activeTagNow;
    if (!matchesTag) return false;
    if (!query) return true;
    const haystack = normalizeText(`${n.name} ${n.official} ${n.capital} ${n.language} ${n.region} ${n.continent}`);
    return haystack.includes(query);
  });

  if (antarcticaBox) antarcticaBox.style.display = 'none';
  if (grid) grid.style.display = 'grid';
  renderNations(filtered);
}

function showIntroHome(btnElement) {
  currentContinentFilter = null;
  currentAmericasSubFilter = 'all';

  const searchInput = document.getElementById('nationSearchInput');
  if (searchInput) searchInput.value = '';

  document.getElementById('nationDetailView').style.display = 'none';
  document.getElementById('homeNationView').style.display = 'block';
  document.querySelectorAll('.continent-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  document.querySelectorAll('.mode-switch-btn').forEach(btn => btn.classList.remove('active'));
  const btnWorld = document.getElementById('btnModeWorld');
  if (btnWorld) btnWorld.classList.add('active');
  const continentsBar = document.getElementById('continentsBar');
  if (continentsBar) continentsBar.style.display = '';
  const currScreen = document.getElementById('currenciesScreen');
  if (currScreen) currScreen.style.display = 'none';

  const explorerToolbar = document.getElementById('explorerToolbar');
  if (explorerToolbar) explorerToolbar.style.display = 'flex';
  const subbar = document.getElementById('americasSubbar');
  if (subbar) subbar.classList.remove('show');
  const antarcticaBox = document.getElementById('antarcticaBox');
  if (antarcticaBox) antarcticaBox.style.display = 'none';
  document.getElementById('nationsGrid').style.display = 'none';
  document.getElementById('introExplorerBox').style.display = 'block';

  populateSubareaSelect(nationsData);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterContinent(continent, triggerBtn) {
  currentContinentFilter = continent;
  currentAmericasSubFilter = 'all';

  document.querySelectorAll('.continent-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = triggerBtn || (window.event && window.event.currentTarget);
  if (activeBtn) activeBtn.classList.add('active');

  const currScreen = document.getElementById('currenciesScreen');
  if (currScreen) currScreen.style.display = 'none';
  const introBox = document.getElementById('introExplorerBox');
  if (introBox) introBox.style.display = 'none';

  const explorerToolbar = document.getElementById('explorerToolbar');
  const subbar = document.getElementById('americasSubbar');
  const grid = document.getElementById('nationsGrid');
  const antarcticaBox = document.getElementById('antarcticaBox');

  if (continent === 'Antartide') {
    if (explorerToolbar) explorerToolbar.style.display = 'none';
    if (subbar) subbar.classList.remove('show');
    if (grid) grid.style.display = 'none';
    if (antarcticaBox) antarcticaBox.style.display = 'block';
    return;
  }

  if (explorerToolbar) explorerToolbar.style.display = 'flex';
  if (antarcticaBox) antarcticaBox.style.display = 'none';
  if (grid) grid.style.display = 'grid';

  if (continent === 'Americhe') {
    if (subbar) subbar.classList.add('show');
    document.querySelectorAll('.subcontinent-btn').forEach(b => b.classList.remove('active'));
    const subBtnAll = document.getElementById('subBtnAll');
    if (subBtnAll) subBtnAll.classList.add('active');
  } else {
    if (subbar) subbar.classList.remove('show');
  }

  applyNationFilters();
}

function filterAmericasSub(subarea, triggerBtn) {
  currentAmericasSubFilter = subarea;
  document.querySelectorAll('.subcontinent-btn').forEach(btn => btn.classList.remove('active'));
  if (triggerBtn) triggerBtn.classList.add('active');
  applyNationFilters();
}

function openNationDetail(id) {
  const nation = nationsData.find(n => n.id === id);
  if (!nation) return;

  document.getElementById('detCover').src = nation.coverImg;
  document.getElementById('detFlagBoxImg').src = nation.flagImg;
  document.getElementById('detTitle').innerText = nation.name;
  document.getElementById('detSubtitle').innerText = `${nation.continent} • ${nation.region}`;
  document.getElementById('detOfficialName').innerText = nation.official;
  document.getElementById('detCapital').innerText = nation.capital;
  document.getElementById('detPopulation').innerText = nation.population;
  document.getElementById('detLanguage').innerText = nation.language;
  document.getElementById('detContinent').innerText = nation.continent;
  document.getElementById('detCurrency').innerText = nation.currency;
  document.getElementById('detDescription').innerHTML = nation.desc;

  document.getElementById('homeNationView').style.display = 'none';
  document.getElementById('nationDetailView').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToHome() {
  document.getElementById('nationDetailView').style.display = 'none';
  document.getElementById('homeNationView').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchAppMode(mode, triggerBtn) {
  document.querySelectorAll('.mode-switch-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = triggerBtn || (mode === 'world'
    ? document.getElementById('btnModeWorld')
    : document.getElementById('btnModeCurrency'));
  if (activeBtn) activeBtn.classList.add('active');

  document.getElementById('nationDetailView').style.display = 'none';
  document.getElementById('homeNationView').style.display = 'block';

  const continentsBar = document.getElementById('continentsBar');
  const subbar = document.getElementById('americasSubbar');
  const introBox = document.getElementById('introExplorerBox');
  const antarcticaBox = document.getElementById('antarcticaBox');
  const grid = document.getElementById('nationsGrid');
  const currScreen = document.getElementById('currenciesScreen');

  if (mode === 'currency') {
    if (continentsBar) continentsBar.style.display = 'none';
    if (subbar) subbar.classList.remove('show');
    if (introBox) introBox.style.display = 'none';
    if (antarcticaBox) antarcticaBox.style.display = 'none';
    if (grid) grid.style.display = 'none';
    if (currScreen) currScreen.style.display = 'block';

    if (!currenciesMapInitialized) {
      initCurrenciesWorldMap();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    if (currScreen) currScreen.style.display = 'none';
    if (continentsBar) continentsBar.style.display = '';

    if (currentContinentFilter === null) {
      if (introBox) introBox.style.display = 'block';
      if (antarcticaBox) antarcticaBox.style.display = 'none';
      if (grid) grid.style.display = 'none';
    } else if (currentContinentFilter === 'Antartide') {
      if (introBox) introBox.style.display = 'none';
      if (grid) grid.style.display = 'none';
      if (antarcticaBox) antarcticaBox.style.display = 'block';
    } else {
      if (introBox) introBox.style.display = 'none';
      if (antarcticaBox) antarcticaBox.style.display = 'none';
      if (grid) grid.style.display = 'grid';
      if (currentContinentFilter === 'Americhe' && subbar) subbar.classList.add('show');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function initWorldMaps() {
  if (typeof d3 === 'undefined' || typeof topojson === 'undefined') return;

  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(res => res.json())
    .then(world => {
      const countries = topojson.feature(world, world.objects.countries);

      // 1. PLANISFERO ZOOMABILE
      const flatEl = document.getElementById('flatWorldMap');
      if (flatEl) {
        const fw = flatEl.clientWidth || 450;
        const fh = 290;
        const flatSvg = d3.select('#flatWorldMap').append('svg')
          .attr('viewBox', `0 0 ${fw} ${fh}`)
          .style('width', '100%').style('height', '100%');

        const flatGroup = flatSvg.append('g');
        const flatProj = d3.geoNaturalEarth1().fitSize([fw, fh], countries);
        const flatPath = d3.geoPath().projection(flatProj);

        flatGroup.selectAll('path')
          .data(countries.features)
          .enter().append('path')
          .attr('d', flatPath)
          .attr('fill', '#1c222d')
          .attr('stroke', '#d4af37')
          .attr('stroke-width', 0.45)
          .style('cursor', 'pointer')
          .on('click', (event, d) => {
            if (event.defaultPrevented) return;
            handleMapCountryClick(d);
          });

        flatSvg.call(d3.zoom().scaleExtent([1, 8]).on('zoom', (e) => {
          flatGroup.attr('transform', e.transform);
        }));
      }

      // 2. MAPPAMONDO 3D ROTABILE E ZOOMABILE
      const globeEl = document.getElementById('globeWorldMap');
      if (globeEl) {
        const gw = globeEl.clientWidth || 450;
        const gh = 290;
        const baseScale = Math.min(gw, gh) / 2.25;

        const globeSvg = d3.select('#globeWorldMap').append('svg')
          .attr('viewBox', `0 0 ${gw} ${gh}`)
          .style('width', '100%').style('height', '100%');

        const globeProj = d3.geoOrthographic()
          .scale(baseScale)
          .translate([gw / 2, gh / 2])
          .rotate([-15, -25]);

        const globePath = d3.geoPath().projection(globeProj);

        const sphere = globeSvg.append('path')
          .datum({ type: 'Sphere' })
          .attr('d', globePath)
          .attr('fill', '#111622')
          .attr('stroke', '#d4af37')
          .attr('stroke-width', 1);

        const globeCountries = globeSvg.append('g').selectAll('path')
          .data(countries.features)
          .enter().append('path')
          .attr('d', globePath)
          .attr('fill', '#1f2633')
          .attr('stroke', '#d4af37')
          .attr('stroke-width', 0.5)
          .style('cursor', 'pointer')
          .on('click', (event, d) => {
            if (event.defaultPrevented) return;
            handleMapCountryClick(d);
          });

        function redrawGlobe() {
          sphere.attr('d', globePath);
          globeCountries.attr('d', globePath);
        }

        globeSvg.call(d3.drag().on('drag', (e) => {
          const rot = globeProj.rotate();
          const k = 75 / globeProj.scale();
          globeProj.rotate([rot[0] + e.dx * k, Math.max(-90, Math.min(90, rot[1] - e.dy * k))]);
          redrawGlobe();
        }));

        globeSvg.call(d3.zoom().scaleExtent([0.8, 5]).on('zoom', (e) => {
          globeProj.scale(baseScale * e.transform.k);
          redrawGlobe();
        }));
      }
    });
}

// --- INSERISCI QUI const CURRENCY_HISTORY_BY_CODE = { ... }; ---

function getCurrencyHistoryText(nation) {
  const curr = nation.currency || '';
  const codeMatch = curr.match(/\(([A-Z]{3})\)/);
  const code = codeMatch ? codeMatch[1] : '';

  if (code && CURRENCY_HISTORY_BY_CODE[code]) {
    return CURRENCY_HISTORY_BY_CODE[code];
  }

  const lower = normalizeText(curr);
  if (lower.includes('dollaro')) {
    return `Adottato come valuta nazionale di ${nation.name} (${curr}), questo dollaro riprende la tradizione monetaria decimale diffusasi tra Ottocento e Novecento negli scambi commerciali internazionali.`;
  }
  if (lower.includes('peso')) {
    return `Valuta ufficiale di ${nation.name} (${curr}), il peso eredita storicamente il nome e la tradizione dell'antico peso d'argento ispanico che circolò per secoli nelle Americhe e nel Pacifico.`;
  }
  if (lower.includes('franco')) {
    return `Moneta ufficiale di ${nation.name} (${curr}), il franco nasce dall'evoluzione dei sistemi monetari introdotti in età moderna e contemporanea per facilitare gli scambi commerciali e finanziari.`;
  }
  if (lower.includes('dinaro')) {
    return `Valuta ufficiale di ${nation.name} (${curr}), il dinaro trae il proprio nome dall'antico "denarius" romano e dalle successive coniazioni auree della tradizione mediterranea e islamica.`;
  }
  if (lower.includes('rupia')) {
    return `Moneta ufficiale di ${nation.name} (${curr}), la rupia deriva dalle storiche coniazioni d'argento dell'area indo-oceanica affermatesi a partire dal XVI secolo.`;
  }
  if (lower.includes('corona')) {
    return `Valuta ufficiale di ${nation.name} (${curr}), la corona nasce nell'ambito delle riforme monetarie europee tra Ottocento e Novecento che legarono la sovranità nazionale a una propria unità decimale.`;
  }
  return `Moneta ufficiale di ${nation.name} (${curr}), istituita e gestita dalla banca centrale nazionale come strumento di sovranità economica, unità di conto e mezzo di scambio del Paese.`;
}

function openCurrencyModal(nation) {
  const overlay = document.getElementById('currencyModalOverlay');
  const titleEl = document.getElementById('currModalNationName');
  const badgeEl = document.getElementById('currModalCurrencyName');
  const histEl = document.getElementById('currModalHistory');
  if (!overlay || !titleEl || !badgeEl || !histEl) return;

  titleEl.innerText = nation.name;
  badgeEl.innerText = nation.currency || 'Valuta non specificata';
  histEl.innerText = getCurrencyHistoryText(nation);
  overlay.style.display = 'flex';
}

function closeCurrencyModal() {
  const overlay = document.getElementById('currencyModalOverlay');
  if (overlay) overlay.style.display = 'none';
}

function initCurrenciesWorldMap() {
  if (typeof d3 === 'undefined' || typeof topojson === 'undefined') return;
  const container = document.getElementById('currenciesWorldMap');
  if (!container) return;

  currenciesMapInitialized = true;
  container.innerHTML = '';

  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(res => res.json())
    .then(world => {
      const countries = topojson.feature(world, world.objects.countries);
      const w = container.clientWidth || 1100;
      const h = container.clientHeight || 560;

      const svg = d3.select('#currenciesWorldMap').append('svg')
        .attr('viewBox', `0 0 ${w} ${h}`)
        .style('width', '100%').style('height', '100%');

      const g = svg.append('g');
      const proj = d3.geoNaturalEarth1().fitSize([w, h], countries);
      const path = d3.geoPath().projection(proj);

      g.selectAll('path')
        .data(countries.features)
        .enter().append('path')
        .attr('d', path)
        .attr('fill', '#1c222d')
        .attr('stroke', '#d4af37')
        .attr('stroke-width', 0.55)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this).attr('fill', '#2f3848');
        })
        .on('mouseout', function() {
          d3.select(this).attr('fill', '#1c222d');
        })
        .on('click', (event, d) => {
          if (event.defaultPrevented) return;

          const rawName = (d && d.properties && d.properties.name) || '';
          const normMapName = normalizeText(rawName);

          if (normMapName === 'antarctica') {
            openCurrencyModal({
              name: 'Antartide',
              currency: 'Nessuna valuta ufficiale'
            });
            document.getElementById('currModalHistory').innerText =
              'L\'Antartide non ha uno Stato sovrano né una valuta ufficiale: nelle basi di ricerca scientifiche internazionali si utilizzano di volta in volta le valute dei Paesi che gestiscono le singole stazioni.';
            return;
          }

          const matched = findNationByMapName(rawName);

          if (matched) {
            openCurrencyModal(matched);
          } else {
            openCurrencyModal({
              name: rawName || 'Territorio selezionato',
              currency: 'Scheda non ancora collegata'
            });
            document.getElementById('currModalHistory').innerText =
              'Questo territorio non è ancora collegato a una scheda completa nell\'archivio.';
          }
        });

      svg.call(d3.zoom().scaleExtent([1, 8]).on('zoom', (e) => {
        g.attr('transform', e.transform);
      }));
    });
}

document.addEventListener('DOMContentLoaded', () => {
  populateSubareaSelect(nationsData);
  initWorldMaps();
});
