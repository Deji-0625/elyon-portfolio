import React from 'react';

export default function FloatingTools() {
    const tools = [
        {
            name: "Figma",
            color: "#F24E1E",
            // Clean SVG for Figma
            svg: <svg viewBox="0 0 38 57" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 28.5C19 33.7467 14.7467 38 9.5 38C4.25329 38 0 33.7467 0 28.5C0 23.2533 4.25329 19 9.5 19H19V28.5Z" /><path d="M0 9.5C0 4.25329 4.25329 0 9.5 0H19V19H9.5C4.25329 19 0 14.7467 0 9.5Z" /><path d="M19 0H28.5C33.7467 0 38 4.25329 38 9.5C38 14.7467 33.7467 19 28.5 19H19V0Z" /><path d="M19 38H28.5C33.7467 38 38 33.7467 38 28.5C38 23.2533 33.7467 19 28.5 19H19V38Z" /><path d="M19 38V57C19 57 9.5 57 9.5 57C4.25329 57 0 52.7467 0 47.5C0 42.2533 4.25329 38 9.5 38H19Z" /></svg>
        },
        {
            name: "Photoshop",
            color: "#31A8FF",
            // Clean SVG for Ps
            svg: <svg viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H40V40H0V0Z" fill="currentColor" fillOpacity="0.1" /><path d="M10.8 13.5H16.2C19.5 13.5 21.2 15.2 21.2 18.2C21.2 21.2 19.5 22.8 16.2 22.8H13.8V28H10.8V13.5ZM13.8 20.2H15.8C17.5 20.2 18.2 19.5 18.2 18.2C18.2 16.8 17.5 16.1 15.8 16.1H13.8V20.2ZM24.5 22.5C24.5 24.5 26.2 25.5 28.2 25.5C30.2 25.5 31.5 24.8 31.5 23.5C31.5 22.2 30.5 21.5 28.2 20.8C25.2 19.8 24 18.5 24 16.5C24 13.8 26.2 12.5 28.8 12.5C31.5 12.5 33.2 13.5 34.2 15.5L31.8 16.8C31 15.5 29.8 14.8 28.5 14.8C27 14.8 26 15.5 26 16.5C26 17.5 26.8 18.2 29.2 19C32.2 20 33.5 21.2 33.5 23.5C33.5 26.5 31.2 28.2 28.2 28.2C25.2 28.2 23 26.8 22.2 24.5L24.5 22.5Z" /></svg>
        },
        {
            name: "Canva",
            color: "#00C4CC",
            // Generic 'C' to represent Canva neatly
            svg: <svg viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20 40C8.95431 40 0 31.0457 0 20C0 8.9543 8.95431 0 20 0C31.0457 0 40 8.9543 40 20C40 31.0457 31.0457 40 20 40ZM20 8C13.3726 8 8 13.3726 8 20C8 26.6274 13.3726 32 20 32C24.1685 32 27.8427 30.053 30.1259 26.9971L24.6292 22.8465C23.5857 24.2374 21.9168 25.1429 20 25.1429C17.1598 25.1429 14.8571 22.8402 14.8571 20C14.8571 17.1598 17.1598 14.8571 20 14.8571C21.9168 14.8571 23.5857 15.7626 24.6292 17.1535L30.1259 13.0029C27.8427 9.94701 24.1685 8 20 8Z" /></svg>
        },
        {
            name: "CapCut",
            color: "#000000",
            // Minimalist scissors/edit representation
            svg: <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-6-6m2-5a2 2 0 11-4 0 2 2 0 014 0zM7 21l6-6M9 7a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        },
        {
            name: "Illustrator",
            color: "#FF9A00",
            // Clean SVG for Ai
            svg: <svg viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H40V40H0V0Z" fill="currentColor" fillOpacity="0.1" /><path d="M17.5 12L12 28H15L16.2 24.2H21.8L23 28H26L20.5 12H17.5ZM17 21.8L19 15.5L21 21.8H17ZM28.5 15.5H31.5V28H28.5V15.5ZM30 11.5C31.1046 11.5 32 12.3954 32 13.5C32 14.6046 31.1046 15.5 30 15.5C28.8954 15.5 28 14.6046 28 13.5C28 12.3954 28.8954 11.5 30 11.5Z" /></svg>
        }
    ];

    // We loop the tools a few times so the track never goes empty
    const ecosystem = [...tools, ...tools, ...tools, ...tools, ...tools];

    return (
        <div className="floating-tools-container">
            <div className="floating-tools-track">
                {ecosystem.map((tool, index) => (
                    // The wrapper handles the floating animation
                    <div
                        key={index}
                        className="tool-float-wrapper"
                        style={{
                            animationDelay: `${(index % 5) * -1.3}s` // Scrambles the float timing so they don't move together
                        }}
                    >
                        {/* The inner item handles the hover snap & color */}
                        <div
                            className="tool-interactive"
                            style={{ '--hover-color': tool.color }}
                            title={tool.name}
                        >
                            {tool.svg}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}