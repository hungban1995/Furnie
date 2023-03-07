import { connect } from "react-redux";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { PriceVnd } from "../libs/ShowData";
import ChartData from "../components/chart/ChartData";
import {
  AiOutlineForm,
  AiOutlineInbox,
  AiOutlineLineChart,
  AiOutlineUser,
} from "react-icons/ai";
import { MdAttachMoney } from "react-icons/md";
import { useEffect, useState } from "react";
import { getData } from "../libs/fetchData";
import { Link } from "react-router-dom";
const Home = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [ordersSuccess, setOrdersSuccess] = useState([]);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    getData("order")
      .then((res) => {
        setOrders(res.data.orders);
      })
      .catch((err) => console.log(err));
    getData("product")
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.log(err));
    getData("user")
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.log(err));
    getData("post")
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let orderSuccessArray = [];
    orders.forEach((item) => {
      item.status.forEach((status) => {
        if (status.k === "Success" && status.v === true) {
          orderSuccessArray.push(item);
        }
      });
    });
    setOrdersSuccess(orderSuccessArray);
    orderSuccessArray.map((item) => {
      return setSum((s) => item.total + s);
    });
  }, [orders]);

  return (
    <Container className="pt-2">
      <h4 style={{ color: "#2C9FAF" }}>Dashboard:</h4>
      <Row>
        <Col md={8}>
          <p>Order Total:</p>
          <ChartData />
        </Col>
        <Col md={4}>
          <p>All Data:</p>
          <Row xs={1} md={2} className="g-4" style={{ textAlign: "center" }}>
            <Col>
              <Link className="dashboard-link" to="/admin/orders">
                <Card border="0">
                  <Card.Title>
                    <div
                      style={{
                        background: "#20DEFF",
                        borderRadius: "10px",
                        margin: "5px",
                      }}
                    >
                      <AiOutlineLineChart
                        style={{
                          width: "30px",
                          height: "30px",
                        }}
                      />
                    </div>
                  </Card.Title>
                  <Card.Body>
                    <Card.Title>{(orders && orders.length) || 0}</Card.Title>
                    <Card.Text>Orders</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col>
              <Link className="dashboard-link" to="/admin/product">
                <Card border="0">
                  <Card.Title>
                    <div
                      style={{
                        background: "#C9F7F5",
                        borderRadius: "10px",
                        margin: "5px",
                      }}
                    >
                      <AiOutlineInbox
                        style={{
                          width: "30px",
                          height: "30px",
                        }}
                      />
                    </div>
                  </Card.Title>
                  <Card.Body>
                    <Card.Title>
                      {(products && products.length) || 0}
                    </Card.Title>
                    <Card.Text>Products</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col>
              <Link className="dashboard-link" to="/admin/user">
                <Card border="0">
                  <Card.Title>
                    <div
                      style={{
                        background: "#FF7EA5",
                        borderRadius: "10px",
                        margin: "5px",
                      }}
                    >
                      <AiOutlineUser
                        style={{
                          width: "30px",
                          height: "30px",
                        }}
                      />
                    </div>
                  </Card.Title>
                  <Card.Body>
                    <Card.Title>{(users && users.length) || 0}</Card.Title>
                    <Card.Text>Users</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col>
              <Link className="dashboard-link" to="/admin/posts">
                <Card border="0">
                  <Card.Title>
                    <div
                      style={{
                        background: "#C388F6",
                        borderRadius: "10px",
                        margin: "5px",
                      }}
                    >
                      <AiOutlineForm
                        style={{
                          width: "30px",
                          height: "30px",
                        }}
                      />
                    </div>
                  </Card.Title>
                  <Card.Body>
                    <Card.Title>{(posts && posts.length) || 0}</Card.Title>
                    <Card.Text>Posts</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
          <div className="dashboard-item-total">
            <Card border="0" style={{ textAlign: "center" }}>
              <Card.Title>
                <div
                  style={{
                    background: "#26E7A6",
                    borderRadius: "10px",
                    margin: "5px",
                  }}
                >
                  <MdAttachMoney
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                  />
                </div>
              </Card.Title>
              <Card.Body>
                <Card.Title>Total sold:</Card.Title>
                <Card.Text style={{ fontSize: "larger", fontWeight: "bold" }}>
                  {ordersSuccess?.length || 0}
                </Card.Text>
                <Card.Title>Total Revenue:</Card.Title>
                <Card.Text
                  style={{
                    fontSize: "larger",
                    fontWeight: "bold",
                    paddingBottom: "10px",
                  }}
                >
                  {PriceVnd(sum)}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(Home);
