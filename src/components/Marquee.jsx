import React from 'react';

export default function Marquee() {
    const words = [
        "Brand Identity",
        "Digital Design",
        "Creative Direction",
        "Social Media",
        "UI/UX Visuals"
    ];

    // We duplicate the array to create the seamless loop
    const duplicatedWords = [...words, ...words, ...words, ...words];

    return (
        <div className="marquee-container">
            <div className="marquee-content">
                {duplicatedWords.map((word, index) => (
                    <div key={index} className="marquee-item">
                        {word}
                        <span className="marquee-star">✦</span>
                    </div>
                ))}
            </div>
        </div>
    );
}