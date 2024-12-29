import { api } from "@/utils/api";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  DropdownMenu,
  Flex,
  IconButton,
  SegmentedControl,
  Table,
  TextField,
} from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState, type FC } from "react";

export const DictionaryPage: FC = () => {
  const [isEditingMeaning, setIsEditingMeaning] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const MAX_PER_PAGE = 50;

  const editInputRef = useRef<HTMLInputElement>(null);

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

  const { data: membersByPos } = api.member.membesByPos.useQuery({
    pos: "verb",
    limit: MAX_PER_PAGE,
    page: pageNumber,
  });

  const utils = api.useUtils();
  const updateMeaningMutation = api.member.updateMeaning.useMutation({
    onSuccess() {
      utils.member.membesByPos.invalidate();
    },
  });

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
            meaning: editingValue,
          });
        }
      }
    },
    [editingId, editingValue, updateMeaningMutation],
  );

  return (
    <Box>
      <Flex align="start" direction="column" gap="4">
        <SegmentedControl.Root defaultValue="inbox">
          <SegmentedControl.Item value="inbox">verb</SegmentedControl.Item>
          <SegmentedControl.Item value="drafts">noun</SegmentedControl.Item>
          <SegmentedControl.Item value="sent">adjective</SegmentedControl.Item>
        </SegmentedControl.Root>
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
        {membersByPos && membersByPos.length > 0 && (
          <Table.Root size="3" variant="ghost">
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
                <Table.Row key={m.id} className="">
                  <Table.Cell>{m.id}</Table.Cell>
                  <Table.Cell>{m.basic_form}</Table.Cell>
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
                        <Button variant="soft">
                          Options
                          <DropdownMenu.TriggerIcon />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item>Find on jisho</DropdownMenu.Item>
                        <DropdownMenu.Item
                          onClick={(e) => onEditMeaningClick(e, m.id)}
                        >
                          Edit meaning
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item>Find sentences</DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item>Set invalid</DropdownMenu.Item>
                        <DropdownMenu.Item>Set hidden</DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Flex>
    </Box>
  );
};
export default DictionaryPage;
