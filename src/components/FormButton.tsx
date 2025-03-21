import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type IsSubmitting = {
  isSubmitting: boolean;
};

export default function FormButton({ isSubmitting }: IsSubmitting) {
  return (
    <Button
      type={isSubmitting ? "button" : "submit"}
      size="lg"
      className={isSubmitting ? "cursor-wait" : "cursor-pointer"}
    >
      {isSubmitting && <Loader2 className="animate-spin" />}
      {isSubmitting ? "Обработка" : "Сформировать"}
    </Button>
  );
}
