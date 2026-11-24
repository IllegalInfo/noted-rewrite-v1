function createNoteRow(note) {
  let row = document.createElement("li");
  row.className = "note-row";
  row.dataset.id = note.id;
  if (note.completed) {
    row.classList.add("completed");
  }

  let doneLabel = document.createElement("label");
  doneLabel.className = "done-toggle";

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = note.completed;
  checkbox.dataset.action = "toggle";
  checkbox.dataset.id = note.id;

  doneLabel.appendChild(checkbox);
  doneLabel.append("Done");

  let content = document.createElement("div");
  content.className = "note-content";

  let title = document.createElement("h2");
  title.className = "note-title";
  title.textContent = note.title;
  content.appendChild(title);

  if (note.completed) {
    let badge = document.createElement("span");
    badge.className = "done-badge";
    badge.textContent = "Done";
    content.appendChild(badge);
  }

  if (note.body !== "") {
    let body = document.createElement("p");
    body.className = "note-body";
    body.textContent = note.body;
    content.appendChild(body);
  }

  let editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "row-button";
  editButton.textContent = "Edit";
  editButton.dataset.action = "edit";
  editButton.dataset.id = note.id;
  editButton.setAttribute("aria-label", "Edit note: " + note.title);

  let deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "row-button delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = note.id;
  deleteButton.setAttribute("aria-label", "Delete note: " + note.title);

  let actions = document.createElement("div");
  actions.className = "row-actions";
  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  row.appendChild(doneLabel);
  row.appendChild(content);
  row.appendChild(actions);
  return row;
}

function createEditRow(note) {
  let row = document.createElement("li");
  row.className = "note-row editing";

  let form = document.createElement("form");
  form.className = "edit-form";

  let titleField = document.createElement("div");
  titleField.className = "field";

  let titleLabel = document.createElement("label");
  titleLabel.htmlFor = "edit-title";
  titleLabel.textContent = "Title";

  let titleInput = document.createElement("input");
  titleInput.id = "edit-title";
  titleInput.type = "text";
  titleInput.maxLength = 120;
  titleInput.value = note.title;
  titleInput.setAttribute("aria-describedby", "edit-title-error");

  let titleError = document.createElement("p");
  titleError.id = "edit-title-error";
  titleError.className = "field-error";
  titleError.hidden = true;

  titleField.appendChild(titleLabel);
  titleField.appendChild(titleInput);
  titleField.appendChild(titleError);

  let bodyField = document.createElement("div");
  bodyField.className = "field";

  let bodyLabel = document.createElement("label");
  bodyLabel.htmlFor = "edit-body";
  bodyLabel.textContent = "Body";

  let bodyInput = document.createElement("textarea");
  bodyInput.id = "edit-body";
  bodyInput.rows = 3;
  bodyInput.maxLength = 2000;
  bodyInput.value = note.body;

  bodyField.appendChild(bodyLabel);
  bodyField.appendChild(bodyInput);

  let buttons = document.createElement("div");
  buttons.className = "form-actions";

  let cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "secondary-button";
  cancelButton.textContent = "Cancel";
  cancelButton.dataset.action = "cancel";

  let saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.className = "add-note";
  saveButton.textContent = "Save";

  buttons.appendChild(cancelButton);
  buttons.appendChild(saveButton);

  form.appendChild(titleField);
  form.appendChild(bodyField);
  form.appendChild(buttons);
  row.appendChild(form);
  return row;
}

export function render(notes, elements, editingId) {
  elements.list.replaceChildren();
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].id === editingId) {
      elements.list.appendChild(createEditRow(notes[i]));
    } else {
      elements.list.appendChild(createNoteRow(notes[i]));
    }
  }

  if (notes.length === 1) {
    elements.count.textContent = "1 note";
  } else {
    elements.count.textContent = notes.length + " notes";
  }

  elements.emptyMessage.hidden = notes.length > 0;
}
