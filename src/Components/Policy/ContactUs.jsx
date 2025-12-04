import React from "react";

function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>
        <p className="text-gray-700 text-center mb-8">
          We are always here to help you. For any queries related to orders,
          prasad delivery, tracking, refunds, or support — feel free to reach out.
        </p>

        {/* Contact Information Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Customer Support</h2>
          <p className="mb-2">
            📧 <strong>Email:</strong> aniketyt266@gmail.com
          </p>
          <p className="mb-2">
            📍 <strong>Location:</strong> Himachal Pradesh, India
          </p>
          <p className="mb-2">
            🕒 <strong>Support Hours:</strong> Mon – Sat, 10:00 AM – 7:00 PM
          </p>
        </div>

       
      </div>
    </div>
  );
}

export default ContactUs;
