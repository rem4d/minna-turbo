import { useEffect, useRef, useState } from "react";
import SearchIcon from "@/assets/icons/search.svg?react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  placeholderText: string;
  onChange?: (v: string) => void;
}
export default function SearchBar({ onChange, value, placeholderText }: Props) {
  const [inFocus, setInFocus] = useState(() => value !== "");
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && value !== "") {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  const onFocus = () => {
    setInFocus(true);
  };

  const onBlur = () => {
    if (value === "") {
      setInFocus(false);
    }
  };

  const onCancelClick = () => {
    setInFocus(false);
    onChange?.("");
  };

  return (
    <div className="mb-2 flex items-center">
      <motion.div
        className="relative flex w-full items-center space-x-2 rounded-lg bg-black/10 p-2"
        initial={false}
        animate={{ width: inFocus ? "76%" : "100%" }}
        transition={{
          ease: "linear",
          duration: 0.2,
        }}
      >
        <SearchIcon className="stroke-rolling-stone size-[20px] shrink-0" />

        <input
          ref={inputRef}
          className="w-full outline-none"
          type="text"
          placeholder={placeholderText}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          value={value}
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
        />
      </motion.div>

      <motion.div
        onClick={onCancelClick}
        className="text-denim absolute left-[76%] w-[22%] cursor-pointer rounded-lg p-2"
        initial={false}
        animate={{
          opacity: inFocus ? 1 : 0,
          x: inFocus ? "0px" : "100px",
        }}
        exit={{ opacity: 0, x: "100px" }}
        transition={{
          ease: "linear",
          duration: 0.2,
        }}
      >
        {t("cancel")}
      </motion.div>
    </div>
  );
}
