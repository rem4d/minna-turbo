import type { PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useTtsMutation } from "@/rq/useTtsMutation";
import { hapticFeedback } from "@/utils/tgUtils";

interface PlaySoundContextValue {
  isLoading: boolean;
  isPlaying: boolean;
  text: string;
  currentIndex: number | undefined;
  onLoad: (text: string, index?: number) => void;
  onPlayLatest: () => void;
  onStop: () => void;
}

const PlaySoundContext = createContext<PlaySoundContextValue>({
  isLoading: false,
  isPlaying: false,
  text: "",
  currentIndex: undefined,
  onLoad: () => {},
  onPlayLatest: () => {},
  onStop: () => {},
});

interface ReducerState {
  currentText: string;
  isPlaying: boolean;
}

type Actions =
  | {
      type: "loadSound";
      text: string;
    }
  | {
      type: "stop";
    }
  | {
      type: "play";
    };

const reducer = (state: ReducerState, action: Actions): ReducerState => {
  switch (action.type) {
    case "loadSound":
      return { ...state, currentText: action.text };
    case "stop":
      return { ...state, isPlaying: false };
    case "play":
      return { ...state, isPlaying: true };
    default:
      return state;
  }
};

export const PlaySoundContextProvider = ({ children }: PropsWithChildren) => {
  const [blobSrc, setBlobSrc] = useState<string | undefined>(undefined);
  const [text, setText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(
    undefined,
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  const [reducerState, dispatch] = useReducer(reducer, {
    currentText: "",
    isPlaying: false,
  } as ReducerState);
  const { isPlaying } = reducerState;

  const { mutateAsync: ttsMutate, isPending: ttsLoading } = useTtsMutation({});

  useEffect(() => {
    if (isPlaying === false && audioRef.current) {
      void audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  useEffect(() => {
    dispatch({ type: "stop" });
    setBlobSrc(undefined);
  }, [text]);

  useEffect(() => {
    if (blobSrc && audioRef.current) {
      try {
        dispatch({ type: "play" });
        void audioRef.current.play();
      } catch (err) {
        console.log(err);
      }
    }
  }, [blobSrc]);

  useEffect(() => {
    if (!audioRef.current) {
      console.log("Error: no audioRef found.");
      return;
    }
    audioRef.current.addEventListener("ended", () => {
      dispatch({ type: "stop" });
    });
  }, []);

  useEffect(() => {
    const callMutation = async (t: string) => {
      const blob = await ttsMutate({ text: t });
      const objectURL = URL.createObjectURL(blob);

      setBlobSrc(objectURL);
    };

    if (audioRef.current) {
      void audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    hapticFeedback("light");

    if (reducerState.currentText !== text) {
      setText(reducerState.currentText);
      void callMutation(reducerState.currentText);
    }
  }, [reducerState.currentText, text, ttsMutate]);

  const onLoad = useCallback((t: string, index?: number) => {
    dispatch({ type: "loadSound", text: t });
    setCurrentIndex(index);
  }, []);

  const onStop = useCallback(() => {
    dispatch({ type: "stop" });
  }, []);

  const onPlayLatest = useCallback(() => {
    if (audioRef.current) {
      try {
        void audioRef.current.play();
        dispatch({ type: "play" });
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  const contextValue = {
    onLoad,
    onPlayLatest,
    onStop,
    currentIndex,
    isPlaying: reducerState.isPlaying,
    isLoading: ttsLoading,
    text: reducerState.currentText,
  };

  return (
    <PlaySoundContext.Provider
      value={contextValue}
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

export const usePlaySoundContext = () => useContext(PlaySoundContext);
