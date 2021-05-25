import localForage from "localforage";

export async function findAll(){
    return await localForage.getItem('notes');
};

export async function save(note){
    const notes = await localForage.getItem('notes');
    if(notes) 
        await localForage.setItem('notes', [...notes, note])
    else
        await localForage.setItem('notes', [note])
}