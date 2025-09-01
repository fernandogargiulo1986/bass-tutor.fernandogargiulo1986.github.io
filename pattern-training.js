// L'evento DOMContentLoaded assicura che tutto l'HTML sia stato caricato prima di eseguire lo script.
document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTI DEL DOM ---
    const generateBtn = document.getElementById('generateBtn');
    const keyEl = document.getElementById('key');
    const tempoEl = document.getElementById('tempo');
    const part1El = document.getElementById('part1');
    const part2El = document.getElementById('part2');
    const part3El = document.getElementById('part3');
    const part4El = document.getElementById('part4');
    const keySelectionContainer = document.getElementById('key-selection-container');
    const selectAllKeysBtn = document.getElementById('selectAllKeysBtn');
    const deselectAllKeysBtn = document.getElementById('deselectAllKeysBtn');

    // --- STATO DELL'APPLICAZIONE (per i lucchetti) ---
    let state = {
        key: { locked: false, value: null, type: null },
        tempo: { locked: false, value: null, type: null },
        part1: { locked: false, value: null, type: null },
        part2: { locked: false, value: null, type: null },
        part3: { locked: false, value: null, type: null },
        part4: { locked: false, value: null, type: null }
    };

    // --- DATI PER LA GENERAZIONE ---
    const data = {
        tonalita: ['Do', 'Sol', 'Re', 'La', 'Mi', 'Si', 'Fa♯', 'Do♯', 'Fa', 'Si♭', 'Mi♭', 'La♭'],
        // qualita: ['Maggiore', 'Minore Naturale', 'Minore Armonica', 'Pentatonica Maggiore'], // Lasciato per futura implementazione
        tipologie: [
            { 
                nome: 'Arpeggio', 
                ritmi: ['Semiminime', 'Minima + Crome', 'Crome + Minima', '3/4 + terzina', 'terzina + 3/4', 'due crome, minima e semiminima'] 
            },
            { 
                nome: 'Scala', 
                ritmi: ['Crome', 'Semiminima + Terzina (2X)', 'Terzina + Semiminima (2X)', 'Terzina, due semiminime, terzina', 'Semiminima + 2 terzine + semiminima', '4 crome + semiminima + tezina', 'Semiminima + terzina + 4 crome'] 
            }
        ],
        direzioni: ['Ascendente', 'Discendente']
    };

    // --- FUNZIONI ---
    
    /**
     * Restituisce un elemento casuale da un array.
     */
    function getRandomElement(arr) {
        if (arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Popola il contenitore con le checkbox per la selezione delle tonalità.
     */
    function populateKeySelection() {
        data.tonalita.forEach(key => {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex items-center';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `key-${key}`;
            checkbox.value = key;
            checkbox.checked = true;
            checkbox.className = 'key-checkbox';

            const label = document.createElement('label');
            label.htmlFor = `key-${key}`;
            label.textContent = key;
            label.className = 'text-white cursor-pointer';

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            keySelectionContainer.appendChild(wrapper);
        });
    }
    
    /**
     * Seleziona o deseleziona tutte le checkbox delle tonalità.
     * @param {boolean} isSelected True per selezionare, false per deselezionare.
     */
    function setAllKeys(isSelected) {
        keySelectionContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = isSelected;
        });
    }

    /**
     * Gestisce il click su un pulsante di blocco (lucchetto).
     * @param {Event} e L'evento del click.
     */
    function toggleLock(e) {
        const part = e.target.dataset.part;
        if (!part) return;

        state[part].locked = !state[part].locked;
        e.target.classList.toggle('locked', state[part].locked);
        
        if (part === 'tempo' && state.tempo.locked) {
             state.tempo.value = tempoEl.value;
        }
    }
    
    /**
     * Aggiorna il testo di un elemento con un effetto fade-in.
     * @param {HTMLElement} element L'elemento da aggiornare.
     * @param {string} text Il nuovo testo.
     */
    function updateTextWithFade(element, text) {
        if (element.textContent === text) return; // Non fare nulla se il testo è identico
        element.classList.remove('fade-in');
        // Questo trucco forza il browser a rieseguire l'animazione
        void element.offsetWidth; 
        element.textContent = text;
        element.classList.add('fade-in');
    }

    /**
     * Genera e visualizza un nuovo esercizio completo.
     */
    function generateExercise() {
        // --- TONALITÀ ---
        if (!state.key.locked) {
            const selectedKeys = Array.from(keySelectionContainer.querySelectorAll('input:checked')).map(cb => cb.value);
            const sourceKeys = selectedKeys.length > 0 ? selectedKeys : data.tonalita;
            state.key.value = getRandomElement(sourceKeys) || 'Nessuna';
        }

        // --- TEMPO ---
        if (!state.tempo.locked) {
            state.tempo.value = Math.round((Math.random() * (160 - 60) + 60) / 5) * 5;
        }

        // --- PATTERN 1 ---
        if (!state.part1.locked) {
            const tipo = getRandomElement(data.tipologie);
            const direzione = getRandomElement(data.direzioni);
            state.part1.value = `${tipo.nome} ${direzione}`;
            state.part1.type = tipo;
        }

        // --- PATTERN 2 (diverso dal primo se possibile) ---
        if (!state.part2.locked) {
            const tipiFiltrati = data.tipologie.filter(t => t.nome !== state.part1.type.nome);
            const tipo = tipiFiltrati.length > 0 ? getRandomElement(tipiFiltrati) : getRandomElement(data.tipologie);
            const direzione = getRandomElement(data.direzioni);
            state.part2.value = `${tipo.nome} ${direzione}`;
            state.part2.type = tipo;
        }

        // --- RITMO 1 ---
        if (!state.part3.locked) {
            state.part3.value = getRandomElement(state.part1.type.ritmi);
        }

        // --- RITMO 2 ---
        if (!state.part4.locked) {
             state.part4.value = getRandomElement(state.part2.type.ritmi);
        }
        
        // --- AGGIORNAMENTO INTERFACCIA ---
        updateTextWithFade(keyEl, state.key.value);
        if (document.activeElement !== tempoEl) { // Evita di aggiornare mentre l'utente scrive
            tempoEl.value = state.tempo.value;
        }
        updateTextWithFade(part1El, state.part1.value);
        updateTextWithFade(part2El, state.part2.value);
        updateTextWithFade(part3El, state.part3.value);
        updateTextWithFade(part4El, state.part4.value);
    }

    // --- INIZIALIZZAZIONE ---
    function init() {
        // Popola le checkbox
        populateKeySelection();
        
        // Aggiungi gli event listener
        generateBtn.addEventListener('click', generateExercise);
        document.querySelectorAll('.lock-btn').forEach(btn => btn.addEventListener('click', toggleLock));
        selectAllKeysBtn.addEventListener('click', () => setAllKeys(true));
        deselectAllKeysBtn.addEventListener('click', () => setAllKeys(false));
        
        // Genera il primo esercizio
        generateExercise();
        
        // Rimuovi l'animazione iniziale dopo il primo caricamento
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach(el => el.classList.remove('fade-in'));
        }, 500);
    }

    // Avvia l'applicazione
    init();

});
