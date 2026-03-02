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
import fetchTTSQueryFn from "@/fetch/fetchTTS";
import { useQueryClient } from "@tanstack/react-query";

interface PlaySoundContextValue {
  isLoading: boolean;
  isPlaying: boolean;
  play: (text: string, id: string) => void;
  isCurrent: (id: string) => boolean;
  clear(): void;
}

export const PlaySoundContext = createContext<PlaySoundContextValue>({
  isLoading: false,
  isPlaying: false,
  play: () => {},
  isCurrent: (_id: string) => false,
  clear: () => {},
});

interface ReducerState {
  id: string;
  text: string;
  isPlaying: boolean;
  isLoading: boolean;
}

type Actions =
  | {
      type: "load";
      id: string;
      text: string;
    }
  | {
      type: "stop";
    }
  | {
      type: "play";
    }
  | {
      type: "done";
    };

const reducer = (state: ReducerState, action: Actions): ReducerState => {
  switch (action.type) {
    case "load":
      return {
        ...state,
        id: action.id,
        text: action.text,
        isLoading: true,
      };
    case "stop":
      return { ...state, isLoading: false, isPlaying: false };
    case "play":
      return { ...state, isLoading: false, isPlaying: true };
    case "done":
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export const PlaySoundContextProvider = ({ children }: PropsWithChildren) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const storedBlobs = useRef<Set<string>>(new Set());

  const [reducerState, dispatch] = useReducer(reducer, {
    id: "",
    isPlaying: false,
    isLoading: false,
  } as ReducerState);

  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = () => {
      dispatch({ type: "stop" });
    };
    const ref = audioRef.current;

    ref?.addEventListener("ended", handler);

    return () => {
      ref?.removeEventListener("ended", handler);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && blobUrl) {
      void audioRef.current.play();
      dispatch({ type: "done" });
      dispatch({ type: "play" });
    }
  }, [blobUrl]);

  const clear = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
    }

    for (const b of storedBlobs.current) {
      URL.revokeObjectURL(b);
    }

    storedBlobs.current.clear();
    setBlobUrl(null);

    void queryClient.invalidateQueries({ queryKey: ["tts-"] });
  }, [queryClient]);

  useEffect(() => {
    if (storedBlobs.current && blobUrl) {
      storedBlobs.current.add(blobUrl);
    }
  }, [blobUrl]);

  const onPlayClick = useCallback(
    (text: string, id: string) => {
      const abort = () => {
        void queryClient.cancelQueries({ queryKey: ["tts-", text] });
      };

      const pause = () => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;

          void audioRef.current.pause();
        }
      };

      if (id === reducerState.id) {
        if (reducerState.isLoading) {
          abort();
          dispatch({ type: "stop" });
          return;
        }

        if (reducerState.isPlaying) {
          pause();
          dispatch({ type: "stop" });
        } else {
          void audioRef.current?.play();
          dispatch({ type: "play" });
        }
        return;
      }

      // cannot use built-in refetch
      // as it doesn't correspond staleTime
      const refetch = async () => {
        const data = await queryClient.fetchQuery({
          queryKey: ["tts-", text],
          queryFn: () => fetchTTSQueryFn(text),
          staleTime: Infinity,
        });
        setBlobUrl(data ?? null);
      };
      void refetch();

      dispatch({ type: "load", text, id });
    },
    [
      queryClient,
      reducerState.id,
      reducerState.isPlaying,
      reducerState.isLoading,
    ],
  );

  const isCurrent = useCallback(
    (id: string) => {
      return reducerState.id === id;
    },
    [reducerState.id],
  );

  const contextValue = {
    play: onPlayClick,
    isPlaying: reducerState.isPlaying,
    isLoading: reducerState.isLoading,
    isCurrent,
    clear,
  };

  const audioProps = blobUrl ? { src: blobUrl } : {};

  return (
    <PlaySoundContext.Provider value={contextValue}>
      {children}
      <audio
        className="hidden"
        ref={audioRef}
        controls
        preload="none"
        crossOrigin="anonymous"
        {...audioProps}
      />
    </PlaySoundContext.Provider>
  );
};

export const usePlaySoundContext = () => useContext(PlaySoundContext);
