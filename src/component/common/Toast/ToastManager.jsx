import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastDelay = 1000;
let lastToastTime = 0;

const showToast = (message, type) => {
  const currentTime = Date.now();
  if (currentTime - lastToastTime < toastDelay) {
    return;
  }

  lastToastTime = currentTime;

  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast.info(message);
      break;
    default:
      toast(message);
  }
};

const showSuccess = (message) => showToast(message, "success");
const showError = (message) => showToast(message, "error");
const showInfo = (message) => showToast(message, "info");

export default {
  showSuccess,
  showError,
  showInfo,
};
