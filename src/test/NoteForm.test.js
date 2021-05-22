import { render, screen } from '@testing-library/react';
import NoteForm from "../NoteForm";

test('should display a create note button', () => {
    render(<NoteForm />)
    const button = screen.getByTestId('note-form-submit')
  
    expect(button).toHaveTextContent('Create Note')
});

test('should display the name placeholder', () => {
    render(<NoteForm />)
    const input = screen.getByTestId('note-name-field');

    expect(input).toHaveAttribute('placeholder', 'Note Name');
});

test('should display the description placeholder', () => {
    render(<NoteForm />)
    const input = screen.getByTestId('note-description-field');

    expect(input).toHaveAttribute('placeholder', 'Note Description');
});