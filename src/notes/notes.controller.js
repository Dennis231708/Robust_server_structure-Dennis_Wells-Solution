const notes = require('../data/notes-data');

function create(req, res, next) {
    const { data: { text } = {} } = req.body;

    if (!text) {
        res.status(400).json({ message: "Text is required to create a note" });
        return;
    }

    try {
        const newNote = {
            id: notes.length + 1,
            text,
        };
        notes.push(newNote);
        res.status(201).json({ data: newNote });
    } catch (error) {
        res.status(500).json({ message: "Failed to create the note" });
    }
}


function read(req, res, next) {
    const noteId = Number(req.params.noteId);
    const foundNote = notes.find((note) => note.id === noteId);

    if (foundNote) {
        res.json({ data: foundNote });
    } else {
        res.status(404).json({ message: `Note not found with id: ${noteId}` });
    }
}


function update(req, res, next) {
    const noteId = Number(req.params.noteId);
    const foundNote = notes.find((note) => note.id === noteId);

    if (!req.body.hasOwnProperty("data") || !req.body.data.hasOwnProperty("text") || req.body.data.text.trim() === "") {
        next({
            status: 400,
            message: "Bad request: Missing or empty text property",
        });
        return;
    }

    if (foundNote) {
        const { text } = req.body.data;
        foundNote.text = text;
        res.json({ data: foundNote });
    } else {
        next({
            status: 404,
            message: `Note id not found: ${noteId}`,
        });
    }
}

function noteExists(req, res, next) {
    const { noteId } = req.params;
    const foundNote = notes.find((note) => note.id === Number(noteId));

    if (foundNote) {
        // Call the next middleware
        next();
    } else {
        // Send a 404 error response
        next({
            status: 404,
            message: `Note id not found: ${noteId}`,
        });
    }
}



function remove(req, res, next) {
    const noteId = Number(req.params.noteId);
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex !== -1) {
        const deletedNote = notes.splice(noteIndex, 1);
        res.status(204).end();
    } else {
        next({
            status: 404,
            message: `Note id not found: ${noteId}`,
        });
    }
}


function list(req, res) {
    res.json({ data: notes });
}

module.exports = {
    create,
    read,
    update,
    delete: [noteExists, remove],
    list,
};
