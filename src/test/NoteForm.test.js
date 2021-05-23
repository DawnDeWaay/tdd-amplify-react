import { render, screen, getByTestId } from '@testing-library/react';
import NoteForm from "../NoteForm";

beforeEach(() => {
    render(<NoteForm notes={[]}/>)
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