import Head from "next/head";
import Container from "react-bootstrap/Container";
import { connect } from "react-redux";
import * as action from "../../store/Action";
import { getData } from "../../libs/fetchData";
import { useEffect, useState, useCallback } from "react";
import { BASE_URL, GET_PRODUCTS_URL } from "../../constants/index";
import getError from "../../libs/getError";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import formatPrice from "../../libs/formatPrice";
import {
  BsStar,
  BsFillCartPlusFill,
  BsCaretLeftSquareFill,
  BsCaretRightSquareFill,
} from "react-icons/bs";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Link from "next/link";
import ProductReview from "../../components/ProductReview";
import ReactStars from "react-stars";
import CreateProductReview from "@/components/CreateProductReview";
import Error from "@/components/Error";

const product = (props) => {
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [product, setProduct] = useState(null);
  const [imageIndex, setIndex] = useState(0);
  const [attributeIndex, setAttributeIndex] = useState(0);
  const [attributeImage, setAttributeImage] = useState("");
  const [cart, setCart] = useState([]);
  //Set product
  const set_product = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (props.product) {
        resolve(props.product);
      } else {
        reject(JSON.parse(props.err));
      }
    });
  }, []);
  //Render product content
  const render_product_content = () => {
    return { __html: product.content };
  };
  //Simple product
  const simple_product = (product) => {
    if (product.simpleProduct) {
      return (
        <div>
          <p>
            <span
              className={
                "me-2 " + (product.onSale > 0 ? "product-on-sale-active" : "")
              }
            >
              {formatPrice(product.price)}
            </span>
            <span style={{ fontSize: "20px" }}>
              {product.onSale > 0 ? formatPrice(product.onSale) : ""}
            </span>
          </p>
          <p>Product sku: {product.sku}</p>
          <p>
            In stock: {product.inStock > 0 ? product.inStock : "Out of stock"}
          </p>
          {product.simpleAttributes.map((item, index) => {
            return (
              <p key={index}>
                {item.k.charAt(0).toUpperCase() + item.k.slice(1)}:{" "}
                {item.v.charAt(0).toUpperCase() + item.v.slice(1)}
              </p>
            );
          })}
        </div>
      );
    }
  };
  //Many variation product
  const many_variation_product = (product) => {
    if (!product.simpleProduct) {
      if (product.attributes) {
        return (
          <div>
            <p>
              {product.attributes[attributeIndex].onSale > 0 ? (
                <>
                  <span className="me-2 product-on-sale-active">
                    {formatPrice(product.attributes[attributeIndex].price)}
                  </span>
                  <span style={{ fontSize: "20px" }}>
                    {formatPrice(product.attributes[attributeIndex].onSale)}
                  </span>
                </>
              ) : (
                <span className="me-2">
                  {formatPrice(product.attributes[attributeIndex].price)}
                </span>
              )}
            </p>
            <p>SKU: {product.attributes[attributeIndex].sku}</p>
            <p>
              In stock:{" "}
              {product.attributes[attributeIndex].inStock > 0
                ? product.attributes[attributeIndex].inStock
                : "Out of stock"}
            </p>
            {product.attributes[attributeIndex].values.map((item, index) => {
              return (
                <p key={index}>
                  {item.k.charAt(0).toUpperCase() + item.k.slice(1)}:{" "}
                  {item.v.charAt(0).toUpperCase() + item.v.slice(1)}
                </p>
              );
            })}
          </div>
        );
      }
    }
  };
  //Render attributes button
  const attributes_select = (attributes) => {
    if (attributes) {
      return (
        <ul className="attribute-select-button-list">
          {attributes.map((item, index) => {
            return (
              <li className="attribute-select-button-item" key={index}>
                <button
                  onClick={() => {
                    setAttributeIndex(index);
                    setAttributeImage(item.image);
                  }}
                  className={
                    "attribute-select-button " +
                    (index === attributeIndex
                      ? "attribute-select-button--active"
                      : "")
                  }
                  disabled={item.inStock === 0 ? true : false}
                >
                  {item.values.map((value, index) => {
                    return (
                      <span className="me-2" key={index}>
                        {value.v.charAt(0).toUpperCase() + value.v.slice(1)}
                      </span>
                    );
                  })}
                </button>
              </li>
            );
          })}
        </ul>
      );
    }
  };
  //Handle add to cart
  const onHandleAddToCart = (product) => {
    let item = {};
    //Sản phẩm đơn giản
    if (product && product.simpleProduct) {
      if (product.inStock === 0) {
        return props.get_notify({
          error: true,
          message: "Product is out of stock",
        });
      }
      item = {
        product_id: product._id,
        title: product.title,
        sku: product.sku,
        url: product.url,
        price: product.onSale > 0 ? product.onSale : product.price,
        inStock: product.inStock,
        image: product.images[0],
        quantity: 1,
        attribute: product.simpleAttributes
          .map((item) => {
            return item.v;
          })
          .join("-"),
      };
      let maximunQuantity = false;
      cart.forEach((cartItem) => {
        if (cartItem.product_id === item.product_id) {
          if (cartItem.quantity === item.inStock) {
            maximunQuantity = true;
          }
        }
      });
      if (maximunQuantity) {
        return props.get_notify({
          error: true,
          message: "Product quantity is maximun",
        });
      }
      props.add_product_to_cart(item);
      props.reset_component();
      props.get_notify({
        success: true,
        message: `${product.title} added to cart`,
      });
      return;
    }
    //Sản phẩm có nhiều biến thể
    if (product && !product.simpleProduct) {
      if (product.attributes[attributeIndex].inStock === 0) {
        return props.get_notify({
          error: true,
          message: "Product is out of stock",
        });
      }
      item = {
        product_id: product.attributes[attributeIndex].product,
        attribute_id: product.attributes[attributeIndex]._id,
        title: product.title,
        sku: product.attributes[attributeIndex].sku,
        url: product.url,
        inStock: product.attributes[attributeIndex].inStock,
        price:
          product.attributes[attributeIndex].onSale > 0
            ? product.attributes[attributeIndex].onSale
            : product.attributes[attributeIndex].price,
        image: product.attributes[attributeIndex].image,
        quantity: 1,
        attribute: product.attributes[attributeIndex].values
          .map((item) => {
            return item.v;
          })
          .join("-"),
      };
      let maximunQuantity = false;
      cart.forEach((cartItem) => {
        if (
          cartItem.attribute_id === item.attribute_id &&
          cartItem.product_id === item.product_id
        ) {
          if (cartItem.quantity === item.inStock) {
            maximunQuantity = true;
          }
        }
      });
      if (maximunQuantity) {
        return props.get_notify({
          error: true,
          message: "Product is maximun quantity",
        });
      }
      props.reset_component();
      props.add_product_to_cart(item);
      props.get_notify({
        success: true,
        message: `${product.title} added to cart`,
      });

      return;
    }
  };
  const handleChangeImage = (num, images) => {
    if (num === 1) {
      setIndex(imageIndex + 1);
      setAttributeImage("");
      if (imageIndex === images.length - 1) {
        setIndex(0);
      }
      return;
    }
    if (num === 2) {
      setIndex(imageIndex - 1);
      setAttributeImage("");
      if (imageIndex === 0) {
        setIndex(images.length - 1);
      }
      return;
    }
  };
  //Use effect
  useEffect(() => {
    set_product()
      .then((data) => setProduct(data))
      .catch((err) => props.get_notify(getError(err)));
    setCart(props.cart);
  }, [set_product, props.cart]);

  useEffect(() => {
    setTimeout(() => {
      setIsTimeOut(true);
    }, 10000);
  }, []);

  if (!product && !isTimeOut) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }
  if (!product && isTimeOut)
    return (
      <Container>
        <Error status="404" message="Not Found" />
      </Container>
    );

  return (
    <>
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.description} />
      </Head>
      <Container>
        <Breadcrumb className="breadcrumb-custom">
          <Link href="/" className="breadcrumb-item">
            Home
          </Link>
          <Link href="/shop" className="breadcrumb-item">
            Shop
          </Link>
          <Breadcrumb.Item active>{product.title}</Breadcrumb.Item>
        </Breadcrumb>
        <Row className="product">
          <Col lg={5}>
            <div className="product-feature-image">
              <BsCaretLeftSquareFill
                className="icon icon--left"
                onClick={() => handleChangeImage(2, product.images)}
              />
              <img
                src={
                  attributeImage
                    ? `${BASE_URL}/${attributeImage}`
                    : product && product.images
                    ? `${BASE_URL}/${product.images[imageIndex]}`
                    : ""
                }
                className="product-image"
              />
              <BsCaretRightSquareFill
                className="icon icon--right"
                onClick={() => handleChangeImage(1, product.images)}
              />
            </div>
            <ul className="product-image-list d-flex align-items-center flex-wrap ps-0">
              {product && product.images
                ? product.images.map((item, index) => {
                    return (
                      <li key={index} className="product-image-item mt-1">
                        <img
                          className={
                            imageIndex === index ? "product-image-active" : ""
                          }
                          src={`${BASE_URL}/${item}`}
                          style={{ width: "100px", cursor: "pointer" }}
                          onClick={() => {
                            setIndex(index);
                            setAttributeImage("");
                          }}
                        />
                      </li>
                    );
                  })
                : ""}
            </ul>
          </Col>
          <Col lg={7}>
            <h1>{product.title}</h1>
            {product && product.simpleProduct
              ? simple_product(product)
              : product.attributes
              ? many_variation_product(product)
              : ""}
            {product && !product.simpleProduct ? (
              <p className="mb-0">Select an option:</p>
            ) : (
              ""
            )}
            {product && !product.simpleProduct
              ? attributes_select(product.attributes)
              : ""}
            <ReactStars
              count={5}
              value={product.averageRating}
              size={30}
              edit={false}
              color2={"#ffd700"}
            />{" "}
            <button
              onClick={() => onHandleAddToCart(product)}
              className="add-to-cart-btn mt-2"
            >
              <BsFillCartPlusFill className="icon" /> <span>Add to cart</span>
            </button>
          </Col>
        </Row>
        <Tabs
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab
            eventKey="home"
            title="Content"
            dangerouslySetInnerHTML={render_product_content()}
          ></Tab>
          <Tab eventKey="profile" title="Review">
            <ProductReview product={product._id} />
            <CreateProductReview product={product._id} />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};
export const getServerSideProps = async (req) => {
  try {
    const params = req.query.id[0].split(".");
    const url = params[0];
    const id = params[1];
    const res = await getData(`${GET_PRODUCTS_URL}/${url}.${id}`);
    return {
      props: {
        product: res.data.product,
      },
    };
  } catch (err) {
    return {
      props: {
        error: JSON.stringify(err),
      },
    };
  }
};
export const mapStateToProps = (state) => {
  return {
    cart: state.shopping_cart_reducer.cart,
  };
};
export const mapDispathToProps = (dispatch) => {
  return {
    get_notify: (notify) => {
      dispatch(action.getNotify(notify));
    },
    add_product_to_cart: (product) => {
      dispatch(action.add_product_to_cart(product));
    },
    reset_component: () => {
      dispatch(action.reset_component());
    },
  };
};
export default connect(mapStateToProps, mapDispathToProps)(product);
