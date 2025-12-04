import React from "react";

function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-xl">
                <h1 className="text-4xl font-bold mb-6 text-center">
                    Privacy Policy
                </h1>

                <p className="text-gray-700 mb-4">
                    Welcome to <strong>Mahakal Bhakti Bazaar</strong>. We value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you access or purchase from our website.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Information We Collect</h2>
                <p className="mb-4">
                    We collect personal details including your name, email, phone number, delivery address, and order/payment information. This helps us process your orders and provide better service.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Payment & Razorpay Security</h2>
                <p className="mb-4">
                    We use <strong>Razorpay</strong> as our trusted and secure payment gateway. Razorpay uses industry-standard <strong>256-bit SSL encryption</strong> to protect financial data. We do <strong>not</strong> store card or UPI numbers, CVV, or banking passwords on our servers.
                </p>
                <p className="mb-4">
                    All payments are processed securely through Razorpay, and we only receive transaction status confirmations required for order verification.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Use of Personal Data</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>To process and deliver orders</li>
                    <li>To provide order updates and customer support</li>
                    <li>To improve our website user experience</li>
                    <li>To prevent fraud and maintain security</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Sharing of Information</h2>
                <p className="mb-4">
                    We never sell or share your data with any unauthorized party. Data is shared only with delivery partners (for shipping) and payment processors like Razorpay (for payment validation).
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Cookies</h2>
                <p className="mb-4">
                    Our website uses cookies to enhance user experience, track cart items, and remember preferences. You may disable cookies from your browser settings.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Delivery & Order Processing</h2>
                <p className="mb-4">
                    We deliver Prashad and Bhakti products across India using trusted courier services. Delivery timelines may vary by location and festival rush periods.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Refund & Cancellation</h2>
                <p className="mb-4">
                    Refunds for failed or cancelled transactions are processed automatically by Razorpay within 5-7 business days. For product issues, customers can contact support with proof.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
                <p className="mb-4">
                    For questions regarding privacy or data security, you can contact us at:
                    <br />📧 <strong>aniketyt266@gmail.com</strong>
                </p>

                <p className="mt-6 font-semibold">Last Updated: 04 December 2025</p>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
