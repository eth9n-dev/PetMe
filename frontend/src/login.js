import { useGoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import axios from "axios";

const Login = ({ onLoginSuccess }) => {
  const [user, setUser] = useState([]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      console.log(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          // PASS USER DATA TO PARENT
          onLoginSuccess(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <div className="shadow-2xl">
      <button type="button" onClick={() => login()}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
