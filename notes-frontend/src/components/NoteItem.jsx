function NoteItem({ note, onDelete, onEdit, onPin }) {
  return (
    <article className={`note-card ${note.isPinned ? "note-card-pinned" : ""}`}>
      <div className="note-card-header">
        <h3>{note.title}</h3>

        {note.isPinned && <span className="pin-label">Pinned</span>}
      </div>

      <p>{note.content}</p>

      <div className="note-actions">
        <button className="secondary-button" type="button" onClick={() => onEdit(note)}>
          Edit
        </button>

        <button className="danger-button" type="button" onClick={() => onDelete(note._id)}>
          Delete
        </button>

        <button className="secondary-button" type="button" onClick={() => onPin(note)}>
          {note.isPinned ? "Unpin" : "Pin"}
        </button>
      </div>
    </article>
  );
}

export default NoteItem;
