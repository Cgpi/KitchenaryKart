import React from "react";
import "./policy-page.css";
import { Helmet } from "react-helmet-async";

function ShippingPolicy() {
  return (
    <div className="policy-page">
      <Helmet>
        <title>Shipping & Delivery Policy | Kitchenary Kart</title>
        <meta
          name="description"
          content="Read Kitchenary Kart’s Shipping and Delivery Policy. Learn about shipping destinations, delivery timelines, tracking, costs, and international shipping terms."
        />
        <link
          rel="canonical"
          href="https://www.kitchenarykart.com/shipping-policy"
        />
      </Helmet>
      <h1>Shipping & Delivery Policy</h1>
      <p>
        At Kitchenary Kart, we prioritize timely and efficient delivery for all orders placed through{" "}
        <a
          href="https://www.kitchenarykart.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.kitchenarykart.com
        </a>
        . This policy provides key details on our shipping terms and options.
      </p>

      <h2>Shipping Destinations</h2>
      <p>
        We ship across India and internationally under specific terms and conditions.
      </p>

      <h2>Shipping Methods & Costs</h2>
      <p>
        Shipping costs vary based on method, destination, weight, and dimensions of the order. Costs are displayed at checkout.
      </p>

      <h2>Order Processing Time</h2>
      <p>
        Orders are typically processed within:
      </p>
      <ul>
        <li>3-7 business days for Western India,</li>
        <li>3-15 business days for other parts of India,</li>
        <li>15-45 business days for international destinations.</li>
      </ul>
      <p>
        <strong>Note:</strong> Orders placed on weekends or holidays are processed the next business day.
      </p>

      <h2>Delivery Timeframes (Estimated)</h2>
      <ul>
        <li><strong>Western India:</strong> 0-7 business days</li>
        <li><strong>Other Indian regions:</strong> 3-15 business days</li>
        <li><strong>International:</strong> 15-45 business days</li>
      </ul>
      <p>
        Delivery times are estimates and may vary due to external factors such as carrier delays, weather, remote locations, or hilly terrains.
      </p>

      <h2>Order Tracking</h2>
      <p>
        Upon shipment, the customer will receive a tracking number in order to track the order.
      </p>

      <h2>Shipping Restrictions</h2>
      <p>
        Some products may have shipping restrictions due to size, weight, or regulations. Any restrictions will be noted.
      </p>

      <h2>Shipping to Multiple Addresses</h2>
      <p>For multiple addresses, please place separate orders for each location. Shipping charges will apply to each order.</p>

      <h2>Undeliverable Packages</h2>
      <p>If a package is returned to us as undeliverable, we will contact the customer to arrange for reshipment. Additional charges may apply.</p>

      <h2>Damaged or Lost Packages</h2>
      <p>If package arrives damaged or is lost, please contact our customer service within 7 days of the estimated delivery date.</p>

      <h2>Contact Us</h2>
      <p>For any questions or concerns about our Shipping and Delivery Policy, please reach out at support@kitchenarykart.com or call 880687419.</p>
    </div>
  );
};

export default ShippingPolicy;