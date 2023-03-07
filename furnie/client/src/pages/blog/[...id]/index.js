import PostItem from "@/components/PostItem";
import PostSideBar from "@/components/PostSidebar";
import { GET_POST_URL } from "@/constants";
import { getData } from "@/libs/fetchData";
import Head from "next/head";
import Link from "next/link";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import Pagination from "react-bootstrap/Pagination";
const postCategory = (props) => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState([]);
  const [limit] = useState(4);
  const [count, setCount] = useState(0);
  const [numberOfPage, setNumberOfPage] = useState(0);
  const [page, setPage] = useState(1);
  const [pageItems, setPageItems] = useState([]);
  const [postToShow, setPostToShow] = useState([]);
  useEffect(() => {
    setPosts(props.posts);
    setCategory(props.category);
    setCount(props.count);
  }, [props.posts, props.category, props.count]);
  useEffect(() => {
    setNumberOfPage(Math.ceil(count / limit));
  }, [count]);
  useEffect(() => {
    let i;
    let pageItems = [];
    for (i = 0; i < numberOfPage; i++) {
      pageItems.push(i + 1);
    }
    setPageItems(pageItems);
  }, [numberOfPage]);
  useEffect(() => {
    const end = page * limit;
    const start = end - limit;
    const postToShow = posts.slice(start, end);
    setPostToShow(postToShow);
  }, [posts, page]);
  return (
    <>
      <Head>
        <title>{category.title}</title>
        <meta name="description" content={category.description} />
      </Head>
      <Container>
        <div className="d-flex flex-column align-items-center shop-header">
          <h1 className="h3 text-center text-uppercase">Furnie's Blogs</h1>
          <Breadcrumb>
            <Link className="breadcrumb-item" href="/">
              Home
            </Link>
            <Link className="breadcrumb-item" href="/blog">
              Blog
            </Link>
            <Breadcrumb.Item active>{category.title}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Row>
          <Col md={3}>
            <PostSideBar />
          </Col>
          <Col md={9}>
            {postToShow &&
              postToShow.map((post, idx) => {
                return <PostItem key={idx} post={post} />;
              })}
          </Col>
        </Row>
        <Pagination
          className={
            "justify-content-center " + (count === 0 ? "d-none" : "d-flex")
          }
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
    const params = req.query.id[0].split(".");
    const url = params[0];
    const id = params[1];
    const res = await getData(`${GET_POST_URL}/get-by-category/${url}.${id}`);
    const posts = res.data.posts;
    const count = res.data.count;
    return { props: { posts, count } };
  } catch (err) {
    console.log(err);
    return {
      props: {},
    };
  }
};
const mapStateToProps = (state) => {
  return { category: state.PostCategory.category };
};

export default connect(mapStateToProps)(postCategory);
