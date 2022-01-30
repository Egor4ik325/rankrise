import { useUserContext } from "../hooks/UserContext";
import PropTypes from "prop-types";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

import api from "../client";
import routes from "../routes";
import { useState } from "react";

const Logo = () => {
  return (
    <div>
      <Link to={routes.home}>RankRise</Link>
    </div>
  );
};

const Navbar = () => {
  return <nav>Nav</nav>;
};

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);

  const handleQueryChange = (e) => setQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    navigate({
      pathname: routes.search,
      search: `?${createSearchParams({ query: query })}`,
    });
  };

  return (
    <Form onSubmit={handleSearchSubmit}>
      <Form.Control
        type="text"
        name="query"
        placeholder="What is the best ..."
        onChange={handleQueryChange}
      />
    </Form>
  );
};

const Profile = () => {
  const [user, setUser] = useUserContext();

  if (user === undefined) {
    return <>Loading...</>;
  }

  if (user == null) {
    return (
      <div className="login">
        <Link to={routes.login}>Login</Link>
      </div>
    );
  }

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
  return (
    <header>
      <Logo />
      <Navbar />
      <Search />
      <div className="right-side">
        <Profile />
      </div>
    </header>
  );
};
export default Header;
