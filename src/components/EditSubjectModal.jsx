import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import styled from "styled-components";
import { capitalizeEveryWord } from "../utils/capitalize";
import { errorToast, successToast } from "../utils/toastMessage";

const EditSubjectModal = ({ subject, show, onClose, onSubjectUpdate }) => {
  const [subjectName, setSubjectName] = useState(
    capitalizeEveryWord(subject?.subjectTitle)
  );
  const [initialDaysWithTimes, setInitialDaysWithTimes] = useState({});
  const [daysWithTimes, setDaysWithTimes] = useState({});
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const initialState = {
      Monday: { enabled: false, time: "" },
      Tuesday: { enabled: false, time: "" },
      Wednesday: { enabled: false, time: "" },
      Thursday: { enabled: false, time: "" },
      Friday: { enabled: false, time: "" },
      Saturday: { enabled: false, time: "" },
      Sunday: { enabled: false, time: "" },
    };
    subject.timeTable.forEach(({ day, time }) => {
      initialState[day] = { enabled: true, time };
    });
    setInitialDaysWithTimes(initialState);
    setDaysWithTimes(initialState);
  }, [subject]);

  const handleDayTimeChange = (day, time) => {
    setDaysWithTimes((prevTimes) => {
      const newTimes = {
        ...prevTimes,
        [day]: { ...prevTimes[day], time },
      };
      checkForChanges(newTimes);
      return newTimes;
    });
  };

  const handleCheckboxChange = (day) => {
    setDaysWithTimes((prevTimes) => {
      const newTimes = {
        ...prevTimes,
        [day]: {
          ...prevTimes[day],
          enabled: !prevTimes[day].enabled,
          time: prevTimes[day].enabled ? "" : prevTimes[day].time,
        },
      };
      checkForChanges(newTimes);
      return newTimes;
    });
  };

  const checkForChanges = (newTimes) => {
    const hasChanged = Object.keys(newTimes).some(
      (day) =>
        newTimes[day].enabled !== initialDaysWithTimes[day].enabled ||
        newTimes[day].time !== initialDaysWithTimes[day].time
    );

    const allTimesValid = Object.keys(newTimes).every(
      (day) =>
        !newTimes[day].enabled || (newTimes[day].enabled && newTimes[day].time)
    );

    setIsChanged(hasChanged && allTimesValid);
  };

  const handleSaveChanges = async () => {
    const schedule = Object.entries(daysWithTimes)
      .filter(([day, details]) => details.enabled)
      .map(([day, details]) => ({
        day,
        time: details.time,
      }));

    const updatedSubject = {
      name: subjectName,
      schedule,
    };

    try {
      await axios.patch(`/api/v1/subject/${subject._id}`, {
        updatedSubject,
      });
      successToast("Time table updated successfully");
      onSubjectUpdate();
      onClose();
    } catch (error) {
      if (error.message === "Request failed with status code 400") {
        errorToast("Timetable is clashing with other subject");
      }
      console.error("Error updating subject:", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit {subjectName} Time-Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <StyledForm>
          <Form.Group controlId="daysWithTimes">
            <Form.Label className="mb-3 text-muted">Schedule</Form.Label>
            {Object.keys(daysWithTimes).map((day) => (
              <Row key={day} className="mb-3 align-items-center">
                <Col xs={6} sm={4} md={3}>
                  <Form.Check
                    type="switch"
                    id={day}
                    label={day}
                    checked={daysWithTimes[day].enabled}
                    onChange={() => handleCheckboxChange(day)}
                  />
                </Col>
                <Col xs={6} sm={8} md={9}>
                  <StyledFormControl
                    type="time"
                    value={daysWithTimes[day].time}
                    onChange={(e) => handleDayTimeChange(day, e.target.value)}
                    disabled={!daysWithTimes[day].enabled}
                  />
                </Col>
              </Row>
            ))}
          </Form.Group>
        </StyledForm>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSaveChanges}
          disabled={!isChanged}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSubjectModal;

const StyledForm = styled(Form)`
  max-width: 600px;
  margin: 0 auto;
`;

const StyledFormControl = styled(Form.Control)`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.75rem;
  transition: all 0.2s ease-in-out;

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    border-color: #80bdff;
  }
`;
