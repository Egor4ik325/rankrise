import { Button, Modal } from "react-bootstrap";

const Model = ({ header, footer, children, ...props }) => {
  return (
    <Modal {...props} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        {footer}
      </Modal.Footer>
    </Modal>
  );
};

export default Model;
