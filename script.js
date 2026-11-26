document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initPathwaySwitcher();
});

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

  // Controllo iniziale al caricamento pagina
  updateMappeNavVisibility();

  if (btnMegaAree && btnProgramma && viewMegaAree && viewProgramma) {
    btnMegaAree.addEventListener('click', () => {
      btnMegaAree.classList.add('active');
      btnProgramma.classList.remove('active');
      document.querySelectorAll('.view-screen').forEach(el => { el.classList.add('hidden'); el.classList.remove('flex'); });
      viewMegaAree.classList.add('active');
      viewProgramma.classList.remove('active');
      updateMappeNavVisibility();
    });
    btnProgramma.addEventListener('click', () => {
      btnProgramma.classList.add('active');
      btnMegaAree.classList.remove('active');
      document.querySelectorAll('.view-screen').forEach(el => { el.classList.add('hidden'); el.classList.remove('flex'); });
      viewProgramma.classList.add('active');
      viewMegaAree.classList.remove('active');
      updateMappeNavVisibility();
    });
  }
}


const quizDatabase = {
  'q1-1': { correctOpt: 'B', explanation: 'Con la stanzialità l\'uomo fonda i primi villaggi stabili per curare i campi e gli allevamenti.' },
  'q1-2': { correctOpt: 'B', explanation: 'Mesopotamia in greco significa proprio "terra tra due fiumi" (Tigri ed Eufrate).' },
  'q1-3': { correctOpt: 'B', explanation: 'La scrittura nacque per esigenze pratiche di contabilità delle merci e dei tasse nei magazzini.' },
  'q1-4': { correctOpt: 'B', explanation: 'La Ziggurat era il centro religioso ed economico/amministrativo della città sumera.' },

  'q1-2-1': { correctOpt: 'B', explanation: 'Il limo rilasciato dalle piene annuali del Nilo rendeva il terreno arido estremamente fertile.' },
  'q1-2-2': { correctOpt: 'C', explanation: 'Il Faraone deteneva il potere assoluto ed era considerato un vero e proprio Dio vivente in terra.' },
  'q1-2-3': { correctOpt: 'B', explanation: 'La mummificazione serviva a preservare il corpo intatto per permettere all\'anima (Ka) di vivere nell\'Aldilà.' },
  'q1-2-4': { correctOpt: 'B', explanation: 'La scrittura geroglifica era un sistema pittografico basato su simboli e immagini sacre.' },

  'q1-3-1': { correctOpt: 'B', explanation: 'Il territorio stretto e montuoso spinse i Fenici a sfruttare il legname di cedro per costruire navi e dedicarsi al mare.' },
  'q1-3-2': { correctOpt: 'C', explanation: 'L\'alfabeto fenicio rivoluzionò la scrittura usando solo 22 segni associati ai singoli suoni.' },
  'q1-3-3': { correctOpt: 'B', explanation: 'Gli Ebrei furono il primo grande popolo a praticare stabilmente il monoteismo (fede in un unico Dio).' },
  'q1-3-4': { correctOpt: 'B', explanation: 'La Diaspora indica la storica dispersione del popolo ebraico nel mondo dopo la distruzione del Tempio.' },

  'q1-4-1': { correctOpt: 'B', explanation: 'La talassocrazia è il dominio politico e commerciale esercitato sul mare tramite le navi.' },
  'q1-4-2': { correctOpt: 'C', explanation: 'Le città micenee erano roccaforti difese da imponenti mura fatte di enormi blocchi di pietra ("ciclopiche").' },
  'q1-4-3': { correctOpt: 'B', explanation: 'L\'Agorà era la piazza pubblica al centro del mercato e del dibattito politico tra cittadini.' },
  'q1-4-4': { correctOpt: 'B', explanation: 'Attorno all\'VIII secolo a.C. la nascita della Polis segna la fine del Medioevo Ellenico e l\'inizio dell\'età classica.' },

  'q1-5-1': { correctOpt: 'B', explanation: 'L\'Agogé era il sistema educativo spartano volto alla formazione militare di soldati impeccabili.' },
  'q1-5-2': { correctOpt: 'C', explanation: 'Oligarchia deriva dal greco oligoi ("pochi") e archein ("comandare"): il governo dei pochi.' },
  'q1-5-3': { correctOpt: 'B', explanation: 'L\'ostracismo permetteva all\'Ecclesìa di allontanare temporaneamente per 10 anni un leader ritenuto una minaccia tirannica.' },
  'q1-5-4': { correctOpt: 'B', explanation: 'Donne, schiavi e meteci (stranieri residenti) erano del tutto privi di diritti di voto ad Atene.' },

  'q1-6-1': { correctOpt: 'B', explanation: 'Milziade guidò brillantemente le truppe ateniesi alla vittoria nella piana di Maratona nel 490 a.C.' },
  'q1-6-2': { correctOpt: 'A', explanation: 'Temistocle sfruttò la conformazione dello stretto di Salamina per neutralizzare la superiorità numerica delle navi persiane.' },
  'q1-6-3': { correctOpt: 'B', explanation: 'Il misthos (compenso giornaliero) introdotto da Pericle permise anche ai cittadini meno abbienti di partecipare attivamente alle cariche pubbliche.' },
  'q1-6-4': { correctOpt: 'B', explanation: 'La vittoria spartana segnò la fine dell\'egemonia ateniese, lasciando però l\'intera Grecia politicamente ed economicamente distrutta.' },

  'q1-7-1': { correctOpt: 'B', explanation: 'Le sarisse erano lunghissime lance di oltre 5 metri utilizzate dalla falange macedone.' },
  'q1-7-2': { correctOpt: 'B', explanation: 'Alessandro Magno promosse la fusione paritaria tra la cultura greca e quelle asiatiche, favorendo i matrimoni misti.' },
  'q1-7-3': { correctOpt: 'B', explanation: 'La Koinè era il greco comune che divenne la lingua ufficiale del commercio e della cultura nel Mediterraneo.' },
  'q1-7-4': { correctOpt: 'C', explanation: 'Alessandria d\'Egitto fu la capitale culturale ed economica dell\'Ellenismo, celebre per la Biblioteca ed il Faro.' },

  'q1-8-1': { correctOpt: 'B', explanation: 'L\'Isola Tiberina e la rotta del sale resero la posizione di Roma strategica per i traffici commerciali.' },
  'q1-8-2': { correctOpt: 'B', explanation: 'I patrizi detenevano il potere politico e religioso in quanto nobili, mentre i plebei ne erano esclusi.' },
  'q1-8-3': { correctOpt: 'B', explanation: 'La Cloaca Maxima fu il grande sistema fognario realizzato dagli Etruschi per bonificare le zone paludose.' },
  'q1-8-4': { correctOpt: 'B', explanation: 'La rivolta patrizia contro gli abusi di Tarquinio il Superbo nel 509 a.C. determinò la nascita della Repubblica.' },

  'q1-9-1': { correctOpt: 'B', explanation: 'I due consoli duravano in carica un anno e godevano del potere di veto reciproco.' },
  'q1-9-2': { correctOpt: 'B', explanation: 'La secessione sull\'Aventino fu il celebre sciopero generale con cui i plebei ottennero i propri rappresentanti.' },
  'q1-9-3': { correctOpt: 'B', explanation: 'Le Leggi delle XII Tavole rappresentarono la prima codificazione scritta pubblica e uguale per tutti.' },
  'q1-9-4': { correctOpt: 'B', explanation: 'La vittoria di Pirro indica un successo costato così caro in termini di perdite da risultare rovinoso.' },

  'q1-10-1': { correctOpt: 'B', explanation: 'I corvi erano ponti d\'abbordaggio che agganciavano le navi nemiche consentendo il combattimento corpo a corpo.' },
  'q1-10-2': { correctOpt: 'B', explanation: 'Annibale attraversò sbalorditivamente le Alpi in inverno portando soldati ed elefanti sul suolo italico.' },
  'q1-10-3': { correctOpt: 'B', explanation: 'Scipione l\'Africano sconfisse Annibale nella piana di Zama nel 202 a.C., ponendo fine alla Seconda Guerra Punica.' },
  'q1-10-4': { correctOpt: 'B', explanation: 'Con Mare Nostrum i Romani indicavano il loro completo controllo geopolitico e commerciale del Mediterraneo.' },

  'q1-11-1': { correctOpt: 'B', explanation: 'I Gracchi cercarono di contrastare la rovina dei piccoli contadini causata dall\'espansione dei latifondi schiavistici.' },
  'q1-11-2': { correctOpt: 'B', explanation: 'La riforma di Mario rese l\'esercito professionale, legando indissolubilmente i soldati al proprio generale.' },
  'q1-11-3': { correctOpt: 'B', explanation: 'Il passaggio del Rubicone nel 49 a.C. segnò l\'inizio della guerra civile contro Pompeo.' },
  'q1-11-4': { correctOpt: 'B', explanation: 'Le Idi di Marzo del 44 a.C. videro l\'assassinio di Cesare in Senato per mano dei congiurati di Bruto e Cassio.' },

  'q1-12-1': { correctOpt: 'B', explanation: 'La vittoria navale ad Azio nel 31 a.C. decretò la sconfitta di Marco Antonio e Cleopatra e la fine delle guerre civili.' },
  'q1-12-2': { correctOpt: 'B', explanation: 'Augusto mantenne l\'apparenza delle istituzioni repubblicane, ma accentrò il potere militare e politico su di sé.' },
  'q1-12-3': { correctOpt: 'B', explanation: 'La Guardia Pretoriana era il corpo militare d\'élite istituito per la protezione personale dell\'Imperatore.' },
  'q1-12-4': { correctOpt: 'B', explanation: 'La disfatta di Teutoburgo convinse Augusto a stabilire il confine nord dell\'Impero lungo il corso del fiume Reno.' },

  'q1-13-1': { correctOpt: 'B', explanation: 'Il rifiuto del culto dell\'Imperatore venne interpretato dai Romani come un atto di lesa maestà e tradimento politico.' },
  'q1-13-2': { correctOpt: 'B', explanation: 'San Paolo fu decisivo per l\'apertura del messaggio evangelico ai Gentili e la fondazione di Chiese in tutto il Mediterraneo.' },
  'q1-13-3': { correctOpt: 'B', explanation: 'L\'Editto di Milano del 313 d.C. sancì la tolleranza religiosa e la piena libertà di culto per i cristiani.' },
  'q1-13-4': { correctOpt: 'B', explanation: 'L\'Editto di Tessalonica del 380 d.C. rese il Cristianesimo la religione di Stato dell\'Impero Romano.' },

  'q1-14-1': { correctOpt: 'B', explanation: 'L\'interruzione delle conquiste e l\'anarchia militare minarono le fondamenta economiche e politiche dell\'Impero.' },
  'q1-14-2': { correctOpt: 'A', explanation: 'La Tetrarchia prevedeva la suddivisione del governo tra 2 Augusti e 2 Cesari per assicurare la difesa dei confini.' },
  'q1-14-3': { correctOpt: 'A', explanation: 'Nel 330 d.C. Costantino trasferì la capitale imperiale a Costantinopoli (ex Bisanzio).' },
  'q1-14-4': { correctOpt: 'B', explanation: 'L\'Editto di Milano del 313 d.C. proclamò la piena libertà di culto per tutte le fedi religiose presenti nell\'Impero.' },

  'q1-15-1': { correctOpt: 'B', explanation: 'La divisione del 395 d.C. fu necessaria per facilitare il governo e la difesa di un territorio imperiale ormai troppo esteso.' },
  'q1-15-2': { correctOpt: 'B', explanation: 'L\'arrivo e le razzie degli Unni dalle steppe asiatiche generarono l\'effetto domino che spinse i Germani dentro i confini.' },
  'q1-15-3': { correctOpt: 'B', explanation: 'La deposizione di Romolo Augustolo da parte di Odoacre nel 476 d.C. segna simbolicamente la fine dell\'Età Antica.' },
  'q1-15-4': { correctOpt: 'B', explanation: 'I Regni Romano-Barbarici nacquero dall\'integrazione tra la popolazione e le leggi latine e le aristocrazie militari germaniche.' }
};

