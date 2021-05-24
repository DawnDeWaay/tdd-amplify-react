function NoteForm(props) {
    
    function createNote() {
    if (!props.formData.name || !props.formData.description) return;
    props.setNotesCallback([ ...props.notes, props.formData ]);
    }

    return (
        <div>
            <input data-testid="note-name-field" 
                onChange={e => props.setFormDataCallback({ 
                    ...props.formData, 
                    'name': e.target.value}
                )}
                placeholder="Note Name"/>
            <input data-testid="note-description-field" 
                onChange={e => props.setFormDataCallback({ 
                    ...props.formData, 
                    'description': e.target.value}
                )}
                placeholder="Note Description"/>
            <button data-testid="note-form-submit"
                onClick={createNote}>
                Create Note
            </button> 
        </div> 
    );
}
  
export default NoteForm;