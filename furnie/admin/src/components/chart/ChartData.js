import { useCallback, useEffect, useState } from "react";
import ReactApexCharts from "react-apexcharts";
import { getData } from "../../libs/fetchData";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

export default function ChartData() {
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 10);
    return date;
  });
  const [dataByDate, setDataByDate] = useState([]);
  const getOrders = useCallback(async () => {
    try {
      const res = await getData("order");
      const orders = res.data.orders;
      if (orders) {
        return orders.filter((order) => {
          const orderDate = moment(order.createDate, "DD/MM/YYYY");
          return orderDate.isBetween(
            moment(startDate).startOf("day"),
            moment(endDate).endOf("day"),
            null,
            "[]"
          );
        });
      }
      return orders;
    } catch (error) {
      console.error(error);
    }
  }, [startDate, endDate]);

  const getDataByDate = useCallback(async () => {
    const orders = await getOrders();
    const data = {};
    orders?.forEach((order) => {
      const date = moment(order.createDate, "DD/MM/YYYY").format("MM/DD/YYYY");
      if (data[date]) {
        data[date] += 1;
      } else {
        data[date] = 1;
      }
    });
    setDataByDate(
      Object.entries(data).map(([date, count]) => ({ date, count }))
    );
  }, [getOrders]);

  useEffect(() => {
    getDataByDate();
  }, [getDataByDate]);

  const data = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        type: "datetime",
      },
    },
    series: [
      {
        name: "Orders",
        data: dataByDate.map((data) => ({
          x: new Date(data.date),
          y: data.count,
        })),
      },
    ],
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        marginBottom: "20px",
      }}
    >
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <Col style={{ margin: "20px" }}>
          <span>From:</span>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            maxDate={new Date()}
          />
        </Col>
        <Col style={{ margin: "20px" }}>
          <span>To:</span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            maxDate={new Date()}
          />
        </Col>
      </Row>
      <ReactApexCharts
        options={data.options}
        series={data.series}
        type="bar"
        height={350}
      />
    </div>
  );
}
