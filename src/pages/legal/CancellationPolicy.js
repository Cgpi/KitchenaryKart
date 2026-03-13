import React from "react";
import "./policy-page.css";
import { Helmet } from "react-helmet-async";

const CancellationPolicy = () => {
  return (
    <div className="policy-page">
      <Helmet>
        <title>Cancellation Policy | Kitchenary Kart</title>
        <meta
          name="description"
          content="Read Kitchenary Kart’s cancellation policy. Learn when and how orders can be cancelled before dispatch, along with contact details for support."
        />
        <link
          rel="canonical"
          href="https://www.kitchenarykart.com/cancellation-policy"
        />
      </Helmet>
      <h1>Cancellation Policy</h1>
      <p>
        At Kitchenary Kart, we prioritize fast and efficient order processing to
        ensure that our customers receive their items as quickly as possible.
        Our cancellation policy is designed to provide flexibility before
        shipment while maintaining streamlined operations. Our cancellation
        policy allows customers to cancel orders only if the item has not yet
        been dispatched. We encourage customers to review their orders carefully
        before finalizing to avoid any inconvenience.
      </p>
      <div className="contact-info">
        <p>
          <strong>Contact Us:</strong>+91 8806807419
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@kitchenarykart.com">support@kitchenarykart.com</a>
        </p>
      </div>
    </div>
  );
};

export default CancellationPolicy;
