import { BASE_URL } from "@/constants";
import { deleteData, getData, patchData, postData } from "@/libs/fetchData";
import { useState, useCallback, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Popover,
  Row,
} from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { connect } from "react-redux";
import { RiDeleteBin2Line } from "react-icons/ri";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { FcCancel } from "react-icons/fc";
import Link from "next/link";
import Pagination from "react-bootstrap/Pagination";

function Comments(props) {
  const [current_user, set_current_user] = useState({});
  const [editCmt, setEditCmt] = useState({ edit: false, id: "" });
  const [valueEdit, setValueEdit] = useState("");
  const [count, setCount] = useState(null);
  const [apiCount, setApiCount] = useState(null);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState(null);
  const [postId, setPostId] = useState("");
  const [page, setPage] = useState(1);
  const [numberOfPage, setNumberOfPage] = useState(0);
  const [commentsToShow, setCommentsToShow] = useState([]);
  const [limit, setLimit] = useState(4);
  const [pageItems, setPageItems] = useState([]);

  useEffect(() => {
    getData(`api/v1/post-comment?post=${postId}`)
      .then((res) => {
        setApiCount(res.data.commentsCount);
        setComments(res.data.comments);
      })
      .catch(() => setComments(null));
  }, [postId]);
  useEffect(() => {
    setPostId(props.postId);
    set_current_user(props.current_user);
    apiCount ? setCount(apiCount) : setCount(null);
  }, [apiCount, props.postId, props.current_user, comments]);
  useEffect(() => {
    //Get number of page
    const numberOfPage = Math.ceil(count / limit);
    setNumberOfPage(numberOfPage);
  }, [comments, page, count]);
  useEffect(() => {
    //Get comments to show
    const end = page * limit;
    const start = end - limit;
    const commentsToShow = comments && comments.slice(start, end);
    setCommentsToShow(commentsToShow);
  }, [page, comments, count]);
  useEffect(() => {
    //Get page items
    let pageItems = [];
    let i;
    for (i = 0; i < numberOfPage; i++) {
      pageItems.push(i + 1);
    }
    setPageItems(pageItems);
  }, [numberOfPage, comments, count]);
  //Create comment:
  const handleChange = (e) => {
    setContent(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await postData(
        `api/v1/post-comment/create?post=${postId}`,
        { content },
        accessToken
      );
      setCount(count + 1);
      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  };
  //check role

  const checkUser = (user) => {
    const user_comment = user._id;

    if (current_user._id === user_comment || current_user?.role === "admin")
      return true;
    else return false;
  };
  //Edit comment
  const handleEditCmt = (comment) => {
    setEditCmt({ edit: true, id: comment._id });
  };
  const handleChangeCmt = (e) => {
    setValueEdit(e.target.value);
  };
  const handleSubmitCmt = async (e) => {
    e.preventDefault();

    try {
      const res = await patchData(
        `api/v1/post-comment/update/${editCmt.id}`,
        { content: valueEdit },
        accessToken
      );
      setCount(count + 1);
      setEditCmt({ edit: false, id: "" });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  //Delete Comment
  const handleDelete = async (comment) => {
    try {
      const res = await deleteData(
        `api/v1/post-comment/delete/${comment._id}?post=${postId}`,
        accessToken
      );
      console.log(res);
      setCount(count + 1);
    } catch (error) {
      console.log(error);
    }
  };
  if (!comments || !count) return <div>Loading...</div>;
  return (
    <div>
      <h5 style={{ textAlign: "center" }}>{count && count} Comments</h5>
      <div>
        {commentsToShow &&
          commentsToShow.map((comment, idx) => {
            return (
              <Row className="m-0" key={idx}>
                <Col sm={2}>
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      style={{
                        width: "100%",
                        objectFit: "cover",
                      }}
                      src={
                        comment.user.avatar
                          ? `${BASE_URL}/${comment.user.avatar}`
                          : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
                      }
                    />
                  </div>
                </Col>
                <Col sm={10}>
                  <Row>
                    <Col>
                      <p style={{ fontWeight: "bold" }}>
                        {comment.user.username}
                      </p>
                      <span>{comment.createdDate}</span>
                      <br />
                      {editCmt.edit && comment._id === editCmt.id ? (
                        <div>
                          <input
                            name="content"
                            defaultValue={comment.content}
                            onChange={(e) => {
                              handleChangeCmt(e);
                            }}
                          ></input>
                          <AiOutlineCheckSquare
                            style={{ fontSize: "2em", marginRight: "10px" }}
                            onClick={(e) => handleSubmitCmt(e)}
                            className="m-2"
                          />

                          <FcCancel
                            style={{ fontSize: "2em", marginRight: "10px" }}
                            onClick={() => {
                              setEditCmt({ edit: false, id: "" });
                            }}
                          />
                        </div>
                      ) : (
                        <p>{comment.content}</p>
                      )}
                    </Col>
                    <Col xs lg="2">
                      <div>
                        {checkUser(comment.user) && editCmt.edit === false ? (
                          <div>
                            <span
                              style={{ fontSize: "2em", marginRight: "10px" }}
                            >
                              <FiEdit
                                onClick={() => {
                                  handleEditCmt(comment);
                                }}
                              />
                            </span>
                            <OverlayTrigger
                              trigger="click"
                              placement="right"
                              overlay={
                                <Popover id="popover-basic">
                                  <Popover.Header as="h3">
                                    Delete
                                  </Popover.Header>
                                  <Popover.Body>
                                    <p>Do you want delete this comment</p>
                                    <Button
                                      variant="danger"
                                      onClick={() => {
                                        handleDelete(comment);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <span style={{ fontSize: "2em" }}>
                                <RiDeleteBin2Line />
                              </span>
                            </OverlayTrigger>
                          </div>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                </Col>
                <hr />
              </Row>
            );
          })}
        <Pagination
          className={
            "justify-content-center " + (count === 0 ? "d-none" : "d-flex")
          }
        >
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
            disabled={page === numberOfPage ? true : false}
          />
        </Pagination>
      </div>
      {current_user._id ? (
        <div className="text-center">
          <Form className="mt-3" onSubmit={handleSubmit}>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Leave a Reply</Form.Label>
              <Form.Control
                placeholder="Your Comments Here..."
                as="textarea"
                rows={3}
                name="content"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </Form.Group>
            <Button variant="dark" type="submit">
              Add Comment
            </Button>
          </Form>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            margin: "20px",
            fontWeight: "bold",
          }}
        >
          <Link href="/login">
            <Button variant="dark">Login to comment</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return { current_user: state.UserReducer.current_user };
};
const mapDispatchToProps = (dispatch) => {
  return {
    get_notify: (notify) => {
      dispatch(action.getNotify(notify));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Comments);
