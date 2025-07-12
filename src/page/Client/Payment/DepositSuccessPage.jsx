import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkPayment } from "../../../service/paymentService";
import SuccessIcon from "../../../assets/SuccessIcon.webm";
import "./DepositSuccessPage.scss";

const DepositSuccessPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const accountId = user?.id;
  const userRole = user?.role;

  useEffect(() => {
    const processSuccess = async () => {
      const paymentInfo = JSON.parse(sessionStorage.getItem("payment") || "{}");
      if (!paymentInfo || !accountId) {
        setTimeout(() => {
          navigate(
            userRole === "Customer" ? "/client/wallet" : "/translator/wallet"
          );
        }, 3000);
        return;
      }

      try {
        const { orderCode } = paymentInfo;
        const checkResult = await checkPayment(orderCode);
        if (checkResult?.message === "Payment status checked successfully.") {
          sessionStorage.removeItem("payment");
        }
        setTimeout(() => {
          navigate(userRole === "Customer" ? "/client/" : "/translator/");
        }, 3000);
      } catch (err) {
        console.error("Error processing payment success:", err.message);
        setTimeout(() => {
          navigate(userRole === "Customer" ? "/client/" : "/translator/");
        }, 3000);
      }
    };

    processSuccess();
  }, [accountId, navigate, userRole]);

  return (
    <div className="ds-container">
      <div className="ds-content">
        <video autoPlay loop muted className="ds-success-icon">
          <source src={SuccessIcon} type="video/webm" />
        </video>
        <h2 className="ds-title">Payment Successful!</h2>
        <p className="ds-message">
          Congratulations! Your deposit has been processed successfully. You
          will be redirected shortly...
        </p>
      </div>
    </div>
  );
};

export default DepositSuccessPage;
