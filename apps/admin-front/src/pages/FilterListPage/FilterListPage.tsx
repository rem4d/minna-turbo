import { ExternalLinkIcon } from "@radix-ui/react-icons";

import { openUrl } from "@/utils";
import {
  Box,
  Flex,
  Grid,
  Text,
  TextField,
  Button,
  Badge,
} from "@radix-ui/themes";
import { useRef, useState } from "react";
import { api } from "@/utils/api";

export default function FilterListPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  const findSenMutation =
    api.admin.sentence.findFurtherMembersUpdates.useMutation();
  const correspondingSentences = findSenMutation.data ?? [];

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onFindMembersDiffClick = () => {
    findSenMutation.mutate({ text: inputValue });
  };

  const onCheckListClick = () => {};

  return (
    <div>
      <Box>
        <Grid columns="30% auto" gap="4">
          <Flex direction="column" gap="4">
            <Button onClick={onCheckListClick}>Check List</Button>
            <br />
            <TextField.Root
              ref={inputRef}
              placeholder="Text to find sentences by"
              value={inputValue}
              onChange={onInputChange}
            ></TextField.Root>
            <Button onClick={onFindMembersDiffClick}>Find members diff</Button>
          </Flex>
          <Flex direction="column" gap="4">
            {correspondingSentences.length > 0 && (
              <Flex direction="column" gap="1">
                <Text size="4">N/A</Text>
                <Text size="1">
                  <Text size="2">{correspondingSentences.length}</Text>{" "}
                  sentences found.
                </Text>
              </Flex>
            )}
            {correspondingSentences.map((cs, index) => (
              <Box key={cs.sentence.id}>
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
                            __html: cs.sentence.text_with_furigana ?? "",
                          }}
                        />
                        <div
                          className="cursor-pointer absolute -right-4 top-2"
                          onClick={() => openUrl(`/edit/${cs.sentence.id}`)}
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
                      {cs.sentence.ru}
                    </Text>
                    <Text className="text-white/20" size="2">
                      {cs.sentence.en}
                    </Text>
                    <Text>Prev:</Text>
                    <Flex gap="2">
                      {cs.sentence.members.map((m) => (
                        <Badge key={`p${cs.sentence.id}-${m.id}`}>
                          {m.basic_form}
                        </Badge>
                      ))}
                    </Flex>
                    <Text>New:</Text>
                    <Flex gap="2">
                      {cs.new_members.map((m) => (
                        <Badge color="green" key={`${cs.sentence.id}-${m.id}`}>
                          {m.basic_form}
                        </Badge>
                      ))}
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Grid>
      </Box>
    </div>
  );
}
