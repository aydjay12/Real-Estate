import {
  MantineProvider,
  Container,
  Modal,
  Stepper,
  Button,
} from "@mantine/core";
import "@mantine/core/styles.css";
import React, { useState } from "react";
import AddLocation from "../AddLocation/AddLocation";
import { useAuth0 } from "@auth0/auth0-react";
import UploadImage from "../UploadImage/UploadImage";
import BasicDetails from "../BasicDetails/BasicDetails";
import Facilities from "../Facilities/Facilities";

const AddPropertyModal = ({ opened, setOpened }) => {
  const [active, setActive] = useState(0);
  const { user } = useAuth0();

  const [propertyDetails, setPropertyDetails] = useState({
    title: "",
    description: "",
    price: 0,
    country: "",
    city: "",
    address: "",
    image: null,
    facilities: {
      bedrooms: 0,
      parkings: 0,
      bathrooms: 0,
    },
    userEmail: user?.email || "",
  });

  const nextStep = () => {
    setActive((current) => (current < 4 ? current + 1 : current));
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  // const addSampleData = () => {
  //   setPropertyDetails((prevDetails) => ({
  //     ...prevDetails,
  //     title: "Sample Property",
  //     description: "A beautiful property in a prime location.",
  //     price: 500000,
  //     country: "USA",
  //     city: "San Francisco",
  //     address: "123 Main St",
  //     image: "https://via.placeholder.com/150",
  //     facilities: {
  //       bedrooms: 3,
  //       parkings: 2,
  //       bathrooms: 2,
  //     },
  //   }));
  // };

  return (
    <MantineProvider>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        closeOnClickOutside
        size={"90rem"}
      >
        <Container h={"40rem"} w={"100%"}>
          {/* <Button onClick={addSampleData} mb="lg">
            Add Sample Data
          </Button> */}
          <Stepper
            active={active}
            onStepClick={setActive}
            breakpoint="sm"
            allowNextStepsSelect={false}
          >
            <Stepper.Step label="Location" description="Address">
              <AddLocation
                nextStep={nextStep}
                propertyDetails={propertyDetails}
                setPropertyDetails={setPropertyDetails}
              />
            </Stepper.Step>
            <Stepper.Step label="Images" description="Upload">
              <UploadImage
                prevStep={prevStep}
                nextStep={nextStep}
                propertyDetails={propertyDetails}
                setPropertyDetails={setPropertyDetails}
              />
            </Stepper.Step>
            <Stepper.Step label="Basics" description="Details">
              <BasicDetails
                prevStep={prevStep}
                nextStep={nextStep}
                propertyDetails={propertyDetails}
                setPropertyDetails={setPropertyDetails}
              />
            </Stepper.Step>
            <Stepper.Step label="Facilities" description="Amenities">
              <Facilities
                prevStep={prevStep}
                propertyDetails={propertyDetails}
                setPropertyDetails={setPropertyDetails}
                setOpened={setOpened}
                setActiveStep={setActive}
              />
            </Stepper.Step>
            <Stepper.Completed>
              Completed! Click back to review or submit to finalize.
            </Stepper.Completed>
          </Stepper>
        </Container>
      </Modal>
    </MantineProvider>
  );
};

export default AddPropertyModal;
