import { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import SearchQuestion from "../components/SearchQuestion";

import api from "../client";

const Search = () => {
  const [params] = useSearchParams();
  const query = params.get("query");
  const [page, setPage] = useState(1);
  // Array of responses for each search results page (page container <= 5 results)
  const [questionsResponses, setQuestionsResponses] = useState(null);
  const [fetching, setFetching] = useState(false);

  const fetchQuestions = async () => {
    setFetching(true);
    try {
      const questionsResponse = await api.questions.search({ query, page });

      // Append response to the array
      setQuestionsResponses([...(questionsResponses || []), questionsResponse]);
    } catch (error) {
      throw error;
    }
    setFetching(false);
  };

  useEffect(() => {
    // When query changes start from first page
    setPage(1);
  }, [query]);

  useEffect(() => {
    // Fetch only if query is valid
    if (query) {
      fetchQuestions();
    }
  }, [query, page]);

  const renderResults = () => {
    if (!query) {
      return <>Invalid query!</>;
    }

    if (questionsResponses === null) {
      return <>Loading...</>;
    }

    if (questionsResponses.length === 0) {
      return <>No results</>;
    }

    // Iterate over all response and results
    return questionsResponses.map((questionResponse, index) =>
      questionResponse.results.map((result, index2) => (
        <SearchQuestion key={index * 5 + index2} question={result} />
      ))
    );
  };

  const handleLoadMore = () => setPage(page + 1);

  const renderLoadMore = () => {
    if (questionsResponses?.at(-1)?.next !== null) {
      return <Button onClick={handleLoadMore}>Load more</Button>;
    }
  };

  const renderSearchResultsCount = () => {
    const resultsCount = questionsResponses?.at(0)?.count;
    if (resultsCount) {
      return <>({resultsCount})</>;
    }
  };

  return (
    <Container>
      <p>
        Search results {renderSearchResultsCount()} for query &quot;{query}
        &quot;:
      </p>
      <div className="results">{renderResults()}</div>
      {fetching && <i className="d-block">Fetching...</i>}
      {renderLoadMore()}
    </Container>
  );
};

export default Search;
