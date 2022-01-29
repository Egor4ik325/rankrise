import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import api from "../client";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

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
        </div>
      </div>
    );
  };

  return render();
};

export default Product;
