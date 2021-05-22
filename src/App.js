import './App.css';

function App() {
  return (
    <div className="App">
      <input data-testid="note-name-field"/>
      <input data-testid="note-description-field"/>
      <button data-testid="note-form-submit"/>
      <p data-testid="test-name-0">test note</p>
      <p data-testid="test-description-0">test note description</p>
    </div>
  );
}

export default App;
