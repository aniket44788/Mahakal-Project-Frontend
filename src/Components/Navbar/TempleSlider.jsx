import React, { useState, useEffect } from 'react';
import mahakal from "../../assets/mahakal.png";

const TempleSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Static data for temple events and prasad offerings
    const sliderData = [
        {
            id: 1,
            title: "Shri Mahakaleshwar Temple (Jyotirlinga) ",
            temple: "Jaisinghpura, Ujjain, Madhya Pradesh",
            date: "1st October, Navratri Maha Navmi",
            benefits: [
                { icon: "💰", label: "Prosperity", color: "bg-yellow-400" },
                { icon: "🏥", label: "Health", color: "bg-red-400" },
                { icon: "🛡️", label: "Protection", color: "bg-teal-400" }
            ],
            buttonText: "Special Mahakal Prashad",
            backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=500&fit=crop",
            templeImage: mahakal,
            deityImage: "/ujjainbaba.jpg"
        },
        {
            id: 2,
            title: "Harsiddhi Temple (Harsiddhi Mata Mandir)",
            temple: "Near River Shipra, in Jaisinghpura area, Ujjain",
            date: "12th November, Dhanteras",
            benefits: [
                { icon: "💎", label: "Wealth", color: "bg-yellow-400" },
                { icon: "🕉️", label: "Blessings", color: "bg-orange-400" },
                { icon: "✨", label: "Success", color: "bg-purple-400" }
            ],
            buttonText: "Harisidhi Special Prashad",
            backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=500&fit=crop",
            templeImage: "/ujjainmahakal.jpg",
            deityImage: "/ujjaintemple.jpg"
        },
        {
            id: 3,
            title: "Ujjain Mangalnath Mandir",
            temple: "Vitthal Temple, Pandharpur",
            date: "15th November, Kartik Purnima",
            benefits: [
                { icon: "🙏", label: "Devotion", color: "bg-red-400" },
                { icon: "☮️", label: "Peace", color: "bg-teal-400" },
                { icon: "🌟", label: "Moksha", color: "bg-yellow-400" }
            ],
            buttonText: "Order Now",
            backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=500&fit=crop",
            templeImage: "/ujjainmahakal.jpg",

            deityImage: "/ujjainbaba.jpg"
        },
        {
            id: 4,
            title: "Chintaman Ganesh Temple",
            temple: " Chintaman Road, Ujjain, MP 456001",
            date: "14th January, Makar Sankranti",
            benefits: [
                { icon: "🔥", label: "Energy", color: "bg-red-500" },
                { icon: "🌅", label: "New Beginnings", color: "bg-orange-400" },
                { icon: "🕯️", label: "Light", color: "bg-yellow-400" }
            ],
            buttonText: "Prasad & more",
            backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=500&fit=crop",
            templeImage: "/ujjainmahakal.jpg",
            deityImage: "/ujjaintemple.jpg"
        }
    ];

    // Auto slide functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliderData.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [sliderData.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
    };

    const currentData = sliderData[currentSlide];

    // Helper function to handle image loading errors
    const handleImageError = (e) => {
        e.target.style.display = 'none';
        console.error('Image failed to load:', e.target.src);
    };

    // Fallback image when image is not available
    const fallbackImage = "https://images.unsplash.com/photo-1582632161797-4b3cd5bd01dc?w=400&h=500&fit=crop";

    return (
        <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] overflow-hidden rounded-2xl shadow-2xl mx-auto max-w-7xl bg-white">
            {/* Content Container */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 h-full p-2 sm:p-6 lg:p-10 gap-4 sm:gap-6">
                {/* Left Section - Temple Architecture (Desktop) */}
                <div className="hidden lg:flex lg:col-span-3 items-center justify-center">
                    <div className="relative ml-3">
                        {currentData.templeImage ? (
                            <img
                                src={currentData.templeImage}
                                alt="Temple Architecture"
                                className="w-48 h-64 sm:w-56 sm:h-72 lg:w-60 lg:h-75 object-cover rounded-xl border-4 border-yellow-400 shadow-lg shadow-yellow-400/30"
                                onError={handleImageError}
                            />
                        ) : (
                            <div className="w-48 h-64 sm:w-56 sm:h-72 lg:w-60 lg:h-75 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl border-4 border-yellow-400 shadow-lg shadow-yellow-400/30 flex items-center justify-center">
                                <div className="text-5xl sm:text-6xl opacity-50">🏛️</div>
                            </div>
                        )}
                        <div className="absolute -top-6 mb-1 left-1/2 transform -translate-x-1/2">
                            <div className="text-xl sm:text-2xl animate-pulse drop-shadow-lg filter">🕉️</div>
                        </div>
                        <div className="absolute -top-2 left-0 right-0 flex justify-between px-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="text-xs sm:text-sm animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                                    🔔
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center Content */}
                <div className="col-span-1 mt-9 h-70 lg:col-span-6 flex items-center justify-center">
                    <div className="text-center lg:text-left max-w-xl mt-4 px-2 sm:px-0">
                        {/* Mobile/Tablet View: Image, Title, and Button */}
                        <div className="lg:hidden flex flex-col items-center justify-center h-full w-full px-4">
                            {currentData.templeImage ? (
                                <div className="relative w-full sm:w-5/6 max-w-[500px] h-[300px] sm:h-[400px] lg:h-[450px]">
                                    <img
                                        src={currentData.templeImage}
                                        alt="Temple"
                                        className="w-full h-full object-cover rounded-2xl border-4 border-yellow-400/50 shadow-2xl shadow-yellow-400/30 hover:scale-105 transition-transform duration-500"
                                        onError={handleImageError}
                                    />
                                    {/* Title overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm sm:text-lg font-bold text-center py-2 px-4 rounded-b-2xl">
                                        {currentData.title}
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full sm:w-5/6 max-w-[500px] h-[300px] sm:h-[400px] lg:h-[450px] bg-yellow-400/20 rounded-2xl border-4 border-yellow-400/50 flex items-center justify-center shadow-2xl shadow-yellow-400/30">
                                    <div className="text-5xl sm:text-6xl opacity-60 animate-pulse">🏛️</div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm sm:text-lg font-bold text-center py-2 px-4 rounded-b-2xl">
                                        {currentData.title}
                                    </div>
                                </div>
                            )}

                            {/* CTA Button */}
                            <button className="
    mt-3 relative w-full sm:w-3/4  bg-gradient-to-r from-red-500 via-red-600 to-red-700
    text-white font-bold py-3 px-6 rounded-full text-base uppercase tracking-wider
    shadow-lg shadow-red-600/40 hover:shadow-xl hover:shadow-red-700/60
    transform hover:-translate-y-1 hover:scale-105 transition-all duration-500 overflow-hidden group
  ">
                                <span className="relative z-10">{currentData.buttonText}</span>

                            </button>
                        </div>


                        {/* Desktop View: Full Content */}
                        <div className="hidden lg:flex lg:flex-col">
                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent leading-tight">
                                {currentData.title}
                            </h1>

                            {/* Temple Info */}
                            <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
                                <div className="flex items-center justify-center lg:justify-start text-black text-base sm:text-lg">
                                    <span className="mr-2 sm:mr-3 text-lg sm:text-xl">🏛️</span>
                                    <span>{currentData.temple}</span>
                                </div>
                                {/* <div className="flex items-center justify-center lg:justify-start text-black text-base sm:text-lg">
                                    <span className="mr-2 sm:mr-3 text-lg sm:text-xl">📅</span>
                                    <span>{currentData.date}</span>
                                </div> */}
                            </div>

                            {/* Benefits */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                                {currentData.benefits.map((benefit, index) => (
                                    <div key={index} className="flex flex-col items-center group">
                                        <div className={`
                                            w-12 h-12 sm:w-14 sm:h-14 ${benefit.color} rounded-full flex items-center justify-center text-lg sm:text-xl
                                            shadow-lg border-2 border-black/30 group-hover:scale-110 transition-transform duration-300
                                            animate-bounce
                                        `} style={{ animationDelay: `${index * 1.5}s`, animationDuration: '3s' }}>
                                            {benefit.icon}
                                        </div>
                                        <span className="text-black text-xs sm:text-sm font-semibold mt-2 text-shadow">
                                            {benefit.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <button className="
                                relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-black font-bold
                                py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg uppercase tracking-wider
                                shadow-lg shadow-red-600/40 hover:shadow-xl hover:shadow-red-600/60
                                transform hover:-translate-y-1 transition-all duration-300
                                overflow-hidden group
                            ">
                                <span className="relative z-10">{currentData.buttonText}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent 
                                             transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Section - Deity Image (Desktop) */}
                <div className="hidden lg:flex lg:col-span-3 mr-4 items-center justify-center">
                    <div className="relative">
                        {currentData.deityImage ? (
                            <img
                                src={currentData.deityImage}
                                alt="Deity"
                                className="w-48 h-64 sm:w-56 sm:h-72 lg:w-60 lg:h-75 object-cover rounded-xl border-4 border-yellow-400 shadow-xl shadow-yellow-400/50"
                                onError={(e) => {
                                    e.target.src = fallbackImage;
                                }}
                            />
                        ) : (
                            <div className="w-48 h-64 sm:w-56 sm:h-72 lg:w-60 lg:h-75 bg-gradient-to-br from-yellow-400/20 to-red-400/20 rounded-xl border-4 border-yellow-400 shadow-xl shadow-yellow-400/50 flex items-center justify-center">
                                <div className="text-5xl sm:text-6xl opacity-50">🕉️</div>
                            </div>
                        )}
                        <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 rounded-2xl animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-3 sm:px-4 z-20">
                <button
                    onClick={prevSlide}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-black/90 hover:bg-yellow-400 rounded-full flex items-center justify-center
                               text-white text-xl sm:text-2xl font-bold shadow-lg hover:scale-110 transition-all duration-300"
                >
                    ‹
                </button>
                <button
                    onClick={nextSlide}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-black/90 hover:bg-yellow-400 rounded-full flex items-center justify-center
                               text-white text-xl sm:text-2xl font-bold shadow-lg hover:scale-110 transition-all duration-300"
                >
                    ›
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
                {sliderData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Mandala Patterns */}
                <div className="absolute top-3 sm:top-5 left-3 sm:left-5 w-12 sm:w-16 h-12 sm:h-16 opacity-30">
                    <div className="w-full h-full bg-gradient-to-br from-yellow-400/40 to-transparent rounded-full"></div>
                </div>
                <div className="absolute top-3 sm:top-5 right-3 sm:right-5 w-12 sm:w-16 h-12 sm:h-16 opacity-30">
                    <div className="w-full h-full bg-gradient-to-bl from-yellow-400/40 to-transparent rounded-full"></div>
                </div>

                {/* Floating Lotus Petals */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute text-lg sm:text-2xl opacity-40 animate-bounce`}
                        style={{
                            top: `${10 + (i * 10)}%`,
                            left: `${5 + (i % 2) * 90}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: '4s'
                        }}
                    >
                        🪷
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TempleSlider;