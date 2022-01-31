import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../client";
import { APIError, DoesNotExistsError } from "../client/errors";
import Modal from "../components/Modal";
import moment from "moment";
import { Button } from "react-bootstrap";
import routes from "../routes";
import Model from "../components/Modal";
// import Select from "react-select";
import AsyncSelect from "react-select/async";

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
  const [firstProductImage, setFirstProductImage] = useState(null);

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

  const fetchFirstImage = async () => {
    try {
      setFirstProductImage(
        await api.productImages.retrieve({ id: product.images[0] })
      );
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (product?.images[0]) {
      fetchFirstImage();
    }
  }, [product]);

  return (
    <div>
      <div>ID: {option.id}</div>
      {product !== null ? (
        <Link to={routes.product(product.pk)}>Detail</Link>
      ) : (
        <div>Loading...</div>
      )}

      <div>{product !== null ? product.name : <>Loading...</>}</div>
      {firstProductImage && <img src={firstProductImage.url} />}
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

const ProductSuggestModal = ({ question, onSuggest }) => {
  const [shown, setShown] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const fetchTimeoutId = useRef(null);

  const fetchProducts = async (inputValue) => {
    try {
      return await api.products.search({ query: inputValue });
    } catch (error) {
      throw error;
    }
  };

  const handleInputChange = (value) => {
    if (value) {
      setSelectedValue(value);
    }
  };

  const loadOptions = (inputValue, callback) => {
    // if (!query) {
    //   callback([]);
    // }

    // Clear set timeout on previous loadOptions call
    if (fetchTimeoutId.current !== null) {
      clearTimeout(fetchTimeoutId.current);
    }

    fetchTimeoutId.current = setTimeout(async () => {
      const products = await fetchProducts(inputValue);

      const options = products.results.map((product) => ({
        value: product.pk,
        label: product.name,
      }));
      callback(options);
    }, 1000);
  };

  const createOption = async () => {
    try {
      console.log(`Question: ${question.pk}, Product: ${selectedValue.value}`);
      await api.options.create({
        questionId: question.pk,
        productId: selectedValue.value,
      });
    } catch (error) {
      throw error;
    }
  };

  const handleSuggestOption = async () => {
    if (selectedValue) {
      await createOption();

      setShown(false);
      onSuggest();
    }
  };

  return (
    <>
      <Button onClick={() => setShown(true)}>Suggest</Button>
      <Model
        header={<div>Suggest an Option</div>}
        show={shown}
        onHide={() => setShown(false)}
      >
        <p>Select existing product</p>
        <AsyncSelect
          // cacheOptions
          loadOptions={loadOptions}
          onInputChange={handleInputChange}
          onChange={(newSelectedValue) => setSelectedValue(newSelectedValue)}
        />
        <Button onClick={handleSuggestOption}>Suggest</Button>
        <p>Or</p>
        <Button>Create new</Button>
      </Model>
    </>
  );
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
      <ProductSuggestModal question={question} onSuggest={fetchQuestion} />
    </div>
  );
};

export default Question;
