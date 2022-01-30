import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../client";
import { APIError, DoesNotExistsError } from "../client/errors";
import moment from "moment";

import routes from "../routes";

const Headline = ({ question }) => {
  if (question === undefined) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>{question.title}</h2>
      <h5>Asked {moment(question.askTime).fromNow()}</h5>
    </div>
  );
};

const Option = ({ option }) => {
  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    try {
      setProduct(await api.products.retrieve({ id: option.product }));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [option]);

  return (
    <div>
      <div>ID: {option.id}</div>
      {product !== null ? (
        <Link to={routes.product(product.pk)}>Detail</Link>
      ) : (
        <div>Loading...</div>
      )}

      <div>{product !== null ? product.name : <>Loading...</>}</div>
      <div>Rank: {option.rank}</div>
      <div>
        👍 Upvotes: {option.upvotes} | 👎 Downvotes: {option.downvotes}
      </div>
      <div>
        Price: {product !== null ? product.price.presentation : <>Loading...</>}
      </div>
      {product?.website && <a href={product?.website}>See</a>}
    </div>
  );
};

// question prop should not be undefined or null => This component should not be rendered at all
const Options = ({ question }) => {
  const [options, setOptions] = useState(null);

  const fetchOptions = async () => {
    try {
      setOptions(await api.options.list({ questionId: question.pk }));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [question]);

  // --- Rendering ---

  if (options === null) {
    return <div>Loading...</div>;
  }

  return options.results.map((option) => (
    <Option key={option.id} option={option} />
  ));
};

const Question = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(undefined);

  const fetchQuestion = async () => {
    try {
      setQuestion(await api.questions.retrieve({ id }));
    } catch (error) {
      if (error instanceof APIError) {
        if (error instanceof DoesNotExistsError) {
          navigate(routes.notFound, { replace: true });
        }

        // TODO: display error message
      }

      throw error;
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const render = () => {
    if (question === undefined) {
      return <div>Loading</div>;
    }

    return <div>Question #{id}</div>;
  };

  return (
    <div>
      <Headline question={question} />
      {render()}
      {question ? <Options question={question} /> : <>Loading...</>}
    </div>
  );
};

export default Question;
