import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import NoteItem from "../components/NoteItem";

const initialForm = {
  title: "",
  content: "",
  isPinned: false,
};

function Notes(){

  const [notes,setNotes] = useState([]);
  const [page,setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const [form,setForm] = useState(initialForm);
  const [editingId,setEditingId] = useState(null);
  const [pendingDeleteId,setPendingDeleteId] = useState(null);
  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(false);


  const fetchNotes=async()=>{
    setLoading(true)
    setMessage("")

    try {
      let res =await API.get(`/notes?page=${page}&limit=5`)
      setNotes(res.data.data)
      setTotalPages(res.data.totalPages || 1)
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load notes")
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchNotes();
  },[page]);



  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
   

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (editingId) {
        await API.put(`/notes/${editingId}`, form);
      } else {
        await API.post("/notes", form);
      }

      resetForm();
      fetchNotes();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save note");
    }
  }

  const deleteNote = async (id) => {
    setPendingDeleteId(id);
  }

  const confirmDelete = async () => {
    try {
      await API.delete(`/notes/${pendingDeleteId}`);
      if (editingId === pendingDeleteId) {
        resetForm();
      }
      setPendingDeleteId(null);
      fetchNotes();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not delete note");
    }
  }

  const cancelDelete = () => {
    setPendingDeleteId(null);
  }

  const updateNote = async (note) => {
    setEditingId(note._id);
    setForm({
      title: note.title,
      content: note.content,
      isPinned: note.isPinned,
    });
  }



  const togglePin = async (note) => {
    try {
      await API.put(`/notes/${note._id}`,{
        isPinned:!note.isPinned
      });

      fetchNotes();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update note");
    }
  }

  return (

    <>
      <Navbar />

      <main className="notes-page">
        <section className="notes-panel">
          <div>
            <p className="eyebrow">Personal notebook</p>
            <h1>My Notes</h1>
          </div>

          <form className="note-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input
                name="title"
                value={form.title}
                placeholder="Note title"
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Content
              <textarea
                name="content"
                value={form.content}
                placeholder="Write something worth remembering"
                onChange={handleChange}
                required
              />
            </label>


            <label className="checkbox-label">
              <input
                name="isPinned"
                type="checkbox"
                checked={form.isPinned}
                onChange={handleChange}
              />
              Pin this note
            </label>
         
         <div className="form-actions">
              <button type="submit">{editingId ? "Update note" : "Add note"}</button>

              {editingId && (
                <button className="secondary-button" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div> 
          </form>
        </section>

        {message && <p className="status-message">{message}</p>}
        {loading && <p className="status-message">Loading notes...</p>}


        <section className="notes-grid" aria-label="Saved notes">
          {!loading && notes.length === 0 && (
            <p className="empty-state">No notes yet. Add one when a thought lands.</p>
          )}

          {notes.map((note)=>(
            <NoteItem
              key={note._id}
              note={note}
              onDelete={deleteNote}
              onEdit={updateNote}
              onPin={togglePin}
            />
          ))}
        </section>

        <div className="pagination">
          <button
            className="secondary-button"
            type="button"
            disabled={page <= 1}
            onClick={()=>setPage(page-1)}
          >
            Prev
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            className="secondary-button"
            type="button"
            disabled={page >= totalPages}
            onClick={()=>setPage(page+1)}
          >
            Next
          </button>
        </div>

        {pendingDeleteId && (
          <div className="modal-backdrop" role="presentation">
            <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title">
              <h2 id="delete-title">Delete note?</h2>
              <p>This note will be permanently removed.</p>

              <div className="confirm-actions">
                <button className="danger-button" type="button" onClick={confirmDelete}>
                  Delete
                </button>

                <button className="secondary-button" type="button" onClick={cancelDelete}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default Notes;
