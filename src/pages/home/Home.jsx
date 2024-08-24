import { Row, Container, Card, Col } from "react-bootstrap";
import Header from "../../components/Header";
import UserAuthProfile from "../../components/UserAuthProfile";
import "./home.css";
import AttendanceTabs from "../../components/AttendanceTabs";

const Home = () => {
  return (
    <>
      <Header />
      <Container className="mt-4">
        <Row className="mb-5">
          <Col md={12} className="text-center">
            <h1>Welcome to Attendance Tracker</h1>
            <p className="lead">
              Track your attendance effortlessly and stay organized with our
              easy-to-use web-app.
            </p>
          </Col>
        </Row>

        <Row className="row-cols-1 row-cols-md-3 g-4 mb-5">
          <Col>
            <Card className="card-shadow">
              <Card.Body>
                <Card.Title>Easy to Use</Card.Title>
                <Card.Text>
                  Our web-app is user-friendly and intuitive, making attendance
                  tracking a breeze.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="card-shadow">
              <Card.Body>
                <Card.Title>Detailed Reports</Card.Title>
                <Card.Text>
                  Get detailed reports and insights on your attendance with just
                  a few clicks.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="card-shadow">
              <Card.Body>
                <Card.Title>Stay Organized</Card.Title>
                <Card.Text>
                  Keep track of your attendance and never miss a class or
                  meeting again.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <AttendanceTabs />
      </Container>
    </>
  );
};

export default Home;
