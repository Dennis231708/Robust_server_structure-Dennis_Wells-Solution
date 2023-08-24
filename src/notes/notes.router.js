const express = require('express');
const notesController = require('../notes/notes.controller');

const router = express.Router();

router.get('/:noteId', notesController.read);
router.get('/', notesController.list);
router.post('/', notesController.create);
router.put('/:noteId', notesController.update);
router.delete('/:noteId', notesController.delete);

module.exports = router;
