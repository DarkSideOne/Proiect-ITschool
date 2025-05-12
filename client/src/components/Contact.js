import React from "react";
import Navbar from "./navbar";

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div className="container navbar-offset">
        <h2 className="text-center mb-4">Contact</h2>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm p-4">
              <p className="text-center">
                Contactati-ne pentru mai multe informatii.
              </p>
              <ul className="list-unstyled">
                <li>
                  <strong>Email:</strong> marius@travertinlux.ro
                </li>
                <li>
                  <strong>Telefon:</strong> +40 725816585
                </li>
                <li>
                  <strong>Adresa:</strong> Caras-Severin, Caransebes, 325400
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
