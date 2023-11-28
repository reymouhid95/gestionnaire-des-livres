// Importation des bibliothèques et outils
import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Form, Button } from "react-bootstrap";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import TableBook from "./BookTable";
import NotificationHistory from "./NotificationsHistory";

// Composant principal pour les méthodes d'ajout, de modification et de suppression
function FormBook() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    url: "",
    description: "",
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAdding, setIsAdding] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Surveiller le chargement des données au montage de l'aooli
  const loadBooks = useCallback(async () => {
    try {
      const bookCollection = collection(db, "books");
      const snapshot = await getDocs(bookCollection);
      const bookData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(bookData);
    } catch (error) {
      console.error("Error loading books:", error);
      alert(
        "Erreur de chargement. Veuillez vérifier votre connexion internet!"
      );
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Ajouter un utilisateur
  const handleAddBook = useCallback(async () => {
    const book = formData;

    await addDoc(collection(db, "books"), book);
    await loadBooks();
    // Réinitialisation des champs après l'ajout
    setFormData({
      title: "",
      author: "",
      genre: "",
      url: "",
      description: "",
    });
  }, [formData, loadBooks]);

  // Mettre à jour d'un utilisateur
  const handleEditBook = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      url: book.url,
      description: book.description,
    });
    setIsAdding(false);
    setSelectedBook(book);
  };

  // Faire la mise à jour sans ajouter un nouveau champ dans le tableau
  const handleUpdateBook = async () => {
    if (selectedBook) {
      await updateDoc(doc(db, "books", selectedBook.id), formData);
      await loadBooks();
      setFormData({
        title: "",
        author: "",
        genre: "",
        url: "",
        description: "",
      });
      setIsAdding(true);
      setSelectedBook(null);
    }
  };

  // Supprimer un utilisateur
  const handleDeleteBook = useCallback(
    async (bookId) => {
      await deleteDoc(doc(db, "books", bookId));
      setBooks(books.filter((book) => book.id !== bookId));
    },
    [books]
  );

  // Soummission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      await handleAddBook();
    } else {
      await handleUpdateBook();
    }
  };

  // Surveiller l'état du bouton
  const buttonText = isAdding ? "Ajouter" : "Mise à jour";

  const handleNewNotification = (type, message) => {
    const newNotification = {
      type,
      message,
      date: new Date().toLocaleString(),
    };

    setNotifications((prevNotifications) => [
      ...prevNotifications,
      newNotification,
    ]);
  };

  // L'affichage
  return (
    <div className="mt-2">
      <Button
        variant="outline-secondary"
        onClick={() =>
          handleNewNotification(
            "success",
            "Votre emprunt du livre a été validé pour 24h. Bonne Lecture!"
          )
        }
      >
        Notification
      </Button>
      <NotificationHistory notifications={notifications} />
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
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
          </Row>
          <Row>
            <Col md={4} sm={12} xs={12} className="mb-2">
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
            <Col md={4} sm={12} xs={12} className="mb-2">
              <Form.Control
                type="text"
                name="url"
                value={formData.url}
                placeholder="Lien du livre"
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                required
              />
            </Col>
            <Col md={4} sm={12} xs={12} className="mb-2">
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                placeholder="Description du livre"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Col>
          </Row>
          <Button
            // variant="outline-primary"
            type="submit"
            className="soumission mt-2 mb-3"
          >
            {buttonText}
          </Button>
        </Form>
      </Container>
      <TableBook
        books={books}
        onEditBook={handleEditBook}
        onDeleteBook={handleDeleteBook}
      />
    </div>
  );
}

export default FormBook;
