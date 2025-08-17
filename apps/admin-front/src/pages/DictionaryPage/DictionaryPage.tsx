import { api } from "@/utils/api";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

import { useDebounce } from "@uidotdev/usehooks";
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
  Spinner,
} from "@radix-ui/themes";
import { twMerge } from "tailwind-merge";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { openUrl } from "@/utils";

export const DictionaryPage: FC = () => {
  const [isEditingMeaning, setIsEditingMeaning] = useState(false);
  const [isEditingRu, setIsEditingRu] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [membersByText, setMembersByText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);
  const [selectedPos, setSelectedPos] = useState<string>("verb");
  const debouncedMembersByText = useDebounce(membersByText, 500);

  const MAX_PER_PAGE = 10;
  const partsOfSpeech = [
    "verb",
    "noun",
    "particle",
    "adverb",
    "conjunction",
    "auxiliary",
    "conj",
    "adjective",
    "prefix",
  ];

  const editInputRef = useRef<HTMLInputElement>(null);
  const editInputRuRef = useRef<HTMLInputElement>(null);

  const utils = api.useUtils();
  const { data: membersByPosData, isLoading: memberByPosLoading } =
    api.admin.member.membesByPos.useQuery({
      pos: selectedPos,
      limit: MAX_PER_PAGE,
      page: pageNumber,
      basic_form: debouncedMembersByText,
    });

  const { data: total } = api.admin.member.membesByPosTotal.useQuery({
    pos: selectedPos,
  });

  const membersByPos = membersByPosData;

  const updateMeaningMutation = api.admin.member.updateMeaning.useMutation({
    onSuccess() {
      void utils.admin.member.membesByPos.invalidate();
    },
  });
  const updateRuMutation = api.admin.member.updateRu.useMutation({
    onSuccess() {
      void utils.admin.member.membesByPos.invalidate();
    },
  });
  const setHiddenMutation = api.admin.member.setHidden.useMutation({
    onSuccess() {
      void utils.admin.member.membesByPos.invalidate();
    },
  });
  const setInvalidMutation = api.admin.member.setInvalid.useMutation({
    onSuccess() {
      void utils.admin.member.membesByPos.invalidate();
    },
  });

  const findSentencesMutation = api.admin.member.getSentences.useMutation();

  const correspondingSentences = findSentencesMutation.data ?? [];

  const handleDocumentClick = useCallback((e: MouseEvent) => {
    if (e.target) {
      const isInputEn = (e.target as HTMLInputElement).isEqualNode(
        editInputRef.current,
      );
      const isInputRu = (e.target as HTMLInputElement).isEqualNode(
        editInputRuRef.current,
      );
      if (!isInputEn && !isInputRu) {
        setIsEditingMeaning(false);
        setIsEditingRu(false);
      }
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

  const onEditRuClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, id: number) => {
      e.stopPropagation();
      setEditingId(id);
      setIsEditingRu(true);
      const found = membersByPos?.find((m) => m.id === id);
      if (found) {
        setEditingValue(found.ru ?? "");
      } else {
        console.log("unexpected error");
      }
    },
    [membersByPos],
  );

  const onEditMeaningClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, id: number) => {
      e.stopPropagation();
      setEditingId(id);
      setIsEditingMeaning(true);
      const found = membersByPos?.find((m) => m.id === id);
      if (found) {
        setEditingValue(found.en ?? "");
      } else {
        console.log("unexpected error");
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

  const onInputRuKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Enter") {
        setEditingId(null);
        setEditingValue("");
        setIsEditingMeaning(false);
        if (editingId) {
          updateRuMutation.mutate({
            id: editingId,
            ru: editingValue.trim(),
          });
        }
      }
    },
    [editingId, editingValue, updateRuMutation],
  );
  const onFindSentencesClick = useCallback(
    (id: number) => {
      const found = membersByPos?.find((m) => m.id === id);
      if (found) {
        setCurrentMemberId(id);

        void findSentencesMutation.mutate({
          id: id,
        });
      } else {
        console.error("No corresponding member found.");
      }
    },
    [membersByPos, findSentencesMutation],
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
      <Grid columns="45% auto" gap="4">
        <Box className="col-span-full">
          <SegmentedControl.Root defaultValue="inbox">
            {partsOfSpeech.map((pos) => (
              <SegmentedControl.Item
                key={pos}
                value={pos}
                onClick={() => onPosChange(pos)}
              >
                {pos}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </Box>
        <section className="">
          <Flex direction="column" gap="4" className="sticky top-0">
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

                <Flex align="center" gap="2">
                  <TextField.Root
                    value={membersByText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setMembersByText(e.target.value)
                    }
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Flex>
              </Flex>
              <Flex>
                <Text size="1" color="gray">
                  {pageNumber * MAX_PER_PAGE} /{total}
                </Text>
              </Flex>
            </Flex>
            {memberByPosLoading && <Spinner />}
            {membersByPos && membersByPos.length > 0 && (
              <Table.Root size="2" variant="ghost">
                <Table.Header>
                  <Table.Row>
                    {/* <Table.ColumnHeaderCell>id</Table.ColumnHeaderCell> */}
                    <Table.ColumnHeaderCell className="whitespace-nowrap">
                      basic form
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>meaning</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="hidden">
                      ru
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>pos_detail</Table.ColumnHeaderCell>
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
                      {/* <Table.Cell> */}
                      {/*   <Text color="gray">{m.id}</Text> */}
                      {/* </Table.Cell> */}
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
                      <Table.Cell className="hidden">
                        {isEditingRu && editingId === m.id ? (
                          <TextField.Root
                            ref={editInputRuRef}
                            placeholder="new value..."
                            value={editingValue}
                            onChange={onEditValueChange}
                            onKeyDown={onInputRuKeydown}
                          ></TextField.Root>
                        ) : (
                          m.ru
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Text size="1" color="gray">
                          {m.pos_detail_1}
                        </Text>
                      </Table.Cell>
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
                              onClick={(e) => onEditRuClick(e, m.id)}
                            >
                              Edit ru
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
          {correspondingSentences.length > 0 && (
            <Flex direction="column" gap="1">
              <Text size="1">
                <Text size="2">{correspondingSentences.length}</Text> sentences
                found.
              </Text>
            </Flex>
          )}
          {correspondingSentences.map((s, index) => (
            <Box key={s.id}>
              <Flex align="start" gap="2">
                <Text size="2" color="gray">
                  {index + 1}.
                </Text>
                <Flex direction="column" gap="2">
                  <Flex gap="2" align="center">
                    <span className="relative">
                      <Text
                        size="2"
                        className="text-white/60"
                        dangerouslySetInnerHTML={{
                          __html: s.text_with_furigana ?? "",
                        }}
                      />
                      <div
                        className="cursor-pointer absolute -right-4 top-2"
                        onClick={() => openUrl(`/edit/${s.id}`)}
                      >
                        <ExternalLinkIcon
                          style={{ color: "gray" }}
                          width="15"
                          height="15"
                        />
                      </div>
                    </span>
                  </Flex>
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
