let epocaAttivaId = 'grid-antica';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initPathwaySwitcher();
  initSmartBackNavigation();
});

function saveActiveViewState(viewId) {
  try {
    if (viewId) {
      sessionStorage.setItem('chronos_active_view', viewId);
    }
  } catch (_) {}
}

function syncContentViews() {
  const viewProgramma = document.getElementById('viewProgramma');
  const viewMegaAree = document.getElementById('viewMegaAree');
  const viewAtlante = document.getElementById('viewAtlante');

  if (viewProgramma) {
    const isProgActive = viewProgramma.classList.contains('active');
    viewProgramma.classList.toggle('hidden', !isProgActive);
  }

  if (viewMegaAree) {
    const isMegaActive = viewMegaAree.classList.contains('active');
    viewMegaAree.classList.toggle('hidden', !isMegaActive);
  }

  if (viewAtlante) {
    const isAtlanteActive = viewAtlante.classList.contains('active');
    viewAtlante.classList.toggle('hidden', !isAtlanteActive);
  }
}

function exitMegaAreaFocusMode() {
  const hero = document.getElementById('hero');
  if (hero) hero.style.display = '';

  const backBtn = document.getElementById('headerMegaBackBtn');
  if (backBtn) backBtn.style.display = 'none';

  document.querySelectorAll('.view-screen').forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('flex');
  });
}

function returnToMegaAreeHub() {
  exitMegaAreaFocusMode();
  const btnMegaAree = document.getElementById('btnMegaAree');
  if (btnMegaAree) btnMegaAree.click();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function enterMegaAreaFocusMode() {
  const hero = document.getElementById('hero');
  if (hero) hero.style.display = 'none';

  const headerContainer = document.querySelector('.main-header .header-container');
  if (!headerContainer) return;

  let backBtn = document.getElementById('headerMegaBackBtn');
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'headerMegaBackBtn';
    backBtn.type = 'button';
    backBtn.innerHTML = '← Torna alle Mega Aree';
    backBtn.style.cssText = 'background: rgba(212, 175, 55, 0.14); border: 1px solid rgba(212, 175, 55, 0.5); color: #f3e5ab; padding: 7px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; margin-left: auto; margin-right: 12px; transition: all 0.2s;';
    backBtn.addEventListener('click', returnToMegaAreeHub);

    const desktopNav = headerContainer.querySelector('.desktop-nav');
    if (desktopNav) {
      headerContainer.insertBefore(backBtn, desktopNav);
    } else {
      headerContainer.appendChild(backBtn);
    }
  }
  backBtn.style.display = 'inline-flex';
}

function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeDrawerBtn = document.getElementById('closeDrawer');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => mobileDrawer.classList.add('open'));
  }
  if (closeDrawerBtn && mobileDrawer) {
    closeDrawerBtn.addEventListener('click', () => mobileDrawer.classList.remove('open'));
  }
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => mobileDrawer.classList.remove('open'));
  });
}

function initPathwaySwitcher() {
  const btnMegaAree = document.getElementById('btnMegaAree');
  const btnProgramma = document.getElementById('btnProgramma');
  const viewMegaAree = document.getElementById('viewMegaAree');
  const viewProgramma = document.getElementById('viewProgramma');
  const navMappe = document.getElementById('navMappeStoriche');
  const mobileNavMappe = document.getElementById('mobileNavMappeStoriche');

  function updateMappeNavVisibility() {
    if (!viewProgramma) return;
    const isProgrammaActive = viewProgramma.classList.contains('active');
    if (navMappe) navMappe.style.display = isProgrammaActive ? '' : 'none';
    if (mobileNavMappe) mobileNavMappe.style.display = isProgrammaActive ? '' : 'none';
  }

  function activateMegaAree() {
    if (!btnMegaAree || !btnProgramma || !viewMegaAree || !viewProgramma) return;
    const btnAtlante = document.getElementById('btnAtlante');
    const viewAtlante = document.getElementById('viewAtlante');

    exitMegaAreaFocusMode();

    try {
      sessionStorage.removeItem('chronos_return_epoca');
      sessionStorage.setItem('chronos_active_view', 'viewMegaAree');
    } catch (_) {}

    btnMegaAree.classList.add('active');
    btnProgramma.classList.remove('active');
    if (btnAtlante) btnAtlante.classList.remove('active');

    viewProgramma.classList.remove('active');
    viewProgramma.classList.add('hidden');
    if (viewAtlante) {
      viewAtlante.classList.remove('active');
      viewAtlante.classList.add('hidden');
    }

    viewMegaAree.classList.remove('hidden');
    viewMegaAree.classList.add('active');

    updateMappeNavVisibility();
    syncContentViews();
  }

  function activateProgramma() {
    if (!btnMegaAree || !btnProgramma || !viewMegaAree || !viewProgramma) return;
    const btnAtlante = document.getElementById('btnAtlante');
    const viewAtlante = document.getElementById('viewAtlante');

    exitMegaAreaFocusMode();

    try {
      sessionStorage.setItem('chronos_active_view', 'viewProgramma');
    } catch (_) {}

    btnProgramma.classList.add('active');
    btnMegaAree.classList.remove('active');
    if (btnAtlante) btnAtlante.classList.remove('active');

    viewMegaAree.classList.remove('active');
    viewMegaAree.classList.add('hidden');
    if (viewAtlante) {
      viewAtlante.classList.remove('active');
      viewAtlante.classList.add('hidden');
    }

    viewProgramma.classList.remove('hidden');
    viewProgramma.classList.add('active');

    updateMappeNavVisibility();
    syncContentViews();
  }

  updateMappeNavVisibility();
  syncContentViews();

  if (btnMegaAree) {
    btnMegaAree.addEventListener('click', (e) => {
      e.preventDefault();
      activateMegaAree();
      setTimeout(activateMegaAree, 120);
    });
  }

  if (btnProgramma) {
    btnProgramma.addEventListener('click', (e) => {
      e.preventDefault();
      activateProgramma();
    });
  }
}

