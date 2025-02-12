import type { VariantProps } from "class-variance-authority";
import type { FC, PropsWithChildren } from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "flex items-center justify-center rounded-lg bg-black px-4 py-3 text-base leading-6 text-white",
  {
    variants: {
      variant: {
        primary: "bg-black text-white",
        secondary: "border bg-white text-black",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  className?: string;
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  variant,
  className,
}) => {
  return (
    <button className={twMerge(buttonVariants({ variant, className }))}>
      {children}
    </button>
  );
};

export default Button;
