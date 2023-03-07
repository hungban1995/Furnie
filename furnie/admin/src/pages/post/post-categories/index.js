import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { getData } from "../../../libs/fetchData";
import NotifyPop from "../../../components/alert/notify";
import { connect } from "react-redux";
import {
  getModal,
  getPostCategoryUpdate,
  setNotify,
  setPostCategoryCreate,
} from "../../../store/Action";
import UpdateCategoryPost from "./updateCategoryPost";
import CreatePostCategory from "./createPostCategory";
import MessageModal from "../../../components/alert/messageModal";
import { IMG_URL } from "../../../constants";
import { BlankImg } from "../../../images";
function PostCategory(props) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getData("post-category")
      .then((data) => {
        const res = data.data.data;
        setCategories(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.count]);
  const handClickUpdate = (item) => {
    console.log(item.category);
    props.setUpdatePostCategoryReducer({
      category: item.category,
      update: true,
    });
  };
  const handClickDelete = async (item) => {
    console.log(item.category._id);
    props.setModalReducer({
      show: true,
      deletePostCategory: true,
      message: "Do you want to delete this PostCategory",
      id: item.category._id,
    });
  };

  return (
    <div>
      <div style={{ width: "100%", padding: "1.5%" }}>
        <div style={{ textAlign: "center", padding: "1.5%" }}>
          POST CATEGORY MANAGER
        </div>
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
              <th>url</th>
              <th>description</th>
              <th>image</th>
              <th style={{ alignItems: "center", textAlign: "center" }}>
                action
              </th>
            </tr>
          </thead>
          <tbody>
            {categories ? (
              categories.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.category.title}</td>
                    <td>{item.category.url}</td>
                    <td>{item.category.description}</td>
                    <td>
                      <img
                        src={
                          item.category?.image
                            ? `${IMG_URL}/${item.category?.image}`
                            : BlankImg
                        }
                        alt="img"
                        width="50"
                        height="50"
                      />
                    </td>
                    <td>
                      <AiOutlineEdit
                        color="blue"
                        className="me-2"
                        onClick={() => {
                          handClickUpdate(item);
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

      <UpdateCategoryPost />
      <CreatePostCategory />
      <MessageModal />
      <button
        className="btn btn-primary w-100 mt-5"
        onClick={() => {
          props.setCreatePostCategoryReducer(true);
        }}
      >
        NEW POST CATEGORY
      </button>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    notify: state.NotifyReducer,
    modal: state.ModalReducer.modal,
    updatePostCategory: state.PostCategoryReducer.updatePostCategory,
    create: state.PostCategoryReducer.create,
    count: state.CounterReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setCreatePostCategoryReducer: (create) => {
      dispatch(setPostCategoryCreate(create));
    },
    setUpdatePostCategoryReducer: (updatePostCategory) => {
      dispatch(getPostCategoryUpdate(updatePostCategory));
    },
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setModalReducer: (modal) => {
      dispatch(getModal(modal));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PostCategory);
