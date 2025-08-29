import type { PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useState } from "react";

const TestElement = () => {
  return <div>test</div>;
};

const testScreen = {
  id: "initial",
  component: TestElement,
  title: "Home",
  key: Date.now(),
};

interface StackNavContextValue {
  pop: () => void;
  push: (elem: React.ElementType, title: string) => void;
  len: number;
  direction: number;
  currentScreen: Screen;
  previousScreen: Screen;
}

export const StackNavContext = createContext<StackNavContextValue>({
  pop: () => {},
  push: () => {},
  len: 0,
  direction: 0,
  currentScreen: testScreen,
  previousScreen: testScreen,
});

interface ProviderProps {
  initialScreen: React.ElementType;
}

interface Screen {
  id: string;
  component: React.ElementType;
  title: string;
  key: number;
}

export const StackNavContextProvider = ({
  initialScreen,
  children,
}: PropsWithChildren<ProviderProps>) => {
  const [screens, setScreens] = useState<Screen[]>([
    {
      id: "initial",
      component: initialScreen,
      title: "Home",
      key: Date.now(),
    },
  ]);

  const [direction, setDirection] = useState(1);

  const pop = useCallback(() => {
    if (screens.length > 1) {
      setDirection(-1);
      const newScreens = screens.toSpliced(screens.length - 1, 1);
      setScreens(newScreens);
    }
  }, [screens]);

  const push = (ScreenComponent: React.ElementType, title = "Screen") => {
    setDirection(1);
    setScreens((prev) => [
      ...prev,
      {
        id: `screen-${Date.now()}`,
        component: ScreenComponent,
        title,
        key: Date.now(),
      },
    ]);
  };

  const currentScreen = screens[screens.length - 1];
  const previousScreen = screens[screens.length - 2];

  return (
    <StackNavContext.Provider
      value={{
        pop,
        push,
        len: screens.length,
        direction,
        currentScreen,
        previousScreen,
      }}
    >
      {children}
    </StackNavContext.Provider>
  );
};

export const useStackNavContext = () => useContext(StackNavContext);