// === NAVIGAZIONE DI RITORNO INTELLIGENTE PER EPOCA ===
function detectEraFromLessonContext() {
  const params = new URLSearchParams(window.location.search);
  const queryEpoca = params.get('epoca');
  if (queryEpoca && ['antica', 'medievale', 'moderna', 'contemporanea'].includes(queryEpoca)) {
    return queryEpoca;
  }

  const pane = document.querySelector('.lezione-content-pane');
  const rawId = pane?.id || window.location.pathname || '';
  const match = rawId.match(/lez-(\d+)-(\d+)/) || rawId.match(/(\d+)\.(\d+)/);

  if (match) {
    const macroNum = match[1];
    if (macroNum === '1') return 'antica';
    if (macroNum === '2') return 'medievale';
    if (macroNum === '3') return 'moderna';
    if (macroNum === '4') return 'contemporanea';
  }

  const badgeText = (pane?.querySelector('.badge-gold')?.textContent || '').toLowerCase();
  if (badgeText.includes('medievale')) return 'medievale';
  if (badgeText.includes('moderna')) return 'moderna';
  if (badgeText.includes('contemporanea')) return 'contemporanea';
  if (badgeText.includes('antica')) return 'antica';

  try {
    const saved = sessionStorage.getItem('chronos_return_epoca');
    if (saved && ['antica', 'medievale', 'moderna', 'contemporanea'].includes(saved)) {
      return saved;
    }
  } catch (_) {}

  return 'antica';
}

function initSmartBackNavigation() {
  const isInLessonPage = window.location.pathname.includes('/lezioni/') || Boolean(document.querySelector('.lezione-content-pane'));
  if (!isInLessonPage) return;

  const targetEpoca = detectEraFromLessonContext();
  const activeLessonPane = document.querySelector('.lezione-content-pane');
  if (activeLessonPane) {
    activeLessonPane.style.display = 'block';
  }
  const returnHref = `../index.html?epoca=${targetEpoca}#percorsi`;

  try {
    sessionStorage.setItem('chronos_return_epoca', targetEpoca);
    sessionStorage.setItem('chronos_active_view', 'viewProgramma');
  } catch (_) {}

  const backElements = document.querySelectorAll('.back-to-grid-btn, a[href*="index.html"]');
  backElements.forEach(el => {
    if (el.classList.contains('brand-logo')) return;

    if (el.tagName === 'A') {
      el.setAttribute('href', returnHref);
    } else if (el.tagName === 'BUTTON') {
      el.setAttribute('onclick', '');
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = returnHref;
      });
    }
  });
}

