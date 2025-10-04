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