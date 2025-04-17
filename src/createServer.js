'use strict';

const http = require('http');
const { IncomingForm } = require('formidable');
const fs = require('fs');

function createServer() {
  /* Write your code here */
  // Return instance of http.Server class
  return http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/add-expense') {
      const form = new IncomingForm({ multiples: false });

      try {
        const [fields] = await form.parse(req);

        const { date, title, amount } = fields;

        if (!date || !title || !amount) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });

          return res.end('Missing required fields');
        }

        const result = JSON.stringify(fields);

        // console.log('Fields:', fields);

        fs.writeFileSync('db/expense.json', result);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(result);

        // res.end(`<div>
        //   <h1>Date: ${fields['date']}</h1>
        //   <h1>Title: ${fields['title']}</h1>
        //   <h1>Amount: ${fields['amount']}</h1>
        //   </div`);
      } catch (err) {
        res.writeHead(500);
        res.end('Error parsing form');
      }
    } else if (req.method === 'GET' && req.url === '/') {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');

      res.end(`<form method="POST" action="/submit-expense" enctype="multipart/form-data">
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