const quizDatabase = {
  'q1-1': { correctOpt: 'B', explanation: 'Con la stanzialità l\'uomo fonda i primi villaggi stabili per curare i campi e gli allevamenti.' },
  'q1-2': { correctOpt: 'B', explanation: 'Mesopotamia in greco significa proprio "terra tra due fiumi" (Tigri ed Eufrate).' },
  'q1-3': { correctOpt: 'B', explanation: 'La scrittura nacque per esigenze pratiche di contabilità delle merci e dei tributi nei magazzini.' },
  'q1-4': { correctOpt: 'B', explanation: 'La Ziggurat era il centro religioso ed economico/amministrativo della città sumera.' },

  'q1-2-1': { correctOpt: 'B', explanation: 'Il limo rilasciato dalle piene annuali del Nilo rendeva il terreno arido estremamente fertile.' },
  'q1-2-2': { correctOpt: 'C', explanation: 'Il Faraone deteneva il potere assoluto ed era considerato un sovrano divinizzato.' },
  'q1-2-3': { correctOpt: 'B', explanation: 'La mummificazione serviva a preservare il corpo intatto per permettere all\'anima (Ka) di vivere nell\'Aldilà.' },
  'q1-2-4': { correctOpt: 'B', explanation: 'La scrittura geroglifica era un sistema basato su simboli e segni sacri.' },

  'q1-3-1': { correctOpt: 'C', explanation: 'Il territorio stretto e montuoso spinse i Fenici a sfruttare il legname di cedro per costruire navi e dedicarsi al mare.' },
  'q1-3-2': { correctOpt: 'A', explanation: 'L\'alfabeto fenicio rivoluzionò la scrittura usando solo 22 segni associati ai singoli suoni.' },
  'q1-3-3': { correctOpt: 'D', explanation: 'Gli Ebrei furono il primo grande popolo a praticare stabilmente il monoteismo (fede in un unico Dio).' },
  'q1-3-4': { correctOpt: 'B', explanation: 'La Diaspora indica la storica dispersione del popolo ebraico nel mondo dopo la distruzione del Tempio.' },

  'q1-4-1': { correctOpt: 'C', explanation: 'La talassocrazia è il dominio politico e commerciale esercitato sul mare tramite le navi.' },
  'q1-4-2': { correctOpt: 'A', explanation: 'Le città micenee erano roccaforti difese da imponenti mura fatte di enormi blocchi di pietra ("ciclopiche").' },
  'q1-4-3': { correctOpt: 'D', explanation: 'L\'Agorà era la piazza pubblica al centro del mercato e del dibattito politico tra cittadini.' },
  'q1-4-4': { correctOpt: 'B', explanation: 'Attorno all\'VIII secolo a.C. la nascita della Polis segna la fine del Medioevo Ellenico e l\'inizio dell\'età arcaica e classica.' },

  'q1-5-1': { correctOpt: 'C', explanation: 'L\'Agogé era il sistema educativo spartano volto alla formazione militare dei giovani spartiati.' },
  'q1-5-2': { correctOpt: 'A', explanation: 'Oligarchia deriva dal greco oligoi ("pochi") e archein ("comandare"): il governo di pochi.' },
  'q1-5-3': { correctOpt: 'D', explanation: 'L\'ostracismo permetteva all\'Ecclesìa di allontanare temporaneamente per 10 anni un cittadino ritenuto una minaccia tirannica.' },
  'q1-5-4': { correctOpt: 'B', explanation: 'Donne, schiavi e meteci (stranieri residenti) erano del tutto privi di diritti politici ad Atene.' },

  'q1-6-1': { correctOpt: 'C', explanation: 'Milziade guidò brillantemente le truppe ateniesi alla vittoria nella piana di Maratona nel 490 a.C.' },
  'q1-6-2': { correctOpt: 'A', explanation: 'Temistocle sfruttò la conformazione dello stretto di Salamina per neutralizzare la superiorità numerica delle navi persiane.' },
  'q1-6-3': { correctOpt: 'D', explanation: 'Il misthos (compenso giornaliero) introdotto da Pericle permise anche ai cittadini meno abbienti di partecipare attivamente alle cariche pubbliche.' },
  'q1-6-4': { correctOpt: 'B', explanation: 'La vittoria spartana segnò la fine dell\'egemonia ateniese, lasciando però l\'intera Grecia politicamente ed economicamente indebolita.' },

  'q1-7-1': { correctOpt: 'D', explanation: 'Le sarisse erano lunghissime lance utilizzate dalla falange macedone.' },
  'q1-7-2': { correctOpt: 'A', explanation: 'Alessandro Magno promosse l\'incontro tra la cultura greca e le tradizioni orientali, favorendo anche i matrimoni misti.' },
  'q1-7-3': { correctOpt: 'B', explanation: 'La Koinè era il greco comune che divenne la lingua franca del commercio e della cultura nel Mediterraneo.' },
  'q1-7-4': { correctOpt: 'C', explanation: 'Alessandria d\'Egitto fu un grande centro culturale e scientifico dell\'Ellenismo, celebre per la Biblioteca e il Faro.' },

  'q1-8-1': { correctOpt: 'C', explanation: 'L\'Isola Tiberina e la via del sale resero la posizione di Roma strategica per i traffici commerciali.' },
  'q1-8-2': { correctOpt: 'A', explanation: 'I patrizi detenevano il potere politico e religioso, mentre i plebei ne erano inizialmente esclusi.' },
  'q1-8-3': { correctOpt: 'D', explanation: 'La Cloaca Maxima fu il grande sistema fognario realizzato in età etrusca per il drenaggio delle aree paludose.' },
  'q1-8-4': { correctOpt: 'B', explanation: 'La rivolta contro Tarquinio il Superbo nel 509 a.C. determinò la fine della monarchia e la nascita della Repubblica.' },

  'q1-9-1': { correctOpt: 'C', explanation: 'I due consoli duravano in carica in genere un anno e godevano del potere di veto reciproco.' },
  'q1-9-2': { correctOpt: 'A', explanation: 'La secessione sull\'Aventino fu la protesta collettiva con cui i plebei ottennero i propri rappresentanti.' },
  'q1-9-3': { correctOpt: 'D', explanation: 'Le Leggi delle XII Tavole rappresentarono la prima codificazione scritta pubblica delle norme.' },
  'q1-9-4': { correctOpt: 'B', explanation: 'La vittoria di Pirro indica un successo pagato a un prezzo così alto di perdite da risultare quasi una sconfitta.' },

  'q1-10-1': { correctOpt: 'B', explanation: 'I corvi erano ponti d\'abbordaggio che agganciavano le navi nemiche consentendo il combattimento corpo a corpo.' },
  'q1-10-2': { correctOpt: 'B', explanation: 'Annibale attraversò le Alpi portando soldati ed elefanti sul suolo italico.' },
  'q1-10-3': { correctOpt: 'B', explanation: 'Scipione l\'Africano sconfisse Annibale nella piana di Zama nel 202 a.C., ponendo fine alla Seconda Guerra Punica.' },
  'q1-10-4': { correctOpt: 'B', explanation: 'Con Mare Nostrum i Romani indicavano il loro dominio geopolitico e commerciale sul Mediterraneo.' },

  'q1-11-1': { correctOpt: 'B', explanation: 'I Gracchi cercarono di contrastare la crisi dei piccoli contadini causata dall\'espansione dei latifondi.' },
  'q1-11-2': { correctOpt: 'B', explanation: 'La riforma di Mario rese l\'esercito professionale, legando più strettamente i soldati al proprio generale.' },
  'q1-11-3': { correctOpt: 'B', explanation: 'Il passaggio del Rubicone nel 49 a.C. segnò l\'inizio della guerra civile contro Pompeo.' },
  'q1-11-4': { correctOpt: 'B', explanation: 'Le Idi di Marzo del 44 a.C. videro l\'assassinio di Cesare in Senato per mano dei congiurati guidati da Bruto e Cassio.' },

  'q1-12-1': { correctOpt: 'B', explanation: 'La vittoria navale ad Azio nel 31 a.C. decretò la sconfitta di Marco Antonio e Cleopatra e la fine delle guerre civili.' },
  'q1-12-2': { correctOpt: 'B', explanation: 'Augusto mantenne formalmente le istituzioni repubblicane, ma accentrò il potere militare e politico su di sé.' },
  'q1-12-3': { correctOpt: 'B', explanation: 'La Guardia Pretoriana era il corpo militare d\'élite istituito per la protezione dell\'Imperatore.' },
  'q1-12-4': { correctOpt: 'B', explanation: 'La disfatta di Teutoburgo spinse Augusto a consolidare il confine settentrionale lungo il fiume Reno.' },

  'q1-13-1': { correctOpt: 'B', explanation: 'Il rifiuto del culto dell\'Imperatore venne interpretato dalle autorità romane come un atto di slealtà politica.' },
  'q1-13-2': { correctOpt: 'B', explanation: 'San Paolo fu decisivo per la diffusione del messaggio cristiano tra i non ebrei e la nascita di comunità nel Mediterraneo.' },
  'q1-13-3': { correctOpt: 'B', explanation: 'L\'Editto di Milano del 313 d.C. sancì la tolleranza religiosa e la libertà di culto anche per i cristiani.' },
  'q1-13-4': { correctOpt: 'B', explanation: 'L\'Editto di Tessalonica del 380 d.C. rese il Cristianesimo niceno la religione ufficiale dell\'Impero Romano.' },

  'q1-14-1': { correctOpt: 'B', explanation: 'La fine delle grandi conquiste e l\'instabilità politica dell\'anarchia militare misero in crisi l\'Impero.' },
  'q1-14-2': { correctOpt: 'A', explanation: 'La Tetrarchia prevedeva la suddivisione del governo tra 2 Augusti e 2 Cesari per difendere meglio i confini.' },
  'q1-14-3': { correctOpt: 'A', explanation: 'Nel 330 d.C. Costantino inaugurò la nuova capitale imperiale a Costantinopoli (antica Bisanzio).' },
  'q1-14-4': { correctOpt: 'B', explanation: 'L\'Editto di Milano del 313 d.C. riconobbe la libertà di culto nell\'Impero.' },

  'q1-15-1': { correctOpt: 'B', explanation: 'La divisione del 395 d.C. nacque dall\'esigenza di amministrare e difendere un territorio imperiale vastissimo.' },
  'q1-15-2': { correctOpt: 'B', explanation: 'Gli spostamenti e le incursioni degli Unni spinsero diverse popolazioni germaniche a premere sui confini imperiali.' },
  'q1-15-3': { correctOpt: 'B', explanation: 'La deposizione di Romolo Augustolo da parte di Odoacre nel 476 d.C. segna convenzionalmente la fine dell\'Impero Romano d\'Occidente.' },
  'q1-15-4': { correctOpt: 'B', explanation: 'I regni romano-barbarici nacquero dalla convivenza tra istituzioni e popolazione latina e aristocrazie militari germaniche.' }
};

