import { useEffect, useState } from "react";
import { BASE_URL } from "@/constants";
import Link from "next/link";
const ShopCategoryItem = (props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [id, setId] = useState("");
  useEffect(() => {
    setImage(props.image);
    setTitle(props.title);
    setUrl(props.url);
    setId(props.id);
  }, [props.image, props.title, props.url, props.id]);
  return (
    <div className="shop__category-slide-item">
      <Link
        href={`/shop/${url}.${id}`}
        className="shop__category-slide-item-img"
      >
        <img src={`${BASE_URL}/${image}`} />
      </Link>
      <Link href={`/shop/${url}.${id}`} className="d-block text-center title">
        {title}
      </Link>
    </div>
  );
};
export default ShopCategoryItem;
