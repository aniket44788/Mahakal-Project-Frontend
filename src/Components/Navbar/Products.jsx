// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Star, ShoppingCart, Search } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useLoader } from "../../../utils/LoaderContext";

// function Products() {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const { showLoader, hideLoader } = useLoader();
//   const [search, setSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   const navigate = useNavigate();

//   const categories = [
//     "All",
//     "Prasad",
//     "Pooja Samagri",
//     "Rudraksha & Malas",
//     "Dhup / Shankh",
//     "Tulsi Mala",
//     "Chandan",
//     "Tabeez",
//     "Books",
//     "Mantra Books",
//     "God Idols & Frames",
//     "Kanwar Yatra Samagri",
//     "Sindoor",
//     "Roli",
//     "Haldi",
//     "Akshat (Chawal)",
//     "Festival Kits",
//     "Digital Items (Aarti / Video / Pen drive)",
//     "Custom Tabeez",
//   ];

//   useEffect(() => {
//     const fetchProducts = async () => {

//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/products/all`,
//         );

//         if (res.data.success) {
//           setProducts(res.data.products);
//           setFilteredProducts(res.data.products);
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Apply search & category filter
//   useEffect(() => {
//     let temp = products;

//     if (selectedCategory !== "All") {
//       temp = temp.filter(
//         (item) =>
//           item.category &&
//           item.category.toLowerCase() === selectedCategory.toLowerCase(),
//       );
//     }

//     if (search.trim() !== "") {
//       temp = temp.filter(
//         (item) =>
//           (item.name &&
//             item.name.toLowerCase().includes(search.toLowerCase())) ||
//           (item.description &&
//             item.description.toLowerCase().includes(search.toLowerCase())) ||
//           (item.category &&
//             item.category.toLowerCase().includes(search.toLowerCase())) ||
//           (item.material &&
//             item.material.toLowerCase().includes(search.toLowerCase())) ||
//           (item.occasion &&
//             item.occasion.toLowerCase().includes(search.toLowerCase())),
//       );
//     }

//     setFilteredProducts(temp);
//   }, [search, selectedCategory, products]);

//   return (
//     <div className="pt-2 px-6">
//       <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center ">
//         🛍️ Prasad & Mandir Products
//       </h1>

//       {/* 🔍 Search + Category Filter */}
//       <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
//         {/* Search */}
//         <div className="relative w-full ">
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:ring-2 focus:ring-orange-500"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
//         </div>

//         {/* Category Dropdown */}
//         <div className="relative w-full md:w-1/3">
//           <select
//             className="appearance-none w-full border border-gray-300 bg-white rounded-xl py-2.5 px-4 pr-10 text-gray-700 font-medium shadow-sm hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//           >
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//           {/* Better positioned arrow */}
//           <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 9l-7 7-7-7"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {filteredProducts.length === 0 ? (
//         <p className="text-center text-gray-600">No products found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
//           {filteredProducts.map((item) => (
//             <div
//               onClick={() => navigate(`/single/${item._id}`)}
//               key={item._id}
//               className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 relative cursor-pointer flex flex-col"
//             >
//               {/* Discount Badge */}
//               {item.discountPrice && (
//                 <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
//                   {Math.round(
//                     ((item.price - item.discountPrice) / item.price) * 100,
//                   )}
//                   % OFF
//                 </span>
//               )}

//               {/* Product Image */}
//               <div className="flex justify-center items-center p-4 bg-gray-50">
//                 <img
//                   src={item.images[0]?.url}
//                   alt={item.name}
//                   className="w-full h-64 object-cover rounded-lg"
//                 />
//               </div>

//               {/* Product Info */}
//               <div className="p-4 flex flex-col flex-grow">
//                 <h2 className="text-lg font-bold text-gray-800 truncate">
//                   {item.name}
//                 </h2>
//                 <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-grow">
//                   {item.description}
//                 </p>

//                 {/* Extra Details */}
//                 <p className="text-xs text-gray-500 mt-2">
//                   {item.size} • {item.material} • {item.deity}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   Occasion: {item.occasion}
//                 </p>

