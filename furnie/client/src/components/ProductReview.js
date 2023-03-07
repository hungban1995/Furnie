import { useEffect, useState, useCallback } from "react";
import ReactStars from "react-stars";
import {
  GET_PRODUCT_REVIEW_BY_PRODUCT_URL,
  BASE_URL,
  UPDATE_PRODUCT_REVIEW,
  DELETE_PRODUCT_REVIEW,
} from "@/constants";
import { getData, patchData, deleteData } from "../libs/fetchData";
import getError from "../libs/getError";
import { connect } from "react-redux";
import * as action from "../store/Action";
import Pagination from "react-bootstrap/Pagination";
import { BsPencilSquare, BsTrash, BsXSquare } from "react-icons/bs";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const productReview = (props) => {
  const [reviews, setReviews] = useState([]);
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(1);
  const [numberOfPage, setNumberOfPage] = useState(0);
  const [count, setCount] = useState(0);
  const [reviewsToShow, setReviewsToShow] = useState([]);
  const [pageItems, setPageItems] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [currentComment, setCurrentComment] = useState("");
  const [currentStars, setCurrentStars] = useState(0);
  const [accessToken, setAccessToken] = useState("");
  const [num, setNum] = useState(0);

  const productReviewActions = (review) => {
    return (
      <div className="product-review-item__actions">
        <BsPencilSquare
          className="actions__item edit"
          title="Edit review"
          onClick={() => onHandleActiveEditForm(review)}
        />
        <BsTrash
          className="actions__item delete"
          title="Delete review"
          onClick={() => handleDeleteReview(review._id)}
        />
      </div>
    );
  };

  const onEditReview = (review) => {
    return (
      <Form className="product-review-item--on-edit shadow">
        <BsXSquare
          className="on-edit--close"
          onClick={() => setIsEdit(false)}
        />
        <div className="d-flex align-items-center mb-2">
          <label className="me-2">Review: </label>
          <ReactStars
            count={5}
            size={24}
            name="stars"
            value={currentStars || 0}
            onChange={getOnChangeStars}
          />
        </div>
        <FloatingLabel controlId="floatingTextarea2" label="Comments">
          <Form.Control
            as="textarea"
            placeholder="Leave a comment here"
            name="comment"
            value={currentComment || ""}
            onChange={getOnchangeComment}
          />
        </FloatingLabel>
        <Button
          variant="primary"
          type="button"
          className="mt-2 w-100"
          onClick={handleUpdateReview}
        >
          Submit
        </Button>
      </Form>
    );
  };

  const onHandleActiveEditForm = (review) => {
    setCurrentId(review._id);
    setIsEdit(true);
    setCurrentComment(review.comment);
    setCurrentStars(review.rating);
  };

  const getOnChangeStars = (e) => {
    setCurrentStars(e);
  };

  const getOnchangeComment = (e) => {
    setCurrentComment(e.target.value);
  };

  const handleUpdateReview = async () => {
    try {
      await patchData(
        `${UPDATE_PRODUCT_REVIEW}/${currentId}`,
        { rating: currentStars, comment: currentComment },
        accessToken
      );
      setNum(num + 1);
      setIsEdit(false);
      props.getNotify({ success: true, message: "Edit review success" });
    } catch (err) {
      props.getNotify(getError(err));
    }
  };
  const handleDeleteReview = async (id) => {
    try {
      await deleteData(`${DELETE_PRODUCT_REVIEW}/${id}`, accessToken);
      props.getNotify({ success: true, message: "Delete review success" });
      setNum(num + 1);
    } catch (err) {
      props.getNotify(getError(err));
    }
  };
  useEffect(() => {
    if (props.product) {
      getData(`${GET_PRODUCT_REVIEW_BY_PRODUCT_URL}?product=${props.product}`)
        .then((res) => {
          setReviews(res.data.reviews);
          setCount(res.data.count);
        })
        .catch(() => {
          setReviews([]);
          setCount(0);
        });
    }
  }, [props.product, props.num, num]);

  useEffect(() => {
    //Get review
    setCurrentUser(props.currentUser);
  }, [props.currentUser]);

  useEffect(() => {
    //Get number of page
    const numberOfPage = Math.ceil(count / limit);
    setNumberOfPage(numberOfPage);
  }, [count, reviews]);
  useEffect(() => {
    //Get page item
    const pageItems = [];
    let i;
    for (i = 0; i < numberOfPage; i++) {
      pageItems.push(i + 1);
    }
    setPageItems(pageItems);
  }, [numberOfPage, reviews]);
  useEffect(() => {
    //Get review to show
    const end = page * limit;
    const start = end - limit;
    const reviewsToShow = reviews.slice(start, end);
    setReviewsToShow(reviewsToShow);
  }, [reviews, page]);
  useEffect(() => {
    //Get accessToken
    if (localStorage && localStorage.getItem("accessToken")) {
      setAccessToken(JSON.parse(localStorage.getItem("accessToken")));
    }
  }, []);
  return (
    <>
      {reviewsToShow && reviewsToShow.length > 0 ? (
        reviewsToShow.map((item, index) => {
          return (
            <div className="product-review-item" key={index}>
              {(Object.keys(currentUser).length > 0 &&
                currentUser._id === item.user._id) ||
              currentUser.role === "admin"
                ? productReviewActions(item)
                : ""}
              <div className="product-review-item__user">
                <div className="user-avatar">
                  <img
                    src={
                      item.user.avatar
                        ? `${BASE_URL}/${item.user.avatar}`
                        : `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png`
                    }
                  />
                </div>
                <div className="user-info">
                  {
                    <ReactStars
                      count={5}
                      value={item.rating || 0}
                      edit={false}
                    />
                  }
                  <p className="username">{item.user.username}</p>
                  <p>{item.user.role}</p>
                  <p className="created-date">{item.createdDate}</p>
                </div>
                {isEdit && currentId === item._id ? onEditReview(item) : ""}
              </div>
              <div className="product-review-item__comment">
                <p>{item.comment}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p>No reviews to display</p>
      )}
      <Pagination className={count === 0 ? "d-none" : "d-flex"}>
        <Pagination.Prev
          onClick={() => setPage(page - 1)}
          disabled={page === 1 ? true : false}
        />
        {pageItems.map((item) => {
          return (
            <Pagination.Item
              key={item}
              active={item === page}
              onClick={() => setPage(item)}
            >
              {item}
            </Pagination.Item>
          );
        })}
        <Pagination.Next
          onClick={() => setPage(page + 1)}
          disabled={page === Math.ceil(count / limit) ? true : false}
        />
      </Pagination>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    num: state.ProductReviewReducer.count,
    currentUser: state.UserReducer.current_user,
  };
};
const mapDisPatchToProps = (dispatch) => {
  return {
    getNotify: (notify) => {
      dispatch(action.getNotify(notify));
    },
  };
};
export default connect(mapStateToProps, mapDisPatchToProps)(productReview);
