import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { ProductsList } from './components/ProductsList';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { Basket } from './components/Basket';
import { ProductDetails } from './components/ProductDetails';

function App():JSX.Element {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={<ProductsList/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/basket" element={<Basket/>}/>
        <Route path="/product/:productId" element={<ProductDetails/>}/>
      </Routes>
    </div>
  );
}

export default App;
