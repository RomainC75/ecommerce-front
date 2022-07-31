import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { ProductList } from './components/ProductList';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';

function App():JSX.Element {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={<ProductList/>}/>
        <Route path="/login" element={<LoginPage/>}/>

      </Routes>
    </div>
  );
}

export default App;
