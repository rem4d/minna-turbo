export default async function fetchTTS(text: string) {
  const url = `${import.meta.env.VITE_API_SERVER}tts/ms-tts?text=${text}`;
  const response = await fetch(url);

  try {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const blob = await response.blob();

    const newBlob = URL.createObjectURL(blob);

    return newBlob;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Request failed: ", error.message);
    } else {
      console.error("Caught an unknown error type:", error);
      throw error;
    }
  }
}
