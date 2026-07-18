import fs from 'fs';
let code = fs.readFileSync('src/contexts/DataContext.tsx', 'utf8');

const regex = /if \(menuRes && menuRes\.length > 0\) setMenuItems\(menuRes\);[\s\S]*?isInitiallyLoaded\.current = true;/m;

const replacement = `if (menuRes && menuRes.length > 0) setMenuItems(menuRes);
        if (prepRes && prepRes.length > 0) {
          if (JSON.stringify(prepRes) !== JSON.stringify(prevPrepItems.current)) {
            prevPrepItems.current = prepRes;
            setPrepItems(prepRes);
          }
        } else if (!isInitiallyLoaded.current) {
          prevPrepItems.current = prepItems;
        }
        if (suppRes && suppRes.length > 0) {
          if (JSON.stringify(suppRes) !== JSON.stringify(prevSuppliers.current)) {
            prevSuppliers.current = suppRes;
            setSuppliers(suppRes);
          }
        } else if (!isInitiallyLoaded.current) {
          prevSuppliers.current = suppliers;
        }
        if (activeRes && activeRes.length > 0) {
          if (JSON.stringify(activeRes) !== JSON.stringify(prevActiveOrders.current)) {
            prevActiveOrders.current = activeRes;
            setActiveOrders(activeRes);
          }
        } else if (!isInitiallyLoaded.current) {
          prevActiveOrders.current = activeOrders;
        }
        if (activityRes && activityRes.length > 0) {
          if (JSON.stringify(activityRes) !== JSON.stringify(prevActivityLogs.current)) {
            prevActivityLogs.current = activityRes;
            setActivityLogs(activityRes);
          }
        } else if (!isInitiallyLoaded.current) {
          prevActivityLogs.current = activityLogs;
        }
        if (pastRes && pastRes.length > 0) {
          if (JSON.stringify(pastRes) !== JSON.stringify(prevPastOrders.current)) {
            prevPastOrders.current = pastRes;
            setPastOrders(pastRes);
          }
        } else if (!isInitiallyLoaded.current) {
          prevPastOrders.current = pastOrders;
        }
        if (wasteRes && wasteRes.length > 0) {
          if (JSON.stringify(wasteRes) !== JSON.stringify(prevWasteLogs.current)) {
            prevWasteLogs.current = wasteRes;
            setWasteLogs(wasteRes);
          }
        } else if (!isInitiallyLoaded.current) {
          prevWasteLogs.current = wasteLogs;
        }

        isInitiallyLoaded.current = true;`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/contexts/DataContext.tsx', code);
    console.log("Successfully patched loadFromBackend");
} else {
    console.log("Regex didn't match");
}
