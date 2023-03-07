import Link from "next/link";
import { Col, Container, Nav, Row } from "react-bootstrap";
import { CiFacebook, CiInstagram, CiTwitter, CiYoutube } from "react-icons/ci";
import { AiOutlineCreditCard } from "react-icons/ai";
import { RiVisaLine } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineDeliveryDining } from "react-icons/md";
const style = { textDecoration: "none", marginTop: "10px" };

function Footer() {
  return (
    <footer
      className="border-top mt-3"
      style={{ lineHeight: "20px", backgroundColor: "black", color: "white" }}
    >
      <Container className="mt-3 mb-3">
        <Row>
          <Col>
            <h4>About us</h4>
            <strong>Furnie Company</strong>
            <p>81 Text Street, Text City</p>
            <p>
              <span>Call: </span>
              <span>+8412345678</span>
            </p>
            <p>
              <span>Email: </span>
              <span>demofurine@email.com</span>
            </p>
          </Col>
          <Col>
            <h4>Help</h4>
            <Nav className="flex-column">
              <Link style={style} href={"#"}>
                FAQ
              </Link>
              <Link style={style} href={"#"}>
                Shipping
              </Link>
              <Link style={style} href={"#"}>
                Returns
              </Link>
              <Link style={style} href={"#"}>
                Order Status
              </Link>
              <Link style={style} href={"#"}>
                24/7 Support
              </Link>
            </Nav>
          </Col>
          <Col>
            <h4>Payment And Delivery</h4>
            <span>Payment</span>
            <p style={{ fontSize: "2em" }}>
              <AiOutlineCreditCard /> <RiVisaLine />
            </p>
            <span>Delivery</span>
            <p style={{ fontSize: "2em", color: "white" }}>
              <TbTruckDelivery /> <MdOutlineDeliveryDining />
            </p>
          </Col>
          <Col>
            <h4>Connect with Us</h4>
            <p style={{ fontSize: "2em" }}>
              <Link className="me-3" href={"#"}>
                <CiFacebook />
              </Link>
              <Link className="me-3" href={"#"}>
                <CiTwitter />
              </Link>
              <Link className="me-3" href={"#"}>
                <CiInstagram />
              </Link>
              <Link className="me-3" href={"#"}>
                <CiYoutube />
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
      <div className="text-center p-4" style={{ backgroundColor: "#222222" }}>
        <span style={{ color: "white" }}>© 2023 Copyright: </span>
        <strong style={{ color: "#bab6b6" }}>MERN-24-Team</strong>
      </div>
    </footer>
  );
}
export default Footer;
