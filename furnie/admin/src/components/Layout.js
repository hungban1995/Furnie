import Header from "./Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Container from "react-bootstrap/Container";
import Menu from "./Navbar";
import NotifyPop from "../components/alert/notify";
import { connect } from "react-redux";
import { postData } from "../libs/fetchData";
import { getUserLogin } from "../store/Action";
const Layout = ({ children, setUserLogin, count }) => {
  return (
    <Container fluid="xl" bg="light">
      <NotifyPop />
      <Row className="layout">
        <Col lg={3} className="header-navbar-custom">
          <Menu />
        </Col>
        <Col lg={9} style={{ background: "#f5f5f5" }}>
          <Header /> {children}
        </Col>
      </Row>
    </Container>
  );
};
const mapStateToProps = (state) => {
  return { count: state.CounterReducer, loading: state.LoadingReducer.loading };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setUserLogin: (user) => dispatch(getUserLogin(user)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Layout);
