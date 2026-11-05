import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import './AccordionGallery.css';

// 1. PROPER IMPORTS (Since you fixed the filenames earlier!)
import work1 from '../assets/work-1.jpg';
import work2 from '../assets/work-2.png';
import work3 from '../assets/work-3.jpg';
import work4 from '../assets/work-4.jpg';
import work5 from '../assets/work-5.jpg';

// 2. MAPPED DATA
const ELYON_PROJECTS = [
    { image: work1, label: 'CYDSSA Enlightenment', category: 'Flyer Design', link: '' },
    { image: work2, label: 'Love & Career Talk', category: 'Event Publicity', link: '' },
    { image: work3, label: 'Connect 2026 Finale', category: 'Event Publicity', link: '' },
    { image: work4, label: 'LinkedIn Strategy Summit', category: 'Digital & Social', link: '' },
    { image: work5, label: 'COMSSITES September', category: 'Flyer Design', link: '' }
];

const AccordionGallery = ({
    items = ELYON_PROJECTS,
    defaultIndex = 2,
    accentColor = '#E58A3A', 
    overlayColor = '#0b1313', 
    textColor = '#ffffff',
    height = 500, 
    gap = 10,
    radius = 16,
    expandRatio = 0.52,
    orientation = 'horizontal',
    duration = 0.6,
    ease = 'power3.out',
    parallax = 0.5,
    tilt = 8,
    stagger = 0.06,
    trigger = 'hover',
    showLabels = true,
    grayscale = false, 
    className = ''
}) => {
    const rootRef = useRef(null);
    const panelRefs = useRef([]);
    const mediaRefs = useRef([]);
    const barRefs = useRef([]);
    const textRefs = useRef([]);
    const tlRef = useRef(null);
    const firstRunRef = useRef(true);
    const mediaSizeRef = useRef(320);

    const vertical = orientation === 'vertical';
    const count = items.length;
    const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));
    
    // --- LIGHTBOX STATE ---
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxData, setLightboxData] = useState(null);

    const prefersReduced =
        typeof window !== 'undefined' && window.matchMedia
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
            : false;

    const applyLayout = useCallback(
        animate => {
            const panels = panelRefs.current;
            if (!panels.length) return;

            const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
            const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
            const mediaSize = mediaSizeRef.current;

            tlRef.current?.kill();
            const dur = animate && !prefersReduced ? duration : 0;
            const tl = gsap.timeline();

            panels.forEach((panel, i) => {
                if (!panel) return;
                const isActive = i === active;
                const media = mediaRefs.current[i];
                const bar = barRefs.current[i];
                const text = textRefs.current[i];

                const rot = isActive ? 0 : i < active ? tilt : -tilt;
                const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

                tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

                if (media) {
                    const drift = Math.max(-1.5, Math.min(1.5, active - i));
                    const shift = drift * parallax * mediaSize * 0.06;
                    const gray = grayscale ? (isActive ? 0 : 1) : 0;
                    tl.to(
                        media,
                        {
                            xPercent: -50,
                            yPercent: -50,
                            x: vertical ? 0 : isActive ? 0 : shift,
                            y: vertical ? (isActive ? 0 : shift) : 0,
                            '--ag-gray': gray,
                            '--ag-dim': isActive ? 0 : 0.35,
                            duration: dur,
                            ease
                        },
                        0
                    );
                }

                if (showLabels && bar && text) {
                    if (isActive) {
                        tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger }, 0);
                    } else {
                        tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
                    }
                }
            });

            tlRef.current = tl;
        },
        [active, count, expandRatio, duration, ease, vertical, tilt, parallax, grayscale, showLabels, stagger, prefersReduced]
    );

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        const measure = () => {
            const rect = el.getBoundingClientRect();
            const total = vertical ? rect.height : rect.width;
            const usable = Math.max(total - gap * (count - 1), 120);
            const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
            mediaSizeRef.current = size;
            el.style.setProperty('--ag-media-size', `${size}px`);
            applyLayout(!firstRunRef.current);
        };

        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [applyLayout, gap, count, expandRatio, vertical]);

    useEffect(() => {
        applyLayout(!firstRunRef.current);
        firstRunRef.current = false;
    }, [applyLayout]);

    useEffect(
        () => () => {
            tlRef.current?.kill();
        },
        []
    );

    const handleEnter = i => {
        if (trigger === 'hover') setActive(i);
    };

    const handleClick = (i, e) => {
        e.preventDefault();
        if (i !== active) {
            setActive(i);
        } else {
            setLightboxData(items[i]);
            setLightboxOpen(true);
        }
    };

    const handleKeyDown = (i, e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i + 1) % count);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i - 1 + count) % count);
        } else if (e.key === 'Enter') {
            handleClick(i, e);
        }
    };

    return (
        <>
            <div
                ref={rootRef}
                className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
                style={{
                    '--ag-accent': accentColor,
                    '--ag-overlay': overlayColor,
                    '--ag-text': textColor,
                    '--ag-gap': `${gap}px`,
                    '--ag-radius': `${radius}px`,
                    height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`
                }}
                role="list"
                aria-label="Image accordion gallery"
            >
                {items.map((item, i) => {
                    const isActive = i === active;
                    const Tag = item.link ? 'a' : 'div';
                    return (
                        <Tag
                            key={i}
                            ref={el => (panelRefs.current[i] = el)}
                            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
                            style={{ borderRadius: `${radius}px`, cursor: isActive ? 'zoom-in' : 'pointer' }}
                            href={item.link || undefined}
                            onClick={e => handleClick(i, e)}
                            onMouseEnter={() => handleEnter(i)}
                            onFocus={() => setActive(i)}
                            onKeyDown={e => handleKeyDown(i, e)}
                            role="listitem"
                            tabIndex={0}
                            aria-current={isActive ? 'true' : undefined}
                            aria-label={item.label}
                        >
                            <span className="ag-panel__frame">
                                <span className="ag-panel__media" ref={el => (mediaRefs.current[i] = el)}>
                                    <img src={item.image} alt={item.alt || item.label || ''} draggable="false" />
                                </span>
                                <span className="ag-panel__overlay" aria-hidden="true" />
                            </span>
                            {showLabels && (
                                <span className="ag-panel__label" aria-hidden="true">
                                    <span className="ag-panel__bar" ref={el => (barRefs.current[i] = el)} />
                                    <span className="ag-panel__text" ref={el => (textRefs.current[i] = el)}>
                                        {item.label}
                                    </span>
                                </span>
                            )}
                        </Tag>
                    );
                })}
            </div>

            {/* --- BULLETPROOF INLINE PORTAL LIGHTBOX --- */}
            {lightboxOpen && typeof document !== 'undefined' && createPortal(
                <div 
                    style={{
                        position: 'fixed',
                        inset: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 2147483647, /* Maximum possible z-index to force it over the nav */
                        backgroundColor: 'rgba(11, 19, 19, 0.85)',
                        backdropFilter: 'blur(25px)',
                        WebkitBackdropFilter: 'blur(25px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '3vw',
                        animation: 'modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    }}
                    onClick={() => setLightboxOpen(false)}
                >
                    <div 
                        style={{
                            position: 'relative',
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            animation: 'modalScaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                        }} 
                        onClick={e => e.stopPropagation()}
                    >
                        <span 
                            style={{
                                position: 'absolute',
                                top: '-3rem',
                                right: 0,
                                color: 'var(--neutral-grey)',
                                fontSize: '3.5rem',
                                fontWeight: 300,
                                cursor: 'pointer',
                                lineHeight: 1,
                                zIndex: 10
                            }} 
                            onClick={() => setLightboxOpen(false)}
                            onMouseOver={(e) => e.target.style.color = 'var(--accent-orange)'}
                            onMouseOut={(e) => e.target.style.color = 'var(--neutral-grey)'}
                        >
                            ×
                        </span>
                        
                        <img 
                            src={lightboxData.image} 
                            alt={lightboxData.label} 
                            style={{
                                maxHeight: '75vh',
                                maxWidth: '100%',
                                objectFit: 'contain',
                                borderRadius: '0.75rem',
                                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)',
                                border: '1px solid rgba(241, 245, 245, 0.15)',
                                display: 'block'
                            }}
                        />
                        
                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.75rem', color: 'var(--bg-white)', fontFamily: "'Manrope', sans-serif", fontWeight: 600, margin: '0 0 0.25rem 0' }}>
                                {lightboxData.label}
                            </h3>
                            <p style={{ color: 'var(--accent-orange)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, margin: 0 }}>
                                {lightboxData.category}
                            </p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default AccordionGallery;