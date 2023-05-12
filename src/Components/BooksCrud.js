import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { Card, Modal, Button } from 'react-bootstrap';
import BookModal from './BookModal';
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'

const BooksCrud = () => {
  const [books, setBooks] = useState([]);
  const [modalAddBook, setModalAddBook] = useState(false);
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('');
  const [user, setUser] = React.useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
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
      setBooks(booksData);
    });

    return unsubscribe;
  }, []);

  const addBook = () => {
    setEditId(null);
    setModalAddBook(true);
  };

  const editBook = book => {
    setEditId(book.id);
    setModalAddBook(true);
  };

  const deleteBook = bookId => {
    db.collection('books').doc(bookId).delete();
  };

  const closeModalAddBook = () => {
    setModalAddBook(false);
  };
  const closeModalConfirmation = () => {
    setShowConfirmModal(false);
  };

  const borrowBook = book => {
    setSelectedBook(book);
    setShowConfirmModal(true);
  };

  const confirmBorrowBook = () => {
    db.collection('books').doc(selectedBook.id).update({ disponibilidad: !selectedBook.disponibilidad });
    setShowConfirmModal(false);
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
      <div>
        <button className='botonAñadir btn btn-sm' onClick={addBook}>Agregar libro</button>
        <Modal show={modalAddBook} onHide={closeModalAddBook}>
          <BookModal onClose={closeModalAddBook} editId={editId} />
        </Modal>
        {showConfirmModal && (
          <Modal show={showConfirmModal} onHide={closeModalConfirmation}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedBook && selectedBook.disponibilidad ? 'Confirmar préstamo' : 'Confirmar devolución'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Estás seguro de que quieres {selectedBook && selectedBook.disponibilidad ? 'tomar prestado' : 'devolver'} el libro <strong>{selectedBook && selectedBook.titulo}</strong>?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModalConfirmation}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={confirmBorrowBook}>
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
      <div className="container">
        <div className="row">
          {books.filter((book) => {
            return search.toLocaleLowerCase() === '' ?
              book : book.autor.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || book.titulo.toLocaleLowerCase().includes(search.toLocaleLowerCase())
          }).map((book) => (
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={book.base64Portada} />
              <Card.Body>
                <Card.Title>{book.titulo}</Card.Title>
                <Card.Text>{book.autor}</Card.Text>
                <Card.Text>{book.genero}</Card.Text>
                <Card.Text><strong>{book.disponibilidad ? 'Disponible' : 'Prestado'}</strong> </Card.Text>
                {book.disponibilidad ?
                  <Card.Text> <Button variant="success" onClick={() => borrowBook(book)}>Prestar</Button></Card.Text>
                  :
                  <Card.Text><Button variant="secondary" onClick={() => borrowBook(book)}>Devolver</Button></Card.Text>
                }
                <button className='botonEditar btn btn-sm' onClick={() => editBook(book)}>Editar</button>
                <button className='botonEliminar btn btn-sm' onClick={() => deleteBook(book.id)}>Eliminar</button>
              </Card.Body>
            </Card>
          ))}
          <BookModal showModal={modalAddBook} handleCloseModal={closeModalAddBook} editId={editId} />
        </div >
      </div>
    </>
  );
};

export default BooksCrud;