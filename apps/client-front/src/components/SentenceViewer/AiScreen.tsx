import Markdown from "react-markdown";

interface AiScreenProps {
  loading: boolean;
  text?: string;
}

export default function AiScreen({
  loading = false,
  text = "",
}: AiScreenProps) {
  return (
    <div className="no-scroll max-h-[60vh] min-h-[40vh] w-full overflow-y-scroll py-2">
      <div className="relative flex flex-col space-y-4">
        {loading && <div>Loading...</div>}
        <Markdown>{text}</Markdown>
      </div>
    </div>
  );
}
