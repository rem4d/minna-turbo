import { EdgeTTSClient, ProsodyOptions, OUTPUT_FORMAT } from "edge-tts-client";
// import "./content-styles.css";

let audioElement: HTMLAudioElement | null = null;
// let isPlaying = false;

export async function initTTS(text: string) {
  cleanup();
  try {
    const settings = {
      voiceName: "ja-JP-NanamiNeural",
      customVoice: "",
      speed: 0.9,
    };

    const tts = new EdgeTTSClient();
    await tts.setMetadata(
      settings.customVoice || settings.voiceName, // Use custom voice if specified
      OUTPUT_FORMAT.WEBM_24KHZ_16BIT_MONO_OPUS,
      // OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
    );

    const prosodyOptions = new ProsodyOptions();
    prosodyOptions.rate = settings.speed;

    return new Promise((resolve, reject) => {
      console.log("Promise.");
      const mediaSource = new MediaSource();
      console.log("MediaSource instance created!");
      let sourceBuffer: SourceBuffer;
      const chunks: Uint8Array[] = [];
      let isFirstChunk = true;

      if (!audioElement) {
        audioElement = new Audio();
        console.log(audioElement);

        audioElement.src = URL.createObjectURL(mediaSource);

        audioElement.onplay = () => {
          // isPlaying = true;
          updatePlayPauseButton();
        };

        audioElement.onpause = () => {
          // isPlaying = false;
          updatePlayPauseButton();
        };

        audioElement.onended = () => {
          // isPlaying = false;
          updatePlayPauseButton();
        };
      }

      const appendNextChunk = () => {
        if (chunks.length > 0 && !sourceBuffer.updating) {
          console.log("appendNextChunk: has chunks");
          try {
            const chunk = chunks.shift();
            if (chunk) {
              sourceBuffer.appendBuffer(chunk);
              if (isFirstChunk) {
                audioElement?.play().catch(console.error);
                isFirstChunk = false;
              }
            }
          } catch (_e) {
            console.log(_e);
            // if (e.name === "QuotaExceededError") {
            //   setTimeout(appendNextChunk, 1000);
            // } else {
            //   reject(e);
            // }
          }
        }
      };

      mediaSource.addEventListener("sourceopen", () => {
        console.log("sourceopen!");
        try {
          console.log("creating sourceBuffer instance...");
          sourceBuffer = mediaSource.addSourceBuffer(
            'audio/webm; codecs="opus"',
          );
          console.log("sourceBuffer instance created!");
          sourceBuffer.addEventListener("updateend", appendNextChunk);

          const stream = tts.toStream(text, prosodyOptions);

          stream.on("data", (data) => {
            console.log("got data from stream");
            if (data instanceof Uint8Array && data.length > 0) {
              chunks.push(data);
              appendNextChunk();
            }
          });

          stream.on("end", () => {
            console.log("end stream");

            const checkAndEndStream = () => {
              if (chunks.length === 0 && !sourceBuffer.updating) {
                mediaSource.endOfStream();
                resolve(void 0);
              } else {
                setTimeout(checkAndEndStream, 100);
              }
            };

            checkAndEndStream();
          });

          // stream.on("error", (err) => {
          //   reject(err);
          // });
        } catch (error) {
          console.log();
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("TTS Error:", error);
    cleanup();
    throw error;
  }
}

function updatePlayPauseButton() {}

function cleanup() {
  if (audioElement) {
    console.log("clean old audioElement");
    const oldSrc = audioElement.src;
    audioElement.src = "";
    URL.revokeObjectURL(oldSrc);
  }
  audioElement = null;
  // isPlaying = false;
}
