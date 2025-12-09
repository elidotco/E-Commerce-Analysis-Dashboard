# E-Commerce Analytics Dashboard - Production-Ready Project

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Tech Stack](#tech-stack)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Frontend Structure](#frontend-structure)
7. [Implementation Roadmap](#implementation-roadmap)
8. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
9. [Deployment Strategy](#deployment-strategy)
10. [Testing Strategy](#testing-strategy)
11. [Security Checklist](#security-checklist)
12. [Monitoring & Logging](#monitoring-logging)

---

## Project Overview

### Core Features

- **Dashboard Analytics**: Real-time sales metrics, revenue charts, top products
- **Product Management**: Full CRUD operations with image uploads
- **Order Processing**: Order tracking, status updates, order history
- **Customer Management**: Customer profiles, purchase history
- **Reporting**: Generate sales reports, export to CSV/Excel
- **Email Notifications**: Order confirmations, status updates
- **Search & Filters**: Advanced filtering and pagination
- **Role-Based Access**: Admin and staff roles

### User Stories

1. As an admin, I can view sales analytics for different time periods
2. As an admin, I can manage product inventory (add/edit/delete)
3. As an admin, I can process orders and update their status
4. As an admin, I can view customer purchase history
5. As an admin, I can export sales data to CSV/Excel
6. As a customer, I receive email confirmations for orders

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                         │
│  React + TypeScript + TailwindCSS + React Query         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ HTTPS/REST
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  API GATEWAY LAYER                       │
│              Express.js + JWT Auth                       │
└─────┬───────────────┬───────────────┬───────────────────┘
      │               │               │
      │               │               │
┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼──────┐
│  Business  │  │   Cache   │  │   Queue    │
│   Logic    │  │   Redis   │  │  Bull MQ   │
│  Services  │  └───────────┘  └────────────┘
└─────┬─────┘
      │
┌─────▼──────────────────────────────────────┐
│         Database Layer                      │
│    PostgreSQL + Prisma ORM                  │
└─────────────────────────────────────────────┘

External Services:
- AWS S3 / Cloudinary (Image Storage)
- SendGrid / AWS SES (Email)
- Sentry (Error Tracking)
```

---

## Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query) + Zustand
- **Styling**: TailwindCSS + shadcn/ui components
- **Charts**: Recharts or Chart.js
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend

- **Runtime**: Node.js 20.x
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer + AWS SDK
- **Queue**: Bull + Redis
- **Email**: Nodemailer + SendGrid

### Database & Cache

- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Search**: PostgreSQL Full-Text Search

### DevOps & Tools

- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Railway / Render / DigitalOcean
- **Monitoring**: Sentry, Winston Logger
- **Testing**: Jest, Supertest, Playwright
- **Code Quality**: ESLint, Prettier, Husky

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'customer', -- admin, staff, customer
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Products Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  stock_quantity INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, discontinued
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Full-text search
  search_vector tsvector
);

CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
```

### Orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

### Order Items Table

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

### Customers Table (Extended User Data)

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  phone VARCHAR(20),
  company VARCHAR(255),
  billing_address JSONB,
  shipping_address JSONB,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String    @map("password_hash")
  firstName    String?   @map("first_name")
  lastName     String?   @map("last_name")
  role         String    @default("customer")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  orders       Order[]
  customer     Customer?

  @@map("users")
}

model Product {
  id            String    @id @default(uuid())
  name          String
  description   String?
  sku           String    @unique
  price         Decimal   @db.Decimal(10, 2)
  cost          Decimal?  @db.Decimal(10, 2)
  stockQuantity Int       @default(0) @map("stock_quantity")
  imageUrl      String?   @map("image_url")
  category      String?
  status        String    @default("active")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  orderItems    OrderItem[]

  @@index([category])
  @@index([status])
  @@map("products")
}

model Order {
  id              String    @id @default(uuid())
  orderNumber     String    @unique @map("order_number")
  customerId      String    @map("customer_id")
  status          String    @default("pending")
  subtotal        Decimal   @db.Decimal(10, 2)
  tax             Decimal   @default(0) @db.Decimal(10, 2)
  shipping        Decimal   @default(0) @db.Decimal(10, 2)
  total           Decimal   @db.Decimal(10, 2)
  shippingAddress Json?     @map("shipping_address")
  notes           String?
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  customer        User      @relation(fields: [customerId], references: [id])
  items           OrderItem[]

  @@index([customerId])
  @@index([status])
  @@index([createdAt(sort: Desc)])
  @@map("orders")
}

model OrderItem {
  id          String   @id @default(uuid())
  orderId     String   @map("order_id")
  productId   String   @map("product_id")
  productName String   @map("product_name")
  quantity    Int
  unitPrice   Decimal  @db.Decimal(10, 2) @map("unit_price")
  total       Decimal  @db.Decimal(10, 2)
  createdAt   DateTime @default(now()) @map("created_at")

  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product     Product  @relation(fields: [productId], references: [id])

  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}

model Customer {
  id              String   @id @default(uuid())
  userId          String   @unique @map("user_id")
  phone           String?
  company         String?
  billingAddress  Json?    @map("billing_address")
  shippingAddress Json?    @map("shipping_address")
  totalOrders     Int      @default(0) @map("total_orders")
  totalSpent      Decimal  @default(0) @db.Decimal(10, 2) @map("total_spent")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  user            User     @relation(fields: [userId], references: [id])

  @@map("customers")
}
```

---

## API Endpoints

### Authentication

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
POST   /api/auth/refresh           Refresh JWT token
POST   /api/auth/logout            Logout user
GET    /api/auth/me                Get current user
```

### Products

```
GET    /api/products               List all products (paginated, filtered)
GET    /api/products/:id           Get product by ID
POST   /api/products               Create new product (admin)
PUT    /api/products/:id           Update product (admin)
DELETE /api/products/:id           Delete product (admin)
POST   /api/products/:id/image     Upload product image (admin)
GET    /api/products/search        Search products
```

### Orders

```
GET    /api/orders                 List all orders (paginated, filtered)
GET    /api/orders/:id             Get order details
POST   /api/orders                 Create new order
PUT    /api/orders/:id/status      Update order status (admin)
DELETE /api/orders/:id             Cancel order
GET    /api/orders/:id/invoice     Generate invoice PDF
```

### Customers

```
GET    /api/customers              List all customers (paginated)
GET    /api/customers/:id          Get customer details
GET    /api/customers/:id/orders   Get customer order history
PUT    /api/customers/:id          Update customer info
```

### Analytics

```
GET    /api/analytics/dashboard    Dashboard summary stats
GET    /api/analytics/sales        Sales data (with date filters)
GET    /api/analytics/products     Top selling products
GET    /api/analytics/revenue      Revenue trends
GET    /api/analytics/export       Export data to CSV/Excel
```

### Example Response Formats

**Dashboard Stats:**

```json
{
  "success": true,
  "data": {
    "totalRevenue": 125430.50,
    "totalOrders": 342,
    "totalCustomers": 156,
    "averageOrderValue": 366.75,
    "revenueGrowth": 12.5,
    "ordersGrowth": 8.3,
    "topProducts": [
      {
        "id": "uuid",
        "name": "Product Name",
        "sales": 45,
        "revenue": 2250.00
      }
    ],
    "recentOrders": [...],
    "salesChart": [
      { "date": "2024-12-01", "revenue": 4500, "orders": 12 }
    ]
  }
}
```

---

## Frontend Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── products/
│   │   ├── ProductList.tsx
│   │   ├── ProductForm.tsx
│   │   └── ProductCard.tsx
│   ├── orders/
│   │   ├── OrderList.tsx
│   │   ├── OrderDetails.tsx
│   │   └── OrderStatusBadge.tsx
│   ├── customers/
│   │   ├── CustomerList.tsx
│   │   └── CustomerProfile.tsx
│   └── analytics/
│       ├── DashboardStats.tsx
│       ├── RevenueChart.tsx
│       └── TopProductsTable.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Products.tsx
│   ├── Orders.tsx
│   ├── Customers.tsx
│   └── Login.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useProducts.ts
│   ├── useOrders.ts
│   └── useAnalytics.ts
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── products.service.ts
│   └── orders.service.ts
├── store/
│   └── authStore.ts          # Zustand store
├── lib/
│   ├── axios.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── App.tsx
```

### Key Frontend Patterns

**React Query for Data Fetching:**

```typescript
// hooks/useProducts.ts
export const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
```

**Protected Routes:**

```typescript
const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Spinner />;

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)

**Days 1-2: Project Setup**

- [ ] Initialize monorepo or separate repos
- [ ] Set up Docker Compose for local development
- [ ] Configure PostgreSQL and Redis
- [ ] Set up Prisma with initial schema
- [ ] Configure TypeScript for both frontend and backend
- [ ] Set up ESLint, Prettier, and Husky

**Days 3-5: Authentication System**

- [ ] Implement JWT authentication
- [ ] Create user registration and login endpoints
- [ ] Set up password hashing with bcrypt
- [ ] Implement refresh token mechanism
- [ ] Create protected route middleware
- [ ] Build login/register UI

**Days 6-7: Basic CRUD Foundation**

- [ ] Create product CRUD endpoints
- [ ] Implement pagination and filtering
- [ ] Build product list and form UI
- [ ] Set up React Query
- [ ] Implement form validation with Zod

### Phase 2: Core Features (Week 2)

**Days 8-10: Product Management**

- [ ] Implement image upload (AWS S3 or Cloudinary)
- [ ] Add product search with full-text search
- [ ] Create product categories
- [ ] Build advanced filtering UI
- [ ] Add stock management logic

**Days 11-14: Order System**

- [ ] Create order creation endpoint
- [ ] Implement order status workflow
- [ ] Build order list and details UI
- [ ] Add order filtering and search
- [ ] Create order history for customers

### Phase 3: Analytics & Reporting (Week 3)

**Days 15-17: Dashboard Analytics**

- [ ] Create analytics endpoints with aggregations
- [ ] Implement Redis caching for dashboard stats
- [ ] Build dashboard UI with charts (Recharts)
- [ ] Add date range filters
- [ ] Display top products and metrics

**Days 18-19: Customer Management**

- [ ] Create customer profile endpoints
- [ ] Build customer list and detail views
- [ ] Show customer order history
- [ ] Add customer statistics

**Days 20-21: Export & Email**

- [ ] Implement CSV/Excel export
- [ ] Set up email service (SendGrid)
- [ ] Create email templates
- [ ] Implement order confirmation emails
- [ ] Add background job queue with Bull

### Phase 4: Testing (Week 4)

**Days 22-25: Backend Testing**

- [ ] Write unit tests for services
- [ ] Create integration tests for API endpoints
- [ ] Test authentication flows
- [ ] Test order processing logic
- [ ] Achieve 70%+ code coverage

**Days 26-28: Frontend Testing**

- [ ] Write component unit tests
- [ ] Create E2E tests with Playwright
- [ ] Test critical user flows
- [ ] Test form validations

### Phase 5: DevOps & Deployment (Week 5-6)

**Days 29-31: CI/CD Pipeline**

- [ ] Set up GitHub Actions workflow
- [ ] Configure automated testing
- [ ] Set up Docker build and push
- [ ] Configure environment-based deployments
- [ ] Add database migration automation

**Days 32-35: Production Deployment**

- [ ] Deploy database (Railway/AWS RDS)
- [ ] Deploy Redis instance
- [ ] Deploy backend API
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Configure CDN for static assets
- [ ] Set up SSL certificates

**Days 36-42: Monitoring & Optimization**

- [ ] Set up Sentry for error tracking
- [ ] Configure Winston for logging
- [ ] Add application monitoring
- [ ] Implement database indexing
- [ ] Add API rate limiting
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing

---

## CI/CD Pipeline Setup

### GitHub Actions Workflow

**.github/workflows/ci-cd.yml**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: "20.x"

jobs:
  test-backend:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci
        working-directory: ./backend

      - name: Run linting
        run: npm run lint
        working-directory: ./backend

      - name: Run Prisma migrations
        run: npx prisma migrate deploy
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Run tests
        run: npm test -- --coverage
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          directory: ./backend/coverage

  test-frontend:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci
        working-directory: ./frontend

      - name: Run linting
        run: npm run lint
        working-directory: ./frontend

      - name: Run tests
        run: npm test
        working-directory: ./frontend

      - name: Build application
        run: npm run build
        working-directory: ./frontend

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  build-and-push-docker:
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend, e2e-tests]
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/ecommerce-api:latest
          cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/ecommerce-api:buildcache
          cache-to: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/ecommerce-api:buildcache,mode=max

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-push-docker
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - name: Deploy to staging
        run: |
          # Add your staging deployment commands
          echo "Deploying to staging..."

  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-push-docker
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Deploy to production
        run: |
          # Add your production deployment commands
          echo "Deploying to production..."

      - name: Run database migrations
        run: |
          # Run migrations on production database
          echo "Running migrations..."
```

### Pre-commit Hooks (Husky)

**.husky/pre-commit**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint-staged
```

**package.json**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## Deployment Strategy

### Option 1: Railway (Recommended for Beginners)

**Backend + Database:**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Add Redis
railway add --plugin redis

# Deploy
railway up
```

**Frontend (Vercel):**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: DigitalOcean App Platform

**app.yaml:**

```yaml
name: ecommerce-dashboard

services:
  - name: api
    dockerfile_path: backend/Dockerfile
    github:
      repo: your-username/ecommerce-dashboard
      branch: main
      deploy_on_push: true
    environment_slug: node-js
    envs:
      - key: DATABASE_URL
        scope: RUN_TIME
        type: SECRET
      - key: REDIS_URL
        scope: RUN_TIME
        type: SECRET
      - key: JWT_SECRET
        scope: RUN_TIME
        type: SECRET
    health_check:
      http_path: /health

  - name: web
    dockerfile_path: frontend/Dockerfile
    github:
      repo: your-username/ecommerce-dashboard
      branch: main
      deploy_on_push: true
    environment_slug: node-js
    envs:
      - key: VITE_API_URL
        value: ${api.PUBLIC_URL}

databases:
  - name: postgres
    engine: PG
    version: "15"

  - name: redis
    engine: REDIS
    version: "7"
```

### Docker Configuration

**backend/Dockerfile:**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run build
RUN npx prisma generate

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
```

**frontend/Dockerfile:**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml (Development):**

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ecommerce_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/ecommerce_dev
      REDIS_URL: redis://redis:6379
      JWT_SECRET: dev-secret-key
      NODE_ENV: development
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:5000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

---

## Testing Strategy

### Backend Tests

# E-Commerce Analytics Dashboard - Part 2

## Testing Strategy (Complete)

### Backend Tests

**Unit Tests (Jest + Supertest):**

```typescript
// tests/unit/services/product.service.test.ts
import { ProductService } from "@/services/product.service";
import { prismaMock } from "@/lib/prisma-mock";

describe("ProductService", () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  describe("getAll", () => {
    it("should return paginated products", async () => {
      const mockProducts = [
        { id: "1", name: "Product 1", price: 100, sku: "SKU1" },
        { id: "2", name: "Product 2", price: 200, sku: "SKU2" },
      ];

      prismaMock.product.findMany.mockResolvedValue(mockProducts);
      prismaMock.product.count.mockResolvedValue(2);

      const result = await productService.getAll({ page: 1, limit: 10 });

      expect(result.products).toEqual(mockProducts);
      expect(result.total).toBe(2);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
      });
    });
  });

  describe("create", () => {
    it("should create a new product", async () => {
      const newProduct = {
        name: "New Product",
        sku: "SKU123",
        price: 99.99,
        stockQuantity: 10,
      };

      prismaMock.product.create.mockResolvedValue({
        id: "1",
        ...newProduct,
        createdAt: new Date(),
      });

      const result = await productService.create(newProduct);

      expect(result.name).toBe(newProduct.name);
      expect(prismaMock.product.create).toHaveBeenCalled();
    });

    it("should throw error for duplicate SKU", async () => {
      prismaMock.product.create.mockRejectedValue({
        code: "P2002",
        meta: { target: ["sku"] },
      });

      await expect(
        productService.create({ name: "Test", sku: "DUP", price: 10 })
      ).rejects.toThrow("Product with this SKU already exists");
    });
  });
});
```

**Integration Tests:**

```typescript
// tests/integration/products.test.ts
import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/utils/jwt";

describe("Products API", () => {
  let authToken: string;
  let adminUser: any;

  beforeAll(async () => {
    // Create admin user for testing
    adminUser = await prisma.user.create({
      data: {
        email: "admin@test.com",
        passwordHash: "hashed",
        role: "admin",
      },
    });

    authToken = generateToken({ id: adminUser.id, role: "admin" });
  });

  afterAll(async () => {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe("GET /api/products", () => {
    it("should return paginated products", async () => {
      // Create test products
      await prisma.product.createMany({
        data: [
          { name: "Product 1", sku: "SKU1", price: 100 },
          { name: "Product 2", sku: "SKU2", price: 200 },
        ],
      });

      const response = await request(app)
        .get("/api/products")
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it("should filter products by category", async () => {
      await prisma.product.create({
        data: {
          name: "Electronics Item",
          sku: "ELEC1",
          price: 500,
          category: "electronics",
        },
      });

      const response = await request(app)
        .get("/api/products")
        .query({ category: "electronics" })
        .expect(200);

      expect(
        response.body.data.products.every(
          (p: any) => p.category === "electronics"
        )
      ).toBe(true);
    });
  });

  describe("POST /api/products", () => {
    it("should create product with admin token", async () => {
      const newProduct = {
        name: "New Product",
        sku: "NEW123",
        price: 99.99,
        stockQuantity: 50,
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newProduct)
        .expect(201);

      expect(response.body.data.name).toBe(newProduct.name);
      expect(response.body.data.sku).toBe(newProduct.sku);
    });

    it("should reject without auth token", async () => {
      await request(app)
        .post("/api/products")
        .send({ name: "Test", sku: "TEST", price: 10 })
        .expect(401);
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Test" }) // Missing required fields
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });
});
```

**Authentication Tests:**

```typescript
// tests/integration/auth.test.ts
import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

describe("Auth API", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe("POST /api/auth/register", () => {
    it("should register new user", async () => {
      const userData = {
        email: "newuser@test.com",
        password: "Password123!",
        firstName: "John",
        lastName: "Doe",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it("should reject duplicate email", async () => {
      const email = "duplicate@test.com";
      await prisma.user.create({
        data: {
          email,
          passwordHash: await bcrypt.hash("password", 10),
        },
      });

      await request(app)
        .post("/api/auth/register")
        .send({ email, password: "Password123!" })
        .expect(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with correct credentials", async () => {
      const password = "Password123!";
      await prisma.user.create({
        data: {
          email: "user@test.com",
          passwordHash: await bcrypt.hash(password, 10),
        },
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "user@test.com", password })
        .expect(200);

      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it("should reject incorrect password", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({ email: "user@test.com", password: "wrongpassword" })
        .expect(401);
    });
  });
});
```

### Frontend Tests

**Component Unit Tests (React Testing Library):**

```typescript
// tests/components/ProductCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "@/components/products/ProductCard";

describe("ProductCard", () => {
  const mockProduct = {
    id: "1",
    name: "Test Product",
    price: 99.99,
    sku: "TEST123",
    imageUrl: "/test-image.jpg",
    stockQuantity: 10,
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  it("renders product information", () => {
    render(
      <ProductCard
        product={mockProduct}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText(/SKU: TEST123/i)).toBeInTheDocument();
  });

  it("calls onEdit when edit button clicked", () => {
    render(
      <ProductCard
        product={mockProduct}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText(/edit/i));
    expect(mockOnEdit).toHaveBeenCalledWith(mockProduct);
  });

  it("shows low stock warning", () => {
    const lowStockProduct = { ...mockProduct, stockQuantity: 3 };

    render(
      <ProductCard
        product={lowStockProduct}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/low stock/i)).toBeInTheDocument();
  });
});
```

**Hook Tests:**

```typescript
// tests/hooks/useProducts.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProducts } from "@/hooks/useProducts";
import * as productService from "@/services/products.service";

jest.mock("@/services/products.service");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useProducts", () => {
  it("fetches products successfully", async () => {
    const mockProducts = [
      { id: "1", name: "Product 1", price: 100 },
      { id: "2", name: "Product 2", price: 200 },
    ];

    (productService.getAll as jest.Mock).mockResolvedValue({
      products: mockProducts,
      total: 2,
    });

    const { result } = renderHook(() => useProducts({ page: 1, limit: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.products).toEqual(mockProducts);
  });
});
```

### E2E Tests (Playwright)

**tests/e2e/product-management.spec.ts:**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Product Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@test.com");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("should create a new product", async ({ page }) => {
    await page.goto("/products");
    await page.click('button:has-text("Add Product")');

    // Fill product form
    await page.fill('input[name="name"]', "E2E Test Product");
    await page.fill('input[name="sku"]', "E2E-TEST-001");
    await page.fill('input[name="price"]', "199.99");
    await page.fill('input[name="stockQuantity"]', "50");
    await page.selectOption('select[name="category"]', "electronics");

    // Submit form
    await page.click('button:has-text("Create Product")');

    // Verify success
    await expect(
      page.locator("text=Product created successfully")
    ).toBeVisible();
    await expect(page.locator("text=E2E Test Product")).toBeVisible();
  });

  test("should edit existing product", async ({ page }) => {
    await page.goto("/products");

    // Click edit on first product
    await page.click(
      '[data-testid="product-card"]:first-child button:has-text("Edit")'
    );

    // Update name
    await page.fill('input[name="name"]', "Updated Product Name");
    await page.click('button:has-text("Save Changes")');

    // Verify update
    await expect(
      page.locator("text=Product updated successfully")
    ).toBeVisible();
  });

  test("should filter products by category", async ({ page }) => {
    await page.goto("/products");

    // Select category filter
    await page.selectOption('select[name="category"]', "electronics");

    // Wait for filtered results
    await page.waitForSelector('[data-testid="product-card"]');

    // Verify all products have correct category
    const categories = await page
      .locator('[data-testid="product-category"]')
      .allTextContents();
    categories.forEach((cat) => {
      expect(cat.toLowerCase()).toContain("electronics");
    });
  });
});

