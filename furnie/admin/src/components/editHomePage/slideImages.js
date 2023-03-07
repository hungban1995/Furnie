import React, { useCallback, useEffect, useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import { setHomeSlide, setIsEdit, setNotify } from "../../store/Action";
import { connect } from "react-redux";
import { getData } from "../../libs/fetchData";
import { IMG_URL } from "../../constants";
import Modal from "react-bootstrap/Modal";

import "./style.css";
const SlideImages = (props) => {
  const [indexSelect, setIndexSelect] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [images, setImages] = useState([]);
  const [showSelect, setShowSelect] = useState(false);
  const [valueSlide, setValueSlide] = useState(null);
  const getImages = useCallback(async () => {
    try {
      const res = await getData("image-library");
      setImages(res.data.images);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getImages();
  }, [getImages]);
  useEffect(() => {
    setIsEdit(props.isEdit);
    setValueSlide(props.slideImages);
  }, [props.slideImages, props.isEdit]);
  if (!valueSlide) {
    return <div>Loading Edit Slide...</div>;
  }
  const handleSelect = (index) => {
    setShowSelect(true);
    setIndexSelect(index);
  };
  return (
    <div>
      <Formik
        initialValues={{ slideImages: valueSlide }}
        onSubmit={(values) => {
          console.log(values.slideImages);
          props.setSlideImages(values.slideImages);
          props.setIsEdit(true);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <FieldArray name="slideImages">
              {({ insert, remove, push }) => (
                <div
                  className={isEdit ? "d-none" : ""}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {values.slideImages &&
                    values.slideImages.length > 0 &&
                    values.slideImages.map((item, index) => (
                      <div key={index} className="slide-banner">
                        <strong>Slide {index + 1}:</strong>
                        <div className="row">
                          <div
                            className="col form-group"
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <label
                              className="form-label"
                              htmlFor={`slideImages.${index}.image`}
                            >
                              Image:
                            </label>
                            <div
                              style={{
                                width: "100px",
                                height: "60px",
                                margin: "10px",
                              }}
                            >
                              <img
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                alt=""
                                src={`${IMG_URL}${item.image}`}
                              />
                            </div>

                            <button
                              type="button"
                              className="btn btn-outline-dark"
                              onClick={() => {
                                handleSelect(index);
                              }}
                            >
                              Other
                            </button>
                            <Modal
                              show={showSelect}
                              onHide={() => setShowSelect(false)}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Choose image</Modal.Title>
                              </Modal.Header>
                              <Modal.Body className="slide-banner__modal-body-custom">
                                <div className={"list-img-select"}>
                                  <div className="list-img-select__body">
                                    {showSelect && (
                                      <div className="img-select">
                                        {images.map((imageUrl, idx) => (
                                          <div
                                            name={`slideImages[${index}].image`}
                                            key={idx}
                                            className="select-item"
                                            onClick={() => {
                                              setFieldValue(
                                                `slideImages[${indexSelect}].image`,
                                                imageUrl
                                              );
                                              setShowSelect(false);
                                            }}
                                          >
                                            <img
                                              src={`${IMG_URL}${imageUrl}`}
                                              alt=""
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Modal.Body>
                            </Modal>
                          </div>
                          <div className="col row">
                            <div className="col-3 form-group">
                              <label
                                className="form-label"
                                htmlFor={`slideImages.${index}.arrange`}
                              >
                                arrange
                              </label>
                              <Field
                                className="form-control"
                                name={`slideImages.${index}.arrange`}
                                type="number"
                                value={item.arrange}
                              />
                            </div>
                            <div className="col form-group">
                              <label
                                className="form-label"
                                htmlFor={`slideImages.${index}.title`}
                              >
                                Title
                              </label>
                              <Field
                                className="form-control"
                                name={`slideImages.${index}.title`}
                                type="text"
                                value={item.title}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-4 form-group">
                            <label
                              className="form-label"
                              htmlFor={`slideImages.${index}.link`}
                            >
                              link
                            </label>
                            <Field
                              className="form-control"
                              name={`slideImages.${index}.link`}
                              type="text"
                              value={item.link}
                            />
                          </div>
                          <div className="col form-group">
                            <label
                              className="form-label"
                              htmlFor={`slideImages.${index}.description`}
                            >
                              description
                            </label>
                            <Field
                              className="form-control"
                              name={`slideImages.${index}.description`}
                              type="text"
                              value={item.description}
                            />
                          </div>
                        </div>
                        <div
                          className="col form-group mt-2"
                          style={{ textAlign: "center" }}
                        >
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => remove(index)}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary m-auto"
                    onClick={() => {
                      push({
                        image: "",
                        title: "",
                        link: "",
                        description: "",
                        arrange: "",
                      });
                    }}
                  >
                    Add More
                  </button>
                </div>
              )}
            </FieldArray>
            <button
              className={isEdit ? "d-none" : "btn btn-success m-2"}
              type="submit"
            >
              Look Good
            </button>
          </Form>
        )}
      </Formik>
      <button
        className={isEdit ? "btn btn-danger m-2" : "d-none"}
        onClick={() => {
          props.setIsEdit(false);
        }}
      >
        Edit Slide
      </button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    notify: state.NotifyReducer,
    isEdit: state.HomePageManagerReducer.isEdit,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setSlideImages: (slideImages) => {
      dispatch(setHomeSlide(slideImages));
    },
    setIsEdit: (edit) => {
      dispatch(setIsEdit(edit));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SlideImages);
