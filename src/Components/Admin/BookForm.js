/* eslint-disable react-hooks/exhaustive-deps */
// Importation des bibliothèques et outils
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../../firebase-config";
import TableBook from "./BookTable";
import { addSeconds, differenceInDays } from "date-fns";

// Composant principal pour les méthodes d'ajout, de modification et de suppression
function FormBook() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    archived: false,
    isBorrowed: false,
    dueDate: null,
    stock: 5,
    author: "",
    genre: "",
    url: "",
    description: "",
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAdding, setIsAdding] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const urlInputRef = useRef();
  const [isArchived, setIsArchived] = useState(false);
  const [isUnarchived, setIsUnarchived] = useState(false);
  const [stocks, setStocks] = useState({});

  // Surveiller le chargement des données au montage de l'appli
  const loadBooks = useCallback(async () => {
    try {
      const bookCollection = collection(db, "books");
      const snapshot = await getDocs(bookCollection);
      const bookData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        archived: doc.archived || false,
      }));
      setBooks(bookData);
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error(
        "Erreur de chargement. Veuillez vérifier votre connexion internet!"
      );
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Méthode d'ajout d'un livre
  const handleAddBook = useCallback(async () => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(formData.url)) {
      toast.warning("Veuillez entrer un lien valide dans le champ URL!");
      urlInputRef.current.focus();
      return;
    }

    // Vérifier si tous les champs requis sont remplis
    const requiredFields = ["title", "author", "genre", "url", "description"];
    if (requiredFields.some((field) => formData[field].trim() === "")) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    // Vérifier si le livre existe déjà
    const existingBook = books.find(
      (book) => JSON.stringify(book) === JSON.stringify(formData)
    );

    if (existingBook) {
      toast.warning("Ce livre existe déjà!");
      return;
    }

    // Ajouter le livre avec un stock initial de 1
    const newBook = { ...formData, stock: 5 };
    await addDoc(collection(db, "books"), newBook);

    // Mettre à jour le state avec le nouveau livre
    setBooks((prevBooks) => [...prevBooks, newBook]);

    // Mettre à jour l'état local des stocks
    setStocks((prevStocks) => ({
      ...prevStocks,
      [formData.title]: (prevStocks[formData.title] || 0) + 5,
    }));

    // Ajouter le livre seulement si tous les champs sont remplis
    await loadBooks();
    setFormData({
      title: "",
      author: "",
      genre: "",
      url: "",
      description: "",
    });
    toast.success("Livre ajouté avec succès!");
  }, [formData, loadBooks]);

  // Mettre à jour un livre
  const handleEditBook = (book) => {
    setShow(true);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      url: book.url,
      description: book.description,
      archived: book.archived,
    });
    setIsAdding(false);
    setSelectedBook(book);
  };

  // Faire la mise à jour sans ajouter un nouveau champ dans le tableau
  const handleUpdateBook = async () => {
    setShow(false);
    if (selectedBook) {
      await updateDoc(doc(db, "books", selectedBook.id), formData);
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === selectedBook.id ? { ...book, ...formData } : book
        )
      );
      await loadBooks();
      setFormData({
        title: "",
        author: "",
        genre: "",
        url: "",
        description: "",
      });

      // Réinitialiser les champs après l'ajout
      setFormData({
        title: "",
        author: "",
        genre: "",
        url: "",
        description: "",
      });
      toast.success("Données modifiées avec success!");
      setIsAdding(true);
      setSelectedBook(null);
    }
  };

  const archive = useCallback(
    async (bookId) => {
      try {
        const selectedBook = books.find((book) => book.id === bookId);
        if (!selectedBook) {
          console.error("No selected book to archive.");
          return;
        }

        const updatedBookData = {
          ...selectedBook,
          archived: !selectedBook.archived,
        };

        await updateDoc(doc(db, "books", bookId), updatedBookData);
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === bookId ? { ...book, archived: !book.archived } : book
          )
        );

        if (updatedBookData.archived) {
          setIsArchived(true);
          setIsUnarchived(false);
        } else {
          setIsArchived(false);
          setIsUnarchived(true);
        }
      } catch (error) {
        console.error("Error updating book:", error);
      }
    },
    [books, selectedBook, setBooks, loadBooks]
  );

  // Supprimer un livre
  const handleDeleteBook = useCallback(
    async (bookId) => {
      const bookToDelete = books.find((book) => book.id === bookId);
      if (bookToDelete) {
        const { title } = bookToDelete;
        await deleteDoc(doc(db, "books", bookId));
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        setStocks((prevStocks) => {
          const { [title]: removed, ...rest } = prevStocks;
          return rest;
        });
        toast.success(`Livre "${title}" supprimé avec succès!`);
      } else {
        toast.error(`Livre non trouvé avec l'ID : ${bookId}`);
      }
    },
    [books]
  );


  // Soummission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      setShow(false);
      await handleAddBook();
    } else {
      await handleUpdateBook();
    }
  };

  // Surveiller l'état du bouton
  const buttonText = isAdding ? "Ajouter" : "Mise à jour";

  // L'affichage
  return (
    <div className="mt-2">
      {isArchived && toast.success("Livre archivé avec succès!")}
      {isUnarchived && toast.success("Livre désarchivé avec succès!")}
      <Form onSubmit={handleSubmit}>
        <Row className="w-100 m-0 p-0">
          <div className="d-flex justify-content-end">
            <Button
              className="soumission mt-2 mx-5"
              style={{ width: "max-content" }}
              onClick={handleShow}
            >
              Ajouter
            </Button>
          </div>
          <Modal show={show} onHide={handleClose} keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>Informations livres</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row d-flex g-2">
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    placeholder="Titre du livre"
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </Col>
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    type="text"
                    name="author"
                    value={formData.author}
                    placeholder="Nom de l'auteur"
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    required
                  />
                </Col>
              </div>
              <div className="row g-2 d-flex flex-wrap">
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    type="text"
                    name="genre"
                    value={formData.genre}
                    placeholder="Genre du livre"
                    onChange={(e) =>
                      setFormData({ ...formData, genre: e.target.value })
                    }
                    required
                  />
                </Col>
                <Col md={6} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    type="text"
                    name="url"
                    value={formData.url}
                    placeholder="Lien du livre"
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    ref={urlInputRef}
                    required
                  />
                </Col>
                <Col md={12} sm={12} xs={12} className="mb-2">
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    placeholder="Description du livre"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </Col>
              </div>
              <div className="d-flex justify-content-center">
                <Button
                  type="submit"
                  className="soumission mt-2 mb-3"
                  onClick={handleSubmit}
                  style={{ width: "max-content" }}
                >
                  {buttonText}
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </Row>
      </Form>

      <div>
        <TableBook
          books={books}
          onEditBook={handleEditBook}
          onDeleteBook={handleDeleteBook}
          onArchivedBook={archive}
        />
      </div>
    </div>
  );
}

export default FormBook;
