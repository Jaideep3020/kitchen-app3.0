import http from 'http';

function request(method: string, path: string, body: any) {
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

function get(path: string): Promise<any[]> {
  return new Promise(resolve => {
    http.get('http://localhost:3000' + path, res => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => resolve(JSON.parse(b)));
    });
  });
}

async function run() {
  console.log("=== 1. SELECT id, email, role, name FROM users ORDER BY role, id ===");
  const allUsers = await get('/api/test-users');
  
  // Sort manually
  allUsers.sort((a, b) => {
    if (a.role < b.role) return -1;
    if (a.role > b.role) return 1;
    return a.id - b.id;
  });

  // Format as table manually for raw output
  console.log("id | email | role | name");
  console.log("-----------------------------------------");
  for (const u of allUsers) {
    console.log(u.id + " | " + u.email + " | " + u.role + " | " + u.name);
  }

  console.log("\n=== 2. Log in via the real /api/auth/login endpoint ===");
  
  const managerLogin = await request('POST', '/api/auth/login', { email: 'manager@mess.edu', password: 'Test1234!' });
  console.log("Manager Login Response:", managerLogin);

  const staffLogin = await request('POST', '/api/auth/login', { email: 'staff1@mess.edu', password: 'Test1234!' });
  console.log("Staff1 Login Response:", staffLogin);

  const student1Login = await request('POST', '/api/auth/login', { email: 'student1@mess.edu', password: 'Test1234!' });
  console.log("Student 1 (Long name) Login Response:", student1Login);

  const student2Login = await request('POST', '/api/auth/login', { email: 'student2@mess.edu', password: 'Test1234!' });
  console.log("Student 2 (Special chars) Login Response:", student2Login);

  const student3Login = await request('POST', '/api/auth/login', { email: 'student-with-an-unnecessarily-long-email-address-that-breaks-ui-layouts-often@subdomain.mess.edu', password: 'Test1234!' });
  console.log("Student 3 (Long email) Login Response:", student3Login);

  console.log("\n=== 3. Confirm a wrong-password attempt ===");
  const wrongPassLogin = await request('POST', '/api/auth/login', { email: 'manager@mess.edu', password: 'WrongPassword123' });
  console.log("Wrong Password Response:", wrongPassLogin);
}

run();
