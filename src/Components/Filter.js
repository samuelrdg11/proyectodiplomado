import React, {useState} from "react";
import { Table } from "react-bootstrap";

const Libros = [
  {
    id: 1,
    Titulo: "el ancho mundo",
    Autor: "pierre Lemaitre",
    Genero: "Novela",
  },
  {
    id: 2,
    Titulo: "el cuco de cristal",
    Autor: "javier Castillo",
    Genero: "Novela negra",
  },
  {
    id: 3,
    Titulo: "las formas del querer",
    Autor: "ines Martin Rodrigo",
    Genero: "Novela",
  },
];
const Filter = () => {
  const [search, setSearch] = useState('');
  

  return(<div>
    {" "}
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

    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>Titulo</th>
          <th>Autor</th>
          <th>Genero</th>
        </tr>
      </thead>
      <tbody>
        {Libros.filter((book) => {
          return search.toLocaleLowerCase() === '' ? book : book.Autor.includes(search) || book.Titulo.includes(search)
        }).map((book) => (
          <tr key={book.id}>
            <td>{book.Titulo}</td>
            <td>{book.Autor}</td>
            <td>{book.Genero}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>);
};

export default Filter;
