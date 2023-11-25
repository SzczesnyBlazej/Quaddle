// Home.js
import React from 'react';
import HomeColFirst from './HomeColFirst'
import HomeColTwo from './HomeColTwo';
import HomeColThree from './HomeColThree';

const Home = () => {

    return (
        <div>
            <div className="row g-0 ">

                {/* First Column */}
                <HomeColFirst />

                {/* Second Column */}
                <HomeColTwo />

                {/* Third Column */}
                <HomeColThree />

            </div>
        </div>
    );
};

export default Home;