//                 {/* Price Section */}
//                 <div className="flex items-center gap-2 mt-3">
//                   {item.isAvailable ? (
//                     <>
//                       <span className="text-orange-600 font-bold text-xl">
//                         ₹{item.discountPrice || item.price}
//                       </span>
//                       {item.discountPrice &&
//                         item.discountPrice < item.price && (
//                           <span className="line-through text-gray-500 text-sm">
//                             ₹{item.price}
//                           </span>
//                         )}
//                     </>
//                   ) : (
//                     <span className="text-red-600 font-bold text-xl">
//                       SOLD OUT
//                     </span>
//                   )}
//                 </div>

//                 {/* Rating */}
//                 <div className="flex items-center mt-2 text-yellow-500">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       size={16}
//                       className={
//                         i < Math.floor(item.rating?.average || 0)
//                           ? "fill-yellow-500"
//                           : ""
//                       }
//                     />
//                   ))}
//                   <span className="ml-2 text-xs text-gray-500">
//                     ({item.rating?.count || 0} reviews)
//                   </span>
//                 </div>

//                 {/* Buttons */}
//                 <div className="w-full flex items-center justify-center gap-3 mt-6">
//                   {/* Add to Cart Button */}
//                   <button className="flex-1 min-w-0 h-11 flex items-center justify-center gap-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium">
//                     <ShoppingCart size={18} />
//                     Add to Cart
//                   </button>

//                   {/* Buy Now Button */}
//                   <button className="flex-1 min-w-0 h-11 flex items-center justify-center bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
//                     Buy Now
//                   </button>
//                 </div>
//               </div>import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Star, ShoppingCart, Search } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toastSuccess, toastWarning, toastError } from "../Toast";

// // ─── Dharmic Loader ───────────────────────────────────────────────────────────
// const DharmicLoader = ({ visible }) => {
//   const msgs = [
//     "🙏 Loading divine products...",
//     "🕉️ Preparing sacred offerings...",
//     "🪔 Almost ready, devotee...",
//     "🔱 Mahadev's blessings incoming...",
//   ];
//   const [i, setI] = useState(0);
//   useEffect(() => {
//     if (!visible) return;
//     const iv = setInterval(() => setI((p) => (p + 1) % msgs.length), 1800);
//     return () => clearInterval(iv);
//   }, [visible]);
//   if (!visible) return null;
//   return (
//     <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
//       style={{ background: "linear-gradient(135deg,rgba(255,237,213,0.93),rgba(254,215,170,0.89),rgba(252,165,165,0.86))", backdropFilter: "blur(16px)" }}>
//       <div className="relative flex items-center justify-center mb-8">
//         <div className="w-28 h-28 rounded-full border-4 border-orange-200 border-t-orange-500 border-r-orange-400"
//           style={{ animation: "spin 1.2s linear infinite" }} />
//         <div className="absolute w-20 h-20 rounded-full border-2 border-red-300 border-b-red-500"
//           style={{ animation: "spinReverse 1.8s linear infinite" }} />
//         <div className="absolute text-4xl" style={{ animation: "pulse 2s ease-in-out infinite" }}>🕉️</div>
//       </div>
//       <div className="flex gap-2 mb-6">
//         {[0,1,2,3,4].map((n) => (
//           <div key={n} className="w-2 h-2 rounded-full bg-orange-500"
//             style={{ animation: `bounce 1.2s ease-in-out ${n*0.15}s infinite` }} />
//         ))}
//       </div>
//       <p key={i} className="text-orange-800 font-semibold text-lg text-center px-6"
//         style={{ animation: "fadeIn 0.5s ease-in" }}>{msgs[i]}</p>
//       <p className="text-orange-600 text-sm mt-2 opacity-70">हर हर महादेव 🔱</p>
//       <style>{`
//         @keyframes spin{to{transform:rotate(360deg)}}
//         @keyframes spinReverse{to{transform:rotate(-360deg)}}
//         @keyframes bounce{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-8px);opacity:1}}
//         @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
//       `}</style>
//     </div>
//   );
// };

