import { SunIcon } from "@radix-ui/react-icons";
import { Container, Flex, TabNav } from "@radix-ui/themes";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Outlet, useMatch, useNavigate } from "react-router-dom";

export function Base() {
  const homeMatch = useMatch("/");
  const statsMatch = useMatch("/stats");
  const createMatch = useMatch("/create");
  const glossesMatch = useMatch("/glosses");
  const filterListMatch = useMatch("/filter");
  const [theme, setTheme] = useLocalStorage<"dark" | "light">("theme", "light");

  const navigate = useNavigate();

  const handleThemeClick = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Container>
      <Flex align="center" justify="between" gap="4">
        <TabNav.Root mb="4">
          <TabNav.Link
            onClick={() => navigate("/")}
            active={Boolean(homeMatch)}
          >
            Sentences
          </TabNav.Link>
          <TabNav.Link
            onClick={() => navigate("/create")}
            active={Boolean(createMatch)}
          >
            Create
          </TabNav.Link>
          <TabNav.Link
            onClick={() => navigate("/stats")}
            active={Boolean(statsMatch)}
          >
            Statistics
          </TabNav.Link>
          <TabNav.Link
            onClick={() => navigate("/filter")}
            active={Boolean(filterListMatch)}
          >
            Filter list
          </TabNav.Link>
          <TabNav.Link
            onClick={() => navigate("/glosses")}
            active={Boolean(glossesMatch)}
          >
            Glosses
          </TabNav.Link>
        </TabNav.Root>
        <div
          className="size-[32px] hover:bg-gray-400/10 rounded-sm relative"
          onClick={handleThemeClick}
        >
          <SunIcon className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 size-[18px]" />
        </div>
      </Flex>
      <Outlet />
    </Container>
  );
}
