'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  return http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/add-expense') {
      try {
        let body = '';

        req.on('data', (chunk) => {
          body += chunk.toString();
        });

        req.on('end', () => {
          const expense = JSON.parse(body);

          const { date, title, amount } = expense;

          if (!date || !title || !amount) {
            res.writeHead(400);

            return res.end('Missing required fields');
          }

          fs.writeFileSync('db/expense.json', JSON.stringify(expense));

          const file = fs.readFileSync('db/expense.json');

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(file);
        });
      } catch (err) {
        res.writeHead(500);
        res.end('Error parsing form');
      }
    } else if (req.method === 'GET' && req.url === '/') {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');

      res.end(`<h1>Input data</h1>
        <form method="POST" action="/add-expense">
        <input name="date" type="date" required>
        <input name="title" type="text" required>
        <input name="amount" type="number" required>

        <button type="submit">Submit</button>
      </form>`);
    } else {
      res.statusCode = 404;
      res.end('Page not found');
    }
  });
}

module.exports = {
  createServer,
};
