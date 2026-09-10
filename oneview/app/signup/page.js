"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();

        setMessage("Loading...");

        try {
            const res = await fetch(
                "https://bookish-cod-rq5jpjqvjg524p6-5001.app.github.dev/signup",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Signup failed");
                return;
            }

            setMessage("Signup successful");
            router.push("/login");

        } catch (err) {
            console.error("FETCH ERROR:", err);
            setMessage("Backend not running");
        }
    }

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-[#050505] font-sans">
                <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-[#0a0a0a] border border-zinc-800 shadow-[0_0_30px_rgba(255,255,255,0.04)]">

                    <div className="flex flex-col items-center gap-6 text-center">
                        <h1 className="text-5xl font-semibold text-white">
                            Sign Up
                        </h1>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 w-full max-w-md"
                        >
                            <input
                                type="text"
                                placeholder="Username"
                                required
                                className="h-14 px-6 rounded-full border border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-400 outline-none focus:border-red-400/70 focus:ring-2 focus:ring-red-500/20"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                required
                                className="h-14 px-6 rounded-full border border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-400 outline-none focus:border-red-400/70 focus:ring-2 focus:ring-red-500/20"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="h-14 px-6 rounded-full border border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-400 outline-none focus:border-red-400/70 focus:ring-2 focus:ring-red-500/20"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                type="submit"
                                className="h-14 w-full rounded-full bg-red-500 text-white font-semibold shadow-[0_0_18px_rgba(239,68,68,0.35)] hover:bg-red-600 transition-all"
                            >
                                Sign Up
                            </button>

                            {message && (
                                <p className="text-sm text-zinc-300">{message}</p>
                            )}
                        </form>
                    </div>

                    <div className="m-8 flex gap-4 justify-center">
                        <Link
                            className="flex h-12 items-center justify-center rounded-full bg-zinc-100 text-black px-5 hover:bg-white transition-colors"
                            href="/login"
                        >
                            Log In
                        </Link>

                        <Link
                            className="flex h-12 items-center justify-center rounded-full border border-zinc-700 px-5 text-zinc-200 hover:bg-zinc-900 transition-colors"
                            href="/password"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                </main>
            </div>
        </>
    );
}