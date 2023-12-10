import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignUp from './Components/Inscription';
import SignIn from './Components/Connexion';
import Books from './Pages/Pages-User/Books'
import Home from './Pages/Statistics'
import DashboardUser from './Pages/Pages-User/DashboardUser';
import DashboardAdmin from './Pages/Pages-Admin/DashboardAdmin';
import Archive from './Pages/Pages-Admin/Archive';
import BookBorrowedContent from './Pages/Pages-User/BookBorrowedContent';
import ListOfUsers from './Pages/Pages-Admin/ListOfUsers';
// import { ToastProvider } from "react-hot-toast";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/connexion" />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "admin/dashboardAdmin",
        element: <DashboardAdmin />,
      },
      {
        path: "admin/userList",
        element: <ListOfUsers />,
      },
      {
        path: "admin/archived",
        element: <Archive />,
      },
      {
        path: "user/dashboardUser",
        element: <DashboardUser />,
      },
      {
        path: "user/books",
        element: <Books />,
      },
      {
        path: "/user/bookBorrowed",
        element: <BookBorrowedContent />,
      },
    ],
  },
  {
    path: "/connexion",
    element: <SignIn />,
  },
  {
    path: "/inscription",
    element: <SignUp />,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <RouterProvider router={route}>
      </RouterProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
