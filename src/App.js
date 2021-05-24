import './App.css';
import NoteForm from './NoteForm';
import React, { useState } from 'react';
import NoteList from './NoteList';
import Header from './Header';

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });

  return (
    <div className="App">
      <Header />
      <NoteForm notes={notes}  
        formData={formData} 
        setFormDataCallback={setFormData} 
        setNotesCallback={setNotes}/>
      <NoteList notes={notes}/>
    </div>
  );
}

export default App;
