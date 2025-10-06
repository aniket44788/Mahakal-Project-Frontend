import React from 'react'
import WhyBookWithUs from "./WhyBookWithUs";
import HowItWorks from "./HowItWorks";
import HomeFooter from "./HomeFooter";
import TempleSlider from './TempleSlider';

function Home() {
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
                    <WhyBookWithUs />
                </div>
                <div>
                    <HowItWorks />
                </div>
                <div>
                    <HomeFooter />
                </div>
            </>
        </>
    )
}

export default Home