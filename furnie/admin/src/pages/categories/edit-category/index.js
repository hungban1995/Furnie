import React from "react";
import { patchData } from "../../../libs/fetchData";
import Modal from "react-bootstrap/Modal";
import { IMG_URL } from "../../../constants";
import { connect } from "react-redux";
import {
  getProductCategoryUpdate,
  setCount,
  setNotify,
} from "../../../store/Action";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { BlankImg } from "../../../images";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as yup from "yup";

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  username: yup.string().required(),
});

function EditProductCategory(props) {
  const category = props.updateCategory.category;
  const handSubmit = async (values) => {
    const formData = new FormData();

    const id = category._id;
    if (values.image) {
      const fileList = [...values.image];
      fileList.forEach((item) => {
        formData.append("image", item);
      });
    } else formData.append("image", category.image);
    formData.append("title", values.title);
    formData.append("seoUrl", values.url);
    formData.append("description", values.description);
    formData.append("content", values.content);
    try {
      const res = await patchData("product-category/update/" + id, formData);
      props.setUpdateProductCategory({
        update: false,
        category: { _id: "", title: "", description: "", content: "" },
      });
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
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
        props.setUpdateProductCategory({
          update: false,
          category: { _id: "", title: "", description: "", content: "" },
        });
      }}
      show={props.updateCategory.update}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Product Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            title: category.title,
            content: category.content,
            description: category.description,
            url: category.url,
          }}
          onSubmit={(values) => {
            handSubmit(values);
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
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
                <Form.Label htmlFor="file">Image upload</Form.Label>
                <Form.Control
                  id="file"
                  name="image"
                  type="file"
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files);
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
                    handleChange({ target: { name: "content", value: data } });
                  }}
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
    count: state.CounterReducer,
    notify: state.NotifyReducer,
    updateCategory: state.ProductCategoryReducer.updateCategory,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setUpdateProductCategory: (category) => {
      dispatch(getProductCategoryUpdate(category));
    },
    setCount: () => {
      dispatch(setCount());
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProductCategory);
