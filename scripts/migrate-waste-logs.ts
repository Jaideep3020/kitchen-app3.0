import crypto from 'crypto';

export interface OldWasteLogRow {
  id: number | string;
  shift?: string;
  wasteType?: string;
  category?: string;
  item?: string;
  weight?: number | string;
  createdAt?: Date | string;
}

export interface NewWasteLogRow {
  id: string;
  orgId: string;
  mealSessionId: string | null;
  sourceType: 'plate_waste' | 'cooking_failure' | 'reuse_writeoff';
  menuItemId: string | null;
  weightKg: string;
  loggedBy: string;
  createdAt: Date;
  unconfidentMapping?: boolean;
  unconfidentReason?: string;
}

export function mapWasteLog(
  row: OldWasteLogRow,
  menuItemsList: Array<{ id: string | number; name: string }> = []
): NewWasteLogRow {
  const wasteType = (row.wasteType || '').toLowerCase();
  const category = (row.category || '').toLowerCase();
  const item = (row.item || '').trim();

  let sourceType: 'plate_waste' | 'cooking_failure' | 'reuse_writeoff' = 'plate_waste';
  let unconfidentMapping = false;
  let unconfidentReason: string | undefined;

  // Determine sourceType from wasteType / category
  if (
    wasteType.includes('cook') ||
    wasteType.includes('prep') ||
    wasteType.includes('kitchen') ||
    wasteType.includes('failure') ||
    category.includes('cooking') ||
    category.includes('prep')
  ) {
    sourceType = 'cooking_failure';
  } else if (
    wasteType.includes('reuse') ||
    wasteType.includes('writeoff') ||
    wasteType.includes('expire') ||
    category.includes('reuse') ||
    category.includes('writeoff')
  ) {
    sourceType = 'reuse_writeoff';
  } else if (
    wasteType.includes('plate') ||
    wasteType.includes('dining') ||
    wasteType.includes('student') ||
    category.includes('plate') ||
    category.includes('dining')
  ) {
    sourceType = 'plate_waste';
  } else {
    // Default to plate_waste and flag as unconfident
    sourceType = 'plate_waste';
    unconfidentMapping = true;
    unconfidentReason = `Unrecognized wasteType '${row.wasteType}' / category '${row.category}'. Defaulted to plate_waste.`;
  }

  // Determine menuItemId if cooking_failure
  let menuItemId: string | null = null;
  if (sourceType === 'cooking_failure' && item) {
    const matchedItem = menuItemsList.find(
      (m) => m.name.toLowerCase() === item.toLowerCase() || String(m.id) === item
    );
    if (matchedItem) {
      menuItemId = String(matchedItem.id);
    } else {
      unconfidentMapping = true;
      unconfidentReason = `Cooking failure item '${item}' could not be matched to a menu_item id.`;
    }
  }

  const weightKg = String(row.weight || '0');
  const loggedBy = 'system_migration';
  const createdAt = row.createdAt ? new Date(row.createdAt) : new Date();

  return {
    id: `waste_${crypto.randomUUID()}`,
    orgId: 'default-org',
    mealSessionId: null,
    sourceType,
    menuItemId,
    weightKg,
    loggedBy,
    createdAt,
    unconfidentMapping,
    unconfidentReason,
  };
}

export function runWasteLogDataMigration(
  existingRows: OldWasteLogRow[],
  menuItemsList: Array<{ id: string | number; name: string }> = []
) {
  console.log(`Starting data migration for ${existingRows.length} waste_logs rows...`);
  const mapped: NewWasteLogRow[] = [];
  const flagged: NewWasteLogRow[] = [];

  for (const row of existingRows) {
    const migrated = mapWasteLog(row, menuItemsList);
    mapped.push(migrated);
    if (migrated.unconfidentMapping) {
      flagged.push(migrated);
    }
  }

  console.log(`Mapped ${mapped.length} rows successfully.`);
  if (flagged.length > 0) {
    console.warn(`[WARNING] Flagged ${flagged.length} rows with unconfident mappings:`);
    flagged.forEach((f) => console.warn(` - Row ID ${f.id}: ${f.unconfidentReason}`));
  }

  return { mapped, flagged };
}
