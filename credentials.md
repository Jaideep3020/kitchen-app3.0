=== 1. SELECT id, email, role, name FROM users ORDER BY role, id ===
id | email | role | name
-----------------------------------------
1 | manager@mess.edu | manager | Main Manager
2 | staff1@mess.edu | staff | Staff Member 1
3 | staff2@mess.edu | staff | Staff Member 2
4 | staff3@mess.edu | staff | Staff Member 3
5 | staff4@mess.edu | staff | Staff Member 4
6 | staff5@mess.edu | staff | Staff Member 5
7 | staff6@mess.edu | staff | Staff Member 6
8 | student1@mess.edu | student | Maximilian Bartholomew Alexander Fitzwilliam-Smythe III of House Kensington
9 | student2@mess.edu | student | Chloë O'Connor-García
10 | student-with-an-unnecessarily-long-email-address-that-breaks-ui-layouts-often@subdomain.mess.edu | student | Student 3
11 | student4@mess.edu | student | Student 4
12 | student5@mess.edu | student | Student 5
13 | student6@mess.edu | student | Student 6
14 | student7@mess.edu | student | Student 7
15 | student8@mess.edu | student | Student 8
16 | student9@mess.edu | student | Student 9
17 | student10@mess.edu | student | Student 10
18 | student11@mess.edu | student | Student 11
19 | student12@mess.edu | student | Student 12
20 | student13@mess.edu | student | Student 13
21 | student14@mess.edu | student | Student 14
22 | student15@mess.edu | student | Student 15
23 | student16@mess.edu | student | Student 16
24 | student17@mess.edu | student | Student 17
25 | student18@mess.edu | student | Student 18
26 | student19@mess.edu | student | Student 19
27 | student20@mess.edu | student | Student 20
28 | student21@mess.edu | student | Student 21
29 | student22@mess.edu | student | Student 22
30 | student23@mess.edu | student | Student 23
31 | student24@mess.edu | student | Student 24
32 | student25@mess.edu | student | Student 25
33 | student26@mess.edu | student | Student 26
34 | student27@mess.edu | student | Student 27
35 | student28@mess.edu | student | Student 28
36 | student29@mess.edu | student | Student 29
37 | student30@mess.edu | student | Student 30
38 | student31@mess.edu | student | Student 31
39 | student32@mess.edu | student | Student 32
40 | student33@mess.edu | student | Student 33
41 | student34@mess.edu | student | Student 34
42 | student35@mess.edu | student | Student 35
43 | student36@mess.edu | student | Student 36
44 | student37@mess.edu | student | Student 37
45 | student38@mess.edu | student | Student 38
46 | student39@mess.edu | student | Student 39
47 | student40@mess.edu | student | Student 40
48 | student41@mess.edu | student | Student 41
49 | student42@mess.edu | student | Student 42
50 | student43@mess.edu | student | Student 43
51 | student44@mess.edu | student | Student 44
52 | student45@mess.edu | student | Student 45
53 | student46@mess.edu | student | Student 46
54 | student47@mess.edu | student | Student 47
55 | student48@mess.edu | student | Student 48
56 | student49@mess.edu | student | Student 49
57 | student50@mess.edu | student | Student 50

=== 2. Log in via the real /api/auth/login endpoint ===
Manager Login Response: {
  status: 200,
  body: '{"token":"mock-jwt-token","user":{"id":1,"createdAt":"2026-07-18T11:42:55.902Z","uid":"usr_17843749759022tikh","name":"Main Manager","email":"manager@mess.edu","role":"manager"}}'
}
Staff1 Login Response: {
  status: 200,
  body: '{"token":"mock-jwt-token","user":{"id":2,"createdAt":"2026-07-18T11:42:55.977Z","uid":"usr_1784374975977x2qov","name":"Staff Member 1","email":"staff1@mess.edu","role":"staff"}}'
}
Student 1 (Long name) Login Response: {
  status: 200,
  body: '{"token":"mock-jwt-token","user":{"id":8,"createdAt":"2026-07-18T11:42:56.369Z","uid":"usr_1784374976369eb12q","name":"Maximilian Bartholomew Alexander Fitzwilliam-Smythe III of House Kensington","email":"student1@mess.edu","role":"student"}}'
}
Student 2 (Special chars) Login Response: {
  status: 200,
  body: `{"token":"mock-jwt-token","user":{"id":9,"createdAt":"2026-07-18T11:42:56.438Z","uid":"usr_1784374976437pc502","name":"Chloë O'Connor-García","email":"student2@mess.edu","role":"student"}}`
}
Student 3 (Long email) Login Response: {
  status: 200,
  body: '{"token":"mock-jwt-token","user":{"id":10,"createdAt":"2026-07-18T11:42:56.505Z","uid":"usr_1784374976505wg3a9","name":"Student 3","email":"student-with-an-unnecessarily-long-email-address-that-breaks-ui-layouts-often@subdomain.mess.edu","role":"student"}}'
}

=== 3. Confirm a wrong-password attempt ===
Wrong Password Response: { status: 401, body: '{"error":"Invalid credentials"}' }
