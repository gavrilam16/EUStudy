import React, { Component } from "react";

import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { FaTrashAlt } from "react-icons/fa";

class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }

  // On isModalOpen toggle
  toggle = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  };

  // When user clicks the OK button
  handleClick = () => {
    // Send callback to parent function
    this.props.callBack();

    // Close modal
    this.toggle();
  };

  render() {
    const Tag = this.props.tag;

    const inline = this.props.inline ? "d-inline" : null;
    const marginLeft = this.props.isSecondButton ? "ml-1" : null;

    return (
      <Tag className={inline}>
        {/* Modal button -- Text from parent component */}
        <Button
          color="danger"
          size="sm"
          className={marginLeft}
          onClick={this.toggle}
        >
          {this.props.buttonText === "Delete" ? <FaTrashAlt /> : null}{" "}
          {this.props.buttonText}
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
          {/* Title from parent component */}
          <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
          <ModalBody>
            {/* Message from parent component */}
            <h4 className="pt-4">{this.props.message}</h4> <br />
            <div className="text-center">
              {/* OK button */}
              <Button size="lg" color="danger" onClick={this.handleClick}>
                OK
              </Button>
              {/* Cancel button */}
              <Button
                size="lg"
                className="d-inline ml-1"
                color="dark"
                onClick={this.toggle}
              >
                Cancel
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </Tag>
    );
  }
}

export default ConfirmModal;
