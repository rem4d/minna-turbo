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
import { isDesktop } from "@/utils/detectDevice";

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

// export function useIsNavPending() {
//   return use(RouterContext).isPending;
// }

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
    let anStyle = options?.animationStyle ?? "default";

    if (isDesktop && anStyle !== "remove") {
      anStyle = "default";
    }

    setDirection(1);
    setAnimationStyle(anStyle);

    const found = parseRoute(routes, url);

    // Update router state in transition.
    startTransition(() => {
      addTransitionType(anStyle);
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
    let anStyle = options?.animationStyle ?? "default";

    if (isDesktop && anStyle !== "remove") {
      anStyle = "default";
    }
    setDirection(-1);
    setAnimationStyle(anStyle);
    const prevUrl = screens.at(-2)?.url ?? "/";

    // Update router state in transition.
    startTransition(() => {
      addTransitionType(anStyle);
      go(prevUrl);
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

  const currentScreen = screens.at(-1) ?? null;
  const previousScreen = screens.at(-2) ?? null;
  const canGoBack = screens.length > 1;

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
  index?: boolean;
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
  const initialRoute = parseRoute(routes, window.location.pathname);

  if (!initialRoute) {
    throw new Error("No active route found.");
  }
  const active = initialRoute;

  const found = {
    url: active.path,
    element: active.element,
    name: active.name,
  };

  if (!active.index) {
    const route = routes.find((r) => r.index);
    if (!route) {
      throw new Error("No index route found.");
    }

    const indexRoute = {
      url: route.path,
      element: route.element,
      name: route.name,
    };

    return [indexRoute, found];
  }

  return [found];
};

const parseRoute = (routes: Route[], pathname: string): Route | null => {
  const first = pathname.split("/")[1];

  const routeRegex = new RegExp(`^/${first}`);

  const routeByPathname = routes.find(
    (route) => route.path === pathname || routeRegex.exec(route.path),
  );

  if (!routeByPathname) {
    return null;
  }

  return routeByPathname;
};
