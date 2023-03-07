import Slider from "react-slick";
import SlideItem from "./SlideItem";

function Slide(props) {
  const slideImages = props.slideImages;
  slideImages?.sort((a, b) => {
    return a.arrange - b.arrange;
  });

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings}>
      {slideImages ? (
        slideImages.map((item, idx) => {
          return <SlideItem key={idx} itemSlide={item} />;
        })
      ) : (
        <div>Slide Website...</div>
      )}
    </Slider>
  );
}

export default Slide;
