import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/Col";

import Row from "react-bootstrap/Row";
import CloseButton from "react-bootstrap/esm/CloseButton";
import { connect } from "react-redux";
import { getAttribute } from "../../../store/Action";
function UpdateSimpleAttribute(props) {
  const [attributeList, setAttributeList] = useState(null);
  console.log(props.updateProduct.product);
  useEffect(() => {
    if (
      props.updateProduct.update &&
      props.updateProduct.product?.simpleAttributes?.length > 0
    ) {
      setAttributeList(props.updateProduct.product.simpleAttributes);
    } else setAttributeList([{ k: "", v: "" }]);
  }, [props.updateProduct.update]);
  const handleAddAttribute = () => {
    setAttributeList([...attributeList, { k: "", v: "" }]);
  };
  const handleChange = (e, idx) => {
    const { name, value } = e.target;
    const list = [...attributeList];
    list[idx][name] = value;
    setAttributeList(list);
    props.setSimpleAttribute(attributeList);
  };
  const handleRemoteAttribute = (idx) => {
    const list = [...attributeList];
    list.splice(idx, 1);
    setAttributeList(list);
    props.setSimpleAttribute(list);
  };
  return (
    <Form className="mt-2">
      <Form.Label>Attribute</Form.Label>
      {attributeList?.map((attribute, idx) => {
        return (
          <div key={idx}>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Key"
                  name="k"
                  value={attribute.k}
                  onChange={(e) => handleChange(e, idx)}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Value"
                  name="v"
                  value={attribute.v}
                  onChange={(e) => handleChange(e, idx)}
                />
              </Col>
              <Col>
                {attributeList.length > 1 && (
                  <CloseButton
                    onClick={() => {
                      handleRemoteAttribute(idx);
                    }}
                  />
                )}
              </Col>
            </Row>
            {attributeList.length - 1 === idx && attributeList.length < 3 && (
              <Button className="mt-2" onClick={handleAddAttribute}>
                +
              </Button>
            )}
          </div>
        );
      })}
    </Form>
  );
}
const mapStateToProps = (state) => {
  return {
    simpleAttribute: state.AttributeReducer,
    updateProduct: state.ProductReducer.updateProduct,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setSimpleAttribute: (attribute) => {
      dispatch(getAttribute(attribute));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateSimpleAttribute);
