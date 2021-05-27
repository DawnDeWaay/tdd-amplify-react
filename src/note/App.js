import NoteForm from './NoteForm';
import React, { useState, useEffect } from 'react';
import NoteList from './NoteList';
import Header from './Header';
import { findAll, save, deleteById } from '../common/NoteRepository';
import { withAuthenticator } from '@aws-amplify/ui-react'
import Footer from './Footer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchNotesCallback();
  }, []);

  async function fetchNotesCallback() {
    const notes = await findAll()
    if(notes)
      setNotes(notes);
    else
      setNotes([])
  }

  async function createNote() {
    const newNote = await save(formData);
    const updatedNoteList = [ ...notes, newNote ];
    setNotes(updatedNoteList); 
  }


  async function deleteNoteCallback( id ) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await deleteById(id);
  }

  return (
    <Container>
      <Row>
        <Col md={6}>
          <Header />
        </Col>
      </Row>
      <Row>
        <Col  md={6}>
        <NoteForm notes={notes}  
          formData={formData} 
          setFormDataCallback={setFormData} 
          createNoteCallback={createNote}/>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <NoteList notes={notes}
            deleteNoteCallback={deleteNoteCallback}/>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default withAuthenticator(App)
