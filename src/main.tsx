import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import App from "./App.tsx";
import outputs from "../amplify_outputs.json";
import "./index.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
  ...outputs,
  // 必要に応じて書き換える
  auth: {
    aws_region: "<aws region>",
    user_pool_id: "<user pool id>",
    user_pool_client_id: "<user pool client id>",
    oauth: {
      // Cognito に設定されているドメイン (例: xxxx.auth.us-west-2.amazoncognito.com)
      domain: "<cognito domain>",
      scopes: ["email", "phone", "openid", "profile"],
      // URL は Client に指定した URL と完全一致させる
      // ローカルと本番で切り替えられる実装にすると良い。（window.location.hostname 等。最後の / もあるかどうかは完全一致の必要があるので注意）
      redirect_sign_in_uri: ["http://localhost:5173"],
      redirect_sign_out_uri: ["http://localhost:5173"],
      response_type: "code",
      identity_providers: ["COGNITO"],
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
