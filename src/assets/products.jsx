import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expirationDate: "",
    cardCode: "",
    amount: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/process-payment",
        {
          paymentInfo, // Send paymentInfo as a nested object
        }
      );

      console.log(response);

      if (response.data.success) {
        toast.success("Transaction successful!");
      } else if (response.data.message === "fraud transaction") {
        toast.error(
          "Fraud Transaction. I think you are continuously changing your credit card number."
        );
      } else {
        toast.error("Transaction failed.");
      }
      setIsModalOpen(false); // Close modal after submission
    } catch (error) {
      toast.error("Transaction failed. Please try again.");
      console.error(error);
    }
  };

  // Dummy product data
  const products = [
    { id: 1, name: "Product 1", price: 10.0 },
    { id: 2, name: "Product 2", price: 20.0 },
    { id: 3, name: "Product 3", price: 15.0 },
    { id: 3, name: "Product 4", price: 22.0 },
    { id: 3, name: "Product 5", price: 30.0 },
    { id: 3, name: "Product 6", price: 40.0 },
  ];

  return (
    <div>
      <Toaster position="top-right" />

      <h2>Products</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              width: "150px",
            }}
          >
            <h3>{product.name}</h3>
            <p>Price: ${product.price.toFixed(2)}</p>
            <button
              onClick={() => {
                setPaymentInfo({ ...paymentInfo, amount: product.price });
                setIsModalOpen(true);
              }}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "300px",
            height: "100%",
            backgroundColor: "#fff",
            boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3>Enter Payment Details</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Card Number:</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Expiration Date:</label>
              <input
                type="text"
                name="expirationDate"
                value={paymentInfo.expirationDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                required
              />
            </div>
            <div>
              <label>Card Code:</label>
              <input
                type="text"
                name="cardCode"
                value={paymentInfo.cardCode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Amount:</label>
              <input type="text" value={paymentInfo.amount} readOnly />
            </div>
            <button type="submit">Submit Payment</button>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Products;
