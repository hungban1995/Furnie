import { connect } from "react-redux";
import { setNotify, setCount, setHomeSlide } from "../../store/Action";
import React, { useEffect, useState } from "react";
import SlideImages from "../../components/editHomePage/slideImages";
import { getData } from "../../libs/fetchData";
import ItemSelect from "../../components/editHomePage/itemSelect";
function HomePageManager(props) {
  const [homePageData, setHomePageData] = useState([]);
  const [slide, setSlide] = useState([]);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getData("home-page/63fc460b39b43192d9af1113")
      .then((res) => {
        console.log("res", res);
        setHomePageData(res.data.homePageData);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    setSlide(homePageData.slideImages);
    setCategories(homePageData.categories);
    setPosts(homePageData.posts);
    setProducts(homePageData.products);
  }, [homePageData]);
  return (
    <div className="m-3">
      <h2>Edit Slide Images:</h2>
      <SlideImages slideImages={slide} />
      <h2>Edit ItemSelect:</h2>
      <ItemSelect
        categories={categories}
        posts={posts}
        products={products}
        currentSlide={slide}
      />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    notify: state.NotifyReducer,
    slideImages: state.HomePageManagerReducer.slideImages,
    count: state.CounterReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setNotifyReducer: (notify) => {
      dispatch(setNotify(notify));
    },
    setCount: () => {
      dispatch(setCount());
    },
    setSlideImages: (slideImages) => {
      dispatch(setHomeSlide(slideImages));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomePageManager);
