import './App.css';
import React from 'react'
import Home from './Components/Home';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Welcome from './Components/Welcome';
import {auth} from "./firebase";
import { useEffect } from 'react'
import Navbar from './Components/Navbar';
import BooksCrud from './Components/BooksCrud';

function App() {
  const [firebaseUser, setFirebaseUser]=React.useState(false)

  useEffect(()=>{
    auth.onAuthStateChanged(user=>{
      if (user) {
        setFirebaseUser(user)
      }else{
        setFirebaseUser(null)
      }
    })
  },[])
  return firebaseUser!==false ? (
    <div className="App">
      <BrowserRouter>
        <Navbar firebaseUser={firebaseUser}/>
        <Routes>
          <Route path='/' element={ <Welcome />} />
          <Route path='/Home' element={ <Home />} />
          <Route path='/books' element={ <BooksCrud />} />
        </Routes>
      </BrowserRouter>
    </div>
  ):
  (<p className="text-center"><b>¡Cargando...!</b></p>);
}

export default App;