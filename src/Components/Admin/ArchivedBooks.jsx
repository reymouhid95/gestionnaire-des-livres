import { Table, Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

function ArchivedBooks({ archivedBooks, onUnarchiveBook }) {
  return (
    <div>
      <h2 className="fw-bold text-start px-3">Archived Books</h2>
      <Table responsive striped bordered hover variant="bg-body-secondary">
        <thead>
          <tr>
            <th className="bg-light text-start">#</th>
            <th className="bg-light text-start">Titre</th>
            <th className="bg-light text-start">Auteur</th>
            <th className="bg-light text-start">Genre</th>
            <th className="bg-light text-start">Lien</th>
            <th className="bg-light text-start">Description</th>
            <th className="bg-light text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {archivedBooks.map((book, index) => (
            <tr key={book.id}>
              <td>{index + 1}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.url}</td>
              <td>{book.description}</td>
              <td>
                <Button
                  variant="outline-warning"
                  className="mb-2 mx-2 border border-none"
                  onClick={() => onUnarchiveBook(book)}
                >
                  <Icon.FolderX />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ArchivedBooks;
