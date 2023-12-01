import { Modal } from "react-bootstrap";
const BookDetails = ({ show, handleClose, selectedBook }) => {
  return (
    <Modal show={show} onHide={handleClose} className="text-start">
      <Modal.Header closeButton>
        <Modal.Title>Détails du livre</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        {selectedBook && (
          <div>
            <p>
              <span className="fw-bold">Titre : </span>
              {selectedBook.title}
            </p>
            <p>
              <span className="fw-bold">Auteur : </span>
              {selectedBook.author}
            </p>
            <p>
              <span className="fw-bold">Genre : </span> {selectedBook.genre}
            </p>
            <p className="wrap">
              <span className="fw-bold">Lien : </span>
              {selectedBook.url}
            </p>
            <p className="wrap">
              <span className="fw-bold">Description : </span>
              {selectedBook.description}
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
export default BookDetails;
