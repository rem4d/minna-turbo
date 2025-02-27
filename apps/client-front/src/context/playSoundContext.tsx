import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useTtsMutation } from "@/rq/useTtsMutation";
import hapticFeedback from "@/utils/hapticFeedback";

interface PlaySoundContextValue {
  ttsLoading: boolean;
  isPlaying: boolean;
  text: string | null;
  onPlayClick: (text: string) => void;
}

const PlaySoundContext = createContext<PlaySoundContextValue>({
  ttsLoading: false,
  isPlaying: false,
  text: "",
  onPlayClick: () => {},
});

export const PlaySoundContextProvider = ({ children }: PropsWithChildren) => {
  const [blobSrc, setBlobSrc] = useState<string | undefined>(undefined);
  const [text, setText] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const { mutateAsync: ttsMutate, isPending: ttsLoading } = useTtsMutation({});

  useEffect(() => {
    if (isPlaying === false && audioRef.current) {
      void audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  useEffect(() => {
    setIsPlaying(false);
    setBlobSrc(undefined);
  }, [text]);

  useEffect(() => {
    if (blobSrc) {
      if (audioRef.current) {
        try {
          setIsPlaying(true);
          void audioRef.current.play();
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [blobSrc]);

  useEffect(() => {
    if (!audioRef.current) {
      console.log("Error: no audioRef found.");
      return;
    }
    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
    });
  }, []);

  const onPlayClick = async (t: string) => {
    if (isPlaying || ttsLoading) {
      setIsPlaying(false);

      if (t === text) {
        return;
      }
    } else {
      setIsPlaying(true);
    }

    hapticFeedback("light");

    setText(t);

    if (t !== text) {
      const blob = await ttsMutate({ text: t });
      const objectURL = URL.createObjectURL(blob);

      setBlobSrc(objectURL);
    } else {
      if (audioRef.current) {
        try {
          void audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  return (
    <PlaySoundContext.Provider
      value={{ onPlayClick, isPlaying, ttsLoading, text }}
    >
      {children}
      <audio
        className="hidden"
        ref={audioRef}
        controls
        preload="none"
        src={blobSrc}
      />
    </PlaySoundContext.Provider>
  );
};

export const usePlaySoundConext = () => useContext(PlaySoundContext);