test.describe("Order Processing", () => {
  test("should create order and send email", async ({ page }) => {
    await page.goto("/orders/new");

    // Add products to order
    await page.click('button:has-text("Add Product")');
    await page.fill('input[name="productSearch"]', "Test Product");
    await page.click('[data-testid="product-result"]:first-child');
    await page.fill('input[name="quantity"]', "2");

    // Fill customer info
    await page.fill('input[name="customerEmail"]', "customer@test.com");
    await page.fill('textarea[name="shippingAddress"]', "123 Test St");

    // Submit order
    await page.click('button:has-text("Place Order")');

    // Verify order creation
    await expect(page.locator("text=Order created successfully")).toBeVisible();
    await expect(page.locator("text=Confirmation email sent")).toBeVisible();
  });
});
```

---

## Security Checklist

### Authentication & Authorization

- [ ] **Password Security**
  - Minimum 8 characters
  - Require uppercase, lowercase, number, special char
  - Hash with bcrypt (cost factor 12+)
  - Never store plain text passwords
- [ ] **JWT Implementation**
  - Use strong secret (min 256 bits)
  - Short access token expiry (15 mins)
  - Implement refresh tokens
  - Store tokens in httpOnly cookies
  - Validate token signature
- [ ] **Session Management**
  - Implement token blacklisting for logout
  - Clear sessions on password change
  - Rate limit login attempts (5 max per 15 mins)
  - Lock account after failed attempts

### API Security

- [ ] **Input Validation**
  - Validate all user inputs with Zod
  - Sanitize HTML inputs (XSS prevention)
  - Validate file uploads (type, size, name)
  - Use prepared statements (SQL injection prevention via Prisma)
- [ ] **Rate Limiting**

  ```typescript
  import rateLimit from "express-rate-limit";

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/", limiter);
  ```

- [ ] **CORS Configuration**

  ```typescript
  import cors from "cors";

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  ```

- [ ] **Request Size Limits**
  ```typescript
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  ```

### Data Protection

- [ ] **Environment Variables**

  ```bash
  # .env.example (commit this)
  DATABASE_URL=
  REDIS_URL=
  JWT_SECRET=
  JWT_REFRESH_SECRET=
  AWS_ACCESS_KEY_ID=
  AWS_SECRET_ACCESS_KEY=
  SENDGRID_API_KEY=

  # Never commit .env file
  ```

- [ ] **Sensitive Data**
  - Never log passwords or tokens
  - Mask credit card numbers in logs
  - Encrypt sensitive data at rest
  - Use HTTPS for all communications
- [ ] **Database Security**
  - Use connection pooling
  - Enable SSL for database connections
  - Implement row-level security if needed
  - Regular database backups
  - Least privilege access for DB user

### File Upload Security

```typescript
import multer from "multer";
import path from "path";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 5 * 1024 * 1024; // 5MB

