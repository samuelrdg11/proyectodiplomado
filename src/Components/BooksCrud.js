import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { Table } from 'react-bootstrap';
import BookModal from './BookModal';
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'

const BooksCrud = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('');
  const [user, setUser] = React.useState(null)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser)
    } else {
      navigate("/")
    }
  }, [navigate])

  useEffect(() => {
    const unsubscribe = db.collection('books').onSnapshot(snapshot => {
      const booksData = [];
      snapshot.forEach(doc => booksData.push({ id: doc.id, ...doc.data() }));
      console.log(booksData)
      setBooks(booksData);
    });

    return unsubscribe;
  }, []);

  const handleAddBook = () => {
    setEditId(null);
    setShowModal(true);
  };

  const handleEditBook = book => {
    setEditId(book.id);
    setShowModal(true);
  };

  const handleDeleteBook = bookId => {
    db.collection('books').doc(bookId).delete();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='container'>
      {
        user && (
          <>
            <input
              type="text"
              className="inputFiltrar form-control"
              placeholder="Titulo o autor del libro"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="container">
              <button className='botonAñadir btn btn-sm' onClick={handleAddBook}>Agregar libro</button>
              <Table className='tableBooks' responsive striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Genero</th>
                    <th>Portada</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {books.filter((book) => {
                    return search.toLocaleLowerCase() === '' ? 
                    book : book.autor.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || book.titulo.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                  }).map((book) => (
                    <tr key={book.id}>
                      <td>{book.titulo}</td>
                      <td>{book.autor}</td>
                      <td>{book.genero}</td>
                      <td> <img src={book.base64Portada} width={70} height={70}></img> </td>
                      <td>
                        <button className='botonEditar btn btn-sm' onClick={() => handleEditBook(book)}>Editar</button>
                        <button className='botonEliminar btn btn-sm' onClick={() => handleDeleteBook(book.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <BookModal showModal={showModal} handleCloseModal={handleCloseModal} editId={editId} />
            </div>
          </>
        )}
    </div>
  );
};

export default BooksCrud;