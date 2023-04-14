import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import Axios from "axios";
import { Icon, Col, Card, Row, Carousel } from "antd";
import Meta from "antd/lib/card/Meta";
import ImageSlider from "../../utils/ImageSlider";
import { continents, price } from "./Sections/Datas";
import CheckBox from "./Sections/CheckBox";
import SearchFeature from "./Sections/SearchFeature";
import RadioBox from "./Sections/RadioBox";

function LandingPage() {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(9);
  const [Filters, setFilters] = useState({
    continents: [],
    price: [],
  });
  const [SearchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let body = {
      skip: Skip,
      limit: Limit,
    };

    getProducts(body);
  }, []);

  const getProducts = (body) => {
    Axios.post("/api/product/products", body).then((response) => {
      if (response.data.success) {
        if (body.loadMore) {
          setProducts([...Products, ...response.data.productInfo]);
        } else {
          setProducts(response.data.productInfo);
        }
      } else {
        alert(" 상품을 가져옹는데 실패 했습니다.");
      }
    });
  };

  const loadMorHandler = () => {
    let skip = Skip + Limit;

    let body = {
      skip: skip,
      limit: Limit,
      loadMore: true,
    };

    getProducts(body);
    setSkip(skip);
  };

  const renderCards = Products.map((product, index) => {
    return (
      <Col
        style={{ paddingRight: "40px", marginBottom: "40px" }}
        lg={8}
        md={12}
        xs={24}
        key={index}
      >
        <a href={`/product/${product._id}`}>
          <div>
            <Card
              style={{
                width: 320,
                height: 400,
                borderRadius: 30,
                borderWidth: 3,
                borderColor: "#e0e0e0",
              }}
              hoverable
              cover={
                <div style={{ padding: 30, paddingTop: 50 }}>
                  <div style={{ width: 260, height: 150 }}>
                    <h2>{product.title}</h2>
                  </div>
                  <div>
                    <h2>{product.price}</h2>
                  </div>
                  <div>
                    <h2>{continents[product.continents - 1].name}</h2>
                  </div>
                  <hr />
                  <div>
                    <h5>{product.views}</h5>
                  </div>
                  <div>
                    <h5>{product.createdAt}</h5>
                  </div>
                </div>
              }
              // cover={<ImageSlider images={product.images} />}
            >
              {/* <Meta
                title={product.views}
                description={`$${product.createdAt}`}
              ></Meta> */}
            </Card>
          </div>
        </a>
      </Col>
    );
  });

  const renderCheckCards = Filters.continents.map((product, index) => {
    return (
      <Col lg={4} md={12} xs={24} key={index}>
        <div>
          <Card
            style={{
              width: 150,
              height: 40,
              borderRadius: 30,
              borderWidth: 3,
              borderColor: "#e0e0e0",
            }}
            hoverable
            cover={
              <div>
                <h2 style={{ textAlign: "center" }}>
                  {continents[product - 1].name}
                </h2>
              </div>
            }
          ></Card>
        </div>
      </Col>
    );
  });

  const showFilteredResults = (filters) => {
    let body = {
      skip: 0,
      limit: Limit,
      filters: filters,
    };

    getProducts(body);
    setSkip(0);
  };

  const handlePrice = (value) => {
    const data = price;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }

    return array;
  };

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };

    newFilters[category] = filters;

    if (category === "price") {
      let priceValues = handlePrice(filters);
      newFilters[category] = priceValues;
    }

    showFilteredResults(newFilters);

    setFilters(newFilters);
  };

  const updateSearchTerm = (newSearchTerm) => {
    let body = {
      skip: 0,
      limit: Limit,
      filters: Filters,
      searchTerm: newSearchTerm,
    };
    setSkip(0);
    setSearchTerm(newSearchTerm);
    getProducts(body);
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          height: 350,
          border: 5,
          borderColor: "#D1CFCF",
          boxShadow: "2px 2px 9px rgba(0, 0, 0, 0.25)",
        }}
      >
        {
          <img
            style={{
              width: "100%",
              height: 350,
            }}
            src={`https://t4.ftcdn.net/jpg/03/42/34/09/240_F_342340916_AMHG6ndDGk4zodvfIMergOMDlqVb8MD8.jpg`}
          />
        }
      </div>
      <div style={{ width: "75%", margin: "3rem auto" }}>
        {/* Filter */}
        <Row gutter={[16, 16]}>
          <Col lg={24} xs={24}>
            {/*checkBox */}
            <CheckBox
              list={continents}
              handleFilters={(filters) => handleFilters(filters, "continents")}
            />
          </Col>
        </Row>
        {/* checkedList*/}
        <Row gutter={[16, 16]}>{renderCheckCards}</Row>
        {/* Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "1rem auto",
          }}
        >
          <SearchFeature refreshFunction={updateSearchTerm} />
        </div>
        {/* Cards */}
        <Row gutter={[16, 16]}>{renderCards}</Row>
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={{
              width: 195,
              height: 66,
              boxShadow: "2px 2px 9px rgba(0, 0, 0, 0.25)",
              background: "#FFFFFF",
              border: "1.25px",
              borderColor: "#D1CFCF",
              borderRadius: "7px",
            }}
            onClick={loadMorHandler}
          >
            더보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
