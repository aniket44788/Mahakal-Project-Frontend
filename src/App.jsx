
import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Products from './Components/Navbar/Products'
import Navbar from './Components/Navbar/Navbar'
import Home from './Components/Navbar/Home'
import ProductDetails from './Components/Navbar/ProductDetail'
function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />}>   </Route>
          <Route path='/products' element={<Products />}>   </Route>
          <Route path='/single/:id' element={<ProductDetails />}>   </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
