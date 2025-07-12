import Header from "../../component/layout/Header/Header";
import Footer from "../../component/layout/Footer/Footer";
const ClientLayout = ({ children }) => {
  return (
    <div className="client-layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
