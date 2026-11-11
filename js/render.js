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

  let deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = note.id;
  deleteButton.setAttribute("aria-label", "Delete note: " + note.title);

  row.appendChild(doneLabel);
  row.appendChild(content);
  row.appendChild(deleteButton);
  return row;
}

export function render(notes, elements) {
  elements.list.replaceChildren();
  for (let i = 0; i < notes.length; i++) {
    elements.list.appendChild(createNoteRow(notes[i]));
  }

  if (notes.length === 1) {
    elements.count.textContent = "1 note";
  } else {
    elements.count.textContent = notes.length + " notes";
  }

  elements.emptyMessage.hidden = notes.length > 0;
}
