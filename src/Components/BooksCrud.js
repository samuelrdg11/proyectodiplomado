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
  <div>
    <div className="input-group flex-nowrap">
      <input
        type="text"
        className="form-control"
        placeholder="Titulo o autor del libro"
        aria-label="Username"
        aria-describedby="addon-wrapping" 
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>
    <div className="container">
    
        <button className='botonAñadir btn btn-sm' onClick={handleAddBook}>Agregar libro</button>
   
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Titulo</th>
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
                <Button variant="primary" onClick={() => handleEditBook(book)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDeleteBook(book.id)}>
                  Eliminar
                </Button>
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