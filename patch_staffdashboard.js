import fs from 'fs';
let code = fs.readFileSync('src/components/StaffDashboard.tsx', 'utf8');

code = code.replace(/                             addToast\('Invoice parsed successfully\.', 'success'\);\n                          \} catch \(err\) \{\n                             console\.error\(err\);\n                          \}/, `                             if (res.ok) {
                               addToast('Invoice parsed successfully.', 'success');
                             } else {
                               addToast('Failed to parse invoice', 'error');
                             }
                          } catch (err) {
                             console.error(err);
                             addToast('Network error while parsing invoice', 'error');
                          }`);
fs.writeFileSync('src/components/StaffDashboard.tsx', code);
console.log("Successfully patched StaffDashboard.tsx");
