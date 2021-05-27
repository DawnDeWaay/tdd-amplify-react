import '../App.css';
import NoteForm from './NoteForm';
import React, { useState, useEffect } from 'react';
import NoteList from './NoteList';
import Header from './Header';
import { findAll, save, deleteById } from '../common/NoteRepository';
import { withAuthenticator } from '@aws-amplify/ui-react'
import Footer from './Footer';

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
    <div className="App">
      <Header />
      <NoteForm notes={notes}  
        formData={formData} 
        setFormDataCallback={setFormData} 
        createNoteCallback={createNote}/>
      <NoteList notes={notes}
        deleteNoteCallback={deleteNoteCallback}/>
      <Footer />
    </div>
  );
}

export default withAuthenticator(App)
