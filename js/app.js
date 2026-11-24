import { validateTitle, createNote, updateNote, toggleNote, deleteNote, sortNotes } from "./notes.js";
import { render } from "./render.js";

let notes = [];
let editingId = null;

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
  render(notes, elements, editingId);
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

function focusEditButton(id) {
  elements.list.querySelector('[data-action="edit"][data-id="' + id + '"]').focus();
}

function startEdit(id) {
  editingId = id;
  render(notes, elements, editingId);
  document.querySelector("#edit-title").focus();
}

function cancelEdit() {
  let id = editingId;
  editingId = null;
  render(notes, elements, editingId);
  focusEditButton(id);
  announce("Edit cancelled.");
}

function saveEdit() {
  let editTitle = document.querySelector("#edit-title");
  let editBody = document.querySelector("#edit-body");
  let editError = document.querySelector("#edit-title-error");

  let title = editTitle.value.trim();
  let error = validateTitle(title);
  if (error !== "") {
    editError.textContent = error;
    editError.hidden = false;
    editTitle.setAttribute("aria-invalid", "true");
    editTitle.focus();
    return;
  }

  let id = editingId;
  editingId = null;
  update(updateNote(notes, id, title, editBody.value));
  focusEditButton(id);
  announce("Note saved.");
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

elements.list.addEventListener("submit", function (event) {
  event.preventDefault();
  saveEdit();
});

elements.list.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && editingId !== null) {
    cancelEdit();
  }
});

elements.list.addEventListener("click", function (event) {
  let action = event.target.dataset.action;
  let id = event.target.dataset.id;

  if (action === "edit") {
    startEdit(id);
    return;
  }

  if (action === "cancel") {
    cancelEdit();
    return;
  }

  if (action !== "delete") {
    return;
  }

  let index = notes.findIndex(function (n) { return n.id === id; });

  if (!window.confirm('Delete "' + notes[index].title + '"?')) {
    return;
  }

  editingId = null;
  update(deleteNote(notes, id));
  announce("Note deleted.");

  if (notes.length === 0) {
    titleInput.focus();
  } else {
    let next = notes[Math.min(index, notes.length - 1)];
    elements.list.querySelector('[data-action="delete"][data-id="' + next.id + '"]').focus();
  }
});

render(notes, elements, editingId);
