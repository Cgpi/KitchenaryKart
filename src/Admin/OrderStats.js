import React, { useEffect, useState } from "react";  
import axios from "axios";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer 
} from "recharts";
import dayjs from "dayjs";

const OrderStats = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(""); // New state for selected year
  const [selectedMonth, setSelectedMonth] = useState(""); // New state for selected month
  const [monthWiseData, setMonthWiseData] = useState({}); // Store month-wise data

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Orders/all`   ,{headers: {
      "x-Authorization": `Bearer ${token}`,
    },});
      const updatedOrders = await Promise.all(response.data.map(async (order) => {
        const updatedItems = await Promise.all(order.items.map(async (item) => {
          try {
          
            const productResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/show/${item.product.id}`);
            const updatedProduct = productResponse.data;
            const variant = updatedProduct.variants.find(v => v.id === item.variantId) || item.product.variants[0];

            return {
              ...item,
              product: {
                ...updatedProduct,
                variants: [variant],
              },
            };
          } catch {
            return item; // Fallback to old product details if the request fails
          }
        }));

        return { ...order, items: updatedItems };
      }));

      setOrders(updatedOrders);
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Group data by product and month
    const newMonthWiseData = {};

    orders.forEach(order => {
      const month = dayjs(order.orderDate || order.date).format("MMM YYYY");

      order.items.forEach(item => {
        const product = item.product;
        const variant = product?.variants?.[0];

        const productVariantKey = variant
          ? `${product.name} (Code: ${variant.productCode}, ${variant.color}, ${variant.dimensions})`
          : `${product.name} `;

        if (!newMonthWiseData[month]) {
          newMonthWiseData[month] = { month };
        }

        newMonthWiseData[month][productVariantKey] = (newMonthWiseData[month][productVariantKey] || 0) + item.quantity;
      });
    });

    setMonthWiseData(newMonthWiseData);
  }, [orders]);

  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-stone-300 border-t-red-600"></div>
    </div>
  );
  if (error) return <p className="text-red-600 font-semibold p-4">{error}</p>;

  const months = Object.keys(monthWiseData); // All available months (in MMM YYYY format)
  const years = [...new Set(months.map(month => dayjs(month, "MMM YYYY").year()))]; // Extract unique years

  // Extract unique month names for the dropdown (e.g., "Jan", "Feb", etc.) across all years
  const monthNames = [...new Set(months.map(month => dayjs(month, "MMM YYYY").format("MMM")))];
  
  // Filtering logic: Filter months based on selected year and month
  const filteredMonthData = months.filter(month => {
    const monthYear = dayjs(month, "MMM YYYY");
    const matchesYear = selectedYear ? monthYear.year() === parseInt(selectedYear) : true;
    const matchesMonth = selectedMonth ? monthYear.format("MMM") === selectedMonth : true;
    return matchesYear && matchesMonth;
  });

  const chartData = filteredMonthData.map(month => monthWiseData[month]);

  // Dynamically extract products to create bars
  const products = new Set();
  chartData.forEach(entry => {
    Object.keys(entry).forEach(key => {
      if (key !== "month") products.add(key);
    });
  });
  // Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-stone-200 rounded-lg shadow-lg p-3 text-sm text-left max-w-xs">
        <p className="font-bold text-stone-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="m-0 text-xs">
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">📊 Monthly Product Analytics</h2>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 min-w-[120px]"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 min-w-[120px]"
            >
              <option value="">All Months</option>
              {monthNames.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-5 overflow-x-auto">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 60, bottom: 50 }}
          >
            <XAxis dataKey="month" type="category" tick={{ fontSize: 12 }} />
            <YAxis type="number" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          {[...products].map((product, index) => (
            <Bar 
              key={index} 
              dataKey={product} 
              fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} 
              barSize={20} 
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderStats;
