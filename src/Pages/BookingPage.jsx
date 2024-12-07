//BookingPage.jsx 
import React, { useState,useEffect,navigate } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import emailjs from "emailjs-com";
import Header from "../Components/Header";
import { v4 as uuidv4 } from "uuid"

const BookingPage = () => {
  const location = useLocation();
  const {selectedService, selectedOption } = location.state || {}; // Destructure state to get selectedOption
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleMouseEnter = () => setIsDropdownVisible(true);
  const handleMouseLeave = () => setIsDropdownVisible(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [ironStatus, setIronStatus] = useState(""); 
  
  

  const questionnaires = {
    "Morning Sickness": [
    "Do certain smells or foods trigger your symptoms?",
    "Have you tried any remedies for morning sickness?",
    "Are you open to one-on-one counseling or group therapy?",
  ],
  "Heartburn": [
    "Are you currently taking any medication for heartburn?",
    "What foods or drinks trigger your heartburn symptoms?",
    "How often do you experience heartburn?",
  ],
  "Allergy": [
    "What specific allergy symptoms are you experiencing?",
    "Do you know what triggers your allergies?",
    "Are you taking any allergy medications currently?",
  ],
  "Nicotine Replacement Therapy": [
    "Have you used nicotine replacement products before?",
    "Are you currently using any nicotine replacement products?",
    "What is your daily nicotine intake?",
  ],
  "Behavioral Support": [
    "Have you received behavioral support for quitting smoking before?",
    "What types of behavioral therapy have you tried?",
    "Are you open to one-on-one counseling or group therapy?",
  ],
  "Prescription Method": [
    "Have you used prescription medication to quit smoking?",
    "Are you currently using any prescription medications for smoking cessation?",
    "Have you experienced any side effects from prescription medications?",
  ],
  "Blood Sugar Management":[
    "What is your current age?",
    "How long have you had diabetes",
    "How often should you check your blood sugar?",
  ],
  "Nutrition Counseling":[
    "How often do you eat per day?",
    "What food do you dislike of avoid?",
    "Do you eat infront of screens(Tv,phone,computer)?",
  ],"Lifestyle Management":[
    "What type of physical activities do you enjoy(walking,running,swimming)?",
    "What is your typical bedtime and wake-up time?",
    "What time of day do you prefer to be active?",
  ]
  };
  const questions = questionnaires[selectedOption] || [];
  if (questions.length === 0) {
    console.error('No questions found for selected option:', selectedOption);
  }

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    state: "",
    postalCode: "",
    city: "",
    radioans:"",
    gender:"",
    iron:"",
    supplementInput:"",
    additionalInfo:"",
    selectedService:selectedService,
    selectedOption:selectedOption,
    selectedDate: selectedDate.toDateString(),
    selectedTimeSlot:selectedTimeSlot,
    A1: '',
    A2: '',
    A3: '',
    Q1: questions[0],
    Q2: questions[1],
    Q3: questions[2],
  });
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      selectedDate: selectedDate.toDateString(),
      selectedTimeSlot: selectedTimeSlot,
    }));
  }, [selectedDate, selectedTimeSlot]);
    
  const generateTimeSlots = () => {
    const slots = [];
    const startTime = 18 * 60; // 6:00 PM in minutes
    const endTime = 23 * 60 + 45; // 11:45 PM in minutes
    for (let time = startTime; time <= endTime; time += 15) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      slots.push(`${hours}:${minutes < 10 ? "0" + minutes : minutes}`);
    }
    return slots;
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsFormVisible(true);
  };
  const handleBooking = (e) => {
    e.preventDefault();
    const bookingData = {
      ...formData,
      questions: questions.map((question, index) => ({
        question: question,
        answer: formData[`A${index + 1}`],  // Answer for each question
      })),
    };
  
    console.log("Booking Data:", bookingData); // See the saved data structure
  
    //  // Send email to the user
    emailjs
      .send(
        "service_rz4nkfn", // Replace with your EmailJS Service ID
        "template_diwk1tv", // Replace with your EmailJS Template ID
        {
          fullName: formData.fullName,
          email: formData.email,
          country: formData.country,
          state: formData.state,
          postalCode: formData.postalCode,
          
          city: formData.city,
          selectedDate: selectedDate.toDateString(),
          selectedTimeSlot,
        },
        "5AJUoHdUJ45Su4wQI" // Replace with your EmailJS User ID
      )
      .then(
        (result) => {
          alert("Booking confirmed! A confirmation email has been sent.");
          setIsFormVisible(false);
        },
        (error) => {
          console.error("Error sending email:", error);
          alert("Failed to send confirmation email. Please try again.");
        }
      );
      const uniqueId = uuidv4();
const adminLink = `${window.location.origin}/medicalconsultingg/view-response/${uniqueId}`;
// const bookingData = { ...formData, selectedDate: selectedDate.toDateString(), selectedTimeSlot };
console.log("Unique ID:", uniqueId);
console.log("Booking Data:", bookingData);
localStorage.setItem(uniqueId, JSON.stringify(bookingData));

    
//admin
emailjs
.send(
  "service_rz4nkfn", // Your EmailJS Service ID
  "template_rh5kyj6", // Your EmailJS Template ID
  {
    ...formData,
       admin_link: adminLink,
    service: selectedService,
option: selectedOption,
    from_name: formData.fullName,
    from_email: formData.email,
    booking_date: selectedDate.toDateString(),
    selectedTimeSlot: selectedTimeSlot,
    Q1: questions[0],
    A1: formData.A1,
    Q2: questions[1],
    A2: formData.A2,
    Q3: questions[2],
    A3: formData.A3,
  },
  "5AJUoHdUJ45Su4wQI" // Your EmailJS User ID
)
.then(
  (result) => {
    alert("Booking confirmed! A confirmation email has been sent.");
  },
  (error) => {
    console.error("Error sending email:", error);
    alert("Failed to send confirmation email. Please try again.");
  }
);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIronStatus(value); 
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      
    }));
  };
  return (
    <div>
      <Header
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        isDropdownVisible={isDropdownVisible} />
      <main className="max-w-7xl mx-auto p-6">
        <h1
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: "#f49e1e" }}
        >
            Booking {selectedService}: {selectedOption}
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Calendar Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Select Booking Date</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
              minDate={new Date()}
            />
            <p className="mt-4 text-gray-700">
              Selected Date: {selectedDate.toDateString()}
            </p>
          </div>

          {/* Time Slot Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
  <h2 className="text-xl font-bold mb-4">Select Time Slot</h2>
  <div className="mt-4">
    <form onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {generateTimeSlots().map((slot) => (
          <div key={slot} className="flex items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition-colors">
            <input
              type="radio"
              id={slot}
              name="timeSlot"
              value={slot}
              className="mr-2"
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              required
            />
            <label htmlFor={slot} className="text-center font-semibold">{slot}</label>
          </div>
        ))}
      </div>
      <button
                    type="submit"
                    className="mt-4 text-white px-4 py-2 rounded hover:bg-green-600"style={{ backgroundColor: "#f49e1e" }}
                  >
                    Time Selected
                  </button>
    </form>
  </div>
</div>

        </div>
      </main>
      {isFormVisible && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-y-auto" style={{ maxHeight: '80vh' }}>
      <h2 className="text-2xl font-bold mb-4">
        Booking on {selectedDate.toDateString()} at {selectedTimeSlot}
      </h2>
      <form onSubmit={handleBooking}>
        <input
          name="fullName"
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleInputChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleInputChange}
          required
        />
        <input
          name="country"
          type="text"
          placeholder="Country"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleInputChange}
          required
        />
        <input
          name="state"
          type="text"
          placeholder="State"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleInputChange}
          required
        />
        <input
          name="postalCode"
          type="text"
          placeholder="Postal Code"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleInputChange}
          required
        />
        <input
          name="city"
          type="text"
          placeholder="City"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleInputChange}
          required
        />
          <div className="mb-4">
  <label className="block font-semibold mb-2">What gender were you assigned at birth?</label>
  <div className="flex space-x-4 mb-2">
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="gender"
        value="female"
        onChange={handleInputChange}
        className="form-radio text-blue-500"
      />
      <span>Female</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="gender"
        value="male"
        onChange={handleInputChange}
        className="form-radio text-blue-500"
      />
      <span>Male</span>
    </label>
  </div>
  {/* If additional questions need an input based on gender selection */}
  {formData.gender && (
    <div className="mt-4">
      <input
        type="text"
        name="additionalInfo"
        placeholder="Please provide additional info (optional)"
        className="w-full p-2 border rounded"
        onChange={handleInputChange}
      />
    </div>
  )}
