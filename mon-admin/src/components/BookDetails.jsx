import { Modal } from "react-bootstrap";

const BookDetails = ({ show, handleClose, selectedBook }) => {
  return (
    <Modal show={show} onHide={handleClose} className="text-start">
      <Modal.Header closeButton>
        <Modal.Title>Détails du livre</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light fw-bold modal-body">
        {selectedBook && (
          <div>
            <p>Titre : {selectedBook.title}</p>
            <p>Auteur : {selectedBook.author}</p>
            <p>Genre : {selectedBook.genre}</p>
            <p className="wrap">Lien : {selectedBook.url}</p>
            <p className="wrap">Description : {selectedBook.description}</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookDetails;
