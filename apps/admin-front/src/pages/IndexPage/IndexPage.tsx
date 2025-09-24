import { Box, Button, Flex, Table, Text } from "@radix-ui/themes";
import { useState, type FC } from "react";
import { api } from "../../utils/api";
import { Player } from "@/components/Player";

export const IndexPage: FC = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const MAX_PER_PAGE = 200;

  const { data: list, isLoading } = api.admin.sentence.list.useQuery({
    maxPerPage: MAX_PER_PAGE,
    page: pageNumber,
  });

  console.log(1);
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
        {list && <Text color="gray"></Text>}
        {list && (
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
        )}
      </Flex>
      <div>{isLoading ? "Loading..." : <>&nbsp;</>}</div>
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
            {/* <Table.ColumnHeaderCell>voice</Table.ColumnHeaderCell> */}
            <Table.ColumnHeaderCell>level</Table.ColumnHeaderCell>
            {/* <Table.ColumnHeaderCell>unknown_kanji_n</Table.ColumnHeaderCell> */}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {list?.map((elem, index) => (
            <Table.Row key={elem.id} className="">
              <Table.Cell
                onClick={() => onRowClick(elem.id)}
                className="cursor-pointer"
              >
                <Text color="gray">
                  {index + 1 + pageNumber * MAX_PER_PAGE}
                </Text>
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
              {/* <Table.Cell> */}
              {/*   {elem.vox_speaker_id && elem.vox_file_path && ( */}
              {/*     <Box px="2"> */}
              {/*       <Player */}
              {/*         filePath={elem.vox_file_path} */}
              {/*         speakerId={elem.vox_speaker_id} */}
              {/*       /> */}
              {/*     </Box> */}
              {/*   )} */}
              {/* </Table.Cell> */}
              <Table.Cell>{elem.level}</Table.Cell>
              {/* <Table.Cell>{elem.unknown_kanji_number}</Table.Cell> */}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};
export default IndexPage;
