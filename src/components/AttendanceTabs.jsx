import { useState } from "react";
import { Row, Col, Tabs, Tab } from "react-bootstrap";
import styled from "styled-components";
import AddSubject from "./AddSubject";
import TimeTable from "./TimeTable";
import AttendanceRecords from "./AttendanceRecords";
import DetailedView from "./DetailedView";

const AttendanceTabs = () => {
  const [activeTab, setActiveTab] = useState("addSubject");

  return (
    <Row className="justify-content-center">
      <Col md={10} lg={11}>
        <StyledTabs
          defaultActiveKey="addSubject"
          id="attendance-tabs"
          className="mb-4"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
        >
          <Tab eventKey="addSubject" title="Add Subject">
            <StyledTabContent>
              {activeTab === "addSubject" && <AddSubject />}
            </StyledTabContent>
          </Tab>
          <Tab eventKey="manageAttendance" title="Manage Attendance">
            <StyledTabContent>
              {activeTab === "manageAttendance" && <AttendanceRecords />}
            </StyledTabContent>
          </Tab>
          <Tab eventKey="timeTable" title="Timetable">
            <StyledTabContent>
              {activeTab === "timeTable" && <TimeTable />}
            </StyledTabContent>
          </Tab>
          <Tab eventKey="detailedView" title="Detailed View">
            <StyledTabContent>
              {activeTab === "detailedView" && <DetailedView />}
            </StyledTabContent>
          </Tab>
        </StyledTabs>
      </Col>
    </Row>
  );
};

export default AttendanceTabs;

const StyledTabs = styled(Tabs)`
  .nav-link {
    color: #6c757d;
    &.active {
      color: #007bff;
      font-weight: 600;
    }
  }
`;

const StyledTabContent = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
  padding: 2rem;
`;
