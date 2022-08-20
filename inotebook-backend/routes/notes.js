const express = require("express");
const router = express.Router();
const fetchuser = require("../middleWare/fetchuser.js");
const { body, validationResult } = require("express-validator");
const Notes = require("../models/Notes.js");

// Route 1: getting all notes through /api/notes/getAllNotes login required
router.get("/getAllNotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});

// Route 2: Adding a new note /api/notes/getAllNotes login required
router.post(
  "/addnotes",
  [
    body(
      "title",
      "Title of the notes should be of atleast 3 characters"
    ).isLength({
      min: 3,
    }),
    body("description", "description should be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  fetchuser,
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({ title, description, tag, user: req.user.id });
      const savedNotes = await note.save();
      res.json(savedNotes);
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error!");
    }
  }
);

// Route 3: Adding a new note /api/notes/getAllNotes login required
router.put("/update/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(400).send("Unable to update!");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("unable to update the note!");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error!");
  }
});

// Route 3: Adding a new note /api/notes/getAllNotes login required
router.delete("/deleteNote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(400).send("Note does not exist!");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("unable to delete!");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error!");
  }
});

module.exports = router;
