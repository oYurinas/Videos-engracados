import { useRef, useState, useEffect } from 'react';

export default function Home() {
  const videoRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Lista de vídeos disponíveis (arquivos na pasta public)
  const playlist = [
    { 
      title: 'OIIA OIIA', 
      src: 'W&W - OIIA OIIA (Spinning Cat).mp4',
      thumbnail: 'maxresdefault.jpg' 
    },
    { 
      title: 'Trolagens do Steve', 
      src: 'Steve Bullying people for 1 Minute 33 seconds straight.mp4',
      thumbnail: 'maxresdefault (2).jpg' 
    },
    { 
      title: 'Madagascar', 
      src: '/MADAGASCAR KSKSKSKS A DreamWorks tava poucas ideias quando fez esses filmes - MELHORES MOMENTOS🤣.mp4',
      thumbnail: 'maxresdefault (3).jpg' 
    }
  ];

  const currentVideo = playlist[currentVideoIndex];

  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      video.volume = volume;
      video.muted = muted;
    };
    
    const handleEnded = () => {
      if (currentVideoIndex < playlist.length - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1);
      } else {
        setCurrentVideoIndex(0);
      }
      setIsPlaying(true);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [currentVideoIndex, volume, muted]);

  const handleSeek = (seconds) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime += seconds;
      setCurrentTime(video.currentTime);
    }
  };

  const handleVideoSelect = (index) => {
    setCurrentVideoIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
    videoRef.current.volume = newVolume;
    videoRef.current.muted = newVolume === 0;
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    videoRef.current.muted = newMuted;
    if (newMuted) {
      setVolume(0);
    } else {
      setVolume(1);
    }
  };

  const handleSliderChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="container">
      <div className="player-card">
        <h1>{currentVideo.title}</h1>
        
        {/* Elemento de vídeo */}
        <div className="video-container">
          <video
            ref={videoRef}
            src={currentVideo.src}
            poster={currentVideo.thumbnail}
            controls={false}
            autoPlay={isPlaying}
            onClick={togglePlayPause}
          />
          
          {/* Overlay de controles */}
          <div className="controls-overlay">
            <button className="play-btn" onClick={togglePlayPause}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          </div>
        </div>
        
        {/* Controles personalizados */}
        <div className="controls">
          <div className="time-controls">
            <button onClick={() => handleSeek(-10)}>⏪ -10s</button>
            <button onClick={togglePlayPause}>
              {isPlaying ? '⏸️ Pausar' : '▶️ Reproduzir'}
            </button>
            <button onClick={() => handleSeek(10)}>+10s ⏩</button>
          </div>
          
          <div className="progress-bar">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSliderChange}
              className="progress-slider"
            />
            <span>{formatTime(duration)}</span>
          </div>
          
          <div className="volume-controls">
            <button onClick={toggleMute}>
              {muted ? '🔇 Mutado' : volume > 0.5 ? '🔊 Alto' : '🔈 Baixo'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
      
      {/* Lista de vídeos */}
      <div className="playlist">
        <h3>Escolha um vídeo:</h3>
        <div className="video-list">
          {playlist.map((video, index) => (
            <div 
              key={index} 
              className={`video-item ${currentVideoIndex === index ? 'active' : ''}`}
              onClick={() => handleVideoSelect(index)}
            >
              <img src={video.thumbnail} alt={video.title} />
              <span>{video.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}