import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'

const Navbar = (props) => {
  const navigate = useNavigate()
  const cerrarSesion=()=>{
    auth.signOut()
    .then(()=>{
      navigate("/")
    })
  }

  

  return (
    <div className="navbar navbar-dark bg-dark ">
       <Link className='navbar-brand mb-0 h1' to="/">Navbar</Link> 
        <div>
            <div className='d-flex'>
                {
                   props.firebaseUser !==null ?(
                    <Link to="/Filter" className='btn btn-dark btn-sm' >Libros</Link>
                   ):
                   null
                }
                {
                  props.firebaseUser !==null ?(
                    <button className='btn btn-dark btn-sm' onClick={()=>cerrarSesion()}>Cerrar sesión</button>
                  ):(
                    <Link to="/" className='btn btn-dark btn-sm' >Login</Link>
                  )
                }
            </div>
        </div>
    </div>
  )
}
export default Navbar