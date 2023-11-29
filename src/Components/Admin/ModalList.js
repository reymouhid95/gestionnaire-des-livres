// ListModal.j
import { Modal, Button } from "react-bootstrap";

function ListModal({ show, handleClose, books }) {
  return (
    <Modal show={show} onHide={handleClose} className="text-center">
      <Modal.Header closeButton>
        <Modal.Title>Liste des livres</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light fw-bold">
        {books.map((book) => (
          <div key={book.id}>
            <p>
              {book.title} - {book.author}
            </p>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ListModal;