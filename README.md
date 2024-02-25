
# API 

The "Product Transaction Analysis" project is a comprehensive solution designed to empower businesses with efficient management and insightful analysis of their product transactions. Leveraging Node.js for backend development and MySQL for database management, the project offers a robust API infrastructure, facilitating transaction recording, statistical insights generation, and intuitive data visualization through bar and pie charts. With clear API documentation powered by Swagger, developers can seamlessly integrate the solution into their applications, enabling businesses to make informed decisions and optimize their operations based on actionable transaction data.
## Demo

https://roxiler-api-a94k.onrender.com
## Run Locally

Clone the project

```bash
  git clone https://github.com/Ankit6098?tab=repositories
```

Install the packages

```bash
  npm install / npm i
```

Start the Server

```bash
  npm start
```
## API Reference

#### Get all products

```http
  GET /api/product
```

#### Get all products transactions

```http
  GET /api/product/transactions?search=${string}
```

| Query | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `search`    | `string` | **Required**. name of product or description  |


#### Get all products statistics of month

```http
  GET /api/product/statistics/:${year}/:${month}
```

| Query | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `year`    | `number` | **Required**. number of year  |
| `month`    | `number` | **Required**. number of month  |


#### Get all products bar-chart of month

```http
  GET /api/product/bar-chart/:${year}/:${month}
```

| Query | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `year`    | `number` | **Required**. number of year  |
| `month`    | `number` | **Required**. number of month  |


#### Get all products pie-chart of month

```http
  GET /api/product/pie-chart/:${year}/:${month}
```

| Query | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `year`    | `number` | **Required**. number of year  |
| `month`    | `number` | **Required**. number of month  |


#### Get all products combined  data of statistic, bar-chart and pie-chart of month

```http
  GET /api/product/statistics/:${year}/:${month}
```

| Query | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `year`    | `number` | **Required**. number of year  |
| `month`    | `number` | **Required**. number of month  |

## 🚀 About Me

Full Stack Web developer professional with experience developing and designing web applications using Html, CSS, javascript, node.Js, Expressjs, MongoDB, React, GitHub, and UI/UX. Abel to create eye catchy designs and easily adept at developing complex backend systems, web services, databases, Docker.


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ankithub.vercel.app/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColorwhite=)](https://www.linkedin.com/in/ankit-vishwakarma-6531221b0/)


## Feedback

If you have any feedback, please reach out to us at ankitvis609@gmail.com

