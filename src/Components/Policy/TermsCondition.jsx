import React from "react";

function TermsCondition() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-6">
          Terms & Conditions
        </h1>

        <p className="text-gray-700 mb-4">
          Welcome to <strong>Mahakal Bazar</strong>. By accessing or purchasing from our platform, you agree to the following terms and conditions. Please read them carefully before placing any order.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">General Use</h2>
        <p className="mb-4">
          By using our website, you confirm that all information provided at the time of registration or placing an order is accurate and complete. We reserve the right to update or modify these terms at any time.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Products & Services</h2>
        <p className="mb-4">
          Mahakal Bhakti Bazaar provides Bhakti-related items, Prashad, Pooja materials, and premium devotional products. Product images may slightly differ from the actual items due to photography and lighting.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Pricing & Payment</h2>
        <p className="mb-4">
          Prices listed on our website are final and inclusive of applicable taxes. We use <strong>Razorpay</strong> as a secure payment gateway for online transactions. We do not store any card or banking information on our servers.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Order Confirmation</h2>
        <p className="mb-4">
          After placing an order, you will receive an email/SMS confirmation. In case of payment failure or confirmation issues, please contact our support team.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Shipping & Delivery</h2>
        <p className="mb-4">
          Orders are shipped through reliable courier services across India. Delivery time may vary based on location, festivals, and logistics constraints. We are not responsible for delays caused by courier partners or natural circumstances.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Refund & Cancellation</h2>
        <p className="mb-4">
          Refunds are applicable only for cancelled or failed transactions and will be processed by Razorpay within 5–7 business days. Once an order is packed or shipped, cancellation is not allowed for hygiene & prasad-related items.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Prohibited Activities</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Sharing fake information or fraudulent transactions</li>
          <li>Illegal or unauthorized resale of products</li>
          <li>Misuse of website content, images, or brand identity</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Intellectual Property</h2>
        <p className="mb-4">
          All content, images, and designs on this site are the property of <strong>Mahakal Bazar</strong>. Copying or redistribution without written permission is prohibited.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
        <p className="mb-4">
          We are not responsible for product misuse, courier handling damage, or delays beyond our control. Maximum liability for any order is limited to the product purchase value.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Information</h2>
        <p className="mb-4">
          For any queries, complaints, or support, contact us at:
          <br />📧 <strong>aniketyt266@gmail.com</strong>
        </p>

        <p className="mt-6 font-semibold">Last Updated: 04 December 2025</p>
      </div>
    </div>
  );
}

export default TermsCondition;
