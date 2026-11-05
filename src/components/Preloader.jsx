import React, { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    // Wait half a second at 100% for a dramatic pause, then trigger the slide-out
                    setTimeout(() => {
                        onComplete();
                    }, 500);
                    return 100;
                }
                // Randomly increment between 1 and 15 for a natural, staggered counting feel
                const increment = Math.floor(Math.random() * 15) + 1;
                return Math.min(oldProgress + increment, 100);
            });
        }, 40); // Speed of the counter

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="preloader-content">
            <span className="preloader-brand">Elyon Concepts</span>
            <span className="preloader-counter">{progress}%</span>
        </div>
    );
}