
import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
import HomeFooter from './Components/Navbar/HomeFooter'
import TermsCondition from './Components/Policy/TermsCondition'
import RefundReturnPolicy from './Components/Policy/RefundReturnPolicy'
import ShippingPolicy from './Components/Policy/ShippingPolicy'
import ContactUs from './Components/Policy/ContactUs'
import PrivacyPolicy from './Components/Policy/PrivacyPolicy'
// import Categories from './Category'
import DashboardProducts from './Components/Navbar/DashboardProducts'
function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        {/* <Categories /> */}
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

          <Route path="/termscondition" element={<TermsCondition />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/RefundReturnPolicy" element={<RefundReturnPolicy />} />
          <Route path="/ShippingPolicy" element={<ShippingPolicy />} />
          <Route path="/ContactUs" element={<ContactUs />} />



        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
        <HomeFooter />

      </BrowserRouter>

    </>
  )
}

export default App
