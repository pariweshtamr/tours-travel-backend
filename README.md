# Project Title

This backend api project is created for tours & travel booking application.

## Installation

Clone the repo:

```bash
  git clone https://github.com/pariweshtamr/tours-travel-backend
  cd tours-travel-backend
```

Install the dependencies

```bash
  npm install
```

Set the Environment Variables

- create a .env file and add the environment Variables

## Table of Contents

- Commands
- Tech
- Environment Variables
- API Endpoints

## Commands

Running in development

```bash
  npm start
```

Running in production

```bash
  npm run build
```

## Tech Stack

**Client:** React, Redux Toolkit, Scss, Axios, Bootstrap, Masonry, Carousel

**Server:** Node, Express, Mongo, Bcrypt, JWT, Stripe, Cors, Morgan

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.

#URL of the Mongo DB  
`MONGO_URL`

#JWT  
`JWT_ACCESS_KEY`  
`JWT_REFRESH_KEY`

#STRIPE  
`STRIPE_SECRET_KEY`  
`STRIPE_WEBHOOK_SECRET`

#URL frontend  
`CLIENT_URL`

## API Reference

All the API will be followed by ${rootUrl}/api/v1

Auth API end point

```http
  ${rootUrl}/api/v1/auth
```

| #   | API        | Method | Description          |
| :-- | :--------- | :----- | :------------------- |
| 1.  | /          | GET    | Get User             |
| 2.  | /accessJwt | GET    | Return new accessJwt |
| 3.  | /register  | POST   | Register user        |
| 4.  | /login     | POST   | Login user           |

User API end point

```http
  ${rootUrl}/api/v1/user
```

| #   | API              | Method | Description          |
| :-- | :--------------- | :----- | :------------------- |
| 1.  | /                | GET    | Get all users        |
| 2.  | /:\_id           | GET    | Get single user      |
| 3.  | /update-password | PATCH  | Update user password |

Tour API end point

```http
  ${rootUrl}/api/v1/tour
```

| #   | API                      | Method | Description         |
| :-- | :----------------------- | :----- | :------------------ |
| 1.  | /                        | GET    | Get all tours       |
| 2.  | /:\_id                   | GET    | Get single tour     |
| 3.  | /search/getToursBySearch | GET    | Get tours by search |
| 4.  | /search/featuredTour     | GET    | Get featured tours  |
| 5.  | /search/tourCount        | GET    | Get tour counts     |
| 6.  | /                        | POST   | Create new tour     |
| 7.  | /:\_id                   | PUT    | Update tour         |
| 7.  | /:\_id                   | DELETE | Delete tour         |

Review API end point

```http
  ${rootUrl}/api/v1/review
```

| #   | API        | Method | Description   |
| :-- | :--------- | :----- | :------------ |
| 1.  | /:\_id     | POST   | Create review |
| 2.  | /:reviewId | DELETE | Delete review |

Booking API end point

```http
  ${rootUrl}/api/v1/booking
```

| #   | API                | Method | Description          |
| :-- | :----------------- | :----- | :------------------- |
| 1.  | /                  | GET    | Get all bookings     |
| 2.  | /:\_id             | GET    | Get single booking   |
| 3.  | /userBookings/tour | GET    | Get bookings by user |
| 4.  | /                  | POST   | Create Booking       |

Payment API end point

```http
  ${rootUrl}/api/v1/payment
```

| #   | API                      | Method | Description                            |
| :-- | :----------------------- | :----- | :------------------------------------- |
| 1.  | /create-checkout-session | POST   | Create a stripe checkout session       |
| 2.  | /webhook                 | POST   | Create webhook to detect stripe events |
| 3.  | /refund                  | POST   | Process refund to customer             |
