const notes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

// DATABASE: Mappa ogni scala ai suoi 7 modi in ordine
// Questo serve ancora per sapere che grado è ogni modo e da che scala deriva (per info)
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

// --- 2. LOGICA DI GENERAZIONE SEMPLIFICATA ---
function generateRoutine() {
    // A. Raccogli solo Gradi e Modi (Scale ignorate/rimosse)
    const activeDegrees = Array.from(document.querySelectorAll('input[name="degree"]:checked')).map(cb => parseInt(cb.value));
    const activeModes = Array.from(document.querySelectorAll('input[name="modeFilter"]:checked')).map(cb => cb.value);

    if (activeDegrees.length === 0 || activeModes.length === 0) {
        alert("Seleziona almeno un Grado e un Modo.");
        return;
    }

    // B. Crea il "Pool" validando su TUTTE le scale disponibili
    let validPool = [];

    // Iteriamo su tutte le chiavi del database (major, melodic_minor, harmonic_minor)
    Object.keys(scalesData).forEach(scaleKey => {
        const modesOfThisScale = scalesData[scaleKey];
        
        modesOfThisScale.forEach((modeName, index) => {
            const degree = index + 1; // 0 = I grado, 1 = II grado...

            // CRITERIO DI INCLUSIONE:
            // 1. Il grado del modo è tra quelli scelti?
            // 2. Il nome del modo è tra quelli scelti?
            if (activeDegrees.includes(degree) && activeModes.includes(modeName)) {
                validPool.push({
                    scaleKey: scaleKey, // Ci serve solo per stampare l'info "Scala Maggiore" sulla card
                    degree: degree,
                    modeName: modeName
                });
            }
        });
    });

    if (validPool.length === 0) {
        alert("Nessuna combinazione trovata. Esempio: hai selezionato solo 'I grado' ma solo modi che sono del 'V grado' (come Mixolydian).");
        return;
    }

    // C. Generazione e Rendering
    const container = document.getElementById('resultsContainer');
    container.innerHTML = "";
    
    for (let i = 0; i < 4; i++) {
        const combo = validPool[Math.floor(Math.random() * validPool.length)];
        const note = notes[Math.floor(Math.random() * notes.length)];

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

initModeCheckboxes();
