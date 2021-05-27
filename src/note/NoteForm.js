import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function NoteForm(props) {

    function createNote() {
        if (!props.formData.name || !props.formData.description) return;
        props.createNoteCallback();
        props.setFormDataCallback({name: '', description: ''});
    }

    return (
        <Form>
            <Form.Group>
                <Form.Control data-testid="note-name-field" 
                    onChange={e => props.setFormDataCallback({ 
                        ...props.formData, 
                        'name': e.target.value}
                    )}
                    value={props.formData.name}
                    placeholder="Note Name"/>
            </Form.Group>
            <Form.Group>
                <Form.Control data-testid="note-description-field" 
                    as="textarea" 
                    onChange={e => props.setFormDataCallback({ 
                        ...props.formData, 
                        'description': e.target.value}
                    )}
                    value={props.formData.description}
                    placeholder="Note Description"/>
            </Form.Group>
            <Form.Group>
                <Button data-testid="note-form-submit"
                    onClick={createNote}>
                    Create Note
                </Button>
            </Form.Group> 
        </Form> 
    );
}
  
export default NoteForm;