</div>

          
<div className="mb-4">
  <label className="block font-semibold mb-2">Are you currently taking iron-containing vitamins or prenatal supplements?</label>
  <div className="flex space-x-4 mb-2">
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="iron"
        value="yes"
        onChange={handleInputChange}
        className="form-radio text-blue-500"
      />
      <span>Yes</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="iron"
        value="no"
        onChange={handleInputChange}
        className="form-radio text-blue-500"
      />
      <span>No</span>
    </label>
  </div>

  {/* Conditionally render input field if 'Yes' is selected */}
  {ironStatus === "yes" && (
    <div className="mt-4">
      <label className="block font-semibold mb-2">
        Please specify the supplements you're taking:
      </label>
      <input
        type="text"
        name="supplementInput"
        className="w-full p-2 border rounded"
        onChange={handleInputChange}
        value={formData.supplementInput || ""} 
        placeholder="Enter supplements here"
      />
    </div>
  )}
</div>


       
        {questions.map((question, index) => (
  <div key={index} className="mb-4">
    <label className="block font-semibold mb-2">{question}</label>
    {question === "Do certain smells or foods trigger your symptoms?" ? (
      <div>
        {/* Radio Buttons */}
        <div className="flex space-x-4 mb-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name={`A${index + 1}`}
              value="yes"
              className="form-radio text-orange-500"
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  [`A${index + 1}`]: e.target.value,
                }))
              }
              checked={formData[`A${index + 1}`] === "yes"}
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name={`A${index + 1}`}
              value="no"
              className="form-radio text-orange-500"
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  [`A${index + 1}`]: e.target.value,
                  [`triggerInput${index + 1}`]: "", // Reset input on "No"
                }))
              }
              checked={formData[`A${index + 1}`] === "no"}
            />
            <span>No</span>
          </label>
        </div>

        {/* Conditional Input Field */}
        {formData[`A${index + 1}`] === "yes" && (
          <input
            type="text"
            name="radioans"
          placeholder="Full Name"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleInputChange}
          required
          
          />
        )}
      </div>
    ) : (
      // Default Input Field for Other Questions
      <input
        type="text"
        name={`A${index + 1}`}
        className="w-full p-2 border rounded-lg"
        value={formData[`A${index + 1}`]}
        onChange={(e) =>
          setFormData((prevData) => ({
            ...prevData,
            [`A${index + 1}`]: e.target.value,
          }))
        }
        required
      />
    )}
  </div>
))}



        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Book Now
        </button>
        <button
          onClick={() => setIsFormVisible(false)}
          className="mt-4 ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
};
export default BookingPage;