import React from "react";

function RefundReturnPolicy() {
    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-4xl font-bold text-center mb-6">
                    Refund & Return Policy
                </h1>

                <p className="text-gray-700 mb-4">
                    Thank you for shopping with <strong>Mahakal Bhakti Bazaar</strong>.
                    As our products include sacred Prasad and perishable devotional items,
                    we follow strict hygiene and packaging guidelines. For this reason,
                    once the order is placed and confirmed, it <strong>cannot be cancelled or returned</strong>.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Eligibility for Refund</h2>
                <p className="mb-2">
                    We provide refunds only under the following conditions:
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>The order was never dispatched due to an internal error</li>
                    <li>Accidental duplicate payment for the same order</li>
                    <li>Payment deducted but order not created due to system failure</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Non-Refundable Situations</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>Order is already packed or shipped</li>
                    <li>Incorrect delivery address provided by customer</li>
                    <li>Package delay due to courier or natural circumstances</li>
                    <li>Dissatisfaction based on personal preference</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Refund Processing Time</h2>
                <p className="mb-4">
                    Refunds (if eligible) will be processed within
                    <strong> 5–7 working days </strong>
                    to the original payment source used during purchase.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Payment & Gateway Support</h2>
                <p className="mb-4">
                    All online payments are securely processed via
                    <strong> Razorpay </strong>. If a refund is approved, Razorpay will
                    handle the reversal back to your bank or wallet automatically. We do
                    not store card or banking details on our servers.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Support & Contact</h2>
                <p className="mb-4">
                    For any refund-related queries, please contact us at:
                    <br />
                    📧 <strong>aniketyt266@gmail.com</strong>
                    <br />
                    Provide your order ID and payment proof for faster resolution.
                </p>

                <p className="mt-6 font-semibold">Last Updated: 04 December 2025</p>
            </div>
        </div>
    );
}

export default RefundReturnPolicy;
