import { Link } from "react-router-dom";
import { TruverifiLogo } from "../ui/svgs";
import { TypographyMuted } from "../ui/typography";

export function Footer() {
  return (
    <footer
      id="footer"
      className={`h-[52px] py-2 dark:bg-container_same_bg border-t
    `}
    >
      <div className="container flex items-center h-full">
        <div className="hidden sm:flex space-x-4 items-center">
          <Link to="/help-center">
            <TypographyMuted>Help Center</TypographyMuted>
          </Link>
          <Link to="/terms-and-privacy">
            <TypographyMuted>Terms & Privacy</TypographyMuted>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <TruverifiLogo />
        </div>

        <div className="flex justify-end">
          <TypographyMuted>
            © {new Date().getFullYear()} truverifi. All rights reserved.
          </TypographyMuted>
        </div>
      </div>
    </footer>
  );
}
