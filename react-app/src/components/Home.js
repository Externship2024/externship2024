import { useState, useEffect } from "react";
import axios from "axios";

import avatar_icon from "../images/avatar_icon.png";
import pink_plus_icon from "../images/pink_plus_icon.png";
import blue_plus_icon from "../images/plus_icon_blue.png";
import offer_ride_icon from "../images/gray_offer_ride_icon.png";
import green_offer_ride_icon from "../images/green_offer_ride_icon.png";
import request_ride_icon from "../images/gray_request_ride_icon.png";
import yellow_request_ride_icon from "../images/yellow_request_ride_icon.png";
import CustomizedButton from "./CustomizedButton";
import ModalBackdrop from "./ModalBackdrop";
import RequestForm from "./RequestForm";
import OfferForm from "./OfferForm";
import RequestColLayout from "./RequestColLayout";
import OfferColLayout from "./OfferColLayout";

import { Container, Row, Col, Navbar, } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import UserProfile from "./UserProfile";

function Home() {
  const [modal, setModal] = useState(false);
  const [modalProps, setModalProps] = useState({ title: "" });
  const [formComponent, setFormComponent] = useState(null);
  const [activeButton, setActiveButton] = useState("request");

  const toggleModal = () => setModal(!modal);

  const handleRequestSubmit = async (formData) => {
    console.log('Request form data:', formData);
    try {
      const response = await axios.post('https://externship2024backend.vercel.app/rides/requested', formData);
      console.log('Request form submitted successfully:', response.data);
      toggleModal();
    } catch (error) {
      console.error('Error submitting request form:', error.response ? error.response.data : error.message);
    }
  };

  const handleOfferSubmit = async (formData) => {
    console.log('Offer form data:', formData);
    try {
      const response = await axios.post('https://externship2024backend.vercel.app/rides/offered', formData);
      console.log('Offer form submitted successfully:', response.data);
      toggleModal();
    } catch (error) {
      console.error('Error submitting offer form:', error.response ? error.response.data : error.message);
    }
  };

  const openRequestForm = () => {
    setModalProps({ title: "Adding request" });
    setFormComponent(() => RequestForm);
    toggleModal();
  };

  const displayRequestColLayout = () => {
    setActiveButton("request");
  };

  const displayOfferColLayout = () => {
    setActiveButton("offer");
  };

  const handleSubmit = async (formData) => {
    try {
        const response = await fetch('https://externship2024backend.vercel.app/add_available_ride', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Success:', result);
        
        // Close the modal after successful submission
        toggleModal();
        
        // Optional: Refresh the rides list
        // You could add a function here to refresh the available rides display
        
    } catch (error) {
        console.error('Error:', error);
        // Handle error (show error message to user)
    }
};

// Update your openOfferForm function
const openOfferForm = () => {
    setModalProps({ 
        title: "Adding offer",
        onSubmit: handleSubmit // Pass the submit handler
    });
    setFormComponent(() => OfferForm);
    toggleModal();
};

  return (
    <header>
      <Navbar
        fixed="top"
        color="light"
        light
        expand="md"
        className="border-bottom border-gray bg-white"
      >
        <Container>
          <Row className="w-100">
            <Col className="d-flex justify-content-between">
              <Col xs="auto" className="align-items-center">
                <CustomizedButton
                  icon={blue_plus_icon}
                  alt="default plus icon"
                  label="New Request"
                  bgColor="#0d6efd"
                  onClick={openRequestForm}
                />
              </Col>


              <Col xs="auto" className="align-items-center">
                <CustomizedButton
                  icon={activeButton === "request" ? yellow_request_ride_icon : request_ride_icon}
                  alt="request ride icon"
                  label="Requesting rides"
                  bgColor={activeButton === "request" ? "#f79605" : "#6c757d"}
                  onClick={displayRequestColLayout}
                />
              </Col>

              <Col xs="auto" className="align-items-center">
                <CustomizedButton
                  icon={activeButton === "offer" ? green_offer_ride_icon : offer_ride_icon}
                  alt="offer ride icon"
                  label="Offering rides"
                  bgColor={activeButton === "offer" ? "#7ab01e" : "#6c757d"}
                  onClick={displayOfferColLayout}
                />
              </Col>


              <Col xs="auto" className="align-items-center">
                <CustomizedButton
                  icon={pink_plus_icon}
                  alt="default plus icon"
                  label="New Offer"
                  bgColor="#b01e7a"
                  onClick={openOfferForm}
                />
              </Col>

              <Col xs="auto" className="align-items-center">
                <UserProfile className="absolute top-7 right-7" />
              </Col>
            </Col>
          </Row>
          <div>
            {modal && (
              <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>{modalProps.title}</ModalHeader>
                <ModalBody>
                  {activeButton === "request" && <RequestForm onSubmit={handleRequestSubmit} />}
                  {activeButton === "offer" && <OfferForm onSubmit={handleOfferSubmit} />}
                </ModalBody>
              </Modal>
            )}
          </div>
        </Container>
      </Navbar>

      {
        activeButton === "request" && (
          <Row className="mt-4">
            <Col>
              <RequestColLayout />
            </Col>
          </Row>)
      }
      {
        activeButton === "offer" && (
          <Row className="mt-4">
            <Col>
              <OfferColLayout />
            </Col>
          </Row>)
      }
    </header >
  );
}

export default Home;
