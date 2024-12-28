import { Sentence } from "../../types";
import { Box, Button, Flex, Heading, Table, Text } from "@radix-ui/themes";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type FC,
} from "react";

export const DictionaryPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Sentence[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const MAX_PER_PAGE = 200;

  const makeReqM = useCallback(
    (page: number) => {
      const makeReq = async ({ page }: { page: number }) => {
        setLoading(true);
        const response = await fetch(
          "/api/sentence/list" + `?page=${page}&max_per_page=${MAX_PER_PAGE}`,
        );
        const data: { data: Sentence[] } = await response.json();
        // const d = data.data.sort((a, b) => (a.id < b.id ? 1 : -1));
        // const cur = d.filter(
        //   (a) => typeof a.level !== "undefined" && a.level < 100,
        // );
        // console.log(cur.length);
        setList(data.data);
        setLoading(false);
      };
      makeReq({ page });
    },
    [MAX_PER_PAGE],
  );

  useEffect(() => {
    makeReqM(pageNumber);
  }, [pageNumber, makeReqM]);

  useLayoutEffect(() => {
    makeReqM(0);
  }, [makeReqM]);

  const onRowClick = (id: number) => {
    window.open("/edit/" + id, "_blank");
  };

  const onNavClick = (direction: "prev" | "next") => () => {
    if (direction === "prev") {
      setPageNumber(Math.min(0, pageNumber - 1));
    } else {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <Box>
      <Flex gap="4">
        <Heading>Dictionary</Heading>
        <Text color="gray">Total {list.length > 0 ? list.length : ""}</Text>
        <Flex gap="4">
          <Button disabled={pageNumber === 0} onClick={onNavClick("prev")}>
            Prev
          </Button>
          <Button
            disabled={list.length < MAX_PER_PAGE}
            onClick={onNavClick("next")}
          >
            Next
          </Button>
        </Flex>
      </Flex>
      <div>{loading ? "Loading..." : <>&nbsp;</>}</div>
      <Table.Root size="3" variant="ghost">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <Text color="gray">index</Text>
            </Table.ColumnHeaderCell>
            {/* <Table.ColumnHeaderCell>id</Table.ColumnHeaderCell> */}
            <Table.ColumnHeaderCell>text</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>text_with_furigana</Table.ColumnHeaderCell>
            {/* <Table.ColumnHeaderCell>translation</Table.ColumnHeaderCell> */}
            <Table.ColumnHeaderCell>en</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>ru</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>source</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>level</Table.ColumnHeaderCell>
            {/* <Table.ColumnHeaderCell>unknown_kanji_n</Table.ColumnHeaderCell> */}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {list.map((elem, index) => (
            <Table.Row key={elem.id} className="">
              <Table.Cell
                onClick={() => onRowClick(elem.id)}
                className="cursor-pointer"
              >
                <Text color="gray">{index + pageNumber * MAX_PER_PAGE}</Text>
              </Table.Cell>
              {/* <Table.Cell>{elem.id}</Table.Cell> */}
              <Table.Cell width="290px">{elem.text}</Table.Cell>
              <Table.Cell width="290px">
                <Text
                  size="3"
                  dangerouslySetInnerHTML={{
                    __html: elem.text_with_furigana ?? "",
                  }}
                />
              </Table.Cell>
              {/* <Table.Cell>{elem.translation}</Table.Cell> */}
              <Table.Cell width="290px">{elem.en}</Table.Cell>
              <Table.Cell width="290px">{elem.ru}</Table.Cell>
              <Table.Cell>{elem.source}</Table.Cell>
              <Table.Cell>{elem.level}</Table.Cell>
              {/* <Table.Cell>{elem.unknown_kanji_number}</Table.Cell> */}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
export default DictionaryPage;
