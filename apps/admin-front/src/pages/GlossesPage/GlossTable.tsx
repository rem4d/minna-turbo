import { Text, Table } from "@radix-ui/themes";
import { AdminGlossOutput } from "@rem4d/api";
import { twMerge } from "tailwind-merge";

interface GlossTableProps {
  glossesData?: AdminGlossOutput[] | null;
  currentGlossId: number | null;
  onTableGlossClick?: (id: number) => void;
}

export default function GlossTable({
  currentGlossId,
  glossesData,
  onTableGlossClick,
}: GlossTableProps) {
  if (!glossesData) {
    return null;
  }
  return (
    <Table.Root size="2" variant="ghost">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>
            <Text color="gray" size="1">
              id
            </Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Text color="gray" size="1">
              romaji
            </Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Text color="gray" size="1">
              kana
            </Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="whitespace-nowrap">
            <Text color="gray" size="1">
              comment
            </Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="whitespace-nowrap">
            <Text color="gray" size="1">
              num
            </Text>
          </Table.ColumnHeaderCell>

          <Table.ColumnHeaderCell>
            <Text color="gray" size="1">
              cnt
            </Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Text color="gray" size="1">
              ref
            </Text>
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
              gloss.id === currentGlossId && "bg-[var(--accent-9)]/40",
            )}
            onClick={() => onTableGlossClick?.(gloss.id)}
          >
            <Table.Cell className="whitespace-nowrap">
              <div className="whitespace-nowrap text-xs text-gray-500">
                {gloss.id}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap">
              {gloss.romaji}
            </Table.Cell>
            <Table.Cell>
              <div className="whitespace-nowrap">{gloss.kana}</div>
            </Table.Cell>
            <Table.Cell>
              <Text size="1">{gloss.comment}</Text>
            </Table.Cell>
            <Table.Cell>
              <Text size="1">{gloss.number}</Text>
            </Table.Cell>
            <Table.Cell>
              <Text size="1" color="gray">
                {gloss.connected?.length}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text size="1" color="gray">
                {gloss.ref}
              </Text>
            </Table.Cell>
            <Table.Cell>
              {/* <DropdownMenu.Root> */}
              {/*   <DropdownMenu.Trigger> */}
              {/*     <IconButton size="1" variant="soft"> */}
              {/*       <DropdownMenu.TriggerIcon /> */}
              {/*     </IconButton> */}
              {/*   </DropdownMenu.Trigger> */}
              {/*   <DropdownMenu.Content> */}
              {/*     <DropdownMenu.Separator /> */}
              {/*     <DropdownMenu.Item>Set hidden</DropdownMenu.Item> */}
              {/*   </DropdownMenu.Content> */}
              {/* </DropdownMenu.Root> */}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