function checkAnswer(btnElement, isCorrect, itemId, selectedOpt, lezioneNum) {
  const itemContainer = document.getElementById(itemId) || btnElement.closest('div[id]') || btnElement.parentElement.parentElement;
  const feedbackBox = document.getElementById('feedback-' + itemId) || (itemContainer ? itemContainer.querySelector('.quiz-feedback') : null);
  const allBtns = itemContainer ? itemContainer.querySelectorAll('.quiz-opt-btn') : [];

  let detectedCorrectBtn = null;
  let detectedCorrectOpt = null;
  let detectedCorrectText = '';

  allBtns.forEach((btn, idx) => {
    const onclickAttr = btn.getAttribute('onclick') || '';
    if (/checkAnswer\s*\(\s*this\s*,\s*true\b/.test(onclickAttr)) {
      detectedCorrectBtn = btn;
      const letterMatch = onclickAttr.match(/['"]([A-D])['"]/);
      detectedCorrectOpt = letterMatch ? letterMatch[1] : String.fromCharCode(65 + idx);
      detectedCorrectText = btn.textContent.trim();
    }
  });

  const dbEntry = quizDatabase[itemId];
  const finalCorrectOpt = detectedCorrectOpt || (dbEntry && dbEntry.correctOpt) || '';
  const explanationHtml = (dbEntry && dbEntry.explanation)
    ? `<br><em>Spiegazione:</em> ${dbEntry.explanation}`
    : '';

  allBtns.forEach(btn => {
    btn.style.pointerEvents = 'none';
  });

  if (feedbackBox) {
    feedbackBox.style.display = 'block';

    if (isCorrect) {
      btnElement.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
      btnElement.style.borderColor = '#22c55e';
      feedbackBox.className = 'quiz-feedback correct';
      feedbackBox.innerHTML = `<strong>CORRETTO! 🎉</strong>${explanationHtml}`;
    } else {
      btnElement.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
      btnElement.style.borderColor = '#ef4444';
      if (detectedCorrectBtn) {
        detectedCorrectBtn.style.backgroundColor = 'rgba(34, 197, 94, 0.25)';
        detectedCorrectBtn.style.borderColor = '#22c55e';
      }
      feedbackBox.className = 'quiz-feedback wrong';

      let correctLabel = '';
      if (detectedCorrectText) {
        correctLabel = `<strong>Risposta corretta:</strong> ${detectedCorrectText}`;
      } else if (finalCorrectOpt) {
        correctLabel = `<strong>Risposta corretta:</strong> opzione ${finalCorrectOpt}`;
      }

      feedbackBox.innerHTML = `<strong>SBAGLIATO! ❌</strong>${correctLabel ? `<br>${correctLabel}` : ''}${explanationHtml}`;
    }
  }

  const resetBtnId = lezioneNum === '1.1' ? 'reset-quiz-1' : 'reset-quiz-' + String(lezioneNum || '').replace('.', '-');
  const quizBox = itemContainer ? (itemContainer.closest('.lezione-section-box') || itemContainer.parentElement) : null;
  const resetBtn = document.getElementById(resetBtnId) || (quizBox ? quizBox.querySelector('button[onclick*="resetQuiz"]') : null);
  if (resetBtn) resetBtn.style.display = 'inline-block';
}

function resetQuiz(containerId, lezioneNum, btnElement) {
  let container = document.getElementById(containerId);
  if (!container && btnElement) {
    container = btnElement.closest('.lezione-section-box') || btnElement.parentElement;
  }
  if (!container && typeof event !== 'undefined' && event && event.target) {
    container = event.target.closest('.lezione-section-box') || event.target.parentElement;
  }
  if (!container) return;

  const allBtns = container.querySelectorAll('.quiz-opt-btn');
  const allFeedbacks = container.querySelectorAll('.quiz-feedback');

  allBtns.forEach(btn => {
    btn.style.pointerEvents = 'auto';
    btn.style.backgroundColor = '';
    btn.style.borderColor = '';
  });

  allFeedbacks.forEach(fb => {
    fb.style.display = 'none';
    fb.className = 'quiz-feedback';
    fb.innerHTML = '';
  });

  const resetBtnId = lezioneNum === '1.1' ? 'reset-quiz-1' : 'reset-quiz-' + String(lezioneNum || '').replace('.', '-');
  const resetBtn = document.getElementById(resetBtnId) || container.querySelector('button[onclick*="resetQuiz"]');
  if (resetBtn) resetBtn.style.display = 'none';
}
function switchEpoca(epoca, btn) {
  if (!['antica', 'medievale', 'moderna', 'contemporanea'].includes(epoca)) {
    epoca = 'antica';
  }
  epocaAttivaId = 'grid-' + epoca;

  exitMegaAreaFocusMode();

  try {
    sessionStorage.setItem('chronos_return_epoca', epoca);
    sessionStorage.setItem('chronos_active_view', 'viewProgramma');
  } catch (_) {}

  document.querySelectorAll('.tab-btn').forEach(b => {
    const isMatch = b === btn || (b.getAttribute('onclick') || '').includes(`switchEpoca('${epoca}'`);
    b.classList.toggle('active', isMatch);
  });

  const viewProgramma = document.getElementById('viewProgramma');
  const viewMegaAree = document.getElementById('viewMegaAree');
  const viewAtlante = document.getElementById('viewAtlante');
  const btnProgramma = document.getElementById('btnProgramma');
  const btnMegaAree = document.getElementById('btnMegaAree');
  const btnAtlante = document.getElementById('btnAtlante');

  if (viewProgramma) viewProgramma.classList.add('active');
  if (viewMegaAree) viewMegaAree.classList.remove('active');
  if (viewAtlante) viewAtlante.classList.remove('active');
  if (btnProgramma) btnProgramma.classList.add('active');
  if (btnMegaAree) btnMegaAree.classList.remove('active');
  if (btnAtlante) btnAtlante.classList.remove('active');

  const gridContainer = document.getElementById('epocheGridsContainer');
  if (gridContainer) gridContainer.style.display = 'block';

  document.querySelectorAll('.epoche-grid-view').forEach(grid => {
    grid.style.display = grid.id === epocaAttivaId ? 'block' : 'none';
  });

  const isStandaloneLessonPage = window.location.pathname.includes('/lezioni/') || Boolean(document.querySelector('main .lezione-content-pane'));
  if (!isStandaloneLessonPage) {
    document.querySelectorAll('.lezione-content-pane').forEach(pane => {
      pane.style.display = 'none';
    });
  }

  const detailContainer = document.getElementById('lezioneDetailContainer');
  if (detailContainer) detailContainer.style.display = 'none';

  syncContentViews();
}

function openLezioneDetail(lezioneId) {
  const match = String(lezioneId).match(/lez-(\d+)-(\d+)/);
  let epoca = 'antica';
  if (match) {
    if (match[1] === '2') epoca = 'medievale';
    else if (match[1] === '3') epoca = 'moderna';
    else if (match[1] === '4') epoca = 'contemporanea';
  }
  try {
    sessionStorage.setItem('chronos_return_epoca', epoca);
    sessionStorage.setItem('chronos_active_view', 'viewProgramma');
  } catch (_) {}

  window.location.href = `lezioni/${lezioneId}.html?epoca=${epoca}`;
}

function closeLezioneDetail() {
  const detailContainer = document.getElementById('lezioneDetailContainer');
  if (detailContainer) {
    detailContainer.style.display = 'none';
  }

  document.querySelectorAll('.lezione-content-pane').forEach(pane => {
    pane.style.display = 'none';
  });

  const gridContainer = document.getElementById('epocheGridsContainer');
  if (gridContainer) {
    gridContainer.style.display = 'block';
  }

  document.querySelectorAll('.epoche-grid-view').forEach(grid => {
    grid.style.display = grid.id === epocaAttivaId ? 'block' : 'none';
  });
}

const glossaryData = {
  baratto: { title: "🔄 Baratto", text: "Sistema economico primitivo in cui i beni vengono scambiati direttamente con altri beni senza l'ausilio di una moneta intermedia." },
  surplus: { title: "📦 Surplus", text: "La quantità di produzione eccedente rispetto al consumo immediato della comunità." },
  mercantilismo: { title: "⛵ Mercantilismo", text: "Dottrina economica tra il XVI e XVIII secolo basata sull'accumulo di metalli preziosi e dazi." },
  proletariato: { title: "🏭 Proletariato", text: "Classe sociale di lavoratori dipendenti privi di mezzi di produzione propri." },
  inflazione: { title: "📈 Inflazione", text: "Aumento generalizzato e continuato dei prezzi che riduce il potere d'acquisto." }
};

function showGlossary(key, event) {
  const data = glossaryData[key];
  const titleEl = document.getElementById('glossTitle');
  const textEl = document.getElementById('glossText');
  if (titleEl && data) titleEl.innerText = data.title;
  if (textEl && data) textEl.innerText = data.text;

  document.querySelectorAll('.gloss-btn').forEach(btn => {
    btn.classList.remove('bg-goldprimary', 'text-darkbg', 'border-goldprimary');
    btn.classList.add('bg-surface', 'border-bordergold', 'text-textmain');
  });
  if (event && event.currentTarget) {
    event.currentTarget.classList.remove('bg-surface', 'border-bordergold', 'text-textmain');
    event.currentTarget.classList.add('bg-goldprimary', 'text-darkbg', 'border-goldprimary');
  }
}

function toggleDropdown(dropdownId) {
  const activeView = document.querySelector('.view-screen.flex, .view-screen:not(.hidden)');
  const dropdown = activeView ? activeView.querySelector(`[id="${dropdownId}"]`) : document.getElementById(dropdownId);

  if (!dropdown) return;
  const isHidden = dropdown.classList.contains('hidden');
  closeAllDropdowns();
  if (isHidden) {
    dropdown.classList.remove('hidden');
  }
}

function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll('[id^="dropdown-dossier-"], [id^="dropdown-cultura-dossier-"], [id^="dropdown-crisi-dossier-"]');
  dropdowns.forEach(d => d.classList.add('hidden'));
}

['click', 'touchstart'].forEach(function(evento) {
  document.addEventListener(evento, function(e) {
    const isDropdownBtn = e.target.closest('[onclick*="toggleDropdown"]');
    const isDropdownContent = e.target.closest('[id^="dropdown-dossier-"], [id^="dropdown-cultura-dossier-"], [id^="dropdown-crisi-dossier-"]');

    if (!isDropdownBtn && !isDropdownContent) {
      closeAllDropdowns();
    }
  });
});

function showView(viewId) {
  const viewProg = document.getElementById('viewProgramma');
  const viewMega = document.getElementById('viewMegaAree');
  const viewAtl = document.getElementById('viewAtlante');
  if (viewProg) viewProg.classList.remove('active');
  if (viewMega) viewMega.classList.remove('active');
  if (viewAtl) viewAtl.classList.remove('active');

  document.querySelectorAll('.view-screen').forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('flex');
  });

  const target = document.getElementById(viewId);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('flex');
    enterMegaAreaFocusMode();
    saveActiveViewState(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  syncContentViews();
}

function showHome() {
  try {
    sessionStorage.removeItem('chronos_active_view');
    sessionStorage.removeItem('chronos_return_epoca');
  } catch (_) {}
  showView('view-home');
}

// === CHRONOS AI TUTOR ===
const CHRONOS_AI_WORKER_URL = "https://chronos-ai-worker.cerrifrancesco85.workers.dev";
let chronosChatHistory = [];
let isChronosGenerating = false;

function formatChronosMarkdown(text) {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|[^*])\*([^*]+?)\*(?!\*)/g, "$1<em>$2</em>");
  html = html.replace(/^\s*[-*]\s+(.+)$/gm, "• $1");
  html = html.replace(/\n/g, "<br>");

  return html;
}

