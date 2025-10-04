import { FaGift, FaUserEdit, FaCreditCard, FaChurch, FaTruck } from "react-icons/fa";

const steps = [
    {
        id: 1,
        title: "🙏 Choose Your Blessing",
        description: "Select from Prasad, Rudraksha, or Other Items.",
        icon: <FaGift className="text-white text-2xl" />,
    },
    {
        id: 2,
        title: "📝 Add Your Details",
        description: "Enter name & delivery address with devotion.",
        icon: <FaUserEdit className="text-white text-2xl" />,
    },
    {
        id: 3,
        title: "💳 Confirm & Pay",
        description: "Complete your booking with a safe & secure payment.",
        icon: <FaCreditCard className="text-white text-2xl" />,
    },
    {
        id: 4,
        title: "⛪ Temple Offering",
        description: "Your Prasad is offered at the temple with rituals.",
        icon: <FaChurch className="text-white text-2xl" />,
    },
    {
        id: 5,
        title: "🏠 Home Delivery",
        description: "Receive sanctified Prasad & items at your doorstep.",
        icon: <FaTruck className="text-white text-2xl" />,
    },
];


export default function HowItWorks() {
    return (
        <section className="py-12 bg-gradient-to-br from-orange-50 via-white to-orange-100">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                How it works?
            </h2>
            <div className="relative max-w-5xl mx-auto">
                <div className="absolute top-10 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-400 hidden md:block"></div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 relative z-10">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg mb-4">
                                {step.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                            <p className="text-sm text-gray-600 mt-2">{step.description}</p>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
