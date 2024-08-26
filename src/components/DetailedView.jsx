import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { capitalizeEveryWord } from "../utils/capitalize";
import styled from "styled-components";

ChartJS.register(ArcElement, Tooltip, Legend);

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

const DetailedView = () => {
  const [detailedAttendance, setDetailedAttendance] = useState([]);

  useEffect(() => {
    const fetchDetailedAttendanceData = async () => {
      try {
        const res = await axios.get("/api/v1/attendance/detailed");
        setDetailedAttendance(res.data.data);
      } catch (e) {
        console.error("Error fetching detailed attendance data:", e);
      }
    };
    fetchDetailedAttendanceData();
  }, []);

  const getChartData = (attended, total) => {
    return {
      labels: ["Attended", "Missed"],
      datasets: [
        {
          data: [attended, total - attended],
          backgroundColor: ["#36A2EB", "#FF6384"],
          hoverBackgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += context.parsed + " lectures";
            }
            return label;
          },
        },
      },
    },
  };

  const getCardColor = (percentage) => {
    if (percentage >= 75) return "#d4edda";
    if (percentage >= 60) return "#fff3cd";
    return "#f8d7da";
  };

  return (
    <Container className="my-4">
      <h3 className="mb-4 text-primary">Detailed Attendance View</h3>
      <Row className="d-flex flex-wrap">
        {detailedAttendance.map((subject, index) => (
          <Col key={index} xs={12} md={6} lg={4} className="mb-4">
            <StyledCard
              className="h-100 shadow-sm"
              style={{
                backgroundColor: getCardColor(
                  parseFloat(subject.attendancePercentage)
                ),
              }}
            >
              <Card.Body>
                <Card.Title className="mb-3 text-center">
                  {capitalizeEveryWord(subject.subjectId.subjectTitle)}
                </Card.Title>
                <div style={{ height: "200px" }}>
                  <Pie
                    data={getChartData(
                      subject.totalLecturesAttended,
                      subject.totalLectures
                    )}
                    options={chartOptions}
                  />
                </div>
                <div className="mt-3">
                  <ProgressBar
                    now={parseFloat(subject.attendancePercentage)}
                    label={`${subject.attendancePercentage}%`}
                    variant={
                      parseFloat(subject.attendancePercentage) >= 75
                        ? "success"
                        : "danger"
                    }
                    className="mb-2"
                  />
                  <Card.Text>
                    <IconWrapper>
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-success"
                      />
                    </IconWrapper>
                    <strong>Lectures Attended:</strong>{" "}
                    {subject.totalLecturesAttended}/{subject.totalLectures}
                  </Card.Text>
                  <Card.Text>
                    <IconWrapper>
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-warning"
                      />
                    </IconWrapper>
                    <strong>Lectures Required:</strong>{" "}
                    {subject.lecturesRequiredForNecessaryAttendance}
                  </Card.Text>
                  <Card.Text>
                    <IconWrapper>
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        className="text-info"
                      />
                    </IconWrapper>
                    <strong>Can Skip:</strong> {subject.lecturesCanBeSkipped}
                  </Card.Text>
                </div>
              </Card.Body>
            </StyledCard>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default DetailedView;
