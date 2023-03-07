import { getData } from "@/libs/fetchData";
import Head from "next/head";
import { Breadcrumb, Container } from "react-bootstrap";
import { BASE_URL, GET_POST_URL } from "@/constants";
import Comments from "@/components/Comments";
import Link from "next/link";
import { useEffect, useState } from "react";
import Error from "@/components/Error";
function Post(props) {
  const [post, setPost] = useState(null);
  const [isTimeOut, setIsTimeOut] = useState(false);
  useEffect(() => {
    setPost(props.post);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsTimeOut(true);
    }, 5000);
  }, []);
  if (!post && !isTimeOut) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }
  if (!post && isTimeOut)
    return (
      <Container>
        <Error status="404" message="Not Found" />
      </Container>
    );

  //- render Content
  const RenderPostContent = () => {
    return { __html: post && post.content };
  };
  return (
    <>
      <Head>
        <title>{post && post.title}</title>
        <meta name="description" content={post && post.description} />
      </Head>
      <Container>
        <Breadcrumb>
          <Link className="breadcrumb-item" href="/">
            Home
          </Link>
          <Link className="breadcrumb-item" href="/blog">
            Blog
          </Link>
          <Breadcrumb.Item active>{post && post.title}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="post">
          <img
            style={{ maxWidth: "100%" }}
            src={
              post && post.images[0]
                ? `${BASE_URL}/${post.images[0]}`
                : "https://static-prod.adweek.com/wp-content/uploads/2017/07/ContentIsKing.jpg.webp"
            }
          />
          <h2 style={{ textAlign: "center" }}>{post && post.title}</h2>
          <p style={{ textAlign: "end" }}>
            By <strong>{post && post.author.username}</strong> on{" "}
            <span style={{ fontStyle: "italic" }}>
              {post && post.createDate}
            </span>
          </p>
          <br />
          <h5 style={{ textAlign: "center" }}>"{post && post.description}"</h5>
          <div dangerouslySetInnerHTML={RenderPostContent()}></div>
          <hr />
        </div>
        <Comments postId={post && post._id} comments={post && post.comment} />
      </Container>
    </>
  );
}
export async function getServerSideProps(req) {
  try {
    const params = req.query.id[0].split(".");
    const url = params[0];
    const id = params[1];
    const res = await getData(`${GET_POST_URL}/${url}.${id}`);
    return {
      props: {
        post: res.data.post,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        error: JSON.stringify(err),
      },
    };
  }
}
export default Post;
