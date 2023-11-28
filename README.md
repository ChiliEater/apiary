# Apiary

This is a simple API for local testing with [FoodFinder](https://github.com/ChiliEater/FoodFinder).

## Prerequisites

Ensure that you have the following:

- Linux
- Docker
  - Rootless Docker setup or permissions to execute `docker` without `sudo`
- `yarn`

The setup may also just work on MacOS due to its similarity to Linux.

Windows users have the following options:

- WSL
- Linux virtual machine
- Install Linux (recommended)

## Running

```shell
yarn
```

```shell
yarn dev
```

## API

### List all categories

```http
GET http://apiary/categories
```

```json
[
  {
    "id": 1,
    "name": "burgerCategory",
    "image": "img/categories/burger.jpg"
  },
  ...
]
```

### List all products in a category

```http
GET http://apiary/products?id={categoryId}
```

```json
[
  {
    "id": 1,
    "category": 1,
    "name": "Magnificient Burger",
    "price": 261,
    "location": "Noxapater, Mississippi, 39346",
    "contact": "3366720059",
    "images": "img/products/burger/burger1.jpg,img/products/burger/burger3.jpg,img/products/burger/burger0.jpg,img/products/burger/burger4.jpg,img/products/burger/burger2.jpg"
  },
  ...
]
```

### List product info

```http
GET http://apiary/products/{productId}
```

```json
{
  "id": 10,
  "category": 1,
  "name": "Classy Burger",
  "price": 49,
  "location": "Carrington, North Dakota, 58421",
  "contact": "2926659502",
  "images": "img/products/burger/burger3.jpg,img/products/burger/burger2.jpg,img/products/burger/burger1.jpg,img/products/burger/burger0.jpg,img/products/burger/burger4.jpg"
}
```

### List user info

```
GET http://apiary/users/{userId}
```

```json
{
  "id": 1,
  "name": "John Smith"
}
```

### List user's cart

```http
GET http://apiary/carts?user={userId}
```

```json
[
  {
    "id": 1,
    "productId": 1,
    "userId": 1
  },
  ...
]
```

### Add to cart

```http
POST http://apiary/carts HTTP/1.1
Content-Type: application/json; charset=utf-8

{
    "productId": 2,
    "userId": 1
}
```

```json
{
  "id": 2
}
```

### Remove from cart

```http
DELETE http://apiary/carts/{cartItemId}
```

```
200 OK
```