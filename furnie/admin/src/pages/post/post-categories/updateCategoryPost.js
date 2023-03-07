import Modal from "react-bootstrap/Modal";

import * as yup from "yup";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { connect } from "react-redux";
import {
  getPostCategoryUpdate,
  setNotify,
  setCount,
} from "../../../store/Action";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import { patchData } from "../../../libs/fetchData";
import React from "react";

const schema = yup.object().shape({
  title: yup.string().required(),
});
function UpdateCategoryPost(props) {
  const category = props.updatePostCategory.category;

  const handleSubmit = async (values) => {
    const formData = new FormData();
    console.log(values);
    if (values.image) {
      const fileList = [...values.image];
      fileList.forEach((item) => {
        formData.append("image", item);
      });
    } else formData.append("image", category.image);

    formData.append("title", values.title);
    formData.append("url", values.url);
    formData.append("description", values.description);
    formData.append("content", values.content);
    try {
      const id = category._id;

      const res = await patchData("post-category/update/" + id, formData);
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
      console.log(res);
      props.setUpdatePostCategoryReducer({
        update: false,
        category: {},
      });
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
        props.setUpdatePostCategoryReducer({
          update: false,
          category: {},
        });
      }}
      show={props.updatePostCategory.update}
    >
      <Modal.Header closeButton>
        <Modal.Title>UPDATE CATEGORY</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={schema}
          initialValues={{
            title: category && category.title,
            url: category && category.url,
            content: category && category.content,
            description: category && category.description,
          }}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            setFieldValue,
            errors,
            isValid,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="position-relative mb-3">
                <Form.Label htmlFor="title">Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="url">Seo url</Form.Label>
                <Form.Control
                  type="text"
                  name="url"
                  value={values.url}
                  onChange={handleChange}
                  //disabled
                />
              </Form.Group>
              <div className="form-group">
                <label htmlFor="file">Image upload</label>
                <input
                  id="file"
                  name="image"
                  type="file"
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files);
                  }}
                  className="form-control"
                />
              </div>
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
                <Form.Label htmlFor="description">description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button
                className="form-control btn btn-primary mt-3"
                type="submit"
              >
                Update
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}
const mapStateToProps = (state) => {
  return {
    notify: state.NotifyReducer,
    updatePostCategory: state.PostCategoryReducer.updatePostCategory,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setUpdatePostCategoryReducer: (updatePostCategory) => {
      dispatch(getPostCategoryUpdate(updatePostCategory));
    },
    setCount: () => {
      dispatch(setCount());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UpdateCategoryPost);
