import BestSeller from "@/components/HomePageItem/BestSeller";
import Slide from "@/components/HomePageItem/Slide/Slide";
import { getData } from "@/libs/fetchData";
import Head from "next/head";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { connect } from "react-redux";
import PostItem from "@/components/PostItem";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "@/constants";
import PostRecent from "@/components/HomePageItem/PostRecent";

const Home = (props) => {
  const [homeData, setHomeData] = useState([]);
  const getHomeData = useCallback(async () => {
    try {
      const res = await getData("api/v1/home-page/63fc460b39b43192d9af1113");
      setHomeData(res.data.homePageData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getHomeData();
  }, [getHomeData]);

  return (
    <>
      <Head>
        <title>Furnie</title>
        <meta name="description" content="This is meta description" />
      </Head>
      <Container>
        <div className="mb-5">
          <Slide slideImages={homeData?.slideImages} />
        </div>
        <div className="homepage__category-list">
          {homeData.categories ? (
            homeData.categories.map((cat, idx) => {
              return (
                <Link
                  key={idx}
                  className="homepage__category-item"
                  href={`/shop/${cat.url}.${cat._id}`}
                >
                  <span>{cat.title}</span>
                </Link>
              );
            })
          ) : (
            <p>Nothing to show 😅</p>
          )}
        </div>
        <BestSeller products={homeData.products} />
        <Row className="mt-3">
          <h2>Recent Posts</h2>
          {homeData.posts ? (
            homeData.posts.map((post, idx) => {
              return (
                <Col key={idx} className="mt-3" lg={4}>
                  <PostRecent post={post} />
                </Col>
              );
            })
          ) : (
            <p>Nothing to show 😅</p>
          )}
        </Row>
      </Container>
    </>
  );
};
const mapDispatchToState = (state) => {
  return {};
};
export default connect(mapDispatchToState)(Home);