// // ─── Product Card ─────────────────────────────────────────────────────────────
// const ProductCard = ({ item, onAddToCart }) => {
//   const navigate = useNavigate();
//   const discount = item.discountPrice
//     ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
//     : 0;
//   const finalPrice = item.discountPrice || item.price;

//   return (
//     <div
//       className="group flex flex-col rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
//       style={{
//         background: "rgba(255,255,255,0.88)",
//         border: "1px solid rgba(234,88,12,0.13)",
//         boxShadow: "0 2px 16px rgba(234,88,12,0.06)",
//       }}
//       onClick={() => navigate(`/single/${item._id}`)}
//     >
//       {/* Image */}
//       <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#fff7ed,#fef9f5)" }}>
//         <img
//           src={item.images?.[0]?.url || "/shivmahakal.png"}
//           alt={item.name}
//           className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
//         />
//         {/* Top accent */}
//         <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />

//         {/* Discount badge */}
//         {discount > 0 && (
//           <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl text-white text-[10px] font-black"
//             style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", boxShadow: "0 2px 8px rgba(234,88,12,0.4)" }}>
//             🔥 {discount}% OFF
//           </div>
//         )}

//         {/* Sold out overlay */}
//         {!item.isAvailable && (
//           <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
//             <span className="bg-red-100 text-red-600 font-black text-sm px-4 py-2 rounded-xl border border-red-200">
//               SOLD OUT
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div className="flex flex-col flex-1 p-4">
//         {/* Category pill */}
//         {item.category && (
//           <span className="self-start text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full mb-2">
//             {item.category}
//           </span>
//         )}

//         {/* Name */}
//         <h3 className="font-bold text-gray-900 text-sm leading-snug truncate mb-1">{item.name}</h3>

//         {/* Description */}
//         <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1 mb-2">{item.description}</p>

//         {/* Meta row */}
//         {(item.size || item.deity) && (
//           <p className="text-[10px] text-gray-400 mb-2 truncate">
//             {[item.size, item.deity].filter(Boolean).join(" · ")}
//           </p>
//         )}

//         {/* Rating */}
//         <div className="flex items-center gap-1.5 mb-3">
//           <div className="flex">
//             {[1,2,3,4,5].map((s) => (
//               <Star key={s} size={12}
//                 className={s <= Math.floor(item.rating?.average || 0) ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"} />
//             ))}
//           </div>
//           <span className="text-[10px] text-gray-400">({item.rating?.count || 0})</span>
//         </div>

//         {/* Price */}
//         <div className="flex items-baseline gap-2 mb-4">
//           {item.isAvailable ? (
//             <>
//               <span className="text-xl font-black text-orange-600">₹{finalPrice}</span>
//               {item.discountPrice && (
//                 <span className="text-xs text-gray-400 line-through font-medium">₹{item.price}</span>
//               )}
//             </>
//           ) : (
//             <span className="text-sm font-black text-red-500">Sold Out</span>
//           )}
//         </div>

//         {/* Buttons */}
//         <div className="grid grid-cols-2 gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
//           <button
//             onClick={(e) => { e.stopPropagation(); onAddToCart(item._id); }}
//             disabled={!item.isAvailable}
//             className="h-10 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             <ShoppingCart size={13} /> Cart
//           </button>
//           <button
//             onClick={(e) => { e.stopPropagation(); navigate(`/single/${item._id}`); }}
//             disabled={!item.isAvailable}
//             className="h-10 rounded-xl text-xs font-black text-white transition-all duration-200 hover:scale-[1.03] disabled:opacity-40 disabled:cursor-not-allowed"
//             style={{ background: item.isAvailable ? "linear-gradient(135deg,#ea580c,#dc2626)" : "#9ca3af", boxShadow: item.isAvailable ? "0 3px 10px rgba(234,88,12,0.3)" : "none" }}
//           >
//             Buy Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Main Page ────────────────────────────────────────────────────────────────
// function Products() {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const navigate = useNavigate();