function getChronosWelcomeHtml() {
  const lessonPane = document.querySelector(".lezione-content-pane");
  if (lessonPane && lessonPane.style.display !== "none") {
    const lessonTitle = lessonPane.querySelector(".hero-title")?.textContent?.trim() || "questa lezione";
    return `Ciao! Sono <strong>Chronos AI</strong>. Ho letto con te <strong>${lessonTitle}</strong>: premi <strong>Spiegamelo meglio</strong> per un chiarimento, <strong>Schema flash</strong> per la sintesi o <strong>Interrogami</strong> per un'interrogazione con voto! <em>(Suggerimento: seleziona qualsiasi parola del testo per chiedermene il significato).</em>`;
  }
  return `Ciao! Sono <strong>Chronos AI</strong>, il tuo tutor storico. Chiedimi qualsiasi chiarimento, schema flash o interrogazione sulle epoche storiche e sulle macroaree!`;
}

function clearChronosChat() {
  if (isChronosGenerating) return;
  chronosChatHistory = [];
  const resetMsg = `<div class="chat-msg ai-msg">Chat azzerata! ${getChronosWelcomeHtml()}</div>`;

  const inlineBody = document.getElementById("chatBody");
  const modalBody = document.getElementById("modalChatBody");
  if (inlineBody) inlineBody.innerHTML = resetMsg;
  if (modalBody) modalBody.innerHTML = resetMsg;
}

