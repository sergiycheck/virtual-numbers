import Accounts from "@/components/account-settings/profile-details/accounts";
import ChangeCredentials from "@/components/account-settings/profile-details/change-credentials";
import TwoFactorAuthentication from "@/components/account-settings/profile-details/two-factor-authentication";

export const ProfileDetails = () => {
  return (
    <div className="flex flex-col pt-10 pb-6 sm:px-12 h-full">
      <div className="flex flex-col">
        <ChangeCredentials />
        <div className="mt-10">
          <TwoFactorAuthentication />
        </div>
        <div className="mt-9">
          <Accounts />
        </div>
      </div>
    </div>
  );
};
