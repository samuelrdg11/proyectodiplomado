import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { Table, Button, Row, Col } from 'react-bootstrap';
import BookModal from './BookModal';

const BooksCrud = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = db.collection('books').onSnapshot(snapshot => {
      const booksData = [];
      snapshot.forEach(doc => booksData.push({ id: doc.id, ...doc.data() }));
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
    <>

    <div className='container'>
      <input
        type="text"
        className="inputFiltrar form-control"
        placeholder="Titulo o autor del libro"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
    <div className="container">
      <button className='botonAñadir btn btn-sm' onClick={handleAddBook}>Agregar libro</button>
      <Table className='tableBooks' responsive striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Genero</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {books.filter((book) => {
          return search.toLocaleLowerCase() === '' ? book : book.autor.includes(search) || book.titulo.includes(search)
        }).map((book) => (
          <tr key={book.id}>
            <td>{book.titulo}</td>
            <td>{book.autor}</td>
            <td>{book.genero}</td>
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
  );
};

export default BooksCrud;