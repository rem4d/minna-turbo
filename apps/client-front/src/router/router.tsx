import type { PropsWithChildren } from "react";
import {
  createContext,
  use,
  useEffect,
  useLayoutEffect,
  useState,
  useTransition,
} from "react";

type AnimationStyle = "slide" | "default" | "freeze";

interface RouterContextValue {
  url: string;
  navigate: (url: string, options?: NavigateOptions) => void;
  navigateBack: (url: string, options?: NavigateOptions) => void;
  isPending: boolean;
  params: Record<string, string>;
  direction: number;
  animationStyle: AnimationStyle;
  screens: Screen[];
  currentScreen: Screen | null;
  previousScreen: Screen | null;
  canGoBack: boolean;
}

const RouterContext = createContext<RouterContextValue>({
  url: "/",
  params: {},
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

  const initScreen = {
    id: "initial",
    url: routes[0].path,
    element: routes[0].element,
    key: Date.now(),
    name: "initial",
  };

  const [screens, setScreens] = useState<Screen[]>([initScreen]);

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

    const found = routes.find((route) => route.path === url);

    // Update router state in transition.
    startTransition(() => {
      go(url);
      if (found) {
        const newScreen = {
          id: `screen-${Date.now()}`,
          url,
          element: found.element,
          name: found.name,
          key: Date.now(),
        };

        if (options?.replace) {
          setScreens([newScreen]);
        } else {
          setScreens((prev) => [...prev, newScreen]);
        }
      }
    });
  };

  const navigateBack = (url: string, options?: NavigateOptions) => {
    setDirection(-1);
    setAnimationStyle(options?.animationStyle ?? "slide");

    // Update router state in transition.
    startTransition(() => {
      go(url);
      setScreens(screens.toSpliced(screens.length - 1, 1));
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

  const currentScreen = screens[screens.length - 1];
  const previousScreen = screens[screens.length - 2];
  const canGoBack = screens.length > 1;

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
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
}

interface NavigateOptions {
  animationStyle?: AnimationStyle;
  replace?: boolean;
}

interface RouterProps {
  routes: Route[];
}

interface Screen {
  id: string;
  url: string;
  element: React.ElementType;
  key: number;
  name?: string;
}
