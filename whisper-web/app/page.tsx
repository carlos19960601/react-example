"use client";

import AudioManager from "@/components/AudioManager";
import { useTranscriber } from "@/hooks/useTranscriber";
import Link from "next/link";

export default function Home() {
  const transcriber = useTranscriber();
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="container flex flex-col justify-center items-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl text-center">
          Whisper Web
        </h1>
        <h2 className="mt-3 mb-5 px-4 text-center text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          ML-powered speech recognition directly in your browser
        </h2>
        <AudioManager transcriber={transcriber} />
      </div>
      <div className="absolute bottom-4">
        Made with{" "}
        <Link
          href="https://github.com/xenova/transformers.js"
          className="underline"
        >
          🤗 Transformers.js
        </Link>
      </div>
    </div>
  );
}
