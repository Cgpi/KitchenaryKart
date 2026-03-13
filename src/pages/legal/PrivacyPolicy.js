import React from "react";
import "./policy-page.css";
import { Helmet } from "react-helmet-async";
function PrivacyPolicy() {
  return (
    <div className="policy-page">
      <Helmet>
        <title>Privacy Policy | Kitchenary Kart</title>
        <meta
          name="description"
          content="Read Kitchenary Kart’s Privacy Policy to understand how we collect, use, store, and protect customer information when using our website."
        />
        <link
          rel="canonical"
          href="https://www.kitchenarykart.com/privacy-policy"
        />
      </Helmet>
      <h1>Privacy Policy</h1>
      <p>
        Welcome to Kitchenary Kart. We value customer privacy and are committed to protecting personal information. This Privacy Policy describes how we collect, use, and share information about customers when they visit or make a purchase from <a href="https://www.kitchenarykart.com" target="_blank" rel="noopener noreferrer">www.kitchenarykart.com</a>.
      </p>
      <ol>
        <li>
          <strong>Information We Collect</strong>
          <p>
            We collect various types of information in connection with the services we provide, including:
          </p>
          <ul>
            <li><strong>Personal Information:</strong> Customer name, address, phone number, email address, payment information, and other similar information.</li>
            <li><strong>Transactional Information:</strong> Purchase and return details, order history, and payment information.</li>
            <li><strong>Technical Information:</strong> IP address, browser type, operating system, and information about how customers interact with our Site.</li>
            <li><strong>Location Information:</strong> When customers use our services, we may collect information about their location.</li>
          </ul>
        </li>
        <li>
          <strong>How We Use Customer Information</strong>
          <p>
            We use customer information to:
          </p>
          <ul>
            <li>Process and fulfill orders, including managing payments, shipping, and returns.</li>
            <li>Communicate with customers about their orders, provide customer support, and respond to inquiries.</li>
            <li>Improve our Site, services, and marketing efforts.</li>
            <li>Personalize the shopping experience and recommend products.</li>
            <li>Comply with legal obligations and enforce our terms and policies.</li>
            <li>Use the data provided by customers for research and analysis to improve our products, services, and customer experience.</li>
          </ul>
        </li>
        <li>
          <strong>Sharing Customer Information</strong>
          <p>
          We may share customer information with:
          </p>
          <ul>
          <li><strong>Service Providers:</strong>  Companies that provide services on our behalf, such as payment processing, order fulfillment, and customer service.</li>
            <li><strong>Business Transfers:</strong>  In connection with any merger, sale, or transfer of our business or assets.</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and interests.</li>
          </ul>
        </li>
        <li>
          <strong>Cookies and Similar Technologies</strong>
          <p>
          We use cookies and similar technologies to enhance the customer experience on our Site. Cookies help us to:
          </p>
          <ul>
            <li>Recognize customers when they return to our Site.</li>
            <li>Understand how customers use our Site and improve its functionality.</li>
            <li>Deliver personalized advertisements.</li>
            <p>Customers can manage their cookie preferences through their browser settings.</p>
          </ul>
        </li>
        <li>
          <strong>Security</strong>
          <p>
          No security measures are completely foolproof.
          </p>
        </li>
        <li>
          <strong>Customer Choices</strong>
          <p>
          Customers have choices regarding their personal information, including:
          </p>
          <ul>
          <li><strong>Access and Correction:</strong> Customers can access and update their personal information through their account settings.</li>
            <li><strong>Marketing Communications:</strong> Customers can opt out of receiving marketing emails by following the instructions in the emails they receive.</li>
            <li><strong>Cookies:</strong> Customers can manage their cookie preferences through their browser settings.</li>
          </ul>
        </li>
        <li>
        <strong>Contact Us</strong>
        <p> If customers have any questions about this Privacy Policy or our privacy practices, please contact us at: support@kitchenarykart.com</p>
        </li>
      </ol>
    </div>
  );
}

export default PrivacyPolicy;
