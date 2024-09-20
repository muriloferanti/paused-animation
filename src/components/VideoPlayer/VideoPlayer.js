import React, { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { IconButton, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ChairIcon from '@mui/icons-material/Chair';
import axios from 'axios';
import './VideoPlayer.css';

const VideoPlayer = ({ paid, setPaid, handlePayment }) => {
  const playerRef = useRef(null);
  const PAUSE_TIME = 22; // Tempo em segundos para pausar o vídeo preview
  const START_TIME_AFTER_PAYMENT = 22; // Tempo em segundos para começar o vídeo após o pagamento
  const [playing, setPlaying] = useState(false); // Começa pausado
  const [muted, setMuted] = useState(true); // Começa mutado para permitir autoplay
  const [videoUrl, setVideoUrl] = useState('/videos/meu-video-preview.mp4'); // URL do vídeo preview
  const [shouldSeekAfterLoad, setShouldSeekAfterLoad] = useState(false); // Flag para indicar que devemos buscar após carregar
  const [showPlayButton, setShowPlayButton] = useState(true); // Exibir botão de play no início
  const [showBuyButton, setShowBuyButton] = useState(false); // Exibir botão de compra quando o vídeo pausa

  useEffect(() => {
    if (paid) {
      const token = localStorage.getItem('token');

      if (token) {
        const headers = {
          Authorization: token,
        };

        axios
          .get('http://localhost:3001/secure_videos/meu-video.mp4', {
            headers,
            responseType: 'blob',
          })
          .then((response) => {
            const videoBlob = new Blob([response.data], { type: 'video/mp4' });
            const url = URL.createObjectURL(videoBlob);
            setVideoUrl(url);
            setPlaying(true); // Começa a reproduzir após o pagamento
            setMuted(false); // Desmutar o vídeo
            setShouldSeekAfterLoad(true); // Indicar que devemos buscar após carregar
          })
          .catch((error) => {
            console.error('Erro ao acessar o vídeo seguro:', error);
            setPaid(false);
          });
      } else {
        setPaid(false);
      }
    }
  }, [paid, setPaid]);

  useEffect(() => {
    if (paid) {
      setShowBuyButton(false); // Oculta o botão de compra após o pagamento
    }
  }, [paid]);

  const handlePlayPause = () => {
    setPlaying(!playing);
    if (!playing) {
      setShowPlayButton(false); // Esconde o botão de play quando reproduzindo
      setMuted(false); // Desmutar quando o usuário clicar em play
    }
  };

  const handlePlayerReady = () => {
    if (shouldSeekAfterLoad && playerRef.current) {
      playerRef.current.seekTo(START_TIME_AFTER_PAYMENT);
      setShouldSeekAfterLoad(false);
    }
  };

  const handleVideoEnded = () => {
    setPlaying(false);
    setShowPlayButton(true);
  };

  const handleProgress = (progress) => {
    if (!paid && progress.playedSeconds >= PAUSE_TIME) {
      playerRef.current.seekTo(PAUSE_TIME);
      setPlaying(false);
      setShowPlayButton(false);
      setShowBuyButton(true); // Mostrar botão de compra
    }
  };

  return (
    <div className="video-player-container">
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        playing={playing}
        muted={muted}
        controls={false}
        width="100%"
        height="100%"
        onReady={handlePlayerReady}
        onEnded={handleVideoEnded}
        onProgress={handleProgress}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
              disablePictureInPicture: true,
            },
          },
        }}
      />
      {showPlayButton && (
        <div className="overlay">
          <IconButton onClick={handlePlayPause} className="play-button">
            <PlayArrowIcon fontSize="large" />
          </IconButton>
        </div>
      )}
      {showBuyButton && !paid && (
        <div className="overlay">
          <Button
            variant="contained"
            color="primary"
            startIcon={<ChairIcon />}
            onClick={handlePayment}
            className="buy-button"
          >
            Comprar para continuar
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
