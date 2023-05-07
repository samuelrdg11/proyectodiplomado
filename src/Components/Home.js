import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Card from "./Card";

const Home = () => {
  const [user, setUser] = React.useState(null);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
    } else {
      navigate("/");
    }
    const unsubscribe = db.collection("books").onSnapshot((snapshot) => {
      const booksData = [];
      snapshot.forEach((doc) => booksData.push({ id: doc.id, ...doc.data() }));
      setBooks(booksData);
      console.log(booksData);
    });

    return unsubscribe;
  }, [navigate]);

  return (
    <div className="container">
      <h1 style={{ padding: '20px'}}>Lista de libros disponibles</h1>
      <div className="row">
        {books.map((item) => (
          <div className="col-md-4">
            <Card
              key={item.id}
              title={item.titulo}
              genero={item.genero}
              imageUrl={item.base64Portada}
              disponible={item.disponibilidad}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
