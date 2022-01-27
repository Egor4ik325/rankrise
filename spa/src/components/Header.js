import { useUserContext } from "../hooks/UserContext";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import api from "../client";
import routes from "../routes";

const Navbar = () => {
  return <nav>Nav</nav>;
};

const Profile = () => {
  const [user, setUser] = useUserContext();

  const logout = async () => {
    api.authentication.logout();
    setUser(null);
  };

  return (
    <div className="profile">
      Hi, {user.username}. Your email is {user.email}
      <div>
        <Button onClick={logout} variant="tertiary">
          Logout
        </Button>
      </div>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.any,
};

const Header = () => {
  const [user, ,] = useUserContext();

  return (
    <header>
      <div>RankRise</div>
      <Navbar />

      <div className="right-side">
        {user === undefined ? (
          <>Loading...</>
        ) : user === null ? (
          <div className="login">
            <Link to={routes.login}>Login</Link>
          </div>
        ) : (
          <Profile />
        )}
      </div>
    </header>
  );
};
export default Header;
