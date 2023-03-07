import Container from "react-bootstrap/Container";
import * as action from "../../store/Action";
import { connect } from "react-redux";
import { getData } from "../../libs/fetchData";
import { GET_PRODUCTS_URL, BASE_URL } from "@/constants";
import { useEffect, useCallback, useState } from "react";
import ProductItem from "../../components/ProductItem";
import Row from "react-bootstrap/Row";
import Head from "next/head";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import getError from "../../libs/getError";
import Error from "../../components/Error";
import Link from "next/link";
import ShopCategorySlide from "@/components/ShopCategorySlide";
import Pagination from "react-bootstrap/Pagination";
const shop = (props) => {
  const [products, setProducts] = useState(null);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(4);
  const [productToShow, setProductToShow] = useState([]);
  const [pageItemList, setPageItemList] = useState([]);
  //Set product
  const get_product = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (props.products) {
        resolve(props.products);
      }
    });
  }, []);
  //Set product
  const set_product = useCallback(async () => {
    try {
      props.get_loading(true);
      const products = await get_product();
      setProducts(products);
      props.get_loading(false);
    } catch (err) {
      props.get_loading(false);
    }
  }, []);
  const getProductToShow = () => {
    const end = page * limit;
    const start = end - limit;
    const productToShow = products && products.slice(start, end);
    setProductToShow(productToShow);
  };
  const getPageItemList = useCallback(() => {
    const pageItems = [];
    const numberOfPage = Math.ceil(count / limit);
    let i;
    for (i = 0; i < numberOfPage; i++) {
      pageItems.push(i + 1);
    }
    setPageItemList(pageItems);
  }, [count]);
  useEffect(() => {
    getPageItemList();
  }, [count]);
  useEffect(() => {
    getProductToShow();
  }, [products, page]);
  //Use effect
  useEffect(() => {
    setCount(props.count);
    set_product();
  }, []);
  if (!products)
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  return (
    <>
      <Head>
        <title>Shop</title>
        <meta
          name="description"
          content="Furnie shop where you can see all our product"
        />
      </Head>
      {console.log(products)}
      <Container>
        <div className="d-flex flex-column align-items-center shop-header">
          <h1 className="h3 text-center text-uppercase">Furnie's Shop</h1>
          <Breadcrumb className="breadcrumb-custom">
            <Link href="/" className="breadcrumb-item">
              Home
            </Link>
            <Breadcrumb.Item active>Shop</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div>
          <ShopCategorySlide />
        </div>
        <Row>
          {products.length === 0 ? (
            <Error message={"No product found"} status={"404"} />
          ) : (
            ""
          )}
          {productToShow &&
            productToShow.map((item) => {
              return <ProductItem product={item} key={item._id} col={4} />;
            })}
        </Row>
        <Pagination
          className={"shop__pagination " + (count === 0 ? "d-none" : "d-flex")}
        >
          <Pagination.Prev
            onClick={() => setPage(page - 1)}
            disabled={page === 1 ? true : false}
          />
          {pageItemList.map((item) => {
            return (
              <Pagination.Item
                key={item}
                active={item === page}
                onClick={() => setPage(item)}
              >
                {item}
              </Pagination.Item>
            );
          })}
          <Pagination.Next
            onClick={() => setPage(page + 1)}
            disabled={page === Math.ceil(count / limit) ? true : false}
          />
        </Pagination>
      </Container>
    </>
  );
};
export const getServerSideProps = async () => {
  try {
    const res = await getData(`${GET_PRODUCTS_URL}`);
    return {
      props: {
        products: res.data.products,
        count: res.data.count,
      },
    };
  } catch (err) {
    const error =
      err.response && err.response.data ? err.response.data : err.message;
    return {
      props: {
        error: JSON.stringify(error),
      },
    };
  }
};
const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    get_loading: (loading) => {
      dispatch(action.getLoading(loading));
    },
    get_notify: (notify) => {
      dispatch(action.getNotify(notify));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(shop);
