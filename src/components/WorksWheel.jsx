import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";

const CARD_H = 0.38;
const CARD_MAX_W = 0.34;
const CARD_RATIO = 1.45;
const STEP = 40;
const DRUM = 2.22;
const LENS = 2.7;
const RING_R = 1.14;
const BOW = 1.82;
const TITLE = 0.124;
const INDEX = 0.04;
const CULL = 1.6;

const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
const SETTLE = 140;
const EASE = 0.12;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rad = (deg) => (deg * Math.PI) / 180;

const bowAt = (drumDeg, bow) => -bow * (1 - Math.cos(rad(drumDeg)));

function place(ringDeg, drumDeg, ringR, drumR, bow, m) {
    return (
        `translateX(${m * bowAt(drumDeg, bow)}px)` +
        ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
        ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
    );
}

export default function WorksWheel({
    items,
    label = "Works '26",
    action = "View",
    className = "",
    ...props
}) {
    const stageRef = useRef(null);
    const wheelRef = useRef(null);
    const cardRefs = useRef([]);
    const labelRef = useRef(null);
    const titleRef = useRef(null);

    const turn = useRef(0);
    const target = useRef(0);
    const [active, setActive] = useState(0);
    const [stage, setStage] = useState({ w: 0, h: 0 });

    const count = items.length;
    const last = Math.max(count - 1, 0);

    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const read = () => setReduced(query.matches);
        read();
        query.addEventListener("change", read);
        return () => query.removeEventListener("change", read);
    }, []);

    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;
        const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
        read();
        const ro = new ResizeObserver(read);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const metrics = useMemo(() => {
        const { w, h } = stage;
        const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
        const cardH = cardW / CARD_RATIO;
        const drumR = cardH * DRUM;
        const ringR = cardH * RING_R;
        const ringScale = count
            ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
            : 1;
        return {
            cardW,
            cardH,
            ringR,
            ringScale,
            drumR,
            bow: cardH * BOW,
            depth: cardH * LENS,
            title: cardH * TITLE,
            index: cardH * INDEX,
        };
    }, [stage, count]);

    useEffect(() => {
        if (!stage.h) return;
        let frame = 0;
        const { ringR, ringScale, drumR, bow } = metrics;

        const draw = () => {
            frame = requestAnimationFrame(draw);
            const gap = target.current - turn.current;
            if (Math.abs(gap) < 0.0005) turn.current = target.current;
            else turn.current += gap * (reduced ? 1 : EASE);

            const t = turn.current;
            const m = clamp(t, 0, 1);
            const pos = Math.max(0, t - 1);

            if (wheelRef.current) {
                wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
            }

            for (let i = 0; i < count; i++) {
                const d = i - pos;
                const drumDeg = d * STEP;
                const card = cardRefs.current[i];
                if (card) {
                    card.style.transform = place(
                        d * (360 / count),
                        drumDeg,
                        ringR,
                        drumR,
                        bow,
                        m
                    );
                    card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
                    card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
                }
                const face = card?.firstElementChild;
                if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
            }

            if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
            if (titleRef.current) titleRef.current.style.opacity = String(m);
            const near = clamp(Math.round(pos), 0, last);
            setActive((prev) => (prev === near ? prev : near));
        };

        frame = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frame);
    }, [metrics, stage.h, count, last, reduced]);

    const to = useCallback(
        (next) => {
            target.current = clamp(next, 0, last + 1);
        },
        [last]
    );

    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;

        const onWheel = (event) => {
            const next = target.current + event.deltaY / WHEEL_UNITS;

            // THE FIX: If we have room to spin the wheel, trap the scroll
            if (next > 0 && next < last + 1) {
                event.preventDefault();    // Stops native jumping
                event.stopPropagation();   // Blinds Lenis to the wheel, stopping page scroll
            }

            to(next);

            window.clearTimeout(settling.current);
            settling.current = window.setTimeout(
                () => to(Math.round(target.current)),
                SETTLE
            );
        };

        el.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            el.removeEventListener("wheel", onWheel);
            window.clearTimeout(settling.current);
        };
    }, [to, last]);

    const drag = useRef(null);
    const settling = useRef(0);

    return (
        <section
            aria-label={label}
            className={`ww-section ${className}`}
            {...props}
        >
            <div
                ref={stageRef}
                tabIndex={0}
                role="listbox"
                aria-label={label}
                aria-activedescendant={`works-wheel-${active}`}
                className="ww-stage"
                style={{ perspective: `${metrics.depth}px` }}
                onPointerDown={(event) => {
                    drag.current = event.clientY;
                    event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                    if (drag.current === null) return;
                    to(target.current + (drag.current - event.clientY) / DRAG_UNITS);
                    drag.current = event.clientY;
                }}
                onPointerUp={() => {
                    drag.current = null;
                    if (target.current > 1) to(Math.round(target.current));
                }}
                onKeyDown={(event) => {
                    if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
                    else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
                    else return;
                    event.preventDefault();
                }}
            >
                <div ref={wheelRef} className="ww-drum">
                    {items.map((item, i) => {
                        const Tag = item.href ? "a" : "div";
                        return (
                            <React.Fragment key={item.title}>
                                <Tag
                                    id={`works-wheel-${i}`}
                                    role="option"
                                    aria-selected={i === active}
                                    href={item.href}
                                    ref={(node) => { cardRefs.current[i] = node; }}
                                    className="ww-card group"
                                    style={{
                                        width: metrics.cardW,
                                        height: metrics.cardH,
                                        marginLeft: -metrics.cardW / 2,
                                        marginTop: -metrics.cardH / 2,
                                    }}
                                >
                                    <span className="ww-card-inner">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            draggable={false}
                                            className="ww-img"
                                        />
                                        {action && item.href ? (
                                            <span className="ww-action">
                                                <svg viewBox="0 0 12 12" className="ww-action-icon" aria-hidden="true">
                                                    <path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {action}
                                            </span>
                                        ) : null}
                                    </span>
                                </Tag>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <div
                ref={labelRef}
                className="ww-label"
                style={{ fontSize: metrics.title }}
            >
                {label}
            </div>
            <div
                ref={titleRef}
                className="ww-title"
                style={{ fontSize: metrics.title }}
            >
                {items[active]?.title}
            </div>

            <ol
                className="ww-index"
                style={{ fontSize: metrics.index }}
            >
                {items.map((item, i) => (
                    <li key={item.title}>
                        <button
                            type="button"
                            onClick={() => to(i + 1)}
                            className={`ww-index-btn ${i === active ? "active" : ""}`}
                        >
                            {item.title}
                        </button>
                    </li>
                ))}
            </ol>
        </section>
    );
}