const http = require('http');
const fs = require('fs');
const path = require('path');
const calculator = require('./cal1');

const port = 5000;

function handleRequest(req, res) {
    fs.readFile(path.join(__dirname, 'cal.html'), function(err, data) {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal Server Error');
            return;
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
}

function handleCalculation(req, res) {
    let body = '';
    req.on('data', function(chunk) {
        body += chunk.toString();
    });

    req.on('end', function() {
        const params = new URLSearchParams(body);
        const num1 = parseFloat(params.get('num1'));
        const num2 = parseFloat(params.get('num2'));
        const operation = params.get('operation');

        let result;
        try {
            switch (operation) {
                case 'add':
                    result = calculator.add(num1, num2);
                    break;
                case 'subtract':
                    result = calculator.subtract(num1, num2);
                    break;
                case 'multiply':
                    result = calculator.multiply(num1, num2);
                    break;
                case 'divide':
                    result = calculator.divide(num1, num2);
                    break;
                case 'modulo':
                    result = calculator.modulo(num1, num2);
                    break;
                case 'power':
                    result = calculator.power(num1, num2);
                    break;
                default:
                    result = 'Invalid operation';
            }
        } catch (error) {
            result = error.message;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`Result: ${result}`);
    });
}

const server = http.createServer(function(req, res) {
    if (req.url === '/' && req.method === 'GET') {
        handleRequest(req, res);
    } else if (req.url === '/calculate' && req.method === 'POST') {
        handleCalculation(req, res);
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

server.listen(port, function() {
    console.log('Server is running on http://localhost:' + port);
});
