import React, { useRef, useEffect } from 'react';

export default function GradientWaves({
    waveColor = "#304F4F",
    amplitude = 60,
    swell = 1.5,
    lightAngle = 145,
    speed = 0.012
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;
        let width = 0;
        let height = 0;

        // The Observer continuously forces the canvas to match its exact parent dimensions
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width: w, height: h } = entry.contentRect;
                const dpr = window.devicePixelRatio || 1;
                canvas.width = w * dpr;
                canvas.height = h * dpr;
                width = w;
                height = h;
                ctx.scale(dpr, dpr);
            }
        });

        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        const draw = () => {
            time += speed;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (width === 0 || height === 0) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }

            const angleRad = (lightAngle * Math.PI) / 180;
            const x2 = Math.cos(angleRad) * width;
            const y2 = Math.sin(angleRad) * height;

            const waves = [
                { offset: 0, scale: 0.8, alpha: 0.05 },
                { offset: 2, scale: 1.0, alpha: 0.08 },
                { offset: 4, scale: 1.2, alpha: 0.12 }
            ];

            waves.forEach((wave) => {
                ctx.beginPath();
                ctx.moveTo(0, height);

                for (let x = 0; x <= width; x += 5) {
                    const dx = x / (width / swell);
                    const y = (height * 0.55) +
                        Math.sin(dx + time + wave.offset) * (amplitude * wave.scale) +
                        Math.cos(dx * 0.5 - time * 0.8) * (amplitude * 0.5);

                    ctx.lineTo(x, y);
                }

                ctx.lineTo(width, height);
                ctx.closePath();

                const gradient = ctx.createLinearGradient(0, 0, x2, y2);
                gradient.addColorStop(0, waveColor);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.globalAlpha = wave.alpha;
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.globalAlpha = 1.0;
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, [waveColor, amplitude, swell, lightAngle, speed]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0
            }}
        />
    );
}