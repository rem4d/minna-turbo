import { useState } from "react";
import SearchIcon from "@/assets/icons/search.svg?react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  placeholderText: string;
  onChange?: (v: string) => void;
}
export default function SearchBar({ onChange, value, placeholderText }: Props) {
  const [inFocus, setInFocus] = useState(false);
  const { t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  const onFocus = () => {
    setInFocus(true);
  };

  const onBlur = () => {
    setInFocus(false);
  };

  const onCancelClick = () => {
    setInFocus(false);
    onChange?.("");
  };

  return (
    <div className="mb-2 flex items-center">
      <motion.div
        className="relative flex items-center space-x-2 rounded-lg bg-black/10 p-2"
        initial={{ width: "100%" }}
        animate={{ width: inFocus ? "76%" : "100%" }}
        transition={{
          ease: "linear",
          duration: 0.2,
        }}
      >
        <SearchIcon className="stroke-rolling-stone size-[20px] shrink-0" />

        <input
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
