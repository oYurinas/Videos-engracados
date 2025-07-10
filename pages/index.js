// pages/index.js

import { useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <Head>
        <title>Love Love - Gilsons</title>
      </Head>

      <div className="player-card">
        <img src="/capa-album.jpeg" alt="Capa da música" className="cover" />

        <h2>Love Love</h2>
        <p>Gilsons</p>

        <div className="progress-bar">
          <span>0:00</span>
          <div className="bar"></div>
          <span>3:25</span>
        </div>

        <div className="controls">
          {/* Botão de voltar */}
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" 
                 width="24" height="24" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" strokeWidth="2" 
                 strokeLinecap="round" strokeLinejoin="round" 
                 className="lucide lucide-undo2-icon lucide-undo-2">
              <path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>
            </svg>
          </button>

          {/* Botão Play/Pause */}
          <button className="play" onClick={handlePlayPause}>
            {isPlaying ? (
              // SVG de PAUSE
              <svg xmlns="http://www.w3.org/2000/svg" 
                   width="24" height="24" viewBox="0 0 24 24" 
                   fill="none" stroke="currentColor" strokeWidth="2" 
                   strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              // SVG de PLAY
              <svg xmlns="http://www.w3.org/2000/svg" 
                   width="24" height="24" viewBox="0 0 24 24" 
                   fill="none" stroke="currentColor" strokeWidth="2" 
                   strokeLinecap="round" strokeLinejoin="round" 
                   className="lucide lucide-play-icon lucide-play">
                <polygon points="6 3 20 12 6 21 6 3"/>
              </svg>
            )}
          </button>

          {/* Botão de avançar */}
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" 
                 width="24" height="24" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" strokeWidth="2" 
                 strokeLinecap="round" strokeLinejoin="round" 
                 className="lucide lucide-redo2-icon lucide-redo-2">
              <path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/>
            </svg>
          </button>

          {/* Botão de volume */}
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" 
                 width="24" height="24" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" strokeWidth="2" 
                 strokeLinecap="round" strokeLinejoin="round" 
                 className="lucide lucide-volume2-icon lucide-volume-2">
              <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
              <path d="M16 9a5 5 0 0 1 0 6"/>
              <path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>
            </svg>
          </button>
        </div>

        <audio ref={audioRef} src="/Love Love.mp3"></audio>
      </div>
    </>
  );
}
