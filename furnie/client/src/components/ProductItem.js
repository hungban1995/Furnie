import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  BsFillCartPlusFill,
  BsArrowRightSquareFill,
  BsFillEyeFill,
} from "react-icons/bs";
import { BASE_URL } from "@/constants";
import { connect } from "react-redux";
import * as action from "../store/Action";
import formatPrice from "../libs/formatPrice";
import { useRouter } from "next/router";

const ProductItem = (props) => {
  //Product state
  const [product, set_product] = useState({});
  const [cart, setCart] = useState([]);

  //Simple product price
  const [simple_product_price, set_simple_product_price] = useState({
    price: 0,
    onSale: 0,
  });

  //Many variation product price
  const [many_variation_product_price, set_many_variation_product_price] =
    useState([]);

  const router = useRouter();

  //Get product
  const get_product = useCallback(() => {
    return new Promise((resolve, reject) => {
      resolve(props.product);
      reject("Have an error when set product");
    });
  }, []);

  //Get price
  const get_price = useCallback((product) => {
    if (product.simpleProduct) {
      if (product.onSale > 0) {
        set_simple_product_price({
          price: product.price,
          onSale: product.onSale,
        });
      } else {
        set_simple_product_price({
          price: product.price,
          onSale: 0,
        });
      }
    } else {
      const price = [];
      product.attributes.map((item) => {
        if (item.price > 0 && item.onSale === 0) {
          price.push(item.price);
        } else {
          if (item.onSale > 0) {
            price.push(item.onSale);
          }
        }
      });
      price.sort((a, b) => {
        return a - b;
      });
      set_many_variation_product_price(price);
    }
  }, []);

  //Render price
  const render_price = (product) => {
    if (product && product.simpleProduct) {
      if (simple_product_price.onSale > 0) {
        return (
          <p>
            <span className="price price--on-sale">
              {formatPrice(simple_product_price.price)}
            </span>
            <span>{formatPrice(simple_product_price.onSale)}</span>
          </p>
        );
      } else {
        return (
          <p>
            <span>{formatPrice(simple_product_price.price)}</span>
          </p>
        );
      }
    }
    if (many_variation_product_price.length > 0) {
      if (
        many_variation_product_price[0] ===
        many_variation_product_price[many_variation_product_price.length - 1]
      ) {
        return (
          <p>
            <span>
              {formatPrice(many_variation_product_price[0])} Many variation
              price
            </span>
          </p>
        );
      }
      return (
        <p>
          <span>
            {`${formatPrice(many_variation_product_price[0])} - ${formatPrice(
              many_variation_product_price[
                many_variation_product_price.length - 1
              ]
            )}`}
          </span>
        </p>
      );
    }
  };

  //Add product to cart
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

    router.push(`/product/${product.url}.${product._id}`);
  };

  //Use effect
  useEffect(() => {
    get_product()
      .then((data) => {
        set_product(data);
        get_price(data);
      })
      .catch((err) => props.get_notify({ error: true, message: err }));
    setCart(props.cart);
  }, []);

  return (
    <Col lg={props.col ? props.col : 4} className="mb-3">
      <Card className="product-item">
        <Card.Header>
          <Link
            href={`/product/${product.url}.${product._id}`}
            className="product-item-image"
          >
            <Card.Img
              variant="top"
              src={
                product && product.images
                  ? `${BASE_URL}/${product.images[0]}`
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
              }
              alt={product && product.title ? product.title : ""}
            />
          </Link>
          <ul>
            <li>
              <Link
                href="#"
                title="Add to cart"
                className={
                  product && product.simpleProduct ? "d-block" : "d-none"
                }
                onClick={() => onHandleAddToCart(product)}
              >
                <BsFillCartPlusFill className="icon" />
              </Link>
            </li>
            <li>
              <Link
                href={`/product/${product.url}.${product._id}`}
                title="Select an option"
                className={
                  product && product.simpleProduct ? "d-none" : "d-block"
                }
              >
                <BsArrowRightSquareFill className="icon" />
              </Link>
            </li>
            <li>
              <Link
                href={`/product/${product.url}.${product._id}`}
                title="View product details"
              >
                <BsFillEyeFill className="icon" />
              </Link>
            </li>
          </ul>
        </Card.Header>
        <Card.Body className="mt-2">
          <Link href={`/product/${product.url}.${product._id}`}>
            <h2>{product && product.title ? product.title : ""}</h2>
          </Link>
          {render_price(product)}
        </Card.Body>
      </Card>
    </Col>
  );
};
const mapStateToProps = (state) => {
  return {
    cart: state.shopping_cart_reducer.cart,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    reset_component: () => {
      dispatch(action.reset_component());
    },
    get_notify: (notify) => {
      dispatch(action.getNotify(notify));
    },
    add_product_to_cart: (product) => {
      dispatch(action.add_product_to_cart(product));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductItem);
