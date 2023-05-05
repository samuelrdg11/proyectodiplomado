import React from 'react'
import { useState, useCallback } from 'react'
import { db, auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

const LogIn = () => {

  const [registro, setRegistro] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const guardarDatos = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('¡No ha ingresado el email!')
      return
    }
    if (!password.trim()) {
      setError('¡No ha ingresado la contraseña!')
      return
    }
    if (password.length < 6) {
      setError('¡La contraseña debe tener mínimo 6 caracteres!')
      return
    }
    setError(null)
    if (registro) {
      registrar()
    } else {
      login()
    }
  }

  const login = useCallback(async () => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, password)
      setEmail('')
      setPassword('')
      setError('')
      navigate("/Home")
    }
    catch (error) {
      if (error.code === 'auth/invalid-email') {
        setError('¡El email ingresado no es válido!')
      }
      if (error.code === 'auth/user-not-found') {
        setError('¡El usuario no está registrado!')
      }
      if (error.code === 'auth/wrong-password') {
        setError('¡La contraseña es incorrecta!')
      }

    }

  }, [email, password])

  const registrar = useCallback(async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password)
      await db.collection('usuarios').doc(res.user.email).set(
        {
          email: res.user.email,
          id: res.user.uid
        }
      )
      navigate("/Home")
      await db.collection(res.user.uid).add()
      setEmail('')
      setPassword('')
      setError(null)

    }
    catch (error) {
      if (error.code === 'auth/invalid-email') {
        setError('¡El email ingresado no es válido!')
      }
      if (error.code === 'auth/email-already-in-use') {
        setError('¡El email ingresado ya está registrado!')
      }
      if (error.code === 'auth/wrong-password') {
        setError('¡La contraseña es incorrecta!')
      }
    }
  }, [email, password])

  return (
    <>
      {
        error && (
          <div className='alert alert-warning'>
            {error}
          </div>
        )
      }
      <div className='main'>
        <div className="row justify-content-center">
          <h5 className='text-center mb-3 mt-3'>
            {
              registro ? 'Crea una cuenta' : 'Inicio de sesión'
            }
          </h5>

          <form onSubmit={guardarDatos}>
            <input type="email"
              className='form-control mb-2'
              placeholder='Ingrese su email'
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
            <input type="password"
              className='form-control mb-2'
              placeholder='Ingrese su contraseña'
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
            <div className='d-grid gap-2'>
              <button className='btn btn-primary btn-sm'>
                {
                  registro ? 'Crea una cuenta' : 'Ingreso al sistema'
                }
              </button>
              <button className='botonSwitch btn btn-sm'
                onClick={() => { setRegistro(!registro) }}
                type='button'
              >
                {
                  registro ? '¿Ya estás registrado?' : '¿No tienes cuenta?'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default LogIn