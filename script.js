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

      if (btnMegaAree && btnProgramma && viewMegaAree && viewProgramma) {
        btnMegaAree.addEventListener('click', () => {
          btnMegaAree.classList.add('active');
          btnProgramma.classList.remove('active');
          document.querySelectorAll('.view-screen').forEach(el => { el.classList.add('hidden'); el.classList.remove('flex'); });
          viewMegaAree.classList.add('active');
          viewProgramma.classList.remove('active');
        });
        btnProgramma.addEventListener('click', () => {
          btnProgramma.classList.add('active');
          btnMegaAree.classList.remove('active');
          document.querySelectorAll('.view-screen').forEach(el => { el.classList.add('hidden'); el.classList.remove('flex'); });
          viewProgramma.classList.add('active');
          viewMegaAree.classList.remove('active');
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

  // Trova il pulsante "Rifai il Quiz" sia tramite ID che dentro il contenitore del quiz
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

    // Integrazione Glossario e Tendine dal primo blocco
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

    function sendQuickPrompt(type) {
      const chatBody = document.getElementById('chatBody');
      if (!chatBody) return;
      if (type === 'Spiegamelo meglio') {
        appendUserMsg('💡 Puoi spiegarmi meglio la differenza tra economia di prelievo e di produzione?');
        setTimeout(() => {
          appendAiMsg('Certamente! L\'economia di <b>prelievo</b> (Paleolitico) sfrutta ciò che la natura offre spontaneamente. L\'economia di <b>produzione</b> (Neolitico) vede l\'uomo attivo con agricoltura e allevamento.');
        }, 600);
      } else if (type === 'Fammi una domanda su Atene') {
        appendUserMsg('📝 Avvia la modalità Interrogami.');
        setTimeout(() => {
          appendAiMsg('<b>Domanda di verifica:</b> Qual era la principale risorsa economica su cui Atene fondava il proprio potere marittimo?');
        }, 600);
      }
    }

    function appendUserMsg(text) {
      const chatBody = document.getElementById('chatBody');
      const msg = document.createElement('div');
      msg.className = 'chat-msg user-msg';
      msg.style.cssText = 'color: #d4af37; margin-top: 10px; font-weight: 500;';
      msg.innerHTML = `<b>Tu:</b> ${text}`;
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function appendAiMsg(htmlText) {
      const chatBody = document.getElementById('chatBody');
      const msg = document.createElement('div');
      msg.className = 'chat-msg ai-msg';
      msg.style.cssText = 'margin-top: 10px; border-left: 2px solid #d4af37; padding-left: 10px;';
      msg.innerHTML = `<b>Chronos AI:</b> ${htmlText}`;
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

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
