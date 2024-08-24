import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner, Container, Card, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { capitalizeEveryWord } from "../utils/capitalize";

const TimeTable = () => {
  const [loading, setLoading] = useState(true);
  const [timeTable, setTimeTable] = useState([]);

  const fetchTimeTable = async () => {
    try {
      const res = await axios.get("/api/v1/subject/all");
      setTimeTable(res.data.data);
    } catch (e) {
      console.error(e);
      setTimeTable([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await axios.delete(`/api/v1/subject/${id}`);
        setTimeTable(timeTable.filter((subject) => subject._id !== id));
      } catch (e) {
        console.error("Error deleting subject:", e);
      }
    }
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
      <h3 className="mb-4 text-primary">Your Timetable</h3>
      {timeTable.length > 0 ? (
        <Row>
          {timeTable.map((subject) => (
            <Col key={subject._id} md={4} className="mb-4">
              <Card className="d-flex flex-column" style={{ height: "100%" }}>
                <Card.Header className="bg-primary text-white">
                  {capitalizeEveryWord(subject.subjectTitle)}
                </Card.Header>
                <Card.Body className="flex-grow-1">
                  {subject.timeTable.length > 0 ? (
                    <ul className="list-unstyled">
                      {subject.timeTable.map((item) => (
                        <li key={item._id} className="mb-2">
                          <strong>{item.day}:</strong> {item.time}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No timetable entries available.</p>
                  )}
                </Card.Body>
                <Card.Footer className="d-flex justify-content-end">
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(subject._id)}
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete Subject
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-muted">No timetable data available.</p>
      )}
    </Container>
  );
};

export default TimeTable;
