'use strict';

window.addEventListener('load', () => {

    if (typeof Vex === 'undefined' || typeof Vex.Flow === 'undefined') {
        console.error("VexFlow library not loaded. Please check the script tag in your HTML.");
        document.getElementById('staff-container').innerHTML = '<p style="color: red; font-size: 0.9em;">Error: Music library (VexFlow) failed to load.</p>';
        return;
    }

    // --- DOM ELEMENT REFERENCES ---
    const noteDisplay = document.getElementById('note-display');
    const staffContainer = document.getElementById('staff-container');
    const intervalSlider = document.getElementById('interval-slider');
    const intervalValueSpan = document.getElementById('interval-value');
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const viewToggle = document.getElementById('view-toggle');

    // --- STATE VARIABLES ---
    let timerId = null;
    let currentInterval = parseFloat(intervalSlider.value) * 1000;
    let currentNoteData = null; // Stores the last generated note object

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

    // --- UI UPDATE FUNCTIONS ---
    function displayCurrentNote() {
        if (!currentNoteData) {
             // Set initial view state on load
            if (viewToggle.checked) {
                staffContainer.style.display = 'flex';
            } else {
                staffContainer.style.display = 'none';
            }
            return;
        };

        // Update text display with new structure
        noteDisplay.innerHTML = `
            <div class="string-display">Corda <strong>${currentNoteData.string}</strong></div>
            <div class="note-name-display">${currentNoteData.formatted}</div>
        `;

        const noteNameElement = document.querySelector('.note-name-display');

        // Update view based on toggle (staff or letter)
        if (viewToggle.checked) {
            staffContainer.style.display = 'flex';
            noteNameElement.classList.add('with-staff');
            drawNoteOnStaff(currentNoteData.note);
        } else {
            staffContainer.style.display = 'none';
            noteNameElement.classList.remove('with-staff');
        }
    }

    // --- CORE LOGIC ---
    function generateRandomNote() {
        const strings = Object.keys(stringNotes);
        const randomString = strings[Math.floor(Math.random() * strings.length)];
        const notesOnString = stringNotes[randomString];
        const randomNote = notesOnString[Math.floor(Math.random() * notesOnString.length)];
        
        currentNoteData = {
            note: randomNote,
            string: randomString,
            formatted: randomNote.split('/')[0].toUpperCase()
        };
        
        displayCurrentNote();
    }
    
    // --- TIMER CONTROL FUNCTIONS ---
    function startAutoGeneration() {
        if (timerId) return;
        startButton.disabled = true;
        stopButton.disabled = false;
        generateRandomNote(); // Generate one immediately
        timerId = setInterval(generateRandomNote, currentInterval);
    }

    function stopAutoGeneration() {
        if (!timerId) return;
        clearInterval(timerId);
        timerId = null;
        startButton.disabled = false;
        stopButton.disabled = true;
    }
    
    function updateInterval() {
        const seconds = parseFloat(intervalSlider.value);
        currentInterval = seconds * 1000;
        intervalValueSpan.textContent = seconds.toFixed(1);
        
        if (timerId) {
            clearInterval(timerId);
            timerId = setInterval(generateRandomNote, currentInterval);
        }
    }

    // --- EVENT LISTENERS AND INITIALIZATION ---
    startButton.addEventListener('click', startAutoGeneration);
    stopButton.addEventListener('click', stopAutoGeneration);
    intervalSlider.addEventListener('input', updateInterval);
    viewToggle.addEventListener('change', displayCurrentNote);

    // Set initial view state on load
    displayCurrentNote();
});

