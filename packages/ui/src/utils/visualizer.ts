export interface PositionedItem {
  start: number;
  end: number;
  code: string;
  hidden?: boolean;
}

export const structureText = (text: string, sourceArray: PositionedItem[]) => {
  const arr: PositionedItem[] = [];

  for (const item of sourceArray) {
    if (!item.code) {
      throw new Error("Arr item code is null");
    }

    for (let i = item.start; i < item.end; i++) {
      if (!arr[i]) {
        arr[i] = {
          code: item.code,
          start: item.start,
          end: item.end,
          hidden: item.hidden,
        };
      }
    }
  }

  const map = new Map<string, { start: number; end: number }>();

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      const k = `${arr[i]?.start}.${arr[i]?.end}`;
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

  const result: { text: string; p: PositionedItem | null }[] = [];
  // console.log("arr:", arr);
  // console.log(map);

  for (let i = 0; i < text.length; i++) {
    if (!arr[i]) {
      if (text[i] === "\n") {
        result.push({ text: "\n", p: null });
      } else {
        result.push({ text: text[i] ?? "", p: null });
      }
    } else {
      const node = arr[i];

      // console.log(i, ": ", node);
      if (!node) {
        throw new Error("Node not found");
      }
      const k = `${node.start}.${node.end}`;
      const recNode = map.get(k);

      if (!recNode) {
        console.log("No recNode");
        throw new Error("No recNode");
      }

      // console.log(i, recNode, node, text);
      i = recNode.end - 1;

      result.push({
        text: text.slice(recNode.start, recNode.end),
        p: {
          start: node.start,
          end: node.end,
          code: arr[i]?.code ?? "",
          hidden: node.hidden,
        },
      });
    }
  }
  return result;
};

interface T {
  text: string;
  gloss?: PositionedItem | null;
  reading?: PositionedItem | null;
}

type R = ReturnType<typeof structureText>;

export const mergePositions = (readings: R, glosses: R) => {
  const result: T[] = [];
  const text = readings.map((r) => r.text).join("");

  for (let i = 0; i < text.length; i++) {
    let reading = readings.find((r) => r.p?.start === i);

    const gloss = glosses.find((r) => r.p?.start === i);
    const max = Math.max(reading?.p?.end ?? 0, gloss?.p?.end ?? 0);

    let newGloss: PositionedItem | null = null;
    let newReading: PositionedItem | null = null;

    if (gloss?.p) {
      newGloss = {
        code: gloss.p.code,
        start: gloss.p.start - i,
        end: gloss.p.end - i,
        hidden: gloss.p.hidden,
      };

      if (!reading) {
        const gp = gloss.p;
        const reading2 = readings.find(
          (r) => r.p?.start! >= gp.start && r.p?.end! <= gp.end,
        );
        if (reading2) {
          reading = reading2;
        }
      }
    }

    if (reading?.p) {
      newReading = {
        code: reading.p.code,
        start: reading.p.start - i,
        end: reading.p.end - i,
        hidden: reading.p.hidden,
      };
    }

    if (newGloss || newReading) {
      const elem: T = {
        text: text.slice(i, max),
        reading: newReading,
        gloss: newGloss,
      };

      result.push(elem);
      i = max - 1;
      continue;
    }

    result.push({ text: text[i] ?? "" });
  }
  return result;
};
