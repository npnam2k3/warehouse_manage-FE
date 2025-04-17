import { createContext } from "react";
import { toast, ToastContainer } from "react-toastify";

export const ToastContext = createContext();
export const ToastProvider = ({ children }) => {
  const value = {
    toast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ToastContext.Provider>
  );
};
