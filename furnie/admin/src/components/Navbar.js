import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../images/logo.png";
import Accordion from "react-bootstrap/Accordion";
import { Link } from "react-router-dom";
import { FcBullish, FcManager, FcSettings } from "react-icons/fc";
import { IoImages } from "react-icons/io5";
import { TfiWrite } from "react-icons/tfi";
import { FaBoxes } from "react-icons/fa";
import { AiFillDashboard, AiOutlineHome } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
function Menu() {
  return (
    <Navbar
      className="d-flex flex-column"
      collapseOnSelect
      expand="lg"
      variant="dark"
    >
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="flex-column pt-2 navbar-left-menu">
          <Navbar.Brand href="/admin" className="mb-5 navbar-brand-item">
            <img
              style={{
                width: "200px",
                maxWidth: "100%",
              }}
              src={Logo}
              alt="logo"
            />
          </Navbar.Brand>
          <Link to="/admin" className="nav-dashboard">
            <AiFillDashboard
              style={{
                color: " #3399ff",
                width: "20px",
                height: "20px",
                margin: "0 20px 0 20px",
              }}
            />
            <span>Dashboard</span>
          </Link>
          <hr />
          <Accordion
            style={{
              width: "100%",
              maxBlockSize: "100%",
              backgroundColor: "unset",
            }}
            defaultActiveKey="0"
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <FcSettings
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "20px",
                  }}
                />
                <span style={{ fontWeight: "bold" }}>Database Manager</span>
              </Accordion.Header>
              <Accordion.Body className="p-0">
                <Link
                  to="/admin/users"
                  className="d-block p-3 text-decoration-none text-black"
                >
                  <FcManager
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "20px",
                    }}
                  />
                  <span>User Manager</span>
                </Link>
                <Accordion style={{ width: "100%", maxBlockSize: "100%" }}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <FaBoxes
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "20px",
                          color: "##ffcc88",
                        }}
                      />
                      <span>Product Manager</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Link
                        to="/admin/products"
                        className="d-block p-3 text-decoration-none text-black"
                      >
                        Product
                      </Link>
                      <Link
                        to="/admin/product-category"
                        className="d-block p-3 text-decoration-none text-black"
                      >
                        Product Categories
                      </Link>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      <TfiWrite
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "20px",
                          color: "#0099ff",
                        }}
                      />
                      <span>Post Manager</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Link
                        to="/admin/posts"
                        className="d-block p-3 text-decoration-none text-black"
                      >
                        Post
                      </Link>
                      <Link
                        to="/admin/post-categories"
                        className="d-block p-3 text-decoration-none text-black"
                      >
                        Post Categories
                      </Link>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Link
                    to="/admin/orders"
                    className="d-block p-3 text-decoration-none text-black"
                  >
                    <FcBullish
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "20px",
                      }}
                    />
                    <span>Order manager</span>
                  </Link>
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <CgWebsite
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "20px",
                  }}
                />
                <span style={{ fontWeight: "bold" }}>Pages Manager</span>
              </Accordion.Header>
              <Accordion.Body>
                <Link
                  to="/admin/home-page-manager"
                  className="d-block p-2 text-decoration-none text-black"
                >
                  <AiOutlineHome
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "20px",
                    }}
                  />
                  <span style={{ fontWeight: "bold" }}>Home Page</span>
                </Link>
                <Link
                  to="#"
                  className="d-block p-2 text-decoration-none text-black"
                >
                  Another
                </Link>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Menu;
