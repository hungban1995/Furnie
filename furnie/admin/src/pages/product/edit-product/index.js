import "../style.css";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";

import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import UpdateSimpleAttribute from "../../../components/attribute/edit-attribute/updateSimpleAttribute";
import { connect } from "react-redux";
import EditDetailAttribute from "../../../components/attribute/edit-attribute/addMoreDetail";
import * as yup from "yup";
import Modal from "react-bootstrap/Modal";
import {
  getAttribute,
  getAttributeID,
  getProductUpdate,
  setNotify,
  setCount,
} from "../../../store/Action";
import { getData, patchData } from "../../../libs/fetchData";

const schema = yup.object().shape({
  title: yup.string().required(),

  price: yup.number().min(0),
  onSale: yup.number().min(0),
  inStock: yup.number().min(0),
});
const UpdateProduct = (props) => {
  const [categories, setCategories] = useState([]);

  const getCategory = useCallback(async () => {
    try {
      const response = await getData("product-category");
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getCategory();
  }, [getCategory]);
  const product = props.updateProduct.product;

  //submit update
  const handleSubmit = async (values) => {
    let attributes = [];
    if (values.simpleProduct) {
      let simpleAttribute = props.simpleAttribute;
      if (simpleAttribute.length > 0) {
        attributes = simpleAttribute;
      } else attributes = product.simpleAttributes;
    } else attributes = props.attributeId;
    const newData = { ...values, attributes };
    console.log(newData);
    try {
      const formData = new FormData();
      if (newData.images) {
        const fileList = [...newData.images];
        fileList.forEach((item) => {
          formData.append("images", item);
        });
      } else
        product.images.forEach((item) => {
          formData.append("images", item);
        });
      formData.append("title", newData.title);
      formData.append("sku", newData.sku);
      formData.append("content", newData.content);
      formData.append("description", newData.description);
      formData.append("url", newData.url);
      formData.append("inStock", newData.inStock);
      formData.append("onSale", newData.onSale);
      formData.append("price", newData.price);
      formData.append("category", JSON.stringify(newData.category));
      formData.append("simpleProduct", newData.simpleProduct);
      formData.append("attributes", JSON.stringify(newData.attributes));
      formData.append(
        "simpleAttributes",
        JSON.stringify(newData.simpleAttributes)
      );

      console.log(formData.getAll("category"));
      const res = await patchData("product/update/" + product._id, formData);
      console.log(res);
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: "Edit success",
      });
      props.setProductUpdate({
        update: false,
        product: {},
      });
      props.setSimpleAttribute([]);
      props.setAttributeId([]);
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
      fullscreen
      onHide={() => {
        props.setSimpleAttribute([]);
        props.setAttributeId([]);
        props.setProductUpdate({
          update: false,
          product: {},
        });
      }}
      show={props.updateProduct.update}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={schema}
          initialValues={{
            title: product.title,
            price: product.price,
            onSale: product.onSale,
            sku: product.sku,
            simpleProduct: product.simpleProduct,
            description: product.description,
            content: product.content,
            category: product.category?.map((item) => item._id),
            url: product.url,
            inStock: product.inStock,
          }}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values);
            resetForm();
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
          }) => {
            return (
              <Row>
                <Col>
                  <Form
                    onSubmit={handleSubmit}
                    className="m-3"
                    encType="multipart/form-data"
                  >
                    <Row className="mt-2">
                      <Form.Group className="position-relative mb-3" as={Col}>
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
                      <Form.Group className="position-relative mb-3" as={Col}>
                        <Form.Check
                          checked={values.simpleProduct}
                          type="switch"
                          label="Simple Product"
                          name="simpleProduct"
                          onChange={handleChange}
                          isInvalid={!!errors.title}
                        />
                      </Form.Group>
                    </Row>
                    <Row className={values.simpleProduct ? "mb-2" : "d-none"}>
                      <Form.Group className="position-relative mb-3" as={Col}>
                        <Form.Label htmlFor="price">Price</Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={values.price}
                          onChange={handleChange}
                          isInvalid={!!errors.price}
                        />
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.price}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="position-relative mb-3" as={Col}>
                        <Form.Label htmlFor="inStock">Stock</Form.Label>
                        <Form.Control
                          type="number"
                          name="inStock"
                          value={values.inStock || 0}
                          onChange={handleChange}
                          isInvalid={!!errors.inStock}
                        />
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.inStock}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="position-relative mb-3" as={Col}>
                        <Form.Label htmlFor="onSale">On Sale</Form.Label>
                        <Form.Control
                          type="number"
                          name="onSale"
                          value={values.onSale}
                          onChange={handleChange}
                          isInvalid={!!errors.onSale}
                        />
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.onSale}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group as={Col}>
                        <Form.Label htmlFor="sku">sku</Form.Label>
                        <Form.Control
                          type="string"
                          name="sku"
                          value={values.sku}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-2">
                      <Form.Group as={Col}>
                        <Form.Label htmlFor="category">
                          Product Category
                        </Form.Label>
                        <div className="checkbox-products">
                          {categories &&
                            categories.map((category, idx) => {
                              return (
                                <Form.Check
                                  defaultChecked={values.category.includes(
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
                      <Col>
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
                          <Form.Label htmlFor="images">
                            Images upload
                          </Form.Label>
                          <Form.Control
                            id="file"
                            name="images"
                            type="file"
                            multiple
                            onChange={(event) => {
                              setFieldValue(
                                "images",
                                event.currentTarget.files
                              );
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
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
                        data={values.content || ""}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          handleChange({
                            target: { name: "content", value: data },
                          });
                        }}
                      />
                    </Form.Group>
                    <Button
                      className="form-control btn btn-primary mt-3"
                      type="submit"
                    >
                      Update Product
                    </Button>
                  </Form>
                </Col>
                <Col className="mt-3">
                  {values.simpleProduct ? (
                    <UpdateSimpleAttribute />
                  ) : (
                    <EditDetailAttribute />
                  )}
                </Col>
              </Row>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};
const mapStateToProps = (state) => {
  return {
    simpleAttribute: state.AttributeReducer.simpleAttribute,
    attributeId: state.AttributeReducer.attributeId,
    notify: state.NotifyReducer,
    updateProduct: state.ProductReducer.updateProduct,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setProductUpdate: (product) => {
      dispatch(getProductUpdate(product));
    },
    setAttributeId: (attributeId) => {
      dispatch(getAttributeID(attributeId));
    },
    setSimpleAttribute: (attribute) => {
      dispatch(getAttribute(attribute));
    },
    setCount: () => {
      dispatch(setCount());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UpdateProduct);
