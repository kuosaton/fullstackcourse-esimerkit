const Note = ({ id, note, toggleImportance, handleRemove }) => {
  const importanceLabel = note.important
    ? "make not important"
    : "make important"

  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportance}>{importanceLabel}</button>
      <button onClick={handleRemove} value={id}>
        delete
      </button>
    </li>
  )
}

export default Note
