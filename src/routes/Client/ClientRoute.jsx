import { Routes, Route } from "react-router-dom";
import Homepage from "../../page/Homepage/Homepage";
import DNATestingService from "../../page/Client/DNATestingService/DNATestingService";
import DNATestingServiceDetail from "../../page/Client/DNATestingService/DNATestingServiceDetail";
import NewsBlog from "../../page/Client/NewBlog/NewsBlog";
const ClientRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/booking" element={<DNATestingService />} />
      <Route path="/service/:id" element={<DNATestingServiceDetail />} />
      <Route path="/blog" element={<NewsBlog />} />
    </Routes>
  );
};

export default ClientRoute;
