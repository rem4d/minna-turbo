import { api } from "@/utils/api";
import { useEffect } from "react";

export default function RusificatorPage() {
  const mutation = api.admin.member.getMemberSentences.useMutation();
  console.log(1);

  useEffect(() => {
    mutation.mutate({ id: 4851 });
  }, []);

  return (
    <div>
      <div>RusificatorPage</div>
      {/* {isLoading ?? <div>Loading...</div>} */}
      <div>
        {mutation.data && (
          <div>
            <div>
              {mutation.data.map((sentence) => (
                <div>{sentence.text}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
