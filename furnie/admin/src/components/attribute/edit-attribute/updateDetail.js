import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import CloseButton from "react-bootstrap/esm/CloseButton";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { patchData } from "../../../libs/fetchData";
import {
  getAttributeID,
  getAttributeUpdate,
  setNotify,
} from "../../../store/Action";
import * as yup from "yup";
import { Formik } from "formik";
const schema = yup.object().shape({
  price: yup.number().min(0),
  onSale: yup.number().min(0),
  inStock: yup.number().min(0),
});

function UpdateDetail(props) {
  const valueUpdate = props.updateAttribute.attribute;
  const [attribute, setAttribute] = useState([]);
  useEffect(() => {
    if (props.updateAttribute.attribute.values) {
      setAttribute(props.updateAttribute.attribute.values);
    }
  }, [props.updateAttribute.update]);

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

  const handleSubmit = async (values) => {
    const newData = { ...values, attribute };
    console.log(newData);
    const formData = new FormData();

    if (newData.image) {
      const fileList = [...newData.image];
      fileList.forEach((item) => {
        formData.append("image", item);
      });
    }
    formData.append("image", valueUpdate.image);
    formData.append("sku", newData.sku);
    formData.append("price", newData.price);
    formData.append("onSale", newData.onSale);
    formData.append("inStock", newData.inStock);
    formData.append("values", JSON.stringify(newData.attribute));
    const id = valueUpdate._id;

    try {
      const res = await patchData("product-attribute/update/" + id, formData);
      console.log(res);
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
      props.setUpdateAttribute({
        update: false,
        attribute: {},
      });
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
      style={{ backgroundColor: " rgb(128, 128, 128, 0.5)" }}
      backdrop="static"
      size="lg"
      onHide={() => {
        props.setUpdateAttribute({
          update: false,
          attribute: {},
        });
      }}
      show={props.updateAttribute.update}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Product Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={schema}
          initialValues={{
            sku: valueUpdate.sku,
            price: valueUpdate.price,
            onSale: valueUpdate.onSale,
            inStock: valueUpdate.inStock,
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
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              <Form.Label>Update Attribute Detail:</Form.Label>
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
              <Row>
                <Form.Group as={Col}>
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
              </Row>

              <Form.Group>
                <Form.Label>Value</Form.Label>
                {attribute &&
                  attribute.map((atb, idx) => {
                    return (
                      <div key={idx} className="mb-2">
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
                        {attribute.length - 1 === idx &&
                          attribute.length < 5 && (
                            <Button
                              className="mt-2"
                              onClick={handleAddAttribute}
                            >
                              +
                            </Button>
                          )}
                      </div>
                    );
                  })}
              </Form.Group>
              <Button className="mt-2" type="submit">
                Update Attribute
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateDetail);
