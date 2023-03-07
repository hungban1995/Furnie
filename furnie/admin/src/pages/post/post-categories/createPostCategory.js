import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import {
  setPostCategoryCreate,
  setNotify,
  setCount,
} from "../../../store/Action";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Button from "react-bootstrap/esm/Button";
import React from "react";
import { postData } from "../../../libs/fetchData";

import * as yup from "yup";
const schema = yup.object().shape({
  title: yup.string().required(),
});
function CreatePostCategory(props) {
  function toSlug(str) {
    str = str.toLowerCase();
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    str = str.replace(/[đĐ]/g, "d");

    str = str.replace(/([^0-9a-z-\s])/g, "");

    str = str.replace(/(\s+)/g, "-");

    str = str.replace(/-+/g, "-");

    str = str.replace(/^-+|-+$/g, "");

    // return
    return str;
  }
  const handleSubmit = async (values) => {
    let namePostCategory = values.title;
    let url;
    if (!values.url) {
      url = toSlug(namePostCategory);
    } else url = values.url;

    const newData = { ...values, url };

    const formData = new FormData();
    console.log(newData);
    const fileList = [...values.image];
    if (values.image) {
      fileList.forEach((item) => {
        formData.append("image", item);
      });
    }

    formData.append("title", newData.title);
    formData.append("url", newData.url);
    formData.append("description", newData.description);
    formData.append("content", newData.content);

    try {
      const res = await postData("post-category/create", formData);
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
      props.setCreatePostCategoryReducer(false);
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
        props.setCreatePostCategoryReducer(false);
      }}
      show={props.create}
    >
      <Modal.Header closeButton>
        <Modal.Title>NEW POST CATEGORY</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={schema}
          initialValues={{
            title: "",
            url: "",
            content: "",
            description: "",
            image: "",
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
            touched,
            isValid,
            errors,
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
                disabled={!isValid}
              >
                New
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
    create: state.PostCategoryReducer.create,
    count: state.CounterReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setCreatePostCategoryReducer: (create) => {
      dispatch(setPostCategoryCreate(create));
    },
    setCount: () => {
      dispatch(setCount());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreatePostCategory);
