import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { Table, Button, Row, Col } from 'react-bootstrap';
import BookModal from './BookModal';

const BooksCrud = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

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
    <div className="container">
      <Row className="my-4">
        <Col md={6} xs={12}>
          <h2>Book Admin</h2>
        </Col>
        <Col md={6} xs={12} className="text-end">
          <Button variant="primary" onClick={handleAddBook}>
            Añadir libro
          </Button>
        </Col>
      </Row>

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
          {books.map(book => (
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
  );
};

export default BooksCrud;
