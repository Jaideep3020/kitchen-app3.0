const fs = require('fs');
let content = fs.readFileSync('src/db/index.ts', 'utf8');

const hash = "$2b$10$diVGZ86I89n89BOeco9k2OLEE4k5RWLe.tJgmiu1ZLf20eDOoVGRG";

const usersData = `[
  { id: 1, uid: "usr_mgr", name: "Main Manager", email: "manager@mess.edu", role: "manager", passwordHash: "${hash}" },
  { id: 2, uid: "usr_stf1", name: "Staff Member 1", email: "staff1@mess.edu", role: "staff", passwordHash: "${hash}" },
  { id: 3, uid: "usr_stf2", name: "Staff Member 2", email: "staff2@mess.edu", role: "staff", passwordHash: "${hash}" },
  { id: 4, uid: "usr_stu1", name: "Maximilian Bartholomew Alexander Fitzwilliam-Smythe III of House Kensington", email: "student1@mess.edu", role: "student", passwordHash: "${hash}" },
  { id: 5, uid: "usr_stu2", name: "Chloë O'Connor-García", email: "student2@mess.edu", role: "student", passwordHash: "${hash}" },
  { id: 6, uid: "usr_stu3", name: "Student 3", email: "student-with-an-unnecessarily-long-email-address-that-breaks-ui-layouts-often@subdomain.mess.edu", role: "student", passwordHash: "${hash}" },
  { id: 7, uid: "usr_stu4", name: "Student 4", email: "student4@mess.edu", role: "student", passwordHash: "${hash}" }
]`;

if (!content.includes('users: [')) {
  content = content.replace("dashboard_configs: [", `users: ${usersData},\n  dashboard_configs: [`);
  fs.writeFileSync('src/db/index.ts', content);
}
