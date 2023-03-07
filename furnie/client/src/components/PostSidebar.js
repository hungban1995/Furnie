import { GET_POST_CATEGORIES_URL } from "@/constants";
import { getData } from "@/libs/fetchData";
import { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import { postCategory } from "@/store/Action";
import { connect } from "react-redux";
function PostSideBar(props) {
  const [categoryPost, setCategoryPost] = useState("");
  const [categories, setCategories] = useState();
  useEffect(() => {
    getData(`${GET_POST_CATEGORIES_URL}`)
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <Navbar>
      <Container className="flex-column">
        <Navbar.Brand className="me-auto">
          Categories Post <hr />
        </Navbar.Brand>
        {categories &&
          categories.map((category, idx) => {
            return (
              <Nav className="me-auto flex-column" key={idx}>
                <Link
                  onClick={() => {
                    props.setPostCategory(category.category);
                    setCategoryPost(category.category._id);
                  }}
                  className={
                    categoryPost && categoryPost === category.category._id
                      ? "post-category-link"
                      : ""
                  }
                  style={{ textDecoration: "none", marginTop: "15px" }}
                  href={`/blog/${category.category.url}.${category.category._id}`}
                >
                  {category.category.title}
                </Link>
              </Nav>
            );
          })}
      </Container>
    </Navbar>
  );
}
const mapStateToProps = (state) => {
  return { state };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setPostCategory: (category) => {
      dispatch(postCategory(category));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PostSideBar);
