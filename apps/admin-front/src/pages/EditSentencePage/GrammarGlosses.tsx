import React from "react";
import { api } from "@/utils/api";
import { Box, Button, Flex, Text, Grid, Heading } from "@radix-ui/themes";

export default function GrammarGlosses({ sentenceId }) {
  const { data: mistralGlosses } = api.admin.sentence.aiGlosses.useQuery(
    { id: sentenceId ?? 0 },
    {
      enabled: !!sentenceId,
    },
  );

  const onCallNumberCheck = () => {};

  return (
    <Box>
      <Heading size="5">Grammar glosses</Heading>
      <Box>
        <Grid columns="4" my="8" gap="2" className="">
          {mistralGlosses?.map((a) => (
            <React.Fragment key={a.id}>
              <Text size="2" color="gray">
                {a.gloss_id}
              </Text>
              <Text size="3">{a.kana}</Text>
              <Text size="3">{a.comment}</Text>
              <Flex>
                <Flex align="center" gap="4">
                  <Text color="gray" size="2">
                    {a.number ?? "N/A"}
                  </Text>

                  {a.number !== null && (
                    <Button variant="ghost" onClick={onCallNumberCheck}>
                      Check
                    </Button>
                  )}
                </Flex>
              </Flex>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
