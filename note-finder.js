// --- Elementi del DOM ---
const noteDisplay = document.getElementById('note-display');
const stringDisplay = document.getElementById('string-display');
const startStopBtn = document.getElementById('start-stop-btn');
const intervalSlider = document.getElementById('interval-slider');
const intervalValue = document.getElementById('interval-value');

// --- Dati ---
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const strings = ["B", "E", "A", "D", "G"]; // 5 corde, copre anche il basso a 4

// --- Stato dell'applicazione ---
let timerId = null;
let isRunning = false;
let currentInterval = 2000; // Valore di default in millisecondi

// --- Funzioni ---

/**
 * Aggiorna la visualizzazione con una nuova nota e corda casuale.
 * Aggiunge un effetto di dissolvenza per una transizione più fluida.
 */
function updateDisplay() {
    // Dissolvenza in uscita
    noteDisplay.style.opacity = '0';
    stringDisplay.style.opacity = '0';

    setTimeout(() => {
        // Genera indici casuali
        const randomNoteIndex = Math.floor(Math.random() * notes.length);
        const randomStringIndex = Math.floor(Math.random() * strings.length);

        // Aggiorna il testo
        noteDisplay.textContent = notes[randomNoteIndex];
        stringDisplay.textContent = `Corda ${strings[randomStringIndex]}`;

        // Dissolvenza in entrata
        noteDisplay.style.opacity = '1';
        stringDisplay.style.opacity = '1';
    }, 150); // Attende un breve istante per creare l'effetto
}

/**
 * Avvia il timer per l'aggiornamento.
 */
function startTrainer() {
    if (isRunning) return; // Non fare nulla se è già in esecuzione
    
    isRunning = true;
    startStopBtn.textContent = 'Ferma';
    startStopBtn.classList.remove('bg-emerald-500', 'hover:bg-emerald-600', 'focus:ring-emerald-300');
    startStopBtn.classList.add('bg-rose-500', 'hover:bg-rose-600', 'focus:ring-rose-300');

    updateDisplay(); // Mostra subito la prima combinazione
    timerId = setInterval(updateDisplay, currentInterval);
}

/**
 * Ferma il timer e resetta la visualizzazione.
 */
function stopTrainer() {
    if (!isRunning) return; // Non fare nulla se è già fermo

    isRunning = false;
    clearInterval(timerId);
    timerId = null;

    startStopBtn.textContent = 'Avvia';
    startStopBtn.classList.remove('bg-rose-500', 'hover:bg-rose-600', 'focus:ring-rose-300');
    startStopBtn.classList.add('bg-emerald-500', 'hover:bg-emerald-600', 'focus:ring-emerald-300');

    // Resetta la visualizzazione
    noteDisplay.textContent = '--';
    stringDisplay.textContent = 'Corda --';
}

// --- Event Listeners ---

// Gestisce il click sul pulsante Avvia/Ferma
startStopBtn.addEventListener('click', () => {
    if (isRunning) {
        stopTrainer();
    } else {
        startTrainer();
    }
});

// Gestisce il cambiamento di valore dello slider
intervalSlider.addEventListener('input', (e) => {
    const newIntervalSeconds = parseFloat(e.target.value);
    currentInterval = newIntervalSeconds * 1000;
    intervalValue.textContent = newIntervalSeconds.toFixed(1);

    // Se il trainer è in esecuzione, riavvialo con il nuovo intervallo
    if (isRunning) {
        clearInterval(timerId);
        timerId = setInterval(updateDisplay, currentInterval);
    }
});
