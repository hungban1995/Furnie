import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import CloseButton from "react-bootstrap/esm/CloseButton";
import { connect } from "react-redux";
import { postData } from "../../../libs/fetchData";
import {
  getAttributeID,
  getAttributeUpdate,
  getModal,
  setNotify,
  setCount,
} from "../../../store/Action";
import * as yup from "yup";
import { Formik } from "formik";
import Table from "react-bootstrap/esm/Table";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import UpdateDetail from "./updateDetail";

import MessageModal from "../../alert/messageModal";
import Notify from "../../alert/notify";
import { PriceVnd } from "../../../libs/ShowData";
const schema = yup.object().shape({
  price: yup.number().min(0),
  onSale: yup.number().min(0),
  inStock: yup.number().min(0),
});
function EditDetailAttribute(props) {
  const attributes = props.updateProduct.product.attributes;
  useEffect(() => {
    const atbId = props.attributeId;
    let item;
    for (item of attributes) {
      atbId.push(item._id);
    }
    props.setAttributeId(atbId);
  }, []);
  const [attribute, setAttribute] = useState([{ k: "", v: "" }]);

  const handleAddAttribute = () => {
    setAttribute([...attribute, { k: "", v: "" }]);
  };
  const handleChangeValue = (e, idx) => {
    const { name, value } = e.target;
    const list = [...attribute];
    list[idx][name] = value;
    setAttribute(list);
  };
  const handleRemoteAttribute = (idx) => {
    const list = [...attribute];
    list.splice(idx, 1);
    setAttribute(list);
  };
  //add new atb
  const handleSubmit = async (values) => {
    const newData = { ...values, values: attribute };
    console.log(newData);
    const formData = new FormData();
    const fileList = [...newData.image];
    fileList.forEach((item) => {
      formData.append("image", item);
    });
    formData.append("sku", newData.sku);
    formData.append("price", newData.price);
    formData.append("onSale", newData.onSale);
    formData.append("inStock", newData.inStock);
    formData.append("values", JSON.stringify(newData.values));

    try {
      const res = await postData("product-attribute/create", formData);
      console.log("create new: ", res);
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
      const atbId = props.attributeId;
      atbId.push(res.data.attribute._id);
      props.setAttributeId(atbId);
      setAttribute([...attribute, formData]);
    } catch (error) {
      console.log(error);
      props.setNotifyReducer({
        show: true,
        color: "bg-danger",
        notify: error.response.data.error,
      });
    }
  };

  const handClickDelete = (attribute) => {
    props.setModalReducer({
      show: true,
      deleteAttribute: true,
      message: "Do you want to delete this Attribute",
      id: attribute._id,
    });
  };
  const handClickEdit = (attribute) => {
    props.setUpdateAttribute({ update: true, attribute: attribute });
  };
  return (
    <div>
      <div>
        <p>Detail Products</p>
        <div
          className="table-responsive"
          style={{ height: "150px", overflow: "auto" }}
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
                <th>price</th>
                <th>onSale</th>
                <th>inStock</th>
                <th style={{ alignItems: "center", textAlign: "center" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {attributes ? (
                attributes.map((attribute, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td style={{ textAlign: "end" }}>
                        {PriceVnd(attribute.price)}
                      </td>
                      <td style={{ textAlign: "end" }}>
                        {PriceVnd(attribute.onSale)}
                      </td>
                      <td>{attribute.inStock || 0}</td>
                      <td style={{ alignItems: "center", textAlign: "center" }}>
                        <AiOutlineEdit
                          fontSize={30}
                          color="blue"
                          className="me-2"
                          onClick={() => {
                            handClickEdit(attribute);
                          }}
                        />
                        <AiOutlineDelete
                          fontSize={30}
                          className="me-2"
                          onClick={() => {
                            handClickDelete(attribute);
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
      <Formik
        validationSchema={schema}
        initialValues={{
          sku: "",
          price: 0,
          onSale: 0,
          inStock: 0,
          image: [],
        }}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({
          handleSubmit,
          handleChange,
          setFieldValue,
          values,
          touched,
          isValid,
          errors,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Label>Add Attribute Detail:</Form.Label>
            <Row>
              <Form.Group as={Col}>
                <Form.Label htmlFor="sku">SKU</Form.Label>
                <Form.Control
                  type="string"
                  name="sku"
                  value={values.sku}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="position-relative mb-3" as={Col}>
                <Form.Label htmlFor="price">Price Detail</Form.Label>
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
            </Row>
            <Row>
              <Form.Group className="position-relative mb-3" as={Col}>
                <Form.Label htmlFor="onSale">onSale Detail</Form.Label>
                <Form.Control
                  type="number"
                  name="onSale"
                  value={values.onSale}
                  onChange={handleChange}
                  isInvalid={!!errors.onSale}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="position-relative mb-3" as={Col}>
                <Form.Label htmlFor="inStock">Stock Detail</Form.Label>
                <Form.Control
                  type="number"
                  name="inStock"
                  value={values.inStock}
                  onChange={handleChange}
                  isInvalid={!!errors.inStock}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
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
              <Form.Label>Value</Form.Label>
              {attribute.map((atb, idx) => {
                return (
                  <div key={idx}>
                    <Row>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Key"
                          name="k"
                          value={atb.k}
                          onChange={(e) => handleChangeValue(e, idx)}
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          placeholder="Value"
                          name="v"
                          value={atb.v}
                          onChange={(e) => handleChangeValue(e, idx)}
                        />
                      </Col>
                      <Col>
                        {attribute.length > 1 && (
                          <CloseButton
                            onClick={() => {
                              handleRemoteAttribute(idx);
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                    {attribute.length - 1 === idx && attribute.length < 5 && (
                      <Button className="mt-2" onClick={handleAddAttribute}>
                        +
                      </Button>
                    )}
                  </div>
                );
              })}
            </Form.Group>
            <Button className="mt-2" type="submit">
              Create Attribute
            </Button>
          </Form>
        )}
      </Formik>
      <UpdateDetail />
      <MessageModal />
      <Notify />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    modal: state.ModalReducer.modal,
    attributeId: state.AttributeReducer.attributeId,
    updateProduct: state.ProductReducer.updateProduct,
    updateAttribute: state.AttributeReducer.updateAttribute,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setAttributeId: (attributeId) => {
      dispatch(getAttributeID(attributeId));
    },
    setUpdateAttribute: (attribute) => {
      dispatch(getAttributeUpdate(attribute));
    },
    setModalReducer: (modal) => {
      dispatch(getModal(modal));
    },
    setCount: () => {
      dispatch(setCount());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDetailAttribute);
