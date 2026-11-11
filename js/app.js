import { validateTitle, createNote, toggleNote, deleteNote, sortNotes } from "./notes.js";
import { render } from "./render.js";

let notes = [];

let form = document.querySelector(".create-card");
let titleInput = document.querySelector("#note-title");
let bodyInput = document.querySelector("#note-body");
let titleError = document.querySelector("#title-error");
let status = document.querySelector(".status");

let elements = {
  list: document.querySelector(".notes-list"),
  count: document.querySelector(".note-count"),
  emptyMessage: document.querySelector(".empty-message"),
};

function update(newNotes) {
  notes = sortNotes(newNotes);
  render(notes, elements);
}

function announce(message) {
  status.textContent = message;
}

function showTitleError(message) {
  titleError.textContent = message;
  titleError.hidden = message === "";
  titleInput.setAttribute("aria-invalid", message === "" ? "false" : "true");
}

function addNote() {
  let title = titleInput.value.trim();
  let body = bodyInput.value;

  let error = validateTitle(title);
  showTitleError(error);
  if (error !== "") {
    titleInput.focus();
    return;
  }

  update(createNote(notes, title, body));
  form.reset();
  titleInput.focus();
  announce("Note added.");
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  addNote();
});

form.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    addNote();
  }
});

titleInput.addEventListener("input", function () {
  if (!titleError.hidden) {
    showTitleError("");
  }
});

elements.list.addEventListener("change", function (event) {
  if (event.target.dataset.action !== "toggle") {
    return;
  }
  let id = event.target.dataset.id;
  update(toggleNote(notes, id));

  let note = notes.find(function (n) { return n.id === id; });
  announce(note.completed ? "Marked done." : "Marked not done.");
  elements.list.querySelector('[data-action="toggle"][data-id="' + id + '"]').focus();
});

elements.list.addEventListener("click", function (event) {
  let button = event.target.closest('[data-action="delete"]');
  if (!button) {
    return;
  }
  let id = button.dataset.id;
  let index = notes.findIndex(function (n) { return n.id === id; });

  if (!window.confirm('Delete "' + notes[index].title + '"?')) {
    return;
  }

  update(deleteNote(notes, id));
  announce("Note deleted.");

  if (notes.length === 0) {
    titleInput.focus();
  } else {
    let next = notes[Math.min(index, notes.length - 1)];
    elements.list.querySelector('[data-action="delete"][data-id="' + next.id + '"]').focus();
  }
});

render(notes, elements);
