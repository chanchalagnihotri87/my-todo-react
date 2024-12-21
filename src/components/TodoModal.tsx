import React, { FormEvent, useImperativeHandle, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { createPortal } from "react-dom";

export type TodoModalHandle = {
  open: () => void;
  close: () => void;
};

const TodoModal = React.forwardRef<
  TodoModalHandle,
  {
    title: string;
    children: React.ReactNode;
    onSave: (event: FormEvent<HTMLFormElement>) => void;
  }
>((props, ref) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const formElementRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => {
    return {
      open() {
        handleShow();
      },
      close() {
        handleClose();
        formElementRef.current?.reset();
      },
    };
  });

  return createPortal(
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <form ref={formElementRef} onSubmit={props.onSave}>
          <Modal.Body>{props.children}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>,
    document.getElementById("modal")!
  );
});

export default TodoModal;