const upload = multer({
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }

    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      return cb(new Error("Invalid file extension"));
    }

    cb(null, true);
  },
});
```

### Headers Security (Helmet.js)

```typescript
import helmet from "helmet";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);
```

### Error Handling

- [ ] Never expose stack traces in production
- [ ] Use generic error messages for users
- [ ] Log detailed errors server-side
- [ ] Implement error monitoring (Sentry)

```typescript
// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log full error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Send generic message to client
  if (process.env.NODE_ENV === "production") {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } else {
    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
});
```

### Dependencies Security

```bash
# Regular security audits
npm audit
npm audit fix

# Use Snyk or Dependabot
# Add to GitHub Actions
- name: Run Snyk to check for vulnerabilities
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

## Monitoring & Logging

### Application Logging (Winston)

**backend/src/lib/logger.ts:**

```typescript
import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({ filename: "logs/all.log" }),
];

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels,
  format,
  transports,
});
```

**Request Logging Middleware:**

```typescript
import morgan from "morgan";
import { logger } from "@/lib/logger";

const stream = {
  write: (message: string) => logger.http(message.trim()),
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

export const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);
```

### Error Tracking (Sentry)

**backend/src/lib/sentry.ts:**

```typescript
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

export const initSentry = (app: Express) => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    profilesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
};

export const sentryErrorHandler = Sentry.Handlers.errorHandler();
```