function openChronosModal() {
  const modal = document.getElementById("chronosFullModal");
  const inlineBody = document.getElementById("chatBody");
  const modalBody = document.getElementById("modalChatBody");
  const modalContextLabel = document.getElementById("chronosModalContextLabel");

  if (!modal || !modalBody) return;

  if (inlineBody) {
    modalBody.innerHTML = inlineBody.innerHTML;
  }

  const ctx = getChronosPageContext();
  if (modalContextLabel) {
    if (ctx.type === "lesson") {
      modalContextLabel.innerHTML = `Stai studiando: <strong>${ctx.title}</strong>`;
    } else if (ctx.type === "macroarea" || ctx.type === "epoca") {
      modalContextLabel.innerHTML = `Sezione attiva: <strong>${ctx.title}</strong>`;
    } else {
      modalContextLabel.textContent = "Modalità Tutor Estesa • Historia Chronos";
    }
  }

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
  modalBody.scrollTop = modalBody.scrollHeight;
  setTimeout(() => document.getElementById("modalAiChatInput")?.focus(), 80);
}

function closeChronosModal() {
  const modal = document.getElementById("chronosFullModal");
  const inlineBody = document.getElementById("chatBody");
  const modalBody = document.getElementById("modalChatBody");

  if (inlineBody && modalBody) {
    inlineBody.innerHTML = modalBody.innerHTML;
    inlineBody.scrollTop = inlineBody.scrollHeight;
  }

  if (modal) {
    modal.style.display = "none";
  }
  document.body.style.overflow = "";
}

