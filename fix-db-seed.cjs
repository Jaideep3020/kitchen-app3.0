const fs = require('fs');
let content = fs.readFileSync('src/db/index.ts', 'utf8');

const hash = "$2b$10$diVGZ86I89n89BOeco9k2OLEE4k5RWLe.tJgmiu1ZLf20eDOoVGRG";

const generator = `
const generatedUsers = [
  { id: 1, uid: "usr_mgr", name: "Main Manager", email: "manager@mess.edu", role: "manager", passwordHash: "${hash}" }
];

for (let i = 1; i <= 6; i++) {
  generatedUsers.push({
    id: generatedUsers.length + 1,
    uid: "usr_stf" + i,
    name: "Staff Member " + i,
    email: "staff" + i + "@mess.edu",
    role: "staff",
    passwordHash: "${hash}"
  });
}

for (let i = 1; i <= 50; i++) {
  let name = "Student " + i;
  let email = "student" + i + "@mess.edu";
  if (i === 1) name = "Maximilian Bartholomew Alexander Fitzwilliam-Smythe III of House Kensington";
  if (i === 2) name = "Chloë O'Connor-García";
  if (i === 3) email = "student-with-an-unnecessarily-long-email-address-that-breaks-ui-layouts-often@subdomain.mess.edu";
  
  generatedUsers.push({
    id: generatedUsers.length + 1,
    uid: "usr_stu" + i,
    name,
    email,
    role: "student",
    passwordHash: "${hash}"
  });
}
`;

// Remove the hardcoded users array we added earlier
content = content.replace(/users: \[\n[\s\S]*?\],\n  dashboard_configs/, 'dashboard_configs');
// Add the generator
content = content.replace("const mockStorage: Record<string, any[]> = {", generator + "\nconst mockStorage: Record<string, any[]> = {\n  users: generatedUsers,");

fs.writeFileSync('src/db/index.ts', content);
