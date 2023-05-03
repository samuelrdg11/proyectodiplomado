import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { Modal, Button, Form } from 'react-bootstrap';

const BookModal = ({ showModal, handleCloseModal, editId }) => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');

  useEffect(() => {
    if (editId) {
      db.collection('books')
        .doc(editId)
        .get()
        .then(doc => {
          setTitulo(doc.data().titulo);
          setAutor(doc.data().autor);
          setGenero(doc.data().genero);
        });
    }
  }, [editId]);

  const handleSaveBook = () => {
    if (editId) {
      db.collection('books').doc(editId).update({ titulo, autor, genero });
    } else {
      db.collection('books').add({ titulo, autor, genero });
    }
    handleCloseModal();
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title className="text-center">{editId ? 'Editar libro' : 'Agregar libro'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} className="form-control" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Autor</Form.Label>
            <Form.Control type="text" placeholder="Autor" value={autor} onChange={e => setAutor(e.target.value)} className="form-control" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Genero</Form.Label>
            <Form.Control as="textarea" placeholder="Genero" value={genero} onChange={e => setGenero(e.target.value)} className="form-control" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="secondary" onClick={handleCloseModal}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSaveBook}>
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookModal;
