import { ReactElement, useEffect, useRef, useState } from 'react';

type SoundReturnType = {
  isSoundPlaying: boolean;
  togglePlayingSound: () => void;
  sound: ReactElement;
};

type UseSoundType = {
  src: string;
};

export default function useSound({ src }: UseSoundType): SoundReturnType {
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(() => {
    const storedIsSoundPlaying = localStorage.getItem('isSoundPlaying');
    return storedIsSoundPlaying ? JSON.parse(storedIsSoundPlaying) : true;
  });

  const soundRef = useRef<HTMLAudioElement>(null);
  const isBgm = src.includes('bgm');

  useEffect(() => {
    const soundElement = soundRef.current;

    if (soundElement) {
      // Todo: 음량 조절 기능 추가 예정
      soundElement.volume = 0.2;
    }
  }, [soundRef]);

  useEffect(() => {
    localStorage.setItem('isSoundPlaying', JSON.stringify(isSoundPlaying));
  }, [isSoundPlaying]);

  const togglePlayingSound = () => {
    setIsSoundPlaying((prev) => !prev);
  };

  const sound = (
    <audio
      ref={soundRef}
      src={src}
      autoPlay={true}
      loop={isBgm}
      muted={!isSoundPlaying}
    />
  );

  return { isSoundPlaying, togglePlayingSound, sound };
}
