"use client";

import { useEffect, useState, useRef } from "react";

// Generator for mock points
function generateMockPoints(count = 60) {
    const points = [];
    let price = 150 + Math.random() * 50;

    for (let i = 0; i < count; i++) {
        const change = (Math.random() - 0.48) * 3;
        price = Math.max(80, price + change);

        points.push({ price });
    }
    return points;
}

export default function HomePage() {
    const [drawKey, setDrawKey] = useState(0);
    const [graphData, setGraphData] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const containerRef = useRef(null);
    const detailsRef = useRef(null);

    useEffect(() => {
        const points = generateMockPoints();

        const prices = points.map((p) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        const width = 1200;
        const height = 600;
        const minY = 80;
        const maxY = 520;

        const priceRange = maxPrice - minPrice || 1;

        const coords = points.map((p, index) => {
            const x = (index / (points.length - 1)) * width;
            const normalizedPrice = (p.price - minPrice) / priceRange;
            const y = maxY - normalizedPrice * (maxY - minY);
            return { x, y, price: p.price, date: p.date };
        });

        // Dynamic gradient stops based on price trends
        const gradientStops = coords.map((pt, i) => {
            const pct = Math.round((i / (coords.length - 1)) * 100);
            if (i === 0) return { pct: 0, color: "#10b981" };
            const isDown = pt.price < coords[i - 1].price;
            return { pct, color: isDown ? "#ef4444" : "#10b981" };
        });

        // Direct sharp line path (no curves)
        const pathD = coords.reduce((acc, point, idx) => {
            return `${acc} ${idx === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
        }, "");

        const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

        setGraphData({
            coords,
            gradientStops,
            pathD,
            areaD,
        });
        setHoverIndex(null);
        setDrawKey((prev) => prev + 1);
    }, []);

    useEffect(() => {
        const detailsSection = detailsRef.current;
        if (!detailsSection) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setDetailsVisible(true);
            },
            { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
        );

        observer.observe(detailsSection);
        return () => observer.disconnect();
    }, [graphData]);

    const scrollToDetails = () => {
        setDetailsVisible(true);
        detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handlePointerMove = (e) => {
        if (!containerRef.current || !graphData?.coords) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const xRatio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

        const index = Math.round(xRatio * (graphData.coords.length - 1));
        setHoverIndex(index);
    };

    const handlePointerLeave = () => setHoverIndex(null);

    if (!graphData) return null;

    const activePoint = hoverIndex !== null ? graphData.coords[hoverIndex] : null;

    return (
        <main className="bg-[#050505] text-white">
            <section
                ref={containerRef}
                onMouseMove={handlePointerMove}
                onTouchMove={handlePointerMove}
                onMouseLeave={handlePointerLeave}
                onTouchEnd={handlePointerLeave}
                className="relative min-h-screen w-full overflow-hidden font-mono flex flex-col items-center justify-center select-none cursor-crosshair"
            >
                <style jsx>{`
        @keyframes drawLine {
          from { stroke-dashoffset: 3500; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-draw {
          stroke-dasharray: 3500;
          stroke-dashoffset: 3500;
          animation: drawLine 3.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-fade-delayed {
          opacity: 0;
          animation: fadeIn 0.5s ease-out 1.4s forwards;
        }

        .subtle-title-glow {
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.25);
        }
      `}</style>

                {/* SVG Background Graph */}
                <svg
                    key={drawKey}
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    viewBox="0 0 1200 600"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            {(graphData?.gradientStops || []).map((stop, idx) => (
                                <stop key={idx} offset={`${stop.pct}%`} stopColor={stop.color} />
                            ))}
                        </linearGradient>

                        <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>

                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        <filter id="bright-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    <path d={graphData.areaD} fill="url(#area-gradient)" className="animate-fade-delayed" />

                    <path
                        d={graphData.pathD}
                        fill="none"
                        stroke="url(#line-gradient)"
                        strokeWidth="3.5"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        filter="url(#glow)"
                        className="animate-draw"
                    />

                    {/* Scrubbing Cursor */}
                    {activePoint && (
                        <g>
                            <line
                                x1={activePoint.x}
                                y1="0"
                                x2={activePoint.x}
                                y2="600"
                                stroke="#10b981"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                                opacity="0.6"
                            />
                            <circle cx={activePoint.x} cy={activePoint.y} r="16" fill="#34d399" opacity="0.2" />
                            <circle cx={activePoint.x} cy={activePoint.y} r="8" fill="#34d399" filter="url(#bright-glow)" />
                            <circle cx={activePoint.x} cy={activePoint.y} r="4" fill="#ffffff" />
                        </g>
                    )}
                </svg>

                {/* Tooltip on Scrub */}
                {activePoint && (
                    <div
                        style={{
                            left: `${(activePoint.x / 1200) * 100}%`,
                            top: `${(activePoint.y / 600) * 100}%`,
                            transform: activePoint.x > 900 ? "translate(-110%, -130%)" : "translate(10%, -130%)",
                        }}
                        className="absolute z-40 bg-zinc-950/95 border border-emerald-400 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] pointer-events-none transition-transform duration-75 flex flex-col gap-0.5"
                    >
                        <div className="font-bold text-sm">${activePoint.price.toFixed(2)}</div>
                    </div>
                )}

                {/* Center Welcome Container */}
                <div className="relative z-30 text-center max-w-xl px-5 mt-12 pointer-events-none">
                    <h1 className="text-4xl font-semibold text-white subtle-title-glow">Welcome to Oneview</h1>
                    <h1 className="text-3xl font-semibold text-white/70">Welcome to Oneview</h1>
                    <h1 className="text-2xl font-semibold text-white/50">Welcome to Oneview</h1>
                    <h1 className="text-xl font-semibold text-white/30">Welcome to Oneview</h1>
                    <h1 className="text-sm font-semibold text-white/10">Welcome to Oneview</h1>

                    <p className="text-zinc-400 text-sm md:text-base mt-6 mb-8 leading-relaxed">
                        Your personal dashboard for real-time market analytics and asset tracking.
                    </p>

                    <div className="flex gap-4 justify-center items-center pointer-events-auto">
                        <button onClick={scrollToDetails} className="bg-white text-black font-bold px-6 py-2.5 text-sm rounded-md hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            Get Started →
                        </button>
                        <button className="bg-zinc-900/80 text-zinc-300 border border-zinc-700/80 px-6 py-2.5 text-sm rounded-md hover:bg-zinc-800 transition-colors backdrop-blur-sm">
                            View Demo
                        </button>
                    </div>
                </div>
            </section>

            <section ref={detailsRef} className="relative z-20 border-t border-zinc-800/80 bg-[#0a0a0a] px-6 py-24 md:px-12 lg:px-20">
                <div className="mx-auto max-w-6xl">
                    <div className={`mb-16 max-w-2xl transition-all duration-700 ${detailsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white">The Oneview edge</p>
                        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">A clearer view of what moves your money.</h2>
                        <p className="mt-6 text-base leading-8 text-zinc-400 md:text-lg">
                            Oneview brings your market data, watchlists, and portfolio signals into one focused workspace. Less noise, more context, and a faster path from noticing a change to understanding it.
                        </p>
                    </div>

                    <div className={`grid gap-px overflow-hidden border border-zinc-800 bg-zinc-800 transition-all duration-700 delay-150 md:grid-cols-3 ${detailsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                        {[
                            ["01", "See the signal", "Track price movement in real time with charts that keep the important changes in view."],
                            ["02", "Know the context", "Compare assets and timeframes without losing the bigger picture behind each number."],
                            ["03", "Move with confidence", "Turn a sharper understanding of the market into your next considered decision."],
                        ].map(([number, title, description]) => (
                            <article key={number} className="bg-[#0a0a0a] p-7 md:p-8">
                                <span className="font-mono text-xs text-white">{number}</span>
                                <h3 className="mt-12 text-xl font-medium text-white">{title}</h3>
                                <p className="mt-4 text-sm leading-7 text-zinc-500">{description}</p>
                            </article>
                        ))}
                    </div>

                    <div className={`mt-24 grid gap-10 border-t border-zinc-800 pt-10 transition-all duration-700 delay-300 md:grid-cols-[1fr_auto] md:items-end ${detailsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">Built for the long view</p>
                            <p className="mt-4 max-w-xl text-2xl leading-snug text-zinc-200">A calm place to check in, zoom out, and make sense of the market.</p>
                        </div>
                        <button className="w-fit border border-zinc-500 px-5 py-3 font-mono text-sm text-white transition-colors hover:bg-white hover:text-black">
                            Start exploring <span aria-hidden="true">-&gt;</span>
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}