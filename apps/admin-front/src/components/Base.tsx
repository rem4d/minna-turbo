import { Container, TabNav } from "@radix-ui/themes";
import { Outlet, useMatch, useNavigate } from "react-router-dom";

export function Base() {
  const homeMatch = useMatch("/");
  const statsMatch = useMatch("/stats");
  const createMatch = useMatch("/create");
  const dictionaryMatch = useMatch("/dictionary");
  const filterListMatch = useMatch("/filter");

  const navigate = useNavigate();

  return (
    <Container>
      <TabNav.Root mb="4">
        <TabNav.Link onClick={() => navigate("/")} active={Boolean(homeMatch)}>
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
          onClick={() => navigate("/dictionary")}
          active={Boolean(dictionaryMatch)}
        >
          Dictionary
        </TabNav.Link>
        <TabNav.Link
          onClick={() => navigate("/filter")}
          active={Boolean(filterListMatch)}
        >
          Filter list
        </TabNav.Link>
      </TabNav.Root>
      <Outlet />
    </Container>
  );
}
