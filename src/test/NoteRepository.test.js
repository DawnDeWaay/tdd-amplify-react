import { save, findAll, deleteById} from '../common/NoteRepository';
import { API } from 'aws-amplify';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation} from '../graphql/mutations';
import { listNotes } from '../graphql/queries';


const mockGraphql = jest.fn();
const id = 'test-id'

beforeEach(() => {
    API.graphql = mockGraphql
});

afterEach(() => {
    jest.clearAllMocks()
});

it('should create a new note', () => {
    const note = {name: 'test name', description: 'test description'}

    save(note)

    expect(mockGraphql.mock.calls.length).toBe(1);
    expect(mockGraphql.mock.calls[0][0]).toStrictEqual(
        { query: createNoteMutation, variables: { input: note } }
    );
})

it('should findAll notes', () => {
    const note = {name: 'test name', description: 'test description'}

    findAll(note)

    expect(mockGraphql.mock.calls.length).toBe(1);
    expect(mockGraphql.mock.calls[0][0]).toStrictEqual({ query: listNotes });
})

it('should delete note by id', () => {
    deleteById(id)

    expect(mockGraphql.mock.calls.length).toBe(1);
    expect(mockGraphql.mock.calls[0][0]).toStrictEqual({ query: deleteNoteMutation, variables: { input: { id } }});
})