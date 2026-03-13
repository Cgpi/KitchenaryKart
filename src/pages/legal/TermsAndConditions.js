import React from "react";
import "./policy-page.css";
import { Helmet } from "react-helmet-async";

function TermsPolicy() {
  return (
    <div className="policy-page">
       <Helmet>
        <title>Terms and Conditions | Kitchenary Kart</title>

        <meta
          name="description"
          content="Read the Terms and Conditions of Kitchenary Kart. Learn about usage, orders, payments, liability, and legal policies governing our website."
        />

        <link
          rel="canonical"
          href="https://www.kitchenarykart.com/terms-policy"
        />
      </Helmet>
      <h1>Terms And Conditions</h1>
      <p>
      Welcome to Kitchenary Kart. By accessing or using our website www.kitchenarykart.com, customers agree to be bound by the following terms and conditions. Please read them carefully.
      </p>
      <ol>
        <li>
          <strong>Acceptance of Terms</strong>
          <p>
          By using our Site, customers agree to comply with and be legally bound by these Terms and Conditions, whether or not they become a registered user of the services.
          </p>
        </li>
        <li>
          <strong>Privacy Policy</strong>
          <p>
          Our Privacy Policy governs the collection, use, and sharing of personal information. Customers are encouraged to review our Privacy Policy to understand our practices.
          </p>
        </li>
        <li>
          <strong>Account Registration</strong>
          <p>
          Customers may be required to create an account to access certain features of the Site. Customers agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. Customers are responsible for safeguarding their passwords and agree not to disclose their passwords to any third party.
          </p>
        </li>
        <li>
          <strong>Orders and Payments</strong>
          <p>
          All orders placed through our Site are subject to acceptance. We reserve the right to refuse or cancel any order for reasons under our control. Customers agree to provide current, complete, and accurate purchase and account information for all purchases made through our Site. Customers agree to promptly update their account and other information, including email address and payment method, so that we can complete their transactions and contact them as needed.
          </p>
        </li>
        <li>
          <strong>Pricing and Availability</strong>
          <p>
          All prices are subject to change without notice. We strive to display accurate pricing information; however, we may, on occasion, make inadvertent typographical errors, inaccuracies, or omissions related to pricing and availability. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
          </p>
        </li>
        <li>
          <strong>Shipping and Delivery</strong>
          <p>
          Shipping and delivery times may vary based on the shipping method selected and the destination. Customers will receive a shipping confirmation email once their order has shipped. We are not responsible for delays caused by the carrier or by circumstances beyond our control.
          </p>
        </li>
        <li>
          <strong>Returns and Exchanges</strong>
          <p>
          Our return and exchange policy governs the conditions under which products may be returned or exchanged. Customers are encouraged to review our Return Policy for detailed information on how to return or exchange a product.
          </p>
        </li>
        <li>
          <strong>Intellectual Property</strong>
          <p>
          All content included on the Site, such as text, graphics, logos, images, audio clips, digital downloads, and software, is the property of Kitchenary Kart or its content suppliers and is protected by Indian and international copyright laws. Customers may not use, reproduce, or distribute any content from the Site without our express written permission.
          </p>
        </li>
        <li>
          <strong>Prohibited Conduct</strong>
          <p>
          Customers agree not to engage in any of the following prohibited activities:
          </p>
          <ul>
            <li>Violating any applicable law or regulation.</li>
            <li>Infringing upon the intellectual property rights of others.</li>
            <li>Engaging in any activity that is harmful, fraudulent, deceptive, or misleading.</li>
            <li>Interfering with the operation of the Site or the servers or networks used to make the Site available.</li>
          </ul>
        </li>
        <li>
          <strong>Disclaimer</strong>
          <p>
          Please note that our products are designed exclusively to bring about a high degree of efficiency in food-making and ancillary processes. We strongly advise users to prioritize safety at all times while using them. While proper and safe use of the product is a basic necessity, it may be duly noted that any improper or mishandling may lead to injuries, ranging from temporary to permanent ones to even life-threatening in extreme cases. Buyers are advised to use products correctly and responsibly to avoid any risks arising from incorrect usage. They are also advised to keep the items out of reach of children or those unable to handle them properly.
          </p>
        </li>
        <li>
          <strong>Limitation of Liability</strong>
          <p>
          To the maximum extent permitted by law, Kitchenary Kart shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (i) customer access to or use of or inability to access or use the Site; (ii) any conduct or content of any third party on the Site; (iii) any content obtained from the Site; and (iv) unauthorized access, use, or alteration of customer transmissions or content.
          </p>
        </li>
        <li>
          <strong>Governing Law</strong>
          <p>
          These Terms and Conditions are governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Customers agree to submit to the exclusive jurisdiction of the courts located in Pune Jurisdiction for the resolution of any disputes.
          </p>
        </li>
        <li>
          <strong>Contact Us</strong>
          <p>
          If customers have any questions or concerns about these Terms and Conditions, please contact us at: support@kitchenarykart.com
          </p>
        </li>
        
    </ol>
    </div>
  );
};

export default TermsPolicy;