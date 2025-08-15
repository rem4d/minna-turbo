import type { EffectCallback } from "react";
import { useEffect, useRef } from "react";

const useEffectOnce = (effect: EffectCallback) => {
  // eslint-disable-next-line
  useEffect(effect, []);
};

const useUnmount = (fn: () => any): void => {
  const fnRef = useRef(fn);

  // update the ref each render so if it change the newest callback will be invoked
  fnRef.current = fn;

  // eslint-disable-next-line
  useEffectOnce(() => () => fnRef.current());
};

export default useUnmount;
