import { useState, useEffect } from "react"
import Note from "./components/Note"
import Notification from "./components/Notification"
import Footer from "./components/Footer"
import noteService from "./services/notes"

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  // Helper function for showing notifications for a fixed duration
  const showNotification = (setter, message, duration = 5000) => {
    setter(message)
    setTimeout(() => {
      setter(null)
    }, duration)
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }

    noteService
      .create(noteObject)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })
      .catch((error) => {
        let errorMessage = "Note creation failed"
        if (error.response?.data?.error) {
          errorMessage = `Note creation failed: ${error.response.data.error}`
        }
        showNotification(setErrorMessage, errorMessage)
      })
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      })
      .catch((error) => {
        showNotification(
          setErrorMessage,
          `Note '${note.content}' was already removed from server`
        )
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const handleRemove = (event) => {
    const id = event.target.value
    const note = notes.find((n) => n.id === id)
    if (window.confirm(`Delete note? ${note.content}`)) {
      noteService
        .remove(id)
        .then(() => {
          setNotes(notes.filter((n) => n.id !== id))
          showNotification(setSuccessMessage, `Deleted ${note.content}`)
        })
        .catch((error) => {
          showNotification(
            setErrorMessage,
            `Failed to delete note ${note.content}`
          )
        })
    }
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} type={"error"} />
      <Notification message={successMessage} type={"success"} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
            handleRemove={handleRemove}
            id={note.id}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
