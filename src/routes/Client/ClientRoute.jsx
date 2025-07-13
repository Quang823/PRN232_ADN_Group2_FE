import { Routes, Route } from "react-router-dom";
import Homepage from "../../page/Homepage/Homepage";
import DNATestingService from "../../page/Client/DNATestingService/DNATestingService";
import DNATestingServiceDetail from "../../page/Client/DNATestingService/DNATestingServiceDetail";
import NewsBlog from "../../page/Client/NewBlog/NewsBlog";
import ProfilePage from "../../page/Client/Profile/ProfilePage";
import BookingHistoryPage from "../../page/Client/BookingHistory/BookingHistoryPage";
const ClientRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/booking" element={<DNATestingService />} />
      <Route path="/service/:id" element={<DNATestingServiceDetail />} />
      <Route path="/blog" element={<NewsBlog />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/appointmentHistory" element={<BookingHistoryPage />} />
    </Routes>
  );
};

export default ClientRoute;
