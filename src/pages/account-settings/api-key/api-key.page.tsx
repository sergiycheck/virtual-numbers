import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRef, useState } from "react";
import ChangeApiKeyModal from "../../../components/account-settings/api-key/change-api-key-modal";
import { TypographyMuted } from "@/components/ui/typography";
import { Icons } from "@/components/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { getApiAccessKey } from "@/api/users";
import CopyButton from "@/components/ui/button-copy";

export const ApiKeyPage = () => {
  const { data } = useQuery({
    queryKey: ["api-access"],
    queryFn: async () => {
      const res = await getApiAccessKey();
      return res.data;
    },
  });

  const [show, setShow] = useState(false);
  const copyRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="w-full flex flex-col gap-y-2 sm:px-12 pt-4">
      <TypographyMuted className="text-sm">API Key</TypographyMuted>
      <div className="relative w-full flex flex-col gap-y-4">
        <Input
          disabled
          type={show ? "text" : "password"}
          value={data?.accessKey}
          data-state={show ? "visible" : "hidden"}
          className="disabled:opacity-100 data-[state=visible]:text-primary text-text_03 px-4 py-2"
        />

        <div className="flex gap-x-3  sm:absolute sm:right-4 sm:top-1/2 sm:transform sm:-translate-y-1/2 sm:bg-container_dark">
          <div className="flex gap-x-1 items-center cursor-pointer" onClick={() => setShow(!show)}>
            {show ? (
              <EyeOffIcon className="stroke-current text-icon_brand h-4 w-4" />
            ) : (
              <EyeIcon className="stroke-current text-icon_brand h-4 w-4" />
            )}
            <p className="text-sm text-text_brand font-bold leading-4">{show ? "Hide" : "Show"}</p>
          </div>
          <div className="border border-border_primary border-solid" />
          <ChangeApiKeyModal
            trigger={
              <div className="flex gap-x-1 items-center cursor-pointer">
                <Icons.RegenerateBrand className="fill-current text-icon_brand h-4 w-4" />
                <p className="text-sm text-text_brand font-bold leading-4">Regenerate</p>
              </div>
            }
          />
          <div className="border border-border_primary border-solid" />
          <div
            onClick={() => {
              if (copyRef.current) {
                copyRef.current.click();
              }
            }}
            className="flex gap-x-1 items-center cursor-pointer"
          >
            {data?.accessKey && (
              <CopyButton
                ref={copyRef}
                value={data?.accessKey}
                className="text-icon_brand h-4 w-4"
              />
            )}
            <p className="text-sm text-text_brand font-bold leading-4">Copy</p>
          </div>
        </div>
      </div>
    </div>
  );
};
