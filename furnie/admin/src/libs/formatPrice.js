const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VI", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
export default formatPrice;
