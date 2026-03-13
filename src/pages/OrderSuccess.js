import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card  text-center p-4" style={{ maxWidth: "500px" }}>
        <FaCheckCircle className="text-success" size={80} />
        <h2 className="mt-3 text-success">Payment Successful!</h2>
        <p className="text-muted">Thank you for your order.</p>
        {orderId && (
          <p className="fw-bold">
            Order ID: <span className="text-primary">{orderId}</span>
          </p>
        )}

        <button
          className="btn btn-primary mt-3 w-100"
          onClick={() => navigate("/profile/myorder")}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
