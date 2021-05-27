import { render, screen, fireEvent } from '@testing-library/react';
import NoteForm from "../note/NoteForm";

const createNoteCallback = jest.fn();
const setFormDataCallback = jest.fn();
const formData = {name: '', description: ''}

beforeEach(() => {
    render(<NoteForm notes={[]} 
            createNoteCallback={createNoteCallback}
            setFormDataCallback={setFormDataCallback}
            formData={formData}/>)
});

test('should display a create note button', () => {
    const button = screen.getByTestId('note-form-submit')
  
    expect(button).toHaveTextContent('Create Note')
});

test('should display the name placeholder', () => {
    const input = screen.getByTestId('note-name-field');

    expect(input).toHaveAttribute('placeholder', 'Note Name');
});

test('should display the description placeholder', () => {
    const input = screen.getByTestId('note-description-field');

    expect(input).toHaveAttribute('placeholder', 'Note Description');
});

test('should require name and description', () => {
    formData.name = "";
    formData.description = "";

    const button = screen.getByTestId('note-form-submit');

    fireEvent.click(button)

    expect(createNoteCallback.mock.calls.length).toBe(0);
});

test('should require name when description provided', () => {
    formData.name = "";
    formData.description = "test description";

    const button = screen.getByTestId('note-form-submit');

    fireEvent.click(button);

    expect(createNoteCallback.mock.calls.length).toBe(0);
});

test('should require description when name provided', () => {
    formData.name = "test name";
    formData.description = "";

    const button = screen.getByTestId('note-form-submit');

    fireEvent.click(button);

    expect(createNoteCallback.mock.calls.length).toBe(0);
});

test('should add a new note when name and description are provided', () => {
    formData.name = "test name";
    formData.description = "test description";

    const button = screen.getByTestId('note-form-submit');

    fireEvent.click(button);

    expect(createNoteCallback.mock.calls.length).toBe(1);
});

test('should add a new note when name and description are provided', () => {
    formData.name = "test name";
    formData.description = "test description";

    const button = screen.getByTestId('note-form-submit');

    fireEvent.click(button);

    expect(setFormDataCallback).toHaveBeenCalledWith({name: '', description: ''});
});