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

  