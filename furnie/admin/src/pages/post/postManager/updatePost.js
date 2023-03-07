import Modal from "react-bootstrap/Modal";

import { Formik } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { connect } from "react-redux";
import { getPostUpdate, setCount, setNotify } from "../../../store/Action";
import React, { useEffect } from "react";
import { getData, patchData } from "../../../libs/fetchData";
function UpdatePost(props) {
  const [postCategory, setPostCategory] = React.useState([]);
  const post = props.updatePost.post;
  console.log(post);
  useEffect(() => {
    getData("post-category")
      .then((data) => {
        const res = data.data.data;
        setPostCategory(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleSubmit = async (values) => {
    const formData = new FormData();
    console.log(values.category);

    if (values.images) {
      const fileList = [...values.images];
      fileList.forEach((item) => {
        formData.append("images", item);
      });
    } else
      post.images.forEach((item) => {
        formData.append("images", item);
      });
    formData.append("title", values.title);
    formData.append("url", values.url);
    formData.append("description", values.description);
    formData.append("content", values.content);
    formData.append("category", JSON.stringify(values.category));

    try {
      const id = post._id;

      const res = await patchData("post/update/" + id, formData);
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
      props.setPostUpdate({ update: false, post: {} });
      props.setCount();
    } catch (error) {
      console.log(error);
      props.setNotifyReducer({
        show: true,
        color: "bg-danger",
        notify: error.response.data.error,
      });
    }
  };

  return (
    <Modal
      size="lg"
      onHide={() => {
        props.setPostUpdate({
          update: false,
          post: {},
        });
      }}
      show={props.updatePost.update}
    >
      <Modal.Header closeButton>
        <Modal.Title>UPDATE POST</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            title: post.title,
            content: post.content,
            description: post.description,
            url: post.url,
            category: post?.category?.map((item) => item._id),
            author: post.author?._id,
          }}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => {
            return (
              <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Group>
                  <Form.Label htmlFor="title">Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="description">Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="files">Images upload</Form.Label>
                  <Form.Control
                    id="file"
                    name="images"
                    type="file"
                    multiple
                    onChange={(event) => {
                      setFieldValue("images", event.currentTarget.files);
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="url">Seo Url</Form.Label>
                  <Form.Control
                    type="text"
                    name="url"
                    value={values.url}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="content">Content</Form.Label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={values.content}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      handleChange({
                        target: { name: "content", value: data },
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="category">Post Category</Form.Label>
                  <div className="checkbox-products">
                    {postCategory &&
                      postCategory.map((category, idx) => {
                        return (
                          <Form.Check
                            defaultChecked={values.category?.includes(
                              category.category._id
                            )}
                            value={category.category._id}
                            type="checkbox"
                            label={category.category.title}
                            name="category"
                            onChange={handleChange}
                            key={idx}
                          />
                        );
                      })}
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="url">
                    Author: {post.author?.username}
                  </Form.Label>
                </Form.Group>
                <Button
                  className="form-control btn btn-primary mt-3"
                  type="submit"
                >
                  Update
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
const mapStateToProps = (state) => {
  return {
    notify: state.NotifyReducer,
    updatePost: state.PostReducer.updatePost,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setPostUpdate: (updatePost) => {
      dispatch(getPostUpdate(updatePost));
    },
    setCount: () => {
      dispatch(setCount());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UpdatePost);
