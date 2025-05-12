import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {z    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleOrderClick = (productId) => {
    navigate("/order", { state: { productId } });
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5 navbar-offset">
        <h2 className="text-center mb-4">Produse Imitatie Travertin</h2>
        {loading && <p className="text-center">Se incarca...</p>}
        {error && <p className="text-center text-danger">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="text-center">Niciun produs disponibil.</p>
        )}
        <div className="row g-4">
          {products.map((product) => (
            <div key={product.id} className="col-md-4">
              <div className="card h-100 shadow-sm transition-hover">
                <img
                  src={product.imageUrl || "/images/placeholder.jpg"}
                  className="card-img-top"
                  alt={product.name}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    {product.description || "Fără descriere"}
                  </p>
                  <p className="card-text fw-bold">{product.price} RON</p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleOrderClick(product.id)}
                  >
                    Comanda
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
