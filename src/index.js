import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { createBrowserRouter, Link, RouterProvider, Outlet } from 'react-router-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignUp from './Pages-principales/Inscription';
import SignIn from './Pages-principales/Connexion';
import Books from './Pages/Archive';
import Home from './Pages/Statistics';
import Dashboard from './Pages/Dashboard';

// import Dashboard from './Pages/Dashboard';
// import Home from './Pages/Statistics';
// import { Dashboard } from '@mui/icons-material';

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/user/dashboard",
        element: <Dashboard />
      },
      {
        path: "/user/statistics",
        element: <Home />
      },
      {
        path: "/user/Archived",
        element: <Books />
      }
    ]
  },
  {
    path: "/connexion",
    element: <SignIn />
  },
  {
    path: "/inscription",
    element: <SignUp />
  },
])


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