function checkAnswer(btnElement, isCorrect, itemId, selectedOpt, lezioneNum) {
  const itemContainer = document.getElementById(itemId) || btnElement.closest('div[id]') || btnElement.parentElement.parentElement;
  const feedbackBox = document.getElementById('feedback-' + itemId) || itemContainer.querySelector('.quiz-feedback');
  const allBtns = itemContainer.querySelectorAll('.quiz-opt-btn');

  const data = quizDatabase[itemId] || {
    correctOpt: 'B',
    explanation: 'Risposta registrata correttamente nel sistema Historia Chronos.'
  };

  allBtns.forEach(btn => btn.style.pointerEvents = 'none');

  if (feedbackBox) {
    feedbackBox.style.display = 'block';

    if (isCorrect) {
      btnElement.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
      btnElement.style.borderColor = '#22c55e';
      feedbackBox.className = 'quiz-feedback correct';
      feedbackBox.innerHTML = `<strong>CORRETTO!!! 🎉</strong><br>${data.explanation}`;
    } else {
      btnElement.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
      btnElement.style.borderColor = '#ef4444';
      feedbackBox.className = 'quiz-feedback wrong';
      feedbackBox.innerHTML = `<strong>SBAGLIATO! ❌</strong><br><strong>La risposta corretta era la ${data.correctOpt}.</strong><br><em>Spiegazione:</em> ${data.explanation}`;
    }
  }

  const resetBtnId = lezioneNum === '1.1' ? 'reset-quiz-1' : 'reset-quiz-' + String(lezioneNum || '').replace('.', '-');
  const quizBox = itemContainer.closest('.lezione-section-box') || itemContainer.parentElement;
  const resetBtn = document.getElementById(resetBtnId) || (quizBox ? quizBox.querySelector('button[onclick*="resetQuiz"]') : null);
  if (resetBtn) resetBtn.style.display = 'inline-block';
}

