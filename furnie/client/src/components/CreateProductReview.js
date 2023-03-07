import ReactStars from "react-stars";
import { connect } from "react-redux";
import { postData } from "../libs/fetchData";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useCallback, useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import * as action from "../store/Action";
import getError from "../libs/getError";
import { CREATE_PRODUCT_REVIEW_URL } from "../constants/index";
import Link from "next/link";

const CreateProductReview = (props) => {
  const [review, setReview] = useState({
    user: "",
    rating: 0,
    comment: "",
    product: "",
  });
  const [isLogin, setIsLogin] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const getOnChangeReview = (rating) => {
    //Get on change review
    setReview({ ...review, rating: rating });
  };
  const getOnchangeComment = (e) => {
    //Get on change comment
    setReview({ ...review, [e.target.name]: e.target.value });
  };
  const onHandleSubmit = async () => {
    try {
      //Handle submit
      review.user = props.currentUser._id;
      const res = await postData(
        `${CREATE_PRODUCT_REVIEW_URL}?product=${props.product}`,
        { review },
        accessToken
      );
      setReview({
        user: "",
        rating: 0,
        comment: "",
        product: "",
      });
      props.resetProductReviewComponent();
      props.getNotify({ success: true, message: "Create review success" });
    } catch (err) {
      console.log("Create product review error: ", err);
      props.getNotify(getError(err));
    }
  };
  const getCurrentProduct = useCallback(() => {
    //Get current product
    if (props.product) {
      setReview({ ...review, product: props.product });
    } else {
      setReview({ ...review, product: "" });
    }
  }, [props.product]);
  const checkIsLogin = useCallback(() => {
    //Check login
    if (localStorage && localStorage.getItem("firstLogin")) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);
  const getAccessToken = useCallback(() => {
    if (localStorage && localStorage.getItem("accessToken")) {
      setAccessToken(JSON.parse(localStorage.getItem("accessToken")));
    } else {
      setAccessToken("");
    }
  }, []);
  const isLoginFalseContent = () => {
    return (
      <>
        <p>
          Please login to review, go to <Link href="/login">Login</Link>
        </p>
      </>
    );
  };
  const isLoginTrueContent = () => {
    return (
      <Form className="product-review__create-form">
        <div className="d-flex align-items-center mb-2 product-review__create-rating">
          <label className="me-2">Review: </label>
          <ReactStars
            count={5}
            size={30}
            value={review.rating || 0}
            onChange={getOnChangeReview}
          />
        </div>
        <FloatingLabel controlId="floatingTextarea2" label="Comments">
          <Form.Control
            as="textarea"
            placeholder="Leave a comment here"
            style={{ height: "100px" }}
            name="comment"
            value={review.comment || ""}
            onChange={getOnchangeComment}
          />
        </FloatingLabel>
        <Button
          variant="primary"
          type="button"
          className="mt-2"
          onClick={onHandleSubmit}
        >
          Submit
        </Button>
      </Form>
    );
  };
  useEffect(() => {
    getCurrentProduct();
    checkIsLogin();
    getAccessToken();
  }, [getCurrentProduct]);
  return (
    <div className="product-review__create mt-5">
      <h4>Create new product review</h4>
      {isLogin ? isLoginTrueContent() : isLoginFalseContent()}
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    currentUser: state.UserReducer.current_user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getNotify: (notify) => {
      dispatch(action.getNotify(notify));
    },
    resetProductReviewComponent: () => {
      dispatch(action.resetProductReviewComponent());
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProductReview);
