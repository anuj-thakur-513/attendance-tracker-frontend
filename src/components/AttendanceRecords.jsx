import axios from "axios";
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faClock,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { capitalizeEveryWord } from "../utils/capitalize";
import { errorToast, successToast } from "../utils/toastMessage";

const StyledCard = styled(Card)`
  transition: all 0.3s ease-in-out;
  height: 100%;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .card-body {
    display: flex;
    flex-direction: column;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .card-footer {
    margin-top: auto;
    background-color: transparent;
    border-top: none;
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

const AttendanceRecords = () => {
  const [loading, setLoading] = useState(true);
  const [attendanceAdded, setAttendanceAdded] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [submittedAttendance, setSubmittedAttendance] = useState({});

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const date = new Date().toLocaleDateString();
        const res = await axios.get(`/api/v1/attendance/today?date=${date}`);
        const { attendanceAdded, subjects } = res.data.data;
        setAttendanceAdded(attendanceAdded);
        setSubjects(subjects);
      } catch (e) {
        console.error("Error fetching attendance data:", e);
        setAttendanceAdded([]);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const handleAttendanceChange = (index, type, value) => {
    setAttendance((prev) => ({
      ...prev,
      [`${index}-${type}`]: value,
    }));
  };

  const handleSubmit = async (index) => {
    const lectureData = {
      subjectId: subjects[index]._id,
      date: new Date().toLocaleDateString(),
      happened: attendance[`${index}-happened`],
      attended: attendance[`${index}-attended`] || false,
    };

    try {
      await axios.post(`/api/v1/attendance/${lectureData.subjectId}`, {
        lectureData,
      });
      setSubmittedAttendance((prev) => ({
        ...prev,
        [index]: true,
      }));
      successToast("Attendance updated successfully!");
    } catch (e) {
      console.error("Error submitting attendance:", e);
      errorToast("Error updating the attendance!");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h3 className="mb-4 text-primary text-center">
        <IconWrapper>
          <FontAwesomeIcon icon={faCalendarCheck} />
        </IconWrapper>
        Attendance Records
      </h3>
      <Row className="d-flex flex-wrap">
        {subjects.map((subject, index) => {
          const todayClass = subject.timeTable.find(
            (item) =>
              item.day ===
              new Date().toLocaleDateString("en-US", { weekday: "long" })
          );
          const isAttendanceMarked = attendanceAdded.some(
            (att) => att._id === subject._id
          );

          return (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <StyledCard>
                <Card.Body>
                  <Card.Title className="text-truncate">
                    <IconWrapper>
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-primary"
                      />
                    </IconWrapper>
                    {capitalizeEveryWord(subject.subjectTitle)}
                  </Card.Title>
                  {todayClass && (
                    <>
                      <Card.Subtitle className="mb-2 text-success">
                        <IconWrapper>
                          <FontAwesomeIcon icon={faClock} />
                        </IconWrapper>
                        Class Today at {todayClass.time}
                      </Card.Subtitle>
                    </>
                  )}
                  {!isAttendanceMarked ? (
                    <>
                      <Form.Group>
                        <Form.Check
                          type="switch"
                          id={`happened-${index}`}
                          label="Class happened today"
                          onChange={(e) =>
                            handleAttendanceChange(
                              index,
                              "happened",
                              e.target.checked
                            )
                          }
                        />
                        <Form.Check
                          type="switch"
                          id={`attended-${index}`}
                          label="Attended"
                          disabled={!attendance[`${index}-happened`]}
                          onChange={(e) =>
                            handleAttendanceChange(
                              index,
                              "attended",
                              e.target.checked
                            )
                          }
                        />
                      </Form.Group>
                      {attendance[`${index}-happened`] &&
                        !submittedAttendance[index] && (
                          <StyledButton
                            className="mt-3"
                            variant="outline-primary"
                            onClick={() => handleSubmit(index)}
                          >
                            Update
                          </StyledButton>
                        )}
                    </>
                  ) : null}
                </Card.Body>
                <Card.Footer
                  className={
                    isAttendanceMarked || submittedAttendance[index]
                      ? "text-success"
                      : ""
                  }
                >
                  {isAttendanceMarked || submittedAttendance[index] ? (
                    <>
                      <IconWrapper>
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </IconWrapper>
                      Attendance Recorded
                    </>
                  ) : null}
                </Card.Footer>
              </StyledCard>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default AttendanceRecords;
