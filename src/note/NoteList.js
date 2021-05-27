import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'

function NoteList(props) {

  return (
    <div>
      {
          props.notes.map((note, index) => (
              <div key={'note-' + index}>
                <Card>
                  <Card.Header data-testid={"test-name-" + index}>{note.name}</Card.Header>
                  <Card.Body>
                    <Card.Text data-testid={"test-description-" + index}>
                      {note.description}
                    </Card.Text>
                    <Button variant="secondary" 
                      data-testid={'test-button-' + index}
                      onClick={() => props.deleteNoteCallback(note.id)}>
                        Delete note
                    </Button>
                  </Card.Body>
                </Card>
                <br />
              </div>
          ))
      } 
    </div>
  );
}

export default NoteList;
