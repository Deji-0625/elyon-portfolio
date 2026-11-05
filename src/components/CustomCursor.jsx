import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Check if the mouse is hovering over an interactive element
            const target = e.target;
            if (
                target.closest('a') ||
                target.closest('button') ||
                target.closest('.tool-interactive') ||
                target.closest('.ag-panel') ||
                target.closest('.ba-nav-item') ||
                target.closest('.footer-input')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);

    // Framer Motion animation states
    const variants = {
        default: {
            x: mousePosition.x - 8, // Centers the 16px dot
            y: mousePosition.y - 8,
            scale: 1,
            backgroundColor: '#E58A3A', // Brand Orange
            border: '0px solid transparent',
            opacity: 1
        },
        hover: {
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
            scale: 3, // Expands outward
            backgroundColor: 'transparent', // Hollows out the center
            border: '1px solid #E58A3A', // Orange ring
            opacity: 1
        }
    };

    return (
        <motion.div
            className="custom-cursor"
            variants={variants}
            animate={isHovering ? "hover" : "default"}
            // Spring physics for that smooth, premium trailing effect
            transition={{ type: "spring", stiffness: 600, damping: 35, mass: 0.5 }}
        />
    );
}