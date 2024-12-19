import { GoogleLogout } from "react-google-login";

const clientId =
  process.env.REACT_APP_CLIENT_ID;

function Logout() {
  const onSuccess = () => {
    console.log("Log out successful.");
  };

  return (
    <div class="signOutButton">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
}

export default Logout;
