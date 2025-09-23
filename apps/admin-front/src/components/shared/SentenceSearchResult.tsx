import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Box, Flex, Text } from "@radix-ui/themes";
import { openUrl } from "@/utils";

interface SentenceSearchResultProps {
  index: number;
  id: number;
  html: string | null;
  ru: string | null;
  en: string | null;
}

export default function SentenceSearchResult({
  id,
  index,
  html,
  ru,
  en,
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
              <Text
                size="2"
                className="text-white/60"
                dangerouslySetInnerHTML={{
                  __html: html ?? "",
                }}
              />
              <div
                className="cursor-pointer absolute -right-4 top-2"
                onClick={() => openUrl(`/edit/${id}`)}
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
            {ru}
          </Text>
          <Text className="text-white/20" size="2">
            {en}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
