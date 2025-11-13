interface InputGloss {
  start: number;
  end: number;
  code: string | null;
}

interface Props {
  text: string;
  glosses?: InputGloss[];
  onGlossClick: (code: string) => void;
}

export const GlossedText = ({ text, glosses = [], onGlossClick }: Props) => {
  const spans = makeSpans(text, glosses, onGlossClick);

  return <div>{spans}</div>;
};

type Code = string;

interface Gloss {
  char: string;
  code: Code;
  start: number;
  end: number;
}

const makeSpans = (
  text: string,
  glosses: InputGloss[],
  onGlossClick: (code: string) => void,
) => {
  const arr: Gloss[] = [];

  for (const gloss of glosses) {
    // console.log(`Processing gloss: ${gloss.code}`);
    for (let i = gloss.start; i < gloss.end; i++) {
      if (!arr[i]) {
        arr[i] = {
          char: text[i],
          code: gloss.code!,
          start: gloss.start,
          end: gloss.end,
        };
      }
    }
  }
  const map = new Map<string, { start: number; end: number }>();

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      const k = `${arr[i].start}.${arr[i].end}`;
      if (map.has(k)) {
        map.set(k, {
          start: map.get(k)!.start,
          end: i + 1,
        });
      } else {
        map.set(k, { start: i, end: i + 1 });
      }
    }
  }

  const result: React.ReactNode[] = [];

  for (let i = 0; i < text.length; i++) {
    if (!arr[i]) {
      result.push(text[i]);
    } else {
      const node = arr[i];
      if (!node) {
        throw new Error("Node not found");
      }
      const k = `${node.start}.${node.end}`;
      const recNode = map.get(k);

      if (!recNode) {
        console.log("No recNode");
        throw new Error("No recNode");
      }

      i = recNode.end - 1;

      result.push(
        <span
          key={`${node.start}-${node.end}`}
          className="mx-2 cursor-pointer border-b border-dashed border-black"
          onClick={() => onGlossClick?.(node.code)}
        >
          {text.slice(recNode?.start, recNode?.end)}
        </span>,
      );
    }
  }

  return result;
};
