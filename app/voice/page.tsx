"use client";

import MicrophoneIcon from "../assets/icons/MicrophoneIcon";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VoiceSearch() {
  const router = useRouter();

  const [text, setText] = useState("Speak now");
  const [micColor, setMicColor] = useState("#9aa0a6");

  useEffect(() => {
    // Change to "Waiting..." after 500ms
    const waitingTimer = setTimeout(() => {
      setText("Waiting...");
    }, 500);

    // Change to "No internet connection" after another 500ms (total of 1000ms)
    const noInternetTimer = setTimeout(() => {
      setText("No Internet connection");
    }, 1000);

    const micWaitingTimer = setTimeout(() => {
      setMicColor("#ff4444");
    }, 500);

    const micNoInternetTimer = setTimeout(() => {
      setMicColor("#9aa0a6");
    }, 1000);

    return () => {
      clearTimeout(waitingTimer);
      clearTimeout(noInternetTimer);
      clearTimeout(micWaitingTimer);
      clearTimeout(micNoInternetTimer);
    };
  }, []);

  //   redirect the user back to home page after 3 seconds
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <div className="relative">
      <div className="h-5 bg-blue-500 blur-xl border-t border-blue-500"></div>
      <div className="relative z-10 flex flex-col justify-center h-screen max-h-[600px]">
        <div className="flex gap-32 mx-32 justify-between items-center">
          <span className="text-[#9aa0a6] text-3xl font-normal">{text}</span>
          <motion.div
            className="relative w-20 aspect-square flex flex-col items-center justify-center bg-[#f8f9fa] rounded-full"
            initial={{ scale: 1 }}
            animate={{ scale: 1.7 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ transformOrigin: "center" }}
          >
            <div className="">
              <MicrophoneIcon className="w-[60%] m-auto" fill={micColor} />
            </div>

            {/* Overlay gradient */}
            <motion.div
              initial={{ opacity: 0.5 }} // Start with 50% opacity
              animate={{ opacity: 0 }} // Fade out the overlay after animation
              transition={{ duration: 0.5, delay: 0.5 }} // Delay to match the scaling animation
              className="absolute inset-0 bg-black rounded-full"
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
