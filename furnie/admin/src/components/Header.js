import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { getData, postData } from "../libs/fetchData";
import { IMG_URL } from "../constants";

import { connect } from "react-redux";
import { BlankAvatar } from "../images";
import { useEffect, useState } from "react";
import { refreshApp, setLoading } from "../store/Action";

function Header(props) {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    if (localStorage && localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));

      getData(`user/${user._id}`)
        .then((res) => {
          setCurrentUser(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handClick = () => {
    props.setLoading(true);
    props.refreshApp();
    localStorage.clear();
    props.setLoading(false);
  };
  return (
    <Navbar style={{ height: "100px", backgroundColor: "#e7f1ff" }}>
      <Container>
        <Navbar.Brand href="/admin" className="header-navbar-brand">
          <h4>Furine</h4>
        </Navbar.Brand>
        <Nav className="align-items-center">
          <Dropdown>
            <Dropdown.Toggle
              style={{ border: 0, backgroundColor: "unset" }}
              className="d-flex align-items-center"
            >
              <span
                className="me-2"
                style={{ color: "#808080", textTransform: "uppercase" }}
              >
                {currentUser?.username}
              </span>
              <span
                style={{
                  borderRadius: "50%",
                  height: "50px",
                  width: "50px",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src={
                    currentUser && currentUser.avatar
                      ? `${IMG_URL}${currentUser.avatar}`
                      : `${BlankAvatar}`
                  }
                  className="w-100"
                />
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/admin/user/profile">Profile</Dropdown.Item>
              <Dropdown.Item onClick={handClick}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
const mapStateToProps = (state) => {
  return {
    userLogin: state.UserReducer.userLogin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    refreshApp: () => dispatch(refreshApp()),
    setLoading: (loading) => dispatch(setLoading(loading)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