**Frontend Sentry:**

```typescript
// src/lib/sentry.ts
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [new BrowserTracing(), new Sentry.Replay()],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Performance Monitoring

**API Response Time Tracking:**

```typescript
import { performance } from "perf_hooks";

export const performanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = performance.now();

  res.on("finish", () => {
    const duration = performance.now() - start;

    logger.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
    });

    // Alert on slow requests
    if (duration > 1000) {
      logger.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });

  next();
};
```

### Health Check Endpoint

```typescript
// routes/health.ts
router.get("/health", async (req, res) => {
  const checks = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: "unknown",
    redis: "unknown",
  };

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch (error) {
    checks.database = "disconnected";
  }

  try {
    // Check Redis
    await redis.ping();
    checks.redis = "connected";
  } catch (error) {
    checks.redis = "disconnected";
  }

  const isHealthy =
    checks.database === "connected" && checks.redis === "connected";

  res.status(isHealthy ? 200 : 503).json(checks);
});
```

### Database Query Monitoring

**Prisma Logging:**

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

export const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

// Log slow queries
prisma.$on("query", (e) => {
  if (e.duration > 1000) {
    logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
  }
});

prisma.$on("error", (e) => {
  logger.error(`Database error: ${e.message}`);
});
```

### Metrics Dashboard (Optional - Prometheus + Grafana)

