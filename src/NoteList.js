function NoteList(props) {

  return (
    <div>
      {
          props.notes.map((note, index) => (
              <div key={'note-' + index}>
                  <p data-testid={"test-name-" + index}>{note.name}</p>
                  <p data-testid={"test-description-" + index}>{note.description}</p> 
                  <button 
                      data-testid={'test-button-' + index}
                      onClick={() => props.deleteNoteCallback(note.id)}>
                      Delete note
                  </button> 
              </div>
          ))
      } 
    </div>
  );
}

export default NoteList;
