'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENT REFERENCES ---
    const noteDisplay = document.getElementById('note-display');
    const staffContainer = document.getElementById('staff-container');
    const intervalSlider = document.getElementById('interval-slider');
    const intervalValueSpan = document.getElementById('interval-value');
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');

    // --- STATE VARIABLES ---
    let timerId = null; // Stores the ID of the setInterval timer
    let currentInterval = parseFloat(intervalSlider.value) * 1000; // Default interval in milliseconds

    // --- DATA STRUCTURE FOR BASS STRINGS AND NOTES ---
    function generateNoteRange(startNote, endNote) {
        const allNotes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
        const range = [];
        let [startName, startOctaveStr] = startNote.split('/');
        let [endName, endOctaveStr] = endNote.split('/');
        let currentOctave = parseInt(startOctaveStr, 10);
        const endOctave = parseInt(endOctaveStr, 10);
        let currentIndex = allNotes.indexOf(startName.toLowerCase());
        const endIndex = allNotes.indexOf(endName.toLowerCase());
        while (currentOctave < endOctave || (currentOctave === endOctave && currentIndex <= endIndex)) {
            range.push(`${allNotes[currentIndex]}/${currentOctave}`);
            currentIndex++;
            if (currentIndex >= allNotes.length) {
                currentIndex = 0;
                currentOctave++;
            }
        }
        return range;
    }

    const stringNotes = {
        "B": generateNoteRange('b/1', 'g/3'),
        "E": generateNoteRange('e/2', 'c/4'),
        "A": generateNoteRange('a/2', 'f/4'),
        "D": generateNoteRange('d/3', 'a#/4'),
        "G": generateNoteRange('g/3', 'd#/5')
    };

    // --- VEXFLOW RENDERING FUNCTION ---
    function drawNoteOnStaff(noteWithOctave) {
        staffContainer.innerHTML = '';
        const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;
        const renderer = new Renderer(staffContainer, Renderer.Backends.SVG);
        renderer.resize(150, 150);
        const context = renderer.getContext();
        const stave = new Stave(10, 40, 130);
        stave.addClef('bass').setContext(context).draw();
        const note = new StaveNote({ keys: [noteWithOctave], duration: "q" });
        if (noteWithOctave.includes('#')) {
            note.addModifier(new Accidental("#"));
        }
        const voice = new Voice({ num_beats: 1, beat_value: 4 });
        voice.addTickables([note]);
        new Formatter().joinVoices([voice]).format([voice], 100);
        voice.draw(context, stave);
    }

    // --- CORE LOGIC ---
    function generateRandomNote() {
        const strings = Object.keys(stringNotes);
        const randomString = strings[Math.floor(Math.random() * strings.length)];
        const notesOnString = stringNotes[randomString];
        const randomNote = notesOnString[Math.floor(Math.random() * notesOnString.length)];
        const formattedNoteName = randomNote.split('/')[0].toUpperCase();
        noteDisplay.innerHTML = `Corda <strong>${randomString}</strong> &mdash; Nota <strong>${formattedNoteName}</strong>`;
        drawNoteOnStaff(randomNote);
    }
    
    // --- TIMER CONTROL FUNCTIONS ---
    function startAutoGeneration() {
        if (timerId) return; // Already running
        startButton.disabled = true;
        stopButton.disabled = false;
        generateRandomNote(); // Generate one immediately
        timerId = setInterval(generateRandomNote, currentInterval);
    }

    function stopAutoGeneration() {
        if (!timerId) return; // Already stopped
        clearInterval(timerId);
        timerId = null;
        startButton.disabled = false;
        stopButton.disabled = true;
    }
    
    function updateInterval() {
        const seconds = parseFloat(intervalSlider.value);
        currentInterval = seconds * 1000;
        intervalValueSpan.textContent = seconds.toFixed(1);
        
        // If the timer is running, restart it with the new interval
        if (timerId) {
            clearInterval(timerId);
            timerId = setInterval(generateRandomNote, currentInterval);
        }
    }

    // --- EVENT LISTENERS AND INITIALIZATION ---
    startButton.addEventListener('click', startAutoGeneration);
    stopButton.addEventListener('click', stopAutoGeneration);
    intervalSlider.addEventListener('input', updateInterval);

    // Generate the first note on page load for a better initial experience
    generateRandomNote();
});

