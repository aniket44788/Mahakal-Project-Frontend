import React from 'react'
import WhyBookWithUs from "./WhyBookWithUs";
import HowItWorks from "./HowItWorks";
// import HomeFooter from "./HomeFooter";
import TempleSlider from './TempleSlider';
import DashboardProducts from './DashboardProducts';
import { Navigate, useNavigate } from 'react-router-dom';

function Home() {
    const Navigate = useNavigate()
    return (
        <>
            <>



                <div className="pt-4">
                    <TempleSlider />
                </div>
                <div className="w-full flex flex-col justify-center items-center text-center my-10 px-4">
                    <h2
                        className="text-4xl mb-2 md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-500 
               bg-clip-text text-transparent drop-shadow-md animate-fade-in"
                    >
                        Blessings Delivered to Your Doorstep
                    </h2>

                    <span className="block w-20 h-1 mt-4 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full animate-pulse"></span>
                    <p className="text-gray-600 mt-4 text-sm md:text-base max-w-2xl">
                        Experience the divine taste of authentic temple Prashad, lovingly packed and sent from sacred shrines across India.
                    </p>
                </div>
                <div>
                    <DashboardProducts />
                    <div className='w-full  flex items-center justify-center '>

                        <button
                            onClick={() => Navigate("/products")}
                            className="  min-w-max bg-gradient-to-r from-red-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
                        >
                            📋 View All Products .....
                        </button>
                    </div>

                </div>

                <div>
                    <WhyBookWithUs />
                </div>
                <div>
                    <HowItWorks />
                </div>
               
            </>
        </>
    )
}

export default Home