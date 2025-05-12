import React from "react";
import Navbar from "./navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-5 navbar-offset">
        <h1 className="text-center my-4">Travertin Lux</h1>
        <div
          id="carousel"
          className="carousel slide"
          data-bs-ride="carousel"
          style={{
            height: "calc(100vh - 120px)",
            maxHeight: "600px",
          }}
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="/images/slide1.jpg"
                className="d-block w-100"
                alt="Slide 1"
                style={{
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="/images/slide2.jpg"
                className="d-block w-100"
                alt="Slide 2"
                style={{
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="/images/slide3.jpg"
                className="d-block w-100"
                alt="Slide 3"
                style={{
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                }}
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