//   const categories = [
//     "All", "Prasad", "Pooja Samagri", "Rudraksha & Malas",
//     "Dhup / Shankh", "Tulsi Mala", "Chandan", "Tabeez", "Books",
//     "Mantra Books", "God Idols & Frames", "Kanwar Yatra Samagri",
//     "Sindoor", "Roli", "Haldi", "Akshat (Chawal)", "Festival Kits",
//     "Digital Items (Aarti / Video / Pen drive)", "Custom Tabeez",
//   ];

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/all`);
//         if (res.data.success) {
//           setProducts(res.data.products);
//           setFilteredProducts(res.data.products);
//         }
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     let temp = products;
//     if (selectedCategory !== "All")
//       temp = temp.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
//     if (search.trim())
//       temp = temp.filter((p) =>
//         [p.name, p.description, p.category, p.material, p.occasion]
//           .some((f) => f?.toLowerCase().includes(search.toLowerCase()))
//       );
//     setFilteredProducts(temp);
//   }, [search, selectedCategory, products]);

//   const handleAddToCart = async (productId) => {
//     const token = localStorage.getItem("mahakalToken");
//     if (!token) { toastWarning("Please login to add items to cart"); navigate("/login"); return; }
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_URL}/cart/add`,
//         { productId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) toastSuccess("Item added to cart!");
//       else toastWarning(res.data.message || "Failed to add item");
//     } catch { toastError("Something went wrong!"); }
//   };

//   return (
//     <>
//       <DharmicLoader visible={loading} />

//       <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fff7ed 100%)" }}>
//         <div className="h-1 bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 opacity-80" />

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

//           {/* ── Page Header ── */}
//           <div className="text-center mb-8">
//             <p className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em] mb-2">🕉️ Mahakal Bazar · Divine Store</p>
//             <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
//               Prasad &{" "}
//               <span style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
//                 Sacred Products
//               </span>
//             </h1>
//             <p className="text-sm text-gray-400">
//               {filteredProducts.length} divine item{filteredProducts.length !== 1 ? "s" : ""} available
//             </p>
//           </div>

//           {/* ── Search + Filter ── */}
//           <div className="flex flex-col sm:flex-row gap-3 mb-8">
//             {/* Search */}
//             <div className="relative flex-1">
//               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search products, categories, materials..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-orange-300"
//                 style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(234,88,12,0.18)" }}
//               />
//             </div>

//             {/* Category dropdown */}
//             <div className="relative sm:w-64">
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full appearance-none py-3 pl-4 pr-10 rounded-2xl text-sm font-semibold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-orange-300 cursor-pointer"
//                 style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(234,88,12,0.18)" }}
//               >
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>{cat}</option>
//                 ))}
//               </select>
//               <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-orange-400">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* ── Active filter pill ── */}
//           {(selectedCategory !== "All" || search) && (
//             <div className="flex flex-wrap gap-2 mb-5">
//               {selectedCategory !== "All" && (
//                 <button onClick={() => setSelectedCategory("All")}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-orange-700 transition hover:bg-orange-100"
//                   style={{ background: "rgba(255,247,237,0.9)", border: "1px solid rgba(234,88,12,0.25)" }}>
//                   {selectedCategory} ✕
//                 </button>
//               )}
//               {search && (
//                 <button onClick={() => setSearch("")}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-orange-700 transition hover:bg-orange-100"
//                   style={{ background: "rgba(255,247,237,0.9)", border: "1px solid rgba(234,88,12,0.25)" }}>
//                   "{search}" ✕
//                 </button>
//               )}
//             </div>
//           )}

//           {/* ── Grid ── */}
//           {!loading && filteredProducts.length === 0 ? (
//             <div className="text-center py-20 rounded-3xl"
//               style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(234,88,12,0.12)" }}>
//               <div className="text-5xl mb-4">🔍</div>
//               <p className="font-bold text-gray-700 mb-1">No products found</p>
//               <p className="text-sm text-gray-400">Try a different search or category</p>
//               <button onClick={() => { setSearch(""); setSelectedCategory("All"); }}
//                 className="mt-5 px-6 py-2.5 rounded-xl text-white text-sm font-bold"
//                 style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)" }}>
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
//               {filteredProducts.map((item) => (
//                 <ProductCard key={item._id} item={item} onAddToCart={handleAddToCart} />
//               ))}
//             </div>
//           )}