function resetQuiz(containerId, lezioneNum, btnElement) {
  let container = document.getElementById(containerId);
  if (!container && btnElement) {
    container = btnElement.closest('.lezione-section-box') || btnElement.parentElement;
  }
  if (!container && typeof event !== 'undefined' && event.target) {
    container = event.target.closest('.lezione-section-box') || event.target.parentElement;
  }
  if (!container) return;

  const allBtns = container.querySelectorAll('.quiz-opt-btn');
  const allFeedbacks = container.querySelectorAll('.quiz-feedback');

  allBtns.forEach(btn => {
    btn.style.pointerEvents = 'auto';
    btn.style.backgroundColor = 'var(--bg-card)';
    btn.style.borderColor = 'var(--border-gold)';
  });

  allFeedbacks.forEach(fb => {
    fb.style.display = 'none';
    fb.innerHTML = '';
  });

  const resetBtnId = lezioneNum === '1.1' ? 'reset-quiz-1' : 'reset-quiz-' + String(lezioneNum || '').replace('.', '-');
  const resetBtn = document.getElementById(resetBtnId) || container.querySelector('button[onclick*="resetQuiz"]');
  if (resetBtn) resetBtn.style.display = 'none';
}

let epocaAttivaId = 'grid-antica';

function switchEpoca(epoca, btn) {
  epocaAttivaId = 'grid-' + epoca;

  if (btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  const gridContainer = document.getElementById('epocheGridsContainer');
  if (gridContainer) gridContainer.style.display = 'block';

  document.querySelectorAll('.epoche-grid-view').forEach(grid => {
    grid.style.display = 'none';
  });

  document.querySelectorAll('.lezione-content-pane').forEach(pane => {
    pane.style.display = 'none';
  });

  const detailContainer = document.getElementById('lezioneDetailContainer');
  if (detailContainer) detailContainer.style.display = 'none';

  const targetGrid = document.getElementById(epocaAttivaId);
  if (targetGrid) {
    targetGrid.style.display = 'block';
  }
}

function openLezioneDetail(lezioneId) {
  window.location.href = 'lezioni/' + lezioneId + '.html';
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
    if (grid.id === epocaAttivaId) {
      grid.style.display = 'block';
    } else {
      grid.style.display = 'none';
    }
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
  if (viewProg) viewProg.classList.remove('active');
  if (viewMega) viewMega.classList.remove('active');

  document.querySelectorAll('.view-screen').forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('flex');
  });
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('flex');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function showHome() {
  showView('view-home');
}

