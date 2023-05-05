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
    <div className="navbar navbar-dark bg-dark">
       <Link className='textnavbar navbar-brand' to="/">Data 'Booker'</Link> 
            <div className='d-flex'>
                {
                   props.firebaseUser !==null ?(
                      <Link to="/books" className='botones btn btn-sm'>Book Admin</Link>
                   ):
                   null
                }
                {
                  props.firebaseUser !==null ?(
                    <button className='botones btn btn-sm' onClick={()=>cerrarSesion()}>Cerrar sesión</button>
                  ):
                  (
                    <Link to="/LogIn" className='botones btn btn-sm'>Login</Link>
                  )
                }
            
        </div>
    </div>
  )
}
export default Navbar