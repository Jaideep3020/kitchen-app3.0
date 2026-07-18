const http = require('http');

function request(method, path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = http.request('http://localhost:3000' + path, {
      method,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    if (body) req.write(data);
    req.end();
  });
}

(async () => {
  console.log(await request('POST', '/api/auth/login', { email: 'staff3@mess.edu', password: 'Test1234!' }));
  console.log(await request('POST', '/api/auth/login', { email: 'student-with-an-unnecessarily-long-email-address-that-breaks-ui-layouts-often@subdomain.mess.edu', password: 'Test1234!' }));
})();
