
import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Products from './Components/Navbar/Products'
import Navbar from './Components/Navbar/Navbar'
import Home from './Components/Navbar/Home'
import ProductDetails from './Components/Navbar/ProductDetail'
import Donation from './Components/Navbar/Donation'
import Profile from './Components/Navbar/Profile'
import Checkout from './Components/Checkout'
import Cart from './Components/Cart'
import Temples from './Components/Navbar/Temples'
import AddAddress from './Components/Navbar/AddAddress'
import UpdateAddress from './Components/Navbar/UpdateAddress'
import OrderDetails from './Components/Navbar/OrderDetails'
import PrivacyPolicy from './Components/Navbar/PrivacyPolicy'
import HomeFooter from './Components/Navbar/HomeFooter'
// import DashboardProducts from './Components/Navbar/DashboardProducts'
function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />}>   </Route>
          <Route path='/products' element={<Products />}>   </Route>
          <Route path='/temples' element={<Temples />}>   </Route>
          <Route path='/donation' element={<Donation />}>   </Route>
          <Route path='/single/:id' element={<ProductDetails />}>   </Route>
          <Route path='/profile' element={<Profile />}>   </Route>
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path='/address' element={<AddAddress />}>   </Route>
          <Route path='/address/update/:id' element={<UpdateAddress />}>   </Route>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
          {/* <Route path="/dashboardproducts" element={<DashboardProducts />} /> */}



        </Routes>
        <HomeFooter />

      </BrowserRouter>

    </>
  )
}

export default App
