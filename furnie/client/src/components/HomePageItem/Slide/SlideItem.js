import { BASE_URL } from "@/constants";
import Link from "next/link";

function SlideItem(props) {
  const itemSlide = props.itemSlide;
  return (
    <Link
      style={{ textDecoration: "none", width: "100%" }}
      href={itemSlide.link || "#"}
    >
      <div className="home-slide-item">
        <img
          alt="product-img"
          src={
            itemSlide?.image
              ? `${BASE_URL}/${itemSlide.image}`
              : "https://static-prod.adweek.com/wp-content/uploads/2017/07/ContentIsKing.jpg.webp"
          }
        />
        <div className="home-slide-content">
          <h2>{itemSlide?.title}</h2>
          <p>{itemSlide?.description}</p>
        </div>
      </div>
    </Link>
  );
}
export default SlideItem;
