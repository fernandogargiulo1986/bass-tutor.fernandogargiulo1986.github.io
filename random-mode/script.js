const notes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

// DATABASE: Mappa ogni scala ai suoi modi.
// Serve per generare le checkbox e recuperare l'etichetta "Scala Madre" del modo estratto.
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

// --- 1. INIZIALIZZAZIONE ---
function initModeCheckboxes() {
    const container = document.getElementById('modesContainer');
    const allModes = new Set();

    Object.values(scalesData).forEach(modeList => {
        modeList.forEach(mode => allModes.add(mode));
    });

    allModes.forEach(modeName => {
        const label = document.createElement('label');
        label.style.fontSize = "0.8rem"; 
        label.innerHTML = `<input type="checkbox" name="modeFilter" value="${modeName}" checked> ${modeName.split(" ")[0]}`; 
        label.title = modeName;
        container.appendChild(label);
    });
}

document.getElementById('toggleModesBtn').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('input[name="modeFilter"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
});

document.getElementById('generateBtn').addEventListener('click', generateRoutine);

// Helper per trovare la scala madre dato un nome di modo (solo per visualizzazione)
function getParentScaleLabel(modeName) {
    for (const [key, modes] of Object.entries(scalesData)) {
        if (modes.includes(modeName)) {
            return scaleLabels[key];
        }
    }
    return "";
}

// --- 2. LOGICA DI GENERAZIONE "TOTAL RANDOM" ---
function generateRoutine() {
    // A. Raccogli le liste degli elementi attivi
    const activeDegrees = Array.from(document.querySelectorAll('input[name="degree"]:checked')).map(cb => parseInt(cb.value));
    const activeModes = Array.from(document.querySelectorAll('input[name="modeFilter"]:checked')).map(cb => cb.value);

    // B. Controllo se c'è almeno un elemento selezionato per categoria
    if (activeDegrees.length === 0 || activeModes.length === 0) {
        alert("Seleziona almeno un Grado e un Modo.");
        return;
    }

    const container = document.getElementById('resultsContainer');
    container.innerHTML = "";
    
    // C. Generazione indipendente
    for (let i = 0; i < 4; i++) {
        // 1. Pesca una NOTA a caso
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        
        // 2. Pesca un GRADO a caso (indipendentemente dal modo)
        const randomDegree = activeDegrees[Math.floor(Math.random() * activeDegrees.length)];
        
        // 3. Pesca un MODO a caso (indipendentemente dal grado)
        const randomMode = activeModes[Math.floor(Math.random() * activeModes.length)];

        // (Opzionale) Recupera il nome della scala madre solo per info visuale
        const parentScaleName = getParentScaleLabel(randomMode);

        const html = `
            <div class="result-card-mini">
                <div class="card-header">
                    <span class="note-mini">${randomNote}</span>
                    <span class="degree-badge">${romanize(randomDegree)}</span>
                </div>
                <div class="card-body">
                    <div class="scale-mini">${parentScaleName}</div>
                    <div class="mode-mini">${randomMode}</div>
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

initModeCheckboxes();
