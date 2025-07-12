import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FailIcon from "../../../assets/FailIcon.webm";
import "./DepositFailPage.scss";
import { checkPayment } from "../../../service/paymentService";

const DepositFailPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const accountId = user?.id;
  const userRole = user?.role;

  useEffect(() => {
    const processFailure = async () => {
      const paymentInfo = JSON.parse(sessionStorage.getItem("payment") || "{}");
      if (!paymentInfo || !accountId) {
        setTimeout(() => {
          navigate(userRole === "Customer" ? "/client/" : "/translator/");
        }, 3000);
        return;
      }

      try {
        const { orderCode } = paymentInfo;
        const checkResult = await checkPayment(orderCode);
        if (checkResult?.success) {
          sessionStorage.removeItem("payment");
        }
        setTimeout(() => {
          navigate(userRole === "Customer" ? "/client/" : "/translator/");
        }, 3000);
      } catch (err) {
        console.error("Error processing payment failure:", err.message);
        setTimeout(() => {
          navigate(userRole === "Customer" ? "/client/" : "/translator/");
        }, 3000);
      }
    };

    processFailure();
  }, [accountId, navigate, userRole]);

  return (
    <div className="df-container">
      <div className="df-content">
        <video autoPlay loop muted className="df-fail-icon">
          <source src={FailIcon} type="video/webm" />
          {/* Your browser does not support the video tag. */}
        </video>
        <h2 className="df-title">Payment Failed!</h2>
        <p className="df-message">
          Unfortunately, your deposit could not be processed. You will be
          redirected shortly...
        </p>
      </div>
    </div>
  );
};

export default DepositFailPage;
