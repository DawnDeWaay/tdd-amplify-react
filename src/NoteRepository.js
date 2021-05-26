import { API } from 'aws-amplify';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation} from './graphql/mutations';

export async function findAll(){
    const apiData = await API.graphql({ query: listNotes });
    return apiData.data.listNotes.items;
};

export async function save(note){
    const apiData = await API.graphql({ query: createNoteMutation, variables: { input: note } });
    return apiData.data.createNote;
}