import type { PropsWithChildren } from "react";
import {
  addTransitionType,
  createContext,
  use,
  useEffect,
  useLayoutEffect,
  useState,
  useTransition,
} from "react";

type AnimationStyle =
  | "default"
  | "remove"
  | "nav-forward"
  | "nav-back"
  | "disabled";

interface RouterContextValue {
  url: string;
  navigate: (url: string, options?: NavigateOptions) => void;
  navigateBack: (options?: NavigateOptions) => void;
  isPending: boolean;
  direction: number;
  animationStyle: AnimationStyle;
  screens: Screen[];
  currentScreen: Screen | null;
  previousScreen: Screen | null;
  canGoBack: boolean;
}

const RouterContext = createContext<RouterContextValue>({
  url: "/",
  navigate: () => {},
  navigateBack: () => {},
  isPending: false,
  direction: 1,
  animationStyle: "default",
  screens: [],
  currentScreen: null,
  previousScreen: null,
  canGoBack: false,
});

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

export function Router({ children, routes }: PropsWithChildren<RouterProps>) {
  const [routerState, setRouterState] = useState({
    pendingNav: () => {},
    url: document.location.pathname,
  });
  const [isPending, startTransition] = useTransition();
  const [direction, setDirection] = useState<number>(1);
  const [animationStyle, setAnimationStyle] =
    useState<AnimationStyle>("default");

  const [screens, setScreens] = useState<Screen[]>(() =>
    getInitialScreens(routes),
  );

  const go = (url: string) => {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  };

  const navigate = (url: string, options?: NavigateOptions) => {
    const as = options?.animationStyle ?? "default";
    setDirection(1);
    setAnimationStyle(as);

    const found = routes.find((route) => {
      return route.approximate
        ? url.startsWith(route.path)
        : route.path === url;
    });

    // Update router state in transition.
    startTransition(() => {
      addTransitionType(as);
      go(url);
      if (found) {
        const newScreen = {
          url,
          element: found.element,
          name: found.name,
        };

        if (options?.replace) {
          setScreens([newScreen]);
        } else {
          setScreens((prev) => [...prev, newScreen]);
        }
      }
    });
  };

  const navigateBack = (options?: NavigateOptions) => {
    const as = options?.animationStyle ?? "default";
    setDirection(-1);
    setAnimationStyle(as);
    const prevUrl = screens[screens.length - 2]?.url ?? "/";

    // Update router state in transition.
    startTransition(() => {
      addTransitionType(as);
      go(prevUrl);
      setScreens((s) => s.toSpliced(s.length - 1, 1));
    });
  };

  useEffect(() => {
    function handlePopState() {
      setScreens((prev) => prev.toSpliced(prev.length - 1, 1));
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

  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  const currentScreen = screens[screens.length - 1] ?? null;
  const previousScreen = screens[screens.length - 2] ?? null;
  const canGoBack = screens.length > 1;
  // console.log("ROUTER screens:", screens);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        direction,
        animationStyle,
        screens,
        currentScreen,
        previousScreen,
        canGoBack,
      }}
    >
      {children}
    </RouterContext>
  );
}

export interface Route {
  path: string;
  element: React.ElementType;
  name?: string;
  parentPath?: string;
  approximate?: boolean;
}

interface NavigateOptions {
  animationStyle?: AnimationStyle;
  replace?: boolean;
}

interface RouterProps {
  routes: Route[];
}

interface Screen {
  url: string;
  element: React.ElementType;
  name?: string;
}

const getInitialScreens = (routes: Route[]): Screen[] => {
  const pathname = window.location.pathname;
  const initialRoute = routes.find((route) => route.path === pathname);

  const active = initialRoute ?? routes[0];
  if (!active) {
    throw new Error("No active route found.");
  }

  const screen = {
    url: active.path,
    element: active.element,
    name: active.name,
  };
  return [screen];
};
