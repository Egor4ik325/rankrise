import { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import api from "../client";
import { Price } from "../client/models";
import CategorySelect from "../components/CategorySelect";
import { useMessages } from "../hooks/MessagesContext";
import addInformation from "../assets/img/illustrations/add-information.svg";

const ProductAdd = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const [messages, setMessages] = useMessages();
  const [form, setForm] = useState({
    name: null,
    description: null,
    website: null,
    price: null,
    category: null,
  });

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleCategoryChange = (value) => {
    setForm({
      ...form,
      category: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.products.create(form);

      setTimeout(() => {
        setMessages(messages);
      }, 5000);
      setMessages([...messages, "Successfully added new product!"]);

      navigate(from, { state: { from: location } });
    } catch (error) {
      throw error;
    }
  };

  const options = [
    {
      value: Price.Free,
      label: Price.F,
    },
    {
      value: Price.Paid,
      label: Price.P,
    },
    {
      value: Price.OpenSource,
      label: Price.O,
    },
  ];

  return (
    <Container className="product-add">
      <div className="product-add__illustration">
        <h2 className="product-add__illustration__heading">Add Product</h2>
        <img
          className="product-add__illustration__image"
          src={addInformation}
        />
      </div>
      <Form className="product-add__form" onSubmit={handleFormSubmit}>
        <Form.Group className="product-add__form__group">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Firefox"
            name="name"
            required
            onChange={handleInputChange}
            autoComplete="off"
            autoFocus="on"
          />
        </Form.Group>
        <Form.Group className="product-add__form__group">
          <Form.Label>Description</Form.Label>
          <Form.Control
            className="product-add__form__description"
            as="textarea"
            placeholder="Web browser created by Mozilla organization."
            name="description"
            onChange={handleInputChange}
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group className="product-add__form__group">
          <Form.Label>Category</Form.Label>
          <CategorySelect
            className="product-add__form__category"
            onChange={handleCategoryChange}
            styles={{
              control: (styles) => ({ ...styles, borderRadius: 10 }),
              option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                if (isSelected) {
                  return {
                    ...styles,
                    backgroundColor: "#ffbb98",
                  };
                }

                if (isFocused) {
                  return {
                    ...styles,
                    backgroundColor: "var(--bs-tertiary)",
                  };
                }
                return styles;
              },
            }}
          />
        </Form.Group>
        <Form.Group className="product-add__form__group">
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="url"
            placeholder="https://www.mozilla.org/en-US/firefox/"
            name="website"
            onChange={handleInputChange}
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group className="product-add__form__group">
          <Form.Label>Price</Form.Label>
          <Select
            className="product-add__form__price"
            options={options}
            name="price"
            onChange={(option) => setForm({ ...form, price: option.value })}
            styles={{
              control: (styles) => ({
                ...styles,
                borderRadius: 10,
              }),
              option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                if (isSelected) {
                  return {
                    ...styles,
                    backgroundColor: "#ffbb98",
                  };
                }

                if (isFocused) {
                  return {
                    ...styles,
                    backgroundColor: "var(--bs-tertiary)",
                  };
                }
                return styles;
              },
            }}
          />
        </Form.Group>
        <Button
          className="product-add__form__submit"
          variant="tertiary"
          type="submit"
        >
          Add
        </Button>
      </Form>
    </Container>
  );
};

export default ProductAdd;
