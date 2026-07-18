const http = require('http');

function request(method, path, body, headers = {}) {
  return new Promise(resolve => {
    const data = JSON.stringify(body);
    const req = http.request('http://localhost:3000' + path, {
      method,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), ...headers }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    if (body) req.write(data);
    req.end();
  });
}

async function run() {
  console.log("Seeding Manager...");
  await request('POST', '/api/auth/signup', {
    name: 'Main Manager',
    email: 'manager@mess.edu',
    password: 'Test1234!',
    role: 'manager'
  });

  console.log("Seeding Staff...");
  for (let i = 1; i <= 6; i++) {
    await request('POST', '/api/auth/signup', {
      name: 'Staff Member ' + i,
      email: 'staff' + i + '@mess.edu',
      password: 'Test1234!',
      role: 'staff'
    });
  }

  console.log("Seeding Students...");
  for (let i = 1; i <= 50; i++) {
    let name = 'Student ' + i;
    let email = 'student' + i + '@mess.edu';
    
    // Edge cases
    if (i === 1) {
      name = "Maximilian Bartholomew Alexander Fitzwilliam-Smythe III of House Kensington"; // very long name
    } else if (i === 2) {
      name = "Chloë O'Connor-García"; // special characters
    } else if (i === 3) {
      email = "student-with-an-unnecessarily-long-email-address-that-breaks-ui-layouts-often@subdomain.mess.edu";
    }

    await request('POST', '/api/auth/signup', {
      name,
      email,
      password: 'Test1234!',
      role: 'student'
    });
  }
  console.log("Seeding Complete.");
}

run();
