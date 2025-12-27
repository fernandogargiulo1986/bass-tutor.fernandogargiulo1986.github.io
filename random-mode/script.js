const notes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

// Definizione dei dati: Chiave Scala -> Array di nomi Modi (in ordine dal I al VII)
const scalesData = {
    major: [
        "Ionian (Maggiore)", "Dorian", "Phrygian", "Lydian", 
        "Mixolydian", "Aeolian (Minore)", "Locrian"
    ],
    melodic_minor: [
        "Minore Melodica", "Dorian b2", "Lydian Augmented", "Lydian Dominant", 
        "Mixolydian b6", "Locrian #2", "Altered (Super Locrian)"
    ],
    harmonic_minor: [
        "Minore Armonica", "Locrian 13", "Ionian #5", "Dorian #4", 
        "Phrygian Dominant", "Lydian #2", "Super Locrian bb7"
    ]
};

const scaleLabels = {
    major: "Scala Maggiore",
    melodic_minor: "Min. Melodica",
    harmonic_minor: "Min. Armonica"
};

// 1. Inizializzazione: Genera i checkbox per tutti i modi possibili
function initModeCheckboxes() {
    const container = document.getElementById('modesContainer');
    const allModes = new Set();

    // Raccogliamo tutti i nomi unici dei modi
    Object.values(scalesData).forEach(modeList => {
        modeList.forEach(mode => allModes.add(mode));
    });

    // Creiamo i checkbox
    allModes.forEach(modeName => {
        const label = document.createElement('label');
        label.style.fontSize = "0.85rem"; // Un po' più piccolo per farceli stare
        label.innerHTML = `<input type="checkbox" name="modeFilter" value="${modeName}" checked> ${modeName.split(" ")[0]}`; // Mostra solo la prima parola per brevità nell'UI, ma value è completo
        label.title = modeName; // Tooltip col nome completo
        container.appendChild(label);
    });
}

// Gestione "Seleziona tutti/nessuno"
document.getElementById('toggleModesBtn').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('input[name="modeFilter"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
});

document.getElementById('generateBtn').addEventListener('click', generateRoutine);

// Funzione Principale
function generateRoutine() {
    // A. Raccogli i filtri attivi
    const activeScales = Array.from(document.querySelectorAll('input[name="scale"]:checked')).map(cb => cb.value);
    const activeDegrees = Array.from(document.querySelectorAll('input[name="degree"]:checked')).map(cb => parseInt(cb.value));
    const activeModes = Array.from(document.querySelectorAll('input[name="modeFilter"]:checked')).map(cb => cb.value);

    // Validazione base
    if (activeScales.length === 0 || activeDegrees.length === 0 || activeModes.length === 0) {
        alert("Seleziona almeno una Scala, un Grado e un Modo!");
        return;
    }

    // B. Costruisci il "Pool" di combinazioni valide
    // Una combinazione è valida SOLO SE soddisfa tutti e tre i criteri
    let validPool = [];

    activeScales.forEach(scaleKey => {
        // Per ogni scala attiva, controlliamo i suoi 7 gradi
        const modesOfThisScale = scalesData[scaleKey];
        
        modesOfThisScale.forEach((modeName, index) => {
            const degree = index + 1;

            // Il grado è attivo? E il nome del modo è attivo?
            if (activeDegrees.includes(degree) && activeModes.includes(modeName)) {
                validPool.push({
                    scaleKey: scaleKey,
                    degree: degree,
                    modeName: modeName
                });
            }
        });
    });

    if (validPool.length === 0) {
        alert("Nessuna combinazione trovata! Hai selezionato dei filtri che si escludono a vicenda (es. 'Scala Maggiore' ma solo modo 'Altered').");
        return;
    }

    // C. Generazione
    const container = document.getElementById('resultsContainer');
    container.innerHTML = "";
    
    for (let i = 0; i < 4; i++) {
        // Pesca una combinazione valida dal pool
        const combo = validPool[Math.floor(Math.random() * validPool.length)];
        // Pesca una nota a caso
        const note = notes[Math.floor(Math.random() * notes.length)];

        // Render HTML
        const html = `
            <div class="result-card-mini">
                <div class="card-header">
                    <span class="note-mini">${note}</span>
                    <span class="degree-badge">${romanize(combo.degree)}</span>
                </div>
                <div class="card-body">
                    <div class="scale-mini">${scaleLabels[combo.scaleKey]}</div>
                    <div class="mode-mini">${combo.modeName}</div>
                </div>
            </div>
        `;
        container.innerHTML += html;
    }
    
    container.classList.remove('hidden');
}

function romanize(num) {
    const lookup = {1:'I', 2:'II', 3:'III', 4:'IV', 5:'V', 6:'VI', 7:'VII'};
    return lookup[num] || num;
}

// Avvia setup
initModeCheckboxes();
