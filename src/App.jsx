// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Pages/Landingpage'; 
import ServicePage from './Pages/ServicePage';
import QuestionnaireViewer from "./Components/QuestionareViewer";
import BookingPage from './Pages/BookingPage';
import Form from './Pages/Form'
import AdminPage from './Pages/AdminPage'
function App() {
  return (
    <Router basename='/medicalconsultingg'>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Set LandingPage as default route */}
        <Route path="/services" element={<ServicePage />} />
        <Route path="/bookingpage" element={<BookingPage />} />
        <Route path="/view-response/:id" element={<QuestionnaireViewer />} />
        <Route path="/Form" element={<Form />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        {/* <Route path="/about-us" element={<AboutUs />} /> */}
        {/* <Route path="/contact-us" element={<ContactUs />} /> */}
      </Routes>
    </Router>
  );
}

export default App;