import { Button } from "../ui/button";
import { MessageSquareMore } from "lucide-react";

interface Props {
  onButtonClick: () => void;
}

export default function ContactUsButton({ onButtonClick }: Props) {
  return (
    <div className="hidden xl:fixed bottom-14 right-12 xl:flex flex-col items-center justify-center py-3 px-4 rounded-lg border border-input gap-y-3 max-w-max bg-container_same_bg">
      <p className="text-base text-text_title font-medium">
        Still have questions?
      </p>

      <Button variant="secondary" onClick={onButtonClick}>
        <MessageSquareMore className="h-5 w-5 mr-1 fill-current" />
        <span>Contact us</span>
      </Button>
    </div>
  );
}
