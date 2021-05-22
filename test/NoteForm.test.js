import { render } from "ejs";
import NoteForm from "../NoteForm";

test('should display a create note button', () => {
    render(<NoteForm />)
    const button = screen.getByTestId('note-form-submit')
  
    expect(button).toBeTruthy
    expect(button).toHaveTextContent('Create Note')
});