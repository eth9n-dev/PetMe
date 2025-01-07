const Logout = ({ onLogoutSuccess }) => {
  return (
    <div class="signOutButton">
      <button type="button" onClick={onLogoutSuccess}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
