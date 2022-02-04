import { useUserContext } from "../hooks/UserContext";
import PropTypes from "prop-types";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { Button, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import api from "../client";
import routes from "../routes";
import { useEffect, useRef, useState } from "react";
import Categories from "./Categories";

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

const SearchResults = ({ query, onClick }) => {
  const [questions, setQuestions] = useState(null);
  const timeoutId = useRef(null);

  const fetchResults = async () => {
    try {
      setQuestions(await api.questions.search({ query }));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    // Clear all results and all scheduled function for fetching results
    setQuestions(null);
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId);
    }

    // If query is not empty or invalid (null/undefined)
    if (query) {
      // Schedule result fetch in 2 seconds (save scheduled id into ref)
      timeoutId.current = setTimeout(fetchResults, 500);
    }

    // All scheduled timeouts should be clears the the component de mounts (not visible)
    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [query]);

  if (questions === null) {
    return null;
  }

  const handleSearchResultClick = () => {
    setQuestions(null);
    onClick();
  };

  // questions
  return (
    <ListGroup>
      {questions.results.map((result, index) => (
        <ListGroupItem
          as={Link}
          key={index}
          to={`${routes.questions}/${result.pk}`}
          // Hide query results on result click
          onClick={handleSearchResultClick}
        >
          {result.title}
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const formRef = useRef(null);

  const handleQueryChange = (e) => setQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    navigate({
      pathname: routes.search,
      search: `?${createSearchParams({ query: query })}`,
    });

    const form = e.target;
    form.reset();

    setQuery(null);
  };

  const handleSearchResultClick = () => {
    // Reset the form => clear the query => remove the results
    formRef.current?.reset();
  };

  return (
    <div className="searchbar">
      <Form ref={formRef} onSubmit={handleSearchSubmit}>
        <Form.Control
          type="text"
          name="query"
          placeholder="What is the best ...?"
          onChange={handleQueryChange}
          autoFocus
          autoComplete="off"
        />
      </Form>
      <SearchResults query={query} onClick={handleSearchResultClick} />
    </div>
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
      <SearchBar />
      <Categories />
      <div className="right-side">
        <Profile />
      </div>
    </header>
  );
};
export default Header;
