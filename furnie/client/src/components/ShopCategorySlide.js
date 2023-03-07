import { useState, useCallback, useEffect } from "react";
import { getData } from "../libs/fetchData";
import { GET_PRODUCT_CATEGORY } from "../constants/index";
import { connect } from "react-redux";
import * as action from "../store/Action";
import getError from "../libs/getError";
import Slider from "react-slick";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import ShopCategoryItem from "./ShopCategoryItem";
const ShopCategorySlide = (props) => {
  const [categories, setCategories] = useState(null);
  const [setting, setSetting] = useState({
    className: "shop__category-slide",
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 820,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  });
  const getProductCategories = useCallback(async () => {
    try {
      const res = await getData(`${GET_PRODUCT_CATEGORY}`);
      setCategories(res.data.categories);
    } catch (err) {
      props.getNotify(getError(err));
    }
  }, []);
  useEffect(() => {
    getProductCategories();
  }, []);
  if (!categories) return <div>Loading...</div>;
  return (
    <>
      <div className="shop__category-slide-container">
        <BsChevronLeft className="shop__category-slide-icon shop__category-slide-icon--left" />
        <Slider {...setting}>
          {categories.map((item, index) => {
            return (
              <ShopCategoryItem
                title={item.category.title}
                url={item.category.url}
                id={item.category._id}
                image={item.category.image}
                key={index}
              />
            );
          })}
        </Slider>
        <BsChevronRight className="shop__category-slide-icon shop__category-slide-icon--right" />
      </div>
    </>
  );
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
export default connect(mapStateToProps, mapDispatchToProps)(ShopCategorySlide);
