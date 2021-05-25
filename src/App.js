import './App.css';
import NoteForm from './NoteForm';
import React, { useState, useEffect } from 'react';
import NoteList from './NoteList';
import Header from './Header';
import localForage from "localforage";

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchNotesCallback();
  }, []);

  function fetchNotesCallback() {
    localForage.getItem('notes').then(function(value) {
      if(value)
        setNotes(value);
      else
        setNotes([])
    });
  }

  function createNote() {
    const updatedNoteList = [ ...notes, formData ];
    setNotes(updatedNoteList);
    localForage.setItem('notes', updatedNoteList);
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
