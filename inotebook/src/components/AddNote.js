import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "default",
  });
  const context = useContext(noteContext);
  const { addNote } = context;

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    props.showAlert("success", "Note added successfully");
  };

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h2 className="my-3">Add a Note</h2>
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control "
            id="title"
            name="title"
            aria-describedby="emailHelp"
            minLength={5}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            onChange={handleChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            onChange={handleChange}
          />
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleClick}
          disabled={note.title.length < 5 || note.description.length < 5}
        >
          Add Note
        </button>
      </form>
    </>
  );
};

export default AddNote;
