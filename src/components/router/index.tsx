import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "@/components/templates/root-layout";
import { useAuthState } from "@/store/slices/authSlice";

import ErrorLayout from "../templates/error-layout";
import SignInPage from "@/pages/auth/sign-in.page";
import SignUpPage from "@/pages/auth/sign-up.page";
import ConfirmEmailPage from "@/pages/auth/confirm-email.page";
import ConfirmSignUpPage from "@/pages/auth/activate-email.page";

import { PassRestorePage } from "@/pages/auth/password-restore.page";
import { ConfirmPasswordRestorePage } from "@/pages/auth/confirm-password-restore.page";
import AuthLayout from "../templates/auth-layout";
import { ActiveNumbersPage } from "@/pages/active-numbers/active-numbers.page";
import BuyCreditsPage from "@/pages/buy-credits/buy-cridits.page";
import OauthSuccessPage from "@/pages/auth/oauth-success.page";
import { UsageHistoryPage } from "@/pages/usage-history/usage-history.page";
import { AccountSettings } from "@/pages/account-settings/account-settings.page";
import { SavedPaymentMethods } from "@/pages/account-settings/saved-payment-methods/saved-payment-methods";
import TeamManagementPage from "@/pages/team-management/team-management.page";
import { ProfileDetails } from "@/pages/account-settings/profile-details/profile-details.page";
import { PaymentHistoryPage } from "@/pages/account-settings/payment-history/payment-history.page";
import { ApiKeyPage } from "@/pages/account-settings/api-key/api-key.page";
import ApiDocumentationPage from "@/pages/api-documentation/api-documentation.page";
import TermsAndPrivacyPage from "@/pages/terms-and-privacy/terms-and-privacy.page";
import HelpCenterPage from "@/pages/help-center/help-center.page";
import useUserState from "@/store/slices/userSlice";
import DocsLayout from "../templates/docs-layout";

const Layout = () => {
  // return authLoadedAndAuthenticated ? (
  //   <RootLayout />
  // ) : authLoading === true ? (
  //   <div className="grid place-content-center w-full h-full">
  //     <LoaderCircle className="w-16 h-16 animate-spin" />
  //   </div>
  // ) : (
  //   <Navigate to="/auth/sign-in" />
  // );
  return <RootLayout />;
};

const SubUserRestrictedRoute = ({ children }: { children: JSX.Element }) => {
  const { primaryUserId } = useUserState();
  const isSubUser = Boolean(primaryUserId);

  return isSubUser ? <ErrorLayout>You don't have access to view this page</ErrorLayout> : children;
};

const AppRouter = () => {
  const { init } = useAuthState();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth" element={<AuthLayout />}>
          <Route index={true} path="sign-in" element={<SignInPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="confirm-email" element={<ConfirmEmailPage />} />
          <Route path="pass-restore" element={<PassRestorePage />} />
          <Route path="oauth-success" element={<OauthSuccessPage />} />
        </Route>

        <Route path="users" element={<AuthLayout />}>
          <Route path="activate/:token" element={<ConfirmSignUpPage />} />
          <Route path="pass-restore/:token" element={<ConfirmPasswordRestorePage />} />
        </Route>

        <Route path="/" element={<Layout />}>
          {/* Authenticated only routes */}
          <Route index={true} element={<ActiveNumbersPage />} />
          <Route
            path="buy-credits"
            element={
              <SubUserRestrictedRoute>
                <BuyCreditsPage />
              </SubUserRestrictedRoute>
            }
          />

          {/* Common auth routes */}
          <Route path="sms-call-history" element={<UsageHistoryPage />} />

          <Route path="account-settings" element={<AccountSettings />}>
            <Route index path="profile-details" element={<ProfileDetails />} />
            <Route
              path="saved-payment-methods"
              element={
                <SubUserRestrictedRoute>
                  <SavedPaymentMethods />
                </SubUserRestrictedRoute>
              }
            />
            <Route path="payment-history" element={<PaymentHistoryPage />} />
            <Route path="api-key" element={<ApiKeyPage />} />
          </Route>

          <Route
            path="team-management"
            element={
              <SubUserRestrictedRoute>
                <TeamManagementPage />
              </SubUserRestrictedRoute>
            }
          />
        </Route>

        <Route path="/" element={<DocsLayout />}>
          <Route path="api-information" element={<ApiDocumentationPage />} />
          <Route path="terms-and-privacy" element={<TermsAndPrivacyPage />} />
          <Route path="help-center" element={<HelpCenterPage />} />
        </Route>

        {/* 404 Not found */}
        <Route path="*" element={<ErrorLayout>Not Found</ErrorLayout>} />
        {/* 403 Forbidden resource */}
        <Route
          path="403"
          element={<ErrorLayout>You don't have access to view this page</ErrorLayout>}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
