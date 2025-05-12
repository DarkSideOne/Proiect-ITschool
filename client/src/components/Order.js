import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./navbar";

const Order = () => {
  const location = useLocation();
  const initialProductId = location.state?.productId?.toString() || "";
  const [formData, setFormData] = useState({
    nume: "",
    email: "",
    telefon: "",
    produs_id: initialProductId,
    cantitate: 1,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log("Order component mounted");
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Nu s-au putut încărca produsele");
        const data = await response.json();
        setProducts(data);
        if (data.length > 0 && !initialProductId) {
          setFormData((prev) => ({
            ...prev,
            produs_id: data[0].id.toString(),
          }));
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [initialProductId]);

  const validateForm = () => {
    if (!formData.nume.trim()) return "Numele este obligatoriu";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Email invalid";
    if (!formData.telefon.trim()) return "Telefonul este obligatoriu";
    if (!formData.produs_id) return "Selectați un produs";
    if (formData.cantitate < 1) return "Cantitatea trebuie să fie cel puțin 1";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const response = await fetch("/api/comanda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produs_id: parseInt(formData.produs_id),
          nume: formData.nume,
          email: formData.email,
          telefon: formData.telefon,
          cantitate: parseInt(formData.cantitate),
        }),
      });
      if (response.ok) {
        setSuccess(true);
        setFormData({
          nume: "",
          email: "",
          telefon: "",
          produs_id: products.length > 0 ? products[0].id.toString() : "",
          cantitate: 1,
        });
      } else {
        const errorData = await response.json();
        setFormError(errorData.error || "Eroare la trimiterea comenzii");
      }
    } catch (error) {
      console.error("Eroare:", error);
      setFormError("Eroare la trimiterea comenzii");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
    setSuccess(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container navbar-offset">
        <h2 className="text-center mb-4">Formular Comanda</h2>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm p-4">
              {loading && (
                <p className="text-center">Se incarca produsele...</p>
              )}
              {error && <div className="alert alert-danger">{error}</div>}
              {success && (
                <div className="alert alert-success">
                  Comanda trimisa cu succes!
                </div>
              )}
              {formError && (
                <div className="alert alert-danger">{formError}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nume" className="form-label">
                    Nume
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nume"
                    name="nume"
                    value={formData.nume}
                    onChange={handleChange}
                    placeholder="Introduceti numele"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Introduceti emailul"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="telefon" className="form-label">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="telefon"
                    name="telefon"
                    value={formData.telefon}
                    onChange={handleChange}
                    placeholder="Introduceti telefonul"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="produs_id" className="form-label">
                    Produs
                  </label>
                  <select
                    className="form-select"
                    id="produs_id"
                    name="produs_id"
                    value={formData.produs_id}
                    onChange={handleChange}
                    required
                    disabled={loading || products.length === 0}
                  >
                    {products.length === 0 ? (
                      <option value="">Niciun produs disponibil</option>
                    ) : (
                      products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="cantitate" className="form-label">
                    Cantitate
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="cantitate"
                    name="cantitate"
                    value={formData.cantitate}
                    onChange={handleChange}
                    placeholder="Introduceti cantitatea"
                    min="1"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Trimite Comanda
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
