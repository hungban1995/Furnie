import Container from "react-bootstrap/Container";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BsCheck2Circle } from "react-icons/bs";
import Link from "next/link";
const thankYou = (props) => {
  const router = useRouter();
  const [order, setOrder] = useState({});
  useEffect(() => {
    if (Object.keys(props.order).length === 0) {
      router.push("/shop");
    }
    setOrder(props.order);
  }, [props.order]);
  return (
    <Container>
      <div className="text-center">
        <BsCheck2Circle
          style={{
            width: "200px",
            height: "200px",
          }}
          className="text-success"
        />
        <p>Thank you for your order. We will contact you soon to cofirm</p>
        <p>
          <Link href="/" className="me-2">
            Go back home
          </Link>
          <Link href="/blog" className="me-2">
            Visit our blog
          </Link>
          <Link href="/shop" className="me-2">
            Continue shopping
          </Link>
        </p>
      </div>
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {
    order: state.orderReducer.order,
  };
};
export default connect(mapStateToProps)(thankYou);
