let currentContinentFilter = null; // null = schermata iniziale
    let currentAmericasSubFilter = 'all';

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

    function renderNations(data) {
      const grid = document.getElementById('nationsGrid');
      grid.innerHTML = '';
    function sortNationsAlphabetically(list) {
      return [...list].sort((a, b) =>
        (a.name || '').localeCompare(b.name || '', 'it', { sensitivity: 'base' })
      );
    }

    function renderNations(data) {
      const grid = document.getElementById('nationsGrid');
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
      if (!data.length) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 30px;">Nessuna nazione trovata con i filtri selezionati.</div>`;
        return;
      }

      data.forEach(nation => {
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
      if (!select) return;
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

    function showIntroHome(triggerBtn) {
  currentContinentFilter = null;
  currentAmericasSubFilter = 'all';

  document.getElementById('nationDetailView').style.display = 'none';
  document.getElementById('homeNationView').style.display = 'block';

  document.querySelectorAll('.continent-btn').forEach(btn => btn.classList.remove('active'));
  const homeBtn = triggerBtn || document.getElementById('btnHomeExplorer');
  if (homeBtn) homeBtn.classList.add('active');

  const subbar = document.getElementById('americasSubbar');
  if (subbar) subbar.classList.remove('show');
  const antarcticaBox = document.getElementById('antarcticaBox');
  if (antarcticaBox) antarcticaBox.style.display = 'none';
  const currScreen = document.getElementById('currenciesScreen');
  if (currScreen) currScreen.style.display = 'none';

  document.getElementById('nationsGrid').style.display = 'none';
  document.getElementById('introExplorerBox').style.display = 'block';

  if (typeof populateSubareaSelect === 'function') {
    populateSubareaSelect(nationsData);
  }
}


    

    function filterContinent(continent, triggerBtn) {
      currentContinentFilter = continent;
      currentAmericasSubFilter = 'all';
      document.querySelectorAll('.continent-btn').forEach(btn => btn.classList.remove('active'));
      const activeBtn = triggerBtn || (window.event && window.event.currentTarget);
      if (activeBtn) activeBtn.classList.add('active');

      const introBox = document.getElementById('introExplorerBox');
      if (introBox) introBox.style.display = 'none';

      const subbar = document.getElementById('americasSubbar');
      const grid = document.getElementById('nationsGrid');
      const antarcticaBox = document.getElementById('antarcticaBox');

      if (continent === 'Americhe') {
        if (antarcticaBox) antarcticaBox.style.display = 'none';
        if (grid) grid.style.display = 'grid';
        if (subbar) subbar.classList.add('show');
        document.querySelectorAll('.subcontinent-btn').forEach(b => b.classList.remove('active'));
        const subBtnAll = document.getElementById('subBtnAll');
        if (subBtnAll) subBtnAll.classList.add('active');
        populateSubareaSelect(nationsData.filter(n => n.continent === 'Americhe'));
        applyNationFilters();
      } else if (continent === 'Antartide') {
        if (subbar) subbar.classList.remove('show');
        if (grid) grid.style.display = 'none';
        if (antarcticaBox) antarcticaBox.style.display = 'block';
      } else {
        if (subbar) subbar.classList.remove('show');
        if (antarcticaBox) antarcticaBox.style.display = 'none';
        if (grid) grid.style.display = 'grid';
        const base = continent === 'all' ? nationsData : nationsData.filter(n => n.continent === continent);
        populateSubareaSelect(base);
        applyNationFilters();
      }
    }

    function filterAmericasSub(subarea, triggerBtn) {
      currentAmericasSubFilter = subarea;
      document.querySelectorAll('.subcontinent-btn').forEach(btn => btn.classList.remove('active'));
      if (triggerBtn) triggerBtn.classList.add('active');
      const base = subarea === 'all'
        ? nationsData.filter(n => n.continent === 'Americhe')
        : nationsData.filter(n => n.continent === 'Americhe' && getAmericaSubarea(n) === subarea);
      populateSubareaSelect(base);
      applyNationFilters();
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
      'bosnia and herz.': 'bosnia-ed-erzegovina',
      'bosnia and herzegovina': 'bosnia-ed-erzegovina',
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
      'eq. guinea': 'Guinea-equatoriale',
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
      'malaysia': 'malesia',
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
      'united states of america': 'stati-uniti-d-america',
      'united states': 'stati-uniti-d-america',
      'uruguay': 'uruguay',
      'uzbekistan': 'uzbekistan',
      'vanuatu': 'vanuatu',
      'vatican': 'citta-del-vaticano',
      'venezuela': 'venezuela',
      'vietnam': 'vietnam',
      'yemen': 'yemen',
      'zambia': 'zambia',
      'zimbabwe': 'zimbabwe'
    };

        function handleMapCountryClick(feature) {
      const rawName = (feature && feature.properties && feature.properties.name) || 'Territorio';
      const banner = document.getElementById('mapSelectedBanner');
      const nameEl = document.getElementById('mapSelectedName');
      const statusEl = document.getElementById('mapSelectedStatus');
      const openBtn = document.getElementById('mapOpenNationBtn');
      if (!banner || !nameEl || !statusEl || !openBtn) return;

      const normMapName = normalizeText(rawName);

      // Caso speciale: Antartide
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

      // Ripristina il testo standard del pulsante per tutte le nazioni
      openBtn.innerText = 'Apri scheda nazione →';

      const mappedId = MAP_NAME_TO_ID[normMapName];

      let matched = null;
      if (mappedId) {
        matched = nationsData.find(n => normalizeText(n.id) === normalizeText(mappedId));
      }
      if (!matched) {
        matched = nationsData.find(n => {
          const nName = normalizeText(n.name);
          const nOff = normalizeText(n.official);
          return nName === normMapName || nOff.includes(normMapName) || normMapName.includes(nName);
        });
      }

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

    const nationsData = [
      {
        id: 'italia',
        name: 'Italia',
        official: 'Repubblica Italiana',
        continent: 'Europa',
        region: 'Europa Meridionale',
        capital: 'Roma',
        population: '~59.030.000',
        language: 'Italiano',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg',
        desc: `L'Italia occupa una posizione geografica centrale nel bacino del Mediterraneo, configurandosi come una penisola protesa verso sud. La sua storia millenaria ha profondamente plasmato i fondamenti della civiltà occidentale, del diritto, dell'arte e della filosofia. Dalle prime civiltà italiche all'ascesa dell'Impero Romano, che unificò politicamente e culturalmente un vasto territorio transcontinentale, la penisola è stata il fulcro di imperi e reti commerciali di portata globale.<br><br>
        Dopo la frammentazione politica seguita al crollo dell'Impero d'Occidente, l'Italia fu culla del particolarismo comunale e, successivamente, dello straordinario fermento culturale ed economico del Rinascimento tra il XIV e il XVI secolo. L'unità nazionale, raggiunta nel 1861 sotto la dinastia sabauda, ha segnato l'ingresso del Paese nell'età contemporanea come Stato unitario.<br><br>
        Dal punto de vista socio-economico, la Repubblica Italiana (istituita istituzionalmente tramite il referendum del 1946) si è affermata nel secondo dopoguerra tra le principali potenze industriali mondiali. Il suo modello economico si regge su un solido comparto manifatturiero, su una spiccata vocazione all'esportazione e su un tessuto peculiare di piccole e medie imprese, affiancate da un patrimonio artistico e culturale senza eguali.`
      },
      {
        id: 'giappone',
        name: 'Giappone',
        official: 'Nippon-koku / Giappone',
        continent: 'Asia',
        region: 'Asia Orientale',
        capital: 'Tokyo',
        population: '~124.500.000',
        language: 'Giapponese',
        currency: 'Yen (¥)',
        coverImg: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg',
        desc: `Il Giappone è uno Stato insulare situato nell'Asia orientale, caratterizzato da un territorio prevalentemente montuoso e vulcanico. La sua evoluzione storica si distingue per una peculiare capacità di assimilare e rielaborare elementi culturali esterni pur preservando una profonda continuità identitaria e tradizionale.<br><br>
        Lunga è stata la fase di governo feudale dominata dalla figura dei signori della guerra (daimyō) e dei samurai, sotto l'autorità formale dell'Imperatore e il controllo effettivo degli shōgun. Tale assetto si concluse radicalmente con la Restaurazione Meiji del 1868, anno in cui il Paese intraprese una rapida e intensa modernizzazione istituzionale, industriale e militare che lo portò a imporsi come attore geopolitico di primo piano nell'area del Pacifico.<br><br>
        Nonostante la devastazione subita nel corso del secondo conflitto mondiale, il Giappone ha saputo compiere un prodigioso riscatto economico noto come il "miracolo economico giapponese" della seconda metà del XX secolo. Oggi rappresenta una delle economie più avanzate al mondo, leader globale nell'innovazione tecnologica, nella robotica, nella ricerca scientifica e nell'industria automobilistica avanzata.`
      },
      {
        id: 'francia',
        name: 'Francia',
        official: 'Repubblica Francese',
        continent: 'Europa',
        region: 'Europa Occidentale',
        capital: 'Parigi',
        population: '~68.370.000',
        language: 'Francese',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg',
        desc: `La Francia costituisce da secoli uno dei pilastri politici, diplomatici e culturali del continente europeo. Erede storica della Gallia celtica e del regno dei Franchi, la nazione ha consolidato nel corso dell'età moderna una forte monarchia accentrata che ha esercitato un'enorme influenza culturale e geopolitica in Europa e nel mondo.<br><br>
        Un momento di svolta epocale non solo per la nazione, ma per l'intera storia dell'umanità, fu la Rivoluzione Francese del 1789, che demolì l'Ancien Régime introducendo i principi universali di libertà, uguaglianza e fraternità e ridefinendo i concetti di cittadinanza e sovranità popolare. Successivamente, l'esperienza napoleonica impuse riforme giuridiche e amministrative che influenzarono i codici civili di gran parte d'Europa.<br><br>
        Nel panorama contemporaneo, la Francia è una repubblica semipresidenziale, membro permanente del Consiglio di Sicurezza delle Nazioni Unite e potenza nucleare. Il suo sistema economico si distingue per la forte presenza dello Stato in settori strategici, un eccellente sviluppo nei campi aerospaziale, energetico ed agroalimentare, e una centralità ineguagliabile nel circuito del turismo e della cultura globale.`
      },
      {
        id: 'stati-uniti',
        name: 'Stati Uniti',
        official: 'Stati Uniti d\'America',
        continent: 'Americhe',
        region: 'America del Nord',
        capital: 'Washington D.C.',
        population: '~334.900.000',
        language: 'Inglese (statunitense)',
        currency: 'Dollaro USA ($)',
        coverImg: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg',
        desc: `Gli Stati Uniti d'America sono una repubblica federale composta da cinquanta Stati, affermatasi nel corso del XX secolo come la principale superpotenza economica, militare e tecnologica su scala globale. La nascita dello Stato moderno risale alla Dichiarazione d'Indipendenza del 1776, con cui le tredici colonie britanniche della costa atlantica si affrancarono dalla madrepatria britannica.<br><br>
        Il XIX secolo fu caratterizzato da una massiccia espansione territoriale verso ovest, accompagnata da profonde tensioni interne che culminarono nella Guerra di Secessione (1861-1865), la quale sancì l'abolizione definitiva della schiavitù e l'indissolubilità dell'Unione. Parallelamente, il rapido processo di industrializzazione e l'ingente flusso migratorio trasformarono il Paese in un polo industriale e finanziario di primaria grandezza.<br><br>
        Sul piano internazionale, l'intervento determinante nei due conflitti mondiali e la successiva contrapposizione durante la Guerra Fredda hanno proiettato gli Stati Uniti al centro del sistema geopolitico globale. La loro economia è fortemente incentrata sul libero mercato, sull'innovazione tecnologica avanzata, sui servizi finanziari e su un apparato di ricerca scientifica e universitario tra i più competitivi del pianeta.`
      },
      {
        id: 'egitto',
        name: 'Egitto',
        official: 'Repubblica Araba d\'Egitto',
        continent: 'Africa',
        region: 'Africa Settentrionale',
        capital: 'Il Cairo',
        population: '~112.700.000',
        language: 'Arabo',
        currency: 'Sterlina egiziana (EGP)',
        coverImg: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg',
        desc: `L'Egitto è uno Stato transcontinentale situato all'estremità settentrionale dell'Africa, storicamente considerato un ponte strategico e culturale tra il continente africano, il Vicino Oriente e il Mediterraneo. La sua storia millenaria affonda le radici nella nascita di una delle più antiche e straordinarie civiltà fluviali della storia umana, fiorita grazie alle regolari piene del fiume Nilo.<br><br>
        La civiltà dell'antico Egitto, celebre per il suo complesso sistema religioso, la monumentale architettura delle piramidi e dei templi e l'invenzione della scrittura geroglifica, ha rappresentato per millenni un faro di progresso scientifico, artistico e amministrativo. Nel corso dei secoli successivi il territorio fu assoggettato a diverse dominazioni — tra cui quella persiana, greco-romana, bizantina e arabo-islamica — che ne mutarono profondamente il profilo linguistico, religioso e culturale.<br><br>
        In età contemporanea, l'apertura del Canale di Suez nel 1869 ha restituito all'Egitto una centralità geopolitica e commerciale di rilevanza mondiale, collegando le rotte marittime tra Europa e Asia. Oggi la nazione gioca un ruolo diplomatico cruciale negli equilibri del mondo arabo e mediorientale, basando la propria economia sull'agricoltura, sul turismo culturale, sulle risorse energetiche e sui diritti di transito doganale marittimo.`
      },

      {
        id: 'austria',
        name: 'Austria',
        official: 'Repubblica d\'Austria',
        continent: 'Europa',
        region: 'Europa Centrale',
        capital: 'Vienna',
        population: '~9.100.000',
        language: 'Tedesco',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=1200&q=80',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_Austria.svg',
        desc: `L'Austria è una repubblica federale dell'Europa centrale caratterizzata da una straordinaria e millenaria tradizione storica, artistica e culturale. Il territorio, prevalentemente alpino, è solcato dal corso del Danubio e ha rappresentato fin dall'antichità un crocevia fondamentale tra il mondo germanico, quello slavo e la penisola italiana.<br><br>
        Le radici statali dell'Austria affondano nel Margraviato d'Austria istituito nel X secolo all'interno del Sacro Romano Impero. Nel corso del basso medioevo e dell'età moderna, la dinastia degli Asburgo elevò il paese a una delle potenze dominanti d'Europa. Vienna divenne il fulcro politico e culturale di un vasto impero multinazionale, esercitando un'influenza monumentale sulla storia del continente, sulla diplomazia e sullo sviluppo della musica classica, della filosofia e della scienza occidentale.<br><br>
        A seguito della dissoluzione dell'Impero Austro-Ungarico al termine della prima guerra mondiale nel 1918, l'Austria attraversò una complessa fase di transizione istituzionale, segnata dalla Prima Repubblica e dalla tragica parentesi dell'annessione al Terzo Reich (Anschluss). Riconquistata la piena sovranità alla fine della seconda guerra mondiale, il Parlamento austriaco ha sancito nel 1955 lo status costituzionale di neutralità permanente.<br><br>
        Nel panorama contemporaneo, l'Austria si distingue per un'economia altamente sviluppata basata su un solido settore industriale, sull'innovazione tecnologica e su un flusso turistico di rilevanza mondiale legato al patrimonio storico e paesaggistico. Membro dell'Unione Europea dal 1995, il paese unisce un elevatissimo standard di vita a un modello sociale avanzato e a una posizione centrale nella cooperazione internazionale ed europea.`
      },
      {
        id: 'belgio',
        name: 'Belgio',
        official: 'Regno del Belgio',
        continent: 'Europa',
        region: 'Europa Occidentale',
        capital: 'Bruxelles',
        population: '~11.700.000',
        language: 'Olandese, Francese, Tedesco',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Belgium.svg',
        desc: `Il Belgio è una monarchia federale situata nell'Europa occidentale, da sempre crocevia strategico di culture, lingue e tradizioni economiche germaniche e romanze. La regione ha rappresentato storicamente uno dei centri commerciali, manifatturieri e finanziari più dinamici d'Europa, fin dai tempi dei liberi comuni delle Fiandre medievali e dello splendore artistico del Rinascimento nordico.<br><br>
        L'attuale Stato nazionale nacque in seguito alla rivoluzione del 1830, che sancì l'indipendenza dal Regno Unito dei Paesi Bassi, e si affermò rapidamente come una delle prime nazioni a completare la rivoluzione industriale nell'Europa continentale. Nel corso del XX secolo, pur profondamente segnato dai conflitti mondiali a causa della sua posizione geografica, il Belgio ha saputo ricostruire il proprio tessuto economico e sociale.<br><br>
        Sul piano istituzionale, il paese si è evoluto in una complessa federazione strutturata per armonizzare le diverse comunità linguistiche (fiamminga, vallone e germanofona). Oggi Bruxelles riveste un ruolo di primissimo piano sulla scena internazionale, ospitando le sedi centrali delle principali istituzioni dell'Unione Europea e della NATO, guadagnandosi di fatto lo status di capitale politica del continente europeo.`
      },
      {
        id: 'bulgaria',
        name: 'Bulgaria',
        official: 'Repubblica di Bulgaria',
        continent: 'Europa',
        region: 'Europa Orientale / Balcanica',
        capital: 'Sofia',
        population: '~6.450.000',
        language: 'Bulgaro',
        currency: 'Lev bulgaro (BGN)',
        coverImg: 'https://images.unsplash.com/photo-1601152888642-f2f1b5ee0ca2?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Bulgaria.svg',
        desc: `La Bulgaria è uno Stato situato nella penisola balcanica, nell'Europa sud-orientale, caratterizzato da una storia millenaria che affonda le radici nelle civiltà tracie, slave e protobulgare. Fondato nel 681 d.C., il Primo Impero Bulgaro fu uno dei centri politici e culturali più rilevanti dell'Europa medievale, particolarmente celebre per aver favorito la diffusione della scrittura cirillica nel mondo slavo.<br><br>
        Dopo secoli di dominazione bizantina e successivamente ottomana (durata quasi cinquecento anni fino alla fine del XIX secolo), la Bulgaria riconquistò la propria indipendenza nel 1878 in seguito alla guerra russo-turca. Nel corso del Novecento il Paese ha attraversato profonde trasformazioni politiche, passando dalla monarchia alla Repubblica Popolare sotto l'influenza del blocco sovietico, fino alla transizione democratica avviata alla fine degli anni ottanta.<br><br>
        Membro dell'Unione Europea dal 2007, la Bulgaria unisce un patrimonio storico, archeologico e naturalistico di straordinario valore a un'economia in costante modernizzazione, basata sull'industria manifatturiera, sull'energia, sulle tecnologie dell'informazione e su un turismo culturale e paesaggistico in forte espansione.`
      },
      {
        id: 'croazia',
        name: 'Croazia',
        official: 'Repubblica di Croazia',
        continent: 'Europa',
        region: 'Europa Centrale e Balcanica',
        capital: 'Zagabria',
        population: '~3.850.000',
        language: 'Croato',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1555990793-da11153b2473?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Croatia.svg',
        desc: `La Croazia è uno Stato situato all'incrocio tra l'Europa centrale, l'Europa sud-orientale e il mar Adriatico, caratterizzato da una straordinaria costa frastagliata ricca di isole e da un retroterra profondamente legato alla storia mitteleuropea e mediterranea.<br><br>
        Le popolazioni slave insediatesi nella regione nel corso del VII secolo diedero vita nel Medioevo a ducati e regni indipendenti, che mantennero a lungo legami stretti e complessi con la Repubblica di Venezia e il Regno d'Ungheria. Per secoli baluardo difensivo dei confini cristiani contro l'Impresa ottomana, la Croazia ha fatto successivamente parte dell'Impero Asburgico e, nel XX secolo, delle due Jugoslavie.<br><br>
        Conquistata l'indipendenza nel 1991 in seguito a un conflitto doloroso, la Croazia ha intrapreso una solida transizione istituzionale ed economica. Membro dell'Unione Europea dal 2013 e parte dell'area di Schengen e dell'Eurozona dal 2023, il Paese unisce una forte vocazione turistica internazionale a un'economia dinamica basata sui servizi, sulla cantieristica e sulla cooperazione regionale.`
      },
      {
        id: 'danimarca',
        name: 'Danimarca',
        official: 'Regno di Danimarca',
        continent: 'Europa',
        region: 'Europa Settentrionale / Scandinavia',
        capital: 'Copenaghen',
        population: '~5.930.000',
        language: 'Danese',
        currency: 'Corona danese (DKK)',
        coverImg: 'https://images.unsplash.com/photo-1761408631616-28be60406669?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_Denmark.svg',
        desc: `La Danimarca è una monarchia costituzionale situata nell'Europa settentrionale, la più meridionale delle nazioni scandinave, composta da una penisola (lo Jutland) e da un vasto arcipelago di centinaia di isole. La sua storia antica è profondamente legata all'epopea dei Vichinghi, che tra l'VIII e l'XI secolo dominarono le rotte commerciali e i mari del Nord Europa.<br><br>
        Nel Medioevo la Danimarca emerse come una grande potenza regionale, arrivando a controllare temporaneamente vasti territori baltici e scandinavi (Unione di Kalmar). Nel corso dei secoli successivi, pur ridimensionatasi territorialmente a seguito di conflitti con le potenze vicine, ha sviluppato un avanzato modello socio-politico fondato sullo stato sociale e sulla democrazia parlamentare.<br><br>
        Membro dell'Unione Europea dal 1973, la Danimarca si distingue oggi per un'economia altamente sviluppata, fortemente orientata all'innovazione tecnologica, alle energie rinnovabili, alla sostenibilità ambientale e a uno dei tenori di vita più elevati al mondo.`
      },
      {
        id: 'estonia',
        name: 'Estonia',
        official: 'Repubblica di Estonia',
        continent: 'Europa',
        region: 'Europa Settentrionale / Baltico',
        capital: 'Tallinn',
        population: '~1.360.000',
        language: 'Estone',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1709862366377-54b16f3e51f9?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Flag_of_Estonia.svg',
        desc: `L'Estonia è una repubblica parlamentare situata nell'Europa settentrionale, bagnata dal Mar Baltico e affacciata sul Golfo di Finlandia. La sua storia è segnata da una secolare lotta per l'autodeterminazione, trovandosi a essere crocevia e terra di conquista tra le potenze regionali scandinave, germaniche e russe.<br><br>
        Dopo aver dichiarato la propria indipendenza nel 1918 al termine della prima guerra mondiale, l'Estonia subì l'occupazione e l'annessione all'Unione Sovietica durante la seconda guerra mondiale. Nel 1991, in concomitanza con il collasso sovietico, il Paese riconquistò la piena sovranità attraverso la celebre e pacifica "Rivoluzione Cantata".<br><br>
        Nel panorama contemporaneo, l'Estonia si è affermata come una delle nazioni più avanzate al mondo nel settore della digitalizzazione, della pubblica amministrazione elettronica (e-Government) e dell'innovazione tecnologica. Membro dell'Unione Europea e della NATO dal 2004, unisce un ricchissimo patrimonio storico medievale — simboleggiato dal centro storico di Tallinn — a un'economia dinamica e fortemente orientata al futuro.`
      },
      {
        id: 'finlandia',
        name: 'Finlandia',
        official: 'Repubblica di Finlandia',
        continent: 'Europa',
        region: 'Europa Settentrionale / Scandinavia',
        capital: 'Helsinki',
        population: '~5.600.000',
        language: 'Finlandese, Svedese',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg',
        desc: `La Finlandia è una repubblica parlamentare situata nell'Europa settentrionale, caratterizzata da un territorio straordinario composto da decine di migliaia di laghi ("la terra dei mille laghi") e da vaste foreste boreali. La sua storia antica è segnata da una lunga dominazione svedese iniziata nel XII secolo, che ha profondamente influenzato le istituzioni, la cultura e il sistema giuridico del Paese.<br><br>
        A seguito della guerra russo-svedese del 1809, la Finlandia fu annessa all'Impero russo come Granducato autonomo. Il Paese proclamò la propria indipendenza nel dicembre 1917, sfruttando il vuoto di potere seguito alla rivoluzione russa. Nel corso della seconda guerra mondiale, la Finlandia difese eroicamente la propria sovranità attraverso i conflitti contro l'Unione Sovietica, riuscendo a preservare la democrazia e l'indipendenza nazionale.<br><br>
        Membro dell'Unione Europea dal 1995 e della NATO dal 2023, la Finlandia è oggi riconosciuta a livello globale come un modello di eccellenza per il suo sistema scolastico all'avanguardia, per gli altissimi standard di innovazione tecnologica, ricerca scientifica, trasparenza istituzionale e per l'impegno costante nella sostenibilità ambientale.`
      },
      {
        id: 'germania',
        name: 'Germania',
        official: 'Repubblica Federale di Germania',
        continent: 'Europa',
        region: 'Europa Centrale',
        capital: 'Berlino',
        population: '~84.400.000',
        language: 'Tedesco',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg',
        desc: `La Germania è una repubblica federale situata nell'Europa centrale, caratterizzata da una delle storie più complesse, influenti e dense di svolte epocali del continente. Erede della frammentazione del Sacro Romano Impero e dei successivi regni e principati germanici, la nazione ha raggiunto la sua prima unificazione statale nel 1871 sotto la guida della Prussia.<br><br>
        Il Novecento è stato segnato da profonde tragedie storiche legate ai due conflitti mondiali e alla catastrofe del regime nazista, che hanno ridefinito radicalmente i confini e gli assetti geopolitici del Paese. Nel dopoguerra la Germania è stata divisa in due entità distinte (Repubblica Federale Tedesca e Repubblica Democratica Tedesca) lungo la cortina di ferro, per poi riunificarsi pacificamente nel 1990 in seguito alla caduta del Muro di Berlino.<br><br>
        Oggi la Germania costituisce la prima economia d'Europa e una delle potenze industriali e tecnologiche più avanzate e stabili del pianeta. Membro fondatore delle comunità europee, il Paese riveste un ruolo cardine nelle politiche di integrazione, nella cooperazione economica internazionale e nello sviluppo culturale e scientifico globale.`
      },
      {
        id: 'grecia',
        name: 'Grecia',
        official: 'Repubblica Ellenica',
        continent: 'Europa',
        region: 'Europa Meridionale / Balcanica',
        capital: 'Atene',
        population: '~10.420.000',
        language: 'Greco',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Greece.svg',
        desc: `La Grecia è una repubblica situata nell'estremità meridionale della penisola balcanica, considerata universalmente la culla della civiltà occidentale. La sua storia antica ha posto le fondamenta della filosofia, della democrazia, della letteratura, della drammaturgia, della matematica e dei Giochi olimpici, esercitando un'influenza culturale monumentale sull'intero pianeta.<br><br>
        Nel corso dei secoli il territorio greco è stato al centro di grandi snodi storici: dall'età classica e dall'Impero macedone di Alessandro Magno, passando per la lunghissima dominazione dell'Impero Romano e dell'Impero Bizantino, fino ai circa quattro secoli di governo sotto l'Impero Ottomano. La nazione riconquistò la propria indipendenza in seguito alla sanguinosa guerra d'indipendenza combattuta tra il 1821 e il 1829.<br><br>
        Nel corso del XX secolo la Grecia ha superato complesse fasi istituzionali, tra cui guerre, la dittatura dei colonnelli e la transizione alla moderna repubblica democratica consolidata nel 1974. Membro dell'Unione Europea dal 1981, la Grecia unisce un patrimonio archeologico, storico e paesaggistico senza eguali — caratterizzato da migliaia di isole nel Mar Egeo e Ionio — a un'economia fortemente basata sul turismo internazionale, sulla navigazione marittima commerciale e sull'agricoltura specializzata.`
      },
      {
        id: 'irlanda',
        name: 'Irlanda',
        official: 'Repubblica d\'Irlanda',
        continent: 'Europa',
        region: 'Europa Settentrionale / Occidentale',
        capital: 'Dublino',
        population: '~5.280.000',
        language: 'Irlandese (Gaelico), Inglese',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1530538095376-a4936b35b5f0?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Flag_of_Ireland.svg',
        desc: `L'Irlanda è uno Stato insulare situato nell'Europa nord-occidentale, noto storicamente come l'"Isola di Smeraldo" per via dei suoi paesaggi lussureggianti e verdi. La sua storia antica è profondamente radicata nella cultura celtica, nel monachesimo cristiano medievale che salvaguardò la cultura classica durante l'Alto Medioevo, e in una lunga e complessa vicinanza con la vicina Gran Bretagna.<br><br>
        Dopo secoli di dominazione britannica, segnati da profondi traumi sociali ed economici (tra cui la grande carestia della metà del XIX secolo), la lotta per l'indipendenza condotta all'inizio del XX secolo portò alla nascita dello Stato Libero d'Irlanda nel 1922 e, successivamente, alla proclamazione della piena repubblica nel 1949.<br><br>
        Entrata a far parte dell'Unione Europea nel 1973, l'Irlanda ha vissuto una straordinaria trasformazione economica nella seconda metà del Novecento, passando da un'economia prevalentemente rurale a uno dei poli tecnologici, finanziari e farmaceutici più dinamici e avanzati d'Europa, pur preservando gelosamente le proprie antiche tradizioni musicali, letterarie e linguistiche.`
      },
      {
        id: 'islanda',
        name: 'Islanda',
        official: 'Repubblica d\'Islanda',
        continent: 'Europa',
        region: 'Europa Settentrionale / Atlantico Nord',
        capital: 'Reykjavík',
        population: '~385.000',
        language: 'Islandese',
        currency: 'Corona islandese (ISK)',
        coverImg: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Iceland.svg',
        desc: `L'Islanda è uno Stato insulare situato nell'Oceano Atlantico settentrionale, caratterizzato da un paesaggio vulcanico e glaciale straordinario e unico al mondo ("la terra del ghiaccio e del fuoco"). La sua storia ha inizio sul finire del IX secolo, quando coloni di origine norvegese e celtica — prevalentemente vichinghi — iniziarono a popolare l'isola.<br><br>
        Intorno al 930 d.C. gli islandesi istituirono l'Alþingi, considerato uno dei parlamenti più antichi della storia. Dopo secoli trascorsi sotto il dominio prima della Norvegia e successivamente della Danimarca, l'Islanda ha riconquistato la piena indipendenza nazionale nel 1944, fondando una moderna e prospera repubblica democratica.<br><br>
        Nonostante la posizione geografica isolata e le dimensioni demografiche ridotte, l'Islanda vanta un'economia avanzatissima basata sullo sfruttamento delle energie rinnovabili (geotermica e idroelettrica), sulla pesca sostenibile, sulle industrie ad alta tecnologia e su un turismo internazionale in costante crescita, uniti a un livello di alfabetizzazione letteraria e a standard di benessere tra i più elevati del pianeta.`
      },
      {
        id: 'norvegia',
        name: 'Norvegia',
        official: 'Regno di Norvegia',
        continent: 'Europa',
        region: 'Europa Settentrionale / Scandinavia',
        capital: 'Oslo',
        population: '~5.550.000',
        language: 'Norvegese (Bokmål e Nynorsk)',
        currency: 'Corona norvegese (NOK)',
        coverImg: 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Norway.svg',
        desc: `La Norvegia è una monarchia costituzionale situata nell'Europa settentrionale, nella parte occidentale della penisola scandinava, celebre nel mondo per i suoi paesaggi spettacolari caratterizzati da profondi fiordi, montagne maestose e ghiacciai. La sua storia antica è indissolubilmente legata all'espansione dei Vichinghi, che tra l'VIII e l'XI secolo esplorarono rotte oceaniche e fondarono insediamenti in tutta Europa e nell'Atlantico settentrionale.<br><br>
        Dopo secoli trascorsi in unione politica prima con la Danimarca e poi con la Svezia, la Norvegia riconquistò la piena indipendenza nazionale nel 1905, optando per la forma di governo monarchica costituzionale. Nel corso del XX secolo il Paese ha saputo valorizzare le proprie risorse naturali, trasformandosi da economia basata sulla pesca e sull'agricoltura a una delle nazioni più avanzate e prospere al mondo, anche grazie alla scoperta di importanti giacimenti petroliferi e di gas naturale gestiti con un lungimirante fondo sovrano.<br><br>
        Pur rimanendo fuori dall'Unione Europea per scelta referendaria, la Norvegia è un membro fondatore della NATO e parte integrante dello Spazio Economico Europeo, distinguendosi a livello globale per i suoi altissimi standard di welfare sociale, trasparenza democratica, innovazione tecnologica e per il forte impegno nella transizione ecologica ed energetica.`
      },
      {
        id: 'paesi-bassi',
        name: 'Paesi Bassi',
        official: 'Regno dei Paesi Bassi',
        continent: 'Europa',
        region: 'Europa Occidentale',
        capital: 'Amsterdam',
        population: '~17.900.000',
        language: 'Olandese',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg',
        desc: `I Paesi Bassi sono una monarchia costituzionale situata nell'Europa occidentale, storicamente celebre anche con il nome di Olanda e famosa per il suo territorio pianeggiante in gran parte sottratto al mare grazie a un'imponente rete di dighe, canali e polder. Nel corso del XVII secolo, durante la cosiddetta età dell'oro olandese, la nazione emerse come la principale potenza marittima e commerciale del pianeta, fondando imperi commerciali globali e sviluppando una straordinaria fioritura artistica, scientifica e filosofica.<br><br>
        Dopo aver lottato per decenni per l'indipendenza dal dominio spagnolo e aver costituito una delle prime e più avanzate repubbliche mercantili d'Europa, i Paesi Bassi hanno consolidato nel corso dei secoli un modello istituzionale fondato sulla democrazia parlamentare, sulla tolleranza civile e sul diritto internazionale (ospitando a L'Aja le principali corti giudiziarie globali).<br><br>
        Membro fondatore dell'Unione Europea, della zona euro e della NATO, il Paese vanta oggi un'economia altamente globalizzata e tra le più competitive al mondo, particolarmente rinomata per l'innovazione tecnologica, l'agricoltura avanzata, la logistica d'eccellenza (grazie al porto di Rotterdam) e una forte leadership nella sostenibilità urbana e ambientale.`
      },
      {
        id: 'polonia',
        name: 'Polonia',
        official: 'Repubblica di Polonia',
        continent: 'Europa',
        region: 'Europa Centrale',
        capital: 'Varsavia',
        population: '~37.600.000',
        language: 'Polacco',
        currency: 'Zloty polacco (PLN)',
        coverImg: 'https://images.unsplash.com/photo-1783444327817-bca4a85e1c22?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Flag_of_Poland.svg',
        desc: `La Polonia è una repubblica situata nell'Europa centrale, caratterizzata da una storia millenaria ricca di grandi fioriture culturali e di profondi drammi geopolitici dovuti alla sua posizione geografica di cerniera tra l'Europa occidentale e quella orientale. Fondata come Stato unitario nel X secolo, la nazione visse nel Rinascimento una straordinaria età dell'oro come Confederazione Polacco-Lituana, una delle potenze più estese e politicamente avanzate del continente.<br><br>
        Dopo essere stata cancellata dalle mappe geografiche per oltre un secolo a seguito delle spartizioni settecentesche tra le potenze vicine, la Polonia riconquistò la propria indipendenza nel 1918. Tragicamente devastata durante la seconda guerra mondiale, passò successivamente sotto l'influenza del blocco sovietico come Repubblica Popolare; tuttavia, grazie al movimento sindacale di Solidarność guidato da Lech Wałęsa negli anni ottanta, innescò la dissoluzione pacifica del comunismo in Europa orientale.<br><br>
        Membro dell'Unione Europea e della NATO dal 2004, la Polonia rappresenta oggi una delle economie più dinamiche, resilienti e in rapida crescita dell'Europa centrale, unendo un patrimonio storico, architettonico e monumentale di inestimabile valore a un forte sviluppo industriale e tecnologico.`
      },
      {
        id: 'portogallo',
        name: 'Portogallo',
        official: 'Repubblica Portoghese',
        continent: 'Europa',
        region: 'Europa Meridionale / Penisola Iberica',
        capital: 'Lisbona',
        population: '~10.600.000',
        language: 'Portoghese',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1785487117014-375d4342d0ef?q=80&w=2760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg',
        desc: `Il Portogallo è uno Stato situato nell'estremità sud-occidentale dell'Europa, nella penisola iberica, bagnato dall'Oceano Atlantico e caratterizzato da una delle storie marittime più straordinarie del mondo. Nato come regno indipendente nel XII secolo durante la Reconquista, il Paese fu il grande pioniere delle esplorazioni geografiche oceaniche tra il XV e il XVI secolo, inaugurando l'Età delle Scoperte e dando vita a un vasto impero marittimo globale che collegò l'Europa all'Africa, all'Asia e alle Americhe.<br><br>
        Dopo aver vissuto secoli di grande splendore economico e culturale, il Portogallo affrontò una fase di progressivo declino e, nel XX secolo, visse una lunga parentesi autoritaria conclusasi pacificamente nel 1974 con la celebre "Rivoluzione dei garofani", che ripristinò la democrazia e aprì la strada all'integrazione europea.<br><br>
        Membro dell'Unione Europea dal 1986, il Portogallo è oggi una nazione moderna, aperta e fortemente dinamica, rinomata a livello globale per la ricchezza del suo patrimonio storico-architettonico, per la qualità della vita, per la forte vocazione alle energie rinnovabili e per un settore turistico e culturale tra i più apprezzati al mondo.`
      },
      {
        id: 'repubblica-ceca',
        name: 'Repubblica Ceca',
        official: 'Repubblica Ceca (Cechia)',
        continent: 'Europa',
        region: 'Europa Centrale',
        capital: 'Praga',
        population: '~10.850.000',
        language: 'Ceco',
        currency: 'Corona ceca (CZK)',
        coverImg: 'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg',
        desc: `La Repubblica Ceca (o Cechia) è uno Stato senza sbocco al mare situato nell'Europa centrale, composto dalle storiche regioni di Boemia, Moravia e da una porzione della Slesia. La sua capitale, Praga, è stata per secoli un radioso crocevia di culture, sede imperiale del Sacro Romano Impero e uno dei centri intellettuali e artistici più importanti d'Europa.<br><br>
        La storia ceca è profondamente legata a movimenti di riforma religiosa e culturale, dalle lotte hussite del XV secolo fino al fiero spirito di resistenza contro il dominio asburgico. Nel corso del Novecento il Paese ha condiviso la complessa esperienza della Cecoslovacchia, attraversando la parentesi dei regimi totalitari prima di riconquistare la piena libertà con la pacifica "Rivoluzione di velluto" del 1989 e la successiva, amichevole separazione in due Stati nel 1993.<br><br>
        Membro dell'Unione Europea e della NATO dal 2004, la Repubblica Ceca vanta oggi un'economia industriale altamente sviluppata e diversificata — particolarmente rinomata nella manifattura avanzata e nella tecnologia —, unita a un patrimonio storico, architettonico e paesaggistico di inestimabile valore mondiale.`
      },
      {
        id: 'romania',
        name: 'Romania',
        official: 'Romania',
        continent: 'Europa',
        region: 'Europa Orientale / Balcanica',
        capital: 'Bucarest',
        population: '~19.050.000',
        language: 'Romeno',
        currency: 'Leu romeno (RON)',
        coverImg: 'https://images.unsplash.com/photo-1695045088081-1f37125905a2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Romania.svg',
        desc: `La Romania è uno Stato situato all'incrocio tra l'Europa centrale, orientale e sud-orientale, caratterizzato da un forte legame storico e linguistico con la romanità e bagnato a est dal Mar Nero, con il maestoso delta del Danubio. La sua storia antica affonda le radici nella civiltà dei Daci e nella successiva conquista da parte dell'Impero Romano, che diede origine all'identità culturale e alla lingua romanza del popolo romeno.<br><br>
        Nel corso del Medioevo e dell'età moderna, le regioni storiche di Valacchia, Moldavia e Transilvania hanno lottato a lungo per preservare la propria autonomia di fronte alle pressioni dei grandi imperi vicini (ottomano, asburgico e russo), arrivando all'unificazione nazionale nella seconda metà del XIX secolo. Nel Novecento, dopo il periodo monarchico e la drammatica parentesi della dittatura comunista terminata con la rivoluzione del 1989, la Romania ha intrapreso una profonda e solida transizione democratica ed economica.<br><br>
        Membro dell'Unione Europea e della NATO dal 2004, la Romania vanta oggi un'economia in forte sviluppo — particolarmente dinamica nei settori dell'information technology, dell'industria automobilistica e dell'energia —, unita a un patrimonio paesaggistico, architettonico e culturale straordinario, che spazia dai castelli medievali della Transilvania ai monasteri dipinti della Bucovina.`
      },
      {
        id: 'spagna',
        name: 'Spagna',
        official: 'Regno di Spagna',
        continent: 'Europa',
        region: 'Europa Meridionale / Penisola Iberica',
        capital: 'Madrid',
        population: '~48.600.000',
        language: 'Spagnolo (Castigliano)',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg',
        desc: `La Spagna è uno Stato membro dell'Unione Europea, situato prevalentemente nella penisola iberica nell'Europa meridionale. La sua storia millenaria è stata plasmata dal succedersi di grandi civiltà: dai Celti e Romani ai secoli della dominazione islamica di Al-Andalus, la cui fioritura culturale ha profondamente arricchito l'identità del Paese.<br><br>
        Con la Reconquista e l'unificazione sotto i Re Cattolici nel 1492, la Spagna diede il via all'Età delle Scoperte, costruendo uno dei più grandi imperi globali della storia e diffondendo la lingua e la cultura spagnola in gran parte delle Americhe. Dopo le complesse vicende politiche ed economiche dei secoli successivi e la transizione dalla dittatura alla monarchia parlamentare democratica sancita dalla Costituzione del 1978, il Paese ha conosciuto una straordinaria modernizzazione.<br><br>
        Oggi la Spagna è una delle principali economie europee, rinomata a livello globale per la straordinaria ricchezza del suo patrimonio artistico e culturale (fra i primi al mondo per siti UNESCO), per una fortissima vocazione al turismo internazionale, per l'eccellenza nelle infrastrutture e nelle energie rinnovabili, e per un invidiabile stile di vita.`
      },
      {
        id: 'svezia',
        name: 'Svezia',
        official: 'Regno di Svezia',
        continent: 'Europa',
        region: 'Europa Settentrionale / Scandinavia',
        capital: 'Stoccolma',
        population: '~10.550.000',
        language: 'Svedese',
        currency: 'Corona svedese (SEK)',
        coverImg: 'https://images.unsplash.com/photo-1775503297743-79cbf6aca396?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Sweden.svg',
        desc: `La Svezia è una monarchia costituzionale situata nell'Europa settentrionale, nella penisola scandinava, caratterizzata da un territorio vastissimo ricco di foreste, laghi glaciali e da un arcipelago costiero mozzafiato. La sua storia antica è profondamente legata all'epopea dei Vichinghi e dei vari regni tribali che nel corso del Medioevo unificarono la nazione, emergendo tra il XVII e l'inizio del XVIII secolo come una delle grandi potenze militari ed egemoniche dell'area baltica (l'Impero svedese).<br><br>
        A seguito delle guerre e del successivo ridimensionamento geopolitico, la Svezia ha intrapreso un percorso di pace e neutralità internazionale che dura da oltre due secoli, evitando i conflitti mondiali del Novecento. Nel corso del XX secolo il Paese ha sviluppato il celebre modello scandinavo (o "casa del popolo"), un avanzatissimo sistema di welfare sociale fondato su un'alta tassazione, fortissima uguaglianza economica, diritti universali e democrazia partecipativa.<br><br>
        Membro dell'Unione Europea dal 1995, la Svezia vanta un'economia altamente industrializzata e orientata all'innovazione tecnologica, alla ricerca scientifica d'avanguardia, alla digitalizzazione e a una leadership globale riconosciuta nella transizione verde e nella sostenibilità ambientale.`
      },
      {
        id: 'svizzera',
        name: 'Svizzera',
        official: 'Confederazione Svizzera',
        continent: 'Europa',
        region: 'Europa Centrale',
        capital: 'Berna (sede federale)',
        population: '~8.900.000',
        language: 'Tedesco, Francese, Italiano, Romancio',
        currency: 'Franco svizzero (CHF)',
        coverImg: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Switzerland.svg',
        desc: `La Svizzera è una repubblica federale alpina situata nell'Europa centrale, senza sbocco al mare e rinomata a livello globale per i suoi paesaggi montani mozzafiato, la stabilità politica e la tradizione secolare di neutralità internazionale. La sua storia ha origine nel 1291 con il patto di confederazione stretto dai cantoni originari della Svizzera centrale per difendere la propria autonomia dall'impero degli Asburgo.<br><br>
        Nel corso dei secoli la Confederazione si è progressivamente ampliata, accogliendo cantoni di lingue e culture diverse (tedesca, francese, italiana e romancia) e sviluppando un modello istituzionale unico al mondo, basato su una democrazia diretta fortemente radicata, sul federalismo spinto e sull'equilibrio tra le varie comunità linguistiche.<br><br>
        Pur non essendo membro dell'Unione Europea, la Svizzera è pienamente integrata nel continente attraverso numerosi accordi bilaterali e fa parte dello spazio Schengen. Il Paese vanta una delle economie più competitive, stabili e innovative del pianeta, eccellendo nei servizi finanziari, farmaceutici, nella manifattura di precisione e ospitando le sedi di innumerevoli organizzazioni internazionali e umanitarie.`
      },
      {
        id: 'ucraina',
        name: 'Ucraina',
        official: 'Ucraina',
        continent: 'Europa',
        region: 'Europa Orientale',
        capital: 'Kiev',
        population: '~36.700.000',
        language: 'Ucraino',
        currency: 'Grivna ucraina (UAH)',
        coverImg: 'https://images.unsplash.com/photo-1639341267320-2d062b250c0d?q=80&w=2729&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg',
        desc: `L'Ucraina è uno Stato situato nell'Europa orientale, il più esteso interamente compreso nei confini geografici del continente, bagnato a sud dal Mar Nero e dal Mar d'Azov. La sua storia affonda le radici nella fondazione della Rus' di Kiev nel IX secolo, un potentissimo stato medievale che ha rappresentato il culla culturale e spirituale condivisa dei popoli slavi orientali.<br><br>
        Nel corso dei secoli il territorio ucraino è stato a lungo conteso e dominato da varie potenze regionali (tra cui la Confederazione Polacco-Lituana, l'Impero Russo e l'Impero Austro-Ungarico), vedendo l'epopea dei leggendari cosacchi e tragiche fasi storiche nel Novecento, tra cui la drammatica carestia dell'Holodomor e le devastazioni della seconda guerra mondiale, prima dell'inclusione nell'Unione Sovietica. Con il crollo dell'URSS, l'Ucraina ha proclamato la propria indipendenza nel 1991, avviando un complesso percorso di costruzione statale e democratica culminato nella scelta irreversibile di integrazione euro-atlantica.<br><br>
        Oggi l'Ucraina combatte eroicamente per la propria libertà, la propria sovranità e l'integrità territoriale contro l'aggressione russa, difendendo i valori democratici dell'intera Europa. Il Paese vanta un territorio fertilissimo (il cosiddetto "granaio d'Europa"), un immenso patrimonio culturale e una straordinaria resilienza tecnologica, economica e civile.`
      },
      {
        id: 'ungheria',
        name: 'Ungheria',
        official: 'Ungheria',
        continent: 'Europa',
        region: 'Europa Centrale',
        capital: 'Budapest',
        population: '~9.600.000',
        language: 'Ungherese (Magiaro)',
        currency: 'Fiorino ungherese (HUF)',
        coverImg: 'https://images.unsplash.com/photo-1616432902940-b7a1acbc60b3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Hungary.svg',
        desc: `L'Ungheria è uno Stato senza sbocco al mare situato nell'Europa centrale, caratterizzato da una storia millenaria unica e da una lingua (il magiaro) che costituisce un'affascinante eccezione nel panorama linguistico indoeuropeo del continente. Fondato come regno cristiano nell'anno 1000 da Santo Stefano I, il Paese ha svolto per secoli il ruolo di baluardo e crocevia culturale tra l'Europa occidentale e le influenze orientali.<br><br>
        Dopo la lunga fase della dominazione ottomana, l'Ungheria fu integrata nell'Impero asburgico, divenendo nel 1867 la co-protagonista della prestigiosa monarchia duale dell'Impero Austro-Ungarico, con capitale a Budapest. Il Novecento ha profondamente segnato la nazione con il drastico ridimensionamento territoriale del Trattato di Trianon, la parentesi della Seconda guerra mondiale, la dura repressione sovietica e la storica e tragica rivoluzione anticomunista del 1956.<br><br>
        Membro dell'Unione Europea e della NATO dal 2004, l'Ungheria vanta un'economia industriale avanzata e fortemente orientata all'export (specialmente nei settori automobilistico e tecnologico), unita a un patrimonio artistico, termale e monumentale di straordinaria ricchezza, dominato dalle meraviglie architettoniche che si affacciano sulle sponde del Danubio.`
      },
      {
        id: 'vaticano',
        name: 'Città del Vaticano',
        official: 'Stato della Città del Vaticano',
        continent: 'Europa',
        region: 'Europa Meridionale / Italia',
        capital: 'Città del Vaticano',
        population: '~800',
        language: 'Italiano (ufficiale dello Stato), Latino (ufficiale della Santa Sede)',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/va.svg',
        desc: `La Città del Vaticano è uno Stato indipendente a sovranità extraterritoriale, il più piccolo al mondo sia per estensione territoriale che per popolazione, interamente racchiuso nel tessuto urbano della città di Roma. Nato ufficialmente l'11 febbraio 1929 con la firma dei Patti Lateranensi tra la Santa Sede e il Regno d'Italia, esso rappresenta il visibile e autonomo supporto istituzionale alla missione spirituale universale del Papa, vescovo di Roma e sommo pontefice della Chiesa cattolica.<br><br>
        La storia dei luoghi vaticani affonda le radici nell'antichità romana e nel martirio dell'apostolo Pietro, sulla cui tomba sorse nel IV secolo la prima basilica costantiniana. Nel corso dei secoli il papato ha esercitato un potere temporale esteso su vasti territori dell'Italia centrale (lo Stato Pontificio), conclusosi nel 1870 con la presa di Roma e la conseguente "questione romana", risolta poi in epoca moderna con la creazione dell'attuale enclave vaticana.<br><br>
        Nonostante le ridottissime dimensioni geografiche, la Città del Vaticano e la Santa Sede esercitano un'influenza culturale, diplomatica e religiosa di portata globale. Il piccolo Stato custodisce tesori artistici e architetturali inestimabili — tra cui la Basilica di San Pietro, i Palazzi Apostolici e i Musei Vaticani con la Cappella Sistina —, che attirano ogni anno milioni di visitatori e pellegrini da ogni angolo del pianeta.`
      },
      {
        id: 'lettonia',
        name: 'Lettonia',
        official: 'Repubblica di Lettonia',
        continent: 'Europa',
        region: 'Europa Settentrionale / Baltico',
        capital: 'Riga',
        population: '~1.870.000',
        language: 'Lettone',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1567669721460-221b82865ee0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Latvia.svg',
        desc: `La Lettonia è una repubblica baltica situata nell'Europa settentrionale, bagnata dal Mar Baltico e caratterizzata da ampie foreste, fiumi navigabili e da una ricca tradizione culturale legata ai popoli baltici e finnici. La sua storia è profondamente segnata dalla posizione strategica commerciale e militare del suo territorio, che per secoli ha visto il passaggio e il dominio di potenze straniere, dai Cavalieri Portaspada germanici alla Svezia, alla Polonia e all'Impero Russo.<br><br>
        Dopo aver dichiarato la propria indipendenza nel 1918 al termine della prima guerra mondiale, la Lettonia subì la tragica parentesi dell'occupazione sovietica e nazista durante la seconda guerra mondiale, venendo annessa all'Unione Sovietica. Nel 1991, sulla scia della "Rivoluzione Cantata", il Paese ha riconquistato la piena indipendenza, riaffermando con forza la propria identità democratica ed europea.<br><br>
        Membro dell'Unione Europea e della NATO dal 2004, la Lettonia vanta oggi un'economia moderna e aperta, fortemente digitalizzata e orientata ai servizi, alla logistica e all'innovazione tecnologica, unita a un patrimonio storico e architettonico straordinario — simboleggiato dallo splendido centro in stile Art Nouveau della capitale Riga — e a una vibrante tradizione di festival corali e culturali riconosciuti dall'UNESCO.`
      },
      {
        id: 'lituania',
        name: 'Lituania',
        official: 'Repubblica di Lituania',
        continent: 'Europa',
        region: 'Europa Settentrionale / Baltico',
        capital: 'Vilnius',
        population: '~2.860.000',
        language: 'Lituano',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1660562278746-72e961bb9644?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_Lithuania.svg',
        desc: `La Lituania è la più meridionale e la più popolosa delle tre repubbliche baltiche, situata nell'Europa settentrionale e bagnata dal Mar Baltico. La sua storia antica è particolarmente gloriosa: tra il XIV e il XVI secolo il Granducato di Lituania fu uno degli Stati più estesi e potenti d'Europa, estendendosi dal Mar Baltico fino al Mar Nero, prima di unirsi stabilmente con la Polonia.<br><br>
        Dopo la perdita dell'indipendenza e la lunga sottomissione all'Impero russo nel corso dell'Ottocento, la Lituania riconquistò la propria sovranità nel 1918. Tragicamente travolta dal secondo conflitto mondiale e dalla successiva occupazione sovietica, fu la prima repubblica sovietica a dichiarare la propria restaurata indipendenza nel 1990, aprendo la strada al crollo definitivo dell'URSS.<br><br>
        Membro dell'Unione Europea e della NATO dal 2004, la Lituania si distingue oggi per un'economia fortemente dinamica e orientata alle tecnologie avanzate, al settore fintech e alle scienze della vita, unita a un patrimonio storico, culturale e architettonico di immenso valore, con il magnifico centro barocco di Vilnius e il suggestivo paesaggio dunale dell'istmo di Curonia riconosciuti dall'UNESCO.`
      },
      {
        id: 'lussemburgo',
        name: 'Lussemburgo',
        official: 'Granducato di Lussemburgo',
        continent: 'Europa',
        region: 'Europa Occidentale',
        capital: 'Lussemburgo',
        population: '~660.000',
        language: 'Lussemburghese, Francese, Tedesco',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1777287649052-3547f837040f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_Luxembourg.svg',
        desc: `Il Lussemburgo è un piccolo Stato sovrano situato nell'Europa occidentale, retto dalla forma del granducato costituzionale, che lo rende l'unico granducato sovrano rimasto al mondo. La sua storia millenaria è strettamente legata alla sua formidabile posizione strategica e militare, dominata dall'imponente fortezza di Lussemburgo — storicamente nota come la "Gibilterra del Nord" —, che ha visto il succedersi e l'influenza delle grandi potenze europee, dai duchi di Borgogna agli Asburgo, fino alla Francia e alla Prussia.<br><br>
        Dichiarato ufficialmente neutrale nel XIX secolo e duramente segnato dalle occupazioni durante le due guerre mondiali, il Lussemburgo ha scelto nel dopoguerra una strada di fortissima integrazione internazionale. È stato infatti uno dei sei Paesi fondatori delle comunità europee e ospita oggi alcune delle istituzioni giudiziarie e finanziarie chiave dell'Unione Europea.<br><br>
        Nonostante le ridotte dimensioni territoriali, il Lussemburgo vanta oggi il PIL pro capite nominale più elevato al mondo, un'economia altamente sviluppata focalizzata sui servizi finanziari internazionali, sul settore tecnologico e spaziale, e un livello di multiculturalismo e benessere tra i più alti del pianeta.`
      },
      {
        id: 'malta',
        name: 'Malta',
        official: 'Repubblica di Malta',
        continent: 'Europa',
        region: 'Europa Meridionale / Mediterraneo',
        capital: 'La Valletta',
        population: '~540.000',
        language: 'Maltese, Inglese',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1587974928552-4f4aac51b45d?q=80&w=2706&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Malta.svg',
        desc: `Malta è uno Stato insulare situato nel cuore del Mar Mediterraneo, nell'Europa meridionale, costituito da un arcipelago di grande rilevanza strategica ed economica. La sua storia millenaria è un affascinante mosaico di influenze culturali mediterranee ed europee: abitata fin dalla preoperiodità (famosa per i suoi templi megalitici tra i più antichi al mondo), l'isola è stata dominata nel corso dei secoli da Fenici, Cartaginesi, Romani, Arabi, Normanni e dall'Ordine dei Cavalieri di San Giovanni (i Cavalieri di Malta), che difesero eroicamente l'arcipelago durante il celebre Grande Assedio del 1565.<br><br>
        Successivamente sotto il dominio britannico — periodo durante il quale l'isola giocò un ruolo cruciale e di straordinario coraggio logistico e militare durante la seconda guerra mondiale (ricevendo la medaglia della George Cross) —, Malta ha ottenuto l'indipendenza nel 1964 e si è proclamata repubblica nel 1974.<br><br>
        Membro dell'Unione Europea dal 2004 e della zona euro, Malta vanta oggi un'economia dinamica e diversificata, basata sui servizi finanziari internazionali, sulla tecnologia digitale, sulla cantieristica navale e su un florido turismo culturale e balneare, valorizzato da uno straordinario patrimonio storico e architettonico riconosciuto dall'UNESCO.`
      },
      {
        id: 'monaco',
        name: 'Principato di Monaco',
        official: 'Principato di Monaco',
        continent: 'Europa',
        region: 'Europa Occidentale / Costa Azzurra',
        capital: 'Monaco (Monaco-Ville)',
        population: '~39.000',
        language: 'Francese',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1581819896533-f8ab6767ce7e?q=80&w=2701&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Monaco.svg',
        desc: `Il Principato di Monaco è una città-stato sovrana situata sulla Costa Azzurra nell'Europa occidentale, bagnata dal Mar Mediterraneo ed è il secondo Stato indipendente più piccolo al mondo per estensione territoriale dopo la Città del Vaticano. La sua storia è indissolubilmente legata alla dinastia della Casa di Grimaldi, che conquistò la rocca nel 1297 e governa il principato quasi ininterrottamente da oltre sette secoli, affrontando alterne vicende tra protezioni straniere (spagnole, sarde e francesi).<br><br>
        Trasformatosi nel corso del XIX e XX secolo in una celebre e lussuosa meta turistica d'élite — anche grazie all'apertura del famosissimo Casinò di Monte Carlo e allo sviluppo infrastrutturale —, Monaco ha saputo coniugare la tradizione monarchica costituzionale con una modernizzazione economica lungimirante.<br><br>
        Pur non essendo membro ufficiale dell'Unione Europea, il Principato adotta l'euro tramite accordi monetari speciali ed è pienamente integrato nel mercato europeo. Oggi Monaco è noto a livello globale per essere uno dei centri finanziari e immobiliari più esclusivi del pianeta, per ospitare eventi di risonanza mondiale come il Gran Premio di Formula 1 e il torneo di tennis di Monte Carlo, e per la forte attenzione del governo verso lo sviluppo sostenibile e la tutela ambientale dei mari.`
      },
      {
        id: 'montenegro',
        name: 'Montenegro',
        official: 'Montenegro',
        continent: 'Europa',
        region: 'Europa Sud-orientale / Balcani',
        capital: 'Podgorica (capitale amministrativa), Cetinje (capitale storica)',
        population: '~620.000',
        language: 'Montenegrino',
        currency: 'Euro (€) [adozione unilaterale]',
        coverImg: 'https://images.unsplash.com/photo-1614122027743-50a9e6e8002f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Flag_of_Montenegro.svg',
        desc: `Il Montenegro è uno Stato sovrano situato nell'Europa sud-orientale, affacciato sul Mar Adriatico e caratterizzato da un territorio montuoso spettacolare che precipita direttamente verso il mare, dando vita a fiordi maestosi come le Bocche di Cattaro. La sua storia antica è fiera e indipendente: a differenza di gran lunga parte dei Balcani, il Montenegro riuscì a mantenere a lungo una forte autonomia nei secoli di dominazione ottomana, governato storicamente da principi-vescovi (i Vladika) della dinastia Petrović-Njegoš.<br><br>
        Unito alla Serbia nel corso del XX secolo all'interno del Regno di Jugoslavia e successivamente della Repubblica Federale di Jugoslavia, il Montenegro ha riconquistato pacificamente la piena indipendenza statale in seguito a un referendum storico tenutosi nel 2006. Da allora, il Paese ha intrapreso un solido percorso di modernizzazione e integrazione euro-atlantica.<br><br>
        Membro della NATO dal 2017 e principale candidato all'adesione all'Unione Europea, il Montenegro adotta unilateralmente l'euro e vanta un'economia fortemente orientata al turismo internazionale d'alta gamma, alla valorizzazione di parchi nazionali incontaminati (come il Parco Nazionale del Durmitor) e alla salvaguardia di un patrimonio storico-culturale di inestimabile valore.`
      },
      {
        id: 'macedonia-del-nord',
        name: 'Macedonia del Nord',
        official: 'Repubblica di Macedonia del Nord',
        continent: 'Europa',
        region: 'Europa Sud-orientale / Balcani',
        capital: 'Skopje',
        population: '~1.830.000',
        language: 'Macedone, Albanese',
        currency: 'Denaro macedone (MKD)',
        coverImg: 'https://images.unsplash.com/photo-1588519068423-28a88a32ee69?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/mk.svg',
        desc: `La Macedonia del Nord è uno Stato senza sbocco al mare situato nella penisola balcanica nell'Europa sud-orientale, culla di un crocevia di antiche civiltà e culture. La sua storia affonda le radici nell'antichità classica — legata al Regno di Macedonia di Filippo II e Alessandro Magno —, per poi attraversare i secoli di dominazione romana, bizantina e ottomana, che hanno plasmato profondamente il ricco tessuto multiculturale e architettonico del territorio.<br><br>
        Nel corso del XX secolo il Paese ha fatto parte della Jugoslavia come repubblica socialista, conquistando pacificamente l'indipendenza nel 1991 in seguito alla dissoluzione federale. Dopo decenni di complesse questioni diplomatiche regionali riguardo alla denominazione statale, risolte nel 2019 con lo storico Accordo di Prespa che ha portato ufficialmente al nome di Macedonia del Nord, il Paese ha consolidato la propria vocazione euro-atlantica.<br><br>
        Membro della NATO dal 2020 e Paese candidato all'adesione all'Unione Europea, la Macedonia del Nord vanta un'economia in transizione orientata all'industria manifatturiera e tecnologica, unita a uno straordinario patrimonio naturalistico dominato da laghi millenari come quello di Ocrida (patrimonio UNESCO) e da paesaggi montani di rara bellezza.`
      },
      {
        id: 'regno-unito',
        name: 'Regno Unito',
        official: 'Regno Unito di Gran Bretagna e Irlanda del Nord',
        continent: 'Europa',
        region: 'Europa Settentrionale / Isole Britanniche',
        capital: 'Londra',
        population: '~67.700.000',
        language: 'Inglese',
        currency: 'Sterlina britannica (GBP)',
        coverImg: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/gb.svg',
        desc: `Il Regno Unito è uno Stato insulare situato nell'Europa settentrionale, composto da quattro nazioni costitutive: Inghilterra, Scozia, Galles e Irlanda del Nord. La sua storia ha plasmato profondamente il mondo moderno: culla della Rivoluzione Industriale alla fine del XVIII secolo, il Paese ha guidato per secoli il più grande impero globale della storia, diffondendo la lingua inglese, il sistema parlamentare di Westminster e il diritto comune (common law) in ogni angolo del pianeta.<br><br>
        Vincitore dei grandi conflitti mondiali del XX secolo a fianco degli Alleati, il Regno Unito è stato membro fondatore delle Nazioni Unite e potenza nucleare, mantenendo un ruolo geopolitico, diplomatico e finanziario di primissimo piano a livello internazionale (con capitale a Londra, uno dei principali hub finanziari ed economici del globo).<br><br>
        Pur avendo concluso nel 2020 la sua storica appartenenza all'Unione Europea a seguito del processo noto come Brexit, il Regno Unito resta una delle economie più avanzate, competitive e influenti al mondo, leader globale nei settori della ricerca scientifica, dell'alta finanza, dell'industria aerospaziale, della tecnologia e di una straordinaria produzione culturale e artistica.`
      },
      {
        id: 'san-marino',
        name: 'San Marino',
        official: 'Serenissima Repubblica di San Marino',
        continent: 'Europa',
        region: 'Europa Meridionale / Italia',
        capital: 'Città di San Marino',
        population: '~33.600',
        language: 'Italiano',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1679112600374-0ac944dabba0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Flag_of_San_Marino.svg',
        desc: `La Serenissima Repubblica di San Marino è una micro-nazione sovrana situata nell'Europa meridionale, interamente circondata dal territorio italiano tra l'Emilia-Romagna e le Marche. Fondata secondo la tradizione nel 301 d.C. dal mastro pietraio Marino (poi canonizzato), è considerata la repubblica più antica del mondo ancora esistente, avendo preservato la propria libertà e le proprie istituzioni democratiche attraverso i secoli.<br><br>
        L'ordinamento istituzionale di San Marino è unico e di matrice medievale: il potere esecutivo è esercitato collegialmente da due Capitani Reggenti, eletti ogni sei mesi dal Consiglio Grande e Generale (il parlamento monocamerale). Nel corso della storia, la Repubblica ha saputo difendere la sua autonomia diplomatica e territoriale — ottenendo anche il riconoscimento da parte di Napoleone e delle potenze europee nel Congresso di Vienna —, offrendo rifugio a numerosi perseguitati politici durante il Risorgimento italiano e la seconda guerra mondiale.<br><br>
        Pur non facendo parte dell'Unione Europea, San Marino adotta l'euro tramite accordi monetari con l'Italia ed è pienamente integrato nei circuiti economici e culturali del continente. Il Paese vanta un'economia stabile e avanzata, basata sui servizi finanziari, sul commercio e su un turismo culturale e numismatico d'eccellenza, valorizzato dalle spettacolari fortificazioni sul Monte Titano riconosciute patrimonio UNESCO.`
      },
      {
        id: 'serbia',
        name: 'Serbia',
        official: 'Repubblica di Serbia',
        continent: 'Europa',
        region: 'Europa Sud-orientale / Balcani',
        capital: 'Belgrado',
        population: '~6.650.000',
        language: 'Serbo',
        currency: 'Dinaro serbo (RSD)',
        coverImg: 'https://images.unsplash.com/photo-1613601740367-410ae03b2ec7?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Serbia.svg',
        desc: `La Serbia è uno Stato senza sbocco al mare situato nella penisola balcanica, nell'Europa sud-orientale, posizionato strategicamente al crocevia tra l'Europa centrale e i Balcani meridionali, lungo il corso del fiume Danubio. La sua storia millenaria è densa e complessa: emersa come regno medievale di grande splendore sotto la dinastia dei Nemanjić nel XII e XIII secolo, la nazione subì in seguito la lunga e profonda dominazione dell'Impero ottomano, che lasciò un'impronta duratura sulla cultura e sul territorio.<br><br>
        Risorta come regno indipendente nel XIX secolo, la Serbia fu il fulcro della creazione della Jugoslavia nel XX secolo, attraversando tutte le drammatiche fasi storiche del Paese fino alla dissoluzione federale degli anni novanta e alla successiva transizione democratica. Con la separazione pacifica dal Montenegro nel 2006, la Serbia ha riacquistato la piena e attuale sovranità statale.<br><br>
        Paese candidato all'adesione all'Unione Europea, la Serbia vanta oggi un'economia in forte modernizzazione e crescita — trainata dai settori manifatturiero, energetico e tecnologico —, oltre a un ricco patrimonio culturale, a una vibrante vita culturale e a tradizioni storiche e artistiche di straordinario valore.`
      },
      {
        id: 'slovacchia',
        name: 'Slovacchia',
        official: 'Repubblica Slovacca',
        continent: 'Europa',
        region: 'Europa Centrale',
        capital: 'Bratislava',
        population: '~5.420.000',
        language: 'Slovacco',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1620283110809-3ff3adfe057b?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Slovakia.svg',
        desc: `La Slovacchia è uno Stato sovrano senza sbocco al mare situato nell'Europa centrale, caratterizzato da un territorio prevalentemente montuoso — dominato dalla catena dei Carpazi e dai monti Tatra — e da una ricca tradizione culturale e architettonica. La sua storia è stata a lungo legata a quella dei popoli vicini: dopo il periodo medievale del Principato di Nitra e del Regno d'Ungheria, il territorio slovacco ha fatto parte dell'Impero asburgico per quasi un millennio.<br><br>
        Nel corso del XX secolo la Slovacchia ha condiviso la complessa e fruttuosa esperienza statale della Cecoslovacchia, nata nel 1918 e attraversata dalle drammatiche parentesi dei totalitarismi e dalla successiva liberazione con la "Rivoluzione di velluto". Il 1° gennaio 1993, in seguito a un processo di separazione politico pacifico e consensuale (noto come il "divorzio di velluto"), la Slovacchia è divenuta uno Stato indipendente.<br><br>
        Membro dell'Unione Europea, della zona euro e della NATO dal 2004, la Slovacchia si distingue oggi per un'economia fortemente industrializzata ed esportatrice — essendo uno dei principali hub mondiali per la produzione automobilistica e tecnologica pro capite —, unita a un patrimonio paesaggistico straordinario ricco di castelli medievali, parchi nazionali e città storiche di inestimabile valore.`
      },
      {
        id: 'slovenia',
        name: 'Slovenia',
        official: 'Repubblica di Slovenia',
        continent: 'Europa',
        region: 'Europa Centrale / Alpina / Balcanica',
        capital: 'Lubiana',
        population: '~2.120.000',
        language: 'Sloveno',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1478088913771-e3a36f50bb63?q=80&w=2719&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Flag_of_Slovenia.svg',
        desc: `La Slovenia è uno Stato sovrano situato nell'Europa centrale e meridionale, dove le Alpi incontrano il Mar Adriatico e la pianura pannonica. La sua storia affonda le radici nell'insediamento dei popoli slavi nel VI secolo e nella successiva sottomissione millenaria al Sacro Romano Impero e alla monarchia degli Asburgo, che hanno plasmato profondamente la cultura, l'architettura e la struttura sociale del Paese.<br><br>
        Nel corso del XX secolo la Slovenia ha fatto parte del Regno dei Serbi, Croati e Sloveni e successivamente della Repubblica Socialista Federale di Jugoslavia. Nel 1991, in seguito a un plebiscito e a un breve conflitto di indipendenza, è stata la prima repubblica jugoslava a staccarsi con successo, inaugurando una fase di rapida e virtuosa transizione democratica ed economica.<br><br>
        Membro dell'Unione Europea, della zona euro e della NATO dal 2004, la Slovenia vanta oggi standard di vita elevatissimi, un'economia fortemente industrializzata, orientata all'export e all'innovazione tecnologica, e un territorio incontaminato caratterizzato da meraviglie naturali straordinarie, come il Lago di Bled e le grotte carsiche di Postumia.`
      },
      {
        id: 'albania',
        name: 'Albania',
        official: 'Repubblica d\'Albania',
        continent: 'Europa',
        region: 'Europa Sud-orientale / Balcani',
        capital: 'Tirana',
        population: '~2.750.000',
        language: 'Albanese',
        currency: 'Lek albanese (ALL)',
        coverImg: 'https://images.unsplash.com/photo-1758838344709-9414ca9dadc3?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/al.svg',
        desc: `L'Albania è uno Stato sovrano situato nella penisola balcanica nell'Europa sud-orientale, affacciato sul Mar Adriatico e sullo Ionio, con uno splendido litorale e un entroterra aspro e montuoso. La sua storia affonda le radici nelle antiche popolazioni illiriche, per poi attraversare il dominio romano e bizantino e la leggendaria resistenza guidata nel XV secolo dall'eroe nazionale Giorgio Castriota Scanderbeg contro l'espansione dell'Impero ottomano, sotto il quale il Paese visse per diversi secoli.<br><br>
        Dopo aver dichiarato l'indipendenza nel 1912 e aver attraversato le turbolenze del XX secolo — inclusa la dittatura comunista più isolata e rigida d'Europa sotto il regime di Enver Hoxha —, l'Albania ha intrapreso agli inizi degli anni '90 una complessa e coraggiosa transizione verso la democrazia parlamentare e l'economia di mercato.<br><br>
        Membro della NATO dal 2009 e Paese candidato ufficiale all'adesione all'Unione Europea, l'Albania vive oggi una forte stagione di crescita economica, turistica e culturale, valorizzando il suo ricco patrimonio archeologico (come le antiche città di Butrinto e Argirocastro, protette dall'UNESCO) e un'accoglienza straordinaria.`
      },
      {
        id: 'andorra',
        name: 'Andorra',
        official: 'Principato di Andorra',
        continent: 'Europa',
        region: 'Europa Sud-occidentale / Pirenei',
        capital: 'Andorra la Vella',
        population: '~80.000',
        language: 'Catalano (ufficiale), Spagnolo, Francese',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1611917436955-d21c1999520c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ad.svg',
        desc: `Il Principato di Andorra è un microstato sovrano situato tra le montagne dei Pirenei orientali, incastonato tra la Spagna e la Francia nell'Europa sud-occidentale. La sua storia è unica e affascinante: secondo la tradizione, l'indipendenza del territorio fu concessa da Carlo Magno nell'VIII secolo in cambio dell'aiuto contro i Mori. Nel 1278, attraverso un trattato storico (il Pariatge), fu istituito un co-principato feudale condiviso, una forma di governo che sopravvive tuttora, rendendo Andorra l'unico Stato al mondo ad avere come capi di Stato congiunti due "coprincipi": il vescovo di Seo de Urgel (in Spagna) e il presidente della Repubblica francese.<br><br>
        Per secoli isolato e prevalentemente rurale, nel corso del XX secolo Andorra ha vissuto una trasformazione economica straordinaria, sviluppandosi come un modernissimo polo turistico internazionale, celebre per le stazioni sciistiche d'alta quota, il commercio e lo status di giurisdizione fiscale favorevole.<br><br>
        Pur non essendo membro a pieno titolo dell'Unione Europea, Andorra adotta l'euro ed intrattiene accordi di integrazione doganale e commerciale con l'UE, vantando una qualità e un'aspettativa di vita tra le più alte al mondo, immerse in un contesto naturalistico alpino protetto e di straordinaria bellezza.`
      },
      {
        id: 'armenia',
        name: 'Armenia',
        official: 'Repubblica d\'Armenia',
        continent: 'Europa',
        region: 'Europa Orientale / Transcaucasia',
        capital: 'Erevan',
        population: '~2.980.000',
        language: 'Armeno',
        currency: 'Dram armeno (AMD)',
        coverImg: 'https://images.unsplash.com/photo-1762007275508-ac986ff0f2ea?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/am.svg',
        desc: `L'Armenia è uno Stato sovrano senza sbocco al mare situato nella regione caucasica, geograficamente al crocevia tra l'Europa orientale e l'Asia occidentale, ma storicamente e culturalmente profondamente legato all'Europa. La sua è una delle storie più antiche e drammatiche del mondo: l'Armenia fu il primo Stato al mondo ad adottare ufficialmente il Cristianesimo come religione di Stato nel 301 d.C., sviluppando un alfabeto unico e un patrimonio spirituale e architettonico straordinario, fatto di monasteri millenari incastonati in paesaggi montani spettacolari come il Monte Ararat.<br><br>
        Nel corso dei secoli il popolo armeno ha subito dominazioni da parte di vari imperi (persiano, bizantino, ottomano e russo) e ha affrontato immani tragedie, tra cui il Medts Yeghern (il genocidio armeno) all'inizio del XX secolo. Dopo la parentesi sovietica come Repubblica Socialista Sovietica Armena, l'Armenia ha riconquistato la piena indipendenza nel 1991, avviando una complessa transizione democratica e istituzionale.<br><br>
        Oggi l'Armenia è una repubblica parlamentare fortemente orientata alla cooperazione con le istituzioni europee, celebre per una vibrante cultura, una diaspora globale influente e un settore tecnologico e digitale in fortissima espansione.`
      },
      {
        id: 'azerbaigian',
        name: 'Azerbaigian',
        official: 'Repubblica dell\'Azerbaigian',
        continent: 'Europa',
        region: 'Europa Orientale / Caucaso Meridionale',
        capital: 'Baku',
        population: '~10.140.000',
        language: 'Azero',
        currency: 'Manat azero (AZN)',
        coverImg: 'https://images.unsplash.com/photo-1596306499398-8d88944a5ec4?q=80&w=2312&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/az.svg',
        desc: `L'Azerbaigian è uno Stato transcontinentale situato nella regione del Caucaso meridionale, al crocevia tra l'Europa orientale e l'Asia occidentale, bagnato a est dal Mar Caspio. Noto storicamente come la "Terra del Fuoco" per via dei suoi immensi giacimenti di petrolio e gas naturale (e dei fenomeni naturali di fuoriuscita di gas infiammabile), l'Azerbaigian vanta una storia antichissima legata agli antichi regni caucasici, alla Persia e alla via della seta.<br><br>
        Dopo secoli di dominazione persiana e successivamente russa, nel 1918 l'Azerbaigian fondò la Repubblica Democratica di Azerbaigian, la prima repubblica parlamentare a maggioranza musulmana del mondo islamico, prima di essere integrato nell'Unione Sovietica nel 1920 come RSS Azera. Con il crollo dell'URSS, il Paese ha proclamato la propria indipendenza nel 1991.<br><br>
        Oggi l'Azerbaigian è una repubblica presidenziale con un'economia fortemente trainata dal settore energetico e da imponenti investimenti di modernizzazione infrastrutturale, concentrati soprattutto nella sua splendida capitale Baku, che unisce suggestivi monumenti medievali (come la Città Vecchia fortificata, patrimonio UNESCO) a un'architettura avveniristica e ultramoderna.`
      },
      {
        id: 'bielorussia',
        name: 'Bielorussia',
        official: 'Repubblica di Bielorussia',
        continent: 'Europa',
        region: 'Europa Orientale',
        capital: 'Minsk',
        population: '~9.200.000',
        language: 'Bielorusso, Russo',
        currency: 'Rublo bielorusso (BYN)',
        coverImg: 'https://images.unsplash.com/photo-1780232579960-999eb68d59de?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/by.svg',
        desc: `La Bielorussia è uno Stato senza sbocco al mare situato nell'Europa orientale, caratterizzato da un territorio prevalentemente pianeggiante e ricco di fitte foreste secolari (tra cui la celebre riserva di Białowieża, patrimonio UNESCO) e di migliaia di laghi e paludi. La sua storia medievale è profondamente legata alla Rus' di Kiev e successivamente al potente Granducato di Lituania e alla Confederazione polacco-lituana.<br><br>
        Nel corso del XX secolo il Paese fu teatro di devastanti conflitti, subendo distruzioni immani durante la seconda guerra mondiale prima di essere ricostruito come Repubblica Socialista Sovietica Bielorussa all'interno dell'URSS. Con il crollo sovietico, la Bielorussia ha proclamato l'indipendenza nel 1991, conservando stretti legami politici ed economici con la Russia.<br><br>
        Nonostante le complessità geopolitiche e il contesto di forte accentramento statale, la Bielorussia vanta un'economia industriale avanzata focalizzata sulla produzione di macchinari pesanti, veicoli agricoli e un settore IT e tecnologico di rilievo internazionale (incentrato sul Parco dell'Alta Tecnologia di Minsk), unita a un ricco patrimonio di monumenti storici e castelli medievali.`
      },
      {
        id: 'bosnia-erzegovina',
        name: 'Bosnia-Erzegovina',
        official: 'Bosnia ed Erzegovina',
        continent: 'Europa',
        region: 'Europa Sud-orientale / Balcani',
        capital: 'Sarajevo',
        population: '~3.200.000',
        language: 'Bosniaco, Croato, Serbo',
        currency: 'Marco convertibile bosniaco (BAM)',
        coverImg: 'https://images.unsplash.com/photo-1609336254805-004952c267cb?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ba.svg',
        desc: `La Bosnia-Erzegovina è uno Stato sovrano situato nella penisola balcanica, nell'Europa sud-orientale, caratterizzato da un territorio montuoso spettacolare e da una straordinaria e millenaria convivenza di culture, religioni ed etnie differenti. La sua storia affonda le radici nel regno medievale di Bosnia, per poi attraversare oltre quattro secoli di dominazione ottomana — che hanno impresso un segno profondo nell'architettura, nelle tradizioni e nella cultura urbana — e la successiva amministrazione austro-ungarica.<br><br>
        Il XX secolo ha segnato profondamente il Paese: teatro dell'attentato di Sarajevo nel 1914 che fece scoppiare la prima guerra mondiale, la Bosnia-Erzegovina è stata poi una delle repubbliche centrali della Jugoslavia socialista. Tra il 1992 e il 1995, in seguito alla dissoluzione jugoslava, il Paese fu dilaniato da una tragica guerra civile, conclusasi con gli Accordi di Dayton che istituirono l'attuale complessa struttura istituzionale federale.<br><br>
        Oggi la Bosnia-Erzegovina è un Paese candidato all'adesione all'Unione Europea, impegnato in un costante percorso di riconciliazione e sviluppo, e celebre a livello globale per la bellezza dei suoi fiumi, dei ponti storici (come il celebre Stari Most a Mostar, patrimonio UNESCO) e per la vibrante e multiculturale capitale Sarajevo.`
      },
      {
        id: 'georgia',
        name: 'Georgia',
        official: 'Georgia',
        continent: 'Europa',
        region: 'Europa Orientale / Caucaso Meridionale',
        capital: 'Tbilisi',
        population: '~3.700.000',
        language: 'Georgiano',
        currency: 'Lari georgiano (GEL)',
        coverImg: 'https://images.unsplash.com/photo-1771634915026-5a778ee7be19?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ge.svg',
        desc: `La Georgia è uno Stato transcontinentale situato nel Caucaso meridionale, all'incrocio tra l'Europa orientale e l'Asia occidentale, bagnato a ovest dal Mar Nero. La sua storia millenaria è fiera e ricca di leggende: culla di antiche civiltà (noto ai Greci come l'antico regno della Colchide, la terra del Vello d'Oro), la Georgia fu uno dei primi Stati al mondo ad adottare il Cristianesimo nel IV secolo e visse la sua massima fioritura culturale e militare nel XII secolo durante l'Età d'oro georgiana.<br><br>
        Dopo secoli di dominazioni e pressioni da parte dei vicini imperi ottomano e persiano, la Georgia fu annessa all'Impero russo nel XIX secolo. Nel XX secolo ha fatto parte dell'Unione Sovietica fino a proclamare la propria indipendenza nel 1991, avviando da allora un forte e chiaro orientamento politico ed economico verso le istituzioni euro-atlantiche.<br><br>
        Paese candidato all'adesione all'Unione Europea, la Georgia vanta oggi una cultura straordinariamente unica — con un proprio alfabeto millenario, una delle tradizioni vinicole più antiche del mondo (risalente a ottomila anni fa e protetta dall'UNESCO) e una celeberrima e calorosa ospitalità —, immersa in paesaggi mozzafiato che uniscono le vette innevate del Caucaso maggiore alle coste subtropicali del Mar Nero.`
      },
      {
        id: 'kazakistan',
        name: 'Kazakistan',
        official: 'Repubblica del Kazakistan',
        continent: 'Europa',
        region: 'Asia Centrale / Europa Orientale',
        capital: 'Astana',
        population: '~20.000.000',
        language: 'Kazako, Russo',
        currency: 'Tenge kazako (KZT)',
        coverImg: 'https://images.unsplash.com/photo-1666975823342-3b755b3784d4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/kz.svg',
        desc: `Il Kazakistan è uno Stato transcontinentale situato principalmente in Asia centrale e per una piccola porzione a ovest del fiume Ural nell'Europa orientale, risultando il nono Paese più esteso al mondo e il più grande stato al mondo senza sbocco al mare. La sua storia è profondamente legata alle antiche tribù nomadi delle steppe eurasiatiche, alle rotte commerciali della Via della Seta e alla successiva unificazione dei clan kazaki nel XV secolo.<br><br>
        Incorporato nell'Impero russo e successivamente divenuto una repubblica costitutiva dell'Unione Sovietica (RSS Kazaka) — con la creazione di importanti basi aerospaziali come il cosmodromo di Baikonur —, il Kazakistan ha proclamato la propria indipendenza il 16 dicembre 1991, in seguito al dissolvimento dell'URSS.<br><br>
        Oggi il Kazakistan è la potenza economica dominante dell'Asia centrale, grazie a immense riserve di petrolio, gas naturale e minerali preziosi. Il Paese si distingue sulla scena internazionale per una politica estera multilineare, un imponente sviluppo urbanistico e architettonico della capitale Astana e una forte spinta alla modernizzazione tecnologica ed economica.`
      },
      {
        id: 'moldavia',
        name: 'Moldavia',
        official: 'Repubblica di Moldavia',
        continent: 'Europa',
        region: 'Europa Orientale',
        capital: 'Chișinău',
        population: '~2.500.000',
        language: 'Romeno (Moldavo)',
        currency: 'Leu moldavo (MDL)',
        coverImg: 'https://images.unsplash.com/photo-1600159953570-df048e507c7b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/md.svg',
        desc: `La Moldavia (ufficialmente Repubblica di Moldavia) è uno Stato senza sbocco al mare situato nell'Europa orientale, incastonato tra la Romania a ovest e l'Ucraina a est. La sua storia è profondamente intrecciata con quella della regione storica della Moldavia medievale, fondata nel XIV secolo e successivamente sottomessa per secoli all'Impero ottomano. Nel corso del XIX secolo il territorio a est del fiume Prut (la Bessarabia) fu annesso all'Impero russo.<br><br>
        Dopo le vicissitudini del XX secolo — che videro il territorio integrato nell'Unione Sovietica come RSS Moldava in seguito al patto Molotov-Ribbentrop e alla seconda guerra mondiale —, la Moldavia ha proclamato la propria indipendenza nel 1991, ereditando la complessa questione separatista della regione della Transnistria.<br><br>
        Oggi la Moldavia è un Paese saldamente orientato verso l'integrazione europea (paese candidato ufficiale all'adesione all'Unione Europea), celebre a livello internazionale per la sua straordinaria tradizione enologica — possiede alcune delle cantine sotterranee più grandi ed estese del mondo, come Cricova e Mileștii Mici —, per le sue fertili colline coltivate a vigneti e per un patrimonio culturale ricco di antichi monasteri ortodossi.`
      },
      {
        id: 'russia',
        name: 'Russia',
        official: 'Federazione Russa',
        continent: 'Europa',
        region: 'Europa Orientale / Asia Settentrionale',
        capital: 'Mosca',
        population: '~144.100.000',
        language: 'Russo',
        currency: 'Rublo russo (RUB)',
        coverImg: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ru.svg',
        desc: `La Russia (ufficialmente Federazione Russa) è uno Stato transcontinentale che si estende dall'Europa orientale all'Asia settentrionale, coprendo oltre un ottavo delle terre emerse della Terra e risultando il Paese più vasto del mondo. La sua storia monumentale affonda le radici nella fondazione della Rus' di Kiev, per poi evolversi nel Granducato di Mosca, nello Zarato russo proclamato da Ivan il Terribile e nel vasto Impero russo sotto la dinastia dei Romanov.<br><br>
        Il XX secolo ha visto la Russia al centro della storia globale con la Rivoluzione d'ottobre del 1917, la nascita dell'Unione Sovietica (URSS) e il ruolo cruciale nella vittoria contro il nazifascismo nella seconda guerra mondiale, oltre a traguardi straordinari come la conquista dello spazio. In seguito allo scioglimento dell'URSS nel dicembre 1991, è nata l'odierna Federazione Russa.<br><br>
        La Russia è una delle grandi potenze mondiali, membro permanente del Consiglio di Sicurezza delle Nazioni Unite e potenza nucleare. Il Paese vanta un patrimonio culturale, letterario e artistico tra i più ricchi e influenti della storia umana (da Tolstoj a Dostoevskij, da Čajkovskij a Kandinskij), un'economia fortemente basata su immense risorse energetiche e minerarie, e paesaggi naturali straordinari che vanno dalle foreste siberiane alla catena montuosa degli Urali e al Lago Baikal.`
      },
      {
        id: 'turchia',
        name: 'Turchia',
        official: 'Repubblica di Turchia',
        continent: 'Europa',
        region: 'Asia Minore / Europa Sud-orientale (Tracia)',
        capital: 'Ankara',
        population: '~85.300.000',
        language: 'Turco',
        currency: 'Lira turca (TRY)',
        coverImg: 'https://images.unsplash.com/photo-1589561454226-796a8aa89b05?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/tr.svg',
        desc: `La Turchia (ufficialmente Türkiye) è uno Stato transcontinentale situato principalmente nella penisola dell'Anatolia in Asia occidentale, con una porzione geografica (la Tracia orientale) situata nell'Europa sud-orientale, separate dai celebri stretti del Bosforo e dei Dardanelli e dal Mar di Marmara. La sua storia millenaria è un crocevia straordinario di grandi civiltà: terra degli Ittiti, dei Greci antichi, dell'Impero romano e di quello bizantino con capitale Costantinopoli (l'odierna Istanbul), la regione divenne il cuore pulsante del potente Impero ottomano a partire dal XV secolo.<br><br>
        In seguito alla dissoluzione ottomana dopo la prima guerra mondiale, nel 1923 fu fondata la moderna Repubblica di Turchia per opera di Mustafa Kemal Atatürk, che impresse una radicale svolta laica, occidentalizzante e repubblicana alle istituzioni dello Stato.<br><br>
        Membro fondatore dell'OECD e della NATO, la Turchia riveste un ruolo geopolitico, strategico e militare di primissimo piano a livello internazionale. Vanta un'economia fortemente industrializzata e diversificata, un settore turistico tra i più floridi del pianeta e un patrimonio artistico, culturale e paesaggistico senza eguali — che spazia dai tesori bizantini e ottomani di Istanbul ai paesaggi lunari e fiabeschi della Cappadocia.`
      },
      {
        id: 'cipro',
        name: 'Cipro',
        official: 'Repubblica di Cipro',
        continent: 'Europa',
        region: 'Europa Meridionale / Mediterraneo Orientale',
        capital: 'Nicosia',
        population: '~1.250.000',
        language: 'Greco, Turco',
        currency: 'Euro (€)',
        coverImg: 'https://images.unsplash.com/photo-1677023484291-005b9840132f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/cy.svg',
        desc: `Cipro (ufficialmente Repubblica di Cipro) è un'isola-stato sovrana situata nel Mediterraneo orientale, geograficamente vicina alle coste del Vicino Oriente ma culturalmente, storicamente e politicamente legata all'Europa. La sua posizione strategica al crocevia tra Europa, Asia e Africa ha reso l'isola un obiettivo ambito nel corso dei millenni: conquistata da Micenei, Fenici, Assiri, Egizi, Romani, Bizantini, Veneziani e Ottomani, Cipro custodisce siti archeologici straordinari come le rovine di Kourion e Nea Paphos (patrimonio UNESCO).<br><br>
        Dopo la fine del dominio britannico e l'indipendenza ottenuta nel 1960, la storia contemporanea dell'isola è stata segnata da profonde tensioni intercomunitarie tra la popolazione di lingua greca e quella turca, culminate nel 1974 nella divisione di facto del territorio in seguito a un intervento militare turco. Da allora la capitale Nicosia rimane l'ultima città divisa d'Europa.<br><br>
        Membro dell'Unione Europea e della zona euro dal 2004, Cipro vanta un'economia avanzata basata sui servizi finanziari, sul turismo internazionale, sulle tecnologie e sul commercio marittimo, unendo a una modernità dinamica paesaggi naturali e costieri di straordinaria bellezza.`
      },
      {
        id: 'liechtenstein',
        name: 'Liechtenstein',
        official: 'Principato del Liechtenstein',
        continent: 'Europa',
        region: 'Europa Centrale / Alpina',
        capital: 'Vaduz',
        population: '~39.000',
        language: 'Tedesco',
        currency: 'Franco svizzero (CHF)',
        coverImg: 'https://images.unsplash.com/photo-1512424113276-fa9f6a112384?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/li.svg',
        desc: `Il Principato del Liechtenstein è un microstato alpino situato nell'Europa centrale, incastonato tra la Svizzera a ovest e a sud e l'Austria a est, lungo la valle del fiume Reno. La sua storia è unica: il territorio fu costituito nel 1719 dall'unione delle signorie di Schellenberg e Vaduz da parte della dinastia dei Liechtenstein, che all'epoca faceva parte del Sacro Romano Impero. Diventato sovrano a tutti gli effetti nel XIX secolo, il principato ha mantenuto una stretta e duratura unione doganale e monetaria con la vicina Svizzera.<br><br>
        Pur essendo uno degli Stati più piccoli al mondo (con una superficie di appena 160 chilometri quadrati), il Liechtenstein ha sviluppato un'economia modernissima, altamente industrializzata e diversificata, vantando un reddito pro capite tra i più alti del pianeta e un settore finanziario e manifatturiero di eccellenza globale.<br><br>
        Nonostante non sia membro dell'Unione Europea, il Liechtenstein fa parte dello Spazio Economico Europeo (SEE) e dell'area Schengen. Il Paese è celebre per il suo splendido castello principesco che domina la capitale Vaduz, per i paesaggi alpini incontaminati e per la straordinaria stabilità delle sue istituzioni politiche.`
      },
      {
        id: 'afghanistan',
        name: 'Afghanistan',
        official: 'Emirato Islamico dell\'Afghanistan',
        continent: 'Asia',
        region: 'Asia Centrale / Meridionale',
        capital: 'Kabul',
        population: '~41.000.000',
        language: 'Pashto, Dari',
        currency: 'Afghani (AFN)',
        coverImg: 'https://images.unsplash.com/photo-1637443966109-8f1d88ea113b?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/af.svg',
        desc: `L'Afghanistan è uno Stato senza sbocco al mare situato all'incrocio tra l'Asia centrale e l'Asia meridionale. Storicamente crocevia di grandi civiltà e snodo fondamentale dell'antica Via della Seta, il suo territorio montuoso è stato attraversato da conquistatori leggendari come Alessandro Magno, imperatori persiani, mongoli e potenze coloniali moderne.<br><br>
        Nel corso del XIX e XX secolo l'Afghanistan è stato teatro del cosiddetto "Grande Gioco" tra impero britannico e russo, mantenendo a lungo la sua indipendenza prima di attraversare decenni di conflitti e profondi cambiamenti politici nella seconda metà del Novecento e nei primi anni del XXI secolo.<br><br>
        Il Paese possiede un ricco patrimonio culturale millenario, testimoniato da antichi siti archeologici, tradizioni artistiche e artigianali uniche e una complessa struttura tribale ed etnica che riflette la sua straordinaria posizione geografica.`
      },
      {
        id: 'arabia-saudita',
        name: 'Arabia Saudita',
        official: 'Regno dell\'Arabia Saudita',
        continent: 'Asia',
        region: 'Medio Oriente / Penisola Araba',
        capital: 'Riad',
        population: '~36.400.000',
        language: 'Arabo',
        currency: 'Riyal saudita (SAR)',
        coverImg: 'https://images.unsplash.com/photo-1777924961767-654036d5e195?q=80&w=1460&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/sa.svg',
        desc: `L'Arabia Saudita è il Paese più esteso della penisola araba, situato nell'Asia occidentale. Culla dell'Islam, il regno ospita le due città più sante della religione islamica, La Mecca e Medina, che attraggono ogni anno milioni di pellegrini da tutto il mondo. Fondata nella sua forma moderna nel 1932 da re Abdulaziz Ibn Saud, la nazione ha visto una trasformazione radicale grazie alla scoperta di enormi giacimenti petroliferi.<br><br>
        Oggi l'Arabia Saudita rappresenta una delle economie chiave del Medio Oriente e un attore geopolitico di primo piano a livello globale, impegnata in un imponente piano di modernificazione e diversificazione economica (Vision 2030) volto a ridurre la dipendenza dal petrolio e a sviluppare tecnologie avanzate e grandi poli turistici e culturali.`
      },
      {
        id: 'bahrein',
        name: 'Bahrein',
        official: 'Regno del Bahrein',
        continent: 'Asia',
        region: 'Medio Oriente / Golfo Persico',
        capital: 'Manama',
        population: '~1.500.000',
        language: 'Arabo',
        currency: 'Dinaro del Bahrein (BHD)',
        coverImg: 'https://images.unsplash.com/photo-1773097259100-a18ebb981f88?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/bh.svg',
        desc: `Il Bahrein è un piccolo Stato insulare situato nelle acque del Golfo Persico, collegato all'Arabia Saudita tramite il ponte King Fahd. Con una storia marittima e commerciale che affonda le radici nell'antica civiltà di Dilmun risalente a oltre quattromila anni fa, il Bahrein è stato per millenni un nodo cruciale per le rotte commerciali tra la Mesopotamia e la valle dell'Indo.<br><br>
        Protettorato britannico fino al 1971, anno in cui ha riconquistato la piena indipendenza, il Bahrein è stato tra i primi paesi della regione a diversificare la propria economia oltre il settore petrolifero, affermandosi come importante centro finanziario, bancario e turistico del Medio Oriente.`
      },
      {
        id: 'bangladesh',
        name: 'Bangladesh',
        official: 'Repubblica Popolare del Bangladesh',
        continent: 'Asia',
        region: 'Asia Meridionale',
        capital: 'Dhaka',
        population: '~171.000.000',
        language: 'Bengalese',
        currency: 'Taka bengalese (BDT)',
        coverImg: 'https://images.unsplash.com/photo-1577624060070-ca1afe89ddad?q=80&w=1626&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/bd.svg',
        desc: `Il Bangladesh è uno Stato densamente popolato dell'Asia meridionale, situato nel delta del grande fiume Gange-Brahmaputra e bagnato a sud dalla Baia del Bengala. Caratterizzato da un paesaggio fluviale e verdeggiante, il Paese condivide una ricca eredità culturale e linguistica con la vicina regione indiana del Bengala.<br><br>
        Già parte dell'India britannica e successivamente provincia del Pakistan (con il nome di Pakistan Orientale), il Bangladesh ha ottenuto la sanguinosa e faticosa indipendenza nel 1971 in seguito a una guerra di liberazione. Oggi è una nazione in forte crescita economica, celebre per la produzione tessile globale, la vivace cultura letteraria e la resilienza delle sue comunità di fronte alle sfide climatiche.`
      },
      {
        id: 'bhutan',
        name: 'Bhutan',
        official: 'Regno del Bhutan',
        continent: 'Asia',
        region: 'Asia Meridionale / Himalaya',
        capital: 'Thimphu',
        population: '~780.000',
        language: 'Dzongkha',
        currency: 'Ngultrum bhutanese (BTN)',
        coverImg: 'https://images.unsplash.com/photo-1578556881786-851d4b79cb73?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/bt.svg',
        desc: `Il Bhutan è un piccolo regno himalayano senza sbocco al mare, situato tra la Cina a nord e l'India a sud. Noto storicamente come la "Terra del Drago Tuonante", il Bhutan ha preservato gelosamente la sua cultura buddista tibetana e le sue tradizioni incontaminate grazie a una politica di isolamento selettivo durata secoli.<br><br>
        A livello internazionale il Bhutan è celebre per aver rifiutato i parametri economici tradizionali di misurazione del benessere, introducendo il concetto di Felicità Interna Lorda (FIL) come misura principale del progresso della nazione. Il Paese vanta vette himalayane maestose, valli incontaminate e splendidi monasteri fortificati chiamati dzong.`
      },
      {
        id: 'brunei',
        name: 'Brunei',
        official: 'Nazione del Brunei, Dimora della Pace',
        continent: 'Asia',
        region: 'Asia Sud-orientale / Isola del Borneo',
        capital: 'Bandar Seri Begawan',
        population: '~450.000',
        language: 'Malese',
        currency: 'Dollaro del Brunei (BND)',
        coverImg: 'https://images.unsplash.com/photo-1705583855040-3c25b4a9eab9?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/bn.svg',
        desc: `Il Brunei è un piccolo Stato sovrano situato sulla costa settentrionale dell'isola del Borneo, nell'Asia sud-orientale, ed è circondato dallo stato malese del Sarawak e bagnato dal Mar Cinese Meridionale. La storia del Paese è profondamente legata a un antico e potente sultanato islamico che, tra il XV e il XVI secolo, estendeva la sua influenza su gran parte del Borneo e delle isole circostanti prima dell'avvento della colonizzazione europea.<br><br>
        Protettorato britannico per quasi un secolo, il Brunei ha riconquistato la piena indipendenza nel 1984, strutturandosi come una monarchia assoluta governata dal Sultano. Grazie agli immensi giacimenti di petrolio e gas naturale scoperti nel sottosuolo e nelle acque territoriali, il Paese vanta uno dei PIL pro capite più alti al mondo, un elevatissimo standard di vita e un generoso sistema di welfare statale.<br><br>
        Dal punto di vista paesaggistico e culturale, il Brunei offre un affascinante contrasto tra la modernità scintillante delle sue moschee monumentali (caratterizzate da cupole ricoperte d'oro) e la natura incontaminata della foresta pluviale primordiale del Parco Nazionale di Ulu Temburong, oltre al celebre villaggio sull'acqua di Kampong Ayer.`
      },
      {
        id: 'cambogia',
        name: 'Cambogia',
        official: 'Regno di Cambogia',
        continent: 'Asia',
        region: 'Asia Sud-orientale / Penisola Indocinese',
        capital: 'Phnom Penh',
        population: '~16.800.000',
        language: 'Khmer',
        currency: 'Riel cambogiano (KHR)',
        coverImg: 'https://images.unsplash.com/photo-1599283787923-51b965a58b05?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/kh.svg',
        desc: `La Cambogia è uno Stato situato nella penisola indocinese, nell'Asia sud-orientale, celebre in tutto il mondo per la sua straordinaria e millenaria storia artistica e spirituale. Il territorio fu il cuore pulsante del potentissimo Impero Khmer, che tra il IX e il XV secolo dominò gran parte del Sud-est asiatico e che eresse monumenti di inestimabile valore architettonico, tra cui lo spettacolare complesso templare di Angkor Wat, oggi principale simbolo della nazione e patrimonio dell'UNESCO.<br><br>
        Dopo secoli di declino, pressioni da parte dei regni vicini e il periodo del protettorato francese, la Cambogia ha attraversato una seconda metà del XX secolo estremamente travagliata, segnata dalla guerra del Vietnam e dal tragico regime dei Khmer Rossi guidato da Pol Pot tra il 1975 e il 1979, un dramma storico dal quale il Paese ha saputo faticosamente ma coraggiosamente risollevarsi.<br><br>
        Oggi la Cambogia è una monarchia costituzionale in forte sviluppo economico e turistico, caratterizzata da una popolazione giovane e accogliente, da vaste pianure coltivate a riso solcate dal grande fiume Mekong e da una cultura buddista profondamente radicata nella vita quotidiana.`
      },
      {
        id: 'cina',
        name: 'Cina',
        official: 'Repubblica Popolare Cinese',
        continent: 'Asia',
        region: 'Asia Orientale',
        capital: 'Pechino',
        population: '~1.412.000.000',
        language: 'Mandarino',
        currency: 'Yuan cinese (CNY)',
        coverImg: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/cn.svg',
        desc: `La Cina (ufficialmente Repubblica Popolare Cinese) è una delle nazioni più estese e la seconda più popolosa del pianeta, situata nell'Asia orientale. La sua civiltà è una delle più antiche del mondo, con oltre quattromila anni di storia continua documentata da dinastie imperiali che hanno plasmato profondamente il pensiero filosofico (attraverso figure come Confucio e Laozi), la letteratura, l'arte e la scienza globale, regalando all'umanità innovazioni fondamentali come la carta, la stampa, la polvere da sparo e la bussola.<br><br>
        La storia contemporanea della Cina ha subito una svolta epocale il 1° ottobre 1949 con la fondazione della Repubblica Popolare Cinese guidata dal Partito Comunista. A partire dalla fine degli anni '70, le imponenti riforme economiche e di apertura verso l'esterno hanno trasformato radicalmente il Paese, portandolo a diventare la seconda potenza economica mondiale, un colosso industriale e tecnologico globale e un attore geopolitico di primo piano.<br><br>
        Il territorio cinese offre una straordinaria varietà geografica e culturale: dalle maestose vestigia storiche come la Grande Muraglia e la Città Proibita ai modernissimi e avveniristici skyline di Shanghai e Shenzhen, passando per i paesaggi naturali mozzafiato di Guilin, il Tibet e le vaste regioni desertiche e steppiche dell'interno.`
      },
      {
        id: 'corea-del-nord',
        name: 'Corea del Nord',
        official: 'Repubblica Popolare Democratica di Corea',
        continent: 'Asia',
        region: 'Asia Orientale / Penisola Coreana',
        capital: 'Pyongyang',
        population: '~26.000.000',
        language: 'Coreano',
        currency: 'Won nordcoreano (KPW)',
        coverImg: 'https://images.unsplash.com/photo-1584890309466-272e6fffb487?q=80&w=1698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/kp.svg',
        desc: `La Corea del Nord (ufficialmente Repubblica Popolare Democratica di Corea) occupa la porzione settentrionale della penisola coreana, nell'Asia orientale. La storia moderna del Paese affonda le radici nella divisione della penisola avvenuta alla fine della seconda guerra mondiale nel 1945, in seguito alla liberazione dal dominio coloniale giapponese e alla contrapposizione tra blocchi durante la Guerra Fredda, culminata nella sanguinosa guerra di Corea (1950-1953).<br><br>
        Da allora, lo Stato si è strutturato sotto un rigido sistema politico centralizzato e autarchico basato sull'ideologia ufficiale del Juche (autosufficienza), guidato consecutivamente da tre generazioni della famiglia Kim. La nazione mantiene una forte militarizzazione e un isolamento diplomatico ed economico significativo rispetto alla comunità internazionale.<br><br>
        Nonostante la chiusura politica, il territorio nordcoreano custodisce un ricco substrato culturale condiviso con l'antica storia coreana, caratterizzato da montagne spettacolari come il monte Paektu (considerato sacro nella tradizione nazionale), parchi naturali protetti e imponenti monumenti celebrativi nella capitale Pyongyang.`
      },
      {
        id: 'corea-del-sud',
        name: 'Corea del Sud',
        official: 'Repubblica di Corea',
        continent: 'Asia',
        region: 'Asia Orientale / Penisola Coreana',
        capital: 'Seoul',
        population: '~51.600.000',
        language: 'Coreano',
        currency: 'Won sudcoreano (KRW)',
        coverImg: 'https://images.unsplash.com/photo-1785656573111-1f36b482ef71?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/kr.svg',
        desc: `La Corea del Sud (ufficialmente Repubblica di Corea) occupa la parte meridionale della penisola coreana ed è una delle democrazie più avanzate e dinamiche dell'Asia orientale. Dopo le devastazioni subite durante la guerra di Corea nei primi anni '50, il Paese è stato protagonista di una straordinaria e rapidissima crescita economica e sociale passata alla storia come il "Miracolo del fiume Han", che l'ha trasformata in pochi decenni in una nazione industrializzata all'avanguardia globale.<br><br>
        Oggi la Corea del Sud è una superpotenza culturale e tecnologica mondiale: la sua economia è trainata da giganti industriali globali e da un fenomeno culturale senza precedenti noto come l'onda Hallyu (K-pop, cinema, serie televisive e moda), che ha conquistato il pubblico di tutto il pianeta.<br><br>
        Il Paese unisce in modo armonioso una modernità futuristica — rappresentata dai grattacieli e dai quartieri digitali della capitale Seoul — a un profondo patrimonio storico e spirituale custodito nei antichi palazzi reali, nei templi buddisti nascosti tra le montagne e nelle splendide isole vulcaniche come Jeju.`
      },
      {
        id: 'emirati-arabi-uniti',
        name: 'Emirati Arabi Uniti',
        official: 'Emirati Arabi Uniti',
        continent: 'Asia',
        region: 'Medio Oriente / Penisola Araba',
        capital: 'Abu Dhabi',
        population: '~9.400.000',
        language: 'Arabo',
        currency: 'Dirham degli Emirati Arabi Uniti (AED)',
        coverImg: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ae.svg',
        desc: `Gli Emirati Arabi Uniti (EAU) sono una federazione di sette emirati situata nella parte orientale della penisola arabica, affacciata sul Golfo Persico. Fino alla scoperta del petrolio nella seconda metà del XX secolo, l'economia della regione si basava principalmente sulla pesca, sul commercio marittimo e sulla tradizionale raccolta delle perle. Nel 1971, sotto la guida illuminata dello Sceicco Zayed bin Sultan Al Nahyan, gli emirati si unirono per formare uno Stato federale sovrano.<br><br>
        Grazie alle ingenti risorse energetiche, gli Emirati hanno vissuto una trasformazione economica e urbanistica tra le più sbalorditive e rapide della storia umana, convertendosi in un hub globale per il commercio internazionale, il turismo di lusso, i trasporti aerei e la finanza.<br><br>
        Oggi città come Dubai e Abu Dhabi sono celebri in tutto il mondo per la loro architettura avveniristica e audace — che comprende il grattacielo più alto del mondo, il Burj Khalifa —, affiancate da ambiziosi investimenti nei settori dell'energia solare, dell'esplorazione spaziale, dell'istruzione superiore e dei grandi musei d'arte internazionale.`
      },
      {
        id: 'filippine',
        name: 'Filippine',
        official: 'Repubblica delle Filippine',
        continent: 'Asia',
        region: 'Asia Sud-orientale / Insulare',
        capital: 'Manila',
        population: '~114.000.000',
        language: 'Filippino, Inglese',
        currency: 'Peso filippino (PHP)',
        coverImg: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ph.svg',
        desc: `Le Filippine sono un vasto arcipelago composto da oltre settemila isole situato nell'Asia sud-orientale, bagnato a ovest dal Mar Cinese Meridionale e a est dall'Oceano Pacifico. La storia del Paese è un crocevia unico di influenze asiatiche, ispaniche e americane: colonizzate dalla Spagna a partire dal XVI secolo (e battezzate in onore di Re Filippo II), le isole furono successivamente cedute agli Stati Uniti nel 1898 prima di conquistare la piena indipendenza nel dopoguerra.<br><br>
        Questa eredità storica rende le Filippine l'unica nazione a prevalenza cattolica dell'Asia sud-orientale, caratterizzata da una vibrante fusione culturale, da festività tradizionali coloratissime e dall'uso diffuso della lingua inglese, che ne favorisce l'apertura internazionale.<br><br>
        Il territorio filippino è rinomato a livello globale per la straordinaria biodiversità dei suoi ecosistemi marini e terrestri, per le spettacolari risaie a terrazze millenarie di Banaue scavate nelle montagne, e per le sue spiagge tropicali di sabbia bianca considerate tra le più belle e incontaminate del pianeta.`
      },
      {
        id: 'giordania',
        name: 'Giordania',
        official: 'Regno Hashemita di Giordania',
        continent: 'Asia',
        region: 'Medio Oriente / Asia Occidentale',
        capital: 'Amman',
        population: '~11.300.000',
        language: 'Arabo',
        currency: 'Dinaro giordano (JOD)',
        coverImg: 'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/jo.svg',
        desc: `La Giordania (ufficialmente Regno Hashemita di Giordania) è uno Stato situato nel cuore del Medio Oriente, caratterizzato da una straordinaria stabilità politica e da un patrimonio storico e archeologico di inestimabile valore globale. La sua storia si intreccia con le grandi civiltà dell'antichità: terra di passaggi carovanieri, regni nabatei e dominazioni romane e bizantine, il territorio giordano custodisce tesori leggendari come la città di Petra (scolpita nella roccia rosa e dichiarata patrimonio dell'UNESCO) e il deserto protetto di Wadi Rum.<br><br>
        Nato come Emirato di Transgiordania sotto protettorato britannico, il Paese ha ottenuto la piena indipendenza nel 1946, strutturandosi come una monarchia costituzionale guidata dalla dinastia hashemita. Nonostante le complesse tensioni geopolitiche regionali, la Giordania ha svolto storicamente un ruolo chiave di moderazione e accoglienza, ospitando nel corso dei decenni milioni di rifugiati provenienti dai Paesi vicini.<br><br>
        Oggi la Giordania unisce la modernità dinamica della capitale Amman a tradizioni millenarie, offrendo al mondo mete di straordinario fascino paesaggistico e culturale, che spaziano dalle rive saline del Mar Morto fino alle antiche rotte del deserto.`
      },
      {
        id: 'india',
        name: 'India',
        official: 'Repubblica dell\'India',
        continent: 'Asia',
        region: 'Asia Meridionale',
        capital: 'Nuova Delhi',
        population: '~1.428.000.000',
        language: 'Hindi, Inglese, e molte altre lingue ufficiali',
        currency: 'Rupia indiana (INR)',
        coverImg: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/in.svg',
        desc: `L'India (ufficialmente Repubblica dell'India) è una delle nazioni più antiche, vaste e popolate del mondo, costituendo quasi un subcontinente nell'Asia meridionale. Culla di una delle prime civiltà fluviali della storia lungo la valle dell'Indo e luogo di nascita di religioni millenarie come l'Induismo, il Buddismo, il Giainismo e il Sikhismo, l'India ha esercitato un'influenza culturale, filosofica e spirituale immensa sull'intera storia dell'umanità.<br><br>
        Dopo secoli di frammentazione dinastica — tra cui spicca lo splendore dell'Impero Moghul — e quasi duecento anni di dominazione coloniale britannica, l'India ha riconquistato la propria indipendenza nel 1947 grazie al celebre movimento non violento guidato da Mahatma Gandhi, strutturandosi oggi come la più grande democrazia del pianeta.<br><br>
        Attuale superpotenza economica, scientifica e spaziale in fortissima ascesa, l'India affascina il mondo per la sua straordinaria complessità e diversità culturale, linguistica e artistica, custodendo monumenti iconici come il Taj Mahal, paesaggi naturali che vanno dalle cime innevate dell'Himalaya alle spiagge tropicali del sud, e una vivace tradizione tecnologica e cinematografica (Bollywood) di rilevanza globale.`
      },
      {
        id: 'indonesia',
        name: 'Indonesia',
        official: 'Repubblica di Indonesia',
        continent: 'Asia',
        region: 'Asia Sud-orientale / Insulare',
        capital: 'Giacarta',
        population: '~277.000.000',
        language: 'Indonesiano (Bahasa Indonesia)',
        currency: 'Rupia indonesiana (IDR)',
        coverImg: 'https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/id.svg',
        desc: `L'Indonesia è il più grande Stato insulare del mondo, situato tra l'Asia sud-orientale e l'Oceania, composto da un arcipelago straordinario di oltre diciassette mila isole (tra cui Java, Sumatra, Bali, il Borneo e Sulawesi). Per la sua posizione geografica strategica, l'arcipelago è stato per millenni un nodo fondamentale delle rotte commerciali marittime tra l'India e la Cina, subendo influenze culturali indù, buddiste, islamiche ed europee (specialmente olandesi).<br><br>
        Dichiarata l'indipendenza nel 1945, l'Indonesia è oggi la più grande economia del Sud-est asiatico e una democrazia pluralista che unisce centinaia di gruppi etnici e linguistici sotto il motto nazionale di "Bhinneka Tunggal Ika" (Unità nella diversità), rappresentando al contempo il Paese con la più numerosa popolazione musulmana al mondo.<br><br>
        Il territorio indonesiano è celebre per la sua natura vulcanica e rigogliosa, che ospita una biodiversità tra le più ricche del pianeta — inclusi gli iconici orangutan e il drago di Komodo —, oltre a capolavori architettonici millenari come il tempio buddista di Borobudur e le suggestive tradizioni artistiche e spirituali dell'isola di Bali.`
      },
      {
        id: 'iran',
        name: 'Iran',
        official: 'Repubblica Islamica dell\'Iran',
        continent: 'Asia',
        region: 'Asia Occidentale / Medio Oriente',
        capital: 'Teheran',
        population: '~88.500.000',
        language: 'Persiano (Farsi)',
        currency: 'Rial iraniano (IRR)',
        coverImg: 'https://images.unsplash.com/photo-1613930648631-7191115e83d4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ir.svg',
        desc: `L'Iran (storicamente noto anche come Persia) è uno dei Paesi più importanti e antichi dell'Asia occidentale, situato in un crocevia strategico tra il Medio Oriente, l'Asia centrale e l'Asia meridionale. La sua storia millenaria ha dato i natali a una delle civiltà più illustri dell'antichità: l'Impero achemenide fondato da Ciro il Grande, seguito dai Parti e dai Sasanidi, che hanno profondamente segnato la cultura, l'arte, l'architettura e la filosofia eurasiatica.<br><br>
        Nel corso del XX secolo, dopo decenni di monarchia imperiale guidata dalla dinastia Pahlavi, l'Iran è stato teatro della rivoluzione islamica del 1979 guidata dall'ayatollah Khomeini, che ha trasformato lo Stato in una repubblica teocratica islamica dal forte peso geopolitico regionale.<br><br>
        L'Iran vanta un patrimonio culturale e letterario di inestimabile valore — celebrato attraverso i versi di poeti immortali come Hafez e Rumi —, oltre a splendide moschee decorate da mosaici celesti, antichi giardini persiani protetti dall'UNESCO, e una straordinaria varietà di paesaggi che spaziano dalle vette dei monti Elburz ai vasti altipiani desertici.`
      },
      {
        id: 'iraq',
        name: 'Iraq',
        official: 'Repubblica d\'Iraq',
        continent: 'Asia',
        region: 'Medio Oriente / Mesopotamia',
        capital: 'Baghdad',
        population: '~44.500.000',
        language: 'Arabo, Curdo',
        currency: 'Dinaro iracheno (IQD)',
        coverImg: 'https://images.unsplash.com/photo-1608925086961-dbcd276a0e71?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/iq.svg',
        desc: `L'Iraq (ufficialmente Repubblica d'Iraq) è uno Stato situato nel Medio Oriente, il cui territorio corrisponde in gran parte alla storica regione della Mesopotamia, universalmente riconosciuta come la "culla della civiltà". È qui che tra i fiumi Tigri ed Eufrate sorsero le prime società urbane della storia umana, le civiltà dei Sumeri, degli Accadi, dei Babilonesi e degli Assiri, che inventarono la scrittura cuneiforme, le prime leggi scritte e gettarono le basi della matematica e dell'astronomia.<br><br>
        Nel periodo medievale, con la fondazione di Baghdad da parte della dinastia abbaside, l'Iraq divenne il centro culturale, scientifico e commerciale del mondo islamico durante il suo massimo splendore (l'Età dell'oro islamica). Nel XX secolo, dopo la fine del mandato britannico e la nascita della repubblica, il Paese ha attraversato decenni di conflitti devastanti che ne hanno segnato profondamente la storia contemporanea.<br><br>
        Oggi l'Iraq sta faticosamente ricostruendo le proprie istituzioni democratiche e la propria economia, custodendo un patrimonio archeologico e monumentale unico al mondo, testimone millenario dell'ingegno e della storia dell'intera umanità.`
      },
      {
        id: 'israele',
        name: 'Israele',
        official: 'Stato di Israele',
        continent: 'Asia',
        region: 'Medio Oriente / Levante',
        capital: 'Gerusalemme',
        population: '~9.700.000',
        language: 'Ebraico, Arabo',
        currency: 'Nuovo siclo israeliano (ILS)',
        coverImg: 'https://images.unsplash.com/photo-1547483029-77784da27709?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/il.svg',
        desc: `Israele (ufficialmente Stato di Israele) è uno Stato situato nel Medio Oriente, affacciato a ovest sul Mar Mediterraneo e situato in un crocevia storico e spirituale di eccezionale rilievo mondiale. Il territorio è la terra d'origine delle radici storiche e bibliche del popolo ebraico e il luogo in cui sono nati importanti eventi fondanti delle grandi religioni monoteiste (Ebraismo, Cristianesimo e Islam).<br><br>
        La storia moderna del Paese è segnata dalla fondazione dello Stato nel 1948, stabilita in seguito agli orrori della Shoah in Europa e alla risoluzione dell'ONU, che ha dato il via a un complesso e duraturo conflitto israelo-palestinese e a ripetute tensioni geopolitiche regionali.<br><br>
        Nonostante le sfide legate alla sicurezza, Israele si è affermato come una nazione altamente sviluppata e all'avanguardia globale nei settori dell'alta tecnologia, dell'innovazione scientifica, della ricerca medica e dell'agricoltura avanzata, unendo una modernità tecnologica straordinaria a siti storici e religiosi visitati da pellegrini di tutto il mondo.`
      },
      {
        id: 'kuwait',
        name: 'Kuwait',
        official: 'Stato del Kuwait',
        continent: 'Asia',
        region: 'Medio Oriente / Golfo Persico',
        capital: 'Madinat al-Kuwait (Città del Kuwait)',
        population: '~4.300.000',
        language: 'Arabo',
        currency: 'Dinaro kuwaitiano (KWD)',
        coverImg: 'https://images.unsplash.com/photo-1558634742-56096b49522b?q=80&w=1866&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/kw.svg',
        desc: `Il Kuwait è un emirato sovrano situato nell'Asia occidentale, nell'angolo settentrionale del Golfo Persico, confinando con l'Iraq e l'Arabia Saudita. Storicamente la regione è stata un importante snodo commerciale costiero e un porto marittimo frequentato da pescatori di perle e mercanti provenienti dalla penisola arabica e dalla Mesopotamia.<br><br>
        Dopo essere stato un protettorato britannico, il Kuwait ha ottenuto la piena indipendenza nel 1961, sviluppando rapidamente un sistema economico e politico basato sull'estrazione e l'esportazione di immense riserve petrolifere, che le garantiscono uno dei redditi pro capite più elevati del pianeta.<br><br>
        La storia contemporanea del Paese è stata segnata dalla drammatica invasione subita nel 1990 da parte dell'Iraq di Saddam Hussein e dalla successiva Guerra del Golfo nel 1991, che ha ripristinato la sovranità nazionale. Oggi il Kuwait è una monarchia costituzionale attiva sulla scena diplomatica internazionale, nota per le sue iconiche torri idriche e per un vivace dibattito parlamentare interno unico nella regione.`
      },
      {
        id: 'kirghizistan',
        name: 'Kirghizistan',
        official: 'Repubblica Kirghisa',
        continent: 'Asia',
        region: 'Asia Centrale',
        capital: 'Biškek',
        population: '~7.000.000',
        language: 'Kirghiso, Russo',
        currency: 'Som kirghiso (KGS)',
        coverImg: 'https://images.unsplash.com/photo-1610720684893-619cd7a5cde5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/kg.svg',
        desc: `Il Kirghizistan (ufficialmente Repubblica Kirghisa) è uno Stato montuoso senza sbocco al mare situato nel cuore dell'Asia centrale, dominato interamente dalla maestosa catena montuosa del Tien Shan ("le montagne celesti"). La sua storia millenaria è profondamente legata alle antiche tribù nomadi turche che percorrevano le piste carovaniere della Via della Seta, unendo oriente e occidente in un continuo scambio di culture e merci.<br><br>
        Incorporato nell'Impero russo nel XIX secolo e successivamente divenuto una repubblica dell'Unione Sovietica (RSS Kirghisa) nel corso del XX secolo, il Paese ha ottenuto la piena indipendenza nel 1991 in seguito al dissolvimento dell'URSS. Da allora, il Kirghizistan ha intrapreso un cammino democratico unico e vivace nella regione, caratterizzato da una forte identità culturale legata alla tradizione dei pastori nomadi.<br><br>
        Il territorio kirghiso è celebre a livello internazionale per i suoi paesaggi alpini mozzafiato, le vaste valli d'alta quota e lo spettacolare lago alpino di Issyk-Kul, una delle mete naturalistiche più affascinanti e incontaminate dell'intera Asia centrale.`
      },
      {
        id: 'laos',
        name: 'Laos',
        official: 'Repubblica Democratica Popolare del Laos',
        continent: 'Asia',
        region: 'Asia Sud-orientale / Penisola Indocinese',
        capital: 'Vientiane',
        population: '~7.500.000',
        language: 'Laotiano',
        currency: 'Kip laotiano (LAK)',
        coverImg: 'https://images.unsplash.com/photo-1705917950934-7efe2b6866cc?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/la.svg',
        desc: `Il Laos (ufficialmente Repubblica Democratica Popolare del Laos) è uno Stato senza sbocco al mare situato nella penisola indocinese, nell'Asia sud-orientale, attraversato interamente dal grande fiume Mekong. La sua storia affonda le radici nell'antico regno di Lan Xang ("il regno del milione di elefanti e del parasole bianco"), fondato nel XIV secolo e fiorito come importante centro spirituale e commerciale buddista nella regione.<br><br>
        Dopo un periodo di protettorato francese e le drammatiche turbolenze legate alla guerra del Vietnam — che ne fecero il Paese più bombardato pro capite della storia —, il Laos ha proclamato la repubblica socialista nel 1975. Negli ultimi decenni il Paese ha aperto progressivamente le sue porte agli investimenti e al turismo internazionale.<br><br>
        Il Laos è amato dai viaggiatori di tutto il mondo per la sua atmosfera pacatica e rilassata, le sue fitte giungle tropicali, i villaggi rurali tradizionali e la splendida città storica di Luang Prabang (patrimonio dell'UNESCO), celebre per i suoi antichi templi buddisti e per la suggestiva cerimonia mattutina delle elemosina.`
      },
      {
        id: 'libano',
        name: 'Libano',
        official: 'Repubblica Libanese',
        continent: 'Asia',
        region: 'Medio Oriente / Levante',
        capital: 'Beirut',
        population: '~5.300.000',
        language: 'Arabo',
        currency: 'Lira libanese (LBP)',
        coverImg: 'https://images.unsplash.com/photo-1496823407868-80f47c7453b5?q=80&w=1813&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/lb.svg',
        desc: `Il Libano è uno Stato situato nel Vicino Oriente, lungo la costa orientale del Mar Mediterraneo. La sua storia è millenaria e affascinante: culla dell'antica civiltà dei Fenici, abili navigatori e mercanti che fondarono colonie in tutto il Mediterraneo, il territorio libanese è stato successivamente dominato da Assiri, Persiani, Romani, Bizantini, Ottomani e, nel XX secolo, dalla Francia.<br><br>
        Divenuto indipendente nel 1943, il Libano si è storicamente distinto come un crocevia unico di culture, religioni ed etnie differenti, con una complessa struttura istituzionale basata sul pluralismo confessionale. La sua capitale, Beirut, è stata a lungo celebrata come la "Parigi del Medio Oriente" per il suo fermento culturale e intellettuale.<br><br>
        Nonostante i profondi traumi causati dalla guerra civile (1975-1990) e dalle successive crisi geopolitiche regionali, il Libano conserva un patrimonio artistico e archeologico inestimabile — tra cui i maestosi templi romani di Baalbek e le rovine di Biblo —, oltre a una celebre tradizione letteraria, vinicola e gastronomica di fama mondiale.`
      },
      {
        id: 'malaysia',
        name: 'Malaysia',
        official: 'Malaysia',
        continent: 'Asia',
        region: 'Asia Sud-orientale',
        capital: 'Kuala Lumpur',
        population: '~33.900.000',
        language: 'Malese',
        currency: 'Ringgit malese (MYR)',
        coverImg: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1728&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/my.svg',
        desc: `La Malaysia è uno Stato federale dell'Asia sud-orientale, diviso geograficamente in due regioni distinte separate dal Mar Cinese Meridionale: la Malaysia peninsulare e la Malaysia orientale (situata sull'isola del Borneo). Per la sua posizione strategica lungo lo stretto di Malacca, la regione è stata per secoli un crocevia commerciale fondamentale tra l'India, la Cina e il mondo arabo, subendo successivamente la colonizzazione portoghese, olandese e britannica.<br><br>
        Ottenuta l'indipendenza nel 1957 e costituitasi come federazione nel 1963, la Malaysia si è affermata come una nazione multietnica e multiculturale di grande successo economico, unendo popolazioni di origine malese, cinese e indiana in un modello di convivenza dinamico e moderno.<br><br>
        Il Paese offre un contrasto straordinario tra le foreste pluviali primordiali del Borneo — che ospitano una biodiversità rarissima — e la modernità avveniristica della capitale Kuala Lumpur, dominata dalle iconiche torri Petronas, affiancate da splendide spiagge tropicali e antiche piantagioni di tè.`
      },
      {
        id: 'maldive',
        name: 'Maldive',
        official: 'Repubblica delle Maldive',
        continent: 'Asia',
        region: 'Asia Meridionale / Oceano Indiano',
        capital: 'Malé',
        population: '~520.000',
        language: 'Dhivehi',
        currency: 'Rufiyaa maldiviana (MVR)',
        coverImg: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/mv.svg',
        desc: `Le Maldive sono un arcipelago di 26 atolli naturali formati da oltre mille isole coralline situate nelle acque calde dell'Oceano Indiano, a sud-ovest dell'India. La storia delle isole è legata a una monarchia millenaria che, grazie alla sua posizione strategica sulle rotte marittime dell'Oceano Indiano, si convertì all'Islam nel XII secolo e subì successivamente un breve protettorato portoghese, olandese e britannico prima dell'indipendenza ottenuta nel 1965.<br><br>
        Trasformatasi da nazione di pescatori a repubblica presidenziale, le Maldive hanno sviluppato a partire dagli anni '70 un settore turistico d'élite tra i più esclusivi e celebri del pianeta, basato su resort di lusso immersi in paesaggi marini di ineguagliabile bellezza.<br><br>
        Oltre alle spiagge di sabbia bianchissima e alle lagune turchesi ricche di una straordinaria vita sottomarina, le Maldive affrontano oggi le grandi sfide ambientali globali legate all'innalzamento del livello del mare, ponendosi all'avanguardia nella sensibilizzazione ecologica internazionale.`
      },
      {
        id: 'mongolia',
        name: 'Mongolia',
        official: 'Mongolia',
        continent: 'Asia',
        region: 'Asia Centrale / Orientale',
        capital: 'Ulan Bator',
        population: '~3.400.000',
        language: 'Mongolo',
        currency: 'Tugrik mongolo (MNT)',
        coverImg: 'https://images.unsplash.com/photo-1575415868394-e3b78f3e9b3f?q=80&w=1699&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/mn.svg',
        desc: `La Mongolia è uno Stato senza sbocco al mare situato nell'Asia orientale e centrale, caratterizzato da una vastissima estensione territoriale e dalla densità di popolazione più bassa al mondo. La sua storia è leggendaria: nel XIII secolo Gengis Khan unì le tribù nomadi e fondò l'Impero mongolo, il più grande impero terrestre contiguo della storia umana, che estese la sua dominazione dall'Europa orientale fino ai confini dell'Asia pacifica.<br><br>
        Dopo secoli di dominazione della dinastia cinese Qing, la Mongolia proclamò l'indipendenza all'inizio del XX secolo e, sotto l'influenza sovietica, divenne una repubblica popolare fino alla rivoluzione democratica pacifica del 1990, che ha instaurato un solido sistema multipartitico.<br><br>
        Oggi la Mongolia custodisce gelosamente le sue antiche tradizioni nomadi — basate sull'allevamento di bestiame e sulle tipiche tende smontabili chiamate *ger* —, immerse in paesaggi naturali immensi e selvaggi che spaziano dalle verdi steppe sterminate al celebre e misterioso deserto del Gobi.`
      },
      {
        id: 'myanmar',
        name: 'Myanmar',
        official: 'Repubblica dell\'Unione del Myanmar',
        continent: 'Asia',
        region: 'Asia Sud-orientale / Penisola Indocinese',
        capital: 'Naypyidaw',
        population: '~54.500.000',
        language: 'Birmano',
        currency: 'Kyat birmano (MMK)',
        coverImg: 'https://images.unsplash.com/photo-1583435292794-4803a56c5043?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/mm.svg',
        desc: `Il Myanmar (storicamente noto anche come Birmania) è uno Stato situato nell'Asia sud-orientale, nella penisola indocinese, bagnato a sud dal Golfo del Bengala e dal Mare delle Andamane. La sua storia millenaria è stata plasmata da potenti regni dinastici che hanno edificato meraviglie architettoniche straordinarie, come la piana archeologica di Bagan, dove sorgono migliaia di templi e pagode buddiste millenarie immerse nella giungla.<br><br>
        Colonializzato dall'Impero britannico nel XIX secolo, il Paese ha riconquistato l'indipendenza nel 1948, ma la sua storia contemporanea è stata profondamente segnata da un lungo isolamento politico, da regimi militari e da complesse transizioni democratiche e tensioni etniche interne.<br><br>
        Il territorio birmano vanta una ricchezza paesaggistica e culturale straordinaria: dalle sponde del fiume Irrawaddy ai laghi d'alta quota come l'Inle (famoso per i pescatori che remano con una sola gamba), il Myanmar conserva un fascino antico e tradizioni religiose profondamente radicate nella vita quotidiana della sua popolazione.`
      },
      {
        id: 'nepal',
        name: 'Nepal',
        official: 'Repubblica Federale Democratica del Nepal',
        continent: 'Asia',
        region: 'Asia Meridionale / Himalaya',
        capital: 'Katmandu',
        population: '~30.500.000',
        language: 'Nepalese',
        currency: 'Rupia nepalese (NPR)',
        coverImg: 'https://images.unsplash.com/photo-1764140608148-80e010804af8?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/np.svg',
        desc: `Il Nepal è uno Stato senza sbocco al mare situato nell'Asia meridionale, incastonato lungo le pendici della catena montuosa dell'Himalaya tra la Cina e l'India. La sua storia millenaria è un crocevia unico di influenze culturali indù e buddiste, fiorito attraverso regni dinastici indipendenti e valli fertili come quella di Katmandu, celebre per i suoi complessi monumentali e templi storici protetti dall'UNESCO.<br><br>
        A lungo rimasto un regno isolato e protetto tra le sue montagne, il Nepal ha vissuto una profonda transizione politica tra la fine del XX e l'inizio del XXI secolo, culminata nel 2008 con l'abolizione della monarchia millenaria e la proclamazione della repubblica federale democratica.<br><br>
        Il Paese è celebre in tutto il mondo per custodire otto delle dieci montagne più alte della Terra — tra cui la maestosa vetta dell'Everest, la cima più alta del pianeta —, attirando alpinisti, trekker e viaggiatori da ogni angolo del globo alla ricerca di paesaggi alpini spettacolari e di una profonda spiritualità.`
      },
      {
        id: 'oman',
        name: 'Oman',
        official: 'Sultanato dell\'Oman',
        continent: 'Asia',
        region: 'Medio Oriente / Penisola Araba',
        capital: 'Mascate',
        population: '~4.600.000',
        language: 'Arabo',
        currency: 'Riyal omanita (OMR)',
        coverImg: 'https://images.unsplash.com/photo-1784400340193-2841dfbd9284?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/om.svg',
        desc: `Il Sultanato dell'Oman è uno Stato situato nella costa sud-orientale della penisola arabica, bagnato dal Mar Arabico e dal Golfo di Oman. La sua storia marittima e commerciale è antichissima: per millenni i marinai omaniti solcavano l'Oceano Indiano collegando il Medio Oriente con l'Africa orientale e l'India, commerciando spezie, incenso e tessuti preziosi lungo le rotte dei monsoni.<br><br>
        A differenza di altri Paesi della regione, l'Oman ha saputo sviluppare una modernizzazione equilibrata sotto la saggia guida dei suoi sovrani, preservando gelosamente la propria autenticità architettonica, le tradizioni beduine e un patrimonio storico eccezionale fatto di forti medievali, antichi sistemi di irrigazione (i *falaj*) e oasi verdeggianti.<br><br>
        Oggi l'Oman si distingue sulla scena internazionale per una politica estera di pacifica mediazione, un turismo sostenibile in forte crescita e paesaggi naturali straordinari che spaziano dalle spiagge incontaminate ai vasti deserti di sabbia e alle aspre vette dei monti Hajar.`
      },
      {
        id: 'pakistan',
        name: 'Pakistan',
        official: 'Repubblica Islamica del Pakistan',
        continent: 'Asia',
        region: 'Asia Meridionale',
        capital: 'Islamabad',
        population: '~235.000.000',
        language: 'Urdu, Inglese',
        currency: 'Rupia pakistana (PKR)',
        coverImg: 'https://images.unsplash.com/photo-1608020932658-d0e19a69580b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/pk.svg',
        desc: `Il Pakistan (ufficialmente Repubblica Islamica del Pakistan) è una grande nazione situata nell'Asia meridionale, affacciata a sud sul Mar Arabico. Il territorio pakistano custodisce le vestigia di una delle civiltà fluviali più antiche della storia umana, la civiltà della valle dell'Indo, con siti archeologici straordinari come Harappa e Mohenjo-daro.<br><br>
        La storia contemporanea del Paese è legata a doppio filo alla spartizione dell'India britannica avvenuta nel 1947, quando il Pakistan fu fondato come patria autonoma per i musulmani del subcontinente indiano. Nel corso dei decenni successivi, la nazione ha affrontato complesse sfide politiche, geostrategiche e costituzionali.<br><br>
        Il Pakistan vanta una geografia spettacolare e variegata: ospita alcune delle montagne più alte e impegnative del pianeta — tra cui il K2 nella catena del Karakoram —, valli alpine incantevoli come Hunza, e un ricchissimo patrimonio culturale, artistico e musicale di radice sufi che riflette la millenaria storia della regione.`
      },
      {
        id: 'palestina',
        name: 'Palestina',
        official: 'Stato di Palestina',
        continent: 'Asia',
        region: 'Medio Oriente / Levante',
        capital: 'Gerusalemme Est (de jure) / Ramallah (de facto)',
        population: '~5.400.000',
        language: 'Arabo',
        currency: 'Dinaro giordano (JOD) / Nuovo siclo israeliano (ILS)',
        coverImg: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ps.svg',
        desc: `La Palestina (ufficialmente Stato di Palestina) è un territorio situato nel Medio Oriente, nella regione storica del Levante, comprendente la Cisgiordania e la Striscia di Gaza. La sua terra riveste un'importanza storica, culturale e spirituale inestimabile per le tre grandi religioni monoteiste (Ebraismo, Cristianesimo e Islam), essendo stata teatro di millenni di civiltà, regni antichi e passaggi storici fondamentali.<br><br>
        La storia contemporanea della Palestina è profondamente segnata dalla complessa questione israelo-palestinese sorta dopo il 1948, dai decenni di occupazione e conflitti, e dal lungo e faticoso cammino del popolo palestinese per il riconoscimento della propria sovranità statale e dell'autodeterminazione a livello internazionale.<br><br>
        Nonostante le enormi difficoltà politiche ed economiche quotidiane, la Palestina custodisce città dai nomi leggendari come Betlemme e Gerico, un patrimonio culturale e letterario di grande profondità e una popolazione determinata a preservare la propria identità e le proprie tradizioni.`
      },   
   {
        id: 'qatar',
        name: 'Qatar',
        official: 'Stato del Qatar',
        continent: 'Asia',
        region: 'Medio Oriente / Penisola Araba',
        capital: 'Doha',
        population: '~2.700.000',
        language: 'Arabo',
        currency: 'Riyal qatariota (QAR)',
        coverImg: 'https://images.unsplash.com/photo-1700901742651-6b353164caf3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/qa.svg',
        desc: `Il Qatar è una penisola sovrana situata sulla costa occidentale del Golfo Persico, nell'Asia occidentale. Storicamente abitato da tribù nomadi, pescatori di perle e mercanti marittimi, il territorio è stato a lungo sotto l'influenza di potenze regionali prima di diventare un protettorato britannico e di proclamare la piena indipendenza nel 1971.<br><br>
        Grazie allo sfruttamento dei giganteschi giacimenti di gas naturale e petrolio nel suo sottosuolo, il Qatar ha vissuto una trasformazione economica fulminea, raggiungendo uno dei PIL pro capite più elevati al mondo e investendo ingenti risorse nella modernizzazione tecnologica, nell'istruzione e nella cultura globale.<br><br>
        Negli ultimi anni il Qatar si è affermato come un attore diplomatico e mediatico di primissimo piano a livello internazionale — ospitando importanti emittenti televisive e grandi eventi sportivi globali come i Mondiali di calcio del 2022 —, affiancando a questa avveniristica modernità musei d'arte di fama mondiale e antichi mercati tradizionali come il Souq Waqif.`
      },
      {
        id: 'singapore',
        name: 'Singapore',
        official: 'Repubblica di Singapore',
        continent: 'Asia',
        region: 'Asia Sud-orientale',
        capital: 'Singapore',
        population: '~5.600.000',
        language: 'Inglese, Malese, Mandarino, Tamil',
        currency: 'Dollaro di Singapore (SGD)',
        coverImg: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1652&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/sg.svg',
        desc: `Singapore è una città-stato insulare situata all'estremità meridionale della penisola malese, nell'Asia sud-orientale. La sua posizione strategica lungo le rotte marittime globali ne ha fatto per secoli un importante emporio commerciale, fondato come avamposto coloniale britannico nel XIX secolo da Stamford Raffles.<br><br>
        Dopo l'indipendenza ottenuta nel 1965 (seguita a una breve unione con la Malaysia), Singapore è stata protagonista di uno dei miracoli di sviluppo economico e sociale più straordinari della storia contemporanea, trasformandosi in pochi decenni da porto commerciale in un hub finanziario, tecnologico e logistico globale di eccellenza.<br><br>
        Oggi Singapore è una nazione all'avanguardia celebre in tutto il mondo per la sua pulizia impeccabile, la sicurezza, l'efficienza delle infrastrutture e un'architettura urbana avveniristica e verdeggiante — simboleggiata dai celebri giardini botanici e dal Marina Bay Sands —, che unisce armoniosamente le culture cinese, malese e indiana in una società multietnica dinamica.`
      },
      {
        id: 'siria',
        name: 'Siria',
        official: 'Repubblica Araba di Siria',
        continent: 'Asia',
        region: 'Medio Oriente / Levante',
        capital: 'Damasco',
        population: '~22.100.000',
        language: 'Arabo',
        currency: 'Lira siriana (SYP)',
        coverImg: 'https://images.unsplash.com/photo-1580310219243-dbad8c44e576?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/sy.svg',
        desc: `La Siria (ufficialmente Repubblica Araba di Siria) è uno Stato situato nel Vicino Oriente, lungo la costa orientale del Mediterraneo, in una regione di fondamentale importanza strategica e culturale fin dall'alba della civiltà. La sua capitale, Damasco, è considerata una delle città abitate più antiche del mondo, cuore di imperi storici e crocevia millenario della Via della Seta.<br><br>
        Nel corso della sua storia millenaria, la Siria è stata il fulcro di grandi regni e califfati — tra cui la dinastia degli Omayyadi —, subendo successivamente dominazioni ottomane e il mandato francese nel XX secolo, prima di conquistare l'indipendenza nel 1946. La sua storia recente è stata purtroppo segnata da un devastante conflitto iniziato nel 2011 che ha causato immensi patimenti alla popolazione e ingenti danni al patrimonio storico.<br><br>
        Nonostante le ferite della guerra, la Siria custodisce tesori archeologici e architettonici di inestimabile valore universale — come la città antica di Aleppo e le rovine romane di Palmira —, testimonianze eterne di un passato glorioso e di una civiltà millenaria.`
      },
      {
        id: 'sri-lanka',
        name: 'Sri Lanka',
        official: 'Repubblica Democratica Socialista dello Sri Lanka',
        continent: 'Asia',
        region: 'Asia Meridionale / Oceano Indiano',
        capital: 'Sri Jayawardenepura Kotte (Amministrativa) / Colombo (Commerciale)',
        population: '~22.100.000',
        language: 'Singalese, Tamil',
        currency: 'Rupia dello Sri Lanka (LKR)',
        coverImg: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/lk.svg',
        desc: `Lo Sri Lanka (noto storicamente anche come Ceylon) è uno Stato insulare situato nell'Oceano Indiano, appena al largo della punta meridionale dell'India. La sua posizione strategica lungo le grandi rotte marittime ha reso l'isola un crocevia millenario per commercianti arabi, cinesi, persiani ed europei (portoghesi, olandesi e britannici), che si sono susseguiti nel corso dei secoli.<br><br>
        La storia dell'isola è profondamente intrisa di spiritualità buddista, introdotta nel III secolo a.C., e vanta regni antichi straordinari che hanno eretto città monumentali e imponenti sistemi di irrigazione nella giungla, come la roccaforte di Sigiriya e le antiche capitali di Anuradhapura e Polonnaruwa (tutte protette dall'UNESCO).<br><br>
        Oggi lo Sri Lanka è una nazione celebre in tutto il mondo per i suoi paesaggi tropicali mozzafiato, le infinite distese di piantagioni di tè verdeggianti, le spiagge dorate e una ricca biodiversità che spazia dagli elefanti selvatici ai parchi nazionali marini.`
      },
      {
        id: 'tagikistan',
        name: 'Tagikistan',
        official: 'Repubblica del Tagikistan',
        continent: 'Asia',
        region: 'Asia Centrale',
        capital: 'Dushanbe',
        population: '~10.000.000',
        language: 'Tagiko',
        currency: 'Somoni tagiko (TJS)',
        coverImg: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Historical_Museum_of_Sughd_region_in_Khujand%2C_Tajikistan_%282025%29.jpg/1920px-Historical_Museum_of_Sughd_region_in_Khujand%2C_Tajikistan_%282025%29.jpg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/tj.svg',
        desc: `Il Tagikistan è uno Stato montuoso senza sbocco al mare situato nell'Asia centrale, caratterizzato da vette vertiginose che superano i settemila metri appartenenti alle catene del Pamir e del Tien Shan. La sua storia millenaria affonda le radici nella cultura di lingua persiana e nelle antiche città carovaniere della Via della Seta, come Khujand e Istaravshan, che fiorirono come importanti snodi commerciali tra oriente e occidente.<br><br>
        Dopo essere stato integrato nell'Impero russo e successivamente divenuto una repubblica dell'Unione Sovietica (RSS Tagika) nel corso del XX secolo, il Tagikistan ha proclamato la propria indipendenza nel 1991, affrontando un complesso e difficile decennio di transizione politica prima di consolidare la stabilità nazionale.<br><br>
        Il Paese è un vero e proprio paradiso per gli amanti della natura incontaminata e dell'alpinismo estremo, grazie alle spettacolari strade d'alta quota come la celebre autostrada del Pamir, laghi alpini di un azzurro cristallino e una cultura ospitale legata alle antiche tradizioni montane.`
      },
      {
        id: 'thailandia',
        name: 'Thailandia',
        official: 'Regno di Thailandia',
        continent: 'Asia',
        region: 'Asia Sud-orientale / Penisola Indocinese',
        capital: 'Bangkok',
        population: '~71.700.000',
        language: 'Thailandese',
        currency: 'Baht thailandese (THB)',
        coverImg: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/th.svg',
        desc: `La Thailandia (storicamente nota anche come Siam) è uno Stato situato al centro della penisola indocinese, nell'Asia sud-orientale. A differenza di quasi tutti i suoi vicini regionali, la Thailandia vanta un primato storico unico: non è mai stata colonizzata da potenze europee, mantenendo con orgoglio la propria sovranità attraverso i secoli grazie a un'accorta diplomazia e a forti monarchie dinastiche.<br><br>
        Il Paese è una monarchia costituzionale profondamente legata ai valori del Buddismo Theravada, che si riflettono nell'architettura spettacolare dei suoi innumerevoli templi dorati (i *wat*) e nella cortesia proverbiale della sua popolazione, che le è valsa l'appellativo storico di "Paese dei Sorrisi".<br><br>
        Oggi la Thailandia è una delle economie più dinamiche del Sud-est asiatico e una meta turistica globale di primissimo piano, celebre per la vibrante metropoli di Bangkok, le rovine storiche di Ayutthaya (patrimonio UNESCO), la squisita tradizione gastronomica e le sue splendide isole tropicali.`
      },
      {
        id: 'timor-est',
        name: 'Timor Est',
        official: 'Repubblica Democratica di Timor Est',
        continent: 'Asia',
        region: 'Asia Sud-orientale / Insulare',
        capital: 'Dili',
        population: '~1.300.000',
        language: 'Tetum, Portoghese',
        currency: 'Dollaro statunitense (USD)',
        coverImg: 'https://images.unsplash.com/photo-1591325408953-ef9298125f96?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/tl.svg',
        desc: `Timor Est (ufficialmente Repubblica Democratica di Timor Est) è un giovane Stato insulare situato nella parte orientale dell'isola di Timor, nell'arcipelago malese, tra l'Asia sud-orientale e l'Oceania. La sua storia moderna è stata segnata da una drammatica lotta per l'indipendenza: colonizzato dal Portogallo nel XVI secolo, il territorio fu occupato dall'Indonesia nel 1975 e visse decenni di duri conflitti prima di votare per la libertà in un referendum storico e ottenere la piena sovranità nel 2002.<br><br>
        Questa eredità storica ha lasciato un'impronta culturale unica, fondendo le tradizioni indigene del sud-est asiatico e melanesiane con la lingua e la religione cattolica ereditate dal passato coloniale portoghese.<br><br>
        Timor Est è una nazione affascinante e fuori dai circuiti turistici di massa, caratterizzata da aspre montagne vulcaniche che scendono verso il mare, barriere coralline incontaminate e una popolazione fiera e accogliente impegnata nella costruzione del proprio futuro democratico.`
      },
      {
        id: 'turkmenistan',
        name: 'Turkmenistan',
        official: 'Turkmenistan',
        continent: 'Asia',
        region: 'Asia Centrale',
        capital: 'Ashgabat',
        population: '~6.400.000',
        language: 'Turkmeno',
        currency: 'Manat turkmeno (TMT)',
        coverImg: 'https://images.unsplash.com/photo-1622021109028-8ba1d5374161?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/tm.svg',
        desc: `Il Turkmenistan è uno Stato situato nell'Asia centrale, delimitato a ovest dal Mar Caspio e coperto in gran parte dall'immenso e arido deserto del Karakum. La sua storia millenaria è legata alle antiche carovane della Via della Seta e a siti archeologici di eccezionale importanza storica come le rovine dell'antica città di Merv, un tempo uno dei centri culturali e scientifici più importanti del mondo islamico medievale.<br><br>
        Incorporato nell'Impero russo nel XIX secolo e divenuto una repubblica sovietica nel Novecento, il Turkmenistan ha ottenuto l'indipendenza nel 1991 con lo scioglimento dell'URSS, intraprendendo in seguito una politica di rigorosa neutralità internazionale.<br><br>
        Il Paese possiede immense riserve di gas naturale nel sottosuolo — celebre è il cratere gassoso di Darvaza, noto come la "Porta dell'Inferno" —, ed è rinomato per la sua capitale Ashgabat (famosa per i suoi edifici monumentali rivestiti in marmo bianco) e per la pregiata tradizione mondiale dei tappeti turkmeni.`
      },
      {
        id: 'uzbekistan',
        name: 'Uzbekistan',
        official: 'Repubblica dell\'Uzbekistan',
        continent: 'Asia',
        region: 'Asia Centrale',
        capital: 'Tashkent',
        population: '~36.000.000',
        language: 'Uzbeko',
        currency: 'Sum uzbeko (UZS)',
        coverImg: 'https://images.unsplash.com/photo-1733586092622-1b3201e802a5?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/uz.svg',
        desc: `L'Uzbekistan è uno Stato doppiamente senza sbocco al mare situato nel cuore dell'Asia centrale, custode per eccellenza della storia e dei tesori architettonici della leggendaria Via della Seta. Il suo territorio ha visto fiorire imperi gloriosi e dinastie leggendarie, tra cui l'impero di Tamerlano, che fecero di città come Samarcanda, Bukhara e Khiva i centri pulsanti della cultura, della scienza e dell'arte islamica medievale.<br><br>
        Dopo le dominazioni imperiali russe e il periodo sovietico nel XX secolo, l'Uzbekistan ha riconquistato l'indipendenza nel 1991, avviandosi negli ultimi anni verso una fase di riforme, apertura economica e valorizzazione del suo inestimabile patrimonio storico.<br><br>
        Il Paese incanta i viaggiatori di tutto il mondo con le sue piazze monumentali decorate da maioliche e cupole azzurre (come il Registan di Samarcanda), i suoi bazar millenari colmi di spezie e tessuti preziosi, e la straordinaria ospitalità della sua popolazione.`
      },
      {
        id: 'vietnam',
        name: 'Vietnam',
        official: 'Repubblica Socialista del Vietnam',
        continent: 'Asia',
        region: 'Asia Sud-orientale / Penisola Indocinese',
        capital: 'Hanoi',
        population: '~98.800.000',
        language: 'Vietnamita',
        currency: 'Dong vietnamita (VND)',
        coverImg: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/vn.svg',
        desc: `Il Vietnam è uno Stato situato nella penisola indocinese, nell'Asia sud-orientale, caratterizzato da una forma allungata a "S" che si affaccia per migliaia di chilometri sul Mar Cinese Meridionale. La sua storia millenaria è stata plasmata da una fiera resistenza contro le invasioni straniere, culminata prima nella lotta contro il dominio coloniale francese e successivamente nella drammatica guerra del Vietnam, conclusasi nel 1975 con la riunificazione del Paese.<br><br>
        A partire dalla fine degli anni '80, grazie alle riforme economiche del *Đổi Mới*, il Vietnam ha vissuto una trasformazione straordinaria, affermandosi oggi come una delle economie più dinamiche e in rapida crescita dell'Asia, capace di unire la tradizione socialista a un vivace dinamismo mercantile e tecnologico.<br><br>
        Il territorio vietnamita offre paesaggi naturali di stupefacente bellezza: dalle spettacolari formazioni calcaree della baia di Ha Long (patrimonio UNESCO) alle risaie terrazzate di Sapa, passando per le affascinanti città storiche come Hoi An e il delta fluviale del Mekong.`
      },
      {
        id: 'yemen',
        name: 'Yemen',
        official: 'Repubblica dello Yemen',
        continent: 'Asia',
        region: 'Medio Oriente / Penisola Araba',
        capital: 'Sana\'a',
        population: '~33.700.000',
        language: 'Arabo',
        currency: 'Riyal yemenita (YER)',
        coverImg: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ye.svg',
        desc: `Lo Yemen è uno Stato situato nell'estremità meridionale della penisola arabica, in una posizione strategica di eccezionale importanza affacciata sullo stretto di Bab el-Mandeb, che collega il Mar Rosso all'Oceano Indiano. La sua storia millenaria è tra le più affascinanti del mondo antico: culla di grandi regni carovanieri come quello di Saba, lo Yemen era celebre nell'antichità come l'"Arabia Felix" grazie alla produzione e al commercio di incenso, mirra e pregiate spezie.<br><br>
        Nel corso del XX secolo il territorio visse la divisione tra Yemen del Nord e Yemen del Sud, riunificati in un unico Stato nel 1990. La storia contemporanea del Paese è stata purtroppo segnata da profondi conflitti civili e crisi umanitarie che ne hanno messo a dura prova la popolazione e il fragile equilibrio istituzionale.<br><br>
        Nonostante le enormi difficoltà attuali, lo Yemen custodisce un patrimonio architettonico e culturale unico al mondo, celebre per le sue straordinarie case torri di mattoni crudi decorate con motivi geometrici e per la splendida capitale storica di Sana'a (patrimonio UNESCO), testimone di una civiltà antichissima e fiera.`
      },
      {
        id: 'algeria',
        name: 'Algeria',
        official: 'Repubblica Democratica Popolare d\'Algeria',
        continent: 'Africa',
        region: 'Africa Settentrionale / Maghreb',
        capital: 'Algeri',
        population: '~45.600.000',
        language: 'Arabo, Tamazight',
        currency: 'Dinaro algerino (DZD)',
        coverImg: 'https://images.unsplash.com/photo-1575664274476-e02d99195164?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/dz.svg',
        desc: `L'Algeria è il Paese più esteso dell'Africa e del mondo arabo, situato nell'Africa settentrionale tra il Mar Mediterraneo e l'immenso deserto del Sahara. La sua storia millenaria è stata segnata dalle antiche popolazioni berbere, dai regni della Numidia e dalle dominazioni fenicia, romana, vandala, bizantina, araba e ottomana, che hanno lasciato un patrimonio culturale e archeologico di straordinaria ricchezza lungo la fascia costiera e nelle oasi interne.<br><br>
        Dopo oltre un secolo di colonizzazione francese, l'Algeria ha conquistato l'indipendenza nel 1962 al termine di una guerra di liberazione lunga e sanguinosa che ha segnato profondamente la storia contemporanea del Maghreb e del mondo postcoloniale. Nei decenni successivi il Paese ha affrontato complesse sfide politiche e istituzionali, inclusa la dolorosa stagione della guerra civile degli anni Novanta.<br><br>
        Dal punto di vista economico e strategico, l'Algeria occupa un ruolo centrale come importante produttore ed esportatore di idrocarburi, in particolare gas naturale, verso l'Europa e il bacino mediterraneo. Il suo territorio unisce vivaci centri urbani come Algeri e Orano a paesaggi desertici spettacolari come l'Hoggar e il Tassili n'Ajjer, custodi di millenarie incisioni rupestri.`
      },
      {
        id: 'angola',
        name: 'Angola',
        official: 'Repubblica d\'Angola',
        continent: 'Africa',
        region: 'Africa Centrale / Australe',
        capital: 'Luanda',
        population: '~36.700.000',
        language: 'Portoghese',
        currency: 'Kwanza angolano (AOA)',
        coverImg: 'https://images.unsplash.com/photo-1543161949-1f9193812ce8?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ao.svg',
        desc: `L'Angola si affaccia sulla costa atlantica dell'Africa centro-meridionale e possiede una storia segnata da antichi regni africani — tra cui il celebre Regno del Kongo e il Regno di Ndongo — prima dell'arrivo dei navigatori portoghesi alla fine del XV secolo. Per secoli la regione è stata uno dei principali snodi della tratta atlantica degli schiavi, prima di consolidarsi come colonia portoghese fino al XX secolo.<br><br>
        L'indipendenza dal Portogallo, raggiunta nel 1975, si è intrecciata immediatamente con gli equilibri della Guerra Fredda e con una lunghissima guerra civile durata fino al 2002, che ha duramente provato le infrastrutture e il tessuto sociale del Paese. Con il ritorno della pace, l'Angola ha avviato un imponente processo di ricostruzione nazionale e di riorganizzazione istituzionale.<br><br>
        Oggi l'Angola è una delle principali economie petrolifere dell'Africa subsahariana ed è ricca anche di diamanti, minerali e risorse idriche, pur trovandosi di fronte alla sfida di diversificare il proprio sistema produttivo e ridurre le disuguaglianze sociali. La lingua portoghese e le tradizioni musicali come il kizomba e il semba testimoniano la sua identità culturale distintiva.`
      },
      {
        id: 'benin',
        name: 'Benin',
        official: 'Repubblica del Benin',
        continent: 'Africa',
        region: 'Africa Occidentale',
        capital: 'Porto-Novo (ufficiale) / Cotonou (sede del governo)',
        population: '~13.700.000',
        language: 'Francese',
        currency: 'Franco CFA dell\'Africa occidentale (XOF)',
        coverImg: 'https://images.unsplash.com/photo-1657452283926-adec9ee6802e?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/bj.svg',
        desc: `Il Benin è uno Stato dell'Africa occidentale affacciato sul Golfo di Guinea, noto storicamente come Dahomey e celebre per aver ospitato potenti regni precoloniali come quello di Abomey. Questi Stati africani svilupparono strutture politiche, militari e amministrative elaborate e intrattennero intensi rapporti commerciali, divenendo al contempo coinvolti nelle dinamiche della tratta atlantica lungo la cosiddetta "Costa degli Schiavi".<br><br>
        Entrato a far parte dell'Africa Occidentale Francese, il territorio ottenne l'indipendenza nel 1960 assumendo in seguito il nome di Repubblica Popolare del Benin sotto un regime marxista-leninista prima di intraprendere, all'inizio degli anni Novanta, una pionieristica transizione verso la democrazia multipartitica e il costituzionalismo.<br><br>
        Il Benin è considerato uno dei luoghi d'origine e di maggiore vitalità culturale del vudù, riconosciuto come religione ufficiale accanto al cristianesimo e all'islam, e custodisce testimonianze storiche uniche come i palazzi reali di Abomey e le antiche città lacustri come Ganvié.`
      },
      {
        id: 'botswana',
        name: 'Botswana',
        official: 'Repubblica del Botswana',
        continent: 'Africa',
        region: 'Africa Australe',
        capital: 'Gaborone',
        population: '~2.600.000',
        language: 'Inglese, Setswana',
        currency: 'Pula del Botswana (BWP)',
        coverImg: 'https://images.unsplash.com/photo-1531208853003-c1ec1b8a81d7?q=80&w=1833&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/bw.svg',
        desc: `Il Botswana è uno Stato senza sbocco al mare dell'Africa australe, il cui territorio è dominato in gran parte dal deserto del Kalahari e dal celebre delta interno dell'Okavango. Abitato fin dall'antichità da popolazioni san e successivamente da gruppi di lingua bantu, il Paese divenne il protettorato britannico del Bechuanaland nel XIX secolo, conservando un'autonomia interna significativa guidata dai capi tradizionali tswana.<br><br>
        Nel 1966 il Botswana ha conseguito l'indipendenza pacifica come repubblica parlamentare, distinguendosi nell'intero panorama africano per la continuità istituzionale, la stabilità politica e una gestione oculata delle risorse pubbliche. La scoperta di importanti giacimenti diamantiferi poco dopo l'indipendenza ha fornito le basi per una crescita economica sostenuta e duratura.<br><br>
        Grazie a politiche orientate alla sostenibilità e alla tutela ambientale, il Botswana si è affermato come un modello internazionale per l'ecoturismo e la conservazione della fauna selvatica, offrendo santuari naturali di rilievo mondiale come il Delta dell'Okavango e il Parco Nazionale di Chobe.`
      },
      {
        id: 'burkina-faso',
        name: 'Burkina Faso',
        official: 'Burkina Faso',
        continent: 'Africa',
        region: 'Africa Occidentale / Sahel',
        capital: 'Ouagadougou',
        population: '~23.200.000',
        language: 'Francese',
        currency: 'Franco CFA dell\'Africa occidentale (XOF)',
        coverImg: 'https://images.unsplash.com/photo-1645792298509-7aadfa5b6f49?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/bf.svg',
        desc: `Il Burkina Faso è uno Stato senza sbocco al mare dell'Africa occidentale situato nella fascia del Sahel, la cui storia precoloniale è stata profondamente segnata dall'organizzazione politica e culturale dei regni mossi. Queste entità statali riuscirono a preservare per secoli una forte coesione sociale e un'identità distinta all'interno delle complesse dinamiche dell'Africa subsahariana.<br><br>
        Dopo essere stato colonizzato dalla Francia come Alto Volta, il Paese ha raggiunto l'indipendenza nel 1960 e ha attraversato una storia politica agitata da numerosi colpi di Stato e mutamenti di regime. Negli anni Ottanta la figura carismatica di Thomas Sankara ha impresso una svolta radicale e simbolica, culminata nel 1984 con l'adozione del nome Burkina Faso ("terra degli uomini integri").<br><br>
        L'economia del Paese si basa in larga misura sull'agricoltura di sussistenza, sull'allevamento e sull'estrazione dell'oro, mentre la popolazione deve fronteggiare con grande resilienza le sfide legate all'insicurezza regionale e ai cambiamenti climatici. Il Burkina Faso vanta inoltre una vivace tradizione artistica, musicale e cinematografica, con il celebre festival FESPACO di Ouagadougou.`
      },
      {
        id: 'burundi',
        name: 'Burundi',
        official: 'Repubblica del Burundi',
        continent: 'Africa',
        region: 'Africa Orientale / Grandi Laghi',
        capital: 'Gitega',
        population: '~13.200.000',
        language: 'Kirundi, Francese, Inglese',
        currency: 'Franco del Burundi (BIF)',
        coverImg: 'https://images.unsplash.com/photo-1672787076496-ccb18a869605?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/bi.svg',
        desc: `Il Burundi è un piccolo Stato senza sbocco al mare situato nella regione dei Grandi Laghi dell'Africa orientale, affacciato a sud-ovest sul lago Tanganica. Prima dell'arrivo degli europei, il territorio era costituito da un antico regno centralizzato guidato dal *mwami* (il sovrano), dotato di una stratificazione sociale complessa e di un forte senso di continuità culturale legato alla lingua comune kirundi.<br><br>
        Passato sotto il controllo coloniale tedesco e successivamente belga come parte del Ruanda-Urundi, il Burundi ha ottenuto l'indipendenza nel 1962. La sua storia postcoloniale è stata purtroppo segnata da profonde tensioni identitarie, crisi istituzionali e conflitti civili che hanno rallentato lo sviluppo del Paese e causato rilevanti movimenti di popolazione.<br><br>
        Caratterizzato da altopiani collinari densamente popolati e da un clima temperato d'altitudine, il Burundi fonda la propria economia soprattutto sull'agricoltura, in particolare sulla coltivazione di caffè, tè e colture alimentari. La musica tradizionale dei tamburi sacri rappresenta una delle espressioni culturali più antiche e riconoscibili della nazione.`
      },
      {
        id: 'camerun',
        name: 'Camerun',
        official: 'Repubblica del Camerun',
        continent: 'Africa',
        region: 'Africa Centrale',
        capital: 'Yaoundé',
        population: '~28.600.000',
        language: 'Francese, Inglese',
        currency: 'Franco CFA dell\'Africa centrale (XAF)',
        coverImg: 'https://images.unsplash.com/photo-1659947234294-b217aaeb25f8?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/cm.svg',
        desc: `Il Camerun è uno Stato dell'Africa centrale situato lungo il Golfo di Guinea, spesso descritto come un'Africa in miniatura per la straordinaria varietà geografica, climatica e culturale racchiusa nei suoi confini. Dalle foreste pluviali meridionali alle savane e alle regioni saheliane del nord, fino alle pendici vulcaniche del Monte Camerun, il territorio ha ospitato numerose formazioni politiche e tradizioni locali.<br><br>
        Inizialmente protettorato tedesco a partire dal 1884, il territorio fu suddiviso dopo la prima guerra mondiale tra Francia e Regno Unito come mandati della Società delle Nazioni. Il Paese ha raggiunto l'indipendenza tra il 1960 e il 1961 riunendo le due aree in uno Stato federale, poi divenuto unitario, in cui convivono l'eredità francofona e quella anglofona accanto a centinaia di lingue locali.<br><br>
        L'economia camerunese si appoggia sull'agricoltura tropicale (cacao, caffè, banane, olio di palma), sull'estrazione petrolifera, sul legname e sui servizi, con Douala come principale polo economico e portuale e Yaoundé come capitale politica. Il Paese è inoltre celebre in tutto il mondo per la passione calcistica e per la vitalità della sua scena musicale.`
      },
      {
        id: 'capo-verde',
        name: 'Capo Verde',
        official: 'Repubblica di Capo Verde',
        continent: 'Africa',
        region: 'Africa Occidentale / Arcipelago Atlantico',
        capital: 'Praia',
        population: '~600.000',
        language: 'Portoghese',
        currency: 'Escudo capoverdiano (CVE)',
        coverImg: 'https://images.unsplash.com/photo-1678285316987-ea8be4088e19?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/cv.svg',
        desc: `Capo Verde è uno Stato insulare situato nell'Oceano Atlantico, al largo delle coste dell'Africa occidentale, formato da dieci isole principali di origine vulcanica e da diversi isolotti. Disabitate al momento dell'arrivo dei navigatori portoghesi a metà del XV secolo, le isole divennero rapidamente un importante scalo marittimo e commerciale lungo le rotte atlantiche tra Europa, Africa e Americhe.<br><br>
        Nel corso dei secoli si sviluppò una società meticcia originale e una cultura creola profondamente radicata, mentre le frequenti siccità e le limitate risorse agricole alimentavano una storica tradizione migratoria verso l'Europa, le Americhe e altri Paesi africani. Nel 1975 Capo Verde ha conquistato l'indipendenza dal Portogallo, instaurando un sistema democratico stabile e pluralista.<br><br>
        Oggi Capo Verde è riconosciuto per la stabilità istituzionale, la sicurezza e l'evoluzione positiva degli indicatori sociali ed economici, con un'economia trainata dal turismo, dai servizi e dalle rimesse della diaspora. La cultura musicale, incarnata dalla malinconica *morna*, costituisce uno dei tratti più espressivi dell'identità capoverdiana.`
      },
      {
        id: 'ciad',
        name: 'Ciad',
        official: 'Repubblica del Ciad',
        continent: 'Africa',
        region: 'Africa Centrale / Sahel',
        capital: 'N\'Djamena',
        population: '~18.300.000',
        language: 'Francese, Arabo',
        currency: 'Franco CFA dell\'Africa centrale (XAF)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/td.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/td.svg',
        desc: `Il Ciad è un vasto Stato senza sbocco al mare situato nel cuore dell'Africa centrale, a cavallo tra la zona desertica del Sahara a nord, la fascia saheliana al centro e le savane più fertili a sud. La sua storia millenaria è stata attraversata da importanti rotte carovaniere transahariane e dall'ascesa di antichi imperi e regni — tra cui Kanem-Bornu, Wadai e Baguirmi — che hanno favorito scambi commerciali, culturali e religiosi tra il bacino del lago Ciad e il mondo mediterraneo.<br><br>
        Entrato a far parte dell'Africa Equatoriale Francese all'inizio del Novecento, il Paese ha raggiunto l'indipendenza nel 1960. La storia postcoloniale del Ciad è stata segnata da ripetuti conflitti interni, tensioni regionali legate ai Paesi limitrofi e lunghe fasi di instabilità politica e militare che hanno condizionato lo sviluppo istituzionale.<br><br>
        L'economia ciadiana si basa tradizionalmente sull'agricoltura, sull'allevamento pastorale e, a partire dal XXI secolo, sull'estrazione petrolifera, pur dovendo affrontare gravi sfide legate alla povertà, alla sicurezza e al progressivo restringimento del lago Ciad. La varietà etnica e linguistica del Paese riflette l'incontro secolare tra popolazioni saheliane, nilotiche e dell'Africa centrale.`
      },
      {
        id: 'comore',
        name: 'Comore',
        official: 'Unione delle Comore',
        continent: 'Africa',
        region: 'Africa Orientale / Oceano Indiano',
        capital: 'Moroni',
        population: '~850.000',
        language: 'Comoriano, Arabo, Francese',
        currency: 'Franco delle Comore (KMF)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/km.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/km.svg',
        desc: `Le Comore costituiscono uno Stato insulare dell'Oceano Indiano situato tra la costa orientale dell'Africa e l'isola del Madagascar, formato da tre isole principali (Grande Comore, Anjouan e Mohéli) oltre a Mayotte, rimasta sotto amministrazione francese. Fin dall'antichità l'arcipelago è stato inserito nelle reti commerciali dell'Oceano Indiano, accogliendo navigatori e mercanti arabi, swahili e malgasci che hanno dato vita a una società a prevalenza musulmana e a una cultura marittima distintiva.<br><br>
        Dopo essere entrate nell'orbita coloniale francese tra il XIX e l'inizio del XX secolo, le Comore hanno dichiarato l'indipendenza unilaterale nel 1975. Nei decenni successivi l'arcipelago ha attraversato numerose crisi istituzionali, colpi di Stato e spinte autonomiste isolane, cercando stabilità attraverso assetti federali e riforme costituzionali.<br><br>
        L'economia comoriana è fragile e fortemente dipendente dall'agricoltura — in particolare dalla produzione di vaniglia, chiodi di garofano e ylang-ylang —, dal turismo e dalle rimesse dei cittadini emigrati all'estero. Il paesaggio vulcanico e tropicale, dominato dal monte Karthala, custodisce un patrimonio culturale e linguistico singolare.`
      },
      {
        id: 'costa-d-avorio',
        name: 'Costa d\'Avorio',
        official: 'Repubblica della Costa d\'Avorio',
        continent: 'Africa',
        region: 'Africa Occidentale',
        capital: 'Yamoussoukro (politica) / Abidjan (economica)',
        population: '~28.900.000',
        language: 'Francese',
        currency: 'Franco CFA dell\'Africa occidentale (XOF)',
        coverImg: 'https://images.unsplash.com/photo-1552709586-d1aefe5d04b4?q=80&w=1756&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ci.svg',
        desc: `La Costa d'Avorio è uno Stato dell'Africa occidentale affacciato sul Golfo di Guinea, la cui storia precoloniale ha visto l'affermarsi di diversi gruppi etnici e formazioni politiche — tra cui Akan, Kru, Mandé e Gur — inserite nei circuiti commerciali regionali dell'oro, della noce di cola e dei tessuti. Il nome storico del Paese risale ai traffici marittimi europei lungo la costa atlantica prima della strutturazione coloniale francese alla fine del XIX secolo.<br><br>
        Ottenuta l'indipendenza nel 1960 sotto la lunga presidenza di Félix Houphouët-Boigny, la Costa d'Avorio ha conosciuto per circa vent'anni una notevole prosperità economica e stabilità interna, diventando un polo di attrazione per i lavoratori della regione. A partire dalla fine del Novecento, tuttavia, tensioni politiche, identitarie ed economiche hanno portato a gravi crisi e a due conflitti civili tra il 2002 e il 2011, seguiti da una progressiva ripresa.<br><br>
        Oggi il Paese è una delle principali potenze economiche dell'Africa occidentale e il primo produttore mondiale di cacao, affiancato da colture come caffè, anacardi e olio di palma e da un dinamico settore dei servizi centrato su Abidjan.`
      },
      {
        id: 'eritrea',
        name: 'Eritrea',
        official: 'Stato d\'Eritrea',
        continent: 'Africa',
        region: 'Africa Orientale / Corno d\'Africa',
        capital: 'Asmara',
        population: '~3.700.000',
        language: 'Tigrino, Arabo, Inglese',
        currency: 'Nakfa eritreo (ERN)',
        coverImg: 'https://images.unsplash.com/photo-1580320239377-b19ded5536a1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/er.svg',
        desc: `L'Eritrea è uno Stato situato nel Corno d'Africa, affacciato per un lungo tratto sul Mar Rosso e in posizione strategica vicino allo stretto di Bab el-Mandeb. La sua storia antica è strettamente intrecciata alle rotte commerciali del Mar Rosso, alle civiltà dell'altopiano e all'influenza del Regno di Axum, oltre a successive dominazioni ottomane ed egiziane lungo la fascia costiera.<br><br>
        Trasformata in colonia italiana alla fine dell'Ottocento — con Asmara che assunse il ruolo di capitale amministrativa e sviluppò un notevole patrimonio architettonico razionalista e modernista —, l'Eritrea passò poi sotto amministrazione britannica e venne federata all'Etiopia nel 1952. L'annessione etiopica innescò una lunga e dura guerra d'indipendenza durata trent'anni, conclusa nel 1991 e sancita formalmente con il referendum del 1993.<br><br>
        Dopo l'indipendenza il Paese ha affrontato nuove guerre di confine e un regime politico fortemente centralizzato e autoritario, che ha limitato le libertà civili e alimentato un'ampia emigrazione. L'economia eritrea poggia soprattutto sull'agricoltura di sussistenza, sulla pastorizia, sulla pesca e sull'estrazione mineraria.`
      },
      {
        id: 'eswatini',
        name: 'Eswatini',
        official: 'Regno di Eswatini',
        continent: 'Africa',
        region: 'Africa Australe',
        capital: 'Mbabane (amministrativa) / Lobamba (legislativa e reale)',
        population: '~1.200.000',
        language: 'Swati, Inglese',
        currency: 'Lilangeni dello Swaziland (SZL)',
        coverImg: 'https://images.unsplash.com/photo-1655207882298-bd11bb69ee43?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/sz.svg',
        desc: `Eswatini (già noto come Swaziland) è un piccolo Stato senza sbocco al mare dell'Africa australe, incastonato tra il Sudafrica e il Mozambico. La sua storia nazionale è legata alla formazione del regno swazi nel XIX secolo, guidato da sovrani capaci di consolidare l'unità del popolo e di negoziare accordi con le potenze boere e britanniche per preservare l'identità del regno.<br><br>
        Divenuto protettorato britannico all'inizio del Novecento, il Paese ha riconquistato l'indipendenza nel 1968 come monarchia costituzionale, evolvendo però verso un assetto di monarchia assoluta in cui il re detiene ampi poteri esecutivi, legislativi e giudiziari accanto alle istituzioni tradizionali. Nel 2018 il sovrano Mswati III ha ripristinato ufficialmente il nome tradizionale di Eswatini in occasione del cinquantesimo anniversario dell'indipendenza.<br><br>
        L'economia è strettamente integrata a quella sudafricana attraverso l'unione doganale e si fonda sull'agricoltura commerciale (in particolare canna da zucchero e silvicoltura), sull'industria manifatturiera leggera e sui servizi, pur dovendo fronteggiare rilevanti sfide sociali e sanitarie.`
      },
      {
        id: 'etiopia',
        name: 'Etiopia',
        official: 'Repubblica Federale Democratica d\'Etiopia',
        continent: 'Africa',
        region: 'Africa Orientale / Corno d\'Africa',
        capital: 'Addis Abeba',
        population: '~126.500.000',
        language: 'Amarico, Oromo, Tigrino, Somalo, Afar, Inglese',
        currency: 'Birr etiope (ETB)',
        coverImg: 'https://images.unsplash.com/photo-1572888195250-3037a59d3578?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/et.svg',
        desc: `L'Etiopia è uno Stato senza sbocco al mare situato nel Corno d'Africa, caratterizzato da vasti altopiani montuosi e da una delle storie statali più antiche e continue del continente. Dalle radici del potente Regno di Axum alle dinastie cristiane dell'altopiano — testimoniate da capolavori come le chiese monolitiche scavate nella roccia di Lalibela —, il Paese ha mantenuto a lungo una propria identità culturale, alfabetica e religiosa distintiva.<br><br>
        Salvo la breve occupazione fascista italiana tra il 1936 e il 1941, l'Etiopia ha preservato la propria indipendenza durante la spartizione coloniale dell'Africa, diventando un simbolo del panafricanismo e ospitando ad Addis Abeba la sede dell'Unione Africana. Dopo la fine dell'impero nel 1974 e il regime militare del Derg, il Paese ha adottato nel 1995 un ordinamento federale su base etnica.<br><br>
        Negli ultimi decenni l'Etiopia ha registrato un'intensa crescita infrastrutturale ed energetica — culminata nella Grande diga della Rinascita sul Nilo Azzurro —, ma ha dovuto affrontare anche gravi conflitti interni, tensioni regionali e sfide legate allo sviluppo economico e alla coesione nazionale.`
      },
      {
        id: 'gabon',
        name: 'Gabon',
        official: 'Repubblica Gabonese',
        continent: 'Africa',
        region: 'Africa Centrale',
        capital: 'Libreville',
        population: '~2.400.000',
        language: 'Francese',
        currency: 'Franco CFA dell\'Africa centrale (XAF)',
        coverImg: 'https://images.unsplash.com/photo-1758671105080-8f7a359e244f?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ga.svg',
        desc: `Il Gabon è uno Stato dell'Africa centrale affacciato sull'Oceano Atlantico, coperto in larga misura da fitte foreste equatoriali che ospitano una ricchissima biodiversità. Prima della colonizzazione europea, il territorio fu abitato da diverse popolazioni — tra cui gruppi di lingua bantu come Fang, Myéné e Punu — che intrattenevano scambi commerciali lungo i fiumi e lungo la costa atlantica.<br><br>
        Entrato a far parte dell'Africa Equatoriale Francese, il Gabon ha ottenuto l'indipendenza nel 1960 e ha vissuto per oltre mezzo secolo sotto la guida politica di un ristretto gruppo dirigente, segnato dalla lunga presidenza di Omar Bongo e poi da quella del figlio Ali Bongo fino al colpo di Stato militare del 2023.<br><br>
        Grazie alle risorse petrolifere, al manganese e all'industria del legname, il Gabon presenta un reddito medio relativamente elevato rispetto a molti Paesi dell'Africa subsahariana, ma convive con forti disparità interne. Negli ultimi anni ha inoltre puntato sulla tutela forestale e sui parchi nazionali come elemento centrale della propria immagine internazionale.`
      },
      {
        id: 'gambia',
        name: 'Gambia',
        official: 'Repubblica del Gambia',
        continent: 'Africa',
        region: 'Africa Occidentale',
        capital: 'Banjul',
        population: '~2.800.000',
        language: 'Inglese',
        currency: 'Dalasi gambiano (GMD)',
        coverImg: 'https://images.unsplash.com/photo-1774840966262-453f29417552?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/gm.svg',
        desc: `Il Gambia è il più piccolo Stato dell'Africa continentale, caratterizzato da una stretta fascia territoriale che si sviluppa lungo entrambe le sponde del fiume Gambia ed è quasi interamente circondata dal Senegal, fatta eccezione per il breve sbocco sull'Oceano Atlantico. Nel periodo precoloniale la regione fece parte di grandi entità politiche dell'Africa occidentale, tra cui l'Impero del Mali e i regni mandinka e wolof, divenendo un'importante arteria commerciale per l'oro, il sale e altri beni.<br><br>
        Contesa tra portoghesi, francesi e britannici per il controllo strategico della navigazione fluviale, l'area divenne una colonia britannica nel XIX secolo e raggiunse l'indipendenza nel 1965. Dopo decenni di stabilità guidati da Dawda Jawara e il lungo regime autoritario di Yahya Jammeh, dal 2017 il Paese ha avviato una fase di transizione democratica e di riforma delle istituzioni.<br><br>
        L'economia del Gambia dipende fortemente dall'agricoltura (in particolare dalla coltivazione delle arachidi), dalla pesca, dal turismo balneare e naturalistico lungo la costa atlantica e dalle rimesse della diaspora. La cultura locale conserva una forte tradizione orale legata ai *griot*, custodi della memoria storica e musicale della regione.`
      },
      {
        id: 'ghana',
        name: 'Ghana',
        official: 'Repubblica del Ghana',
        continent: 'Africa',
        region: 'Africa Occidentale',
        capital: 'Accra',
        population: '~34.100.000',
        language: 'Inglese',
        currency: 'Cedi ghanese (GHS)',
        coverImg: 'https://images.unsplash.com/photo-1630386226447-af0a955c1009?q=80&w=1724&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/gh.svg',
        desc: `Il Ghana è uno Stato dell'Africa occidentale affacciato sul Golfo di Guinea, noto storicamente come "Costa d'Oro" per gli ingenti giacimenti auriferi che alimentarono per secoli le reti commerciali transahariane e marittime. Nel periodo precoloniale il territorio ospitò potenti formazioni statali, tra cui l'Impero Ashanti, celebre per la raffinata organizzazione politica, militare e artistica.<br><br>
        Colonizzato dal Regno Unito, il Ghana è passato alla storia nel 1957 come il primo Paese dell'Africa subsahariana a conquistare l'indipendenza dal dominio coloniale europeo, sotto la guida carismatica di Kwame Nkrumah, figura centrale del movimento panafricanista. Dopo una fase segnata da crisi economiche e colpi di Stato militari, dagli anni Novanta il Paese ha consolidato un sistema democratico multipartitico tra i più stabili del continente.<br><br>
        Oggi l'economia ghanese si fonda sull'esportazione di oro, cacao e petrolio, affiancata da un settore dei servizi in crescita. Il Ghana vanta inoltre un ricco patrimonio culturale, visibile nei tessuti tradizionali *kente* e nei castelli costieri di Cape Coast ed Elmina, luoghi della memoria legati alla tratta atlantica.`
      },
      {
        id: 'gibuti',
        name: 'Gibuti',
        official: 'Repubblica di Gibuti',
        continent: 'Africa',
        region: 'Africa Orientale / Corno d\'Africa',
        capital: 'Gibuti',
        population: '~1.100.000',
        language: 'Francese, Arabo',
        currency: 'Franco gibutiano (DJF)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/dj.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/dj.svg',
        desc: `Gibuti è un piccolo Stato situato nel Corno d'Africa in una posizione geografica di straordinaria rilevanza strategica, affacciato sullo stretto di Bab el-Mandeb che collega il Mar Rosso al Golfo di Aden e all'Oceano Indiano. Abitato storicamente dalle popolazioni afar e issa (somale), il territorio è stato per secoli un punto di contatto tra le rotte commerciali dell'altopiano etiopico, della penisola arabica e del mondo islamico.<br><br>
        Trasformato in protettorato e poi colonia francese alla fine dell'Ottocento con il nome di Costa Francese dei Somale e successivamente Territorio Francese degli Afar e degli Issa, il Paese ha ottenuto l'indipendenza nel 1977. Da allora ha mantenuto una relativa stabilità interna rispetto ai Paesi vicini, pur convivendo con forti equilibri politici tra le principali componenti etniche.<br><br>
        Privo di significative risorse agricole o minerarie a causa del clima arido e vulcanico (dove spicca il celebre lago Assal), Gibuti basa la propria economia sui servizi portuali e logistici — fungendo da principale sbocco marittimo per l'Etiopia — e sull'affitto di basi militari strategiche a diverse potenze internazionali.`
      },
      {
        id: 'guinea',
        name: 'Guinea',
        official: 'Repubblica di Guinea',
        continent: 'Africa',
        region: 'Africa Occidentale',
        capital: 'Conakry',
        population: '~14.200.000',
        language: 'Francese',
        currency: 'Franco guineano (GNF)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/gn.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/gn.svg',
        desc: `La Guinea è uno Stato dell'Africa occidentale affacciato sull'Oceano Atlantico, spesso definita la "torre d'acqua dell'Africa occidentale" poiché dai suoi altopiani — in particolare dal massiccio del Fouta Djallon — nascono alcuni dei principali fiumi della regione, tra cui il Niger, il Senegal e il Gambia. Nel periodo precoloniale il territorio fu parte di grandi imperi sudanesi come quello del Mali e del Songhai, oltre a ospitare il regno teocratico fulani del Fouta Djallon.<br><br>
        Colonizzata dalla Francia alla fine del XIX secolo, la Guinea si distinse nel 1958 rifiutando l'adesione alla Comunità francese proposta da Charles de Gaulle e diventando la prima colonia dell'Africa subsahariana francese a ottenere l'indipendenza immediata, sotto la guida di Ahmed Sékou Touré. I decenni successivi furono tuttavia segnati da un lungo regime autoritario, isolamento internazionale e ricorrenti crisi militari e costituzionali.<br><br>
        Il sottosuolo guineano è straordinariamente ricco di risorse minerarie — in particolare bauxite (di cui il Paese detiene alcune delle maggiori riserve mondiali), ferro, oro e diamanti —, ma le tensioni politiche e le carenze infrastrutturali hanno finora limitato una piena ricaduta economica sulla popolazione.`
      },
      {
        id: 'guinea-bissau',
        name: 'Guinea-Bissau',
        official: 'Repubblica di Guinea-Bissau',
        continent: 'Africa',
        region: 'Africa Occidentale',
        capital: 'Bissau',
        population: '~2.200.000',
        language: 'Portoghese',
        currency: 'Franco CFA dell\'Africa occidentale (XOF)',
        coverImg: 'https://images.unsplash.com/photo-1623930376524-ead3734be423?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/gw.svg',
        desc: `La Guinea-Bissau è uno Stato dell'Africa occidentale affacciato sull'Oceano Atlantico, caratterizzato da una costa frastagliata, ampi estuari fluviali e dall'arcipelago delle isole Bijagós. Prima della penetrazione europea, la regione fu legata alle dinamiche dell'Impero del Mali e al regno di Kaabu, sviluppando una società complessa con una forte diversità etnica e linguistica.<br><br>
        Già interessata dai traffici commerciali portoghesi a partire dal XV secolo, la Guinea-Bissau fu consolidata come colonia del Portogallo e conquistò l'indipendenza dopo una lunga e determinata lotta armata di liberazione guidata dal PAIGC e teorizzata da Amílcar Cabral, riconosciuta ufficialmente nel 1974. La storia postcoloniale è stata però caratterizzata da frequenti colpi di Stato, instabilità istituzionale e fragile governance.<br><br>
        L'economia della Guinea-Bissau rimane prevalentemente agricola, fortemente incentrata sulla coltivazione ed esportazione degli anacardi, sulla pesca e sull'agricoltura di sussistenza, mentre la diffusione del creolo guineano rappresenta un importante elemento di coesione culturale quotidiana tra le diverse comunità.`
      },
      {
        id: 'guinea-equatoriale',
        name: 'Guinea Equatoriale',
        official: 'Repubblica della Guinea Equatoriale',
        continent: 'Africa',
        region: 'Africa Centrale',
        capital: 'Malabo',
        population: '~1.700.000',
        language: 'Spagnolo, Francese, Portoghese',
        currency: 'Franco CFA dell\'Africa centrale (XAF)',
        coverImg: 'https://images.unsplash.com/photo-1700144068853-671567b77ea8?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/gq.svg',
        desc: `La Guinea Equatoriale è uno Stato dell'Africa centrale composto da una parte continentale (Río Muni), incastonata tra Camerun e Gabon, e da una parte insulare nel Golfo di Guinea che comprende l'isola vulcanica di Bioko — dove sorge la capitale Malabo — e l'isola di Annobón. Abitata originariamente da popolazioni bantu, tra cui i Bubi sull'isola di Bioko e i Fang sul continente, la regione entrò nell'orbita europea nel XV secolo con i navigatori portoghesi.<br><br>
        Ceduta alla Spagna alla fine del XVIII secolo, la Guinea Equatoriale rimase l'unica colonia spagnola nell'Africa subsahariana fino al conseguimento dell'indipendenza nel 1968, conservando così lo spagnolo come lingua ufficiale. La sua storia successiva è stata segnata da un lungo regime autoritario e dalla continuità al potere di Teodoro Obiang Nguema Mbasogo dal 1979.<br><br>
        La scoperta di ingenti giacimenti petroliferi e di gas naturale negli anni Novanta ha trasformato radicalmente i parametri macroeconomici del Paese, generando elevate entrate statali e imponenti opere infrastrutturali, pur lasciando aperte profonde disuguaglianze sociali e la necessità di diversificare l'economia.`
      },
      {
        id: 'kenya',
        name: 'Kenya',
        official: 'Repubblica del Kenya',
        continent: 'Africa',
        region: 'Africa Orientale',
        capital: 'Nairobi',
        population: '~55.100.000',
        language: 'Swahili, Inglese',
        currency: 'Scellino keniota (KES)',
        coverImg: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?q=80&w=1734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ke.svg',
        desc: `Il Kenya è uno Stato dell'Africa orientale affacciato sull'Oceano Indiano e attraversato dalla Grande Rift Valley, celebre sia per i suoi siti paleoantropologici fondamentali nello studio delle origini umane sia per la straordinaria varietà dei suoi ecosistemi. Lungo la fascia costiera si sviluppò per secoli la civiltà swahili, alimentata dai commerci marittimi con il mondo arabo, persiano e indiano.<br><br>
        Divenuto protettorato e colonia dell'Impero britannico alla fine del XIX secolo, il Kenya ha conquistato l'indipendenza nel 1963 dopo anni di lotte anticoloniali, tra cui la rivolta Mau Mau, sotto la guida di Jomo Kenyatta. Nel corso dei decenni il Paese si è affermato come il principale snodo economico, finanziario e logistico dell'Africa orientale, adottando nel 2010 una nuova costituzione volta a rafforzare le istituzioni democratiche e il decentramento.<br><br>
        L'economia keniota si appoggia sull'agricoltura (tè, caffè, orticoltura e floricoltura), sul turismo naturalistico legato a parchi iconici come il Maasai Mara, e su un settore tecnologico e digitale particolarmente dinamico noto come "Silicon Savannah".`
      },
      {
        id: 'lesotho',
        name: 'Lesotho',
        official: 'Regno del Lesotho',
        continent: 'Africa',
        region: 'Africa Australe',
        capital: 'Maseru',
        population: '~2.300.000',
        language: 'Sesotho, Inglese',
        currency: 'Loti del Lesotho (LSL)',
        coverImg: 'https://images.unsplash.com/photo-1655546628936-e1a25058e40c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ls.svg',
        desc: `Il Lesotho è uno Stato montuoso senza sbocco al mare dell'Africa australe, completamente circondato dal territorio del Sudafrica — configurandosi così come una delle poche enclavi statali al mondo — e caratterizzato dall'essere l'unico Paese indipendente il cui intero territorio si trova sopra i mille metri di altitudine. La nazione basotho nacque all'inizio del XIX secolo grazie al re Moshoeshoe I, che riunì diverse comunità rifugiatesi tra i monti Drakensberg per resistere alle guerre regionali.<br><br>
        Per tutelarsi dall'espansione dei coloni boeri, Moshoeshoe I chiese la protezione della Corona britannica, dando origine nel 1868 al protettorato del Basutoland. Il Lesotho ha poi conseguito l'indipendenza nel 1966 come monarchia costituzionale, attraversando in seguito diverse fasi di instabilità politica e militare prima del consolidamento parlamentare.<br><br>
        Soprannominato il "Regno nel Cielo", il Lesotho basa la propria economia sull'industria tessile, sull'agricoltura di montagna, sulle rimesse dei lavoratori impiegati in Sudafrica e sullo sfruttamento delle sue abbondanti risorse idriche ed energetiche attraverso grandi progetti idroelettrici.`
      },
      {
        id: 'liberia',
        name: 'Liberia',
        official: 'Repubblica di Liberia',
        continent: 'Africa',
        region: 'Africa Occidentale',
        capital: 'Monrovia',
        population: '~5.400.000',
        language: 'Inglese',
        currency: 'Dollaro liberiano (LRD)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/lr.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/lr.svg',
        desc: `La Liberia è uno Stato dell'Africa occidentale affacciato sull'Oceano Atlantico, la cui storia moderna è strettamente legata all'insediamento, a partire dagli anni Venti dell'Ottocento, di afroamericani liberati promosso dall'American Colonization Society. Accanto a queste comunità — che fondarono la capitale Monrovia, intitolata al presidente statunitense James Monroe — vivevano numerose popolazioni indigene africane, tra cui Kpelle, Bassa, Gio e Mano, con proprie tradizioni e strutture sociali.<br><br>
        Nel 1847 la Liberia dichiarò la propria indipendenza, divenendo la prima repubblica africana a proclamarsi sovrana in età moderna, sebbene per lungo tempo il potere politico ed economico sia rimasto concentrato nell'élite americo-liberiana. Nella seconda metà del Novecento il Paese attraversò tensioni interne culminate in due sanguinose guerre civili tra il 1989 e il 2003, che causarono gravissime perdite umane e la distruzione di gran parte delle infrastrutture.<br><br>
        Dopo il ritorno alla pace e l'avvio di un percorso democratico, la Liberia ha intrapreso una graduale ricostruzione istituzionale ed economica basata sull'agricoltura (in particolare gomma e olio di palma), sull'estrazione mineraria e sulla registrazione marittima internazionale, pur affrontando rilevanti sfide legate allo sviluppo sociale.`
      },
      {
        id: 'libia',
        name: 'Libia',
        official: 'Stato di Libia',
        continent: 'Africa',
        region: 'Africa Settentrionale / Maghreb',
        capital: 'Tripoli',
        population: '~6.900.000',
        language: 'Arabo',
        currency: 'Dinaro libico (LYD)',
        coverImg: 'https://images.unsplash.com/photo-1639862819821-5350da089c43?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ly.svg',
        desc: `La Libia è uno Stato dell'Africa settentrionale affacciato sul Mar Mediterraneo a nord e confinante a sud con il deserto del Sahara, storicamente articolato attorno a tre grandi macro-regioni: Tripolitania, Cirenaica e Fezzan. Il suo territorio conserva testimonianze archeologiche eccezionali — come Leptis Magna e Sabratha — che riflettono il passaggio di Fenici, Greci, Romani, Bizantini, Arabi e Ottomani lungo le rotte mediterranee e transahariane.<br><br>
        Passata sotto il dominio coloniale italiano all'inizio del Novecento, la Libia divenne uno Stato indipendente nel 1951 sotto la monarchia di re Idris I. Nel 1969 un colpo di Stato militare portò al potere Muammar Gheddafi, che instaurò un regime durato oltre quattro decenni, per poi sfociare nel 2011 in una rivolta armata, nell'intervento internazionale e in una lunga fase di frammentazione politica e conflitti interni.<br><br>
        Dotata delle maggiori riserve petrolifere accertate del continente africano, la Libia fonda la propria economia quasi interamente sul settore degli idrocarburi, mentre la divisione istituzionale tra poli politici rivali continua a ostacolare una piena stabilizzazione nazionale.`
      },
      {
        id: 'madagascar',
        name: 'Madagascar',
        official: 'Repubblica del Madagascar',
        continent: 'Africa',
        region: 'Africa Orientale / Oceano Indiano',
        capital: 'Antananarivo',
        population: '~30.300.000',
        language: 'Malgascio, Francese',
        currency: 'Ariary malgascio (MGA)',
        coverImg: 'https://images.unsplash.com/photo-1558694440-03ade9215d7b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/mg.svg',
        desc: `Il Madagascar è una grande isola situata nell'Oceano Indiano al largo della costa sud-orientale dell'Africa, separata dal continente dal canale del Mozambico. Il popolamento dell'isola è il risultato di un incontro secolare tra gruppi austronesiani provenienti dal Sud-est asiatico e popolazioni bantu dell'Africa orientale, che ha dato origine a una lingua e a una cultura malgascia peculiari, affiancate dall'affermazione del Regno di Merina nell'altopiano centrale nel XIX secolo.<br><br>
        Divenuto colonia francese alla fine dell'Ottocento, il Madagascar ha riconquistato l'indipendenza nel 1960 e ha attraversato nei decenni successivi fasi di sperimentazione socialista, crisi economiche, cicliche turbolenze politiche e alternanze istituzionali.<br><br>
        L'isola è universalmente nota per il suo straordinario endemismo naturalistico — con specie uniche come i lemuri, i camaleonti e i maestosi baobab — e fonda la propria economia sull'agricoltura (in particolare la vaniglia, di cui è il primo produttore mondiale), sull'estrazione mineraria, sul tessile e sull'ecoturismo.`
      },
      {
        id: 'malawi',
        name: 'Malawi',
        official: 'Repubblica del Malawi',
        continent: 'Africa',
        region: 'Africa Orientale / Australe',
        capital: 'Lilongwe',
        population: '~20.900.000',
        language: 'Chichewa, Inglese',
        currency: 'Kwacha del Malawi (MWK)',
        coverImg: 'https://images.unsplash.com/photo-1715948889156-8e7b1ee20231?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/mw.svg',
        desc: `Il Malawi è uno Stato senza sbocco al mare dell'Africa centro-orientale, sviluppato lungo la sponda occidentale del vasto lago Malawi (o lago Niassa), inserito nella Grande Rift Valley. Prima della colonizzazione europea, il territorio fu interessato dalle migrazioni bantu e dalla formazione di regni come l'Impero Maravi, prima di subire l'impatto delle incursioni negriere e dell'espansione commerciale nel XIX secolo.<br><br>
        Divenuto protettorato britannico con il nome di Nyasaland e poi parte della Federazione della Rhodesia e del Nyasaland, il Paese ha raggiunto l'indipendenza nel 1964 sotto la guida di Hastings Kamuzu Banda, che instaurò un regime monopartitico durato fino alla transizione democratica multipartitica della metà degli anni Novanta.<br><br>
        L'economia malawiana è fortemente legata all'agricoltura rurale — con il tabacco, il tè e lo zucchero tra le principali colture d'esportazione — e affronta sfide strutturali legate all'elevata crescita demografica, alla povertà e alla vulnerabilità climatica, pur contando su risorse naturalistiche rilevanti come il lago e gli altopiani.`
      },
      {
        id: 'mali',
        name: 'Mali',
        official: 'Repubblica del Mali',
        continent: 'Africa',
        region: 'Africa Occidentale / Sahel',
        capital: 'Bamako',
        population: '~23.300.000',
        language: 'Francese',
        currency: 'Franco CFA dell\'Africa occidentale (XOF)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ml.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ml.svg',
        desc: `Il Mali è un vasto Stato senza sbocco al mare dell'Africa occidentale situato nella fascia saheliana e attraversato da un'ampia ansa del fiume Niger, che ha rappresentato storicamente un'arteria vitale per l'agricoltura, la pesca e i commerci. Il territorio fu il cuore di alcuni tra i più celebri e potenti imperi dell'Africa precoloniale — tra cui l'Impero del Ghana, l'Impero del Mali e l'Impero Songhai — con città come Timbuctu e Djenné divenute centri illustri di studi islamici, scambi culturali e commercio dell'oro e del sale.<br><br>
        Entrato a far parte del Sudan Francese all'interno dell'Africa Occidentale Francese, il Mali ha conquistato l'indipendenza nel 1960 e ha conosciuto decenni segnati da regimi autoritari, colpi di Stato e una successiva apertura democratica negli anni Novanta. A partire dal 2012 il Paese è stato travolto da una grave crisi multidimensionale legata alle rivendicazioni autonomiste nel nord, all'espansione di gruppi armati e a nuove prese del potere militari.<br><br>
        L'economia maliana si fonda sull'agricoltura, sull'allevamento e sull'estrazione dell'oro — di cui il Paese è tra i principali produttori africani —, in un contesto reso complesso dall'insicurezza, dalle difficoltà climatiche e da un patrimonio storico e musicale di straordinaria importanza.`
      },
      {
        id: 'marocco',
        name: 'Marocco',
        official: 'Regno del Marocco',
        continent: 'Africa',
        region: 'Africa Settentrionale / Maghreb',
        capital: 'Rabat',
        population: '~37.800.000',
        language: 'Arabo, Tamazight',
        currency: 'Dirham marocchino (MAD)',
        coverImg: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ma.svg',
        desc: `Il Marocco è una monarchia situata nell'estremità nord-occidentale dell'Africa, affacciata sull'Oceano Atlantico a ovest e sul Mar Mediterraneo a nord, separata dalla penisola iberica dallo stretto di Gibilterra. La sua storia plurisecolare è stata plasmata dalle popolazioni berbere (amazigh), dall'arrivo dell'Islam e dalla successione di grandi dinastie imperiali — tra cui Idrissidi, Almoravidi, Almohadi, Marinidi e Alawiti — che fondarono città storiche celebri come Fes, Marrakech e Meknes e collegarono il Mediterraneo alle rotte subsahariane.<br><br>
        Suddiviso all'inizio del Novecento in protettorati francese e spagnolo (oltre alla zona internazionale di Tangeri), il Marocco ha riconquistato l'indipendenza nel 1956 sotto la dinastia alawita, avviando negli ultimi decenni riforme costituzionali e un'intensa modernizzazione infrastrutturale, mentre resta aperta la questione del Sahara Occidentale.<br><br>
        Oggi il Marocco si distingue per una relativa stabilità politica e per un'economia diversificata che unisce agricoltura, industria manifatturiera e automobilistica, energie rinnovabili, turismo e importanti connessioni economiche e logistiche con l'Europa e con il resto dell'Africa.`
      },
      {
        id: 'mauritania',
        name: 'Mauritania',
        official: 'Repubblica Islamica di Mauritania',
        continent: 'Africa',
        region: 'Africa Occidentale / Maghreb - Sahel',
        capital: 'Nouakchott',
        population: '~4.900.000',
        language: 'Arabo, Francese',
        currency: 'Ouguiya mauritana (MRU)',
        coverImg: 'https://images.unsplash.com/photo-1543318557-a11bce6e033a?q=80&w=1752&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/mr.svg',
        desc: `La Mauritania è uno Stato dell'Africa nord-occidentale affacciato sull'Oceano Atlantico, in una zona di transizione tra il Maghreb e l'Africa subsahariana caratterizzata da ampie distese desertiche e dalla valle del fiume Senegal a sud. Nel corso della storia la regione fu attraversata da carovane commerciali e ospitò centri carovanieri storici come Chinguetti e Ouadane, oltre a essere legata alle dinamiche degli imperi dell'Africa occidentale e del movimento almoravide.<br><br>
        Colonizzata dalla Francia all'inizio del Novecento, la Mauritania ha ottenuto l'indipendenza nel 1960, assumendo l'identità di repubblica islamica e affrontando nei decenni successivi colpi di Stato militari, tensioni interetniche e le ripercussioni del conflitto nel Sahara Occidentale.<br><br>
        L'economia mauritana si basa sull'estrazione mineraria — in particolare sul minerale di ferro e sull'oro —, sulla pesca lungo le ricche acque atlantiche e sull'allevamento pastorale, mentre il Paese deve fronteggiare le sfide legate all'aridità climatica e alle disuguaglianze interne.`
      },
      {
        id: 'mauritius',
        name: 'Mauritius',
        official: 'Repubblica di Mauritius',
        continent: 'Africa',
        region: 'Africa Orientale / Oceano Indiano',
        capital: 'Port Louis',
        population: '~1.300.000',
        language: 'Inglese, Francese',
        currency: 'Rupia di Mauritius (MUR)',
        coverImg: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/mu.svg',
        desc: `Mauritius è uno Stato insulare dell'Oceano Indiano situato a est del Madagascar, all'interno dell'arcipelago delle Mascarene, di origine vulcanica e circondato da barriere coralline. Rimasta disabitata per gran parte della sua storia, l'isola divenne un importante punto d'appoggio marittimo a partire dal XVI secolo, conoscendo insediamenti olandesi, la colonizzazione francese come Île de France e infine il controllo britannico dal 1810.<br><br>
        Durante il periodo coloniale l'economia dell'isola si concentrò sulla coltivazione della canna da zucchero, favorendo l'arrivo di lavoratori a contratto provenienti soprattutto dall'India, accanto a popolazioni di origine africana, creola e cinese. Ottenuta l'indipendenza nel 1968, Mauritius ha costruito un sistema democratico parlamentare stabile e una società multiculturale e multireligiosa.<br><br>
        Oggi Mauritius si distingue per uno degli standard di vita e di sviluppo economico più elevati dell'Africa, grazie a una riuscita diversificazione che affianca all'industria zuccheriera e al turismo di fascia alta i servizi finanziari, il tessile, l'agroindustria e le tecnologie dell'informazione.`
      },
      {
        id: 'mozambico',
        name: 'Mozambico',
        official: 'Repubblica del Mozambico',
        continent: 'Africa',
        region: 'Africa Orientale / Australe',
        capital: 'Maputo',
        population: '~33.900.000',
        language: 'Portoghese',
        currency: 'Metical mozambicano (MZN)',
        coverImg: 'https://images.unsplash.com/photo-1544298903-35eee5a95b4d?q=80&w=1822&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/mz.svg',
        desc: `Il Mozambico è uno Stato dell'Africa sud-orientale affacciato per un lungo tratto sull'Oceano Indiano, di fronte al Madagascar e lungo il canale omonimo. Fin dall'antichità la fascia costiera fu integrata nelle rotte commerciali dell'Oceano Indiano, con l'affermarsi di porti e centri swahili e di entità politiche dell'interno come l'Impero di Monomotapa.<br><br>
        A partire dall'arrivo di Vasco da Gama alla fine del Quattrocento, il Portogallo estese progressivamente la propria presenza fino a consolidare il controllo coloniale sul territorio. L'indipendenza fu raggiunta nel 1975 dopo una lunga guerra di liberazione guidata dal FRELIMO, ma fu seguita da una devastante guerra civile durata fino al 1992, aggravata da crisi economiche e calamità naturali.<br><br>
        Negli ultimi decenni il Mozambico ha avviato un percorso di ricostruzione e di apertura agli investimenti, puntando sull'agricoltura, sulle infrastrutture portuali e sulle importanti scoperte di gas naturale offshore, mentre deve continuare a affrontare le sfide della povertà e dell'insicurezza in alcune aree settentrionali.`
      },
      {
        id: 'namibia',
        name: 'Namibia',
        official: 'Repubblica di Namibia',
        continent: 'Africa',
        region: 'Africa Australe',
        capital: 'Windhoek',
        population: '~3.000.000',
        language: 'Inglese, Afrikaans, Tedesco, Lingue locali',
        currency: 'Dollaro namibiano (NAD)',
        coverImg: 'https://images.unsplash.com/photo-1563985336376-568060942b80?q=80&w=1752&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/na.svg',
        desc: `La Namibia è uno Stato dell'Africa sud-occidentale affacciato sull'Oceano Atlantico, caratterizzato da una bassissima densità abitativa e da paesaggi aridi e suggestivi dominati dal deserto del Namib, dal Kalahari e dalla costa atlantica. Abitata fin dall'antichità da popolazioni san, damara, nama ed herero, e successivamente da gruppi ovambo e kavango, la regione entrò nell'orbita coloniale europea alla fine del XIX secolo come Africa Tedesca del Sud-Ovest.<br><br>
        Dopo la prima guerra mondiale il territorio passò sotto l'amministrazione del Sudafrica su mandato della Società delle Nazioni e venne poi assoggettato al sistema dell'apartheid. La Namibia ha conquistato la piena indipendenza nel 1990 al termine di una lunga lotta di liberazione guidata dallo SWAPO e del processo diplomatico internazionale, instaurando una democrazia costituzionale stabile.<br><br>
        L'economia namibiana si basa sull'estrazione mineraria — in particolare diamanti, uranio, zinco e rame —, sull'allevamento, sulla pesca, sul turismo naturalistico e sulle emergenti prospettive legate alle energie rinnovabili e all'idrogeno verde.`
      },
      {
        id: 'niger',
        name: 'Niger',
        official: 'Repubblica del Niger',
        continent: 'Africa',
        region: 'Africa Occidentale / Sahel',
        capital: 'Niamey',
        population: '~27.200.000',
        language: 'Francese',
        currency: 'Franco CFA dell\'Africa occidentale (XOF)',
        coverImg: 'https://images.unsplash.com/photo-1669749713424-e7a0dbf605e6?q=80&w=1889&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ne.svg',
        desc: `Il Niger è un vasto Stato senza sbocco al mare dell'Africa occidentale situato nella fascia saheliana, attraversato a sud-ovest dal fiume Niger e caratterizzato in gran parte da ambienti desertici e semi-aridi. Nel corso della storia la regione fu un importante snodo delle rotte transahariane e vide l'affermarsi di imperi e regni — tra cui Songhai, Kanem-Bornu, gli stati hausa e il sultanato di Damagaram — che intrecciarono scambi commerciali, culturali e islamici con il Nordafrica e il resto dell'Africa occidentale.<br><br>
        Colonizzato dalla Francia all'inizio del Novecento, il Niger ha ottenuto l'indipendenza nel 1960 e ha vissuto un'alternanza di fasi civili, regimi militari, crisi costituzionali e tensioni legate all'insicurezza regionale nel Sahel, fino al colpo di Stato militare del 2023.<br><br>
        L'economia nigerina poggia sull'agricoltura, sull'allevamento pastorale e sull'estrazione dell'uranio, pur affrontando sfide strutturali molto severe legate alla siccità, all'elevata crescita demografica e alle difficoltà infrastrutturali.`
      },
      {
        id: 'nigeria',
        name: 'Nigeria',
        official: 'Repubblica Federale della Nigeria',
        continent: 'Africa',
        region: 'Africa Occidentale',
        capital: 'Abuja',
        population: '~223.800.000',
        language: 'Inglese',
        currency: 'Naira nigeriana (NGN)',
        coverImg: 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ng.svg',
        desc: `La Nigeria è il Paese più popoloso dell'Africa, situato nell'Africa occidentale lungo il Golfo di Guinea e caratterizzato da una straordinaria pluralità etnica, linguistica e culturale che riunisce centinaia di gruppi, tra cui hausa-fulani, yoruba e igbo. Prima della colonizzazione europea il territorio ospitò civiltà e formazioni statali di grande rilievo — come la cultura Nok, il Regno del Benin, l'Impero di Oyo e il Califfato di Sokoto — inserite in ampie reti commerciali e artistiche.<br><br>
        Unificata sotto il dominio coloniale britannico all'inizio del Novecento, la Nigeria ha conquistato l'indipendenza nel 1960, attraversando una dolorosa guerra civile legata alla secessione del Biafra tra il 1967 e il 1970, diversi governi militari e, dal 1999, una continuità democratica federale.<br><br>
        Oggi la Nigeria rappresenta una delle principali potenze economiche e demografiche del continente, con un'economia legata al petrolio e al gas ma anche a un vivace settore dei servizi, all'agricoltura, alla finanza digitale e a un'enorme influenza culturale attraverso la musica afrobeats e l'industria cinematografica di Nollywood.`
      },
      {
        id: 'repubblica-centrafricana',
        name: 'Repubblica Centrafricana',
        official: 'Repubblica Centrafricana',
        continent: 'Africa',
        region: 'Africa Centrale',
        capital: 'Bangui',
        population: '~5.700.000',
        language: 'Sango, Francese',
        currency: 'Franco CFA dell\'Africa centrale (XAF)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/cf.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/cf.svg',
        desc: `La Repubblica Centrafricana è uno Stato senza sbocco al mare situato nel cuore dell'Africa centrale, in una posizione geografica interna caratterizzata da savane, foreste equatoriali e corsi d'acqua appartenenti ai bacini del Congo e dello Shari. Prima della colonizzazione europea, il territorio fu abitato da diverse popolazioni — tra cui gbaya, banda, mandja e sara — e subì l'impatto delle rotte commerciali e delle razzie legate alla tratta schiavista regionale.<br><br>
        Entrato a far parte dell'Africa Equatoriale Francese con il nome di Oubangui-Chari, il Paese ha raggiunto l'indipendenza nel 1960 e ha conosciuto una storia postcoloniale segnata da colpi di Stato, regimi autoritari, fragilità istituzionale e lunghi cicli di conflitti armati e crisi umanitarie che hanno profondamente segnato la vita quotidiana.<br><br>
        Nonostante la ricchezza potenziale di risorse naturali — tra cui diamanti, oro, legname e terre coltivabili —, l'economia centrafricana resta tra le più fragili del continente a causa dell'insicurezza, dell'isolamento geografico e della carenza di infrastrutture.`
      },
      {
        id: 'repubblica-democratica-del-congo',
        name: 'Repubblica Democratica del Congo',
        official: 'Repubblica Democratica del Congo',
        continent: 'Africa',
        region: 'Africa Centrale',
        capital: 'Kinshasa',
        population: '~102.300.000',
        language: 'Francese, Lingala, Swahili, Kikongo, Tshiluba',
        currency: 'Franco congolese (CDF)',
        coverImg: 'https://images.unsplash.com/photo-1657671520058-64293338bf94?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/cd.svg',
        desc: `La Repubblica Democratica del Congo è il secondo Paese più esteso dell'Africa e uno dei più popolosi del continente, situato nell'Africa centrale attorno all'immenso bacino idrografico del fiume Congo e alla foresta pluviale equatoriale. Nel periodo precoloniale il territorio fu sede di importanti regni e imperi — tra cui il Regno del Kongo, l'Impero di Lunda e l'Impero di Luba — che svilupparono complesse strutture sociali, artistiche e commerciali.<br><br>
        Dopo essere stato dapprima possedimento personale di re Leopoldo II del Belgio come Stato Libero del Congo e poi colonia belga del Congo Belga, il Paese ha ottenuto l'indipendenza nel 1960. La storia postcoloniale è stata duramente segnata da crisi immediate, dalla lunga dittatura di Mobutu Sese Seko (con il nome di Zaire) e da devastanti conflitti regionali a partire dalla fine degli anni Novanta.<br><br>
        Dotata di risorse naturali straordinarie — tra cui cobalto, rame, diamanti, coltan, vasti giacimenti minerari, potenziale idroelettrico e una biodiversità forestale cruciale a livello globale —, la Repubblica Democratica del Congo affronta tuttora gravi sfide legate alla sicurezza, alla governance e alla traduzione delle proprie ricchezze in sviluppo diffuso.`
      },
      {
        id: 'repubblica-del-congo',
        name: 'Repubblica del Congo',
        official: 'Repubblica del Congo',
        continent: 'Africa',
        region: 'Africa Centrale',
        capital: 'Brazzaville',
        population: '~6.100.000',
        language: 'Francese, Lingala, Kituba',
        currency: 'Franco CFA dell\'Africa centrale (XAF)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/cg.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/cg.svg',
        desc: `La Repubblica del Congo è uno Stato dell'Africa centrale affacciato sull'Oceano Atlantico e delimitato a est e a sud dal fiume Congo e dall'Oubangui, di fronte a Kinshasa, con Brazzaville come capitale. Prima della colonizzazione europea, il territorio fu legato alle dinamiche del Regno del Kongo e di altri regni locali — come il Regno di Loango e il Regno Tio — che intrattenevano scambi commerciali lungo il fiume e la costa atlantica.<br><br>
        Entrato a far parte dell'Africa Equatoriale Francese come Congo Francese, il Paese ha raggiunto l'indipendenza nel 1960 e ha attraversato una fase di orientamento marxista-leninista, tensioni politiche e una guerra civile negli anni Novanta, prima di consolidare un sistema di potere presidenziale duraturo.<br><br>
        L'economia congolese si basa in larga misura sull'estrazione petrolifera, sul legname e sulle risorse forestali tropicali, pur dovendo affrontare la necessità di diversificare il sistema produttivo e migliorare i servizi sociali per una popolazione in gran parte concentrata nei centri urbani.`
      },
      {
        id: 'ruanda',
        name: 'Ruanda',
        official: 'Repubblica del Ruanda',
        continent: 'Africa',
        region: 'Africa Orientale / Grandi Laghi',
        capital: 'Kigali',
        population: '~14.100.000',
        language: 'Kinyarwanda, Inglese, Francese, Swahili',
        currency: 'Franco ruandese (RWF)',
        coverImg: 'https://images.unsplash.com/photo-1786795468102-84cd1ac41cd8?q=80&w=1675&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/rw.svg',
        desc: `Il Ruanda è un piccolo Stato senza sbocco al mare situato nella regione dei Grandi Laghi dell'Africa orientale, noto come il "Paese delle mille colline" per la morfologia montuosa e collinare che caratterizza il suo territorio. Nel periodo precoloniale l'area fu organizzata sotto una monarchia centralizzata legata al re (*mwami*), con una società stratificata e un'identità linguistica comune espressa dal kinyarwanda.<br><br>
        Divenuto parte dell'Africa Orientale Tedesca e poi affidato al Belgio come mandato e amministrazione fiduciaria insieme al Burundi, il Ruanda ha raggiunto l'indipendenza nel 1962. La sua storia contemporanea è stata segnata da gravi tensioni identitarie e dal tragico genocidio del 1994, un evento devastante che ha lasciato ferite profonde prima dell'avvio di un lungo percorso di ricostruzione e riconciliazione nazionale.<br><br>
        Negli ultimi decenni il Ruanda ha registrato una notevole crescita economica e un forte impegno nella modernizzazione amministrativa, nelle infrastrutture urbane — con Kigali tra le città più ordinate della regione —, nell'agricoltura (caffè e tè) e nell'ecoturismo legato alla tutela dei gorilla di montagna.`
      },
      {
        id: 'sao-tome-e-principe',
        name: 'São Tomé e Príncipe',
        official: 'Repubblica Democratica di São Tomé e Príncipe',
        continent: 'Africa',
        region: 'Africa Centrale / Golfo di Guinea',
        capital: 'São Tomé',
        population: '~230.000',
        language: 'Portoghese',
        currency: 'Dobra di São Tomé e Príncipe (STN)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/st.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/st.svg',
        desc: `São Tomé e Príncipe è uno dei più piccoli Stati dell'Africa, costituito da due isole vulcaniche principali — São Tomé e Príncipe — e da isolotti minori situati nel Golfo di Guinea, al largo della costa dell'Africa centrale. Disabitate fino all'arrivo dei navigatori portoghesi nella seconda metà del Quattrocento, le isole divennero rapidamente un importante avamposto atlantico e uno dei primi centri di coltivazione della canna da zucchero mediante il lavoro servile.<br><br>
        Nel corso dei secoli successivi l'economia insulare si riconvertì in larga misura alle piantagioni di cacao e caffè, dando origine a una società creola singolare e a un patrimonio architettonico coloniale legato alle antiche aziende agricole (*roças*). Il Paese ha ottenuto l'indipendenza dal Portogallo nel 1975, instaurando in seguito un sistema democratico multipartitico stabile.<br><br>
        L'economia nazionale resta contenuta e fortemente legata all'agricoltura (in particolare il cacao), ai servizi, agli aiuti internazionali e al turismo naturalistico, valorizzando le foreste tropicali interne, le coste vulcaniche e la notevole biodiversità insulare.`
      },
      {
        id: 'senegal',
        name: 'Senegal',
        official: 'Repubblica del Senegal',
        continent: 'Africa',
        region: 'Africa Occidentale',
        capital: 'Dakar',
        population: '~18.400.000',
        language: 'Francese',
        currency: 'Franco CFA dell\'Africa occidentale (XOF)',
        coverImg: 'https://images.unsplash.com/photo-1648504735627-6af97e8337a9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/sn.svg',
        desc: `Il Senegal è uno Stato dell'Africa occidentale affacciato sull'Oceano Atlantico, situato nell'estremità occidentale del continente e segnato da una posizione di rilievo nelle rotte marittime e culturali tra Africa, Europa e Americhe. Nel periodo precoloniale il territorio fu attraversato dall'influenza di grandi imperi e regni — tra cui Ghana, Mali, Jolof, Cayor e Tekrur — e divenne un importante centro di diffusione dell'Islam e delle confraternite religiose, come il mouridismo e il tijanismo.<br><br>
        Divenuto il fulcro amministrativo dell'Africa Occidentale Francese — con l'isola di Gorée segnata dalla memoria della tratta atlantica e Dakar divenuta capitale federale —, il Senegal ha raggiunto l'indipendenza nel 1960, prima all'interno della breve Federazione del Mali e poi come Stato autonomo sotto la guida di Léopold Sédar Senghor. Il Paese si è distinto nel panorama regionale per una continuità democratica e un'alternanza politica relativamente pacifica.<br><br>
        L'economia senegalese si fonda sull'agricoltura (arachidi, miglio, orticoltura), sulla pesca, sull'estrazione mineraria (fosfati, oro, zircone), sui servizi e sulle rimesse della diaspora, mentre la cultura nazionale gode di ampia risonanza internazionale attraverso la musica, la letteratura e le arti visive.`
      },
      {
        id: 'seychelles',
        name: 'Seychelles',
        official: 'Repubblica delle Seychelles',
        continent: 'Africa',
        region: 'Africa Orientale / Oceano Indiano',
        capital: 'Victoria',
        population: '~120.000',
        language: 'Creolo delle Seychelles, Inglese, Francese',
        currency: 'Rupia delle Seychelles (SCR)',
        coverImg: 'https://images.unsplash.com/photo-1553829176-61484f865ac3?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/sc.svg',
        desc: `Le Seychelles costituiscono un arcipelago di oltre cento isole situato nell'Oceano Indiano occidentale, a nord-est del Madagascar, articolato tra isole granitiche centrali — come Mahé, Praslin e La Digue — e isole coralline più basse ed estese. Prive di una popolazione indigena stanziale in epoca antica, le isole furono visitate da navigatori arabi e maldiviani prima dell'arrivo degli europei e divennero un possedimento francese nel XVIII secolo e poi una colonia britannica.<br><br>
        Durante l'età coloniale l'economia si sviluppò attorno alle piantagioni di cocco e cannella e alla formazione di una società creola multietnica, mentre nel 1976 l'arcipelago ha raggiunto l'indipendenza dal Regno Unito. Dopo una fase di partito unico e un tentativo di colpo di Stato all'inizio degli anni Ottanta, il Paese ha consolidato un sistema democratico multipartitico.<br><br>
        Con il PIL pro capite più elevato dell'Africa continentale e insulare, le Seychelles basano la propria prosperità sul turismo di fascia alta, sulla pesca e sull'economia blu, unendo uno sviluppo economico avanzato a politiche ambientali pionieristiche per la tutela delle barriere coralline, delle tartarughe giganti e della biodiversità marina.`
      },
      {
        id: 'sierra-leone',
        name: 'Sierra Leone',
        official: 'Repubblica della Sierra Leone',
        continent: 'Africa',
        region: 'Africa Occidentale',
        capital: 'Freetown',
        population: '~8.800.000',
        language: 'Inglese',
        currency: 'Leone della Sierra Leone (SLE)',
        coverImg: 'https://images.unsplash.com/photo-1611395813517-41f9be5e292d?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/sl.svg',
        desc: `La Sierra Leone è uno Stato dell'Africa occidentale affacciato sull'Oceano Atlantico, caratterizzato da un ampio porto naturale a Freetown, da coste con mangrovie e da altopiani e foreste nell'interno. Abitata da diverse popolazioni — tra cui Mende, Temne, Limba e Kono — la regione acquisì una fisionomia particolare alla fine del Settecento con l'insediamento di ex schiavi africani liberati provenienti dalla Gran Bretagna, dal Nord America e dai Caraibi, che diedero origine alla comunità krio.<br><br>
        Divenuta colonia e protettorato britannico, la Sierra Leone ha conquistato l'indipendenza nel 1961. Dopo decenni segnati da governi monopartitici, crisi economiche e corruzione, il Paese fu sconvolto tra il 1991 e il 2002 da una brutale guerra civile legata anche al controllo delle risorse minerarie, conclusa con l'intervento internazionale e l'avvio di processi di giustizia e ricostruzione.<br><br>
        L'economia si basa sull'estrazione mineraria (diamanti, rutilo, bauxite, ferro), sull'agricoltura e sulla pesca, in un contesto di lenta ripresa sociale e istituzionale dopo i traumi del conflitto e le emergenze sanitarie degli ultimi decenni.`
      },
      {
        id: 'somalia',
        name: 'Somalia',
        official: 'Repubblica Federale di Somalia',
        continent: 'Africa',
        region: 'Africa Orientale / Corno d\'Africa',
        capital: 'Mogadiscio',
        population: '~18.400.000',
        language: 'Somalo, Arabo',
        currency: 'Scellino somalo (SOS)',
        coverImg: 'https://images.unsplash.com/photo-1661135401065-36dee543c72b?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/so.svg',
        desc: `La Somalia occupa la punta estrema del Corno d'Africa, affacciandosi a nord sul Golfo di Aden e a est sull'Oceano Indiano con la linea costiera più lunga dell'Africa continentale. Fin dall'antichità le sue coste e i suoi porti — come Zeila, Berbera e Mogadiscio — sono stati snodi fondamentali dei commerci marittimi dell'Oceano Indiano, favorendo l'incontro tra la cultura pastorale e clanica somala, l'Islam e le reti mercantili arabe e asiatiche.<br><br>
        Suddivisa tra la fine dell'Ottocento e il Novecento in aree coloniali britanniche e italiane, la Somalia ha raggiunto l'indipendenza nel 1960 con l'unione della Somalia Britannica e della Somalia Italiana. Dopo il colpo di Stato di Siad Barre nel 1969 e il crollo dello Stato centrale nel 1991, il Paese ha attraversato decenni di frammentazione clanica, guerra civile, crisi umanitarie e autonomie de facto come il Somaliland.<br><br>
        L'economia somala si regge soprattutto sull'allevamento pastorale, sull'agricoltura, sulla pesca, sulle telecomunicazioni e sulle rimesse della numerosa diaspora, mentre il governo federale continua a confrontarsi con la sicurezza interna e la ricostruzione delle istituzioni.`
      },
      {
        id: 'sudafrica',
        name: 'Sudafrica',
        official: 'Repubblica del Sudafrica',
        continent: 'Africa',
        region: 'Africa Australe',
        capital: 'Pretoria (esecutiva), Città del Capo (legislativa), Bloemfontein (giudiziaria)',
        population: '~60.400.000',
        language: 'Zulu, Xhosa, Afrikaans, Inglese, e altre lingue ufficiali',
        currency: 'Rand sudafricano (ZAR)',
        coverImg: 'https://images.unsplash.com/photo-1603980186145-4e6ef4f53500?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/za.svg',
        desc: `Il Sudafrica occupa l'estremità meridionale del continente africano, affacciandosi sia sull'Oceano Atlantico sia sull'Oceano Indiano e caratterizzandosi per una notevole varietà geografica, climatica e culturale, sintetizzata nell'immagine della "Nazione Arcobaleno". Abitato da popolazioni khoisan e successivamente da gruppi di lingua bantu — tra cui zulu, xhosa e sotho —, il territorio vide l'insediamento olandese del Capo nel XVII secolo, l'espansione britannica e le guerre anglo-boere.<br><br>
        Dopo la costituzione dell'Unione Sudafricana nel 1910 e la piena indipendenza dal Commonwealth, il sistema dell'apartheid istituzionalizzò a partire dal 1948 una rigida segregazione razziale a danno della maggioranza nera. La lunga resistenza interna e internazionale portò, all'inizio degli anni Novanta, alla fine del regime, alla liberazione di Nelson Mandela e alle prime elezioni democratiche a suffragio universale nel 1994.<br><br>
        Oggi il Sudafrica è una delle economie più industrializzate e articolate del continente — forte nel comparto minerario, nella finanza, nell'industria, nell'agricoltura e nel turismo —, pur dovendo affrontare gravi sfide strutturali legate alle disuguaglianze economiche, alla disoccupazione e ai servizi pubblici.`
      },
      {
        id: 'sudan',
        name: 'Sudan',
        official: 'Repubblica del Sudan',
        continent: 'Africa',
        region: 'Africa Nord-orientale / Valle del Nilo',
        capital: 'Khartum',
        population: '~48.100.000',
        language: 'Arabo, Inglese',
        currency: 'Sterlina sudanese (SDG)',
        coverImg: 'https://images.unsplash.com/photo-1685677821127-169deb7fb349?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/sd.svg',
        desc: `Il Sudan è uno Stato dell'Africa nord-orientale affacciato sul Mar Rosso e attraversato dal Nilo, dove il Nilo Bianco e il Nilo Azzurro confluiscono all'altezza di Khartum. La sua storia antica è segnata dalle civiltà nubiane e dal Regno di Kush — con centri come Napata e Meroe — che intrattennero intensi rapporti culturali e politici con l'antico Egitto prima dell'affermazione di regni cristiani e successivamente dell'Islam e dei sultanati islamici.<br><br>
        Sottoposto al condominio anglo-egiziano all'inizio del Novecento, il Sudan ha raggiunto l'indipendenza nel 1956, ma ha vissuto per decenni una profonda instabilità politica, due lunghe guerre civili tra nord e sud, la crisi del Darfur e il lungo regime autoritario di Omar al-Bashir, culminato nel 2011 con la secessione del Sudan del Sud e, a partire dal 2019 e dal 2023, con nuove crisi politiche e conflitti armati devastanti.<br><br>
        Nonostante la ricchezza potenziale in terre agricole lungo il Nilo, risorse idriche, bestiame, oro e petrolio, l'economia e il tessuto sociale sudanesi sono stati gravemente compromessi dalle guerre, dall'instabilità e da pesanti emergenze umanitarie.`
      },
      {
        id: 'sudan-del-sud',
        name: 'Sudan del Sud',
        official: 'Repubblica del Sudan del Sud',
        continent: 'Africa',
        region: 'Africa Orientale / Valle del Nilo',
        capital: 'Giuba',
        population: '~11.100.000',
        language: 'Inglese',
        currency: 'Sterlina sudsudanese (SSP)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ss.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ss.svg',
        desc: `Il Sudan del Sud è uno Stato senza sbocco al mare dell'Africa orientale, attraversato dal Nilo Bianco e caratterizzato da ampie pianure fluviali, zone umide come il Sudd e savane che ospitano una ricca pluralità di gruppi etnici, tra cui dinka, nuer e shilluk. Per secoli la regione è rimasta in larga misura distinta dal nord del Sudan per tradizioni culturali, strutture sociali e percorsi storici.<br><br>
        Dopo decenni di marginalizzazione politica ed economica e due sanguinose guerre civili che hanno causato milioni di sfollati e vittime, il Sudan del Sud ha raggiunto l'indipendenza formale nel luglio 2011 a seguito di un referendum previsto dall'accordo di pace del 2005, divenendo lo Stato sovrano più giovane del mondo. Tuttavia, già nel 2013 il giovane Paese è precipitato in una grave guerra civile interna che ha rallentato la costruzione delle istituzioni statali.<br><br>
        L'economia sudsudanese dipende fortemente dalle esportazioni di petrolio, pur restando esposta alle oscillazioni dei prezzi, alle difficoltà logistiche per l'esportazione e a una forte dipendenza dall'agricoltura di sussistenza, dall'allevamento e dagli aiuti umanitari.`
      },
      {
        id: 'tanzania',
        name: 'Tanzania',
        official: 'Repubblica Unita di Tanzania',
        continent: 'Africa',
        region: 'Africa Orientale',
        capital: 'Dodoma (legislativa) / Dar es Salaam (amministrativa e commerciale)',
        population: '~67.400.000',
        language: 'Swahili, Inglese',
        currency: 'Scellino della Tanzania (TZS)',
        coverImg: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1672&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/tz.svg',
        desc: `La Tanzania è uno Stato dell'Africa orientale affacciato sull'Oceano Indiano, che riunisce la porzione continentale (già Tanganica) e l'arcipelago semiautonomo di Zanzibar, oltre a includere alcuni dei simboli naturali più celebri del continente, come il monte Kilimangiaro, il Serengeti e il cratere di Ngorongoro. Lungo la costa e sulle isole si sviluppò per secoli la civiltà swahili, alimentata dai traffici marittimi con l'Arabia, la Persia e l'India e dal commercio delle spezie a Zanzibar.<br><br>
        Sotto il dominio coloniale tedesco come Africa Orientale Tedesca fino alla prima guerra mondiale e poi amministrata dal Regno Unito, il Tanganica ha raggiunto l'indipendenza nel 1961 sotto la guida di Julius Nyerere, unendosi nel 1964 a Zanzibar per formare la Repubblica Unita di Tanzania. Nyerere promosse un modello di sviluppo socialista e comunitario (*Ujamaa*) e contribuì a rafforzare la lingua swahili come elemento di coesione nazionale.<br><br>
        Oggi la Tanzania è una delle economie in crescita più sostenuta dell'Africa orientale, con un settore trainato dall'agricoltura, dall'estrazione mineraria (oro, tanzanite), dal turismo naturalistico e insulare e dalle infrastrutture portuali e logistiche affacciate sull'Oceano Indiano.`
      },
      {
        id: 'togo',
        name: 'Togo',
        official: 'Repubblica Togolese',
        continent: 'Africa',
        region: 'Africa Occidentale',
        capital: 'Lomé',
        population: '~9.100.000',
        language: 'Francese',
        currency: 'Franco CFA dell\'Africa occidentale (XOF)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/tg.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/tg.svg',
        desc: `Il Togo è uno Stato stretto e allungato dell'Africa occidentale, affacciato a sud sul Golfo di Guinea e compreso tra il Ghana a ovest, il Burkina Faso a nord e il Benin a est. Prima dell'arrivo degli europei, il territorio fu abitato da diverse popolazioni — tra cui ewe, kabiyé, tem e mina — e subì l'influenza dei regni circostanti e dei commerci lungo la costa atlantica.<br><br>
        Istituito come protettorato tedesco alla fine dell'Ottocento con il nome di Togoland, dopo la prima guerra mondiale fu suddiviso tra Regno Unito e Francia come mandato della Società delle Nazioni; la parte orientale sotto amministrazione francese ha ottenuto l'indipendenza nel 1960. La storia postcoloniale del Togo è stata segnata a lungo dal potere centralizzato di Gnassingbé Eyadéma e poi dalla successione del figlio Faure Gnassingbé, tra tensioni politiche, proteste e riforme istituzionali.<br><br>
        L'economia togolese si fonda sull'agricoltura (cacao, caffè, cotone, colture alimentari), sull'estrazione dei fosfati e sul ruolo logistico e portuale di Lomé, uno dei principali scali marittimi e centri di scambio commerciale dell'Africa occidentale.`
      },
      {
        id: 'tunisia',
        name: 'Tunisia',
        official: 'Repubblica Tunisina',
        continent: 'Africa',
        region: 'Africa Settentrionale / Maghreb',
        capital: 'Tunisi',
        population: '~12.500.000',
        language: 'Arabo',
        currency: 'Dinaro tunisino (TND)',
        coverImg: 'https://images.unsplash.com/photo-1776078321055-d5256efdafe0?q=80&w=1812&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/tn.svg',
        desc: `La Tunisia è lo Stato più settentrionale dell'Africa, situato nel Maghreb orientale e affacciato sul Mar Mediterraneo con una posizione strategica tra il bacino occidentale e quello orientale. La sua storia millenaria è segnata dalla civiltà fenicia e dalla potenza marittima di Cartagine, seguite dalle dominazioni romana, vandala, bizantina, araba, spagnola e ottomana, che hanno lasciato un patrimonio archeologico e culturale straordinario, da Cartagine e Dougga fino alle medine di Tunisi e Kairouan.<br><br>
        Divenuta protettorato francese nel 1881, la Tunisia ha conquistato l'indipendenza nel 1956 sotto la guida di Habib Bourguiba, avviando politiche di modernizzazione statale, istruzione diffusa e riforma del diritto di famiglia. Nel dicembre 2010 il Paese è stato il punto d'avvio delle mobilitazioni note come "Primavera araba", aprendo una fase democratica complessa seguita negli anni Venti da un accentramento dei poteri esecutivi e da pesanti difficoltà economiche e sociali.<br><br>
        L'economia tunisina si appoggia su agricoltura (in particolare olio d'oliva), industria manifatturiera e tessile, estrazione di fosfati, servizi e turismo mediterraneo, mantenendo stretti legami commerciali e culturali con l'Europa.`
      },
      {
        id: 'uganda',
        name: 'Uganda',
        official: 'Repubblica dell\'Uganda',
        continent: 'Africa',
        region: 'Africa Orientale / Grandi Laghi',
        capital: 'Kampala',
        population: '~48.600.000',
        language: 'Inglese, Swahili',
        currency: 'Scellino ugandese (UGX)',
        coverImg: 'https://images.unsplash.com/photo-1557849582-5875ac6dee83?q=80&w=1708&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ug.svg',
        desc: `L'Uganda è uno Stato senza sbocco al mare situato nell'Africa orientale, nella regione dei Grandi Laghi, affacciato a sud-est sul lago Vittoria e attraversato dall'equatore con un clima mite e fertili altopiani. Nel periodo precoloniale il territorio ospitò potenti regni africani — tra cui Buganda, Bunyoro, Toro e Ankole — dotati di strutture istituzionali consolidate e di tradizioni politiche e culturali articolate.<br><br>
        Trasformata in protettorato britannico alla fine dell'Ottocento, l'Uganda ha raggiunto l'indipendenza nel 1962, ma nei decenni successivi ha vissuto una storia tormentata segnata da colpi di Stato, dalla brutale dittatura di Idi Amin negli anni Settanta e da lunghe guerre civili, prima che Yoweri Museveni prendesse il potere nel 1986 avviando una lunga fase di continuità governativa.<br><br>
        L'economia ugandese si basa in larga misura sull'agricoltura (caffè, tè, cotone, tabacco e colture alimentari), sull'allevamento, sull'estrazione mineraria, sulle prospettive legate ai giacimenti petroliferi nella regione del lago Alberto e sul turismo naturalistico, con una popolazione tra le più giovani del mondo.`
      },
      {
        id: 'zambia',
        name: 'Zambia',
        official: 'Repubblica di Zambia',
        continent: 'Africa',
        region: 'Africa Australe',
        capital: 'Lusaka',
        population: '~20.600.000',
        language: 'Inglese',
        currency: 'Kwacha zambiano (ZMW)',
        coverImg: 'https://images.unsplash.com/photo-1666732566977-8805c13a6ce2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/zm.svg',
        desc: `Lo Zambia è uno Stato senza sbocco al mare dell'Africa centro-meridionale, situato su un vasto altopiano attraversato dal sistema fluviale dello Zambesi, che segna il confine meridionale con le spettacolari cascate Vittoria. Prima della colonizzazione europea, il territorio fu interessato dalle migrazioni bantu e dall'affermarsi di entità politiche e reti commerciali — legate anche ai regni limitrofi e alle rotte dell'avorio e del rame — lungo le valli fluviali e gli altopiani.<br><br>
        Amministrato dalla British South Africa Company come Rhodesia Settentrionale e poi divenuto protettorato britannico e parte della Federazione della Rhodesia e del Nyasaland, il Paese ha ottenuto l'indipendenza nel 1964 sotto la guida di Kenneth Kaunda, assumendo il nome di Zambia e attraversando in seguito un periodo monopartitico prima del ritorno al multipartitismo all'inizio degli anni Novanta.<br><br>
        L'economia zambiana è storicamente legata all'estrazione e all'esportazione del rame — con la regione del Copperbelt centrale —, affiancata da agricoltura, energia idroelettrica e turismo naturalistico legato ai grandi parchi faunistici e al fiume Zambesi.`
      },
      {
        id: 'zimbabwe',
        name: 'Zimbabwe',
        official: 'Repubblica dello Zimbabwe',
        continent: 'Africa',
        region: 'Africa Australe',
        capital: 'Harare',
        population: '~16.700.000',
        language: 'Inglese, Shona, Ndebele, e altre lingue ufficiali',
        currency: 'Dollaro dello Zimbabwe (ZWG)',
        coverImg: 'https://images.unsplash.com/photo-1627347456206-d3df7d8484b0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/zw.svg',
        desc: `Lo Zimbabwe è uno Stato senza sbocco al mare dell'Africa australe, situato tra i fiumi Zambesi a nord e Limpopo a sud, la cui storia antica è celebre in tutto il mondo per le imponenti rovine in pietra del Grande Zimbabwe, centro di un potente regno commerciale e culturale fiorito tra l'XI e il XV secolo. Nei secoli successivi il territorio vide l'affermarsi di altre formazioni statali e l'arrivo dei gruppi ndebele nel XIX secolo, prima della penetrazione coloniale britannica legata a Cecil Rhodes.<br><br>
        Sotto il nome di Rhodesia Meridionale e poi di Rhodesia, il Paese fu teatro di una lunga guerra di liberazione contro il governo della minoranza bianca, che portò nel 1980 alla piena indipendenza e all'adozione del nome Zimbabwe sotto la lunga guida di Robert Mugabe. Nei decenni successivi il Paese ha affrontato gravi crisi economiche, iperinflazione, riforme agrarie controverse e tensioni politiche interne.<br><br>
        Dotato di un patrimonio naturale e culturale rilevante — dalle cascate Vittoria ai parchi nazionali fino alla scultura su pietra —, lo Zimbabwe basa la propria economia su agricoltura (in particolare tabacco), estrazione mineraria (platino, oro, litio, diamanti) e servizi, cercando stabilità monetaria e sviluppo duraturo.`
      },
      {
        id: 'antigua-e-barbuda',
        name: 'Antigua e Barbuda',
        official: 'Antigua e Barbuda',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'Saint John\'s',
        population: '~94.000',
        language: 'Inglese',
        currency: 'Dollaro dei Caraibi orientali (XCD)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ag.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ag.svg',
        desc: `Antigua e Barbuda è uno Stato insulare situato nel Mar dei Caraibi, all'incontro tra il mare e l'Oceano Atlantico, composto dalle due isole principali di Antigua e Barbuda e da alcuni isolotti minori. Abitate originariamente da popolazioni amerinde come Ciboney, Arawak e Caribi, le isole entrarono nell'orbita europea a partire dal passaggio di Cristoforo Colombo alla fine del Quattrocento e conobbero poi la colonizzazione britannica.<br><br>
        Nel XVII e XVIII secolo l'economia insulare si trasformò profondamente con la diffusione delle piantagioni di canna da zucchero e l'impiego di manodopera africana ridotta in schiavitù, lasciando un'impronta duratura sulla società e sul patrimonio storico locale. Dopo l'abolizione della schiavitù e un lungo percorso costituzionale, il Paese ha raggiunto la piena indipendenza dal Regno Unito nel 1981 come monarchia costituzionale nel Commonwealth.<br><br>
        Oggi Antigua e Barbuda fonda la propria economia soprattutto sul turismo balneare e nautico, sui servizi e sull'ospitalità, valorizzando le numerose insenature, le barriere coralline e le tradizioni culturali e musicali caraibiche.`
      },
      {
        id: 'bahamas',
        name: 'Bahamas',
        official: 'Commonwealth delle Bahamas',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'Nassau',
        population: '~412.000',
        language: 'Inglese',
        currency: 'Dollaro delle Bahamas (BSD)',
        coverImg: 'https://images.unsplash.com/photo-1787259295433-eeae01f7060f?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/bs.svg',
        desc: `Le Bahamas costituiscono un arcipelago di circa settecento isole e oltre duemila isolotti e caye situato nell'Oceano Atlantico, a sud-est della Florida e a nord di Cuba, caratterizzato da acque turchesi, bassi fondali corallini e un clima tropicale. Abitate in epoca precolombiana dai Lucayani (un ramo dei Taino/Arawak), le isole furono il primo approdo di Cristoforo Colombo nelle Americhe nel 1492, un evento che segnò l'inizio di un rapido spopolamento della popolazione indigena.<br><br>
        Nel corso dell'età moderna l'arcipelago fu attraversato dalle rotte marittime atlantiche, dalla presenza di corsari e pirati e successivamente dall'insediamento di coloni britannici e lealisti provenienti dalle colonie nordamericane con i loro schiavi. Divenute colonia della Corona britannica, le Bahamas hanno raggiunto l'indipendenza nel 1973 mantenendo un ordinamento parlamentare democratico all'interno del Commonwealth.<br><br>
        Oggi l'economia bahamense si regge in larga misura sul turismo internazionale, sui servizi finanziari e bancari, sulla logistica marittima e sulla pesca, in un contesto insulare particolarmente attento alla tutela degli ecosistemi marini e alla resilienza verso gli uragani.`
      },
      {
        id: 'barbados',
        name: 'Barbados',
        official: 'Barbados',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'Bridgetown',
        population: '~282.000',
        language: 'Inglese',
        currency: 'Dollaro di Barbados (BBD)',
        coverImg: 'https://images.unsplash.com/photo-1626023523650-f9fe5e85cacc?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/bb.svg',
        desc: `Barbados è un'isola situata nell'estremità sud-orientale del Mar dei Caraibi, esposta all'Oceano Atlantico e caratterizzata da un territorio in prevalenza pianeggiante o dolcemente ondulato di origine corallina e calcarenitica. Abitata in epoca precolombiana da gruppi amerindi, l'isola entrò nell'orbita europea nel XVI secolo e fu colonizzata dagli inglesi a partire dal 1627, divenendo rapidamente uno dei centri più redditizi della produzione zuccheriera caraibica.<br><br>
        L'espansione delle piantagioni di canna da zucchero trasformò profondamente la demografia e la società di Barbados attraverso l'importazione massiccia di africani schiavizzati, dando origine a una popolazione in larga maggioranza di origine afro-caraibica e a istituzioni parlamentari tra le più antiche dell'area. Ottenuta l'indipendenza dal Regno Unito nel 1966, Barbados ha compiuto nel novembre 2021 un passaggio istituzionale storico diventando una repubblica parlamentare.<br><br>
        Grazie a un elevato livello di istruzione, stabilità politica e infrastrutture sviluppate, Barbados basa la propria economia sul turismo, sui servizi finanziari e internazionali, sulle energie rinnovabili e sull'agroindustria, mantenendo una forte identità culturale.`
      },
      {
        id: 'belize',
        name: 'Belize',
        official: 'Belize',
        continent: 'Americhe',
        region: 'America settentrionale / America centrale',
        capital: 'Belmopan',
        population: '~410.000',
        language: 'Inglese',
        currency: 'Dollaro del Belize (BZD)',
        coverImg: 'https://images.unsplash.com/photo-1788043785783-5da1a7dc509d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/bz.svg',
        desc: `Il Belize è uno Stato situato sulla costa caraibica dell'America centrale, confinante a nord con il Messico e a ovest e a sud con il Guatemala, e celebre per ospitare la seconda barriera corallina più estesa del mondo e ampie foreste tropicali. In epoca precolombiana il territorio fu parte integrante della civiltà maya, che vi edificò importanti centri cerimoniali e urbani come Caracol, Altun Ha e Lamanai.<br><br>
        A partire dal XVII secolo la regione divenne meta di taglialegna britannici — attratti dal legno campeggio e dal mogano — e fu teatro di frequenti attriti con la Spagna, consolidandosi poi come colonia dell'Honduras Britannico. Nel 1981 il Paese ha raggiunto l'indipendenza come unico Stato anglofono dell'America centrale, mantenendo stretti legami culturali con i Caraibi e affrontando una storica vertenza territoriale con il Guatemala.<br><br>
        L'economia del Belize si fonda sul turismo naturalistico e subacqueo, sull'agricoltura (agrumi, banane, canna da zucchero), sulla pesca e sui servizi, in una società multiculturale che unisce creoli, meticci, maya, garifuna e altre comunità.`
      },
      {
        id: 'canada',
        name: 'Canada',
        official: 'Canada',
        continent: 'Americhe',
        region: 'America settentrionale',
        capital: 'Ottawa',
        population: '~40.100.000',
        language: 'Inglese, Francese',
        currency: 'Dollaro canadese (CAD)',
        coverImg: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1711&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ca.svg',
        desc: `Il Canada è il secondo Stato più esteso del mondo per superficie, situato nella parte settentrionale del continente americano tra l'Oceano Atlantico, l'Oceano Pacifico e l'Oceano Artico, con un territorio immenso caratterizzato da foreste boreali, laghi, praterie, catene montuose e regioni artiche. Abitato da millenni da Prima Nazioni, Inuit e Métis, il territorio vide a partire dall'età moderna l'insediamento francese nella Nuova Francia e poi l'espansione britannica, culminata con la cessione britannica del 1763.<br><br>
        Nel 1867 il British North America Act riunì le prime province nella Confederazione canadese, avviando un percorso graduale e pacifico di autonomia legislativa e politica culminato nello Statuto di Westminster del 1931 e nel patriation costituzionale del 1982. Il Canada ha così consolidato un assetto federale bilingue e multiculturale, con una marcata identità francofona nel Québec.<br><br>
        Dotato di una delle economie più avanzate e ricche di risorse naturali del pianeta — tra energia, minerali, agricoltura, industria manifatturiera, tecnologia e servizi —, il Canada gode di elevati standard di vita, un forte sistema di welfare e un'ampia apertura all'immigrazione.`
      },
      {
        id: 'costa-rica',
        name: 'Costa Rica',
        official: 'Repubblica di Costa Rica',
        continent: 'Americhe',
        region: 'America settentrionale / America centrale',
        capital: 'San José',
        population: '~5.100.000',
        language: 'Spagnolo',
        currency: 'Colón costaricano (CRC)',
        coverImg: 'https://images.unsplash.com/photo-1552727131-5fc6af16796d?q=80&w=1649&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/cr.svg',
        desc: `La Costa Rica è uno Stato dell'America centrale compreso tra il Nicaragua a nord e Panama a sud, affacciato sia sull'Oceano Pacifico sia sul Mar dei Caraibi e caratterizzato da una straordinaria biodiversità in un territorio relativamente compatto. In epoca precolombiana la regione costituì una zona di cerniera culturale tra l'area mesoamericana e quella andina, abitata da diverse comunità indigene.<br><br>
        Entrata a far parte dell'Impero spagnolo nel XVI secolo e poi della Capitaneria Generale del Guatemala, la Costa Rica raggiunse l'indipendenza nel 1821 e, dopo brevi fasi di unione con il Messico e con le Province Unite dell'America Centrale, si affermò come Stato sovrano. Nel 1948, a seguito di una breve guerra civile, il Paese compì la scelta emblematica di abolire l'esercito permanente, rafforzando la tradizione democratica e lo Stato sociale.<br><br>
        Oggi la Costa Rica è nota a livello internazionale per le politiche di tutela ambientale e conservazione forestale, per l'elevata quota di energie rinnovabili e per un'economia dinamica basata sull'ecoturismo, sull'agricoltura (banane, ananas, caffè) e sui servizi ad alto valore aggiunto.`
      },
      {
        id: 'cuba',
        name: 'Cuba',
        official: 'Repubblica di Cuba',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'L\'Avana',
        population: '~11.000.000',
        language: 'Spagnolo',
        currency: 'Peso cubano (CUP)',
        coverImg: 'https://images.unsplash.com/photo-1570299437488-d430e1e677c7?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/cu.svg',
        desc: `Cuba è la più grande isola dei Caraibi, situata all'ingresso del Golfo del Messico e caratterizzata da una posizione geografica strategica che per secoli ne ha fatto il fulcro delle rotte marittime spagnole nelle Americhe. Abitata originariamente da popolazioni taino, ciboney e guanajatabey, l'isola fu colonizzata dalla Spagna a partire dall'inizio del XVI secolo, sviluppando un'economia incentrata sulle piantagioni di canna da zucchero e tabacco.<br><br>
        Dopo lunghe guerre d'indipendenza contro la Spagna e l'intervento statunitense del 1898, Cuba divenne una repubblica formalmente sovrana nel 1902, pur restando a lungo legata all'influenza politica ed economica degli Stati Uniti. Nel 1959 la rivoluzione guidata da Fidel Castro instaurò uno Stato socialista a partito unico, rendendo l'isola uno dei punti nevralgici della Guerra Fredda e segnando profondamente gli equilibri geopolitici ed economici dei decenni successivi.<br><br>
        L'economia cubana si basa sui servizi, sul turismo, sull'industria biotecnologica e farmaceutica, sulle rimesse e sulle produzioni tradizionali di tabacco, rum e nichel, affrontando al contempo pesanti difficoltà strutturali e carenze energetiche e alimentari.`
      },
      {
        id: 'dominica',
        name: 'Dominica',
        official: 'Commonwealth di Dominica',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'Roseau',
        population: '~73.000',
        language: 'Inglese',
        currency: 'Dollaro dei Caraibi orientali (XCD)',
        coverImg: 'https://images.unsplash.com/photo-1649703196751-9019ead6b2f4?q=80&w=1921&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/dm.svg',
        desc: `Dominica è un'isola montuosa e vulcanica situata nelle Piccole Antille tra Guadalupa e Martinica, nota come "l'isola della natura" dei Caraibi per le sue fitte foreste pluviali, i corsi d'acqua, le sorgenti termali e il rilievo scosceso. Proprio la conformazione impervia consentì alle popolazioni indigene Kalinago (Caribi) di resistere più a lungo che altrove alla penetrazione coloniale europea, conservando tuttora una comunità distinta sull'isola.<br><br>
        Contesa per decenni tra Francia e Gran Bretagna nel corso del Settecento, Dominica passò stabilmente sotto il controllo britannico e sviluppò un'economia agricola legata prima al caffè e allo zucchero e poi agli agrumi e alle banane. Nel 1978 l'isola ha conquistato l'indipendenza come repubblica parlamentare all'interno del Commonwealth, mantenendo vive le radici creole e francofone accanto alla lingua inglese.<br><br>
        Oggi l'economia di Dominica poggia sull'agricoltura tropicale, sull'ecoturismo, sui servizi e sulle iniziative di resilienza climatica e geotermica volte a proteggere il territorio dagli uragani tropicali.`
      },
      {
        id: 'el-salvador',
        name: 'El Salvador',
        official: 'Repubblica di El Salvador',
        continent: 'Americhe',
        region: 'America settentrionale / America centrale',
        capital: 'San Salvador',
        population: '~6.400.000',
        language: 'Spagnolo',
        currency: 'Dollaro statunitense (USD), Bitcoin (BTC)',
        coverImg: 'https://images.unsplash.com/photo-1786577836261-38562e728bb0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/sv.svg',
        desc: `El Salvador è il più piccolo e densamente popolato Stato dell'America centrale continentale, affacciato esclusivamente sull'Oceano Pacifico e caratterizzato da una catena di vulcani, fertili valli interne e frequente attività sismica. In epoca precolombiana il territorio fu abitato da popolazioni pipil, lenca e maya, che svilupparono centri agricoli e cerimoniali importanti come Joya de Cerén.<br><br>
        Conquistato dalla Spagna nel XVI secolo e inserito nella Capitaneria Generale del Guatemala, El Salvador ottenne l'indipendenza nel 1821 e divenne una repubblica autonoma dopo lo scioglimento della Federazione Centroamericana. Nel XX secolo il Paese visse forti disuguaglianze agrarie legate all'economia del caffè, regimi autoritari e una sanguinosa guerra civile tra il 1979 e il 1992, seguita dagli accordi di pace di Chapultepec.<br><br>
        Negli ultimi decenni l'economia salvadoregna si è orientata verso i servizi, l'industria manifatturiera tessile, il commercio e le rimesse della numerosa diaspora negli Stati Uniti, attraversando al contempo profonde trasformazioni politiche e sociali.`
      },
      {
        id: 'giamaica',
        name: 'Giamaica',
        official: 'Giamaica',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'Kingston',
        population: '~2.800.000',
        language: 'Inglese',
        currency: 'Dollaro giamaicano (JMD)',
        coverImg: 'https://images.unsplash.com/photo-1707571854070-72028840176b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/jm.svg',
        desc: `La Giamaica è una grande isola situata nel Mar dei Caraibi a sud di Cuba, caratterizzata da rilievi montuosi interni come le Blue Mountains e da coste frastagliate. Abitata originariamente dai Taino, l'isola divenne possedimento spagnolo alla fine del Quattrocento e fu conquistata dall'Inghilterra nel 1655, trasformandosi rapidamente in uno dei principali poli dell'economia schiavista delle piantagioni di canna da zucchero.<br><br>
        La storia dell'isola fu segnata anche dalla resistenza dei Maroon — comunità di schiavi fuggiti che crearono insediamenti autonomi nell'interno montuoso — e da un lungo percorso sociale e sindacale culminato nell'indipendenza dal Regno Unito nel 1962 come monarchia costituzionale nel Commonwealth.<br><br>
        Nonostante le dimensioni contenute, la Giamaica esercita un'influenza culturale globale straordinaria attraverso la musica reggae, lo ska, il movimento rastafari e i successi nell'atletica leggera, mentre la sua economia si fonda sul turismo, sulle rimesse, sull'estrazione della bauxite e sull'agroindustria.`
      },
      {
        id: 'grenada',
        name: 'Grenada',
        official: 'Grenada',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'Saint George\'s',
        population: '~126.000',
        language: 'Inglese',
        currency: 'Dollaro dei Caraibi orientali (XCD)',
        coverImg: 'https://images.unsplash.com/photo-1663513628041-1ca7257e853d?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/gd.svg',
        desc: `Grenada è uno Stato insulare situato nell'estremità meridionale delle Piccole Antille nel Mar dei Caraibi, composto dall'isola principale di Grenada e da alcune isole minori delle Grenadine meridionali, tra cui Carriacou e Petite Martinique. Abitata in epoca precolombiana da Arawak e Caribi, l'isola conobbe la colonizzazione francese a partire dal XVII secolo e passò poi stabilmente sotto il controllo britannico nella seconda metà del Settecento.<br><br>
        Dopo l'abolizione della schiavitù, la diffusione di piccole proprietà agricole favorì la coltivazione delle spezie — in particolare noce moscata, cannella, chiodi di garofano e cacao — valendo al Paese l'appellativo di "Isola delle Spezie". Ottenuta l'indipendenza nel 1974, Grenada visse una crisi rivoluzionaria nel 1979 seguita dall'intervento militare guidato dagli Stati Uniti nel 1983 e dal successivo ripristino delle istituzioni parlamentari.<br><br>
        Oggi l'economia grenadina si regge sul turismo, sull'istruzione universitaria internazionale, sui servizi e sull'esportazione di spezie e cacao.`
      },
      {
        id: 'guatemala',
        name: 'Guatemala',
        official: 'Repubblica del Guatemala',
        continent: 'Americhe',
        region: 'America settentrionale / America centrale',
        capital: 'Città del Guatemala',
        population: '~18.100.000',
        language: 'Spagnolo',
        currency: 'Quetzal guatemalteco (GTQ)',
        coverImg: 'https://images.unsplash.com/photo-1782091857172-c3890ee18634?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/gt.svg',
        desc: `Il Guatemala è uno Stato dell'America centrale affacciato sia sull'Oceano Pacifico sia sul Golfo dell'Honduras nel Mar dei Caraibi, caratterizzato da altopiani vulcanici, foreste tropicali nel Petén e da una profondissima eredità indigena. Il territorio costituì il cuore della civiltà maya classica, come testimoniano imponenti siti archeologici quali Tikal, El Mirador e Quiriguá, e conserva tuttora una vasta popolazione discendente dai popoli maya con oltre venti lingue indigene parlate.<br><br>
        Centro amministrativo della Capitaneria Generale del Guatemala durante il periodo coloniale spagnolo — con Antigua Guatemala come antica capitale —, il Paese conquistò l'indipendenza nel 1821. Nel Novecento la storia guatemalteca fu segnata da forti squilibri fondiari, dal rovesciamento riformista del 1954 e da una lunga e drammatica guerra civile durata trentasei anni fino agli accordi di pace del 1996.<br><br>
        Oggi il Guatemala è la maggiore economia dell'America centrale per dimensione demografica e produttiva, sostenuta dall'agricoltura (caffè, banane, zucchero, cardamomo), dal settore manifatturiero, dal turismo culturale e dalle rimesse dall'estero.`
      },
      {
        id: 'haiti',
        name: 'Haiti',
        official: 'Repubblica di Haiti',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'Port-au-Prince',
        population: '~11.700.000',
        language: 'Creolo haitiano, Francese',
        currency: 'Gourde haitiano (HTG)',
        coverImg: 'https://images.unsplash.com/photo-1602027333786-373a1b858831?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ht.svg',
        desc: `Haiti occupa il terzo occidentale dell'isola di Hispaniola nei Grandi Caraibi, condividendo l'isola con la Repubblica Dominicana e caratterizzandosi per un territorio in larga parte montuoso e collinare. Abitata originariamente dai Taino, la regione divenne nel XVII secolo la colonia francese di Saint-Domingue, uno dei territori coloniali più ricchi e redditizi del mondo grazie alle immense piantagioni di canna da zucchero e caffè basate sullo sfruttamento brutale della schiavitù.<br><br>
        Nel 1791 scoppiò una vasta rivolta di schiavi guidata da figure come Toussaint Louverture e Jean-Jacques Dessalines, che condusse nel 1804 alla proclamazione dell'indipendenza: Haiti divenne così la prima repubblica nera indipendente e il secondo Stato indipendente delle Americhe dopo gli Stati Uniti. Tuttavia, il peso di un pesante debito imposto dalla Francia, l'isolamento diplomatico internazionale, l'ingerenza esterna, regimi autoritari e ricorrenti crisi politiche hanno segnato duramente la storia successiva del Paese.<br><br>
        Oggi Haiti affronta una gravissima crisi multidimensionale — politica, economica, ambientale e di sicurezza —, con un'economia legata all'agricoltura di sussistenza, all'industria manifatturiera leggera e alle rimesse della diaspora, accanto a un patrimonio storico e artistico di grande valore.`
      },
      {
        id: 'honduras',
        name: 'Honduras',
        official: 'Repubblica dell\'Honduras',
        continent: 'Americhe',
        region: 'America settentrionale / America centrale',
        capital: 'Tegucigalpa',
        population: '~10.600.000',
        language: 'Spagnolo',
        currency: 'Lempira honduregna (HNL)',
        coverImg: 'https://images.unsplash.com/photo-1579390497555-d5842e45e622?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/hn.svg',
        desc: `L'Honduras è uno Stato dell'America centrale affacciato sia sul Mar dei Caraibi sia — tramite il golfo di Fonseca — sull'Oceano Pacifico, caratterizzato da un rilievo prevalentemente montuoso, da fertili vallate interne, dalle isole della Baia e da aree costiere e fluviali come la Mosquitia. In epoca precolombiana il territorio ospitò importanti insediamenti maya, tra cui spicca la celebre città di Copán, oltre a diverse altre comunità indigene.<br><br>
        Conquistato dagli spagnoli nel XVI secolo e inserito nella Capitaneria Generale del Guatemala, l'Honduras raggiunse l'indipendenza nel 1821 e divenne una repubblica autonoma dopo la dissoluzione della Federazione Centroamericana. Nel corso del Novecento la storia del Paese fu profondamente segnata dal potere economico delle grandi compagnie bananiere statunitensi, da instabilità politica, colpi di Stato e transizioni democratiche.<br><br>
        L'economia honduregna si fonda sull'agricoltura (caffè, banane, olio di palma, gamberi), sull'industria tessile e manifatturiera e sulle rimesse dall'estero, mentre il Paese deve fronteggiare sfide legate alla povertà, alla sicurezza e all'esposizione agli uragani tropicali.`
      },
      {
        id: 'messico',
        name: 'Messico',
        official: 'Stati Uniti Messicani',
        continent: 'Americhe',
        region: 'America settentrionale',
        capital: 'Città del Messico',
        population: '~129.000.000',
        language: 'Spagnolo',
        currency: 'Peso messicano (MXN)',
        coverImg: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/mx.svg',
        desc: `Il Messico è uno Stato federale situato nella parte meridionale dell'America settentrionale, tra gli Stati Uniti a nord, il Guatemala e il Belize a sud-est, l'Oceano Pacifico a ovest e il Golfo del Messico e il Mar dei Caraibi a est. Il territorio fu culla di alcune delle più grandi civiltà precolombiane — tra cui Olmechi, Maya, Toltechi, Zapoteci e Aztechi — che edificarono metropoli, sistemi agricoli e tradizioni artistiche e scientifiche di rilievo mondiale.<br><br>
        Dopo la conquista spagnola avviata nel XVI secolo e tre secoli di dominio come Vicereame della Nuova Spagna, il Messico ottenne l'indipendenza nel 1821 al termine di una lunga guerra. Nel XIX e XX secolo il Paese affrontò la perdita di vasti territori settentrionali a favore degli Stati Uniti, l'intervento francese, la lunga dittatura di Porfirio Díaz, la Rivoluzione messicana del 1910 e decenni di egemonia del Partito Rivoluzionario Istituzionale fino all'alternanza democratica del 2000.<br><br>
        Oggi il Messico è una delle principali economie dell'America Latina e un attore manifatturiero e commerciale di primo piano — strettamente integrato nelle catene del valore nordamericane —, con un patrimonio culturale, gastronomico e archeologico straordinario ma anche sfide legate alla sicurezza e alle disuguaglianze.`
      },
      {
        id: 'nicaragua',
        name: 'Nicaragua',
        official: 'Repubblica del Nicaragua',
        continent: 'Americhe',
        region: 'America settentrionale / America centrale',
        capital: 'Managua',
        population: '~7.000.000',
        language: 'Spagnolo',
        currency: 'Córdoba nicaraguense (NIO)',
        coverImg: 'https://images.unsplash.com/photo-1599147092320-9ce79b36caa4?q=80&w=1859&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ni.svg',
        desc: `Il Nicaragua è lo Stato più esteso dell'America centrale, situato tra l'Honduras a nord e la Costa Rica a sud, affacciato sia sull'Oceano Pacifico sia sul Mar dei Caraibi e caratterizzato da grandi laghi interni — come il lago Nicaragua e il lago Managua — e da una catena vulcanica. In epoca precolombiana fu abitato da diverse popolazioni indigene, mentre sulla costa caraibica si sviluppò in età moderna una storia distinta legata anche alla presenza britannica e alle comunità miskito e creole.<br><br>
        Conquistato dalla Spagna nel XVI secolo e reso indipendente nel 1821, il Nicaragua visse per gran parte del XIX e XX secolo instabilità politica, interventi statunitensi, la lunga dinastia autoritaria della famiglia Somoza e poi la rivoluzione sandinista del 1979, seguita dalla guerra dei Contras negli anni Ottanta e da una successiva evoluzione politica culminata in una forte concentrazione del potere esecutivo.<br><br>
        L'economia nicaraguense si fonda sull'agricoltura (caffè, manzo, zucchero, arachidi, oro), sull'industria manifatturiera in zona franca e sulle rimesse, in un contesto di crescita moderata ma segnato da tensioni politiche e sfide sociali.`
      },
      {
        id: 'panama',
        name: 'Panama',
        official: 'Repubblica di Panama',
        continent: 'Americhe',
        region: 'America settentrionale / America centrale',
        capital: 'Città di Panama',
        population: '~4.500.000',
        language: 'Spagnolo',
        currency: 'Balboa panamense (PAB), Dollaro statunitense (USD)',
        coverImg: 'https://images.unsplash.com/photo-1632505702897-cc41b0ba3b64?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/pa.svg',
        desc: `Panama è uno Stato situato nell'istmo che collega l'America centrale all'America meridionale, confinando con la Costa Rica a ovest e con la Colombia a sud-est e affacciandosi sull'Oceano Pacifico e sul Mar dei Caraibi. Grazie alla sua conformazione stretta e strategica, l'istmo è stato per secoli un punto di snodo fondamentale per il transito di merci, persone e rotte commerciali tra i due oceani e tra i due subcontinenti.<br><br>
        Parte dell'Impero spagnolo fino all'indipendenza del 1821 e poi unita alla Colombia, Panama divenne uno Stato indipendente nel 1903 nel contesto delle trattative legate alla costruzione del Canale di Panama, inaugurato dagli Stati Uniti nel 1914. Dopo un periodo di governi militari e il recupero della piena sovranità sul Canale completato nel 1999, il Paese ha consolidato un ordinamento democratico.<br><br>
        Oggi l'economia panamense è tra le più dinamiche e orientate ai servizi della regione, trainata dal Canale di Panama, dal sistema logistico e portuale, dal centro finanziario internazionale e dal turismo, pur convivendo con forti disuguaglianze territoriali e sociali.`
      },
      {
        id: 'repubblica-dominicana',
        name: 'Repubblica Dominicana',
        official: 'Repubblica Dominicana',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'Santo Domingo',
        population: '~11.300.000',
        language: 'Spagnolo',
        currency: 'Peso dominicano (DOP)',
        coverImg: 'https://images.unsplash.com/photo-1781901340491-4b7220d28f2f?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/do.svg',
        desc: `La Repubblica Dominicana occupa i due terzi orientali dell'isola di Hispaniola nei Caraibi, separata da Haiti da un confine terrestre e caratterizzata da catene montuose come la Cordillera Central, fertili vallate come il Cibao e ampie coste tropicali. Abitata dai Taino in epoca precolombiana, l'isola divenne il primo centro stabile della colonizzazione spagnola nelle Americhe, con Santo Domingo che ospitò alcune delle prime istituzioni coloniali, cattedrali e università del continente.<br><br>
        Dopo essere passata in parte sotto il controllo francese e aver vissuto l'unificazione con Haiti all'inizio dell'Ottocento, la Repubblica Dominicana proclamò l'indipendenza nel 1844. La sua storia successiva fu segnata da interventi esterni, dalla lunga e brutale dittatura di Rafael Leónidas Trujillo (1930-1961), da crisi politiche e da una progressiva stabilizzazione democratica a partire dagli ultimi decenni del Novecento.<br><br>
        Oggi il Paese è una delle economie più grandi e in crescita dei Caraibi, sostenuta dal turismo internazionale, dalle rimesse, dalle zone franche manifatturiere, dall'estrazione mineraria (oro, nichel) e dall'agricoltura (zucchero, cacao, caffè, tabacco).`
      },
      {
        id: 'saint-kitts-e-nevis',
        name: 'Saint Kitts e Nevis',
        official: 'Federazione di Saint Kitts e Nevis',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'Basseterre',
        population: '~48.000',
        language: 'Inglese',
        currency: 'Dollaro dei Caraibi orientali (XCD)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/kn.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/kn.svg',
        desc: `Saint Kitts e Nevis è il più piccolo Stato sovrano delle Americhe per superficie e popolazione, costituito dalle due isole vulcaniche di Saint Kitts (Saint Christopher) e Nevis nell'arco delle Piccole Antille nel Mar dei Caraibi. Abitate in epoca precolombiana da popolazioni amerinde come Arawak e Caribi, le isole furono avvistate da Cristoforo Colombo nel 1493 e divennero nel Seicento una delle prime basi coloniali inglesi e francesi nei Caraibi.<br><br>
        Contese a lungo tra Regno Unito e Francia, Saint Kitts e Nevis passarono stabilmente sotto il controllo britannico nel XVIII secolo e svilupparono un'economia imperniata sulle piantagioni di canna da zucchero e sul lavoro servile. Dopo un percorso graduale di autonomia all'interno dei territori britannici caraibici, la federazione ha conquistato l'indipendenza nel 1983 come monarchia costituzionale nel Commonwealth.<br><br>
        Abbandonata progressivamente la monocoltura zuccheriera all'inizio del XXI secolo, l'economia nazionale poggia oggi sul turismo, sui servizi finanziari, sull'edilizia e sui programmi di investimento, conservando un ricco patrimonio architettonico coloniale e naturalistico.`
      },
      {
        id: 'saint-lucia',
        name: 'Saint Lucia',
        official: 'Saint Lucia',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'Castries',
        population: '~180.000',
        language: 'Inglese',
        currency: 'Dollaro dei Caraibi orientali (XCD)',
        coverImg: 'https://images.unsplash.com/photo-1617280325974-f9c5721a4862?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/lc.svg',
        desc: `Saint Lucia è uno Stato insulare vulcanico situato nelle Piccole Antille nel Mar dei Caraibi orientali, celebre per i suoi rilievi montuosi rivestiti di foresta tropicale e per i due iconici picchi vulcanici dei Pitons affacciati sulla costa sud-occidentale. Abitata originariamente da Arawak e Caribi, l'isola fu al centro di una lunghissima rivalità coloniale tra Francia e Gran Bretagna tra il XVII e l'inizio del XIX secolo, cambiando possesso ben quattordici volte prima di passare definitivamente al Regno Unito nel 1814.<br><br>
        Questa doppia eredità storica si riflette tuttora nella toponomastica, nelle tradizioni e nella diffusione del creolo antillano a base francese accanto all'inglese. Ottenuta l'indipendenza nel 1979 come monarchia costituzionale nel Commonwealth, Saint Lucia ha consolidato istituzioni parlamentari stabili e ha dato i natali a due premi Nobel, l'economista Arthur Lewis e il poeta Derek Walcott.<br><br>
        L'economia dell'isola si fonda sul turismo balneare e naturalistico, sull'agricoltura (in particolare banane e cacao), sui servizi e sull'industria manifatturiera leggera.`
      },
      {
        id: 'saint-vincent-e-grenadine',
        name: 'Saint Vincent e Grenadine',
        official: 'Saint Vincent e Grenadine',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'Kingstown',
        population: '~104.000',
        language: 'Inglese',
        currency: 'Dollaro dei Caraibi orientali (XCD)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/vc.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/vc.svg',
        desc: `Saint Vincent e Grenadine è uno Stato insulare situato nelle Piccole Antille nel Mar dei Caraibi, formato dall'isola vulcanica principale di Saint Vincent — dominata dal vulcano attivo La Soufrière — e dalla parte settentrionale dell'arcipelago delle Grenadine, tra cui Bequia, Mustique, Canouan e Union Island. La storia precoloniale e coloniale dell'isola fu segnata dalla forte resistenza dei Caribi e dei Garifuna (Caribi Neri), che difesero a lungo l'autonomia del territorio contro gli insediamenti europei.<br><br>
        Passato sotto il controllo britannico nella seconda metà del Settecento dopo una fase di contesa con la Francia, l'arcipelago sviluppò piantagioni di zucchero, arrowroot e banane, raggiungendo la piena indipendenza nel 1979 come monarchia costituzionale all'interno del Commonwealth.<br><br>
        Oggi l'economia di Saint Vincent e Grenadine si basa sul turismo — particolarmente sviluppato nelle isole Grenadine —, sull'agricoltura tropicale, sui servizi e sulle rimesse, in un contesto insulare che unisce vivaci tradizioni culturali caraibiche e sfide legate ai rischi vulcanici e climatici.`
      },
      {
        id: 'trinidad-e-tobago',
        name: 'Trinidad e Tobago',
        official: 'Repubblica di Trinidad e Tobago',
        continent: 'Americhe',
        region: 'America settentrionale / Caraibi',
        capital: 'Port of Spain',
        population: '~1.500.000',
        language: 'Inglese',
        currency: 'Dollaro di Trinidad e Tobago (TTD)',
        coverImg: 'https://images.unsplash.com/photo-1594005039392-53c38b667641?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/tt.svg',
        desc: `Trinidad e Tobago è lo Stato insulare più meridionale dei Caraibi, situato a breve distanza dalla costa del Venezuela e composto dalle due isole principali di Trinidad e Tobago. Abitate in epoca precolombiana da popolazioni amerinde, le isole entrarono nell'orbita coloniale spagnola alla fine del Quattrocento e passarono successivamente sotto il dominio britannico tra la fine del Settecento e l'inizio dell'Ottocento, venendo poi riunite amministrativamente.<br><br>
        Dopo l'abolizione della schiavitù, l'arrivo di numerosi lavoratori a contratto provenienti soprattutto dall'India affiancò la popolazione di origine africana, dando vita a una società marcatamente multietnica e multiculturale. Ottenuta l'indipendenza dal Regno Unito nel 1962 e divenuta repubblica nel 1976, Trinidad e Tobago ha mantenuto istituzioni democratiche stabili e una straordinaria vitalità culturale espressa dal Carnevale, dallo steelpan e dalla musica calypso e soca.<br><br>
        A differenza della maggior parte degli Stati caraibici, l'economia nazionale poggia principalmente sull'estrazione e lavorazione di petrolio, gas naturale e prodotti petrolchimici, affiancate dall'industria manifatturiera, dai servizi finanziari e dal turismo (soprattutto a Tobago).`
      },
      {
        id: 'argentina',
        name: 'Argentina',
        official: 'Repubblica Argentina',
        continent: 'Americhe',
        region: 'America meridionale',
        capital: 'Buenos Aires',
        population: '~46.700.000',
        language: 'Spagnolo',
        currency: 'Peso argentino (ARS)',
        coverImg: 'https://images.unsplash.com/photo-1777824256330-c252f6fcabd9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ar.svg',
        desc: `L'Argentina è il secondo Stato più esteso dell'America meridionale e l'ottavo al mondo, situato nella parte sud-orientale del continente tra la cordigliera delle Ande a ovest e l'Oceano Atlantico a est, con una straordinaria varietà di ambienti che spazia dalle pianure della Pampa e dal Gran Chaco fino alle foreste subtropicali, alle valli andine e alla Patagonia. Abitata in epoca precolombiana da diverse popolazioni indigene — tra cui Mapuche, Tehuelche, Guaraní e comunità legate all'orbita andina —, la regione entrò nel XVI secolo nell'Impero spagnolo, inizialmente all'interno del Vicereame del Perù e poi del Vicereame del Río de la Plata.<br><br>
        A partire dalla Rivoluzione di Maggio del 1810 e dalla dichiarazione d'indipendenza del 1816, l'Argentina costruì il proprio assetto statale attraversando lunghi conflitti tra unitari e federalisti, la Campagna del Deserto contro i popoli indigeni e una grande ondata migratoria europea tra Ottocento e primo Novecento che trasformò profondamente la società e la cultura urbana, con Buenos Aires al centro. Nel XX secolo il Paese visse l'ascesa del peronismo, cicliche crisi economiche e ripetuti colpi di Stato militari, culminati nella dittatura del 1976-1983 e seguiti dal ritorno stabile alla democrazia.<br><br>
        Dotata di un'economia diversificata e di grandi risorse agroalimentari ed energetiche — tra cereali, carni, litio, idrocarburi e energie rinnovabili —, l'Argentina affronta da decenni sfide ricorrenti legate all'inflazione, al debito e alla stabilità macroeconomica, affiancate da una forte vitalità culturale, letteraria, musicale e sportiva.`
      },
      {
        id: 'bolivia',
        name: 'Bolivia',
        official: 'Stato Plurinazionale della Bolivia',
        continent: 'Americhe',
        region: 'America meridionale',
        capital: 'Sucre (costituzionale), La Paz (sede del governo e del Parlamento)',
        population: '~12.400.000',
        language: 'Spagnolo, Quechua, Aymara, Guaraní, e altre lingue indigene',
        currency: 'Boliviano (BOB)',
        coverImg: 'https://images.unsplash.com/photo-1772551503545-d7dd079e94a9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/bo.svg',
        desc: `La Bolivia è uno Stato senza sbocco al mare dell'America meridionale centrale, caratterizzato da un marcato contrasto geografico tra l'altopiano andino (l'Altiplano, dove si trova il lago Titicaca e il salar di Uyuni) e le basse terre orientali amazzoniche e del Chaco. Il territorio fu culla di antiche civiltà andine come Tiwanaku e parte integrante dell'Impero Inca, mantenendo ancora oggi una delle percentuali più elevate di popolazione indigena del continente.<br><br>
        Durante il periodo coloniale spagnolo l'area dell'Alto Perù divenne un centro minerario cruciale grazie all'argento del Cerro Rico di Potosí, prima di raggiungere l'indipendenza nel 1825 con il nome ispirato a Simón Bolívar. Nel corso dell'Ottocento e del Novecento la Bolivia subì pesanti perdite territoriali nelle guerre con i Paesi vicini (inclusa la perdita dello sbocco sul Pacifico nella Guerra del Pacifico), attraversò la Rivoluzione nazionale del 1952, diversi regimi militari e, dal 2006, una profonda stagione politica incentrata sul riconoscimento plurinazionale.<br><br>
        L'economia boliviana si appoggia sull'estrazione di gas naturale e minerali, sull'agricoltura e sulle grandi potenzialità legate al litio, in un contesto di forti dibattiti politici, economici e ambientali.`
      },
      {
        id: 'brasile',
        name: 'Brasile',
        official: 'Repubblica Federativa del Brasile',
        continent: 'Americhe',
        region: 'America meridionale',
        capital: 'Brasilia',
        population: '~216.400.000',
        language: 'Portoghese',
        currency: 'Real brasiliano (BRL)',
        coverImg: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/br.svg',
        desc: `Il Brasile è il Paese più esteso e popoloso dell'America meridionale e il quinto al mondo per superficie, affacciato sull'Oceano Atlantico e caratterizzato da un'immensa varietà geografica ed ecologica che comprende la foresta amazzonica, il Cerrado, il Pantanal, la Mata Atlântica e il Sertão semi-arido. Abitato da numerose popolazioni indigene prima dell'arrivo dei navigatori portoghesi nel 1500, il territorio divenne una colonia del Portogallo legata dapprima al legno del brasile e poi alle piantagioni di canna da zucchero, all'oro e al caffè, con l'impiego massiccio di africani schiavizzati.<br><br>
        All'inizio dell'Ottocento il trasferimento della corte portoghese a Rio de Janeiro favorì l'elevazione a regno e quindi l'indipendenza proclamata nel 1822 sotto l'Impero del Brasile, durato fino alla proclamazione della repubblica nel 1889. Nel Novecento il Paese attraversò l'era di Getúlio Vargas, una forte industrializzazione urbana, la costruzione della nuova capitale Brasilia nel 1960 e un regime militare durato dal 1964 al 1985, prima della riaffermazione democratica costituzionale del 1988.<br><br>
        Oggi il Brasile è la principale economia dell'America Latina e una potenza agroalimentare, mineraria ed energetica globale, con un ruolo decisivo negli equilibri ambientali mondiali e un patrimonio culturale ricchissimo che spazia dalla musica e dal carnevale alla letteratura e alle arti visive.`
      },
      {
        id: 'cile',
        name: 'Cile',
        official: 'Repubblica del Cile',
        continent: 'Americhe',
        region: 'America meridionale',
        capital: 'Santiago del Cile',
        population: '~19.600.000',
        language: 'Spagnolo',
        currency: 'Peso cileno (CLP)',
        coverImg: 'https://images.unsplash.com/photo-1478827387698-1527781a4887?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/cl.svg',
        desc: `Il Cile è uno Stato lungo e stretto dell'America meridionale sud-occidentale, incuneato tra la cordigliera delle Ande a est e l'Oceano Pacifico a ovest, con una conformazione geografica estrema che va dall'arido deserto di Atacama a nord fino alla valle centrale temperata, ai laghi e ai fiordi della Patagonia a sud, includendo anche l'Isola di Pasqua (Rapa Nui). In epoca precolombiana il territorio fu abitato da diverse popolazioni — tra cui Atacameños, Diaguitas, Aymara e soprattutto i Mapuche, che opposero una lunga resistenza all'espansione incaica e poi spagnola.<br><br>
        Conquistato dalla Spagna nel XVI secolo e divenuto indipendente nel corso delle guerre sudamericane dell'Ottocento, il Cile consolidò precocemente istituzioni statali e ampliò i propri confini verso nord e verso sud. Nel Novecento il Paese visse profonde polarizzazioni politiche, culminate nel golpe militare del 1973 guidato da Augusto Pinochet, nella lunga dittatura seguita da un modello economico neoliberista e, dal 1990, in una stabile transizione democratica.<br><br>
        Oggi il Cile è una delle economie più aperte, competitive e stabili dell'America Latina — primo produttore mondiale di rame e tra i principali attori nel litio, nella frutta, nel vino, nella pesca e nelle energie rinnovabili —, pur dovendo affrontare sfide legate alle disuguaglianze sociali e alle riforme istituzionali.`
      },
      {
        id: 'colombia',
        name: 'Colombia',
        official: 'Repubblica di Colombia',
        continent: 'Americhe',
        region: 'America meridionale',
        capital: 'Bogotà',
        population: '~52.300.000',
        language: 'Spagnolo',
        currency: 'Peso colombiano (COP)',
        coverImg: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/co.svg',
        desc: `La Colombia è uno Stato situato nell'estremità nord-occidentale dell'America meridionale, unico Paese sudamericano ad affacciarsi sia sull'Oceano Pacifico sia sul Mar dei Caraibi, con un territorio che abbraccia tre rami della cordigliera delle Ande, bacini amazzonici, savane dei Llanos e coste tropicali. In epoca precolombiana ospitò civiltà e culture rilevanti — come i Muisca, i Tairona e i Quimbaya —, celebri per l'oreficeria e l'organizzazione territoriale.<br><br>
        Centro coloniale spagnolo (con il Vicereame della Nuova Granada), la Colombia raggiunse l'indipendenza nel XIX secolo nell'ambito delle campagne di Simón Bolívar, facendo parte inizialmente della Grande Colombia prima di costituirsi come Stato autonomo. Nel corso del Novecento e dell'inizio del XXI secolo la storia del Paese fu profondamente segnata da violenze politiche, dal conflitto armato interno tra Stato, guerriglie e gruppi paramilitari e dal traffico illecito di stupefacenti, affiancati da processi di pace e da una lunga continuità elettorale.<br><br>
        Dotata di una notevole biodiversità e di un'economia articolata — tra caffè, fiori, petrolio, carbone, manifattura, servizi e turismo —, la Colombia cerca di consolidare una pace duratura e di ridurre le disuguaglianze sociali e territoriali.`
      },
      {
        id: 'ecuador',
        name: 'Ecuador',
        official: 'Repubblica dell\'Ecuador',
        continent: 'Americhe',
        region: 'America meridionale',
        capital: 'Quito',
        population: '~18.200.000',
        language: 'Spagnolo, Kichwa, Shuar',
        currency: 'Dollaro statunitense (USD)',
        coverImg: 'https://images.unsplash.com/photo-1610226977124-9fd2755d09f2?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ec.svg',
        desc: `L'Ecuador è uno Stato dell'America meridionale nord-occidentale attraversato dalla linea equatoriale, che comprende la costa pacifica, la regione andina attraversata da imponenti vulcani, il versante amazzonico orientale e l'arcipelago vulcanico delle Galápagos, celebre per la sua biodiversità unica. In epoca precolombiana fu abitato da diverse culture indigene — tra cui Valdivia, Cañari e Quitu — prima di essere integrato nell'Impero Inca.<br><br>
        Conquistato dalla Spagna nel XVI secolo con Quito come centro amministrativo e culturale, l'Ecuador ottenne l'indipendenza nel XIX secolo e, dopo aver fatto parte della Grande Colombia, si costituì come repubblica autonoma nel 1830. La sua storia successiva fu caratterizzata da alternanze tra governi civili e militari, crisi economiche legate alle esportazioni agricole e petrolifere e riforme costituzionali.<br><br>
        L'economia ecuadoriana si basa sull'esportazione di petrolio, banane, gamberi, cacao e fiori, nonché sull'agricoltura, sui servizi e sull'ecoturismo, utilizzando dal 2000 il dollaro statunitense come valuta ufficiale.`
      },
      {
        id: 'guyana',
        name: 'Guyana',
        official: 'Repubblica Cooperativa di Guyana',
        continent: 'Americhe',
        region: 'America meridionale',
        capital: 'Georgetown',
        population: '~815.000',
        language: 'Inglese',
        currency: 'Dollaro della Guyana (GYD)',
        coverImg: 'https://images.unsplash.com/photo-1595794038905-0b713525dead?q=80&w=1734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/gy.svg',
        desc: `La Guyana è uno Stato situato sulla costa settentrionale dell'America meridionale, affacciato sull'Oceano Atlantico e caratterizzato da una stretta fascia costiera densamente abitata e da un vasto interno ricoperto di foreste pluviali, fiumi e savane. Abitata originariamente da popolazioni amerinde come Arawak, Caribi e Wapishana, la regione fu colonizzata dapprima dagli olandesi e successivamente dal Regno Unito, che riunì i territori nell'unica colonia anglofona del Sudamerica continentale, la Guiana Britannica.<br><br>
        Durante l'epoca coloniale l'economia delle piantagioni di canna da zucchero portò all'arrivo di africani schiavizzati e, dopo l'abolizione della schiavitù, di numerosi lavoratori a contratto provenienti soprattutto dall'India, dando vita a una società multietnica fortemente legata sul piano storico e culturale ai Caraibi. Ottenuta l'indipendenza nel 1966 e divenuta repubblica nel 1970, la Guyana ha affrontato tensioni politiche interne e storiche dispute di confine con il Venezuela e il Suriname.<br><br>
        Negli ultimi anni la scoperta e lo sfruttamento di ingenti giacimenti petroliferi offshore hanno trasformato radicalmente le prospettive economiche del Paese, affiancando al settore degli idrocarburi l'estrazione dell'oro e della bauxite, l'agricoltura e le risorse forestali.`
      },
      {
        id: 'paraguay',
        name: 'Paraguay',
        official: 'Repubblica del Paraguay',
        continent: 'Americhe',
        region: 'America meridionale',
        capital: 'Asunción',
        population: '~6.900.000',
        language: 'Spagnolo, Guaraní',
        currency: 'Guaraní paraguaiano (PYG)',
        coverImg: 'https://images.unsplash.com/photo-1708007736300-89c16fa57b40?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/py.svg',
        desc: `Il Paraguay è uno Stato senza sbocco al mare situato nel cuore dell'America meridionale, diviso dal fiume Paraguay in due grandi aree geografiche molto diverse: la fertile regione orientale e la vasta pianura semi-arida del Gran Chaco a ovest. La sua identità culturale è profondamente segnata dall'incontro tra la popolazione indigena guaraní e la colonizzazione spagnola — che vide anche la celebre esperienza delle riduzioni gesuitiche —, tanto che il guaraní è tuttora lingua ufficiale ampiamente parlata accanto allo spagnolo.<br><br>
        Resosi indipendente dalla Spagna nel 1811, il Paraguay conobbe una fase di sviluppo autonomo interrotta dalla devastante Guerra della Triplice Alleanza (1864-1870) contro Brasile, Argentina e Uruguay, che causò enormi perdite demografiche e territoriali, seguita nel Novecento dalla Guerra del Chaco contro la Bolivia e dalla lunga dittatura di Alfredo Stroessner fino al 1989.<br><br>
        Oggi l'economia paraguaiana si basa sull'agroindustria (soia, carne bovina, mais), sull'esportazione di energia idroelettrica prodotta dalle grandi dighe condivise sui fiumi Paraná e sui servizi commerciali, affrontando sfide legate alle disuguaglianze e alle infrastrutture.`
      },
      {
        id: 'peru',
        name: 'Perù',
        official: 'Repubblica del Perù',
        continent: 'Americhe',
        region: 'America meridionale',
        capital: 'Lima',
        population: '~34.400.000',
        language: 'Spagnolo, Quechua, Aymara',
        currency: 'Sol peruviano (PEN)',
        coverImg: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/pe.svg',
        desc: `Il Perù è uno Stato dell'America meridionale occidentale affacciato sull'Oceano Pacifico, articolato in tre grandi fasce naturali: la costa arida, la maestosa cordigliera delle Ande e la foresta amazzonica orientale. Il territorio fu uno dei principali centri della civiltà mondiale antica, ospitando culture millenarie come Caral, Chavín, Moche, Nazca e Chimú fino all'affermazione dell'Impero Inca (Tahuantinsuyu), che ebbe a Cusco la propria capitale e in siti come Machu Picchu una delle sue espressioni più celebri.<br><br>
        Conquistato dagli spagnoli di Francisco Pizarro negli anni Trenta del Cinquecento, il Perù divenne il fulcro del Vicereame del Perù, uno dei pilastri dell'amministrazione e dell'economia mineraria spagnola nel continente, raggiungendo l'indipendenza nel 1821 grazie alle campagne di José de San Martín e Simón Bolívar. Nel XIX e XX secolo il Paese affrontò conflitti regionali, alternanze tra governi civili e militari, profonde riforme sociali e la grave stagione di violenza interna tra gli anni Ottanta e Novanta.<br><br>
        Oggi il Perù dispone di un'economia dinamica basata sull'estrazione mineraria (rame, oro, zinco, argento), sull'agricoltura d'esportazione, sulla pesca, sui servizi e sul turismo culturale e gastronomico, pur convivendo con forti tensioni politiche istituzionali.`
      },
      {
        id: 'suriname',
        name: 'Suriname',
        official: 'Repubblica del Suriname',
        continent: 'Americhe',
        region: 'America meridionale',
        capital: 'Paramaribo',
        population: '~623.000',
        language: 'Olandese',
        currency: 'Dollaro surinamese (SRD)',
        coverImg: 'https://images.unsplash.com/photo-1444466194851-3b0c9f181f3d?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/sr.svg',
        desc: `Il Suriname è il più piccolo Stato sovrano dell'America meridionale per superficie, situato sulla costa atlantica settentrionale tra la Guyana e la Guyana Francese e caratterizzato da una pianura costiera e da un interno quasi interamente ricoperto da foreste tropicali pluviali. Abitato originariamente da popolazioni amerinde, il territorio fu colonizzato dagli inglesi e poi dai Paesi Bassi a partire dal XVII secolo, divenendo nota come Guiana Olandese.<br><br>
        L'economia coloniale delle piantagioni portò all'importazione di schiavi africani — da cui ebbero origine anche le comunità autonome dei Maroon nell'interno forestale — e successivamente di lavoratori a contratto provenienti dall'India, da Giava e dalla Cina, creando una società straordinariamente pluralista sul piano etnico, linguistico e religioso. Il Suriname ha conquistato l'indipendenza dai Paesi Bassi nel 1975, attraversando poi negli anni Ottanta una fase di governo militare e conflitti interni prima del consolidamento democratico.<br><br>
        L'economia nazionale si fonda sull'estrazione di oro, bauxite e petrolio, sulle risorse forestali e sull'agricoltura, con nuove prospettive legate alle scoperte petrolifere offshore e alla tutela dell'immenso patrimonio forestale.`
      },
      {
        id: 'uruguay',
        name: 'Uruguay',
        official: 'Repubblica Orientale dell\'Uruguay',
        continent: 'Americhe',
        region: 'America meridionale',
        capital: 'Montevideo',
        population: '~3.400.000',
        language: 'Spagnolo',
        currency: 'Peso uruguaiano (UYU)',
        coverImg: 'https://images.unsplash.com/photo-1780061926273-08a7a1d190a3?q=80&w=1748&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/uy.svg',
        desc: `L'Uruguay è uno Stato dell'America meridionale sud-orientale situato tra l'Argentina e il Brasile, affacciato sull'estuario del Río de la Plata e sull'Oceano Atlantico, con un paesaggio dominato da dolci colline erbose e pianure fluviali. Abitato originariamente da popolazioni indigene come i Charrúa, il territorio (detto Banda Oriental) fu a lungo conteso tra l'Impero spagnolo e quello portoghese e poi tra Argentina e Brasile.<br><br>
        Riconosciuto come Stato indipendente nel 1828, l'Uruguay si distinse all'inizio del Novecento — soprattutto sotto la guida di José Batlle y Ordóñez — per la costruzione precoce di uno Stato sociale avanzato, laico e democratico. Dopo una grave crisi economica e la dittatura civico-militare tra il 1973 e il 1985, il Paese ha ristabilito istituzioni democratiche solide e un'elevata coesione sociale.<br><br>
        Oggi l'Uruguay vanta uno dei redditi pro capite e degli indici di stabilità istituzionale più alti dell'America Latina, con un'economia basata sull'agroindustria (carni, latticini, cellulosa, soia), sui servizi finanziari e tecnologici, sulle energie rinnovabili e sul turismo.`
      },
      {
        id: 'venezuela',
        name: 'Venezuela',
        official: 'Repubblica Bolivariana del Venezuela',
        continent: 'Americhe',
        region: 'America meridionale',
        capital: 'Caracas',
        population: '~28.800.000',
        language: 'Spagnolo',
        currency: 'Bolívar venezuelano (VES)',
        coverImg: 'https://images.unsplash.com/photo-1714594923299-e915b7d71701?q=80&w=1826&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ve.svg',
        desc: `Il Venezuela è uno Stato situato sulla costa settentrionale dell'America meridionale, affacciato sul Mar dei Caraibi e sull'Oceano Atlantico, con un territorio ricco e variegato che comprende le propaggini delle Ande, il bacino del lago di Maracaibo, le pianure dei Llanos, il delta dell'Orinoco e gli antichi altopiani della Guayana. Abitato da numerose popolazioni indigene prima dell'arrivo degli europei alla fine del Quattrocento, entrò a far parte dell'Impero spagnolo nel XVI secolo.<br><br>
        Il Venezuela ebbe un ruolo centrale nelle guerre d'indipendenza sudamericane guidate da figure originarie del Paese come Francisco de Miranda e Simón Bolívar, conquistando l'indipendenza dalla Spagna e costituendosi poi come repubblica autonoma nel 1830 dopo lo scioglimento della Grande Colombia. Nel Novecento lo sfruttamento delle immense riserve petrolifere trasformò profondamente l'economia e la società, portando dopo il 1958 a una fase democratica seguita, dalla fine degli anni Novanta, dalla rivoluzione bolivariana avviata da Hugo Chávez.<br><br>
        Dotato delle maggiori riserve petrolifere accertate al mondo oltre a importanti risorse minerarie e idroelettriche, il Venezuela ha tuttavia attraversato negli ultimi decenni una profondissima crisi economica, politica e umanitaria che ha provocato un imponente flusso migratorio verso l'estero.`
      },
      {
        id: 'australia',
        name: 'Australia',
        official: 'Commonwealth dell\'Australia',
        continent: 'Oceania',
        region: 'Oceania / Australasia',
        capital: 'Canberra',
        population: '~26.600.000',
        language: 'Inglese',
        currency: 'Dollaro australiano (AUD)',
        coverImg: 'https://images.unsplash.com/photo-1768286008920-b49f6555421f?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/au.svg',
        desc: `L'Australia è lo Stato più esteso dell'Oceania e il sesto al mondo per superficie, comprendendo l'intera massa continentale australiana e l'isola della Tasmania, con un territorio vastissimo caratterizzato da regioni interne aride o semi-aride (l'Outback), catene montuose costiere come la Grande Catena Divisoria, la Grande Barriera Corallina a nord-est e ambienti tropicali, temperati e desertici. Abitato da oltre sessantamila anni da popolazioni aborigene australiane e dagli isolani dello Stretto di Torres con una straordinaria ricchezza di lingue, culture e tradizioni spirituali legate al territorio, il continente entrò progressivamente nelle rotte europee tra Seicento e Settecento.<br><br>
        A partire dal 1788 con l'arrivo della Prima Flotta britannica nel Nuovo Galles del Sud, l'Australia fu dapprima insediamento penale e poi colonia di popolamento, con l'espansione agricola e pastorale, la corsa all'oro dell'Ottocento e gravi conseguenze demografiche e culturali per le comunità indigene. Il 1° gennaio 1901 le sei colonie britanniche si unirono nel Commonwealth dell'Australia, consolidando un sistema federale e parlamentare democratico e raggiungendo gradualmente la piena autonomia legislativa e politica nel corso del Novecento.<br><br>
        Dotata di un'economia avanzata, stabile e ricca di materie prime — tra estrazione mineraria (ferro, carbone, gas naturale, litio, oro), agricoltura, servizi, istruzione e turismo —, l'Australia coniuga elevati standard di vita e un forte legame con il Pacifico e l'Asia-Pacifico a un dibattito continuo su clima, immigrazione e riconciliazione con i popoli indigeni.`
      },
      {
        id: 'figi',
        name: 'Figi',
        official: 'Repubblica delle Figi',
        continent: 'Oceania',
        region: 'Oceania / Melanesia',
        capital: 'Suva',
        population: '~940.000',
        language: 'Inglese, Figiano, Hindi delle Figi',
        currency: 'Dollaro delle Figi (FJD)',
        coverImg: 'https://images.unsplash.com/photo-1655719647300-5142977bfa79?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/fj.svg',
        desc: `Le Figi costituiscono un arcipelago di oltre trecento isole — di cui circa un centinaio abitate, dominate dalle due isole maggiori di Viti Levu e Vanua Levu — situato nell'Oceano Pacifico meridionale, in una posizione di cerniera tra Melanesia e Polinesia. Abitate da millenni da popolazioni austronesiane e melanesiane con reti marittime e gerarchie tradizionali consolidate, le isole entrarono nei contatti europei tra Seicento e Settecento e divennero colonia della Corona britannica nel 1874.<br><br>
        Durante l'amministrazione coloniale lo sviluppo delle piantagioni di canna da zucchero portò all'arrivo di numerosi lavoratori a contratto dall'India, dando origine a una società biculturale caratterizzata dalla convivenza e talvolta da tensioni politiche tra comunità figiana e indo-figiana. Ottenuta l'indipendenza nel 1970, il Paese affrontò colpi di Stato e crisi costituzionali tra la fine del Novecento e l'inizio del XXI secolo prima di consolidare un sistema democratico multipartitico.<br><br>
        Oggi le Figi rappresentano uno dei principali hub regionali del Pacifico meridionale per trasporti, servizi, turismo insulare e agroindustria (zucchero, acqua, pesca), affrontando al contempo sfide legate all'erosione costiera e ai cambiamenti climatici.`
      },
      {
        id: 'isole-marshall',
        name: 'Isole Marshall',
        official: 'Repubblica delle Isole Marshall',
        continent: 'Oceania',
        region: 'Oceania / Micronesia',
        capital: 'Majuro',
        population: '~42.000',
        language: 'Marshallese, Inglese',
        currency: 'Dollaro statunitense (USD)',
        coverImg: 'https://images.unsplash.com/photo-1553709718-3226928c750c?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/mh.svg',
        desc: `Le Isole Marshall sono uno Stato insulare della Micronesia nell'Oceano Pacifico centrale, formato da ventinove atolli corallini e cinque isole singole distribuiti su due catene parallele — Ratak ("alba") e Ralik ("tramonto") — con un'altitudine media bassissima e un'ampia zona economica esclusiva marittima. Abitate da millenni da navigatori micronesiano-austronesiani che svilupparono raffinate tecniche di orientamento oceanico e carte a bastoncini, le isole furono attraversate dai primi contatti europei e divennero un protettorato tedesco alla fine dell'Ottocento.<br><br>
        Passate al Giappone dopo la prima guerra mondiale e poi occupate dagli Stati Uniti durante la seconda guerra mondiale, divennero parte del Territorio in amministrazione fiduciaria delle Isole del Pacifico sotto amministrazione statunitense. Nel secondo dopoguerra gli atolli di Bikini ed Enewetak furono teatro di decine di test nucleari statunitensi, con gravi conseguenze ambientali e sanitarie per la popolazione, prima dell'indipendenza e del Trattato di Libera Associazione con gli Stati Uniti negli anni Ottanta.<br><br>
        Oggi l'economia delle Isole Marshall si regge su fondi e trasferimenti legati all'accordo con gli Stati Uniti, sulla pesca, sui servizi marittimi e sul turismo, in prima linea nella difesa contro l'innalzamento del livello del mare.`
      },
      {
        id: 'isole-salomone',
        name: 'Isole Salomone',
        official: 'Isole Salomone',
        continent: 'Oceania',
        region: 'Oceania / Melanesia',
        capital: 'Honiara',
        population: '~740.000',
        language: 'Inglese',
        currency: 'Dollaro delle Isole Salomone (SBD)',
        coverImg: 'https://images.unsplash.com/photo-1627887419093-bf2fcd9adce6?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/sb.svg',
        desc: `Le Isole Salomone costituiscono un vasto arcipelago melanesiano dell'Oceano Pacifico sud-occidentale, a est della Papua Nuova Guinea, formato da quasi mille isole — tra cui Guadalcanal, Malaita, Choiseul, New Georgia e Santa Isabel — ricche di rilievi vulcanici, foreste tropicali e barriere coralline. Abitate da migliaia di anni da popolazioni melanesiane con una grande diversità linguistica e culturale, le isole furono avvistate nel XVI secolo da navigatori spagnoli e divennero un protettorato britannico alla fine dell'Ottocento.<br><br>
        Durante la seconda guerra mondiale l'arcipelago fu teatro di aspri combattimenti tra forze alleate e giapponesi, a partire dalla battaglia di Guadalcanal del 1942-1943, che lasciarono profonde tracce storiche e belliche. Nel 1978 il Paese ha raggiunto l'indipendenza dal Regno Unito come monarchia costituzionale nel Commonwealth, attraversando tra la fine degli anni Novanta e l'inizio del Duemila una fase di tensioni etniche e disordini interni poi superata con l'assistenza regionale.<br><br>
        L'economia delle Isole Salomone si basa sull'agricoltura di sussistenza e da esportazione (olio di palma, cacao, copra), sulla silvicoltura, sulla pesca e sull'estrazione mineraria, in un contesto insulare segnato da sfide infrastrutturali, climatiche e geopolitiche nel Pacifico.`
      },
      {
        id: 'kiribati',
        name: 'Kiribati',
        official: 'Repubblica di Kiribati',
        continent: 'Oceania',
        region: 'Oceania / Micronesia',
        capital: 'Tarawa Sud',
        population: '~134.000',
        language: 'Inglese, Gilbertese (Taetae ni Kiribati)',
        currency: 'Dollaro australiano (AUD), Dollaro di Kiribati (KID)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ki.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ki.svg',
        desc: `Kiribati è uno Stato insulare dell'Oceano Pacifico centrale composto da trentadue atolli corallini bassi e da un'isola corallina sollevata (Banaba), distribuiti su un'immensa area marittima a cavallo dell'equatore e del meridiano di 180 gradi, comprendente le isole Gilbert, Phoenix e della Linea. Abitate originariamente da navigatori austronesiani/micronesiano-polinesiani, le isole entrarono nell'orbita britannica nella seconda metà dell'Ottocento come protettorato e poi colonia delle Isole Gilbert ed Ellice.<br><br>
        Dopo la seconda guerra mondiale — che vide anche la dura battaglia di Tarawa nel 1943 — e la successiva separazione amministrativa dalle Ellice (divenute Tuvalu), Kiribati ha conquistato l'indipendenza nel 1979 come repubblica democratica. Per la sua collocazione geografica e la sua elevazione minima sul livello del mare, il Paese è divenuto uno dei simboli più noti al mondo della vulnerabilità climatica.<br><br>
        L'economia di Kiribati poggia sulle licenze di pesca nelle proprie acque oceaniche, sulle rimesse dei marittimi all'estero, sui fondi sovrani e sull'agricoltura costiera, affrontando gravi sfide legate all'erosione, alla salinizzazione delle falde e all'innalzamento marino.`
      },
      {
        id: 'micronesia-stati-federati-di',
        name: 'Micronesia (Stati Federati di)',
        official: 'Stati Federati di Micronesia',
        continent: 'Oceania',
        region: 'Oceania / Micronesia',
        capital: 'Palikir',
        population: '~115.000',
        language: 'Inglese',
        currency: 'Dollaro statunitense (USD)',
        coverImg: 'https://images.unsplash.com/photo-1553602932-f93f674a9aaa?q=80&w=1842&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/fm.svg',
        desc: `Gli Stati Federati di Micronesia costituiscono uno Stato insulare dell'Oceano Pacifico occidentale composto da oltre seicento isole — suddivise in quattro Stati principali: Yap, Chuuk, Pohnpei e Kosrae — che uniscono isole vulcaniche alte e lussureggianti ad atolli corallini. Abitate da millenni da popolazioni austronesiane con tradizioni marittime e insulari articolate — testimoniate anche da siti archeologici monumentali come Nan Madol a Pohnpei —, le isole conobbero le dominazioni spagnola, tedesca e giapponese prima del passaggio all'amministrazione fiduciaria statunitense dopo la seconda guerra mondiale.<br><br>
        Nel 1979 le quattro entità insulari adottarono una costituzione federale e nel 1986 entrarono in vigore l'indipendenza e il Trattato di Libera Associazione con gli Stati Uniti, che garantisce sostegno finanziario, difesa e libera circolazione dei cittadini verso gli USA.<br><br>
        L'economia degli Stati Federati di Micronesia si fonda sulle risorse finanziarie legate al trattato con gli Stati Uniti, sulla pesca, sull'agricoltura di sussistenza, sul turismo e sui servizi pubblici, in un assetto federale attento alla tutela ambientale e alla connettività insulare.`
      },
      {
        id: 'nauru',
        name: 'Nauru',
        official: 'Repubblica di Nauru',
        continent: 'Oceania',
        region: 'Oceania / Micronesia',
        capital: 'Yaren (sede governativa ufficiale; non ha una capitale formale)',
        population: '~12.800',
        language: 'Nauruano, Inglese',
        currency: 'Dollaro australiano (AUD)',
        coverImg: 'https://images.unsplash.com/photo-1553947315-42cee3c8c771?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/nr.svg',
        desc: `Nauru è una piccola isola-Stato corallina e calcarea situata nell'Oceano Pacifico centrale a sud dell'equatore, nota per essere la repubblica indipendente più piccola del mondo per superficie e popolazione, con una fascia costiera fertile circondata da un altopiano interno ricco di depositi di fosfato. Abitata originariamente da dodici clan di lingua nauruana con tradizioni marittime e sociali proprie, l'isola entrò nell'orbita coloniale tedesca alla fine dell'Ottocento e passò poi sotto amministrazione australiana, britannica e neozelandese (con un'occupazione giapponese durante la seconda guerra mondiale).<br><br>
        Nel gennaio 1968 Nauru ha raggiunto l'indipendenza, trovandosi per alcuni decenni a disporre di un reddito pro capite straordinariamente elevato grazie allo sfruttamento intensivo dei giacimenti di fosfato, gestito anche attraverso un fondo fiduciario.<br><br>
        L'esaurimento dei depositi più accessibili e le difficoltà di gestione finanziaria hanno portato a una profonda riconversione economica legata alla pesca, ai fondi pubblici, ai servizi e agli accordi con l'Australia, mentre l'isola affronta il recupero ambientale dell'interno minerario e le sfide climatiche.`
      },
      {
        id: 'nuova-zelanda',
        name: 'Nuova Zelanda',
        official: 'Nuova Zelanda',
        continent: 'Oceania',
        region: 'Oceania / Australasia / Polinesia',
        capital: 'Wellington',
        population: '~5.200.000',
        language: 'Inglese, Māori, Lingua dei segni neozelandese',
        currency: 'Dollaro neozelandese (NZD)',
        coverImg: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/nz.svg',
        desc: `La Nuova Zelanda è uno Stato insulare situato nell'Oceano Pacifico sud-occidentale, composto principalmente dalle due isole maggiori — l'Isola del Nord e l'Isola del Sud — e da numerose isole minori, con paesaggi celebri per le montagne alpine, i fiordi, i laghi, le foreste temperate e l'attività geotermica e vulcanica. Abitata da secoli dai Māori — navigatori polinesiani giunti dall'area polinesiana orientale che svilupparono una ricca cultura tribale (*iwi* e *hapū*), arti e tradizioni orali —, l'arcipelago (chiamato *Aotearoa* in lingua māori) vide i primi contatti europei con Abel Tasman e James Cook prima dell'espansione britannica nell'Ottocento.<br><br>
        Nel 1840 la firma del Trattato di Waitangi tra rappresentanti della Corona britannica e capi māori segnò l'avvio della sovranità britannica e dell'insediamento coloniale europeo, accompagnato da conflitti fondiari, trasformazioni demografiche e un lungo percorso di riconoscimento e rivendicazione dei diritti māori. Divenuta dominion e poi Stato pienamente autonomo nel corso del Novecento, la Nuova Zelanda si è distinta per l'adozione precoce del suffragio femminile (1893) e per la costruzione di un moderno Stato sociale democratico.<br><br>
        Oggi la Nuova Zelanda gode di un'economia aperta, avanzata e orientata all'export, trainata dall'agroindustria (latticini, carne, lana, ortofrutta e silvicoltura), dal turismo naturalistico, dai servizi e dall'innovazione, con un forte impegno ambientale e un ruolo attivo nella cooperazione del Pacifico.`
      },
      {
        id: 'palau',
        name: 'Palau',
        official: 'Repubblica di Palau',
        continent: 'Oceania',
        region: 'Oceania / Micronesia',
        capital: 'Ngerulmud',
        population: '~18.000',
        language: 'Palauano, Inglese (e lingue locali in singoli Stati)',
        currency: 'Dollaro statunitense (USD)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/pw.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/pw.svg',
        desc: `Palau è uno Stato insulare della Micronesia situato nell'Oceano Pacifico occidentale, formato da oltre trecento isole — tra cui Babeldaob, Koror, Peleliu e le celebri Rock Islands — caratterizzate da scogliere calcaree, lagune coralline e una biodiversità marina eccezionale. Abitate da millenni da popolazioni austronesiane con tradizioni comunitarie, sociali e marittime proprie, le isole conobbero i contatti spagnoli e poi le amministrazioni tedesca e giapponese prima di passare sotto l'amministrazione fiduciaria statunitense dopo la seconda guerra mondiale.<br><br>
        Nel 1994 Palau ha raggiunto la piena indipendenza ed è entrato in vigore il Trattato di Libera Associazione con gli Stati Uniti, che assicura assistenza economica e di difesa in cambio di diritti strategici nel Pacifico occidentale.<br><br>
        L'economia di Palau si basa in larga misura sul turismo subacqueo e naturalistico, sui finanziamenti legati all'accordo con gli Stati Uniti, sulla pesca e sui servizi, accompagnata da politiche pionieristiche di tutela delle aree marine protette.`
      },
      {
        id: 'papua-nuova-guinea',
        name: 'Papua Nuova Guinea',
        official: 'Stato Indipendente della Papua Nuova Guinea',
        continent: 'Oceania',
        region: 'Oceania / Melanesia',
        capital: 'Port Moresby',
        population: '~10.500.000',
        language: 'Inglese, Tok Pisin, Hiri Motu, Lingua dei segni papuana',
        currency: 'Kina papuana (PGK)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/pg.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/pg.svg',
        desc: `La Papua Nuova Guinea occupa la metà orientale dell'isola della Nuova Guinea e comprende vasti arcipelaghi melanesiani — tra cui Nuova Britannia, Nuova Irlanda e Bougainville —, presentando un territorio montuoso e impervio, altipiani densamente popolati, fiumi imponenti, foreste tropicali e una straordinaria varietà biologica e culturale. Con oltre ottocento lingue parlate, il Paese è uno dei luoghi con la maggiore diversità linguistica e culturale del pianeta, con decine di migliaia di anni di insediamento umano e antiche pratiche agricole negli altopiani.<br><br>
        Nell'Ottocento e nel primo Novecento il territorio fu suddiviso tra diverse amministrazioni coloniali (tedesca, britannica e australiana) e durante la seconda guerra mondiale fu teatro di durissimi scontri tra forze alleate e giapponesi lungo la pista di Kokoda e sulle coste. Riunita sotto amministrazione australiana e divenuta indipendente nel 1975 come monarchia costituzionale nel Commonwealth, la Papua Nuova Guinea ha affrontato tensioni regionali — come il conflitto a Bougainville — e sfide legate alle infrastrutture e alla governance.<br><br>
        Ricca di risorse naturali — tra gas naturale, oro, rame, legname, olio di palma, caffè e cacao —, l'economia del Paese combina un settore estrattivo ed esportatore rilevante con un'ampia agricoltura di sussistenza rurale.`
      },
      {
        id: 'samoa',
        name: 'Samoa',
        official: 'Stato Indipendente di Samoa',
        continent: 'Oceania',
        region: 'Oceania / Polinesia',
        capital: 'Apia',
        population: '~225.000',
        language: 'Samoano, Inglese',
        currency: 'Tālā samoano (WST)',
        coverImg: 'https://images.unsplash.com/photo-1735122061748-5525dfd5fead?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/ws.svg',
        desc: `Samoa è uno Stato insulare della Polinesia situato nell'Oceano Pacifico meridionale, composto principalmente dalle due grandi isole vulcaniche di Upolu e Savai'i e da alcune isole minori, con rilievi lussureggianti, cascate e coste coralline. Considerata uno dei nuclei storici e culturali più antichi della civiltà polinesiana, Samoa ha conservato il *fa'a Samoa* ("la via samoana"), un sistema sociale e comunitario basato sulle famiglie allargate (*āiga*), sui titoli di capo (*matai*) e sulle assemblee (*fono*).<br><br>
        Dopo essere stata divisa tra Germania e Stati Uniti alla fine dell'Ottocento (con la parte orientale rimasta Samoa Americane), la Samoa occidentale passò sotto amministrazione neozelandese dopo la prima guerra mondiale e nel 1962 divenne il primo piccolo Stato insulare del Pacifico a raggiungere l'indipendenza.<br><br>
        Oggi l'economia samoana si regge sulle rimesse della numerosa diaspora all'estero, sul turismo, sull'agricoltura (cocco, taro, banane, cacao, pesce) e sull'industria leggera, mantenendo una forte coesione culturale e una spiccata sensibilità alle sfide climatiche.`
      },
      {
        id: 'tonga',
        name: 'Tonga',
        official: 'Regno di Tonga',
        continent: 'Oceania',
        region: 'Oceania / Polinesia',
        capital: 'Nukuʻalofa',
        population: '~108.000',
        language: 'Tongano, Inglese',
        currency: 'Paʻanga tongano (TOP)',
        coverImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/to.svg',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/to.svg',
        desc: `Tonga è uno Stato insulare della Polinesia situato nell'Oceano Pacifico meridionale, formato da oltre centosettanta isole — raggruppate nei principali arcipelaghi di Tongatapu, Ha'apai e Vava'u — che uniscono isole coralline basse ad isole vulcaniche. In epoca precolombiana Tonga fu il centro di un potente talassocrazia e impero marittimo polinesiano (l'Impero Tu'i Tonga) che estese la propria influenza e le proprie reti di scambio su gran parte del Pacifico centrale e meridionale.<br><br>
        Pur avendo firmato un trattato di amicizia e protettorato con il Regno Unito nel 1900, il Regno di Tonga non perse mai la propria dinastia regnante né la propria sovranità interna, tornando a essere pienamente indipendente nel 1970 e distinguendosi come l'unica monarchia dell'Oceania a non essere stata formalmente colonizzata.<br><br>
        L'economia tongana poggia sulle rimesse degli emigrati, sull'agricoltura (zucca, radici, frutta tropicale), sulla pesca, sul turismo e sui servizi, affrontando al contempo l'impatto di cicloni tropicali, attività vulcanica sottomarina e cambiamenti climatici.`
      },
      {
        id: 'tuvalu',
        name: 'Tuvalu',
        official: 'Tuvalu',
        continent: 'Oceania',
        region: 'Oceania / Polinesia',
        capital: 'Funafuti',
        population: '~11.400',
        language: 'Tuvaluano, Inglese',
        currency: 'Dollaro australiano (AUD), Dollaro di Tuvalu (TVD)',
        coverImg: 'https://images.unsplash.com/photo-1733714090606-5783cfa670ce?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/tv.svg',
        desc: `Tuvalu è uno Stato insulare della Polinesia situato nell'Oceano Pacifico centro-meridionale, composto da nove isole — tra atolli corallini e isole reef — con un'altitudine massima di pochi metri sul livello del mare e una superficie terrestre complessiva tra le più ridotte al mondo. Abitate originariamente da navigatori polinesiani con tradizioni comunitarie e marittime legate alla vita sull'atollo, le isole divennero parte del protettorato e poi della colonia britannica delle Isole Gilbert ed Ellice alla fine dell'Ottocento.<br><br>
        Nel 1974-1975 la popolazione delle isole Ellice votò per separarsi dalle Gilbert e formare un'entità distinta, raggiungendo l'indipendenza come Tuvalu nel 1978 come monarchia costituzionale all'interno del Commonwealth.<br><br>
        A causa della fragilità ambientale e della minima quota sul livello del mare, Tuvalu è in prima linea nelle iniziative internazionali sull'adattamento climatico, mentre la sua economia si fonda sulle licenze di pesca, sui fondi fiduciari pubblici, sulle rimesse e sui proventi del dominio internet .tv.`
      },
      {
        id: 'vanuatu',
        name: 'Vanuatu',
        official: 'Repubblica di Vanuatu',
        continent: 'Oceania',
        region: 'Oceania / Melanesia',
        capital: 'Port Vila',
        population: '~335.000',
        language: 'Bislama, Inglese, Francese',
        currency: 'Vatu di Vanuatu (VUV)',
        coverImg: 'https://images.unsplash.com/photo-1602587557684-11163fe60c87?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
        flagImg: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/vu.svg',
        desc: `Vanuatu è un arcipelago vulcanico della Melanesia situato nell'Oceano Pacifico sud-occidentale, formato da oltre ottanta isole — tra cui Espiritu Santo, Efate, Malakula e Tanna — note per i vulcani attivi, le foreste pluviali, le scogliere e una straordinaria varietà culturale e linguistica. Abitate da migliaia di anni da popolazioni melanesiane, le isole (già note come Nuove Ebridi) ebbero un percorso storico singolare in età coloniale.<br><br>
        A partire dal 1906 furono governate congiuntamente da Regno Unito e Francia come un condominio anglo-francese, con una doppia amministrazione e un sistema giuridico e linguistico tripartito che riflette ancora oggi il bislama, l'inglese e il francese. Vanuatu ha conquistato la piena indipendenza nel 1980 come repubblica parlamentare.<br><br>
        Oggi l'economia di Vanuatu si basa sull'agricoltura (cocco, copra, cacao, kava, manzo), sul turismo, sui servizi finanziari e marittimi, in un contesto particolarmente esposto a cicloni, terremoti ed eruzioni vulcaniche.`
      },

    ];
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof populateSubareaSelect === 'function') {
        populateSubareaSelect(nationsData);
      }
      initWorldMaps();
    });

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

      if (typeof populateSubareaSelect === 'function') {
        populateSubareaSelect(pool);
      }

      const activeTagNow = document.getElementById('subareaFilterSelect')?.value || 'all';
      const filtered = pool.filter(n => {
        const matchesTag = activeTagNow === 'all' || (typeof getCardHighlightTag === 'function' && getCardHighlightTag(n) === activeTagNow);
        if (!matchesTag) return false;
        if (!query) return true;
        const haystack = normalizeText(`${n.name} ${n.official} ${n.capital} ${n.language} ${n.region} ${n.continent}`);
        return haystack.includes(query);
      });

      if (antarcticaBox) antarcticaBox.style.display = 'none';
      if (grid) grid.style.display = 'grid';
      renderNations(filtered);
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
              .on('click', (event, d) => handleMapCountryClick(d));

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
              .on('click', (event, d) => handleMapCountryClick(d));

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

    function renderNations(data) {
      const grid = document.getElementById('nationsGrid');
      if (!grid) return;
      grid.innerHTML = '';
      data.forEach(nation => {
        const card = document.createElement('div');
        card.className = 'nation-card';
        card.onclick = () => openNationDetail(nation.id);
        card.innerHTML = `
          <img src="${nation.flagImg}" alt="${nation.name}" class="nation-flag-thumb">
          <div class="nation-info">
            <h4>${nation.name}</h4>
            <span>${nation.continent} • ${nation.capital}</span>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function showIntroHome() {
      currentContinentFilter = null;
      currentAmericasSubFilter = 'all';

      document.getElementById('nationDetailView').style.display = 'none';
      document.getElementById('homeNationView').style.display = 'block';
      document.querySelectorAll('.continent-btn').forEach(btn => btn.classList.remove('active'));

      document.querySelectorAll('.mode-switch-btn').forEach(btn => btn.classList.remove('active'));
      const btnWorld = document.getElementById('btnModeWorld');
      if (btnWorld) btnWorld.classList.add('active');
      const continentsBar = document.getElementById('continentsBar');
      if (continentsBar) continentsBar.style.display = '';
      const currScreen = document.getElementById('currenciesScreen');
      if (currScreen) currScreen.style.display = 'none';

      const subbar = document.getElementById('americasSubbar');
      if (subbar) subbar.classList.remove('show');
      const antarcticaBox = document.getElementById('antarcticaBox');
      if (antarcticaBox) antarcticaBox.style.display = 'none';
      document.getElementById('nationsGrid').style.display = 'none';
      document.getElementById('introExplorerBox').style.display = 'block';
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

      const subbar = document.getElementById('americasSubbar');
      const grid = document.getElementById('nationsGrid');
      const antarcticaBox = document.getElementById('antarcticaBox');

      if (continent === 'Americhe') {
        if (antarcticaBox) antarcticaBox.style.display = 'none';
        if (grid) grid.style.display = 'grid';
        if (subbar) subbar.classList.add('show');
        document.querySelectorAll('.subcontinent-btn').forEach(b => b.classList.remove('active'));
        const subBtnAll = document.getElementById('subBtnAll');
        if (subBtnAll) subBtnAll.classList.add('active');
        const americasNations = nationsData.filter(n => n.continent === 'Americhe');
        renderNations(americasNations);
      } else if (continent === 'Antartide') {
        if (subbar) subbar.classList.remove('show');
        if (grid) grid.style.display = 'none';
        if (antarcticaBox) antarcticaBox.style.display = 'block';
      } else {
        if (subbar) subbar.classList.remove('show');
        if (antarcticaBox) antarcticaBox.style.display = 'none';
        if (grid) grid.style.display = 'grid';
        if (continent === 'all') {
          renderNations(nationsData);
        } else {
          const filtered = nationsData.filter(n => n.continent === continent);
          renderNations(filtered);
        }
      }
    }

    function filterAmericasSub(subarea, triggerBtn) {
      currentAmericasSubFilter = subarea;
      document.querySelectorAll('.subcontinent-btn').forEach(btn => btn.classList.remove('active'));
      if (triggerBtn) triggerBtn.classList.add('active');

      const americasNations = nationsData.filter(n => n.continent === 'Americhe');
      if (subarea === 'all') {
        renderNations(americasNations);
      } else {
        renderNations(americasNations.filter(n => getAmericaSubarea(n) === subarea));
      }
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
    let currenciesMapInitialized = false;

    const CURRENCY_HISTORY_BY_CODE = {
      'EUR': 'Introdotto sui mercati finanziari nel 1999 e entrato in circolazione come banconote e monete nel 2002, l\'euro ha sostituito le storiche valute nazionali europee (come lira, franco, marco e peseta), diventando la moneta unica dell\'Eurozona e la seconda valuta di riserva al mondo.',
      'USD': 'Istituito con il Coinage Act del 1792 e ancorato al sistema decimale, il dollaro statunitense si è affermato dopo la Seconda guerra mondiale e gli accordi di Bretton Woods del 1944 come principale valuta di riserva e di scambio del commercio internazionale.',
      'GBP': 'Con oltre milleduecento anni di storia alle spalle, la sterlina britannica è la valuta più antica ancora in uso continuo al mondo, nata in epoca anglosassone come unità di peso in argento e divenuta pilastro della finanza globale.',
      'CHF': 'Nato nel 1850 per unificare le numerose monete cantonali della Confederazione Elvetica, il franco svizzero è celebre per la sua stabilità monetaria e il ruolo storico di valuta rifugio nei mercati internazionali.',
      'JPY': 'Introdotto nel 1871 durante il rinnovamento Meiji per modernizzare il sistema monetario giapponese e sostituire le antiche monete feudali, lo yen è oggi una delle valute più scambiate in Asia e nel mondo.',
      'CNY': 'Emesso dalla Banca Popolare Cinese a partire dal 1948-1949 al termine della guerra civile, il renminbi (la cui unità di conto è lo yuan) ha accompagnato l\'apertura economica della Cina fino a entrare nel paniere delle valute di riserva del FMI.',
      'RUB': 'Utilizzato in Russia fin dal Medioevo come unità di conto d\'argento e riformato più volte tra l\'epoca imperiale, sovietica e post-1991, il rublo è una delle più antiche denominazioni monetarie europee.',
      'CAD': 'Adottato nel 1858 per sostituire le precedenti sterline coloniali e allinearsi al sistema decimale nordamericano, il dollaro canadese è legato storicamente alle esportazioni di materie prime e all\'integrazione economica con gli Stati Uniti.',
      'AUD': 'Introdotto nel 1966 per sostituire la sterlina australiana con un sistema decimale, il dollaro australiano è oggi la valuta ufficiale non solo dell\'Australia ma anche di diversi piccoli Stati insulari del Pacifico.',
      'NZD': 'Entrato in circolazione nel 1967 al posto della sterlina neozelandese nel passaggio al sistema decimale, il dollaro neozelandese circola anche in diversi territori del Pacifico meridionale.',
      'BRL': 'Introdotto nel 1994 con il Plano Real per sconfiggere decenni di iperinflazione, il real brasiliano ha ripreso il nome dell\'antica moneta coloniale portoghese restituendo stabilità alla maggiore economia sudamericana.',
      'ARS': 'Dopo diverse riforme monetarie nel corso del Novecento, l\'attuale peso argentino è stato introdotto nel 1992 con parità iniziale rispetto al dollaro statunitense, attraversando poi fasi di forte volatilità finanziaria.',
      'MXN': 'Erede diretto del celebre "peso d\'argento" coloniale spagnolo — prima moneta di scambio globale tra Americhe, Europa e Asia — il peso messicano è stato riformato nel 1993 con l\'introduzione del nuovo peso.',
      'INR': 'Derivata dall\'antica "rupya" d\'argento coniata nel XVI secolo sotto Sher Shah Suri e standardizzata in epoca moderna dopo l\'indipendenza del 1947, la rupia indiana è la valuta di uno dei maggiori mercati mondiali.',
      'KRW': 'Reintrodotto nel 1962 in sostituzione dello hwan durante la rapida industrializzazione della Corea del Sud, il won sudcoreano affonda le sue radici terminologiche nelle antiche monete della dinastia Joseon.',
      'TRY': 'Nata nel 1923 con la fondazione della Repubblica di Turchia al posto della lira ottomana e rivalutata nel 2005 con l\'eliminazione di sei zeri, la lira turca riflette le trasformazioni economiche del Paese.',
      'SAR': 'Consolidato con l\'unificazione del Regno dell\'Arabia Saudita nel 1932 e storicamente ancorato al dollaro statunitense, il riyal saudita è strettamente legato all\'economia petrolifera del Golfo.',
      'AED': 'Introdotto nel 1973 poco dopo la nascita della federazione degli Emirati Arabi Uniti per sostituire il riyal del Qatar e di Dubai, il dirham emiratino è ancorato stabilmente al dollaro USA.',
      'ZAR': 'Creato nel 1961 in concomitanza con la nascita della Repubblica Sudafricana e chiamato così in onore del Witwatersrand, il rand è la valuta più scambiata dell\'Africa.',
      'EGP': 'Introdotta nel 1834 durante le riforme modernizzatrici di Muhammad Ali per sostituire le precedenti monete ottomane, la lira egiziana è una delle valute storiche del Medio Oriente e del Nord Africa.',
      'NGN': 'Adottata nel 1973 al posto della sterlina nigeriana per completare il passaggio al sistema decimale post-indipendenza, la naira è la valuta della maggiore economia dell\'Africa occidentale.',
      'SEK': 'Introdotta nel 1873 con l\'Unione monetaria scandinava in sostituzione del riksdaler, la corona svedese è legata alla lunga storia commerciale e industriale della Svezia e resta la valuta nazionale anche dopo l\'ingresso del Paese nell\'Unione europea.',
      'NOK': 'Istituita tra il 1875 e il 1876 nell\'ambito dell\'Unione monetaria scandinava al posto dello speciedaler, la corona norvegese è strettamente associata all\'economia marittima, ittica e petrolifera del Mare del Nord.',
      'DKK': 'Adottata nel 1873 con la riforma monetaria scandinava in sostituzione del rigsdaler, la corona danese mantiene oggi una stretta parità di cambio controllata con l\'euro tramite il meccanismo ERM II.',
      'PLN': 'Nato nel 1919 dopo la ricostituzione dello Stato polacco indipendente e riformato più volte — con la redenominazione del 1995 in seguito alla transizione economica post-comunista — lo złoty è una delle principali valute dell\'Europa centro-orientale.',
      'CZK': 'Introdotta nel 1993 dopo la dissoluzione della Cecoslovacchia in sostituzione della corona cecoslovacca, la corona ceca prosegue una tradizione monetaria avviata nel 1919 all\'indomani della nascita del primo Stato cecoslovacco.',
      'HUF': 'Reintrodotto nel 1946 per porre fine a uno degli episodi di iperinflazione più severi della storia moderna dopo la Seconda guerra mondiale, il fiorino ungherese riprende il nome dell\'antica moneta d\'oro coniata in Ungheria fin dal Trecento.',
      'RON': 'Creato nel 1867 come unità monetaria del Principato di Romania e sottoposto a una redenominazione nel 2005 con l\'eliminazione di quattro zeri, il leu rumeno richiama nell\'etimologia il "leone" d\'argento olandese circolante nei Balcani in età moderna.',
      'ILS': 'Adottato nel 1985 nel quadro di un piano di stabilizzazione economica per arrestare una forte inflazione e in sostituzione del vecchio shekel, il nuovo shekel israeliano riprende il nome di un\'antica unità di peso e di valore del Vicino Oriente antico.',
      'IRR': 'Derivato dal "rial" spagnolo e portoghese circolante nelle rotte commerciali dell\'Oceano Indiano e adottato come unità monetaria ufficiale in Persia nel 1932 sotto la dinastia Pahlavi, il rial iraniano è la valuta nazionale dell\'Iran.',
      'IQD': 'Introdotto nel 1932 in sostituzione della rupia indiana al termine del mandato britannico in Iraq e riformato dopo il 2003 con l\'emissione di nuove banconote, il dinaro iracheno richiama la tradizione monetaria mediorientale e islamica.',
      'JOD': 'Entrato in circolazione nel 1950 al posto della sterlina palestinese, il dinaro giordano è storicamente ancorato al dollaro statunitense e costituisce un elemento di stabilità monetaria nel Levante.',
      'KWD': 'Adottato nel 1961 in sostituzione della rupia del Golfo al momento dell\'indipendenza del Kuwait, il dinaro kuwaitiano è legato alle ingenti riserve petrolifere del Paese ed è tradizionalmente tra le unità valutarie con il valore nominale più elevato al mondo.',
      'THB': 'Standardizzato in epoca moderna sotto il re Rama VI nel primo Novecento (con l\'adozione del termine "baht" in sostituzione del tradizionale "tical"), il baht thailandese è la valuta del Siam/Thailandia ed è oggi tra le principali valute del Sud-est asiatico.',
      'MYR': 'Introdotto nel 1967 in sostituzione del dollaro della Malesia e del Borneo britannico e denominato ufficialmente "ringgit" in malese a partire dagli anni Settanta, è la valuta della Malaysia.',
      'IDR': 'Nata nel 1949 durante la lotta per l\'indipendenza dai Paesi Bassi per sostituire il fiorino delle Indie orientali olandesi, la rupia indonesiana è la valuta del più grande arcipelago del mondo.',
      'PHP': 'Istituito all\'inizio del Novecento sotto l\'amministrazione statunitense in sostituzione del peso spagnolo e divenuto valuta della Repubblica indipendente nel 1946, il peso filippino conserva il legame storico con la tradizione monetaria ispanica del Pacifico.',
      'VND': 'Introdotto nel 1946 nel Nord Vietnam e unificato nel 1978 dopo la fine della guerra del Vietnam, il dong vietnamita prende il nome dal termine che in vietnamita indicava anticamente le monete in metallo.',
      'SGD': 'Creato nel 1967 dopo la separazione di Singapore dalla Malaysia e la fine del currency board comune con Malesia e Brunei, il dollaro di Singapore è sostenuto da solide riserve ed è uno dei perni finanziari dell\'Asia.',
      'HKD': 'Emesso fin dalla metà dell\'Ottocento nel contesto del porto franco britannico di Hong Kong e ancorato dal 1983 al dollaro statunitense tramite il sistema del *currency board*, il dollaro di Hong Kong resta una valuta distinta anche dopo il passaggio alla Cina nel 1997.',
      'MAD': 'Introdotto nel 1921 nel Protettorato francese del Marocco in sostituzione dell\'hassani e consolidato dopo l\'indipendenza del 1956, il dirham marocchino è la valuta ufficiale del Marocco.',
      'DZD': 'Adottato nel 1964 poco dopo l\'indipendenza dell\'Algeria in sostituzione del nuovo franco francese, il dinaro algerino è strettamente legato alle esportazioni di idrocarburi del Paese.',
      'TND': 'Entrato in circolazione tra il 1958 e il 1960 dopo l\'indipendenza della Tunisia in sostituzione del franco tunisino, il dinaro tunisino è soggetto a controlli sui cambi ed è la valuta nazionale della Tunisia.',
      'KES': 'Introdotto nel 1966 per sostituire lo scellino dell\'Africa orientale britannica dopo l\'indipendenza del Kenya, lo scellino keniota è una delle valute di riferimento dell\'Africa orientale.',
      'GHS': 'Creato nel 1965 per sostituire la sterlina ghanese con un sistema decimale e ridenominato nel 2007 con l\'eliminazione di quattro zeri, il cedi ghanese prende il nome dalla parola che in lingua twi indica le conchiglie di ciprea usate un tempo come moneta.',
      'ETB': 'Introdotto nel 1945 in sostituzione del tallero di Maria Teresa e della lira italiana, il birr etiope è la valuta ufficiale dell\'Etiopia e richiama il termine amarico tradizionalmente usato per indicare l\'argento e il denaro.',
      'CLP': 'Adottato nel 1851 in sostituzione del real coloniale e riformato nel 1975 con l\'introduzione del nuovo peso al posto dell\'escudo, il peso cileno è la valuta del Cile.',
      'COP': 'Istituito nel 1871 in sostituzione del real colombiano e ancorato al sistema decimale, il peso colombiano è la valuta nazionale della Colombia.',
      'PEN': 'Reintrodotto nel 1991 con il nome di *nuevo sol* (poi semplificato in *sol*) per arrestare l\'iperinflazione degli anni Ottanta, la valuta peruviana riprende un\'antica denominazione storica del Perù.',
      'UYU': 'Introdotto nel 1862 e riformato più volte fino all\'attuale peso uruguaiano del 1993, accompagna la storia economica dell\'Uruguay nel bacino del Río de la Plata.',
      'XOF': 'Istituito nel 1945 per i territori francesi dell\'Africa occidentale e gestito dalla Banca centrale degli Stati dell\'Africa occidentale (BCEAO), il franco CFA dell\'Africa occidentale è condiviso da otto Paesi ed è oggi ancorato all\'euro.',
      'XAF': 'Creato nel 1945 per i territori dell\'Africa equatoriale e gestito dalla Banca degli Stati dell\'Africa centrale (BEAC), il franco CFA dell\'Africa centrale è la moneta comune di sei Stati dell\'Africa centrale con parità fissa legata all\'euro.',
      'XPF': 'Introdotto nel 1945 per i territori francesi del Pacifico e gestito dall\'Istituto di emissione d\'oltremare (IEOM), il franco CFP (o franco del Pacifico) circola in Polinesia francese, Nuova Caledonia e Wallis e Futuna.',
      'BGN': 'Introdotto nel 1881 dopo la ricostituzione del Principato di Bulgaria come unità monetaria legata al franco francese, il lev bulgaro richiama nell\'etimologia il termine arcaico per "leone" ed è ancorato all\'euro.',
      'RSD': 'Ripristinato nel 2006 come valuta ufficiale della Serbia indipendente in sostituzione del dinaro serbo-montenegrino, il dinaro serbo affonda le sue radici nella monetazione medievale serba del XIII secolo.',
      'UAH': 'Reintrodotta nel 1996 in sostituzione del karbovanets temporaneo post-sovietico, la grivnia ucraina riprende il nome della "hryvnia", antica unità di peso e di conto in argento della Rus\' di Kiev.',
      'ALL': 'Istituito nel 1926 sotto la presidenza e poi il regno di Ahmet Zogu in sostituzione del franco albanese, il lek albanese prende il nome da Alessandro Magno ("Leka i Madh") nella tradizione linguistica albanese.',
      'MKD': 'Introdotto nel 1992 dopo l\'indipendenza della Macedonia del Nord in sostituzione del dinaro jugoslavo, il dinaro macedone richiama nell\'etimologia il "denarius" romano.',
      'MDL': 'Creato nel 1993 dopo la dissoluzione dell\'URSS per sostituire il coupon moldavo, il leu moldavo condivide l\'origine etimologica con il leu rumeno.',
      'BYN': 'Introdotto nel 1992 dopo l\'indipendenza della Bielorussia e riformato nel 2016 con l\'eliminazione di quattro zeri, il rublo bielorusso riprende la storica denominazione monetaria slava.',
      'GEL': 'Istituito nel 1995 in sostituzione dei coupon transitori post-sovietici, il lari georgiano riprende un antico termine georgiano che indicava una riserva o un mucchio di denaro.',
      'AMD': 'Reintrodotto nel 1993 dopo l\'indipendenza dell\'Armenia al posto del rublo sovietico, il dram armeno richiama l\'antica moneta d\'argento "dramma" della tradizione greco-armena.',
      'AZN': 'Adottato nel 1992 dopo l\'indipendenza dell\'Azerbaigian e ridenominato nel 2006 con il rapporto di 1 nuovo manat per 5.000 vecchi manat, il manat azerbaigiano è legato all\'economia energetica del Caucaso e del Mar Caspio.',
      'KZT': 'Introdotto nel 1993 in sostituzione del rublo durante la transizione all\'indipendenza del Kazakistan, il tenge kazako prende il nome da antiche monete turco-mongole come il "tanga".',
      'UZS': 'Entrato in circolazione nel 1994 dopo l\'indipendenza dell\'Uzbekistan in sostituzione del rublo e del sistema dei coupon, il som uzbeko riprende un termine tradizionale dell\'Asia centrale.',
      'KGS': 'Adottato nel 1993 come prima valuta indipendente dell\'Asia centrale ex sovietica, il som kirghiso è la moneta nazionale del Kirghizistan.',
      'TJS': 'Introdotto nel 2000 in sostituzione del rublo tagiko, il somoni tagiko è intitolato a Ismail Samani, figura storica centrale della dinastia Samanide.',
      'TMT': 'Creato nel 1993 dopo l\'indipendenza del Turkmenistan e ridenominato nel 2009 con l\'eliminazione di tre zeri, il manat turkmeno è legato alle risorse di gas naturale del Paese.',
      'MNT': 'Introdotto nel 1925 in sostituzione del dollaro mongolo e del rublo durante la Repubblica Popolare Mongola, il tugrik mongolo è la valuta della Mongolia.',
      'AFN': 'Reintrodotto nel 2002-2003 nel quadro della riforma monetaria post-bellica in sostituzione del vecchio afghani, l\'afghani riprende una denominazione storica già usata negli anni Venti del Novecento.',
      'PKR': 'Adottata nel 1948 poco dopo la nascita del Pakistan in sostituzione della rupia indiana, la rupia pakistana prosegue la tradizione monetaria sudasiatica.',
      'BDT': 'Introdotto nel 1972 all\'indomani dell\'indipendenza del Bangladesh in sostituzione della rupia pakistana, il taka bengalese deriva dal termine sanscrito *tanka* usato per indicare antiche monete metalliche.',
      'LKR': 'Istituita nel 1950 in sostituzione della rupia di Ceylon dopo l\'indipendenza del Paese, la rupia dello Sri Lanka è la valuta ufficiale dello Sri Lanka.',
      'NPR': 'Adottata in epoca moderna nel Novecento e ancorata storicamente alla rupia indiana, la rupia nepalese è la valuta ufficiale del Nepal.',
      'BTN': 'Introdotto nel 1974 nell\'ambito della modernizzazione economica del Bhutan e mantenuto in parità con la rupia indiana, il ngultrum bhutanese prende il nome dal termine dzongkha per "argento".',
      'MMK': 'Adottato nel 1952 in sostituzione della rupia birmana dopo l\'indipendenza della Birmania/Myanmar, il kyat birmano riprende un\'antica unità di peso e di valore del Sud-est asiatico.',
      'KHR': 'Reintrodotto nel 1980 dopo la caduta del regime dei Khmer Rossi (già utilizzato tra il 1953 e il 1975), il riel cambogiano trae il proprio nome dal pesce d\'acqua dolce del lago Tonlé Sap.',
      'LAK': 'Introdotto nel 1979-1980 con la Repubblica Democratica Popolare del Laos, il kip laotiano è la valuta ufficiale del Laos.',
      'TWD': 'Emesso a partire dal 1949 a Taiwan per sostituire il vecchio dollaro taiwanese e stabilizzare l\'economia insulare, il nuovo dollaro taiwanese è la valuta in uso a Taiwan.',
      'MOP': 'Introdotta all\'inizio del Novecento nell\'allora territorio portoghese di Macao e legata all\'dollaro di Hong Kong, la pataca di Macao deriva dal nome di antiche monete d\'argento ispaniche e portoghesi.',
      'BND': 'Introdotto nel 1967 in base a un accordo di interscambiabilità con il dollaro di Singapore, il dollaro del Brunei è la valuta ufficiale del Sultanato del Brunei.',
      'QAR': 'Entrato in circolazione nel 1973 in sostituzione del riyal del Qatar e di Dubai e ancorato al dollaro statunitense, il riyal qatariota è la valuta del Qatar.',
      'OMR': 'Introdotto nel 1970-1973 in sostituzione del riyal di Muscat e Oman, il rial omanita è la valuta dell\'Oman.',
      'BHD': 'Adottato nel 1965 in sostituzione della rupia del Golfo per il territorio del Bahrein e ancorato al dollaro USA, il dinaro del Bahrein è la valuta del Bahrein.',
      'KWD': 'Adottato nel 1961 in sostituzione della rupia del Golfo al momento dell\'indipendenza del Kuwait, il dinaro kuwaitiano è legato alle ingenti riserve petrolifere del Paese ed è tradizionalmente tra le unità valutarie con il valore nominale più elevato al mondo.',
      'LBP': 'Introdotta nel 1948 dopo la separazione monetaria dalla Siria, la lira libanese ha attraversato lunghe fasi di crisi economica e forte svalutazione a partire dalla fine degli anni Dieci del Duemila.',
      'SYP': 'Entrata in circolazione nel 1947-1948 dopo la piena indipendenza della Siria, la lira siriana è la valuta ufficiale della Siria.',
      'YER': 'Adottato in seguito all\'unificazione dello Yemen nel 1990 per armonizzare le valute del Nord e del Sud Yemen, il rial yemenita è la valuta dello Yemen.',
      'TND': 'Entrato in circolazione tra il 1958 e il 1960 dopo l\'indipendenza della Tunisia in sostituzione del franco tunisino, il dinaro tunisino è soggetto a controlli sui cambi ed è la valuta nazionale della Tunisia.',
      'LYD': 'Introdotto nel 1951-1952 all\'indomani dell\'indipendenza della Libia in sostituzione delle valute d\'occupazione, il dinaro libico è legato all\'economia petrolifera del Paese.',
      'MRU': 'Introdotta nel 1973 in sostituzione del franco CFA e ridenominata nel 2018 con rapporto 1 a 10, l\'ouguiya mauritana è nota anche perché basata su una suddivisione quinaria anziché decimale.',
      'GMD': 'Introdotto nel 1971 in sostituzione della sterlina gambiana dopo l\'adozione del sistema decimale, il dalasi gambiano è la valuta del Gambia.',
      'GNF': 'Creato nel 1959 dopo l\'indipendenza della Guinea dalla Francia in sostituzione del franco CFA, il franco guineano è la valuta nazionale della Guinea.',
      'SLL': 'Introdotto nel 1964 in sostituzione della sterlina dell\'Africa occidentale britannica e ridenominato nel 2022 con l\'eliminazione di tre zeri, il leone della Sierra Leone prende il nome dal fondatore della colonia, John Taylor.',
      'LRD': 'Reintrodotto nel 1943 e riformato più volte fino alla configurazione moderna, il dollaro liberiano è la valuta della Liberia, storicamente legata agli Stati Uniti.',
      'CVE': 'Introdotto nel 1977 in sostituzione dell\'escudo di Capo Verde e ancorato all\'euro, l\'escudo capoverdiano è la valuta di Capo Verde.',
      'STN': 'Introdotto nel 1977 dopo l\'indipendenza di São Tomé e Príncipe e ridenominato nel 2018 con l\'eliminazione di tre zeri, il dobra è la valuta di São Tomé e Príncipe.',
      'AOA': 'Creato nel 1977 dopo l\'indipendenza dall\'Angola portoghese in sostituzione dell\'escudo angolano e riformato più volte fino al nuovo kwanza, prende il nome dal fiume Kwanza.',
      'MZN': 'Introdotto nel 1980 in sostituzione dell\'escudo del Mozambico e ridenominato nel 2006 con l\'eliminazione di tre zeri, il metical mozambicano richiama un\'antica unità di peso e di scambio dell\'Oceano Indiano.',
      'BWP': 'Introdotta nel 1976 in sostituzione del rand sudafricano come valuta nazionale del Botswana, la pula prende il nome dalla parola tswana che significa "pioggia", simbolo di prosperità in un territorio semiarido.',
      'NAD': 'Istituito nel 1993 dopo l\'indipendenza della Namibia e mantenuto in parità con il rand sudafricano, il dollaro namibiano è la valuta della Namibia.',
      'SZL': 'Introdotto nel 1974 in sostituzione del rand sudafricano (con cui mantiene la parità), il lilangeni è la valuta dell\'Eswatini.',
      'LSL': 'Creato nel 1966-1980 per il Lesotho e ancorato al rand sudafricano, il loti è la valuta ufficiale del Lesotho.',
      'ZMW': 'Introdotto nel 1968 in sostituzione della sterlina zambiana e ridenominato nel 2013 con l\'eliminazione di tre zeri, il kwacha zambiano prende il nome da un termine bemba e nyanja che significa "alba" o "nuova aurora".',
      'MWK': 'Adottato nel 1971 in sostituzione della sterlina del Malawi e ridenominato nel 2012, il kwacha malawiano condivide l\'origine simbolica con la valuta dello Zambia.',
      'MGA': 'Introdotto nel 2003 in sostituzione del franco malgascio, l\'ariary malgascio riprende il nome di un\'antica unità monetaria e di peso tradizionale del Madagascar.',
      'MUR': 'Istituita nel 1877 in sostituzione della rupia indiana e della sterlina britannica nell\'isola di Mauritius, la rupia mauriziana è la valuta di Mauritius.',
      'SCR': 'Introdotta nel 1976 in sostituzione della rupia mauriziana, la rupia delle Seychelles è la valuta ufficiale delle Seychelles.',
      'TZS': 'Adottato nel 1966 in sostituzione dello scellino dell\'Africa orientale dopo la nascita della Tanzania, lo scellino tanzaniano è la valuta della Tanzania.',
      'UGX': 'Introdotto nel 1966 in sostituzione dello scellino dell\'Africa orientale dopo l\'indipendenza dell\'Uganda, lo scellino ugandese è la valuta dell\'Uganda.',
      'RWF': 'Istituito nel 1964 in sostituzione del franco del Ruanda-Burundi, il franco ruandese è la valuta ufficiale del Ruanda.',
      'BIF': 'Creato nel 1964 in sostituzione del franco del Ruanda-Burundi, il franco burundese è la valuta del Burundi.',
      'DJF': 'Introdotto nel 1949 per il territorio della Costa francese dei Somali e ancorato al dollaro statunitense, il franco gibutiano è la valuta di Gibuti.',
      'ERN': 'Istituito nel 1997 in sostituzione del birr etiope dopo l\'indipendenza dell\'Eritrea, il nakfa eritreo prende il nome dalla città di Nakfa, simbolo della guerra d\'indipendenza.',
      'SOS': 'Introdotto nel 1962 in sostituzione dello scellino dell\'Africa orientale italiana/britannica, lo scellino somalo è la valuta nominale della Somalia.',
      'SSP': 'Entrato in circolazione nel 2011 dopo l\'indipendenza del Sudan del Sud in sostituzione della sterlina sudanese, la sterlina sudsudanese è la valuta più giovane tra le grandi valute nazionali.',
      'SDG': 'Introdotta nel 2007 in sostituzione del dinaro sudanese (e riformata nel 2021), la sterlina sudanese riprende una denominazione storica già in uso nel Sudan prima del 1992.',
      'BOB': 'Reintrodotto nel 1987 in sostituzione del peso boliviano per porre fine a una gravissima iperinflazione, il boliviano riprende il nome della valuta già esistita tra Ottocento e Novecento.',
      'PYG': 'Istituito nel 1943 in sostituzione del peso paraguaiano, il guaraní prende il nome dal popolo indigeno guaraní ed è una delle valute più antiche ancora in uso nell\'America meridionale.',
      'CRC': 'Adottato nel 1896 in sostituzione del peso costaricano, il colón costaricano è intitolato a Cristoforo Colombo (*Cristóbal Colón*).',
      'DOP': 'Introdotto nel 1947 in sostituzione del peso oro dominicano e del dollaro statunitense, il peso dominicano è la valuta della Repubblica Dominicana.',
      'GTQ': 'Istituito nel 1924-1925 in sostituzione del peso guatemalteco, il quetzal prende il nome dall\'omonimo uccello sacro della cultura maya e simboleggia la libertà.',
      'HNL': 'Adottata nel 1931 in sostituzione del peso honduregno, la lempira prende il nome da Lempira, capo indigeno lenca del XVI secolo che resistette alla conquista spagnola.',
      'NIO': 'Introdotta nel 1912 e riformata nel 1988 e nel 1991 per superare l\'iperinflazione degli anni Ottanta, la córdoba nicaraguense è intitolata a Francisco Hernández de Córdoba, fondatore di Granada e León.',
      'CUP': 'Introdotto nel 1914-1915 con la legge monetaria cubana, il peso cubano è la valuta nazionale di Cuba.',
      'HTG': 'Istituita nel 1813 in sostituzione della lira haitiana, la gourde prende il nome dalle antiche monete d\'argento ("gordas") circolanti nei Caraibi.',
      'JMD': 'Introdotto nel 1969 in sostituzione della sterlina giamaicana con l\'adozione del sistema decimale, il dollaro giamaicano è la valuta della Giamaica.',
      'TTD': 'Istituito nel 1964 per Trinidad e Tobago in sostituzione del dollaro delle Indie occidentali britanniche, il dollaro di Trinidad e Tobago è la valuta del Paese.',
      'BBD': 'Introdotto nel 1973 in sostituzione del dollaro dei Caraibi orientali e ancorato al dollaro statunitense, il dollaro delle Barbados è la valuta di Barbados.',
      'BSD': 'Adottato nel 1966 in sostituzione della sterlina delle Bahamas con parità fissa 1:1 rispetto al dollaro USA, il dollaro delle Bahamas è la valuta delle Bahamas.',
      'BZD': 'Istituito nel 1973 in sostituzione del dollaro dell\'Honduras britannico e ancorato al dollaro USA, il dollaro del Belize è la valuta del Belize.',
      'GYD': 'Introdotto nel 1966 in sostituzione del dollaro della Guyana britannica, il dollaro della Guyana è la valuta della Guyana.',
      'SRD': 'Adottato nel 2004 in sostituzione del fiorino del Suriname, il dollaro del Suriname è la valuta del Suriname.',
      'XCD': 'Emesso a partire dal 1965-1983 dalla Eastern Caribbean Central Bank e ancorato al dollaro USA, il dollaro dei Caraibi orientali è la valuta comune di otto Paesi e territori insulari dei Caraibi.',
      'FJD': 'Introdotto nel 1969 in sostituzione della sterlina figiana con il passaggio al sistema decimale, il dollaro delle Figi è la valuta delle Figi.',
      'PGK': 'Istituita nel 1975 in sostituzione del dollaro australiano in concomitanza con l\'indipendenza della Papua Nuova Guinea, la kina prende il nome dalle conchiglie usate tradizionalmente come mezzo di scambio e status symbol.',
      'SBD': 'Introdotto nel 1977 in sostituzione del dollaro australiano, il dollaro delle Isole Salomone è la valuta delle Isole Salomone.',
      'WST': 'Introdotto nel 1967 in sostituzione della sterlina samoana occidentale, il tala prende il nome dalla parola samoana per "dollaro".',
      'TOP': 'Adottato nel 1967 in sostituzione della sterlina tongana, il paʻanga è la valuta ufficiale del Regno di Tonga.',
      'VUV': 'Introdotto nel 1981-1982 dopo l\'indipendenza delle Nuove Ebridi (divenute Vanuatu) in sostituzione del franco delle Nuove Ebridi, il vatu prende il nome dalla parola bislama per "pietra" o "valore".'
    };

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

      // 1. Mappa ID se presente
      if (typeof MAP_NAME_TO_ID !== 'undefined' && MAP_NAME_TO_ID[normMapName]) {
        const targetId = normalizeText(MAP_NAME_TO_ID[normMapName]);
        const byId = nationsData.find(n => normalizeText(n.id) === targetId);
        if (byId) return byId;
      }

      // 2. Alias italiani/inglesi più comuni
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

      // 3. Corrispondenza diretta su nome, ufficiale o id
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
function switchAppMode(mode, triggerBtn) {
  document.querySelectorAll('.mode-switch-btn').forEach(btn => btn.classList.remove('active'));
  if (triggerBtn) triggerBtn.classList.add('active');

  document.getElementById('nationDetailView').style.display = 'none';
  document.getElementById('homeNationView').style.display = 'block';

  if (mode === 'currency') {
    document.getElementById('continentsBar').style.display = 'none';
    document.getElementById('americasSubbar').classList.remove('show');
    document.getElementById('explorerToolbar').style.display = 'none';
    document.getElementById('introExplorerBox').style.display = 'none';
    document.getElementById('nationsGrid').style.display = 'none';
    document.getElementById('antarcticaBox').style.display = 'none';
    document.getElementById('currenciesScreen').style.display = 'block';

    if (!currenciesMapInitialized) {
      initCurrenciesWorldMap();
    }
  } else {
    document.getElementById('continentsBar').style.display = 'flex';
    document.getElementById('explorerToolbar').style.display = '';
    document.getElementById('currenciesScreen').style.display = 'none';
    showIntroHome(document.querySelector('#continentsBar .continent-btn'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showIntroHome(document.querySelector('#continentsBar .continent-btn'));
});
