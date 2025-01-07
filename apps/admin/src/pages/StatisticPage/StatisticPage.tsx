/* eslint-disable */
import type { Sentence } from "@rem4d/db";
import type { StatisticsItem } from "@/types";
import {
  Box,
  Text,
  Heading,
  Card,
  Flex,
  ScrollArea,
  Badge,
  Grid,
} from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";

/*
interface GenStatementResponseData {
  data: {
    sentences: Sentence[];
    additional: Sentence[];
  };
}
*/
export const StatisticPage = () => {
  // const [loading, setLoading] = useState(false);
  const [loadingStatementsForLevel, setLoadingStatementsForLevel] =
    useState(false);
  const [list, setList] = useState<StatisticsItem[]>([]);
  const [sentencesLvl, setSentencesLvl] = useState<Sentence[]>([]);
  const [additionalLvl, setAdditionalLvl] = useState<Sentence[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  useEffect(() => {
    /*
    console.log(1);
    const makeReq = async () => {
      // setLoading(true);
      const response = await fetch("/api/sentence/statistics");
      const data: { data: StatisticsItem[] } = await response.json();
      if (!data.data) {
        console.error(data);
        return;
      }
      setList(data.data);
      // setLoading(false);
    };

    makeReq();
    */
  }, []);

  const onLevelClick = useCallback((_n: number) => {
    /*
    const makeReq = async () => {
      setLoadingStatementsForLevel(true);
      setSentencesLvl([]);
      setAdditionalLvl([]);
      const response = await fetch("/api/sentence/get-statements", {
        method: "POST",
        body: JSON.stringify({ level: n }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data }: GenStatementResponseData = await response.json();
      console.log(data.sentences);
      setSentencesLvl(data.sentences);
      setAdditionalLvl(data.additional);
      setSelectedLevel(n);
      setLoadingStatementsForLevel(false);
    };

    makeReq();
    */
  }, []);

  return (
    <Box>
      <Heading mb="8">Statistics</Heading>
      <ScrollArea scrollbars="vertical" style={{ height: 400, width: "100%" }}>
        <Grid columns="10" gap="4">
          {list.map((l) => (
            <Box key={l.kanji + l.lvl + "r"}>
              <Card>
                <Flex mb="2" gap="2" align="center">
                  <Text className="whitespace-nowrap" size="4">
                    {l.kanji}
                  </Text>
                  <Badge
                    color="cyan"
                    className="cursor-pointer"
                    onClick={() => onLevelClick(l.lvl)}
                  >
                    {l.lvl}
                  </Badge>
                </Flex>
                <Badge color="gray">( {l.cnt} )</Badge>
              </Card>
            </Box>
          ))}
        </Grid>
      </ScrollArea>
      {loadingStatementsForLevel && <div>Loading...</div>}
      {selectedLevel && (
        <Box>
          <Heading my="8">Gen statements for level {selectedLevel}</Heading>
          <Flex>
            <Card mt="6">
              <Text>{sentencesLvl.length}</Text>
              <Flex direction="column" className="no-scroll overflow-x-scroll">
                {sentencesLvl.map((s) => (
                  <div key={`CLICKED-${selectedLevel}s-${s.text}`}>
                    <Flex align="center">
                      <Text
                        size="2"
                        className="whitespace-nowrap"
                        dangerouslySetInnerHTML={{
                          __html: s.text_with_furigana ?? "",
                        }}
                      />
                      <Badge color={"gray"}>{s.level}</Badge>
                    </Flex>
                  </div>
                ))}
              </Flex>
            </Card>
            <Card mt="6">
              <Text>{additionalLvl.length}</Text>
              <Flex direction="column" className="no-scroll overflow-x-scroll">
                {additionalLvl.map((s) => (
                  <div key={`${s.id}s-r`}>
                    <Flex align="center">
                      <Text
                        size="2"
                        className="whitespace-nowrap"
                        dangerouslySetInnerHTML={{
                          __html: s.text_with_furigana ?? "",
                        }}
                      />
                      <Badge color={"cyan"}>{s.level}</Badge>
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
