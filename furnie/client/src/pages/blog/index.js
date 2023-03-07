import PostItem from "@/components/PostItem";
import { getData } from "../../libs/fetchData";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { GET_POST_URL } from "@/constants";
import PostSideBar from "@/components/PostSidebar";
import Pagination from "react-bootstrap/Pagination";
import Link from "next/link";
const Blogs = (props) => {
  const [posts, setPosts] = useState([]);
  const [limit] = useState(4);
  const [count, setCount] = useState(0);
  const [numberOfPage, setNumberOfPage] = useState(0);
  const [page, setPage] = useState(1);
  const [pageItems, setPageItems] = useState([]);
  const [postToShow, setPostToShow] = useState([]);
  useEffect(() => {
    setCount(props.count);
    setPosts(props.posts);
  }, [props.posts, props.count]);
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
        <title>Posts</title>
        <meta
          name="description"
          content="Furnie shop where you can see all our posts"
        ></meta>
      </Head>
      <Container>
        <div className="d-flex flex-column align-items-center shop-header">
          <h1 className="h3 text-center text-uppercase">Furnie's Blogs</h1>
          <Breadcrumb className="breadcrumb-custom">
            <Link className="breadcrumb-item" href="/">
              Home
            </Link>
            <Breadcrumb.Item active>Blogs</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Row className="blogs-page">
          <Col lg={3}>
            <PostSideBar />
          </Col>
          <Col lg={9}>
            {postToShow &&
              postToShow.map((post, idx) => {
                return <PostItem key={idx} post={post.item} />;
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
export const getServerSideProps = async () => {
  try {
    const res = await getData(`${GET_POST_URL}`);
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
export default Blogs;
