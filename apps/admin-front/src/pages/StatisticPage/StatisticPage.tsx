import {
  Box,
  Text,
  Heading,
  Card,
  Flex,
  ScrollArea,
  Badge,
  Grid,
  Spinner,
} from "@radix-ui/themes";
import { useCallback, useState } from "react";
import { api } from "@/utils/api";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { openUrl } from "@/utils";

export const StatisticPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const { data: list, isLoading } = api.admin.stat.getStat.useQuery();

  const getSenForLevel = api.admin.stat.getSentencesForLevel.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const onLevelClick = useCallback((_n: number | null) => {
    setSelectedLevel(_n);
    if (_n) {
      getSenForLevel.mutate({ level: _n });
    }
  }, []);

  const mapSourceColor = useCallback((source: string | null) => {
    if (!source) {
      return "ruby";
    }
    switch (source) {
      case "source1":
        return "green";
      case "source2":
        return "yellow";
      case "challenge":
        return "blue";
      case "source3":
        return "red";
      case "source4":
        return "orange";
      case "massif":
        return "purple";
      default:
        return "ruby";
    }
  }, []);
  return (
    <Box>
      <Heading mb="8">Statistics</Heading>
      {isLoading && <Spinner />}
      <ScrollArea scrollbars="vertical" style={{ height: 400, width: "100%" }}>
        <Grid columns="10" gap="4">
          {list?.map((l) => (
            <Box key={`${l.kanji}-${l.pos ?? "N/A"}`}>
              <Card>
                <Flex mb="2" gap="2" align="center">
                  <Text className="whitespace-nowrap" size="4">
                    {l.kanji}
                  </Text>
                  <Badge
                    color="cyan"
                    className="cursor-pointer"
                    onClick={() => onLevelClick(l.pos)}
                  >
                    {l.pos}
                  </Badge>
                </Flex>
                <Badge color="gray">( {l.cnt} )</Badge>
              </Card>
            </Box>
          ))}
        </Grid>
      </ScrollArea>
      {getSenForLevel.isPending && <div>Loading...</div>}
      {getSenForLevel.data?.sentences && (
        <Box>
          <Heading my="8">Gen statements for level {selectedLevel}</Heading>
          <Flex>
            <Card mt="6">
              <Text>{getSenForLevel.data.sentences.length}</Text>
              <Flex direction="column" className="no-scroll overflow-x-scroll">
                {getSenForLevel.data.sentences.map((s) => (
                  <div key={`CLICKED-${selectedLevel}s-${s.text}`}>
                    <Flex align="center">
                      <Text
                        size="2"
                        className="whitespace-nowrap"
                        dangerouslySetInnerHTML={{
                          __html: s.text_with_furigana ?? "",
                        }}
                      />
                      {/* <Badge color={"gray"}>{s.level}</Badge> */}
                      <div
                        className="cursor-pointer"
                        onClick={() => openUrl(`/edit/${s.id}`)}
                      >
                        <ExternalLinkIcon
                          style={{ color: "gray" }}
                          width="15"
                          height="15"
                        />
                      </div>
                      <Badge color={mapSourceColor(s.source)}>
                        {s.source?.substring(0, 2)}
                      </Badge>
                    </Flex>
                  </div>
                ))}
              </Flex>
            </Card>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default StatisticPage;