```typescript
// lib/metrics.ts
import client from "prom-client";

const register = new client.Registry();

// Default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const databaseQueryDuration = new client.Histogram({
  name: "database_query_duration_seconds",
  help: "Duration of database queries in seconds",
  labelNames: ["query_type"],
  registers: [register],
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
```

### Alerting Setup

**Email Alerts for Critical Errors:**

```typescript
// lib/alerts.ts
import nodemailer from "nodemailer";
import { logger } from "./logger";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendCriticalAlert = async (error: Error, context: any) => {
  try {
    await transporter.sendMail({
      from: process.env.ALERT_EMAIL_FROM,
      to: process.env.ALERT_EMAIL_TO,
      subject: `🚨 Critical Error in ${process.env.APP_NAME}`,
      html: `
        <h2>Critical Error Occurred</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Stack:</strong></p>
        <pre>${error.stack}</pre>
        <p><strong>Context:</strong></p>
        <pre>${JSON.stringify(context, null, 2)}</pre>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      `,
    });
  } catch (emailError) {
    logger.error("Failed to send alert email:", emailError);
  }
};
```

---

## Additional Best Practices

### Code Organization Tips

1. **Use absolute imports** with TypeScript path mapping
2. **Separate business logic** from controllers
3. **Create reusable utilities** for common operations
4. **Document complex logic** with comments
5. **Use TypeScript interfaces** for all data structures

### Performance Optimization

- Implement database query optimization (indexes, joins)
- Use Redis caching for frequently accessed data
- Implement pagination for all list endpoints
- Use CDN for static assets
- Optimize images before upload
- Implement lazy loading in frontend

### Git Workflow

```bash
# Feature branch workflow
git checkout -b feature/product-search
# Make changes
git add .
git commit -m "feat: implement product search with full-text"
git push origin feature/product-search
# Create PR → Review → Merge
```

### Environment Management

```
.env.development    # Local development
.env.test          # Testing
.env.staging       # Staging environment
.env.production    # Production (never commit)
```

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run lint             # Lint code
npm run format           # Format with Prettier

# Database
npx prisma migrate dev   # Create migration
npx prisma generate      # Generate Prisma client
npx prisma studio        # Open Prisma Studio
npx prisma db seed       # Seed database

# Docker
docker-compose
```
