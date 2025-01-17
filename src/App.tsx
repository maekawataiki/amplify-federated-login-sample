import {
  signInWithRedirect,
  signOut,
  getCurrentUser,
  GetCurrentUserOutput,
  fetchAuthSession,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState<GetCurrentUserOutput | null>(null);
  const [groups, setGroups] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customState, setCustomState] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          getUser();
          break;
        case "signInWithRedirect_failure":
          setError("An error has ocurred during the OAuth flow.");
          break;
        case "customOAuthState":
          setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
          break;
      }
    });

    getUser();

    return unsubscribe;
  }, []);

  const getUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      const session = await fetchAuthSession();
      const groups = session?.tokens?.accessToken?.payload['cognito:groups'] as string[] || [];
      setGroups(groups);
    } catch (error) {
      console.log("Not signed in");
    }
  };

  const signIn = async () => {
    try {
      signInWithRedirect({
        customState: "customState",
      });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <main>
      { !user && <button onClick={signIn}>Sign In</button> }
      {/* global オプションをつけると全てのアプリから強制ログアウト */}
      { user && <button onClick={() => signOut({ global: true })}>Sign Out</button> }
      <div>
        <div>{user?.username}</div>
        {customState && <div>Custom State: {customState}</div>}
        {groups && <div>Groups: {groups.join(", ")}</div>}
        <div>{error}</div>
      </div>
    </main>
  );
}

export default App;
