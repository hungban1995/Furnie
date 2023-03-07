import "./style.css";
import MessageModal from "../../components/alert/messageModal";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import { getData, postData } from "../../libs/fetchData";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import SimpleAttribute from "../../components/attribute/simpleAttribute";
import { connect } from "react-redux";
import {
  getAttribute,
  getAttributeID,
  getModal,
  getProductUpdate,
  setNotify,
  setCount,
} from "../../store/Action";
import DetailAttribute from "../../components/attribute/detailAttribute";
import * as yup from "yup";
import Table from "react-bootstrap/esm/Table";
import { BlankImg } from "../../images";
import { IMG_URL } from "../../constants";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import UpdateProduct from "./edit-product/index";
import { InStock, OnSales, PriceS, PriceVnd, Sold } from "../../libs/ShowData";
const schema = yup.object().shape({
  title: yup.string().required(),
  price: yup.number().min(0),
  onSale: yup.number().min(0),
  inStock: yup.number().min(0),
});
const Product = (props) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const getCategory = useCallback(async () => {
    try {
      const response = await getData("product-category");
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const getProducts = useCallback(async () => {
    try {
      const response = await getData("product");
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getProducts();
    getCategory();
  }, [getCategory, getProducts, props.count]);
  // Edit string
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
  //create product--------------------------
  const handleSubmit = async (values, { resetForm }) => {
    let nameProduct = values.title;
    let url;
    if (!values.url) {
      url = toSlug(nameProduct);
    } else url = values.url;

    let attributes;
    values.simpleProduct
      ? (attributes = props.simpleAttribute)
      : (attributes = props.attributeId);
    const newData = { ...values, attributes, url };
    const formData = new FormData();
    console.log(newData);
    try {
      const fileList = [...newData.images];
      fileList.forEach((item) => {
        formData.append("images", item);
      });
      formData.append("title", newData.title);
      formData.append("sku", newData.sku);
      formData.append("content", newData.content);
      formData.append("description", newData.description);
      formData.append("url", newData.url);
      formData.append("inStock", newData.inStock || 0);
      formData.append("onSale", newData.onSale || 0);
      formData.append("price", newData.price || 0);
      formData.append("category", JSON.stringify(newData.category));
      formData.append("simpleProduct", newData.simpleProduct);
      formData.append("attributes", JSON.stringify(newData.attributes));
      const res = await postData("product/create", formData);
      console.log(res);
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
      props.setCount();
      props.setAttributeId([]);
      console.log(props.AttributeReducer);
      resetForm();
    } catch (error) {
      console.log(error);
      props.setNotifyReducer({
        show: true,
        color: "bg-danger",
        notify: error.response.data.error,
      });
    }
  };
  //-edit----------
  const handClickEdit = (product) => {
    props.setProductUpdate({
      product: product,
      update: true,
    });
  };
  //- delete---
  const handClickDelete = (product) => {
    console.log(product);
    props.setModalReducer({
      show: true,
      deleteProduct: true,
      message: "Do you want to delete this Product",
      id: product._id,
    });
  };

  return (
    <div className="m-2">
      <h2>Products Manager</h2>
      <p>CRUD products</p>
      <Formik
        validationSchema={schema}
        initialValues={{
          title: "",
          price: 0,
          onSale: 0,
          sku: "",
          simpleProduct: true,
          description: "",
          content: "",
          category: [],
          url: "",
          inStock: 0,
          images: [],
        }}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, { resetForm });
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
          const isDisabled = () => {
            let cb;
            !values.simpleProduct && props.attributeId.length === 0
              ? (cb = "You must edit the detailed attribute")
              : (cb = false);
            return cb;
          };
          return (
            <Row>
              <Col lg={8}>
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
                        value={values.inStock}
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
                        <Form.Label htmlFor="images">Images upload</Form.Label>
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
                      data={values.content}
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
                    disabled={isDisabled() || !isValid}
                  >
                    {isDisabled() || "Create Product"}
                  </Button>
                </Form>
              </Col>
              <Col lg={4}>
                {values.simpleProduct ? (
                  <SimpleAttribute />
                ) : (
                  <DetailAttribute />
                )}
              </Col>
            </Row>
          );
        }}
      </Formik>
      <div className="m-3">
        <div
          className="table-responsive"
          style={{ height: "300px", overflow: "auto" }}
        >
          <Table
            className="table-fixed-header"
            striped
            bordered
            hover
            size="sm"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>image</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>onSale</th>
                <th>Sold</th>

                <th style={{ alignItems: "center", textAlign: "center" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products ? (
                products.map((product, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{product.title}</td>
                      <td>
                        <img
                          alt="category-img"
                          src={
                            product.images && product.images.length > 0
                              ? `${IMG_URL}/${product.images[0]}`
                              : BlankImg
                          }
                          style={{
                            width: "100px",
                            height: "100px",
                            margin: "5px",
                          }}
                        />
                      </td>

                      <td style={{ textAlign: "end" }}>
                        {product.simpleProduct
                          ? PriceVnd(product.price)
                          : PriceS(product.attributes)}
                      </td>
                      <td style={{ textAlign: "end" }}>
                        {product.simpleProduct
                          ? product.inStock
                          : InStock(product.attributes)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {product.category &&
                          product.category.map((category, idx) => {
                            return <p key={idx}>{category.title}</p>;
                          })}
                      </td>
                      <td style={{ textAlign: "end" }}>
                        {product.simpleProduct
                          ? PriceVnd(product.onSale)
                          : OnSales(product.attributes)}
                      </td>
                      <td style={{ textAlign: "end" }}>
                        {product.simpleProduct
                          ? product.sold
                          : Sold(product.attributes)}
                      </td>
                      <td style={{ alignItems: "center", textAlign: "center" }}>
                        <AiOutlineEdit
                          fontSize={30}
                          color="blue"
                          className="me-2"
                          onClick={() => {
                            handClickEdit(product);
                          }}
                        />
                        <AiOutlineDelete
                          fontSize={30}
                          className="me-2"
                          onClick={() => {
                            handClickDelete(product);
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
      </div>
      <MessageModal />
      <UpdateProduct />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    simpleAttribute: state.AttributeReducer.simpleAttribute,
    attributeId: state.AttributeReducer.attributeId,
    notify: state.NotifyReducer,
    updateProduct: state.ProductReducer.updateProduct,
    modal: state.ModalReducer.modal,
    count: state.CounterReducer,
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
    setModalReducer: (modal) => {
      dispatch(getModal(modal));
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
export default connect(mapStateToProps, mapDispatchToProps)(Product);
