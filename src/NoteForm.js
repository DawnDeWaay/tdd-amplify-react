function NoteForm(props) {
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
                onClick={() => props.setNotesCallback([ ...props.notes, props.formData ])}>
                Create Note
            </button> 
        </div> 
    );
}
  
export default NoteForm;