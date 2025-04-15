"use client";

import React, { useRef, useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

interface DemoVideoProps {
    videoSrc: string;
    posterSrc: string;
}

export default function DemoVideo({ videoSrc, posterSrc }: DemoVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showCustomControls, setShowCustomControls] = useState(true);

    const togglePlay = async () => { 
        const video = videoRef.current;
        if (!video) {
            console.error("Video element ref not found.");
            return;
        }

        console.log("Toggle Play Called. Current state - Paused:", video.paused, "Ended:", video.ended);

        if (video.paused || video.ended) {
            try {
                await video.play(); 
                console.log("Video playback initiated.");
               
            } catch (error) {
                console.error("Error attempting to play video:", error);
            }
        } else {
            video.pause();
            console.log("Video playback paused.");
            // State updates moved to event listeners
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = () => {
            const video = videoRef.current; 
            console.log("Video event: Play");
            if (video) {
                console.log(
                    `Video state: currentTime=${video.currentTime}, duration=${video.duration}, readyState=${video.readyState}, networkState=${video.networkState}`
                );
            } else {
                console.log("Video ref not available in handlePlay");
            }
            setIsPlaying(true);
            setShowCustomControls(false);
        };

        const handlePause = () => {
            console.log("Video event: Pause");
            setIsPlaying(false);
        };

        const handleEnded = () => {
            console.log("Video event: Ended");
            setIsPlaying(false);
            setShowCustomControls(true); 
        };

        // Add event listeners
        video.addEventListener('play', handlePlay);
        video.addEventListener('playing', handlePlay); 
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handleEnded);

        // Cleanup function to remove listeners when component unmounts
        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('playing', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('ended', handleEnded);
        };
    }, []);


    return (
        <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            {/* Agroup class for styling */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gray-800 group">
                <video
                    ref={videoRef}
                    className="w-full aspect-video block"
                    controls 
                    playsInline 
                    poster={posterSrc}
                    preload="metadata"
                    // muted 
                    crossOrigin="anonymous"
                >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                    {/* Provide fallback text or links if needed */}
                    <p>Video playback is not supported by your browser. You can <a href={videoSrc} download>download the video</a> instead.</p>
                </video>

                {/* Custom Play button overlay */}
                {showCustomControls && (
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-30 transition-all cursor-pointer z-10" // Ensure overlay is on top initially
                        onClick={togglePlay}
                    >
                        <motion.button
                            aria-label={isPlaying ? "Pause Video" : "Play Video"}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                            className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        >
                            {/* Show Play or Pause icon based on state */}
                            {isPlaying ? (
                                <Pause className="h-7 w-7 md:h-8 md:w-8 text-purple-700" />
                            ) : (
                                <Play className="h-7 w-7 md:h-8 md:w-8 text-purple-700 ml-1" />
                            )}
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}