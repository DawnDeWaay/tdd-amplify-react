import './App.css';
import NoteForm from './NoteForm';
import React, { useState, useEffect } from 'react';
import NoteList from './NoteList';
import Header from './Header';
import { findAll, save } from './NoteRepository';

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
    const updatedNoteList = [ ...notes, formData ];
    setNotes(updatedNoteList);
    await save(formData);
  }

  return (
    <div className="App">
      <Header />
      <NoteForm notes={notes}  
        formData={formData} 
        setFormDataCallback={setFormData} 
        createNoteCallback={createNote}/>
      <NoteList notes={notes}/>
    </div>
  );
}

export default App;
