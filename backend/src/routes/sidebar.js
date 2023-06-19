import {
  FiGrid,
  FiUsers,
  FiUser,
  FiCompass,
  FiSettings,
  FiSlack,
  FiGlobe,
  FiTarget,
} from "react-icons/fi";

/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const sidebar = [
  {
    path: "/dashboard", // the url
    icon: FiGrid, // icon
    name: "Dashboard", // name that appear in Sidebar
  },

  {
    icon: FiSlack,
    name: "Sales Report",
    routes: [
      {
        path: "/products",
        name: "Sales Summary",
      },
      {
        path: "/categories",
        name: "Sales by product",
      },
      {
        path: "/attributes",
        name: "Sales by collection",
      },
      {
        path: "/coupons",
        name: "Sales by tags",
      },
      {
        path: "/coupons",
        name: "Sales by vendor",
      },
    ],
  },

  {
    path: "/customers",
    icon: FiUsers,
    name: "Customers Report",
    routes: [
      {
        path: "/products",
        name: "Customer Information",
      },
      {
        path: "/categories",
        name: "Most Valuable Customers",
      },
      {
        path: "/attributes",
        name: "Returning Customers",
      },
      {
        path: "/coupons",
        name: "First Time/New Customers",
      },
      {
        path: "/coupons",
        name: "Outstanding Customer Payments",
      },
    ],
  },

  {
    path: "/orders",
    icon: FiCompass,
    name: "Orders Report",
    routes: [
      {
        path: "/products",
        name: "Order Summary",
      },
      {
        path: "/categories",
        name: "Order by product",
      },
      {
        path: "/attributes",
        name: "Order by collection",
      },
      {
        path: "/coupons",
        name: "Order by tags",
      },
      {
        path: "/coupons",
        name: "Order by vendor",
      },
    ],
  },

  {
    path: "/our-staff",
    icon: FiUser,
    name: "Product & variant Report",
    routes: [
      {
        path: "/products",
        name: "Best selling products",
      },
      {
        path: "/categories",
        name: "Dead products",
      },
      {
        path: "/attributes",
        name: "High risk products",
      },
      {
        path: "/coupons",
        name: "products by collection",
      },
      {
        path: "/coupons",
        name: "products by vendor",
      },
    ],
  },

  {
    path: "/our-staff",
    icon: FiUser,
    name: "Collections & tags Report",
    routes: [
      {
        path: "/products",
        name: "Top Collections",
      },
      {
        path: "/categories",
        name: "Dead collections",
      },
      {
        path: "/attributes",
        name: "Collection by location",
      },
      {
        path: "/coupons",
        name: "Collection by vendor",
      },
      {
        path: "/coupons",
        name: "Collection by type",
      },
    ],
  },

  {
    path: "/our-staff",
    icon: FiUser,
    name: "Inventory Report",
    routes: [
      {
        path: "/products",
        name: "Inventory by location",
      },
      {
        path: "/categories",
        name: "Inventory by location by product",
      },
      {
        path: "/attributes",
        name: "Inventory by location by product type",
      },
      {
        path: "/coupons",
        name: "Inventory by location by variant",
      },
      {
        path: "/coupons",
        name: "Inventory by location by vendor",
      },
      {
        path: "/coupons",
        name: "Quantity by location by variant",
      },
      {
        path: "/coupons",
        name: "Out of Stock Product",
      },
    ],
  },


  {
    path: "/our-staff",
    icon: FiUser,
    name: "Shipping & Tax Report",
    routes: [
      {
        path: "/products",
        name: "Shipping Report",
      },
      {
        path: "/categories",
        name: "Shipping Label Cost Report",
      },
      {
        path: "/attributes",
        name: "Taxes by state",
      },
      {
        path: "/coupons",
        name: "Taxes by country",
      },
      {
        path: "/coupons",
        name: "Taxes over time",
      },
    ],
  },



  {
    path: "/our-staff",
    icon: FiUser,
    name: "Behaviour Report",
    routes: [
      {
        path: "/products",
        name: "Conversion over time",
      },
      {
        path: "/categories",
        name: "online store searches",
      },
      {
        path: "/attributes",
        name: "Product recommendation",
      },
      {
        path: "/coupons",
        name: "cart analysis",
      },
      {
        path: "/coupons",
        name: "Session by landing page",
      },
    ],
  },

  {
    path: "/our-staff",
    icon: FiUser,
    name: "Integrations",
  },

  {
    path: "/settings",
    icon: FiSettings,
    name: "StoreSetting",
  },
  
/* 
  {
    icon: FiGlobe,
    name: "International",
    routes: [
      {
        path: "/languages",
        name: "Languages",
      },
      {
        path: "/currencies",
        name: "Currencies",
      },
    ],
  },
  {
    icon: FiTarget,
    name: "ViewStore",
    path: "http://localhost:3000",
    outside: "store",
  },

  {
    icon: FiSlack,
    name: "Pages",
    routes: [
      // submenu

      {
        path: "/404",
        name: "404",
      },
      {
        path: "/coming-soon",
        name: "Coming Soon",
      },
    ],
  }, */
];

export default sidebar;
