import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import React, { useEffect } from "react";
import Button from "react-bootstrap/esm/Button";
import { connect } from "react-redux";
import { setNotify, setPostCreate, setCount } from "../../../store/Action";
import { getData, postData } from "../../../libs/fetchData";
import * as yup from "yup";
const schema = yup.object().shape({
  title: yup.string().required(),
});
function CreatePost(props) {
  const [postCategories, setPostCategories] = React.useState([]);

  useEffect(() => {
    getData("post-category")
      .then((data) => {
        const res = data.data.data;
        setPostCategories(res);
        //console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
    const author = props.userLogin._id;
    let namePost = values.title;
    let url;
    if (!values.url) {
      url = toSlug(namePost);
    } else url = values.url;

    const newData = { ...values, author, url };
    console.log(newData);
    const formData = new FormData();
    if (newData.images) {
      const fileList = [...newData.images];
      fileList.forEach((item) => {
        formData.append("images", item);
      });
    }

    formData.append("title", newData.title);
    formData.append("content", newData.content);
    formData.append("description", newData.description);
    formData.append("category", JSON.stringify(newData.category));
    formData.append("author", newData.author);
    formData.append("url", newData.url);

    try {
      const res = await postData("post/create", formData);
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
      props.setPostCreate(false);
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
        props.setPostCreate(false);
      }}
      show={props.create}
    >
      <Modal.Header closeButton>
        <Modal.Title>NEW POST</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={schema}
          initialValues={{
            title: "",
            content: "",
            description: "",
            url: "",
            images: [],
            category: [],
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
            isValid,
            errors,
          }) => (
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
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
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={values.description}
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
                <Form.Label>Post Category</Form.Label>
                <div className="checkbox-products">
                  {postCategories &&
                    postCategories.map((category, idx) => {
                      return (
                        <Form.Check
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
                <Form.Label htmlFor="url">Url</Form.Label>
                <Form.Control
                  type="text"
                  name="url"
                  value={values.url}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button
                className="form-control btn btn-primary mt-3"
                type="submit"
                // disabled={!isValid}
              >
                NEW POST
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
    userLogin: state.UserReducer.userLogin,
    create: state.PostReducer.create,
    notify: state.NotifyReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },

    setPostCreate: (create) => {
      dispatch(setPostCreate(create));
    },
    setCount: () => {
      dispatch(setCount());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);
