export function validateTitle(title) {
  if (title === "") {
    return "Title is required.";
  }
  if (title.length > 120) {
    return "Title must be 120 characters or fewer.";
  }
  return "";
}

export function createNote(notes, title, body) {
  let now = new Date().toISOString();

  let topPosition = 0;
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].position <= topPosition) {
      topPosition = notes[i].position - 1;
    }
  }

  let note = {
    id: crypto.randomUUID(),
    title: title,
    body: body,
    completed: false,
    priority: "medium",
    position: topPosition,
    createdAt: now,
    updatedAt: now,
  };

  return [note, ...notes];
}

export function toggleNote(notes, id) {
  return notes.map(function (note) {
    if (note.id !== id) {
      return note;
    }
    return { ...note, completed: !note.completed, updatedAt: new Date().toISOString() };
  });
}

export function deleteNote(notes, id) {
  return notes.filter(function (note) {
    return note.id !== id;
  });
}

export function sortNotes(notes) {
  return [...notes].sort(function (a, b) {
    if (a.position !== b.position) {
      return a.position - b.position;
    }
    return a.createdAt.localeCompare(b.createdAt);
  });
}
