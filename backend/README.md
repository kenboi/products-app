# Products API — Laravel Backend

A RESTful API built with Laravel 13 for managing hierarchical product data.

## Requirements

- PHP >= 8.2
- Composer

## Setup

1. Install dependencies:
   ```bash
   composer install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Generate the application key:
   ```bash
   php artisan key:generate
   ```

4. Run migrations:
   ```bash
   php artisan migrate
   ```

5. Start the development server:
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (supports filters) |
| POST | `/api/products` | Create a product |
| GET | `/api/products/tree` | Get products as a nested tree |
| GET | `/api/products/{id}` | Get a single product |
| PATCH | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |

## Filter Parameters

Append as query strings to `GET /api/products`:

| Parameter | Type | Description |
|-----------|------|-------------|
| `product_name` | string | Partial name search |
| `product_type` | string | Exact type match |
| `product_parent_id` | integer | Filter by parent |
