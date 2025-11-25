import { openUrl } from "@/utils";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Badge, Box, Flex, Text } from "@radix-ui/themes";

interface SentenceSearchResultProps {
  index: number;
  id: number;
  ru: string | null;
  en: string | null;
  source: string | null;
  text?: string | null;
}

const show = true;
export default function SentenceSearchResult({
  id,
  index,
  ru,
  en,
  source,
  text,
}: SentenceSearchResultProps) {
  return (
    <Box>
      <Flex align="start" gap="2">
        <Text size="2" color="gray">
          {index + 1}.
        </Text>
        <Flex direction="column" gap="2">
          <Flex gap="2" align="center">
            <span className="relative">
              <Text size="2">{text}</Text>
              {show && (
                <>
                  <div
                    className="absolute top-2 -right-4 cursor-pointer"
                    onClick={() => openUrl(`/edit/${id}`)}
                  >
                    <ExternalLinkIcon
                      style={{ color: "gray" }}
                      width="15"
                      height="15"
                    />
                  </div>
                  {source && <Badge>{source.substring(0, 3)}</Badge>}
                </>
              )}
            </span>
          </Flex>
          {show && (
            <>
              <Text size="2">{ru}</Text>
              <Text size="2">{en}</Text>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
