import React from "react";

function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-6">Shipping Policy</h1>

        <p className="text-gray-700 mb-4">
          Thank you for choosing <strong>Mahakal Bhakti Bazaar</strong>.
          We aim to deliver sacred Prasad and devotional items with care and
          respect, ensuring proper packaging and timely delivery across India.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Shipping Locations</h2>
        <p className="mb-4">
          We currently ship orders all across India. International shipping may
          be introduced soon and will be updated on our website.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Order Processing Time</h2>
        <p className="mb-4">
          Orders are processed within <strong>1–2 business days</strong>.
          During festivals, high-demand days, or special occasions, order processing may take longer.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Estimated Delivery Time</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Metro Cities: 3–5 days</li>
          <li>Other Cities & Towns: 5–7 days</li>
          <li>Remote / hilly regions: 7–10+ days</li>
        </ul>
        <p className="mb-4">
          Delivery time is dependent on courier operations and regional logistics availability.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Shipping Charges</h2>
        <p className="mb-4">
          Shipping charges are calculated based on order weight and location
          and will be shown at checkout before payment.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Order Tracking</h2>
        <p className="mb-4">
          Once shipped, you will receive tracking details via SMS/Email/WhatsApp
          to monitor the real-time status of your package.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Delivery Issues</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>
            If the customer provides an incorrect or incomplete address,
            shipping costs for reshipping will be the customer's responsibility.
          </li>
          <li>
            We are not responsible for courier delays caused by weather,
            festival rush, lockdowns, or logistics restrictions.
          </li>
          <li>
            If the courier marks the package as “Delivered” but you did not receive it,
            please raise an immediate complaint with courier support and inform us.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Damaged or Tampered Packages</h2>
        <p className="mb-4">
          If the package appears damaged or tampered, please record video proof while unboxing
          and email us within 24 hours so that we can resolve the issue.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Support & Contact</h2>
        <p className="mb-4">
          For shipping-related queries, contact:
          <br />
          📧 <strong>aniketyt266@gmail.com</strong>
          <br />
          Include order ID and tracking number for faster assistance.
        </p>

        <p className="mt-6 font-semibold">Last Updated: 04 December 2025</p>
      </div>
    </div>
  );
}

export default ShippingPolicy;
