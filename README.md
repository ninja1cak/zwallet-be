<div align='center' style="text-align: center;">

<h1 style="border:0;margin:1rem">Zwallet Backend</h1>

Backend for Zwallet

[Demo](https://zwallet-be.vercel.app) · [Suggestion](mailto:hauzan41200@gmail.com)

<hr>
<br>

</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Postman Collection](#postman-collection)
- [Resources](#resources)
- [Contributors](#contributors)
- [Related Project](#related-projects)
- [License](#license)
- [Suggestion](#suggestion)

## Overview

An online coffee shop is a website that allows users to register,login,make some profile, and order their favorite coffee online. Offering a wide selection of coffee, fast delivery, and convenient ordering, this platform is a practical solution for coffee lovers who want to enjoy the best quality coffee from the comfort of their homes

## Features

- Authentication & Authorization
- Products (search, sort, filter, update, create, delete)
- Customer Role: New Order, Profile
- Seller Role: Manage Order, Manage Products, Seller Profile
- Error Handling
- etc.

## Technologies Used

- [Node js](https://nodejs.org/en/docs)
- [Express js](https://expressjs.com/)
- [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)
- [MongoDB](https://www.mongodb.com/docs/)
- [Cloudinary](https://cloudinary.com/)
- etc.

## Getting Started

### Installation

1. Clone this repo

   ```bash
   git clone https://github.com/ninja1cak/zwallet-be
   ```

2. Enter the directory

   ```bash
   cd zwallet-be
   ```

3. Install all dependencies

   ```bash
   npm install
   ```

4. Create .env file

   ```env
    DB_HOST = [YOUR DATABASE HOST]
    DB_USER = [YOUR DATABASE USER]
    DB_PASSWORD = [YOUR DATABASE PASSWORD]
    DB_DATABASE = [YOUR DATABASE NAME]
    KEY = [YOUR KEY]
    PORT = [YOUR PORT]
    CLOUDINARY_URL = [YOUR CLOUDINARY API]
    NODEMAILER_EMAIL = [YOUR EMAIL]
    NODEMAILER_PASSWORD = [YOUR EMAIL PASSWORD]

   ```

5. Start the local server

   ```bash
   node index.js
   ```

   or (if you want auto start if any change in code)

   ```bash
   npm run dev
   ```

## Postman Collection

You can download in <a href='https://drive.google.com/drive/folders/1n-yIUA23_JWdll-l-HOuLL0YYPfeemtJ?usp=sharing'> Here </a>


## Resources

Special thanks to:

- [Vercel](https://vercel.com) - deploying code

## Contributors

Currently, there are no contributors to this project. If you would like to contribute, you can submit a pull request.

## Related Projects

- [Zwallet Front End](https://github.com/Ravictation/zwallet-react/tree/development) - Front End

## License

This project is licensed under the ISC License

## Suggestion

If you find bugs / find better ways / suggestions you can pull request.