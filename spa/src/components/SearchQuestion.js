import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import routes from "../routes";
import moment from "moment";
import { Spinner } from "react-bootstrap";
import api from "../client";
import { faPlusSquare, fsPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchQuestion = ({ question }) => {
  const [loaded, setLoaded] = useState(false);
  // The client needs to make a lot of request to imitate SQL table JOINs
  const [options, setOptions] = useState(null);
  // Up to three products and images
  const [threeProducts, setThreeProducts] = useState(null);
  const [threeImages, setThreeImages] = useState(null);

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

  const fetchProducts = async () => {
    try {
      // If options aren't empty
      if (options?.count > 0) {
        console.log("Options for fetching: ", options);
        setThreeProducts(
          await Promise.all([
            ...(options?.results?.at(0)?.product
              ? [api.products.retrieve({ id: options.results.at(0).product })]
              : []),
            ...(options?.results?.at(1)?.product
              ? [api.products.retrieve({ id: options.results.at(1).product })]
              : []),
            ...(options?.results?.at(2)?.product
              ? [api.products.retrieve({ id: options.results.at(2).product })]
              : []),
          ])
        );
      } else {
        // Set no products
        setThreeProducts([]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [options]);

  const fetchProductImages = async () => {
    try {
      if (options !== null) {
        // If products aren't empty or null
        if (threeProducts) {
          setThreeImages(
            // Fetch three images for three products (at the same time)
            await Promise.all([
              ...(threeProducts?.at(0)?.images?.at(0)
                ? [
                    api.productImages.retrieve({
                      id: threeProducts.at(0).images.at(0),
                    }),
                  ]
                : [null]),
              ...(threeProducts?.at(1)?.images?.at(0)
                ? [
                    api.productImages.retrieve({
                      id: threeProducts.at(1).images.at(0),
                    }),
                  ]
                : [null]),
              ...(threeProducts?.at(2)?.images?.at(0)
                ? [
                    api.productImages.retrieve({
                      id: threeProducts.at(2).images.at(0),
                    }),
                  ]
                : [null]),
            ])
          );
        } else {
          setThreeImages([]);
        }
        setLoaded(true);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchProductImages();
  }, [threeProducts]);

  // Trigger set loaded after fetching images
  useEffect(() => {
    if (threeImages !== null) {
      // setLoaded(true);
    }
  }, [threeImages]);

  console.log("Question is ", question);

  if (!loaded) {
    return (
      <div className="search-result card">
        <Spinner size="sm" animation="grow" color="black" />
      </div>
    );
  }

  return (
    <div className="search-result card">
      <div className="result-header">
        <div className="option-count">{options.count} options</div>
        <div className="ask-time">{moment(question.askTime).fromNow()}</div>
      </div>
      <Link to={`${routes.questions}/${question.pk}`} className="result-title">
        {question.title}
      </Link>
      <div className="search-result-options">
        {/* Three distinct options or none */}
        <div className="search-result-option">
          {threeImages?.at(0) ? (
            <img className="opt-img" src={threeImages.at(0).url} />
          ) : (
            <div className="opt-img">
              <FontAwesomeIcon icon={faPlusSquare} />
            </div>
          )}
          {threeProducts?.at(0)?.name ? (
            <div>{threeProducts.at(0).name}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="search-result-option">
          {threeImages?.at(1) ? (
            <img className="opt-img" src={threeImages.at(1).url} />
          ) : (
            <div className="opt-img">
              <FontAwesomeIcon icon={faPlusSquare} />
            </div>
          )}
          {threeProducts?.at(1)?.name ? (
            <div>{threeProducts.at(1).name}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="search-result-option">
          {threeImages?.at(2) ? (
            <img className="opt-img" src={threeImages.at(2).url} />
          ) : (
            <div className="opt-img">
              <FontAwesomeIcon icon={faPlusSquare} />
            </div>
          )}
          {threeProducts?.at(2)?.name ? (
            <div>{threeProducts.at(2).name}</div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchQuestion;