function initChronosFullModal() {
  if (document.getElementById("chronosFullModal")) return;

  const modal = document.createElement("div");
  modal.id = "chronosFullModal";
  modal.style.cssText = "display: none; position: fixed; inset: 0; z-index: 10000; background: rgba(8, 10, 14, 0.86); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 16px;";

  modal.innerHTML = `
    <div style="width: 100%; max-width: 1120px; height: 88vh; background: #161920; border: 1px solid rgba(212, 175, 55, 0.45); border-radius: 18px; box-shadow: 0 24px 60px rgba(0,0,0,0.75); display: flex; flex-direction: column; overflow: hidden;">
      <div style="padding: 16px 22px; background: #111318; border-bottom: 1px solid rgba(212, 175, 55, 0.25); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="tutor-avatar" style="width: 42px; height: 42px; font-size: 1.3rem;">🤖</div>
          <div>
            <h3 style="margin: 0; font-size: 1.15rem; color: #f5f6f8;">Chronos AI <span class="gold-text">Tutor Storico</span></h3>
            <p id="chronosModalContextLabel" style="margin: 2px 0 0; font-size: 0.82rem; color: #a1a8b5;">Modalità Tutor Estesa</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button type="button" onclick="clearChronosChat()" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(212, 175, 55, 0.35); color: #f3e5ab; padding: 7px 13px; border-radius: 8px; font-size: 0.82rem; cursor: pointer;">🗑️ Pulisci</button>
          <button type="button" onclick="closeChronosModal()" style="background: rgba(239, 68, 68, 0.16); border: 1px solid rgba(239, 68, 68, 0.45); color: #fca5a5; padding: 7px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer;">✕ Chiudi</button>
        </div>
      </div>

      <div id="modalChatBody" class="tutor-chat-body" style="flex: 1; max-height: none; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; font-size: 1rem; line-height: 1.65;"></div>

      <div style="padding: 14px 22px 18px; background: #111318; border-top: 1px solid rgba(212, 175, 55, 0.25);">
        <form id="modalAiChatForm" onsubmit="handleChatSubmit(event, true)" style="display: flex; gap: 10px; margin-bottom: 12px;">
          <input type="text" id="modalAiChatInput" maxlength="450" placeholder="Scrivi qui la tua domanda di storia, rispondi all'interrogazione o chiedi un approfondimento..." style="flex: 1; background: #181b23; border: 1px solid rgba(212, 175, 55, 0.4); color: #f5f6f8; padding: 13px 16px; border-radius: 10px; font-size: 0.98rem; outline: none;" required />
          <button type="submit" id="modalAiSendBtn" style="background: #d4af37; color: #121418; font-weight: 700; border: none; padding: 0 24px; border-radius: 10px; font-size: 0.95rem; cursor: pointer;">Invia ➤</button>
        </form>
        <div class="tutor-quick-actions" style="margin-top: 0;">
          <button type="button" class="quick-btn" onclick="triggerSmartAction('explain', true)">💡 Spiegamelo meglio</button>
          <button type="button" class="quick-btn" onclick="triggerSmartAction('schema', true)">🗺️ Schema flash</button>
          <button type="button" class="quick-btn" onclick="triggerSmartAction('quiz', true)">📝 Interrogami</button>
        </div>
      </div>
    </div>
  `;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeChronosModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") closeChronosModal();
  });

  document.body.appendChild(modal);

  document.querySelectorAll('a[href="#ai-tutor"]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("mobileDrawer")?.classList.remove("open");
      openChronosModal();
    });
  });

  const existingHeader = document.querySelector("#ai-tutor .tutor-header");
  if (existingHeader && !existingHeader.querySelector("[onclick='openChronosModal()']")) {
    const btnGroup = existingHeader.querySelector("div:last-child");
    const expandBtn = document.createElement("button");
    expandBtn.type = "button";
    expandBtn.setAttribute("onclick", "openChronosModal()");
    expandBtn.title = "Apri a schermo intero";
    expandBtn.style.cssText = "background: rgba(212, 175, 55, 0.14); border: 1px solid rgba(212, 175, 55, 0.45); color: #f3e5ab; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; margin-right: 6px;";
    expandBtn.textContent = "⛶ Espandi";

    if (btnGroup && btnGroup.tagName === "BUTTON") {
      btnGroup.parentNode.insertBefore(expandBtn, btnGroup);
    } else {
      existingHeader.appendChild(expandBtn);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const lessonPane = document.querySelector(".lezione-content-pane");
  if (lessonPane && !document.getElementById("ai-tutor")) {
    const lessonTitle = lessonPane.querySelector(".hero-title")?.textContent?.trim() || "questa lezione";
    const tutorSection = document.createElement("section");
    tutorSection.className = "ai-tutor-section";
    tutorSection.id = "ai-tutor";
    tutorSection.style.marginTop = "40px";
    tutorSection.innerHTML = `
      <div class="tutor-card">
        <div class="tutor-header" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="tutor-avatar">🤖</div>
            <div>
              <h3>Chronos AI <span class="gold-text">Tutor Storico</span></h3>
              <p>Hai dubbi su <strong>${lessonTitle}</strong>? Chiedi pure o mettiti alla prova!</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button type="button" onclick="openChronosModal()" title="Apri a schermo intero" style="background: rgba(212, 175, 55, 0.14); border: 1px solid rgba(212, 175, 55, 0.45); color: #f3e5ab; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer;">⛶ Espandi</button>
            <button type="button" onclick="clearChronosChat()" title="Inizia una nuova conversazione" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(212, 175, 55, 0.35); color: #f3e5ab; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer;">🗑️ Pulisci</button>
          </div>
        </div>
        <div class="tutor-chat-body" id="chatBody">
          <div class="chat-msg ai-msg">${getChronosWelcomeHtml()}</div>
        </div>
        <form id="aiChatForm" onsubmit="handleChatSubmit(event, false)" style="display: flex; gap: 10px; margin-top: 14px; margin-bottom: 12px;">
          <input type="text" id="aiChatInput" maxlength="450" placeholder="Fai una domanda su questa lezione o scrivi 'interrogami'..." style="flex: 1; background: #121418; border: 1px solid rgba(212, 175, 55, 0.35); color: #f5f6f8; padding: 12px 16px; border-radius: 10px; font-size: 0.95rem; outline: none;" required />
          <button type="submit" id="aiSendBtn" style="background: #d4af37; color: #121418; font-weight: 700; border: none; padding: 0 20px; border-radius: 10px; cursor: pointer; transition: opacity 0.2s;">Invia ➤</button>
        </form>
        <div class="tutor-quick-actions">
          <button type="button" class="quick-btn" onclick="triggerSmartAction('explain', false)">💡 Spiegamelo meglio</button>
          <button type="button" class="quick-btn" onclick="triggerSmartAction('schema', false)">🗺️ Schema flash</button>
          <button type="button" class="quick-btn" onclick="triggerSmartAction('quiz', false)">📝 Interrogami</button>
        </div>
      </div>
    `;
    lessonPane.appendChild(tutorSection);
  }

  initChronosFullModal();
  initSelectionGlossaryPopup();

  // Apertura automatica epoca o lezione da query string, oppure ripristino vista salvata al refresh
  const params = new URLSearchParams(window.location.search);
  const lezioneParam = params.get("lezione");
  const epocaParam = params.get("epoca");

  if (lezioneParam) {
    const lezId = "lez-" + lezioneParam.replace(/\./g, "-");
    setTimeout(() => {
      if (typeof openLezioneDetail === "function") {
        openLezioneDetail(lezId);
      } else {
        const card = document.querySelector(`[onclick*="openLezioneDetail('${lezId}')"]`);
        if (card) card.click();
      }
    }, 100);
  } else if (epocaParam && ['antica', 'medievale', 'moderna', 'contemporanea'].includes(epocaParam)) {
    setTimeout(() => {
      switchEpoca(epocaParam);
    }, 100);
  } else if (!window.location.pathname.includes('/lezioni/') && !document.querySelector('.lezione-content-pane')) {
    try {
      const savedView = sessionStorage.getItem('chronos_active_view');
      const savedEpoca = sessionStorage.getItem('chronos_return_epoca');

      if (savedView === 'viewProgramma' && savedEpoca && ['antica', 'medievale', 'moderna', 'contemporanea'].includes(savedEpoca)) {
        setTimeout(() => switchEpoca(savedEpoca), 100);
      } else if (savedView && savedView !== 'viewProgramma' && document.getElementById(savedView)) {
        setTimeout(() => showView(savedView), 100);
      } else {
        syncContentViews();
      }
    } catch (_) {
      syncContentViews();
    }
  }
});

function initSelectionGlossaryPopup() {
  const popupBtn = document.createElement("button");
  popupBtn.id = "chronosSelectionPopup";
  popupBtn.type = "button";
  popupBtn.style.cssText = "position: fixed; z-index: 9999; display: none; background: #1a1d24; color: #f3e5ab; border: 1px solid #d4af37; padding: 8px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; box-shadow: 0 6px 20px rgba(0,0,0,0.6); cursor: pointer; transition: transform 0.15s;";
  document.body.appendChild(popupBtn);

  let selectedTerm = "";

  function getActiveReadableContainer(node) {
    if (!node) return null;
    const lessonPane = document.querySelector(".lezione-content-pane");
    if (lessonPane && lessonPane.style.display !== "none" && lessonPane.contains(node)) {
      return lessonPane;
    }
    const macroContainer = document.getElementById("viewMegaAree");
    if (macroContainer && macroContainer.classList.contains("active") && macroContainer.contains(node)) {
      return macroContainer;
    }
    return null;
  }

  function checkSelection() {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";

    if (
      text.length >= 3 &&
      text.length <= 60 &&
      selection.rangeCount > 0 &&
      getActiveReadableContainer(selection.anchorNode) &&
      !document.getElementById("ai-tutor")?.contains(selection.anchorNode) &&
      !document.getElementById("chronosFullModal")?.contains(selection.anchorNode)
    ) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        selectedTerm = text;
        popupBtn.textContent = `🔍 Chiedi a Chronos: "${text.length > 22 ? text.slice(0, 22) + "..." : text}"`;
        popupBtn.style.left = `${Math.min(window.innerWidth - 240, Math.max(12, rect.left))}px`;
        popupBtn.style.top = `${Math.max(12, rect.top - 44)}px`;
        popupBtn.style.display = "block";
        return;
      }
    }
    popupBtn.style.display = "none";
  }

  document.addEventListener("mouseup", () => setTimeout(checkSelection, 20));
  document.addEventListener("touchend", () => setTimeout(checkSelection, 50));

  popupBtn.addEventListener("click", () => {
    if (!selectedTerm) return;
    popupBtn.style.display = "none";
    window.getSelection()?.removeAllRanges();

    const ctx = getChronosPageContext();
    const contextPhrase = ctx.type === "macroarea"
      ? `nella macroarea "${ctx.title}"`
      : "nel contesto di questa lezione";

    openChronosModal();
    sendQuickPrompt(`Spiegami brevemente il significato storico di "${selectedTerm}" ${contextPhrase}.`, true);
  });
}

