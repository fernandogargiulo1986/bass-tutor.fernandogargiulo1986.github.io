const notes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

const modeNames = {
    major: [
        "Ionian (Maggiore)", "Dorian", "Phrygian", "Lydian", 
        "Mixolydian", "Aeolian (Minore)", "Locrian"
    ],
    melodic_minor: [
        "Minore Melodica", "Dorian b2", "Lydian Augmented", "Lydian Dominant", 
        "Mixolydian b6", "Locrian #2", "Super Locrian (Altered)"
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

document.getElementById('generateBtn').addEventListener('click', generateRoutine);

function generateRoutine() {
    // 1. Raccogli opzioni (una volta sola)
    const selectedScales = Array.from(document.querySelectorAll('input[name="scale"]:checked')).map(cb => cb.value);
    const selectedDegrees = Array.from(document.querySelectorAll('input[name="degree"]:checked')).map(cb => cb.value);

    if (selectedScales.length === 0 || selectedDegrees.length === 0) {
        alert("Per favore seleziona almeno una scala e un grado.");
        return;
    }

    const container = document.getElementById('resultsContainer');
    container.innerHTML = ""; // Pulisci i risultati precedenti
    container.className = "results-grid"; // Applica la classe griglia (definita nel CSS sotto)

    // 2. Cicla 4 volte per generare 4 esercizi
    for (let i = 0; i < 4; i++) {
        // Logica Random
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        const randomScaleType = selectedScales[Math.floor(Math.random() * selectedScales.length)];
        const randomDegree = parseInt(selectedDegrees[Math.floor(Math.random() * selectedDegrees.length)]);
        
        // Calcolo Modo
        const currentModeName = modeNames[randomScaleType][randomDegree - 1];

        // 3. Crea la Card HTML
        const cardHTML = `
            <div class="result-card-mini">
                <div class="card-header">
                    <span class="note-mini">${randomNote}</span>
                    <span class="degree-badge">${romanize(randomDegree)}</span>
                </div>
                <div class="card-body">
                    <div class="scale-mini">${scaleLabels[randomScaleType]}</div>
                    <div class="mode-mini">${currentModeName}</div>
                </div>
            </div>
        `;
        
        container.innerHTML += cardHTML;
    }
    
    // Mostra il contenitore (rimuove "hidden" se c'era)
    container.classList.remove('hidden');
}

function romanize(num) {
    const lookup = {1:'I', 2:'II', 3:'III', 4:'IV', 5:'V', 6:'VI', 7:'VII'};
    return lookup[num] || num;
}
