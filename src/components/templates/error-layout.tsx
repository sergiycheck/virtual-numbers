import { ReactNode } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { TypographyH2, TypographySmall } from "../ui/typography";

interface Props {
  children: ReactNode;
}
export default function ErrorLayout({ children }: Props) {
  const navigate = useNavigate();
  return (
    <div className="h-screen grid place-content-center place-items-center bg-light dark:bg-dark">
      <TypographyH2>{children}</TypographyH2>
      <Button onClick={() => navigate("/")} className="mt-4">
        <RiArrowLeftLine size={20} />
        <TypographySmall className="font-bold">Go Back</TypographySmall>
      </Button>
    </div>
  );
}
