import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChangeEmailModal from "@/components/account-settings/profile-details/change-email-modal";
import ChangePasswordModal from "./change-password-modal";
import { TypographyMuted } from "@/components/ui/typography";
import useUserState from "@/store/slices/userSlice";

export default function ChangeCredentials() {
  const { ...user } = useUserState();
  return (
    <div className="flex flex-col gap-y-4 max-w-[398px]">
      <div className="flex flex-col gap-y-1">
        <Label>Email</Label>
        <div className="relative w-full">
          <ChangeEmailModal
            trigger={
              <TypographyMuted
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text_brand cursor-pointer 
                text-sm font-semibold tracking-wide"
              >
                Change Email
              </TypographyMuted>
            }
          />
          <Input placeholder={user.email} disabled className="disabled:opacity-100 px-4 py-2" />
        </div>
      </div>
      <div className="flex flex-col gap-y-1">
        <Label>Password</Label>
        <div className="relative w-full ">
          <ChangePasswordModal
            trigger={
              <TypographyMuted
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text_brand cursor-pointer 
                text-sm font-semibold tracking-wide"
              >
                Change Password
              </TypographyMuted>
            }
          />
          <Input
            disabled
            placeholder="example@gmail.com"
            type="password"
            value="**********"
            className="disabled:opacity-100 text-text_03 px-4 py-2"
          />
        </div>
      </div>
    </div>
  );
}
