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
