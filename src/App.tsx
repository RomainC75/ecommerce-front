import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { ProductList } from './components/ProductList';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { Basket } from './components/Basket';

function App():JSX.Element {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={<ProductList/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/basket" element={<Basket/>}/>

      </Routes>
    </div>
  );
}

export default App;
