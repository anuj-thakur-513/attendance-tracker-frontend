import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import styled from "styled-components";

const AddSubject = () => {
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
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
      setShowError(false);
      setError(null);
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
        setError("Subject already exists");
      } else if (error.message === "Request failed with status code 400") {
        setError("Timetable is clashing with other subject");
      } else {
        setError("Error adding the subject, Please try again later!");
      }
      setShowError(true);
    }
  };

  const isAddSubjectDisabled = () => {
    // Check if the subject name is provided
    if (!subjectName) return true;

    // Check if any day is enabled and all enabled days have a time selected
    const anyDayEnabled = Object.values(daysWithTimes).some(
      (day) => day.enabled
    );
    const allEnabledDaysHaveTime = Object.values(daysWithTimes).every(
      (day) => !day.enabled || (day.enabled && day.time)
    );

    // Return true if no day is enabled or if any enabled day lacks a time
    return !anyDayEnabled || !allEnabledDaysHaveTime;
  };

  return (
    <>
      <h3 className="mb-4 text-primary">New Subject</h3>
      <StyledForm onSubmit={handleAddSubject}>
        <Form.Group controlId="subjectName" className="mb-4">
          <StyledFormControl
            type="text"
            placeholder="Subject name"
            value={subjectName}
            onChange={handleSubjectNameChange}
          />
        </Form.Group>
        {showError && (
          <h4 className="text-danger">
            <FontAwesomeIcon icon={faWarning} /> {error}
          </h4>
        )}
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
        <StyledButton
          variant="primary"
          type="submit"
          className="mt-4 w-100"
          disabled={isAddSubjectDisabled()}
        >
          Add Subject
        </StyledButton>
      </StyledForm>
    </>
  );
};

export default AddSubject;

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

const StyledButton = styled(Button)`
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
