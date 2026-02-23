import { Box, Flex, Text, Grid, Heading, Badge } from "@radix-ui/themes";
import { api } from "@/utils/api";
import { MemberOutput } from "@minna/api";
import { useState } from "react";

type Props = {
  members: MemberOutput[];
};

export default function Members({ members }: Props) {
  return (
    <Box>
      <Heading size="5">Members 4</Heading>
      <Grid columns="3" my="8" className="">
        <Grid
          columns="4"
          gridColumn="span 2"
          className="font-klee text-xl"
          gap="4"
        >
          {members.map((m) => (
            <Flex key={m.id} direction="column" className="relative">
              <Text
                truncate
                size="6"
                className="whitespace-nowrap"
                dangerouslySetInnerHTML={{
                  __html: m.ruby,
                }}
              />
              {m.entries[0] ? (
                <>
                  <Text size="2" truncate>
                    {m.entries[0].ru?.[0]}
                  </Text>
                  <Text size="2" truncate>
                    {m.entries[0].en?.[0]}
                  </Text>
                </>
              ) : null}
              <Box className="absolute top-0 right-2">
                <Flex direction="column" gap="1">
                  {!m.pattern_match && (
                    <Badge color="sky" size="1">
                      {m.pos}
                    </Badge>
                  )}
                  {/* {m.is_crush && ( */}
                  {/*   <Badge color="bronze" size="1"> */}
                  {/*     crush */}
                  {/*   </Badge> */}
                  {/* )} */}
                  {m.is_different_reading && (
                    <Badge color="yellow" size="1">
                      different reading
                    </Badge>
                  )}
                  {m.pattern_match && (
                    <Badge color="green" size="1">
                      {m.pattern_match}
                    </Badge>
                  )}
                  {m.is_hidden && (
                    <Badge color="bronze" size="1">
                      hidden
                    </Badge>
                  )}
                  {m.is_expression && (
                    <Badge color="red" size="1">
                      Expression
                    </Badge>
                  )}
                </Flex>
              </Box>
              <Flex direction="column" gap="2">
                {m.entries.map((entry) => (
                  <div key={entry.id}>
                    <MemberItem entry={entry} />
                  </div>
                ))}
              </Flex>
            </Flex>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

const MemberItem = ({ entry }: { entry: MemberOutput["entries"][number] }) => {
  const [showMeaning, setShowMeaning] = useState(false);

  const handleClick = () => {
    setShowMeaning(!showMeaning);
  };
  return (
    <div
      className="bg-slate-500/9 rounded-md p-2 relative"
      onClick={handleClick}
    >
      <div className="absolute top-0 right-2">
        <Badge color="sky" size="1">
          {entry.pos}
        </Badge>
      </div>
      <Flex direction="row">
        {entry.words && entry.words.length > 0
          ? entry.words.map((w, i) => (
              <Text key={w.txt + i} size="3" truncate>
                {w.txt}
                {i === entry.words.length - 1 ? "" : ", "}
              </Text>
            ))
          : null}
      </Flex>
      <Flex>
        <Text size="1">({entry.readings[0].txt})</Text>
      </Flex>

      <div className={showMeaning ? "block" : "hidden"}>
        {entry.ru && entry.ru.length > 0 && (
          <Box className="p-2">
            <Heading mb="2" size="2">
              Ru
            </Heading>
            <Flex direction="column" gap="1">
              {entry?.ru.map((e, i) => (
                <Text key={e + i} className="" size="2">
                  {e}
                </Text>
              ))}
            </Flex>
          </Box>
        )}
        {entry.en && entry.en.length > 0 && (
          <Box className="mt-2 rounded-md p-2">
            <Heading mb="2" size="2">
              En
            </Heading>
            <Flex direction="column" gap="1">
              {entry.en.map((e, i) => (
                <Text key={e + i} className="" size="2">
                  {e}
                </Text>
              ))}
            </Flex>
          </Box>
        )}
        <div>
          [
          {entry.readings.map((r, i) => (
            <Text key={r.txt + i} size="2">
              {r.txt},{" "}
            </Text>
          ))}
          ]
        </div>
      </div>
    </div>
  );
};