// === CHRONOS AI TUTOR (CONSAPEVOLE DI LEZIONE, EPOCA E MACROAREA + MODALE FULL-SCREEN + PULISCI + MARKDOWN + GLOSSARIO DOPPIO CLIC) ===
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
    return `Ciao! Sono <strong>Chronos AI</strong>. Ho letto con te <strong>${lessonTitle}</strong>: premi <strong>Spiegamelo meglio</strong> per un chiarimento, <strong>Schema flash</strong> per la sintesi o <strong>Interrogami</strong> per un'interrogazione con voto! <em>(Suggerimento: fai doppio clic su qualsiasi parola del testo per chiedermene il significato).</em>`;
  }
  return `Ciao! Sono <strong>Chronos AI</strong>, il tuo tutor storico. Chiedimi qualsiasi chiarimento, schema flash o interrogazione sulle epoche storiche!`;
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

// Apre e chiude la finestra modale quasi a tutto schermo
function openChronosModal() {
  const modal = document.getElementById("chronosFullModal");
  const inlineBody = document.getElementById("chatBody");
  const modalBody = document.getElementById("modalChatBody");
  const modalContextLabel = document.getElementById("chronosModalContextLabel");

  if (!modal || !modalBody) return;

  // Sincronizza il contenuto della chat
  if (inlineBody) {
    modalBody.innerHTML = inlineBody.innerHTML;
  }

  // Aggiorna l'etichetta del contesto attivo in alto nella modale
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
      <!-- Header Modale -->
      <div style="padding: 16px 22px; background: #111318; border-bottom: 1px solid rgba(212, 175, 55, 0.25); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="tutor-avatar" style="width: 42px; height: 42px; font-size: 1.3rem;">🤖</div>
          <div>
            <h3 style="margin: 0; font-size: 1.15rem; color: #f5f6f8;">Chronos AI <span class="gold-text">Tutor Storico</span></h3>
            <p id="chronosModalContextLabel" style="margin: 2px 0 0; font-size: 0.82rem; color: #a1a8b5;">Modalità Tutor Estesa</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button
            type="button"
            onclick="clearChronosChat()"
            style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(212, 175, 55, 0.35); color: #f3e5ab; padding: 7px 13px; border-radius: 8px; font-size: 0.82rem; cursor: pointer;"
          >
            🗑️ Pulisci
          </button>
          <button
            type="button"
            onclick="closeChronosModal()"
            style="background: rgba(239, 68, 68, 0.16); border: 1px solid rgba(239, 68, 68, 0.45); color: #fca5a5; padding: 7px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer;"
          >
            ✕ Chiudi
          </button>
        </div>
      </div>

      <!-- Area Messaggi Espansa -->
      <div
        id="modalChatBody"
        class="tutor-chat-body"
        style="flex: 1; max-height: none; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; font-size: 1rem; line-height: 1.65;"
      ></div>

      <!-- Barra Input + Pulsanti Rapidi -->
      <div style="padding: 14px 22px 18px; background: #111318; border-top: 1px solid rgba(212, 175, 55, 0.25);">
        <form id="modalAiChatForm" onsubmit="handleChatSubmit(event, true)" style="display: flex; gap: 10px; margin-bottom: 12px;">
          <input
            type="text"
            id="modalAiChatInput"
            maxlength="450"
            placeholder="Scrivi qui la tua domanda di storia, rispondi all'interrogazione o chiedi un approfondimento..."
            style="flex: 1; background: #181b23; border: 1px solid rgba(212, 175, 55, 0.4); color: #f5f6f8; padding: 13px 16px; border-radius: 10px; font-size: 0.98rem; outline: none;"
            required
          />
          <button
            type="submit"
            id="modalAiSendBtn"
            style="background: #d4af37; color: #121418; font-weight: 700; border: none; padding: 0 24px; border-radius: 10px; font-size: 0.95rem; cursor: pointer;"
          >
            Invia ➤
          </button>
        </form>
        <div class="tutor-quick-actions" style="margin-top: 0;">
          <button type="button" class="quick-btn" onclick="triggerSmartAction('explain', true)">💡 Spiegamelo meglio</button>
          <button type="button" class="quick-btn" onclick="triggerSmartAction('schema', true)">🗺️ Schema flash</button>
          <button type="button" class="quick-btn" onclick="triggerSmartAction('quiz', true)">📝 Interrogami</button>
        </div>
      </div>
    </div>
  `;

  // Chiude cliccando sullo sfondo oscurato esterno o premendo ESC
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeChronosModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") closeChronosModal();
  });

  document.body.appendChild(modal);

  // Intercetta tutti i link "Chronos AI" nella navbar (href="#ai-tutor") per aprire la finestra grande
  document.querySelectorAll('a[href="#ai-tutor"]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("mobileDrawer")?.classList.remove("open");
      openChronosModal();
    });
  });

  // Aggiunge il bottone "⛶ Espandi" anche nell'header della chat di index.html se presente
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
            <button
              type="button"
              onclick="openChronosModal()"
              title="Apri a schermo intero"
              style="background: rgba(212, 175, 55, 0.14); border: 1px solid rgba(212, 175, 55, 0.45); color: #f3e5ab; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer;"
            >
              ⛶ Espandi
            </button>
            <button
              type="button"
              onclick="clearChronosChat()"
              title="Inizia una nuova conversazione"
              style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(212, 175, 55, 0.35); color: #f3e5ab; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer;"
            >
              🗑️ Pulisci
            </button>
          </div>
        </div>
        <div class="tutor-chat-body" id="chatBody">
          <div class="chat-msg ai-msg">
            ${getChronosWelcomeHtml()}
          </div>
        </div>
        <form id="aiChatForm" onsubmit="handleChatSubmit(event, false)" style="display: flex; gap: 10px; margin-top: 14px; margin-bottom: 12px;">
          <input
            type="text"
            id="aiChatInput"
            maxlength="450"
            placeholder="Fai una domanda su questa lezione o scrivi 'interrogami'..."
            style="flex: 1; background: #121418; border: 1px solid rgba(212, 175, 55, 0.35); color: #f5f6f8; padding: 12px 16px; border-radius: 10px; font-size: 0.95rem; outline: none;"
            required
          />
          <button
            type="submit"
            id="aiSendBtn"
            style="background: #d4af37; color: #121418; font-weight: 700; border: none; padding: 0 20px; border-radius: 10px; cursor: pointer; transition: opacity 0.2s;"
          >
            Invia ➤
          </button>
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
});

function initSelectionGlossaryPopup() {
  const popupBtn = document.createElement("button");
  popupBtn.id = "chronosSelectionPopup";
  popupBtn.type = "button";
  popupBtn.style.cssText = "position: fixed; z-index: 9999; display: none; background: #1a1d24; color: #f3e5ab; border: 1px solid #d4af37; padding: 8px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; box-shadow: 0 6px 20px rgba(0,0,0,0.6); cursor: pointer; transition: transform 0.15s;";
  document.body.appendChild(popupBtn);

  let selectedTerm = "";

  function checkSelection() {
    const lessonPane = document.querySelector(".lezione-content-pane");
    if (!lessonPane) return;

    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";

    if (
      text.length >= 3 &&
      text.length <= 60 &&
      selection.rangeCount > 0 &&
      lessonPane.contains(selection.anchorNode) &&
      !document.getElementById("ai-tutor")?.contains(selection.anchorNode)
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

    openChronosModal();
    sendQuickPrompt(`Spiegami brevemente il significato storico di "${selectedTerm}" nel contesto di questa lezione.`, true);
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

    // Mantiene sincronizzate entrambe le chat (modale e fondo pagina)
    const inlineBody = document.getElementById("chatBody");
    const modalBody = document.getElementById("modalChatBody");
    if (inlineBody && modalBody) {
      if (useModal) inlineBody.innerHTML = modalBody.innerHTML;
      else modalBody.innerHTML = inlineBody.innerHTML;
    }
  }
}
// Nasconde il link "Chronos AI" nell'header solo quando è aperta la sezione Atlante & Monete
document.addEventListener("DOMContentLoaded", () => {
  const navChronosLinks = document.querySelectorAll('a[href="#ai-tutor"]');
  if (!navChronosLinks.length) return;

  function toggleChronosNavVisibility() {
    const pageText = document.body.innerText || "";
    const isAtlanteOpen =
      pageText.includes("WORLD EXPLORER") ||
      Boolean(document.querySelector('#viewAtlante:not(.hidden), #view-atlante:not(.hidden), .atlante-section:not(.hidden)'));

    navChronosLinks.forEach(link => {
      link.style.display = isAtlanteOpen ? "none" : "";
    });
  }

  toggleChronosNavVisibility();
  document.addEventListener("click", () => setTimeout(toggleChronosNavVisibility, 60));
});
// Apertura automatica della lezione o dell'epoca arrivando da Mappe Storiche (?lezione=1.1 o ?epoca=medievale)
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const lezioneParam = params.get("lezione");
  const epocaParam = params.get("epoca");

  if (lezioneParam) {
    setTimeout(() => {
      // Cerca la card della lezione corrispondente (es. "Lezione 1.1") e simula il clic su "Apri Lezione"
      const cards = Array.from(document.querySelectorAll(".lesson-card, .card, article, div"));
      const targetCard = cards.find(el => {
        const badge = el.querySelector(".badge-gold, .lesson-num, span, h4");
        return badge && badge.textContent.trim() === `Lezione ${lezioneParam}`;
      });
      const openBtn = targetCard?.querySelector("a, button");
      if (openBtn) {
        openBtn.click();
      }
    }, 150);
  } else if (epocaParam) {
    setTimeout(() => {
      const epocaTabMap = {
        antica: "grid-antica",
        medievale: "grid-medievale",
        moderna: "grid-moderna",
        contemporanea: "grid-contemporanea"
      };
      const targetGridId = epocaTabMap[epocaParam];
      if (targetGridId) {
        const eraBtn = document.querySelector(`[onclick*="${targetGridId}"]`);
        if (eraBtn) eraBtn.click();
      }
    }, 150);
  }
});

