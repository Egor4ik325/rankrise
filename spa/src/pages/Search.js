import { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import SearchQuestion from "../components/SearchQuestion";

import api from "../client";
import routes from "../routes";

const SearchProduct = ({ product }) => {
  return (
    <div>
      <b>{product.name}</b>
      <div>
        <Link to={routes.product(product.pk)}>See</Link>
      </div>
    </div>
  );
};

const Search = () => {
  // External states
  const [params] = useSearchParams();
  const query = params.get("query") || "";
  const categories = params.get("categories")?.split(",") || null;

  // Internal states
  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [responses, setResponses] = useState(null);
  const [questionSearch, setQuestionSearch] = useState(true);

  const fetchQuestions = async () => {
    setFetching(true);
    try {
      const response = await api.questions.search({ query, categories, page });

      // Append response to the array
      setResponses([...(responses || []), response]);
    } catch (error) {
      throw error;
    }
    setFetching(false);
  };

  const fetchProducts = async () => {
    setFetching(true);
    try {
      const response = await api.products.search({ query, categories, page });

      // Array of responses for each search results page (page container <= 5 results)
      setResponses([...(responses || []), response]);
    } catch (error) {
      throw error;
    }
    setFetching(false);
  };

  const fetchResults = () => {
    // Fetch only if query is valid
    if (query || categories) {
      console.log(
        `Fetching for ${
          questionSearch ? "Questions" : "Products"
        } , query: ${query}, categories: ${categories}, page: ${page}, results before:`,
        responses
      );
      if (questionSearch) {
        fetchQuestions();
      } else {
        fetchProducts();
      }
    }
  };

  // Execute when query changes
  useEffect(() => {
    console.log("Query state has changed.");

    // Clear all previous results responses list (this will trigger refetching)
    setResponses(null);

    // Start fetching responses from first page
    setPage(1);
  }, [params]);

  // Responses state changes happen only when query state changes happen
  useEffect(() => {
    // console.log("Fetch query search results on responses change.");

    // When the query changes it should always be null
    if (responses === null) {
      fetchResults();
    }
  }, [responses]);

  useEffect(() => {
    // console.log("Results after fetching: ", responses);
  }, [responses]);

  const renderResults = () => {
    if (!query && !categories) {
      return <>Invalid query!</>;
    }

    if (responses === null) {
      return <>Loading...</>;
    }

    if (responses.length === 0) {
      return <>No results</>;
    }

    if (questionSearch) {
      // Iterate over all response and results
      return responses.map((questionResponse, index) =>
        questionResponse.results.map((result, index2) => (
          <SearchQuestion key={index * 5 + index2} question={result} />
        ))
      );
    } else {
      return responses.map((productResponse, index) =>
        productResponse.results.map((result, index2) => (
          <SearchProduct key={index * 5 + index2} product={result} />
        ))
      );
    }
  };

  // On page changes

  useEffect(() => {
    // console.log("Fetch new responses on page change.");

    // Don't run this initially (when responses is empty)
    if (responses !== null) {
      fetchResults();
    }
  }, [page]);

  useEffect(() => {
    // console.log("Filter has been switched");

    setResponses(null); // trigger refetch
    setPage(1); // should not trigger refetch
  }, [questionSearch]);

  // Load more

  const handleLoadMore = () => setPage(page + 1);

  const renderLoadMore = () => {
    if (responses?.at(-1)?.next !== null) {
      return <Button onClick={handleLoadMore}>Load more</Button>;
    }
  };

  const renderSearchResultsCount = () => {
    const resultsCount = responses?.at(0)?.count;
    if (resultsCount) {
      return <>({resultsCount})</>;
    }
  };

  return (
    <Container className="search">
      <Form className="search-filters">
        <div className="filter-title">Filters:</div>
        <Form.Check
          type="radio"
          label="Questions"
          name="question"
          checked={questionSearch}
          id="question-search-radio"
          onChange={() => setQuestionSearch(true)}
          className="question-filter"
        />
        <Form.Check
          type="radio"
          label="Products"
          name="product"
          checked={!questionSearch}
          id="product-search-radio"
          onChange={() => setQuestionSearch(false)}
          className="product-filter"
        />
      </Form>
      <p className="search-description">
        Search results {renderSearchResultsCount()} for query &quot;{query}
        &quot; and categories ({categories?.join(", ")}) with {page} pages:
      </p>
      <div className="results">{renderResults()}</div>
      {fetching && <i className="d-block">Fetching...</i>}
      {renderLoadMore()}
    </Container>
  );
};

export default Search;
