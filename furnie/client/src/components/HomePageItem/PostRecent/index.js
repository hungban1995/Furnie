import React from "react";
import { BASE_URL } from "@/constants";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";

const PostRecent = (props) => {
  const post = props.post;
  return (
    <div className="flex-column">
      <div style={{ height: "200px" }}>
        <Link href={`/post/${post.url}.${post._id}`}>
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            src={
              post.images?.length > 0 && post.images[0]
                ? `${BASE_URL}/${post.images[0]}`
                : "https://static-prod.adweek.com/wp-content/uploads/2017/07/ContentIsKing.jpg.webp"
            }
          />
        </Link>
      </div>
      <div style={{ height: "250px" }}>
        <h2>{post.title}</h2>
        <p style={{ height: "100px", overflow: "hidden" }}>
          {post.description}
        </p>
      </div>
      <Link href={`/post/${post.url}.${post._id}`}>Read More..</Link>

      <hr />
    </div>
  );
};
export default PostRecent;
