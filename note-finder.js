// --- NUOVA STRUTTURA DATI PER LE NOTE ---

// Helper per generare un range cromatico di note nel formato di VexFlow (es. "c#/4")
function generateNoteRange(startNote, endNote) {
    const allNotes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    const range = [];

    let [startName, startOctave] = startNote.split('/');
    let [endName, endOctave] = endNote.split('/');
    startOctave = parseInt(startOctave);
    endOctave = parseInt(endOctave);

    let currentIndex = allNotes.indexOf(startName.toLowerCase());
    let currentOctave = startOctave;

    while (currentOctave < endOctave || (currentOctave === endOctave && currentIndex <= allNotes.indexOf(endName.toLowerCase()))) {
        const note = allNotes[currentIndex];
        range.push(`${note}/${currentOctave}`);

        currentIndex++;
        if (currentIndex >= allNotes.length) {
            currentIndex = 0;
            currentOctave++;
        }
    }
    return range;
}

// Definiamo i range per ogni corda del basso
const stringNotes = {
    "B": generateNoteRange('b/1', 'g/3'),
    "E": generateNoteRange('e/2', 'c/4'),
    "A": generateNoteRange('a/2', 'f/4'),
    "D": generateNoteRange('d/3', 'a#/4'),
    "G": generateNoteRange('g/3', 'd#/5')
};

// --- FUNZIONI PRINCIPALI ---

// Funzione per mostrare la nota e disegnarla sul pentagramma
function displayNote(note, stringName) {
    // Formatta il nome della nota per la visualizzazione (es. da "c#/3" a "C#")
    const formattedNoteName = note.split('/')[0].toUpperCase();

    // Aggiorna il testo a schermo
    document.getElementById('note-display').innerText = `Nota: ${formattedNoteName} (Corda: ${stringName})`;

    // Disegna la nota sul pentagramma
    drawNoteOnStaff(note);
}

// Funzione principale che genera la nota casuale
function generateRandomNote() {
    // 1. Scegli una corda a caso
    const strings = Object.keys(stringNotes);
    const randomString = strings[Math.floor(Math.random() * strings.length)];

    // 2. Scegli una nota a caso da quella corda
    const notesOnString = stringNotes[randomString];
    const randomNote = notesOnString[Math.floor(Math.random() * notesOnString.length)];

    // 3. Mostra la nota e disegnala
    displayNote(randomNote, randomString);
}

// --- FUNZIONE DI DISEGNO VEXFLOW (MODIFICATA) ---

function drawNoteOnStaff(noteWithOctave) {
    // Pulisce il contenitore prima di disegnare una nuova nota
    const container = document.getElementById('staff-container');
    container.innerHTML = '';

    // Inizializza VexFlow
    const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;
    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(150, 150); // Dimensioni del pentagramma
    const context = renderer.getContext();

    // Crea il pentagramma con la chiave di basso
    const stave = new Stave(10, 40, 130);
    stave.addClef('bass');
    stave.setContext(context).draw();

    // Crea la nota (la vecchia `noteMap` non serve più!)
    const note = new StaveNote({
        keys: [noteWithOctave],
        duration: "q" // 'q' sta per "quarto" (semiminima)
    });

    // Aggiunge l'alterazione (diesis '#') se presente nel nome
    if (noteWithOctave.includes('#')) {
        note.addModifier(new Accidental("#"));
    }

    // Crea una "voce" e aggiungi la nota
    const voice = new Voice({ num_beats: 1, beat_value: 4 });
    voice.addTickables([note]);

    // Formatta e disegna la voce sul pentagramma
    new Formatter().joinVoices([voice]).format([voice], 100);
    voice.draw(context, stave);
}

// --- EVENT LISTENER ---

// Assicurati che l'event listener per il bottone chiami la funzione corretta
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button'); // Assicurati che l'ID del bottone sia corretto
    if (generateButton) {
        generateButton.addEventListener('click', generateRandomNote);
        // Genera una nota al caricamento della pagina
        generateRandomNote();
    }
});
