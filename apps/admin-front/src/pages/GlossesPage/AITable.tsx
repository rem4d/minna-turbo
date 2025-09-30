import { Text, Table, DropdownMenu, IconButton } from "@radix-ui/themes";
import { twMerge } from "tailwind-merge";

interface GlossData {
  id: number;
  kana?: string | null;
  comment?: string | null;
  cnt?: number | null;
  gloss_id?: number | null;
}

interface AITableProps {
  glossesData?: GlossData[] | null;
  currentGlossId: number | null;
  onTableGlossClick?: (id: number) => void;
  onCreateGlossClick: (id: number) => void;
  onConnectWithSelected: (id: number) => void;
  onSetHiddenClick: (id: number) => void;
}

export default function AITable({
  currentGlossId,
  glossesData,
  onTableGlossClick,
  onCreateGlossClick,
  onConnectWithSelected,
  onSetHiddenClick,
}: AITableProps) {
  if (!glossesData) {
    return null;
  }
  const _onSetHiddenClick = (e: React.MouseEvent, glossId: number) => {
    e.stopPropagation();
    onSetHiddenClick(glossId);
  };
  return (
    <Table.Root size="2" variant="ghost">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>id</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Text color="gray">kana</Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="whitespace-nowrap">
            <Text color="gray">comment</Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Text color="gray">sentences</Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Text color="gray">gloss id</Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {glossesData?.map((gloss) => (
          <Table.Row
            key={gloss.id}
            className={twMerge(
              "cursor-pointer hover:bg-gray-500/10",
              gloss.gloss_id && "bg-green-600/10",
              gloss.id === currentGlossId && "bg-[var(--accent-9)]/40",
            )}
            onClick={() => onTableGlossClick?.(gloss.id)}
          >
            <Table.Cell>
              <div className="whitespace-nowrap text-xs text-gray-500">
                {gloss.id}
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="whitespace-nowrap">{gloss.kana}</div>
            </Table.Cell>
            <Table.Cell>
              <Text size="1">{gloss.comment}</Text>
            </Table.Cell>
            <Table.Cell>
              <Text size="1" color="gray">
                {gloss.cnt}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text size="2" color="gray">
                {gloss.gloss_id}
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
                    onClick={() => onCreateGlossClick(gloss.id)}
                  >
                    Create new gloss from it
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => onConnectWithSelected(gloss.id)}
                  >
                    Connect it with selected gloss
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    onClick={(e) => _onSetHiddenClick(e, gloss.id)}
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
  );
}
