import { api } from "@/utils/api";
import { Heading } from "@radix-ui/themes";

export default function RusificatorPage() {
  const { data: randomMember, isLoading } =
    api.admin.member.randomUntranslatedMember.useQuery(undefined);

  console.log(randomMember);
  return (
    <div>
      <div>RusificatorPage</div>
      {isLoading ?? <div>Loading...</div>}
      <div>
        {randomMember && (
          <div>
            <div>{randomMember.basic_form}</div>
            <div>{randomMember.en}</div>
            <Heading>Sentences:</Heading>
            <div className="flex flex-col space-y-4">
              {randomMember.sentences.map((sentence) => (
                <div key={sentence.id}>
                  <div> {sentence.text} </div>
                  <div className="opacity-55"> {sentence.ru} </div>
                  {/* <div> {sentence.en} </div> */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
