let audioElement: HTMLAudioElement | null = null;

export async function initVoicevox(text: string) {
  cleanup();
  try {
    const response = await fetch(
      "http://localhost:1222/api/voicevox?text=" + text,
    );
    if (!response.ok) {
      throw new Error(await response.text());
    }

    const mediaSource = new MediaSource();
    let sourceBuffer: SourceBuffer;
    const chunks: Uint8Array[] = [];
    let isFirstChunk = true;

    if (!audioElement) {
      audioElement = new Audio();
      console.log(audioElement);
      audioElement.src = URL.createObjectURL(mediaSource);
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
    mediaSource.addEventListener("sourceopen", async () => {
      console.log("sourceopen!");
      console.log("creating sourceBuffer instance...");

      sourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs="opus"');
      // audio/webm; codecs="opus"
      console.log("sourceBuffer instance created!");
      sourceBuffer.addEventListener("updateend", appendNextChunk);

      if (response.body) {
        const reader = response.body.getReader();
        let done = false;

        while (!done) {
          const readerData = await reader.read();
          if (readerData.done) {
            done = true;

            if (!sourceBuffer.updating) {
              mediaSource.endOfStream();
            }
          } else {
            if (
              readerData.value instanceof Uint8Array &&
              readerData.value.length > 0
            ) {
              chunks.push(readerData.value);
              appendNextChunk();
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("TTS Error:", error);
    cleanup();
    throw error;
  }
}

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
