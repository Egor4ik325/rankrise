import { useState, useEffect, useRef } from "react";
import { Button, Container, Form } from "react-bootstrap";
import moment from "moment";
import { unstable_HistoryRouter, useNavigate } from "react-router-dom";

import Modal from "../components/Modal";

import { useMessages } from "../hooks/MessagesContext";
import { useUserContext } from "../hooks/UserContext";

import api from "../client";
import { APIError, InvalidDataError } from "../client/errors";

import routes from "../routes";
import CategorySelect from "../components/CategorySelect";

const Hero = () => {
  return <>Hero: RankRise</>;
};

const QuestionCreateModal = ({ show, onHide, onQuestionCreate }) => {
  const [title, setTitle] = useState(null);
  const [category, setCategory] = useState(null);
  const [messages, setMessages] = useMessages();
  const [invalid, setInvalid] = useState(false);

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleFormSubmit = async () => {
    try {
      const question = await api.questions.create({ title, category });
      onQuestionCreate(question);
      onHide();
    } catch (error) {
      // Display errors (where?)
      if (error instanceof APIError) {
        setMessages(messages.concat([error.message]));
        if (error instanceof InvalidDataError) {
          setInvalid(true);
        }
      }
      throw error;
    }
  };

  return (
    <Modal
      header={<>My modal</>}
      footer={
        <Button variant="tertiary" onClick={handleFormSubmit}>
          Create
        </Button>
      }
      show={show}
      onHide={onHide}
    >
      <h3>Hello, World</h3>
      <p>It is my modal</p>
      <Form>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="What is the best game?"
            onChange={handleTitleChange}
            required
            isInvalid={invalid}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Category</Form.Label>
          <CategorySelect onChange={(value) => setCategory(value)} />
        </Form.Group>
      </Form>
    </Modal>
  );
};

const Questions = () => {
  const [user, ,] = useUserContext();
  const navigate = useNavigate();

  const [questionResponse, setQuestionResponse] = useState(undefined);
  const [showQuestionCreateModal, setShowQuestionCreateModal] = useState(false);
  const page = useRef(1);
  const [fetchingMore, setFetchingMore] = useState(false);

  const fetchQuestions = async () => {
    try {
      setQuestionResponse(await api.questions.list());
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const render = () => {
    if (questionResponse === undefined) {
      return <>Loading...</>;
    }

    if (questionResponse === []) {
      return <>No questions.</>;
    }

    return questionResponse.results.map((question, index) => (
      <div key={index}>
        <b>{question.title}</b>
        <p>{moment(question.askTime).fromNow()}</p>
      </div>
    ));
  };

  const handleOpenQuestionCreateModal = () => {
    if (user === null) {
      navigate(routes.login);
    }

    setShowQuestionCreateModal(true);
  };

  const handleQuestionCreate = (question) => {
    setQuestionResponse({
      ...questionResponse,
      count: questionResponse.count + 1,
      results: [question].concat(questionResponse.results),
    });
  };

  const handleLoadMore = async () => {
    page.current += 1;

    setFetchingMore(true);
    try {
      const moreQuestionsResponse = await api.questions.list({
        page: page.current,
      });

      // Add more questions to the older response
      setQuestionResponse({
        ...questionResponse,
        next: moreQuestionsResponse.next,
        results: questionResponse.results.concat(moreQuestionsResponse.results),
      });
    } catch (error) {
      throw error;
    }
    setFetchingMore(false);
  };

  return (
    <div>
      <p>
        List of question{" "}
        {
          // Render count only when question response is neither undefined or null
          (questionResponse ?? false) && <>(total {questionResponse.count})</>
        }
        :
      </p>
      {render()}
      {fetchingMore && <i>Fetching more...</i>}
      <div>
        {questionResponse?.next && (
          <Button variant="link" onClick={handleLoadMore}>
            Load more
          </Button>
        )}
      </div>
      <Button variant="tertiary" onClick={handleOpenQuestionCreateModal}>
        Create new question
      </Button>
      <QuestionCreateModal
        show={showQuestionCreateModal}
        onHide={() => setShowQuestionCreateModal(false)}
        onQuestionCreate={handleQuestionCreate}
      />
    </div>
  );
};

const Home = () => {
  return (
    <Container>
      <Hero />
      <main>
        <Questions />
      </main>
    </Container>
  );
};

export default Home;
