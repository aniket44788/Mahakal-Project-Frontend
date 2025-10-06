import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL, APP_NAME } from "../../config";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  const categories = [
    "All",
    "Prasad",
    "Pooja Samagri",
    "Rudraksha & Malas",
    "Dhup / Shankh",
    "Tulsi Mala",
    "Chandan",
    "Tabeez",
    "Books",
    "Mantra Books",
    "God Idols & Frames",
    "Kanwar Yatra Samagri",
    "Sindoor",
    "Roli",
    "Haldi",
    "Akshat (Chawal)",
    "Festival Kits",
    "Digital Items (Aarti / Video / Pen drive)",
    "Custom Tabeez",
  ];

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/all`);
        if (res.data.success) {
          setProducts(res.data.products);
          setFilteredProducts(res.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply search & category filter
  useEffect(() => {
    let temp = products;

    if (selectedCategory !== "All") {
      temp = temp.filter(
        (item) =>
          item.category &&
          item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (search.trim() !== "") {
      temp = temp.filter((item) =>
        (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(search.toLowerCase())) ||
        (item.material && item.material.toLowerCase().includes(search.toLowerCase())) ||
        (item.occasion && item.occasion.toLowerCase().includes(search.toLowerCase()))
      );
    }

    setFilteredProducts(temp);
  }, [search, selectedCategory, products]);

  if (loading) {
    return (
      <div className="pt-28 text-center text-lg font-semibold text-gray-600 animate-pulse">
        Loading products...
      </div>
    );
  }

  return (
    <div className="pt-2 px-6">
      <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center ">
        🛍️ Prasad & Mandir Products
      </h1>

      {/* 🔍 Search + Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        {/* Search */}
        <div className="relative w-full ">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:ring-2 focus:ring-orange-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full md:w-1/3">
          <select
            className="appearance-none w-full border border-gray-300 bg-white rounded-xl py-2.5 px-4 pr-10 text-gray-700 font-medium shadow-sm hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {/* Better positioned arrow */}
          <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>


      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((item) => (
            <div
              onClick={() => navigate(`/single/${item._id}`)}
              key={item._id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-transform duration-300 relative cursor-pointer"
            >
              {/* Discount Badge */}
              {item.discountPrice && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {Math.round(
                    ((item.price - item.discountPrice) / item.price) * 100
                  )}
                  % OFF
                </span>
              )}

              {/* Product Image */}
              <div className="flex justify-center items-center p-4">
                <img
                  src={item.images[0]?.url}
                  alt={item.name}
                  className="w-60 h-52 object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>

                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                  {item.isAvailable ? (
                    <>
                      <span className="text-orange-600 font-bold text-lg">
                        ₹{item.discountPrice || item.price}
                      </span>
                      {item.discountPrice && item.discountPrice < item.price && (
                        <span className="line-through text-gray-500 text-sm">
                          ₹{item.price}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-red-600 font-bold text-lg">
                      SOLD OUT
                    </span>
                  )}
                </div>


                {/* Rating */}
                <div className="flex items-center mt-2 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < item.rating?.average ? "fill-yellow-500" : ""
                      }
                    />
                  ))}
                  <span className="ml-2 text-xs text-gray-500">
                    ({item.rating?.count || 0} reviews)
                  </span>
                </div>

                {/* ✅ Extra Details */}
                <p className="text-xs text-gray-500 mt-2">
                  {item.size} • {item.material} • {item.deity}
                </p>
                <p className="text-xs text-gray-400">
                  Occasion: {item.occasion}
                </p>
                <div className="w-full flex items-center justify-center gap-4 mt-4">

                  {/* Add to Cart Button */}
                  <button className="w-20 h-10 flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">
                    <ShoppingCart size={18} /> 

                  </button>

                  {/* Buy Now Button */}
                  <button className="w-60 flex items-center justify-center gap-2 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-medium">
                    Buy Now
                  </button>
                </div>


              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
