import { useCallback, useEffect, useState } from "react";
import { getData } from "../../../libs/fetchData";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Table from "react-bootstrap/esm/Table";
import NotifyPop from "../../../components/alert/notify";
import { connect } from "react-redux";
import { IMG_URL } from "../../../constants";
import {
  getModal,
  getPostUpdate,
  setNotify,
  setPostCreate,
} from "../../../store/Action";
import CreatePost from "./createPost";
import UpdatePost from "./updatePost";
import MessageModal from "../../../components/alert/messageModal";
import { BlankImg } from "../../../images";
function PostManager(props) {
  const [posts, setPosts] = useState([]);

  const getPost = useCallback(async () => {
    try {
      const res = await getData("post");
      console.log(res);
      setPosts(res.data.posts);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getPost();
  }, [getPost, props.count]);

  const handleClickUpdate = (item) => {
    props.setPostUpdate({
      post: item.item,
      update: true,
    });
  };
  const handClickDelete = (item) => {
    console.log(item.item._id);
    props.setModalReducer({
      show: true,
      deletePost: true,
      message: "Do you want to delete this Post",
      id: item.item._id,
    });
  };

  return (
    <div>
      <div style={{ width: "100%", padding: "1.5%" }}>
        <div style={{ textAlign: "center", padding: "20px" }}>POST MANAGER</div>
        <div style={{ textAlign: "center" }}>
          this page create,update and delete
        </div>
      </div>
      <div
        className="table-responsive"
        style={{ height: "300px", overflow: "auto" }}
      >
        <Table className="table-fixed-header" bordered hover size="sm">
          <thead>
            <tr>
              <th>title</th>
              <th> Url</th>
              <th>image</th>
              <th>CreateDate</th>
              <th>Author</th>
              <th style={{ alignItems: "center", textAlign: "center" }}>
                action
              </th>
            </tr>
          </thead>
          <tbody>
            {posts ? (
              posts.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.item.title}</td>
                    <td>{item.item.url}</td>

                    <td>
                      <img
                        src={
                          item.item.images.length > 0 && item.item.images[0]
                            ? `${IMG_URL}${item.item.images[0]}`
                            : BlankImg
                        }
                        alt="images"
                        width="50"
                        height="50"
                      />
                    </td>
                    <td>{item.item.createDate}</td>
                    <td>{item.item.author?.username}</td>
                    <td>
                      <AiOutlineEdit
                        color="blue"
                        className="me-2"
                        onClick={() => {
                          handleClickUpdate(item);
                        }}
                      />
                      <AiOutlineDelete
                        onClick={() => {
                          handClickDelete(item);
                        }}
                        color="red"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>Empty data...!</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <button
        className="btn btn-primary w-100 mt-2"
        onClick={() => {
          props.setPostCreate(true);
        }}
      >
        NEW POST
      </button>
      <CreatePost />
      <UpdatePost />
      <MessageModal />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    count: state.CounterReducer,
    notify: state.NotifyReducer,
    modal: state.ModalReducer.modal,
    updatePost: state.PostReducer.updatePost,
    create: state.PostCreate,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setPostCreate: (create) => {
      dispatch(setPostCreate(create));
    },
    setPostUpdate: (updatePost) => {
      dispatch(getPostUpdate(updatePost));
    },
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setModalReducer: (modal) => {
      dispatch(getModal(modal));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PostManager);
