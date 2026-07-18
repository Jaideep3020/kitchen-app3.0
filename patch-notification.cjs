const fs = require('fs');
let content = fs.readFileSync('src/components/NotificationInbox.tsx', 'utf8');

// Add role to props
content = content.replace(
  /onNavigateToStock: \(draftPO\?: \{ item: string; supplierId: string \}\) => void;\n\}/,
  "onNavigateToStock: (draftPO?: { item: string; supplierId: string }) => void;\n  role?: string;\n}"
);

content = content.replace(
  /export default function NotificationInbox\(\{ isOpen, onClose, prepItems, onNavigateToStock \}: NotificationInboxProps\) \{/,
  "export default function NotificationInbox({ isOpen, onClose, prepItems, onNavigateToStock, role }: NotificationInboxProps) {"
);

// Add student notifications
const studentNotificationsStr = `
  const studentNotifications: NotificationItem[] = role === 'student' ? [
    {
      id: 'rsvp_reminder',
      category: 'All',
      title: 'RSVP Reminder',
      message: 'Do not forget to submit your meal choices for tomorrow by 10:00 PM tonight.',
      icon: <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      colorClasses: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500',
      iconClasses: 'bg-blue-100 dark:bg-blue-900/40'
    }
  ] : [];
`;

content = content.replace(
  /const inventoryNotifications: NotificationItem\[\] = lowStockItems\.map/,
  studentNotificationsStr + "\n  const inventoryNotifications: NotificationItem[] = lowStockItems.map"
);

// Filter based on role
content = content.replace(
  /const allNotifications = \[\.\.\.inventoryNotifications, \.\.\.thresholdAlertNotifications\];/,
  "const allNotifications = role === 'student' ? studentNotifications : [...inventoryNotifications, ...thresholdAlertNotifications];"
);

content = content.replace(
  /const categories: NotificationCategory\[\] = \['All', 'Inventory', 'Waste', 'Orders', 'Maintenance'\];/,
  "const categories: NotificationCategory[] = role === 'student' ? ['All'] : ['All', 'Inventory', 'Waste', 'Orders', 'Maintenance'];"
);

fs.writeFileSync('src/components/NotificationInbox.tsx', content);
