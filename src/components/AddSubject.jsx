import {
  faWarning,
  faBookOpen,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import styled from "styled-components";
import { successToast, errorToast } from "../utils/toastMessage";

const StyledCard = styled(Card)`
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled.span`
  margin-right: 8px;
`;

const StyledButton = styled(Button)`
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
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

const AddSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [daysWithTimes, setDaysWithTimes] = useState({
    Monday: { enabled: false, time: "" },
    Tuesday: { enabled: false, time: "" },
    Wednesday: { enabled: false, time: "" },
    Thursday: { enabled: false, time: "" },
    Friday: { enabled: false, time: "" },
    Saturday: { enabled: false, time: "" },
    Sunday: { enabled: false, time: "" },
  });

  const handleDayTimeChange = (day, time) => {
    setDaysWithTimes((prevTimes) => ({
      ...prevTimes,
      [day]: { ...prevTimes[day], time },
    }));
  };

  const handleCheckboxChange = (day) => {
    setDaysWithTimes((prevTimes) => ({
      ...prevTimes,
      [day]: {
        ...prevTimes[day],
        enabled: !prevTimes[day].enabled,
        time: prevTimes[day].enabled ? "" : prevTimes[day].time,
      },
    }));
  };

  const handleSubjectNameChange = (e) => {
    setSubjectName(e.target.value);
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();

    const schedule = Object.entries(daysWithTimes)
      .filter(([day, details]) => details.enabled)
      .map(([day, details]) => ({
        day,
        time: details.time,
      }));

    const newSubject = {
      name: subjectName,
      schedule,
    };

    try {
      await axios.post("/api/v1/subject/add", {
        subject: newSubject,
      });
      successToast("Subject added successfully");
      setSubjects([...subjects, newSubject]);
      setSubjectName("");
      setDaysWithTimes({
        Monday: { enabled: false, time: "" },
        Tuesday: { enabled: false, time: "" },
        Wednesday: { enabled: false, time: "" },
        Thursday: { enabled: false, time: "" },
        Friday: { enabled: false, time: "" },
        Saturday: { enabled: false, time: "" },
        Sunday: { enabled: false, time: "" },
      });
    } catch (error) {
      console.error(error.message);
      if (error.message === "Request failed with status code 409") {
        errorToast("Subject already exists");
      } else if (error.message === "Request failed with status code 400") {
        errorToast("Timetable is clashing with other subject");
      } else {
        errorToast("Error adding the subject. Please try again later!");
      }
    }
  };

  const isAddSubjectDisabled = () => {
    if (!subjectName) return true;
    const anyDayEnabled = Object.values(daysWithTimes).some(
      (day) => day.enabled
    );
    const allEnabledDaysHaveTime = Object.values(daysWithTimes).every(
      (day) => !day.enabled || (day.enabled && day.time)
    );
    return !anyDayEnabled || !allEnabledDaysHaveTime;
  };

  return (
    <Container className="my-4">
      <h3 className="mb-4 text-primary text-center">
        <IconWrapper>
          <FontAwesomeIcon icon={faBookOpen} />
        </IconWrapper>
        Add New Subject
      </h3>
      <StyledCard>
        <Card.Body>
          <Form onSubmit={handleAddSubject}>
            <Form.Group controlId="subjectName" className="mb-4">
              <StyledFormControl
                type="text"
                placeholder="Subject name"
                value={subjectName}
                onChange={handleSubjectNameChange}
              />
            </Form.Group>
            <Form.Group controlId="daysWithTimes">
              <Form.Label className="mb-3 text-muted">
                <IconWrapper>
                  <FontAwesomeIcon icon={faClock} />
                </IconWrapper>
                Schedule
              </Form.Label>
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
            <StyledButton
              variant="primary"
              type="submit"
              className="mt-4 w-100"
              disabled={isAddSubjectDisabled()}
            >
              Add Subject
            </StyledButton>
          </Form>
        </Card.Body>
      </StyledCard>
    </Container>
  );
};

export default AddSubject;
