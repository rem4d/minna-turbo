import { STORAGE_LANG } from "@/config/const";
import { useLocalStorage } from "@uidotdev/usehooks";

import Button from "./Button";

export default function ErrorFallbackComponent() {
  const [transLang] = useLocalStorage<"ru" | "en" | null>(STORAGE_LANG, null);
  const onClick = () => {
    window.open("/", "_self", "noopener noreferrer");
  };
  return (
    <div className="bg-athens-gray relative h-screen w-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-black">
        <div className="flex flex-col items-center space-y-8">
          <div>
            {transLang === "ru" ? (
              <>
                Ошибка соединения.
                <br /> Пожалуйста, обновите страницу
              </>
            ) : (
              <>
                Connection error.
                <br />
                Please refresh the page
              </>
            )}
          </div>
          <Button onClick={onClick}>
            {transLang === "ru" ? "Обновить" : "Refresh"}
          </Button>
        </div>
      </div>
    </div>
  );
}
// @TODO: handle
// Unexpected bounds cache miss for index 0.25
