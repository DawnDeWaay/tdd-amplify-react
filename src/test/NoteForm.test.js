import { render, screen } from '@testing-library/react';
import NoteForm from "../NoteForm";

test('should display a create note button', () => {
    render(<NoteForm />)
    const button = screen.getByTestId('note-form-submit')
  
    expect(button).toHaveTextContent('Create Note')
});