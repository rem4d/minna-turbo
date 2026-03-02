import { useEffect } from "react";
import { useAppStore } from "@/store";
import { useTRPC } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

import StackNavigator from "./StackNavigator";

export function Base() {
  const trpc = useTRPC();
  const setKanjiMap = useAppStore((state) => state.setKanjiMap);

  const { isSuccess, data } = useQuery(trpc.viewer.kanji.all.queryOptions());

  useEffect(() => {
    if (isSuccess) {
      setKanjiMap(data);
    }
  }, [isSuccess, data, setKanjiMap]);

  return (
    <div className="bg-light-gray relative mx-auto h-dvh max-w-[450px] min-w-[320px] overflow-hidden">
      <StackNavigator />
    </div>
  );
}
