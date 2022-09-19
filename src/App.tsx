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
import { SignupPage } from './pages/Signup.page';
import { PassResetPage } from './pages/PassReset.page';
import { PassResetRequestPage } from './pages/PassResetRequest.page';
import { NoMatch } from './pages/NoMatch';
import { AdminSharedLayout } from './components/admin/AdminSharedLayout';
import { UserSharedLayout } from './components/UserSharedLayout';

function App():JSX.Element {
  return (
    <div className="App">
      <Routes>
        <Route path="admin" element={<AdminSharedLayout/>}>
          <Route path="home" element={<div>Admin Home </div>}/>
        </Route>
  
        <Route path="/" element={<UserSharedLayout/>}>
          <Route path='/' element={<HomePage/>}/>
          <Route path="/category/:cat" element={<CategoriesList/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/basket" element={<BasketPage/>}/>
          <Route path="/product/:productId" element={<ProductDetails/>}/>
          <Route path="/account" element={<IsPrivate><Account/></IsPrivate>}/>
          <Route path="/checkout" element={<IsPrivate><IsCartValidated><CheckoutPage/></IsCartValidated></IsPrivate>}/>
          <Route path='/reset/:resetToken' element={<PassResetPage/>}/> 
          <Route path='/resetpass' element={<PassResetRequestPage/>}/>
          <Route path='*' element={<NoMatch/>}/>
        </Route>
      </Routes>

      {/* <Routes>
          <Route path='/admin/*' element={<Navbar/>}/>          
          <Route path='*' element={<Navbar/>}/>
      </Routes>
      
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path="/category/:cat" element={<CategoriesList/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/basket" element={<BasketPage/>}/>
        <Route path="/product/:productId" element={<ProductDetails/>}/>
        <Route path="/account" element={<IsPrivate><Account/></IsPrivate>}/>
        <Route path="/checkout" element={<IsPrivate><IsCartValidated><CheckoutPage/></IsCartValidated></IsPrivate>}/>
        <Route path='/reset/:resetToken' element={<PassResetPage/>}/> 
        <Route path='/resetpass' element={<PassResetRequestPage/>}/>

        <Route path='/admin/' element={<AdminHomePage/>}/>      
        <Route path='/admin/login' element={<AdminLogin/>}/>

        <Route path='*' element={<NoMatch/>}/>
      </Routes>
      
      <Routes>
        <Route path='/admin/*' element={<AdminFooter/>}/>
        <Route path='*' element={<Footer/>}/>
      </Routes> */}

    </div>
  );
}

export default App;
