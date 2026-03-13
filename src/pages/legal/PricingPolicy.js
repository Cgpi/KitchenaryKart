import React from "react";
import "./policy-page.css";
import { Helmet } from "react-helmet-async";
const PricingPolicy = () => {
    return (
      <div className="policy-page">
        <Helmet>
        <title>Pricing Policy | Kitchenary Kart</title>
        <meta
          name="description"
          content="Learn about Kitchenary Kart’s pricing policy, including transparent pricing, taxes, discounts, and competitive market-based product pricing."
        />
        <link
          rel="canonical"
          href="https://www.kitchenarykart.com/pricing-policy"
        />
      </Helmet>
        <h1>Pricing Policy</h1>
        <p>
        Kitchenary Kart ensures customers receive high-quality kitchen equipment 
        and accessories at fair, competitive prices. Our pricing is set based on 
        current market trends, product quality, and operational costs, 
        with regular promotions or discounts to provide added value.
         All prices listed on our website are fully transparent, inclusive of applicable taxes, and do not include any hidden fees or unexpected charges at checkout. 
         We continuously monitor market changes to maintain our competitive pricing, and customers are encouraged to check product pages for up-to-date pricing and offers.
        </p>
      </div>
  );
};

export default PricingPolicy;
