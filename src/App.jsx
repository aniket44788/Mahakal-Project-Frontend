import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Products from "./Components/Navbar/Products";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Navbar/Home";
import ProductDetails from "./Components/Navbar/ProductDetail";
import Donation from "./Components/Navbar/Donation";
import Profile from "./Components/Navbar/Profile";
import Checkout from "./Components/Checkout";
import Cart from "./Components/Cart";
import Temples from "./Components/Navbar/Temples";
import AddAddress from "./Components/Navbar/AddAddress";
import UpdateAddress from "./Components/Navbar/UpdateAddress";
import OrderDetails from "./Components/Navbar/OrderDetails";
import HomeFooter from "./Components/Navbar/HomeFooter";
import TermsCondition from "./Components/Policy/TermsCondition";
import RefundReturnPolicy from "./Components/Policy/RefundReturnPolicy";
import ShippingPolicy from "./Components/Policy/ShippingPolicy";
import ContactUs from "./Components/Policy/ContactUs";
import RouteLoaderHandler from "../utils/RouteLoaderHandler";
import OrderSuccess from "../utils/OrderSuccess";
// import PrivacyPolicy from './Components/Policy/PrivacyPolicy'

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true, // scroll pe ek hi baar
      easing: "ease-in-out",
    });
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <RouteLoaderHandler />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/temples" element={<Temples />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/single/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/address" element={<AddAddress />} />
          <Route path="/address/update/:id" element={<UpdateAddress />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/termscondition" element={<TermsCondition />} />
          {/* <Route path="/privacypolicy" element={<PrivacyPolicy />} /> */}
          <Route path="/RefundReturnPolicy" element={<RefundReturnPolicy />} />
          <Route path="/ShippingPolicy" element={<ShippingPolicy />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/order-done" element={<OrderSuccess />} />

          
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
  );
}

export default App;
