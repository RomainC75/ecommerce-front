import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { CategoriesList } from './pages/CategoriesList.page';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/Login.page';
import { BasketPage } from './pages/Basket.page';
import { ProductDetails } from './components/ProductDetails';
import { Account } from './pages/Account.page';
import { HomePage } from './pages/HomePage';
import IsPrivate from './components/IsPrivate'
import { CheckoutPage } from './pages/Checkout.page';
import IsCartValidated from './components/IsCartValidated';
import { Footer } from './components/Footer';
 
function App():JSX.Element {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path="/category/:cat" element={<CategoriesList/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/basket" element={<BasketPage/>}/>
        <Route path="/product/:productId" element={<ProductDetails/>}/>
        <Route path="/account" element={<IsPrivate><Account/></IsPrivate>}/>
        <Route path="/checkout" element={<IsPrivate><IsCartValidated><CheckoutPage/></IsCartValidated></IsPrivate>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
