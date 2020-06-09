import React, { useState, useEffect } from 'react';
import { withAuthenticator } from 'aws-amplify-react'
import { API, graphqlOperation } from 'aws-amplify'
import { createNote, deleteNote } from './graphql/mutations'
import { listNotes } from './graphql/queries'

function App() {
  const [ notes, setNotes ] = useState([])
  const [ note, setNote ] = useState('')

  useEffect(() => {
    const fetchNotes = async () => {
       const result = await API.graphql(graphqlOperation(listNotes))
       setNotes(result.data.listNotes.items)
    }

    fetchNotes()
  }, [])

  const onAddNote = async e => {
    e.preventDefault()
    
    const input = {
      name: note
    }

    try {
      const response = await API.graphql(graphqlOperation(createNote, { input }))
      const newNote = response.data.createNote
      const updatedNotes = [  newNote, ...notes ]
      setNotes(updatedNotes)
      setNote('')
    } catch (e) {
      console.log(e)
    }
  }

  const onDeleteNote = async itemID => {
    const input = { id: itemID }

    try {
      const result = await API.graphql(graphqlOperation(deleteNote, { input }))
      const deletedNoteID = result.data.deleteNote.id
      const updatedNotes = notes.filter(note => note.id !== deletedNoteID)
      setNotes(updatedNotes)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className = "flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className = "code f2-1">
        Amplify Note Taker
      </h1>
      <form onSubmit = { onAddNote } className = "mb3">
        <input 
          type = "text"
          className = "pa2 f4"
          placeholder = "Write your note"
          onChange = { e => setNote(e.target.value) }
          value = { note } />
        <button className = "pa2 f4" type = "submit">
          Add Note
        </button>
      </form>

      <div>
        { notes.map(item => (
          <div key = { item.id } className = "flex items-center">
            <li className = "list pa1 f3">
              { item.name }
            </li>
            <button 
              className = "bg-transparent bn f4"
              onClick = { () => onDeleteNote(item.id) }>
              <span>&times;</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App, { 
  includeGreetings: true
});
