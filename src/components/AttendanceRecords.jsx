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
import { capitalizeEveryWord } from "../utils/capitalize";
import { errorToast, successToast } from "../utils/toastMessage";

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

    console.log(lectureData);
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
      <h3 className="mb-4 text-primary">Attendance Records</h3>
      <Row className="d-flex flex-wrap">
        {subjects.map((subject, index) => {
          const todayClass = subject.timeTable.find(
            (item) =>
              item.day ===
              new Date().toLocaleDateString("en-US", { weekday: "long" })
          );
          const isAttendanceMarked = attendanceAdded.some((att) => {
            return att._id === subject._id;
          });

          return (
            <Col
              key={index}
              xs={12}
              md={6}
              className="mb-4 d-flex align-items-stretch"
            >
              <StyledCard className="w-100">
                <Card.Body>
                  <Card.Title className="text-truncate">
                    {capitalizeEveryWord(subject.subjectTitle)}
                  </Card.Title>
                  {todayClass && (
                    <Card.Subtitle className="mb-2 text-muted">
                      <span className="badge bg-success ms-2">Class Today</span>
                    </Card.Subtitle>
                  )}
                  {todayClass && (
                    <Card.Text>
                      <strong>Time:</strong> {todayClass.time}
                    </Card.Text>
                  )}
                  {!isAttendanceMarked ? (
                    <>
                      <Form.Group>
                        <Form.Check
                          type="checkbox"
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
                          type="checkbox"
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
                          <Button
                            className="mt-3"
                            variant="primary"
                            onClick={() => handleSubmit(index)}
                          >
                            Update
                          </Button>
                        )}
                      {submittedAttendance[index] && (
                        <Card.Footer className="text-success">
                          ✅ Attendance Recorded
                        </Card.Footer>
                      )}
                    </>
                  ) : (
                    <Card.Footer className="text-success">
                      ✅ Attendance already updated
                    </Card.Footer>
                  )}
                </Card.Body>
              </StyledCard>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default AttendanceRecords;

const StyledCard = styled(Card)`
  .card-body {
    display: flex;
    flex-direction: column;
    height: 200px; /* Set a fixed height */
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-footer {
    margin-top: auto; /* Pushes the footer to the bottom */
  }
`;
