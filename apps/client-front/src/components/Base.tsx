import { useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import { useTRPC } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import StackNavigator from "./StackNavigator";

export function Base() {
  const trpc = useTRPC();
  const userCreator = useMutation(trpc.viewer.user.create.mutationOptions());
  // const queryClient = useQueryClient();
  const setKanjiMap = useAppStore((state) => state.setKanjiMap);

  const initialized = useRef(false);
  const { isSuccess, data } = useQuery(trpc.viewer.kanji.all.queryOptions());

  useEffect(() => {
    if (isSuccess) {
      setKanjiMap(data);
    }
  }, [isSuccess, data, setKanjiMap]);

  useEffect(() => {
    // void queryClient.prefetchQuery(trpc.viewer.kanji.all.queryOptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      userCreator.mutate();
      initialized.current = true;
    }
  }, [userCreator]);

  return (
    <div className="bg-light-gray relative mx-auto h-screen min-h-[568px] max-w-[450px] min-w-[320px] overflow-hidden">
      <StackNavigator />
    </div>
  );
}
