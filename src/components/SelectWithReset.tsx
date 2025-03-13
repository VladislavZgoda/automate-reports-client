import { useEffect, useState } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

// https://github.com/shadcn-ui/ui/issues/549

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
  onChange?: (value: string | undefined) => void;
  value?: string;
};

export default function Select({ onChange, value, ...props }: SelectProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value); // Sync internal state when value changes
  }, [value]);

  return (
    <SelectPrimitive.Root
      value={internalValue ?? ""}
      onValueChange={(value) => {
        setInternalValue(value);
        onChange?.(value);
      }}
      {...props}
    >
      {props.children}
    </SelectPrimitive.Root>
  );
}
