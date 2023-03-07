import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/Col";

import Row from "react-bootstrap/Row";
import CloseButton from "react-bootstrap/esm/CloseButton";
import { connect } from "react-redux";
import { postData } from "../../libs/fetchData";
import { getAttributeID, setNotify } from "../../store/Action";

import * as yup from "yup";
import Notify from "../alert/notify";
import { Formik } from "formik";

const schema = yup.object().shape({
  price: yup.number().min(0),
  onSale: yup.number().min(0),
  inStock: yup.number().min(0),
});
function DetailAttribute(props) {
  const [showValue, setShowValue] = useState([]);

  const [attributeId, setAttributeId] = useState([]);
  const [newAttribute, setNewAttribute] = useState(null);
  useEffect(() => {
    setAttributeId(props.attributeId);
  }, [props.attributeId]);

  const [valuesAtb, setValuesAtb] = useState([{ k: "", v: "" }]);
  const handleAddAttribute = () => {
    setValuesAtb([...valuesAtb, { k: "", v: "" }]);
  };
  const handleChangeValue = (e, idx) => {
    const { name, value } = e.target;
    const list = [...valuesAtb];
    list[idx][name] = value;
    setValuesAtb(list);
  };
  const handleRemoteAttribute = (idx) => {
    const list = [...valuesAtb];
    list.splice(idx, 1);
    setValuesAtb(list);
  };
  const handleSubmit = async (values) => {
    const newData = { ...values, values: valuesAtb };
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
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
      console.log(res);
      setNewAttribute(res.data.attribute);
    } catch (error) {
      console.log(error);
      props.setNotifyReducer({
        show: true,
        color: "bg-danger",
        notify: error.response.data.error,
      });
    }
  };
  useEffect(() => {
    if (newAttribute) {
      setAttributeId([...attributeId, newAttribute?._id]);
      setShowValue([...showValue, newAttribute.values]);
    }
  }, [newAttribute]);
  useEffect(() => {
    props.setAttributeId(attributeId);
  }, [attributeId]);
  return (
    <>
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
              <Form.Label>Values:</Form.Label>
              <p style={{ color: "blue" }}>
                User can add size, height, width, color...
              </p>
              {valuesAtb.map((value, idx) => {
                return (
                  <div key={idx}>
                    <Row>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Key"
                          name="k"
                          value={value.k}
                          onChange={(e) => handleChangeValue(e, idx)}
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          placeholder="Value"
                          name="v"
                          value={value.v}
                          onChange={(e) => handleChangeValue(e, idx)}
                        />
                      </Col>
                      <Col>
                        {valuesAtb.length > 1 && (
                          <CloseButton
                            onClick={() => {
                              handleRemoteAttribute(idx);
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                    {valuesAtb.length - 1 === idx && valuesAtb.length < 5 && (
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
            <Notify />
          </Form>
        )}
      </Formik>
      <div>
        {showValue &&
          showValue?.map((item, idx) => {
            return (
              <ul style={{ border: "1px solid" }} key={idx}>
                <span>New Attribute:</span>
                {item.map((atb, i) => {
                  return (
                    <li key={i}>
                      <span>{atb.k}</span> :<span>{atb.v}</span>
                    </li>
                  );
                })}
              </ul>
            );
          })}
      </div>
    </>
  );
}
const mapStateToProps = (state) => {
  console.log(state.AttributeReducer);
  return {
    attributeId: state.AttributeReducer.attributeId,
    notify: state.NotifyReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setAttributeId: (attributeId) => {
      dispatch(getAttributeID(attributeId));
    },
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailAttribute);
