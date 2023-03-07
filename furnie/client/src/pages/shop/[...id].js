import * as action from "../../store/Action";
import { connect } from "react-redux";
import Head from "next/head";
import Container from "react-bootstrap/Container";
import { useState, useCallback, useEffect } from "react";
import { getData } from "../../libs/fetchData";
import { GET_PRODUCT_BY_CATEGORY } from "../../constants/index";
import Row from "react-bootstrap/Row";
import Error from "../../components/Error";
import ProductItem from "@/components/ProductItem";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Link from "next/link";
import Pagination from "react-bootstrap/Pagination";

const category = (props) => {
  const [isTimeOut, setIsTimeOut] = useState(false);

  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState(null);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(1);
  const [numberOfPage, setNumberOfPage] = useState(0);
  const [productToShow, setProductToShow] = useState([]);
  const [pageItems, setPageItems] = useState([]);
  const getProduct = useCallback(() => {
    setProducts(props.products);
    setCategory(props.category);
  }, []);
  useEffect(() => {
    const end = page * limit;
    const start = end - limit;
    const productToShow = products && products.slice(start, end);
    setProductToShow(productToShow);
  }, [products, page]);
  useEffect(() => {
    setNumberOfPage(Math.ceil(count / limit));
  }, [count]);
  useEffect(() => {
    const pageItems = [];
    let x;
    for (x = 0; x < numberOfPage; x++) {
      pageItems.push(x + 1);
    }
    setPageItems(pageItems);
  }, [numberOfPage]);
  useEffect(() => {
    getProduct();
    setCount(props.count);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsTimeOut(true);
    }, 5000);
  }, []);

  if (!products && !isTimeOut) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }
  if (!products && isTimeOut)
    return (
      <Container>
        <Error status="404" message="Not Found" />
      </Container>
    );
  return (
    <>
      <Head>
        <title>
          {category && category.title ? category.title : "Not found"}
        </title>
        <meta
          name="description"
          content={category && category.description ? category.description : ""}
        />
      </Head>
      <Container>
        <div
          className={
            "d-flex flex-column align-items-center shop-header " +
            (category && category.title ? "d-block" : "d-none")
          }
        >
          <h1 className="text-center mb-3">
            {category && category.title ? category.title : ""}
          </h1>
          <Breadcrumb className="breadcrumb-custom">
            <Link href="/" className="breadcrumb-item">
              Home
            </Link>
            <Link href="/shop" className="breadcrumb-item">
              Shop
            </Link>
            <Breadcrumb.Item active>
              {category && category.title ? category.title : ""}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Row>
          {productToShow && productToShow.length > 0 ? (
            productToShow.map((item) => {
              return <ProductItem col={4} product={item} key={item._id} />;
            })
          ) : (
            <Error status={404} message={"Category have not product"} />
          )}
        </Row>
        <Pagination
          className={"shop__pagination " + (count === 0 ? "d-none" : "d-flex")}
        >
          <Pagination.Prev
            onClick={() => setPage(page - 1)}
            disabled={page === 1 ? true : false}
          />
          {pageItems.map((item) => {
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
            disabled={page === numberOfPage ? true : false}
          />
        </Pagination>
      </Container>
    </>
  );
};
export const getServerSideProps = async (req) => {
  try {
    const { id } = req.query;
    const res = await getData(`${GET_PRODUCT_BY_CATEGORY}/${id[0]}`);
    return {
      props: {
        products: res && res.data ? res.data.productByCategory : [],
        category: res && res.data ? res.data.category : null,
        count: res && res.data ? res.data.count : 0,
      },
    };
  } catch (err) {
    return {
      props: {
        error: err.response ? err.response.data.error : err.message,
      },
    };
  }
};
const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    getNotify: (notify) => {
      dispatch(action.getNotify(notify));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(category);
