import { useRef, useState, useEffect } from 'react';

export default function Home() {
  const videoRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);

  const playlist = [
    { 
      title: 'OIIA OIIA', 
      src: 'W&W - OIIA OIIA (Spinning Cat).mp4',
      thumbnail: 'maxresdefault.jpg' 
    },
    { 
      title: 'Trolagens do Steve', 
      src: 'Steve Bullying people for 1 Minute 33 seconds straight..mp4',
      thumbnail: 'maxresdefault (2).jpg' 
    },
    { 
      title: 'Vídeo 3', 
      src: 'MADAGASCAR KSKSKSKS A DreamWorks tava poucas ideias quando fez esses filmes - MELHORES MOMENTOS.mp4',
      thumbnail: 'maxresdefault (3).jpg' 
    }
  ];

  const currentVideo = playlist[currentVideoIndex];

  useEffect(() => {
    playlist.forEach(video => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = video.src;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    setIsLoading(true);
    
    const handleCanPlay = () => {
      setIsLoading(false);
      if (isPlaying) video.play();
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setVideoProgress((video.currentTime / video.duration) * 100);
    };
    
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
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    video.load();
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
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
    setIsLoading(true);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(1);
      }
    }
  };

  const handleSliderChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
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
        
        <div className="video-container">
          {isLoading && (
            <div className="video-loader">
              <div className="spinner"></div>
              <p>Carregando vídeo...</p>
            </div>
          )}
          <video
            ref={videoRef}
            src={currentVideo.src}
            poster={currentVideo.thumbnail}
            controls={false}
            autoPlay={isPlaying}
            onClick={togglePlayPause}
            preload="auto"
          />
          
          <div className="progress-visual" style={{ width: `${videoProgress}%` }}></div>
          
          <div className="controls-overlay">
            <button className="play-btn" onClick={togglePlayPause}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          </div>
        </div>
        
        <div className="controls">
          <div className="time-controls">
            <button onClick={() => handleSeek(-10)}>⏪ -10s</button>
            <button onClick={togglePlayPause} className="play-pause-btn">
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
            <button onClick={toggleMute} className="mute-btn">
              {muted ? '🔇 Mutado' : volume > 0.5 ? '🔊' : volume > 0 ? '🔈' : '🔇'}
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
      
      <div className="playlist">
        <h3>Escolha um vídeo:</h3>
        <div className="video-list">
          {playlist.map((video, index) => (
            <div 
              key={index} 
              className={`video-item ${currentVideoIndex === index ? 'active' : ''}`}
              onClick={() => handleVideoSelect(index)}
            >
              <img src={video.thumbnail} alt={video.title} className="video-thumb" />
              <span>{video.title}</span>
              {currentVideoIndex === index && isPlaying && (
                <div className="playing-indicator">▶️ Reproduzindo</div>
              )}
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