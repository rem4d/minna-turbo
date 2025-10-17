import { Text, Table } from "@radix-ui/themes";
import { AdminGlossOutput, AdminGlossOutput2 } from "@rem4d/api";
import { twMerge } from "tailwind-merge";

interface GlossTableProps {
  glossesData?: AdminGlossOutput[] | AdminGlossOutput2[] | null;
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
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="whitespace-nowrap">
            <Text color="gray" size="1">
              code
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

          <Table.ColumnHeaderCell>
            <Text color="gray" size="1">
              ref
            </Text>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {glossesData?.map((gloss, index) => (
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
                {index + 1}
              </div>
            </Table.Cell>
            <Table.Cell>
              <Text size="1" weight="bold">
                {gloss.code}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <div className="whitespace-nowrap">{gloss.kana}</div>
            </Table.Cell>
            <Table.Cell>
              <Text size="1">{gloss.comment}</Text>
            </Table.Cell>

            <Table.Cell>
              <Text size="1" color="gray">
                {gloss.ref}
              </Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
