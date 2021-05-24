import { render, screen, getByTestId } from '@testing-library/react';
import NoteList from '../NoteList';

test('should display nothing when no notes are provided', () => {
    render(<NoteList notes={[]} />)
    const firstNoteName = screen.queryByTestId('test-name-0');

    expect(firstNoteName).toBeNull()
});

test('should display one note when one notes is provided', () => {
    const note = {name: 'test name', description: 'test description'}
    render(<NoteList notes={[note]} />)

    const firstNoteName = screen.queryByTestId('test-name-0');
    expect(firstNoteName).toHaveTextContent("test name");

    const firstNoteDescription = screen.queryByTestId('test-description-0');
    expect(firstNoteDescription).toHaveTextContent("test description");
});

test('should display one note when one notes is provided', () => {
    const firstNote = {name: 'test name 1', description: 'test description 1'}
    const secondNote = {name: 'test name 1', description: 'test description 1'}
    render(<NoteList notes={[firstNote, secondNote]} />)

    const firstNoteName = screen.queryByTestId('test-name-0');
    expect(firstNoteName).toHaveTextContent("test name");

    const firstNoteDescription = screen.queryByTestId('test-description-0');
    expect(firstNoteDescription).toHaveTextContent("test description");


    const secondNoteName = screen.queryByTestId('test-name-1');
    expect(secondNoteName).toHaveTextContent("test name");

    const secondNoteDescription = screen.queryByTestId('test-description-1');
    expect(secondNoteDescription).toHaveTextContent("test description");
});

test('should throw an exception the note array is undefined', () => {
    expect(() => {render(<NoteList />)}).toThrowError();
});