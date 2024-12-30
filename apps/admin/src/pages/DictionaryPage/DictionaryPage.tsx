import { api } from "@/utils/api";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import {
  Box,
  DropdownMenu,
  Flex,
  Grid,
  IconButton,
  Text,
  SegmentedControl,
  Table,
  TextField,
} from "@radix-ui/themes";
import { twMerge } from "tailwind-merge";
import { useCallback, useEffect, useRef, useState, type FC } from "react";

export const DictionaryPage: FC = () => {
  const [isEditingMeaning, setIsEditingMeaning] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [filterText, setFilterText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [selectedPos, setSelectedPos] = useState<string>("verb");

  const MAX_PER_PAGE = 10;

  const editInputRef = useRef<HTMLInputElement>(null);

  const utils = api.useUtils();
  const { data: membersByPosData } = api.member.membesByPos.useQuery({
    pos: selectedPos,
    limit: MAX_PER_PAGE,
    page: pageNumber,
  });

  const { data: total } = api.member.membesByPosTotal.useQuery({
    pos: selectedPos,
  });
  const membersByPos = membersByPosData;

  const updateMeaningMutation = api.member.updateMeaning.useMutation({
    onSuccess() {
      utils.member.membesByPos.invalidate();
    },
  });
  const setHiddenMutation = api.member.setHidden.useMutation({
    onSuccess() {
      utils.member.membesByPos.invalidate();
    },
  });
  const setInvalidMutation = api.member.setInvalid.useMutation({
    onSuccess() {
      utils.member.membesByPos.invalidate();
    },
  });

  const { data: correspondingSentences } =
    api.sentence.findContainingText.useQuery(
      {
        text: filterText,
        pos: selectedPos,
      },
      {
        enabled: !!filterText && filterText.length > 0,
      },
    );

  const handleDocumentClick = useCallback((e: MouseEvent) => {
    if (e.target) {
      const eq = (e.target as HTMLInputElement).isEqualNode(
        editInputRef.current,
      );
      if (!eq) {
        setIsEditingMeaning(false);
      }
      console.log(eq);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [handleDocumentClick]);

  const onEditValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditingValue(e.target.value);
    },
    [],
  );

  const onEditMeaningClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, id: number) => {
      e.stopPropagation();
      setEditingId(id);
      setIsEditingMeaning(true);
      const found = membersByPos?.find((m) => m.id === id);
      if (found) {
        setEditingValue(found.en ?? "");
      }
    },
    [membersByPos],
  );

  const onInputKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Enter") {
        setEditingId(null);
        setEditingValue("");
        setIsEditingMeaning(false);
        if (editingId) {
          updateMeaningMutation.mutate({
            id: editingId,
            meaning: editingValue.trim(),
          });
        }
      }
    },
    [editingId, editingValue, updateMeaningMutation],
  );

  const onFindSentencesClick = useCallback(
    (id: number) => {
      const found = membersByPos?.find((m) => m.id === id);
      if (found) {
        setCurrentMemberId(id);
        setFilterText(found.basic_form);
      } else {
        console.error("No corresponding member found.");
      }
    },
    [membersByPos],
  );

  const onSetInvalidClick = useCallback(
    (id: number) => {
      setInvalidMutation.mutate(id);
    },
    [setInvalidMutation],
  );

  const onSetHiddenClick = useCallback(
    (id: number) => {
      setHiddenMutation.mutate(id);
    },
    [setHiddenMutation],
  );

  const onPosChange = (v: string) => {
    setPageNumber(1);
    setSelectedPos(v);
  };

  return (
    <Box>
      <Grid columns="40% 65%" gap="4">
        <Box className="col-span-full">
          <SegmentedControl.Root defaultValue="inbox">
            <SegmentedControl.Item
              value="verb"
              onClick={() => onPosChange("verb")}
            >
              verb
            </SegmentedControl.Item>
            <SegmentedControl.Item
              value="noun"
              onClick={() => onPosChange("noun")}
            >
              noun
            </SegmentedControl.Item>
            <SegmentedControl.Item
              value="adjective"
              onClick={() => onPosChange("adjective")}
            >
              adjective
            </SegmentedControl.Item>
          </SegmentedControl.Root>
        </Box>
        <section className="">
          <Flex direction="column" className="sticky top-0">
            <Flex justify="between">
              <Flex gap="2">
                <IconButton
                  onClick={() => setPageNumber(pageNumber - 1)}
                  disabled={pageNumber === 1}
                >
                  <ArrowLeftIcon width="18" height="18" />
                </IconButton>
                <IconButton
                  onClick={() => setPageNumber(pageNumber + 1)}
                  disabled={membersByPos && membersByPos.length < MAX_PER_PAGE}
                >
                  <ArrowRightIcon width="18" height="18" />
                </IconButton>
              </Flex>
              <Flex>
                <Text size="1" color="gray">
                  {pageNumber * MAX_PER_PAGE} /{total}
                </Text>
              </Flex>
            </Flex>
            {membersByPos && membersByPos.length > 0 && (
              <Table.Root size="2" variant="ghost">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>id</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>basic form</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>meaning</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>pos</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {membersByPos.map((m) => (
                    <Table.Row
                      key={m.id}
                      className={twMerge(
                        m.id === currentMemberId && "bg-gray-800",
                      )}
                    >
                      <Table.Cell>
                        <Text color="gray">{m.id}</Text>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        {m.basic_form}
                      </Table.Cell>
                      <Table.Cell>
                        {isEditingMeaning && editingId === m.id ? (
                          <TextField.Root
                            ref={editInputRef}
                            placeholder="new value..."
                            value={editingValue}
                            onChange={onEditValueChange}
                            onKeyDown={onInputKeydown}
                          ></TextField.Root>
                        ) : (
                          m.en
                        )}
                      </Table.Cell>
                      <Table.Cell>{m.pos}</Table.Cell>
                      <Table.Cell>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <IconButton size="1" variant="soft">
                              <DropdownMenu.TriggerIcon />
                            </IconButton>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item
                              onClick={() => onFindSentencesClick(m.id)}
                            >
                              Find sentences
                            </DropdownMenu.Item>
                            {/* <DropdownMenu.Item>Find on jisho</DropdownMenu.Item> */}
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item
                              onClick={(e) => onEditMeaningClick(e, m.id)}
                            >
                              Edit meaning
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onClick={() => onSetInvalidClick(m.id)}
                            >
                              Set invalid
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onClick={() => onSetHiddenClick(m.id)}
                            >
                              Set hidden
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Flex>
        </section>
        <Flex direction="column" gap="4">
          <Flex align="center" gapX="2">
            <TextField.Root
              disabled
              value={filterText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilterText(e.target.value)
              }
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Flex>
          <Text size="2">
            Sentences found:{" "}
            {correspondingSentences && (
              <Text size="2">{correspondingSentences.length}</Text>
            )}{" "}
          </Text>
          {correspondingSentences &&
            correspondingSentences.map((s, index) => (
              <Box key={s.id}>
                <Flex align="start" gap="2">
                  <Text size="2" color="gray">
                    {index + 1}.
                  </Text>
                  <Flex direction="column" gap="2">
                    <Text size="2" className="text-white/60">
                      {s.id}
                    </Text>
                    <Text
                      size="2"
                      className="text-white/60"
                      dangerouslySetInnerHTML={{
                        __html: s.text_with_furigana ?? "",
                      }}
                    />
                    <Text className="text-white/90" size="2">
                      {s.ru}
                    </Text>
                    <Text className="text-white/20" size="2">
                      {s.en}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            ))}
        </Flex>
      </Grid>
    </Box>
  );
};
export default DictionaryPage;
