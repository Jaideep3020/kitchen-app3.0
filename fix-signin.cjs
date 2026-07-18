const fs = require('fs');
const path = 'src/components/SignIn.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetContent = `  // Auto-fill demo info when role changes
  useEffect(() => {
    if (selectedRole === 'student') {
      setEmail('student@kitchenops.edu');
      setPassword('TestPass123!');
    } else if (selectedRole === 'staff') {
      setEmail('arjun.verma.stf@gmail.com');
      setPassword('TestPass123!');
    } else if (selectedRole === 'manager') {
      setEmail('meera.kapoor.mgr@gmail.com');
      setPassword('TestPass123!');
    }
  }, [selectedRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill all required fields');
      return;
    }
    setError('');

    // Check users from context
    const user = users.find(u => u.email === email.trim() && u.password === password.trim());
    
    if (user) {
      if (user.role !== selectedRole) {
        setError(\`This account does not have \${selectedRole} access.\`);
        return;
      }
      onSignIn(user.role as 'student' | 'staff' | 'manager', user.email);
      return;
    }
    
    setError('Invalid email or password');
  };`;

const replacementContent = `  // Auto-fill demo info when role changes
  useEffect(() => {
    if (selectedRole === 'student') {
      setEmail('student1@mess.edu');
      setPassword('Test1234!');
    } else if (selectedRole === 'staff') {
      setEmail('staff1@mess.edu');
      setPassword('Test1234!');
    } else if (selectedRole === 'manager') {
      setEmail('manager@mess.edu');
      setPassword('Test1234!');
    }
  }, [selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill all required fields');
      return;
    }
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Invalid email or password');
        return;
      }

      const data = await res.json();
      const user = data.user;

      if (user.role !== selectedRole) {
        setError(\`This account does not have \${selectedRole} access.\`);
        return;
      }

      onSignIn(user.role as 'student' | 'staff' | 'manager', user.email);
    } catch (err) {
      console.error(err);
      setError('An error occurred during sign in');
    }
  };`;

content = content.replace(targetContent, replacementContent);
fs.writeFileSync(path, content);
