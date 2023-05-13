import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { Modal, Button } from 'react-bootstrap';
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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setTimeout(() => {
      db.collection('books').doc(selectedBook.id).update({ disponibilidad: !selectedBook.disponibilidad });
      setShowConfirmModal(false);;
      setLoading(false);
    }, 2000); 
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
      {loading && <div className="chargeLoading"><div className="loading"></div></div>}
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
            <div class="col-sm-6 col-md-4 col-lg-3 mt-4">
              <div class="card">
                <img src={book.base64Portada} class="card-img book-cover" alt='caratula'></img>
                <div class="card-body">
                  <h5 class="card-title">{book.titulo}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">{book.autor}</h6>
                  <p class="card-text">{book.genero}</p>
                  <p><strong>{book.disponibilidad ? 'Disponible' : 'Prestado'}</strong> </p>
                  {book.disponibilidad ?

                    <div className='mb-4'> <button className='btnPrestamo btn btn-sm' onClick={() => borrowBook(book)}>Prestar</button></div>
                    :
                    <div className='mb-4'><button className='btnDevolucion btn btn-sm' onClick={() => borrowBook(book)}>Devolver</button></div>
                  }
                  <button className='botonEditar btn btn-sm' onClick={() => editBook(book)}>Editar</button>
                  <button className='botonEliminar btn btn-sm' onClick={() => deleteBook(book.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
          <BookModal showModal={modalAddBook} handleCloseModal={closeModalAddBook} editId={editId} />
        </div >
      </div>
    </>
  );
};

export default BooksCrud;