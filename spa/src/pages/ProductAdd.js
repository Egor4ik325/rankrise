import { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import api from "../client";
import { Price } from "../client/models";
import CategorySelect from "../components/CategorySelect";
import { useMessages } from "../hooks/MessagesContext";

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
    <Container>
      <h2>Add Product</h2>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group>
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
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Web browser created by Mozilla organization."
            name="description"
            onChange={handleInputChange}
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Category</Form.Label>
          <CategorySelect onChange={handleCategoryChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="url"
            placeholder="https://www.mozilla.org/en-US/firefox/"
            name="website"
            onChange={handleInputChange}
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price</Form.Label>
          <Select
            options={options}
            name="price"
            onChange={(option) => setForm({ ...form, price: option.value })}
          />
        </Form.Group>
        <Button variant="tertiary" type="submit">
          Add
        </Button>
      </Form>
    </Container>
  );
};

export default ProductAdd;
