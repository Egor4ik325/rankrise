import { useUserContext } from "../hooks/UserContext";
import PropTypes from "prop-types";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import {
  Container,
  Button,
  Form,
  ListGroup,
  ListGroupItem,
  Dropdown,
} from "react-bootstrap";
import api from "../client";
import routes from "../routes";
import { useEffect, useRef, useState } from "react";
import Categories from "./Categories";
import logo from "../assets/img/icons/logo.png";
import { faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Logo = () => {
  return (
    <div className="logo d-flex align-items-center">
      <img src={logo} height={48} className="me-2" />
      <Link
        to={routes.home}
        className="text-white text-decoration-none fs-3 fw-bold"
      >
        RankRise
      </Link>
    </div>
  );
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
    <ListGroup className="search-results">
      <ListGroupItem className="search-results-header">Results</ListGroupItem>
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
      <ListGroupItem className="ask-question">
        <Button variant="tertiary">Ask your question</Button>
      </ListGroupItem>
    </ListGroup>
  );
};

const SearchBar = ({ selectedCategories, setSelectedCategories }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const formRef = useRef(null);

  const handleQueryChange = (e) => setQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    navigate({
      pathname: routes.search,
      search: `?${createSearchParams({
        ...(query && { query }),
        ...(selectedCategories.length > 0 && {
          categories: selectedCategories.toString(),
        }),
      })}`,
    });

    const form = e.target;
    form.reset();

    setQuery(null);
    setSelectedCategories([]);
  };

  const handleSearchResultClick = () => {
    // Reset the form => clear the query => remove the results
    formRef.current?.reset();
  };

  return (
    <div className="search-bar">
      <Form ref={formRef} onSubmit={handleSearchSubmit}>
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <Form.Control
          type="text"
          name="query"
          placeholder="What is the best ...?"
          onChange={handleQueryChange}
          autoComplete="off"
          className="search-control"
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

  // Not authenticated component
  if (user == null) {
    return (
      <div className="account">
        <Button
          as={Link}
          variant="outline-tertiary"
          className="me-2"
          to={routes.login}
        >
          Login
        </Button>
        <Button variant="tertiary">Sign up</Button>
      </div>
    );
  }

  const logout = async () => {
    api.authentication.logout();
    setUser(null);
  };

  // Authenticated rendering
  return (
    <div className="profile">
      <div className="username">{user.username}</div>
      <Dropdown>
        <Dropdown.Toggle className="profile-menu-toggle">
          <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="profile-menu mt-2">
          <Dropdown.Header>Profile</Dropdown.Header>
          <div className="dropdown-email pb-2 ms-3">{user.email}</div>
          <Dropdown.Divider />
          <Button
            variant="tertiary"
            className="dropdown-logout ms-3"
            onClick={logout}
          >
            Logout
          </Button>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.any,
};

const Header = () => {
  const [selectedCategories, setSelectedCategories] = useState(null);

  return (
    <header className="header py-2">
      <Container>
        <div className="logo-categories">
          <Logo />
          <Categories
            selectedItems={selectedCategories}
            setSelectedItems={setSelectedCategories}
          />
        </div>
        <SearchBar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <Profile />
      </Container>
    </header>
  );
};
export default Header;
