import React from "react";

const StickyWhatsApp = () => {
    const phoneNumber = "919890352455"; // ← replace with your WhatsApp number
    const message = "Hello, I need help with a product.";

    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-5 right-5 w-15 h-15 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300 z-50 cursor-pointer"
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-8 h-8"
            />
        </a>
    );
};

export default StickyWhatsApp;
