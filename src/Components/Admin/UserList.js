import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { db } from "../../firebase-config";
import Paginations from "./Paginations";

function UserList() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;
  const indexOfLastUser = currentPage * booksPerPage;
  const indexOfFirstUser = indexOfLastUser - booksPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const [temporaryBlocked, setTemporaryBlocked] = useState(null);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBloquedUser = async (UserId) => {
    try {
      const userBloqued = users.find((user) => user.id === UserId);
      const bloqued = userBloqued.bloqued;

      // Mettre à jour la clé "blocked" avec la nouvelle valeur
      await updateDoc(doc(db, "users", userBloqued.id), {
        bloqued: !bloqued, // Inverser la valeur actuelle
      });
      const updatedUsers = users.map((user) =>
        user.id === UserId
          ? {
              ...user,
              bloqued: !bloqued,
              statusText: !bloqued ? "Blocked" : "Unblocked",
            }
          : user
      );

      setUsers(updatedUsers);

      setTemporaryBlocked(UserId);
      // Recharger les utilisateurs après la mise à jour
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user!");
    }
  };

  useEffect(() => {
    if (temporaryBlocked !== null) {
      const timeoutId = setTimeout(() => {
        setTemporaryBlocked(null);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [temporaryBlocked]);

  const loadUsers = useCallback(async () => {
    try {
      const bookCollection = collection(db, "users");
      const snapshot = await getDocs(bookCollection);
      const bookData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(bookData);
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error("Error loading. Please check your internet connection!");
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="dashboard mt-5">
      <Table
        responsive
        striped
        bordered
        hover
        variant="bg-body-secondary"
        id="tableUser"
      >
        <thead>
          <tr>
            <th className="text-white text-center">#</th>
            <th className="text-white text-center">Name</th>
            <th className="text-white text-center">Email</th>
            <th className="text-white text-center">Boroowed books</th>
            <th className="text-white text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.livre}</td>
              <td>
                <Button
                  variant="outline-danger border border-none"
                  className="mb-2 mx-1"
                >
                  {!user.bloqued ? (
                    <Icon.PersonFillSlash
                      onClick={() => handleBloquedUser(user.id)}
                    />
                  ) : (
                    <Icon.PersonFillCheck
                      onClick={() => handleBloquedUser(user.id)}
                    />
                  )}
                </Button>
                {temporaryBlocked === user.id && (
                  <span
                    className={`text-danger ${
                      temporaryBlocked ? "" : "fade-out"
                    }`}
                  >
                    {user.statusText}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <div className="d-flex justify-content-center p-0 m-0 w-100">
          <Paginations
            booksPerPage={booksPerPage}
            totalBooks={users.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default UserList;
