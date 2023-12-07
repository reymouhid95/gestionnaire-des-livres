import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import App from "./App";
import SignIn from "./Components/Connexion";
import SignUp from "./Components/Inscription";
import Archive from "./Pages/Pages-Admin/Archive";
import DashboardAdmin from "./Pages/Pages-Admin/DashboardAdmin";
import BookBorrowedContent from "./Pages/Pages-User/BookBorrowedContent";
import Books from "./Pages/Pages-User/Books";
import DashboardUser from "./Pages/Pages-User/DashboardUser";
import Home from "./Pages/Statistics";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

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
        path: "admin/statistics",
        element: <Home />,
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={route}></RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
