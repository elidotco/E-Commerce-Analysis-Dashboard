export const navList = [
  {
    name: "Dashboard",
    tag: "mingcute:home-4-fill",
    path: "/",
  },
  {
    name: "Order Management",
    tag: "mdi:cart-outline",
    path: "/orders",
  },
  {
    name: "Customers",
    tag: "tabler:users",
    path: "/customers",
  },
  {
    name: "Coupon Code",
    tag: "carbon:ticket",
    path: "/coupons",
  },
  {
    name: "Categories",
    tag: "tabler:circle-square",
    path: "/categories",
  },
  {
    name: "Transactions",
    tag: "ion:card-outline",
    path: "/transactions",
  },
  {
    name: "Brand",
    tag: "tabler:star",
    path: "/brand",
  },
];

export const proNavList = [
  {
    name: "Add Product",
    tag: "formkit:add",
    path: "/add-product",
  },
  {
    name: " Products List",
    tag: "fluent-mdl2:product-list",
    path: "/products-list",
  },
  {
    name: " Products Reviews",
    tag: "material-symbols:reviews-outline",
    path: "/product-reviews",
  },
];

export const adminNavList = [
  {
    name: "Admin Role",
    tag: "qlementine-icons:user-16",
    path: "/admin-role",
  },
  {
    name: "Control Authourity",
    tag: "mdi:cog",
    path: "/admin-role",
  },
];

// DUmmy card data
export const cardData = [
  {
    name: "Total Sales",
    value: [
      {
        name: "Sales",
        value: 32399,
        analysis: "Up",
        percent: 12.4,
        amount: 600,
        currency: true,
      },
    ],
    prev: true,
    amount: 203,
    currency: true,
  },
  {
    name: "Total Orders",
    value: [
      {
        name: "Order",
        value: 2399,
        analysis: "Up",
        percent: 12.4,
        amount: 600,
        currency: false,
      },
    ],
    prev: true,
    amount: 203,
    currency: false,
  },
  {
    name: "Pending & Canceled",
    value: [
      {
        name: "Pending",
        value: 2399,
        analysis: "Up",
        percent: 12.4,
        amount: 600,
      },
      {
        name: "Cancelled",
        value: 99,
        analysis: "Down",
        percent: 12.4,
        amount: 600,
      },
    ],
    amount: 203,
  },
];

// utils/weekData.js
export const getThisWeekData = () => [
  { day: "Mon", value: 186 },
  { day: "Tue", value: 305 },
  { day: "Wed", value: 237 },
  { day: "Thu", value: 173 },
  { day: "Fri", value: 209 },
  { day: "Sat", value: 214 },
  { day: "Sun", value: 198 },
];

export const getLastWeekData = () => [
  { day: "Mon", value: 220 },
  { day: "Tue", value: 280 },
  { day: "Wed", value: 190 },
  { day: "Thu", value: 245 },
  { day: "Fri", value: 267 },
  { day: "Sat", value: 189 },
  { day: "Sun", value: 243 },
];

export const tabledata = [
  {
    customer: "728ed52f",
    amount: 100,
    orderdate: "2023-01-01 10:30", // Include time to the data
    status: "pending",
    email: "m@example.com",
  },
  // ...
];
export type Payment = {
  product: string;
  totalOrder: number;
  status: "stock" | "out of stock" | "discontinued";
  price: number;
  image: string;
};

export const tabledata2: Payment[] = [
  {
    product: "Wireless Headphones",
    totalOrder: 150,
    status: "stock",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
  {
    product: "Smartwatch Pro",
    totalOrder: 85,
    status: "out of stock",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    product: "4K Action Camera",
    totalOrder: 60,
    status: "discontinued",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop",
  },
];
