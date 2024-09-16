// components/Loader.js
import React from 'react';

const Loader = () => {
    console.log("loading is called");
    return (
        <div className="loader-overlay">
            <div className="loader">Loader......</div>
        </div>
    );
};

export default Loader;