//           {/* Bottom stripe */}
//           <div className="h-1 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 opacity-30 mt-10" />
//         </div>
//       </div>
//     </>
//   );
// }

// export default Products;
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Products;






import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toastSuccess, toastWarning, toastError } from "../Toast";

// ─── Dharmic Loader ───────────────────────────────────────────────────────────
const DharmicLoader = ({ visible }) => {
  const msgs = [
    "🙏 Loading divine products...",
    "🕉️ Preparing sacred offerings...",
    "🪔 Almost ready, devotee...",
    "🔱 Mahadev's blessings incoming...",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const iv = setInterval(() => setI((p) => (p + 1) % msgs.length), 1800);
    return () => clearInterval(iv);
  }, [visible]);
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg,rgba(255,237,213,0.93),rgba(254,215,170,0.89),rgba(252,165,165,0.86))", backdropFilter: "blur(16px)" }}>
      <div className="relative flex items-center justify-center mb-8">
        <div className="w-28 h-28 rounded-full border-4 border-orange-200 border-t-orange-500 border-r-orange-400"
          style={{ animation: "spin 1.2s linear infinite" }} />
        <div className="absolute w-20 h-20 rounded-full border-2 border-red-300 border-b-red-500"
          style={{ animation: "spinReverse 1.8s linear infinite" }} />
        <div className="absolute text-4xl" style={{ animation: "pulse 2s ease-in-out infinite" }}>🕉️</div>
      </div>
      <div className="flex gap-2 mb-6">
        {[0,1,2,3,4].map((n) => (
          <div key={n} className="w-2 h-2 rounded-full bg-orange-500"
            style={{ animation: `bounce 1.2s ease-in-out ${n*0.15}s infinite` }} />
        ))}
      </div>
      <p key={i} className="text-orange-800 font-semibold text-lg text-center px-6"
        style={{ animation: "fadeIn 0.5s ease-in" }}>{msgs[i]}</p>
      <p className="text-orange-600 text-sm mt-2 opacity-70">हर हर महादेव 🔱</p>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes spinReverse{to{transform:rotate(-360deg)}}
        @keyframes bounce{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-8px);opacity:1}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
      `}</style>
    </div>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ item, onAddToCart }) => {
  const navigate = useNavigate();
  const discount = item.discountPrice
    ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
    : 0;
  const finalPrice = item.discountPrice || item.price;

  return (
    <div
      className="group flex flex-col rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(234,88,12,0.13)",
        boxShadow: "0 2px 16px rgba(234,88,12,0.06)",
      }}
      onClick={() => navigate(`/single/${item._id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#fff7ed,#fef9f5)" }}>
        <img
          src={item.images?.[0]?.url || "/shivmahakal.png"}
          alt={item.name}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl text-white text-[10px] font-black"
            style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", boxShadow: "0 2px 8px rgba(234,88,12,0.4)" }
            
            }>
            🔥 {discount}% OFF
          </div>
        )}

        {/* Sold out overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-100 text-red-600 font-black text-sm px-4 py-2 rounded-xl border border-red-200">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category pill */}
        {item.category && (
          <span className="self-start text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full mb-2">
            {item.category}
          </span>
        )}

        {/* Name */}
        <h3 className="font-bold text-gray-900 text-sm leading-snug truncate mb-1">{item.name}</h3>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1 mb-2">{item.description}</p>

        {/* Meta row */}
        {(item.size || item.deity) && (
          <p className="text-[10px] text-gray-400 mb-2 truncate">
            {[item.size, item.deity].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={12}
                className={s <= Math.floor(item.rating?.average || 0) ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"} />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({item.rating?.count || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          {item.isAvailable ? (
            <>
              <span className="text-xl font-black text-orange-600">₹{finalPrice}</span>
              {item.discountPrice && (
                <span className="text-xs text-gray-400 line-through font-medium">₹{item.price}</span>
              )}
            </>
          ) : (
            <span className="text-sm font-black text-red-500">Sold Out</span>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(item._id); }}
            disabled={!item.isAvailable}
            className="h-10 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={13} /> Cart
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/single/${item._id}`); }}
            disabled={!item.isAvailable}
            className="h-10 rounded-xl text-xs font-black text-white transition-all duration-200 hover:scale-[1.03] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: item.isAvailable ? "linear-gradient(135deg,#ea580c,#dc2626)" : "#9ca3af", boxShadow: item.isAvailable ? "0 3px 10px rgba(234,88,12,0.3)" : "none" }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categories = [
    "All", "Prasad", "Pooja Samagri", "Rudraksha & Malas",
    "Dhup / Shankh", "Tulsi Mala", "Chandan", "Tabeez", "Books",
    "Mantra Books", "God Idols & Frames", "Kanwar Yatra Samagri",
    "Sindoor", "Roli", "Haldi", "Akshat (Chawal)", "Festival Kits",
    "Digital Items (Aarti / Video / Pen drive)", "Custom Tabeez",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/all`);
        if (res.data.success) {
          setProducts(res.data.products);
          setFilteredProducts(res.data.products);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let temp = products;
    if (selectedCategory !== "All")
      temp = temp.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    if (search.trim())
      temp = temp.filter((p) =>
        [p.name, p.description, p.category, p.material, p.occasion]
          .some((f) => f?.toLowerCase().includes(search.toLowerCase()))
      );
    setFilteredProducts(temp);
  }, [search, selectedCategory, products]);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("mahakalToken");
    if (!token) { toastWarning("Please login to add items to cart"); navigate("/login"); return; }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/add`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) toastSuccess("Item added to cart!");
      else toastWarning(res.data.message || "Failed to add item");
    } catch { toastError("Something went wrong!"); }
  };

  return (
    <>
      <DharmicLoader visible={loading} />

      <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 50%,#fff7ed 100%)" }}>
     
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* ── Page Header ── */}
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em] mb-2">🕉️ Mahakal Bazar · Divine Store</p>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
              Prasad &{" "}
              <span style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Sacred Products
              </span>
            </h1>
            <p className="text-sm text-gray-400">
              {filteredProducts.length} divine item{filteredProducts.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {/* ── Search + Filter ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, categories, materials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-orange-300"
                style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(234,88,12,0.18)" }}
              />
            </div>

            {/* Category dropdown */}
            <div className="relative sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none py-3 pl-4 pr-10 rounded-2xl text-sm font-semibold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-orange-300 cursor-pointer"
                style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(234,88,12,0.18)" }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-orange-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── Active filter pill ── */}
          {(selectedCategory !== "All" || search) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedCategory !== "All" && (
                <button onClick={() => setSelectedCategory("All")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-orange-700 transition hover:bg-orange-100"
                  style={{ background: "rgba(255,247,237,0.9)", border: "1px solid rgba(234,88,12,0.25)" }}>
                  {selectedCategory} ✕
                </button>
              )}
              {search && (
                <button onClick={() => setSearch("")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-orange-700 transition hover:bg-orange-100"
                  style={{ background: "rgba(255,247,237,0.9)", border: "1px solid rgba(234,88,12,0.25)" }}>
                  "{search}" ✕
                </button>
              )}
            </div>
          )}

          {/* ── Grid ── */}
          {!loading && filteredProducts.length === 0 ? (
            <div className="text-center py-20 rounded-3xl"
              style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(234,88,12,0.12)" }}>
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-bold text-gray-700 mb-1">No products found</p>
              <p className="text-sm text-gray-400">Try a different search or category</p>
              <button onClick={() => { setSearch(""); setSelectedCategory("All"); }}
                className="mt-5 px-6 py-2.5 rounded-xl text-white text-sm font-bold"
                style={{ background: "linear-gradient(135deg,#ea580c,#dc2626)" }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {filteredProducts.map((item) => (
                <ProductCard key={item._id} item={item} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}

          {/* Bottom stripe */}
          <div className="h-1 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 opacity-30 mt-10" />
        </div>
      </div>
    </>
  );
}

export default Products;