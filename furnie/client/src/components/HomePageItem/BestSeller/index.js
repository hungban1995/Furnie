import ProductItem from "@/components/ProductItem";
import React from "react";
import { Card, Col, Row } from "react-bootstrap";

function BestSeller(props) {
  const products = props.products;
  return (
    <div>
      <h1>Best Sellers</h1>
      <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
      <Row className="mt-3">
        {products ? (
          products.map((product, idx) => {
            return (
              <ProductItem
                product={product}
                key={product._id}
                col={12 / products.length}
              />
            );
          })
        ) : (
          <p>Nothing to show 😅</p>
        )}
      </Row>
    </div>
  );
}

export default BestSeller;
