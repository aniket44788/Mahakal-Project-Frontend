import { toast } from "react-toastify";

export const toastSuccess = (msg) => {
    toast.success(msg);
};

export const toastError = (msg) => {
    toast.error(msg);
};

export const toastInfo = (msg) => {
    toast.info(msg);
};

export const toastWarning = (msg) => {
    toast.warning(msg);
};


export const toastOrderSuccess = () => {
    toast.success(
        <div className="space-y-1">
            <p className="font-semibold text-green-700 text-sm">
                🎉 Order Placed Successfully
            </p>
            <p className="text-xs text-gray-700">
                Thank you for shopping with <strong>Mahakal Bazar</strong>.
            </p>
            <p className="text-xs text-gray-600">
                Your order will be delivered very soon 🙏
            </p>
            <p className="text-xs text-orange-600 font-medium">
                Order again for divine & best products 🕉️
            </p>
        </div>,
        {
            autoClose: 5000,
        }
    );
};