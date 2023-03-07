export const PriceVnd = (price) => {
  return new Intl.NumberFormat("vi-VI", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const PriceS = (attributes) => {
  let prices = [];
  attributes.map((item) => prices.push(item.price));
  var maxInNumbers = Math.max.apply(Math, prices);
  var minInNumbers = Math.min.apply(Math, prices);
  return (
    <span>
      <i>{PriceVnd(minInNumbers)}</i> - <i>{PriceVnd(maxInNumbers)}</i>
    </span>
  );
};
export const OnSales = (attributes) => {
  let onSales = [];
  attributes.map((item) => onSales.push(item.onSale));
  var maxInNumbers = Math.max.apply(Math, onSales);
  var minInNumbers = Math.min.apply(Math, onSales);
  return (
    <span>
      <i>{PriceVnd(minInNumbers)}</i> - <i>{PriceVnd(maxInNumbers)}</i>
    </span>
  );
};
export const InStock = (attributes) => {
  let inStocks = 0;
  attributes.map((item) => (inStocks += item.inStock));
  return <span>{inStocks}</span>;
};
export const Sold = (attributes) => {
  let sold = 0;
  attributes.map((item) => (sold += item.sold));
  return <span>{sold}</span>;
};
