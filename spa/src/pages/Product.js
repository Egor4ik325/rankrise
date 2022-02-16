import { useState, useEffect } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import { useMessages } from "../hooks/MessagesContext";
import routes from "../routes";
import api from "../client";
import ReportModal from "../components/ReportModal";
import { ObjectModel } from "../client/models";
import {
  faFlag,
  faLink,
  faAngleLeft,
  faAngleRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ImageForm = ({ product, onSubmit }) => {
  const [user, ,] = useUserContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useMessages();
  const [uploading, setUploading] = useState(false);

  const handleInputClick = (e) => {
    if (user === null) {
      e.preventDefault();
      navigate(routes.login);
    }
  };

  // Image upload will be triggered on image select
  const handleUploadImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    // Clear file input
    e.target.value = null;

    setUploading(true);

    try {
      await api.productImages.upload({
        productId: product.pk,
        image: file,
      });

      // Refetch uploaded image
      onSubmit();

      setMessages([...messages, "Successfully added new image!"]);
    } catch (error) {
      throw error;
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <div>
        <i>Uploading...</i>
      </div>
    );
  }

  return (
    <Form className="product__images__add-image-form">
      <Form.Group>
        <FontAwesomeIcon
          className="product__images__add-image-form__icon"
          icon={faPlus}
        />
        <Form.Control
          className="product__images__add-image-form__control"
          type="file"
          name="image"
          accept="image/*"
          onClick={handleInputClick}
          onChange={handleUploadImage}
        />
      </Form.Group>
    </Form>
  );
};

const Category = ({ product }) => {
  const [category, setCategory] = useState(null);

  const fetchCategory = async () => {
    try {
      setCategory(await api.categories.retrieve({ id: product.category }));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  if (category === null) {
    return <div>Category: loading...</div>;
  }

  return category.name;
};

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState(null);
  const [user, ,] = useUserContext();

  const [showReportModal, setShowReportModal] = useState(false);

  const fetchProduct = async () => {
    try {
      setProduct(await api.products.retrieve({ id }));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Convert array of image ids to the image objects
  const fetchProductImages = async () => {
    try {
      setImages(
        await Promise.all(
          product.images.map((image) =>
            api.productImages.retrieve({ id: image })
          )
        )
      );
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (product !== null) {
      fetchProductImages();
    }
  }, [product]);

  const renderImages = () => {
    if (images === null) {
      return <>Loading...</>;
    }

    if (!images) {
      return <>No images.</>;
    }

    // return null;
    return images.map((image) => (
      <div className="product__images__item" key={image.pk}>
        <img
          className="product__images__item__image"
          src={image.url}
          width={200}
        />
      </div>
    ));
  };

  // Refetch product (.images attribute) after new image is uploaded => refetch images
  const handleImageSubmit = fetchProduct;

  const render = () => {
    if (product === null) {
      return <>Loading...</>;
    }

    return (
      <>
        <main className="product card">
          <div className="product__header">
            <h2 className="product__header__heading">{product.name}</h2>
            <div
              className="product__header__report"
              onClick={() => setShowReportModal(true)}
            >
              <FontAwesomeIcon icon={faFlag} />
            </div>
          </div>
          <div className="product__category">Gaming</div>
          {/* <div className="product__category">
            {product.category && <Category product={product} />}
          </div> */}
          {/* <p className="product__description">{product.description}</p> */}
          <p className="product__description">
            Minecraft is game of freedom, of creativity and infinite
            imagination.
          </p>
          <div className="product__link-price">
            <Button
              as={"a"}
              className="product__link-price__link"
              variant="tertiary"
              href={product?.website}
            >
              <div className="product__link-price__link__text">Open</div>
              <FontAwesomeIcon icon={faLink} />
            </Button>
            <div className="product__link-price__price">
              {product.price.presentation}
            </div>
          </div>
          <div className="product__images">
            <div className="product__images__button product__images__button--left">
              <FontAwesomeIcon icon={faAngleLeft} />
            </div>
            {renderImages()}
            {user === undefined ? (
              <div className="product__images__item">
                <Spinner animation="grow" />
              </div>
            ) : (
              <ImageForm product={product} onSubmit={handleImageSubmit} />
            )}
            <div className="product__images__button product__images__button--right">
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
          </div>
        </main>

        {/* </main> */}
        <ReportModal
          show={showReportModal}
          onHide={() => setShowReportModal(false)}
          model={ObjectModel.Product}
          id={id}
        />
      </>
    );
  };

  return render();
};

export default Product;
