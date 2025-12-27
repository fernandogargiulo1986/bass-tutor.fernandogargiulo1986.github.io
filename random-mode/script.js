const notes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

// Mappa dei modi per ogni tipo di scala
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
    melodic_minor: "Minore Melodica",
    harmonic_minor: "Minore Armonica"
};

document.getElementById('generateBtn').addEventListener('click', generateRandom);

function generateRandom() {
    // 1. Raccogli le opzioni selezionate
    const selectedScales = Array.from(document.querySelectorAll('input[name="scale"]:checked')).map(cb => cb.value);
    const selectedDegrees = Array.from(document.querySelectorAll('input[name="degree"]:checked')).map(cb => cb.value);

    // Validazione
    if (selectedScales.length === 0 || selectedDegrees.length === 0) {
        alert("Seleziona almeno una scala e un grado!");
        return;
    }

    // 2. Logica Random
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    const randomScaleType = selectedScales[Math.floor(Math.random() * selectedScales.length)];
    const randomDegree = parseInt(selectedDegrees[Math.floor(Math.random() * selectedDegrees.length)]);

    // 3. Recupera il nome del modo
    // L'array parte da 0, quindi sottraiamo 1 al grado (es. Grado 1 = indice 0)
    const currentModeName = modeNames[randomScaleType][randomDegree - 1];

    // 4. Aggiorna la UI
    document.getElementById('rootNote').innerText = randomNote;
    document.getElementById('scaleName').innerText = scaleLabels[randomScaleType];
    document.getElementById('degreeNumber').innerText = romanize(randomDegree) + " Grado";
    document.getElementById('modeName').innerText = currentModeName;

    document.getElementById('result').classList.remove('hidden');
}

// Helper per numeri romani
function romanize(num) {
    const lookup = {1:'I', 2:'II', 3:'III', 4:'IV', 5:'V', 6:'VI', 7:'VII'};
    return lookup[num] || num;
}
