import { useState } from "react";
import Modal from "./Modal";
import _ from "lodash";
import { Form, Button } from "react-bootstrap";
import api from "../client";
import { useMessages } from "../hooks/MessagesContext";

const ReportModal = ({ show, onHide, model, id }) => {
  const [messages, setMessages] = useMessages();

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.reports.create({
        objectModel: model,
        objectId: id,
        title,
        description,
      });

      setTimeout(() => setMessages(messages), 5000);
      setMessages([...messages, `Thanks for reporting ${model}!`]);

      onHide();
    } catch (error) {
      throw error;
    }
  };

  return (
    <Modal
      className="report-modal"
      show={show}
      onHide={onHide}
      header={<div>Report {_.capitalize(model)}</div>}
      footer={
        <Button
          className="modal__button--action"
          type="submit"
          variant="tertiary"
        >
          Report
        </Button>
      }
    >
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            autoComplete="off"
            onChange={handleTitleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            className="report-modal__description"
            as="textarea"
            name="description"
            autoComplete="off"
            style={{ height: 150 }}
            onChange={handleDescriptionChange}
          />
        </Form.Group>
      </Form>
    </Modal>
  );
};

export default ReportModal;
