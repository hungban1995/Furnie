import React, { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { connect } from "react-redux";
import { setCount, setNotify } from "../../store/Action";
import Form from "react-bootstrap/Form";
import { getData, patchData } from "../../libs/fetchData";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Formik } from "formik";

function ItemSelect(props) {
  const slideImages = props.slideImages;
  const [isEdit, setIsEdit] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [curentCategories, setCurentCategories] = useState([]);
  const [curentPosts, setCurentPosts] = useState([]);
  const [curentProducts, setCurentProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState([]);

  useEffect(() => {
    setIsEdit(props.isEdit);
  }, [props.isEdit]);

  useEffect(() => {
    getData("product-category")
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.log(err));
    getData("product")
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.log(err));
    getData("post")
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setCurrentSlide(props.currentSlide);
    setCurentCategories(props.categories);
    setCurentPosts(props.posts);
    setCurentProducts(props.products);
  }, [props.categories, props.products, props.posts, props.currentSlide]);

  const handleSubmit = async (values) => {
    let newData = {};
    if (slideImages.length > 0) {
      newData = { ...values, slideImages };
    } else newData = { ...values, currentSlide };
    console.log(newData);
    try {
      const res = await patchData(
        "home-page/update/63fc460b39b43192d9af1113",
        newData
      );
      props.setNotifyReducer({
        show: true,
        color: "bg-success",
        notify: res.data.success,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
      props.setNotifyReducer({
        show: true,
        color: "bg-danger",
        notify: error.response.data.error,
      });
    }
  };
  if ((!curentCategories, !curentPosts, !curentProducts, !currentSlide))
    return <div>Loading...</div>;

  return (
    <Formik
      initialValues={{
        categories: curentCategories?.map((item) => item._id),
        products: curentProducts?.map((item) => item._id),
        posts: curentPosts?.map((item) => item._id),
      }}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
    >
      {({ values, handleChange, handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit} className="m-3">
            <Row>
              <Form.Group as={Col}>
                <Form.Label htmlFor="categories">Categories</Form.Label>
                <div className="checkbox-products">
                  {categories &&
                    categories.map((category, idx) => {
                      return (
                        <Form.Check
                          defaultChecked={values.categories?.includes(
                            category.category?._id
                          )}
                          value={category.category?._id}
                          type="checkbox"
                          label={category.category?.title}
                          name="categories"
                          onChange={handleChange}
                          key={idx}
                          disabled={
                            values.categories?.length > 4 &&
                            !values.categories?.includes(category.category?._id)
                          }
                        />
                      );
                    })}
                </div>
                {values.categories?.length > 4 && (
                  <p className="error-message">
                    Only choose 5 item for optimal display!
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label htmlFor="products">Products</Form.Label>
                <div className="checkbox-products">
                  {products &&
                    products.map((product, idx) => {
                      return (
                        <Form.Check
                          defaultChecked={values.products.includes(product._id)}
                          value={product._id}
                          type="checkbox"
                          label={product.title}
                          name="products"
                          onChange={handleChange}
                          key={idx}
                          disabled={
                            values.products?.length > 3 &&
                            !values.products.includes(product._id)
                          }
                        />
                      );
                    })}
                </div>
                {values.products?.length > 3 && (
                  <p className="error-message">
                    Only choose 4 item for optimal display!
                  </p>
                )}
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label htmlFor="posts">Post Recent</Form.Label>
                <div className="checkbox-products">
                  {posts &&
                    posts.map((post, idx) => {
                      return (
                        <Form.Check
                          defaultChecked={values.posts.includes(post.item._id)}
                          value={post.item._id}
                          type="checkbox"
                          label={post.item.title}
                          name="posts"
                          onChange={handleChange}
                          key={idx}
                          disabled={
                            values.posts?.length > 5 &&
                            !values.posts.includes(post.item._id)
                          }
                        />
                      );
                    })}
                </div>
                {values.posts?.length > 5 && (
                  <p className="error-message">
                    Only choose 6 item for optimal display!
                  </p>
                )}
              </Form.Group>
            </Row>
            <Button
              className="form-control btn btn-primary mt-3"
              type="submit"
              disabled={slideImages.length === 0 || isEdit === false}
            >
              {slideImages.length === 0 || isEdit === false
                ? "You must complete edit Slide"
                : "Submit Update"}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}

const mapStateToProps = (state) => {
  return {
    notify: state.NotifyReducer,
    slideImages: state.HomePageManagerReducer.slideImages,
    count: state.CounterReducer,
    isEdit: state.HomePageManagerReducer.isEdit,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setCount: () => {
      dispatch(setCount());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ItemSelect);
