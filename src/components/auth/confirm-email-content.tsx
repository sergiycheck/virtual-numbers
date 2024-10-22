import { Helmet } from "react-helmet";
import { RiLoader5Fill, RiCheckboxCircleLine, RiErrorWarningLine } from "react-icons/ri";

type ConfirmationLayoutProps = {
  isLoading: boolean;
  isError: boolean;
  token: boolean;
};

export const ConfirmEmailContent = ({ token, isLoading, isError }: ConfirmationLayoutProps) => {
  return (
    <div className="bg-light-200 dark:bg-dark-100 flex h-screen items-center justify-center">
      <Helmet>
        <title>Confirmation</title>
      </Helmet>
      <div className="dark:bg-dark rounded-lg bg-white p-4 shadow">
        {!!token && (
          <>
            {isLoading && !isError && (
              <div className="flex items-center gap-4 text-primary">
                <RiLoader5Fill className="animate-spin" size={25} />
                <div className="flex flex-col">
                  <span className="text-xl font-bold">Confirming...</span>
                  <span className="text-sm">Please wait</span>
                </div>
              </div>
            )}
            {!isLoading && !isError && (
              <>
                <div className="flex items-center gap-4 text-primary">
                  <RiCheckboxCircleLine size={25} />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold">Email confirmed successfully!</span>
                    <span className="text-sm">You can close this page</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {!token ||
          (isError && (
            <div className="flex items-center gap-4 text-destructive/60">
              <RiErrorWarningLine size={25} />
              <div className="flex flex-col">
                <span className="text-xl font-bold">Confirmation failed</span>
                <p className="text-sm">
                  Confirmation link is expired or invalid token provided
                  <br />
                  Please, try again or resend confirmation link
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
