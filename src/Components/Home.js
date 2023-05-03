import React from 'react'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import LogIn from './LogIn'
import BooksCrud from './BooksCrud'

const Home = () => {
  const [user, setUser] = React.useState(null)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser)
    } else {
      navigate("/")
    }
  }, [navigate])

  return (
    <div>
      {
        user && (
          <h1>Bienvenido</h1>
          )
      }
    </div>
  )
}

export default Home