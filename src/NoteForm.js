function NoteForm(props) {
    return (
        <div>
            <input data-testid="note-name-field" placeholder="Note Name"/>
            <input data-testid="note-description-field"/>
            <button data-testid="note-form-submit">Create Note</button>
            <p data-testid="test-name-0">test note</p>
            <p data-testid="test-description-0">test note description</p>      
        </div>
    );
}
  
export default NoteForm;