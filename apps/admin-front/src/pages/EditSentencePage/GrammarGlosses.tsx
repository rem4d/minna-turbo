import React, { useState } from "react";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  Flex,
  Text,
  Grid,
  Heading,
  Spinner,
  DataList,
  Badge,
} from "@radix-ui/themes";

export default function GrammarGlosses({ sentenceId }) {
  const [response, setResponse] = useState<{
    success: boolean;
    closest: number[];
    comment?: string | null;
  } | null>(null);

  const { data: mistralGlosses } = api.admin.sentence.aiGlosses.useQuery(
    { id: sentenceId ?? 0 },
    {
      enabled: !!sentenceId,
    },
  );

  const checkNumberMutation = api.admin.gloss.checkNumber.useMutation({
    onSuccess(data) {
      setResponse(data);
    },
  });

  const onCallNumberCheck = (glossId: number) => {
    checkNumberMutation.mutate({
      sentenceId: sentenceId,
      glossId: glossId,
    });
  };
  const onAcceptNewResponse = () => {};

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
                    <>
                      {checkNumberMutation.isPending && <Spinner />}
                      {!checkNumberMutation.isPending && (
                        <Button
                          variant="ghost"
                          onClick={() => onCallNumberCheck(a.id)}
                        >
                          Check
                        </Button>
                      )}
                    </>
                  )}
                </Flex>
              </Flex>
            </React.Fragment>
          ))}
        </Grid>
        {response && (
          <Box>
            <DataList.Root>
              <DataList.Item align="start">
                <DataList.Label minWidth="88px">Status</DataList.Label>
                <DataList.Value>
                  <Badge
                    color={response.success ? "green" : "red"}
                    variant="soft"
                    radius="full"
                  >
                    {response.success ? "Success" : "Failed"}
                  </Badge>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="start">
                <DataList.Label minWidth="88px">Comment</DataList.Label>
                <DataList.Value>
                  <Text size="2">{response.comment}</Text>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item align="start">
                <DataList.Label minWidth="88px">Number</DataList.Label>
                <DataList.Value>
                  <Text size="2">{response.closest}</Text>
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
            <Button mt="6" onClick={onAcceptNewResponse}>
              Accept
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
