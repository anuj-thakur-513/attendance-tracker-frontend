import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Cookies from "js-cookie";
import axios from "axios";

import "./auth.css";

const Auth = () => {
  const AUTH_COOKIE_OPTIONS = {
    expires: 30, // 30 days
    sameSite: "None",
    path: "/",
  };

  const setAuthCookies = (accessToken, refreshToken) => {
    Cookies.set("accessToken", accessToken, AUTH_COOKIE_OPTIONS);
    Cookies.set("refreshToken", refreshToken, AUTH_COOKIE_OPTIONS);
  };

  const handleLogin = async (googleData) => {
    const res = await axios.post(
      "/api/v1/auth/signup",
      {
        credential: googleData.credential,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res?.data?.data) {
      const { accessToken, refreshToken } = res.data.data;
      setAuthCookies(accessToken, refreshToken);
      window.location.href = "/home";
    }
  };

  return (
    <div className="auth-background">
      <Container className="auth-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={5}>
            <Card className="text-center shadow-lg p-4">
              <Card.Body>
                <Image
                  src="./attendance-tracker-logo.png"
                  className="mb-4"
                  fluid
                />
                <Card.Title className="mb-4">
                  Streamline Your Attendance with Ease
                </Card.Title>
                <Card.Text className="mb-4">
                  Take control of your academic journey with our intuitive
                  Attendance Tracker. Effortlessly monitor your class
                  participation, gain valuable insights through detailed
                  reports, and stay organized like never before.
                </Card.Text>
                <div className="d-flex justify-content-center">
                  <GoogleOAuthProvider clientId="143631438932-62ql0ji2u7pd2cbn4km1kclb3ibdhut1.apps.googleusercontent.com">
                    <GoogleLogin
                      onSuccess={handleLogin}
                      onFailure={handleLogin}
                    />
                  </GoogleOAuthProvider>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auth;
