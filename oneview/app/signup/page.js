"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

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
            <Navbar />
            <div className="flex min-h-screen items-center justify-center bg-red-200 font-sans">
                <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white">

                    <div className="flex w-full flex-col items-center py-10 px-10 bg-white">
                        <img
                            className="rounded-lg p-2"
                            src="/Critiq.svg"
                            alt="critiq logo"
                            width={100}
                            height={30}
                        />
                    </div>

                    <div className="flex flex-col items-center gap-6 text-center">
                        <h1 className="text-5xl font-semibold text-black">
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
                                className="h-14 px-6 rounded-full border border-zinc-300"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                required
                                className="h-14 px-6 rounded-full border border-zinc-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="h-14 px-6 rounded-full border border-zinc-300"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                type="submit"
                                className="h-14 w-full rounded-full bg-red-500 text-white hover:bg-red-600"
                            >
                                Sign Up
                            </button>

                            {message && (
                                <p className="text-sm text-black">{message}</p>
                            )}
                        </form>
                    </div>

                    <div className="m-8 flex gap-4 justify-center">
                        <Link
                            className="flex h-12 items-center justify-center rounded-full bg-black text-white px-5 hover:bg-gray-800"
                            href="/login"
                        >
                            Log In
                        </Link>

                        <Link
                            className="flex h-12 items-center justify-center rounded-full border px-5 hover:bg-gray-100"
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