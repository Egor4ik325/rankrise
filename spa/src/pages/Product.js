import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/UserContext";
import { useMessages } from "../hooks/MessagesContext";
import routes from "../routes";
import api from "../client";

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
    <Form>
      <Form.Group>
        <Form.Label>Upload an image</Form.Label>
        <Form.Control
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

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState(null);
  const [user, ,] = useUserContext();

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
      <img key={image.pk} src={image.url} width={200} />
    ));
  };

  // Refetch product (.images attribute) after new image is uploaded => refetch images
  const handleImageSubmit = fetchProduct;

  const render = () => {
    if (product === null) {
      return <>Loading...</>;
    }

    return (
      <div>
        <h2>{product.name}</h2>
        {product.category && <div>Category: {product.category}</div>}
        <p>{product.description}</p>
        <div>Price: {product.price.presentation}</div>
        {product.website && <a href={product.website}>Check Out</a>}
        <div>
          <h5>Images:</h5>
          <div>{renderImages()}</div>
          {user === undefined ? (
            <div>Loading...</div>
          ) : (
            <ImageForm product={product} onSubmit={handleImageSubmit} />
          )}
        </div>
      </div>
    );
  };

  return render();
};

export default Product;
