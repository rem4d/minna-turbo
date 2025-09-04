import {
  createContext,
  PropsWithChildren,
  use,
  useEffect,
  useLayoutEffect,
  useState,
  useTransition,
} from "react";

interface RouterContextValue {
  url: string;
  navigate: (url: string) => void;
  navigateBack: (url: string) => void;
  isPending: boolean;
  params: Record<string, string>;
  direction: number;
}

const RouterContext = createContext<RouterContextValue>({
  url: "/",
  params: {},
  navigate: () => {},
  navigateBack: () => {},
  isPending: false,
  direction: 1,
});

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

export function Router({ children }: PropsWithChildren) {
  const [routerState, setRouterState] = useState({
    pendingNav: () => {},
    url: document.location.pathname,
  });
  const [isPending, startTransition] = useTransition();
  const [direction, setDirection] = useState<number>(1);

  function go(url: string) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  function navigate(url: string) {
    setDirection(1);
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  function navigateBack(url: string) {
    setDirection(-1);
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const pendingNav = routerState.pendingNav;
  console.log(routerState);

  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
        direction,
      }}
    >
      {children}
    </RouterContext>
  );
}
