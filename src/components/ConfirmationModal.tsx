import React, { useImperativeHandle, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { createPortal } from "react-dom";

export type ConfirmModalHandle = {
  confirm: (message: string) => {};
  close: () => void;
};

const ConfirmationModal = React.forwardRef<
  ConfirmModalHandle,
  { onYes: () => void }
>((props, ref) => {
  const [message, setMessage] = useState<string>();
  const [callback, setCallback] = useState<() => void>();
  const [show, setShow] = useState(false);
  const handleNo = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleYes = () => {
    debugger;
    props.onYes();
    handleNo();
  };

  let callbackFunction = () => {};

  useImperativeHandle(ref, () => {
    return {
      confirm(message: string) {
        setMessage(message);

        handleShow();
      },
      close() {
        handleNo();
      },
    };
  });

  return createPortal(
    <>
      <Modal show={show} onHide={handleNo} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleNo}>
            No
          </Button>
          <Button variant="primary" onClick={handleYes}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>,
    document.getElementById("modal")!
  );
});

export default ConfirmationModal;
