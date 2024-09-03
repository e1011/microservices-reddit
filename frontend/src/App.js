import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import Home from './components/Home';
import './App.css';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/home"/>
    },
    {
      path: "/home",
      element: <Home/>,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;