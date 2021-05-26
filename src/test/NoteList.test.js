import { render, screen, fireEvent } from '@testing-library/react';
import NoteList from '../NoteList';

const deleteNoteCallback = jest.fn();

const defaultProps = { 
    notes: [],
    deleteNoteCallback: deleteNoteCallback
 };
  
const setup = (props = {}) => {
    const setupProps = { ...defaultProps, ...props};
    return render(<NoteList {...setupProps}/>);
};

test('should display nothing when no notes are provided', () => {
    setup();
    const firstNoteName = screen.queryByTestId('test-name-0');

    expect(firstNoteName).toBeNull()
});

test('should display one note when one notes is provided', () => {
    const note = {name: 'test name', description: 'test description'}
    setup({notes: [note]});

    const firstNoteName = screen.queryByTestId('test-name-0');
    expect(firstNoteName).toHaveTextContent("test name");

    const firstNoteDescription = screen.queryByTestId('test-description-0');
    expect(firstNoteDescription).toHaveTextContent("test description");
});

test('should display one note when one notes is provided', () => {
    const firstNote = {name: 'test name 1', description: 'test description 1'}
    const secondNote = {name: 'test name 1', description: 'test description 1'}
    setup({notes: [firstNote, secondNote]});

    const firstNoteName = screen.queryByTestId('test-name-0');
    expect(firstNoteName).toHaveTextContent("test name");

    const firstNoteDescription = screen.queryByTestId('test-description-0');
    expect(firstNoteDescription).toHaveTextContent("test description");


    const secondNoteName = screen.queryByTestId('test-name-1');
    expect(secondNoteName).toHaveTextContent("test name");

    const secondNoteDescription = screen.queryByTestId('test-description-1');
    expect(secondNoteDescription).toHaveTextContent("test description");
});

test('should delete note when clicked', () => {
    const note = {
        id: 1,
        name: 'test name 1',
        description: 'test description 1'
    }
    const notes = [ note ]
    setup({notes: notes});
    const button = screen.getByTestId('test-button-0');

    fireEvent.click(button)

    expect(deleteNoteCallback.mock.calls.length).toBe(1);
    expect(deleteNoteCallback.mock.calls[0][0]).toStrictEqual(1);
});

test('should throw an exception the note array is undefined', () => {
    expect(() => {render(<NoteList />)}).toThrowError();
});