function getChronosPageContext() {
  const lessonPane = document.querySelector(".lezione-content-pane");
  if (lessonPane && lessonPane.style.display !== "none") {
    const title = lessonPane.querySelector(".hero-title")?.textContent?.trim() || "";
    const badge = lessonPane.querySelector(".badge-gold")?.textContent?.trim() || "";
    const paragraphs = Array.from(lessonPane.querySelectorAll("p, li"))
      .map(el => el.textContent.trim())
      .filter(t => t.length > 15 && !t.startsWith("A)") && !t.startsWith("B)") && !t.startsWith("C)") && !t.startsWith("D)"))
      .slice(0, 14)
      .join("\n");

    return {
      type: "lesson",
      title,
      badge,
      summary: paragraphs
    };
  }

  const macroareaMap = {
    "view-home": "Economia, Commercio e Lavoro",
    "view-guerre-home": "Guerre, Imperi e Geopolitica",
    "view-potere-home": "Potere, Istituzioni e Società",
    "view-cultura-home": "Cultura, Innovazione e Rivoluzioni",
    "view-crisi-home": "Crisi, Trasformazioni e Cicli Storici"
  };

  for (const [viewId, areaTitle] of Object.entries(macroareaMap)) {
    const el = document.getElementById(viewId);
    if (el && !el.classList.contains("hidden")) {
      return {
        type: "macroarea",
        title: areaTitle
      };
    }
  }

  const viewProgramma = document.getElementById("viewProgramma");
  if (viewProgramma && viewProgramma.classList.contains("active")) {
    const epocaMap = {
      "grid-antica": "Età Antica",
      "grid-medievale": "Età Medievale",
      "grid-moderna": "Età Moderna",
      "grid-contemporanea": "Età Contemporanea"
    };
    return {
      type: "epoca",
      title: epocaMap[epocaAttivaId] || "Programma Storico Generale"
    };
  }

  return { type: "home", title: "Historia Chronos" };
}

function sendQuickPrompt(text, fromModal = false) {
  if (isChronosGenerating) return;
  const inputId = fromModal ? "modalAiChatInput" : "aiChatInput";
  const input = document.getElementById(inputId);
  if (!input) return;
  input.value = text;
  handleChatSubmit(new Event("submit"), fromModal);
}

function triggerSmartAction(mode, fromModal = false) {
  if (isChronosGenerating) return;
  if (mode === "explain") {
    sendQuickPrompt("Spiegamelo meglio", fromModal);
  } else if (mode === "schema") {
    sendQuickPrompt("Schema flash", fromModal);
  } else if (mode === "quiz") {
    sendQuickPrompt("Interrogami", fromModal);
  }
}

async function handleChatSubmit(event, fromModal = false) {
  event.preventDefault();
  if (isChronosGenerating) return;

  const isModalOpen = document.getElementById("chronosFullModal")?.style.display === "flex";
  const useModal = fromModal || isModalOpen;

  const input = document.getElementById(useModal ? "modalAiChatInput" : "aiChatInput");
  const chatBody = document.getElementById(useModal ? "modalChatBody" : "chatBody");
  const sendBtn = document.getElementById(useModal ? "modalAiSendBtn" : "aiSendBtn");
  if (!input || !chatBody) return;

  const message = input.value.trim();
  if (!message) return;

  const userDiv = document.createElement("div");
  userDiv.className = "chat-msg user-msg";
  userDiv.style.cssText = "background: rgba(212, 175, 55, 0.14); border: 1px solid rgba(212, 175, 55, 0.35); color: #f5f6f8; align-self: flex-end; margin-left: auto; max-width: 82%; padding: 12px 16px; border-radius: 12px; margin-bottom: 10px;";
  userDiv.textContent = message;
  chatBody.appendChild(userDiv);

  input.value = "";
  isChronosGenerating = true;
  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.6";
  }

  const aiDiv = document.createElement("div");
  aiDiv.className = "chat-msg ai-msg";
  aiDiv.textContent = "⏳ Sto elaborando...";
  chatBody.appendChild(aiDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  let fullReply = "";
  const currentContext = getChronosPageContext();

  try {
    const response = await fetch(CHRONOS_AI_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: chronosChatHistory,
        context: currentContext
      })
    });

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      aiDiv.textContent = data.reply || data.error || "Richiesta non valida.";
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    aiDiv.textContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const chunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (chunk) {
              fullReply += chunk;
              aiDiv.innerHTML = formatChronosMarkdown(fullReply);
              chatBody.scrollTop = chatBody.scrollHeight;
            }
          } catch (_) {}
        }
      }
    }

    if (fullReply) {
      chronosChatHistory.push({ role: "user", text: message });
      chronosChatHistory.push({ role: "model", text: fullReply });
    }
  } catch (err) {
    aiDiv.textContent = "Errore di connessione con Chronos AI. Riprova tra poco.";
  } finally {
    isChronosGenerating = false;
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.style.opacity = "1";
    }
    chatBody.scrollTop = chatBody.scrollHeight;

    const inlineBody = document.getElementById("chatBody");
    const modalBody = document.getElementById("modalChatBody");
    if (inlineBody && modalBody) {
      if (useModal) inlineBody.innerHTML = modalBody.innerHTML;
      else modalBody.innerHTML = inlineBody.innerHTML;
    }
  }
}
