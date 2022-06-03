import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries'

const Authors = ({show, token}) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)
  const [setBirthYear] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()

    const bornInt = parseInt(born)
    setBirthYear({ variables: { name, setBornTo: bornInt } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th />
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {token && (
        <>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              name
              <select
                value={name}
                onChange={({ target }) => setName(target.value)}
                required
              >
                <option value="" disabled>
                  Select an author
                </option>
                {authors.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              born
              <input
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </>
      )}
    </div>
  )
}

export default Authors
