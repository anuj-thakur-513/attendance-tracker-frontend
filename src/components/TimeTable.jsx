import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Spinner,
  Container,
  Card,
  Row,
  Col,
  Button,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faBookOpen,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { capitalizeEveryWord } from "../utils/capitalize";
import EditSubjectModal from "./EditSubjectModal";
import { successToast } from "../utils/toastMessage";
import styled from "styled-components";

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

const TodayClassesCard = styled(StyledCard)`
  .card-header {
    background-color: #007bff;
    color: white;
  }

  .badge {
    font-size: 0.9rem;
  }

  .list-unstyled li {
    border-bottom: 1px solid #e0e0e0;
    padding: 0.5rem 0;
    &:last-child {
      border-bottom: none;
    }
  }
`;

const TimeTable = () => {
  const [loading, setLoading] = useState(true);
  const [timeTable, setTimeTable] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [todayClasses, setTodayClasses] = useState([]);

  const fetchTimeTable = async () => {
    try {
      const res = await axios.get("/api/v1/subject/all", {
        headers: {
          "Access-Token": Cookies.get("accessToken"),
          "Refresh-Token": Cookies.get("refreshToken"),
        },
      });
      setTimeTable(res.data.data);
      filterTodayClasses(res.data.data);
    } catch (e) {
      console.error(e);
      setTimeTable([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTodayClasses = (data) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const classesToday = data.flatMap((subject) =>
      subject.timeTable
        .filter((item) => item.day === today)
        .map((item) => ({
          subjectTitle: subject.subjectTitle,
          time: item.time,
        }))
    );
    const sortedClasses = classesToday.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.time}:00`);
      const timeB = new Date(`1970-01-01T${b.time}:00`);
      return timeA - timeB;
    });
    setTodayClasses(sortedClasses);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await axios.delete(`/api/v1/subject/${id}`, {
          headers: {
            "Access-Token": Cookies.get("accessToken"),
            "Refresh-Token": Cookies.get("refreshToken"),
          },
        });
        successToast("Subject deleted successfully");
        setTimeTable(timeTable.filter((subject) => subject._id !== id));
        fetchTimeTable();
      } catch (e) {
        console.error("Error deleting subject:", e);
      }
    }
  };

  const handleEdit = (subject) => {
    setCurrentSubject(subject);
    setShowEditModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setCurrentSubject(null);
  };

  useEffect(() => {
    fetchTimeTable();
  }, []);

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
      <h3 className="mb-4 text-primary text-center">Your Subjects</h3>
      {timeTable.length > 0 ? (
        <Row>
          {timeTable.map((subject) => (
            <Col
              key={subject._id}
              xs={12}
              sm={6}
              md={6}
              lg={4}
              className="mb-4"
            >
              <StyledCard className="d-flex flex-column h-100">
                <Card.Header className="bg-primary text-white text-center">
                  <IconWrapper>
                    <FontAwesomeIcon icon={faBookOpen} />
                  </IconWrapper>
                  {capitalizeEveryWord(subject.subjectTitle)}
                </Card.Header>
                <Card.Body className="flex-grow-1">
                  {subject.timeTable.length > 0 ? (
                    <ul className="list-unstyled">
                      {subject.timeTable.map((item) => (
                        <li key={item._id} className="mb-2">
                          <IconWrapper>
                            <FontAwesomeIcon
                              icon={faClock}
                              className="text-muted"
                            />
                          </IconWrapper>
                          <strong>{item.day}:</strong> {item.time}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-muted">
                      No timetable entries available.
                    </p>
                  )}
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
                  <Button
                    variant="outline-warning"
                    onClick={() => handleEdit(subject)}
                    title="Edit"
                    className="w-100 me-2"
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDelete(subject._id)}
                    title="Delete"
                    className="w-100"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </Button>
                </Card.Footer>
              </StyledCard>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-muted text-center">
          No subjects found. Maybe it's a day off? 🎉
        </p>
      )}
      {todayClasses.length > 0 ? (
        <TodayClassesCard className="mt-4">
          <Card.Header>
            <IconWrapper>
              <FontAwesomeIcon icon={faBookOpen} />
            </IconWrapper>
            Classes Today
          </Card.Header>
          <Card.Body>
            <ul className="list-unstyled">
              {todayClasses.map((cls, index) => (
                <li
                  key={index}
                  className="mb-2 d-flex justify-content-between align-items-center"
                >
                  <div className="text-truncate">
                    <IconWrapper>
                      <FontAwesomeIcon
                        icon={faBookOpen}
                        className="text-primary"
                      />
                    </IconWrapper>
                    <strong>{capitalizeEveryWord(cls.subjectTitle)}</strong>
                  </div>
                  <Badge bg="success" className="ms-2">
                    <IconWrapper>
                      <FontAwesomeIcon icon={faClock} />
                    </IconWrapper>
                    {cls.time}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card.Body>
        </TodayClassesCard>
      ) : (
        <h5 className="text-center mt-4 text-muted">
          No classes today. Time to relax and enjoy your free day! 🎉
        </h5>
      )}
      {showEditModal && (
        <EditSubjectModal
          subject={currentSubject}
          show={showEditModal}
          onClose={handleModalClose}
          onSubjectUpdate={fetchTimeTable}
        />
      )}
    </Container>
  );
};

export default TimeTable;
