import { useState } from "react";
import { useAuth } from "./useAuth";

export function useAuthenticatedAction() {
  const { user } = useAuth();
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);

  const handleAuthenticatedAction = (action: () => void) => {
    if (!user) {
      setShowSignUpDialog(true);
      return;
    }
    action();
  };

  return {
    handleAuthenticatedAction,
    showSignUpDialog,
    setShowSignUpDialog,
    isAuthenticated: !!user,
  };
}
