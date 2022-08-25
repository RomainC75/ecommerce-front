import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { CategoriesList } from './pages/CategoriesList.page';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { Basket } from './components/Basket';
import { ProductDetails } from './components/ProductDetails';
import { Account } from './components/Account copy';
import { HomePage } from './pages/HomePage';
import IsPrivate from './components/IsPrivate'

function App():JSX.Element {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path="/category/:cat" element={<CategoriesList/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/basket" element={<Basket/>}/>
        <Route path="/product/:productId" element={<ProductDetails/>}/>
        <Route path="/account" element={<IsPrivate><Account/></IsPrivate>}/>
      </Routes>
    </div>
  );
}

export default App;
