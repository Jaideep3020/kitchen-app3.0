import { MenuItem, InventoryItem, Supplier, ActiveOrder, ActivityLog, EfficiencyRecord } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // --- MONDAY ---
  {
    id: 'mon_bf',
    name: 'Idli, Sambar & Coconut Chutney',
    mealType: 'breakfast',
    category: 'main',
    description: 'Soft, fluffy steamed rice cakes served with hot lentil vegetable stew (sambar) and freshly grated coconut chutney.',
    calories: 320,
    tags: ['VEG', 'GLUTEN-FREE'],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Monday'
  },
  {
    id: 'mon_lh',
    name: 'Rice, Tomato Dal & Cabbage Poriyal',
    mealType: 'lunch',
    category: 'vegetarian_main',
    description: 'Steamed Sona Masuri rice paired with home-style tomato dal, lightly sauteed shredded cabbage with coconut and mustard seeds, fresh rasam, and thick curd.',
    calories: 520,
    tags: ['VEG', 'NUTRIENT-RICH'],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Monday'
  },
  {
    id: 'mon_dn',
    name: 'Chapati, Veg Kurma & White Rice',
    mealType: 'dinner',
    category: 'main',
    description: 'Freshly rolled whole wheat chapatis served with an aromatic mixed vegetable kurma cooked in coconut-cashew gravy, white rice, and refreshing spiced buttermilk.',
    calories: 480,
    tags: ['VEG', 'FIBER-RICH'],
    image: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Monday'
  },

  // --- TUESDAY ---
  {
    id: 'tue_bf',
    name: 'Rava Upma & Peanut Chutney',
    mealType: 'breakfast',
    category: 'main',
    description: 'Savory semolina porridge roasted with tempered mustard seeds, green chilies, curry leaves, and crunchy peanuts, served with rich peanut chutney and a ripe banana.',
    calories: 350,
    tags: ['VEG', 'QUICK ENERGY'],
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Tuesday'
  },
  {
    id: 'tue_lh',
    name: 'Lemon Rice & Crispy Potato Fry',
    mealType: 'lunch',
    category: 'main',
    description: 'Tangy Sona Masuri rice tempered with turmeric, lemon juice, crunchy chana dal, peanuts, and fresh curry leaves, accompanied by golden-fried spicy potato cubes.',
    calories: 580,
    tags: ['VEG', 'TANGY'],
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Tuesday'
  },
  {
    id: 'tue_dn',
    name: 'Veg Biryani with Boiled Egg / Paneer',
    mealType: 'dinner',
    category: 'main',
    description: 'Slow-cooked fragrant Basmati rice layered with seasonal vegetables and exotic whole spices, served with cooling onion raita and your choice of boiled egg or grilled paneer.',
    calories: 620,
    tags: ['HIGH PROTEIN', 'VEG OPTION'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Tuesday'
  },

  // --- WEDNESDAY ---
  {
    id: 'wed_bf',
    name: 'Masala Dosa, Sambar & Chutney',
    mealType: 'breakfast',
    category: 'main',
    description: 'Crisp golden crepe made of fermented rice-lentil batter, stuffed with a lightly spiced potato mash, served with warm sambar and fresh tomato chutney.',
    calories: 390,
    tags: ['VEG', 'PROBIOTIC'],
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Wednesday'
  },
  {
    id: 'wed_lh',
    name: 'Rice, Spinach Dal & Bhindi Fry',
    mealType: 'lunch',
    category: 'vegetarian_main',
    description: 'Steamed rice served with nutrient-dense spinach dal, crispy pan-fried bhindi (okra/ladyfinger) with local spices, sour Majjiga Pulusu (buttermilk stew), and curd.',
    calories: 510,
    tags: ['VEG', 'IRON-RICH'],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Wednesday'
  },
  {
    id: 'wed_dn',
    name: 'Chapati, Soya Chunk Curry & Rasam',
    mealType: 'dinner',
    category: 'main',
    description: 'Fresh whole wheat chapatis paired with a high-protein soya chunk (meal maker) masala curry, steamed rice, and spicy-sour pepper rasam.',
    calories: 490,
    tags: ['HIGH PROTEIN', 'VEG'],
    image: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Wednesday'
  },

  // --- THURSDAY ---
  {
    id: 'thu_bf',
    name: 'Ven Pongal, Medu Vada & Chutney',
    mealType: 'breakfast',
    category: 'main',
    description: 'Comforting mash of rice and yellow moong dal cooked with black pepper, cumin, ginger, and ghee, paired with a crispy, savory lentil donut (medu vada) and coconut chutney.',
    calories: 410,
    tags: ['VEG', 'COMFORT FOOD'],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Thursday'
  },
  {
    id: 'thu_lh',
    name: 'Rice, Sambar & Carrot/Beans Poriyal',
    mealType: 'lunch',
    category: 'vegetarian_main',
    description: 'Hot steamed Sona Masuri rice served with thick, drumstick and carrot sambar, a fresh carrot & french beans poriyal, crispy papad, and fresh curd.',
    calories: 530,
    tags: ['VEG', 'HIGH VITAMIN'],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Thursday'
  },
  {
    id: 'thu_dn',
    name: 'Tomato Rice & Dal Fry with Chapati',
    mealType: 'dinner',
    category: 'main',
    description: 'Spicy, tangy tomato-infused rice cooked with whole spices, served alongside a comforting yellow dal fry, soft chapatis, and refreshing cucumber raita.',
    calories: 470,
    tags: ['VEG', 'WARM'],
    image: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Thursday'
  },

  // --- FRIDAY ---
  {
    id: 'fri_bf',
    name: 'Lemon Poha & Boiled Egg / Fruit',
    mealType: 'breakfast',
    category: 'main',
    description: 'Light flattened rice seasoned with lemon juice, turmeric, crunchy peanuts, and fresh mint chutney, served with a boiled egg or fresh fruit.',
    calories: 340,
    tags: ['VEG OPTION', 'LIGHT'],
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Friday'
  },
  {
    id: 'fri_lh',
    name: 'Rice, Mango Dal & Ivy Gourd Fry',
    mealType: 'lunch',
    category: 'vegetarian_main',
    description: 'Steamed rice paired with seasonal sour raw mango dal (muga pappu), crispy stir-fried ivy gourd (dondakaya fry), hot pepper rasam, and curd.',
    calories: 550,
    tags: ['VEG', 'SEASONAL'],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Friday'
  },
  {
    id: 'fri_dn',
    name: 'Chapati, Chana Masala & White Rice',
    mealType: 'dinner',
    category: 'main',
    description: 'Warm, puffed chapatis served with a robust, ginger-infused Punjabi chana masala (chickpea curry), steamed white rice, and cooling buttermilk.',
    calories: 500,
    tags: ['HIGH PROTEIN', 'VEG'],
    image: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Friday'
  },

  // --- SATURDAY ---
  {
    id: 'sat_bf',
    name: 'Puri & Potato Masala (Aloo Kurma)',
    mealType: 'breakfast',
    category: 'main',
    description: 'Crispy deep-fried whole wheat puffed puris served with a mildly spiced, delicious onion-potato masala curry.',
    calories: 450,
    tags: ['VEG', 'WEEKEND TREAT'],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Saturday'
  },
  {
    id: 'sat_lh',
    name: 'Tamarind Rice (Pulihora) & Dal',
    mealType: 'lunch',
    category: 'main',
    description: 'Traditional sour and spicy tamarind rice infused with roasted peanuts, sesame powder, and dry red chilies, served with plain dal, mixed veg curry, and curd.',
    calories: 590,
    tags: ['VEG', 'TRADITIONAL'],
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Saturday'
  },
  {
    id: 'sat_dn',
    name: 'Veg Fried Rice & Crispy Gobi Manchurian',
    mealType: 'dinner',
    category: 'main',
    description: 'Chinese-style wok-tossed fried rice loaded with finely chopped carrots and beans, served with crispy, spicy batter-fried cauliflower in a tangy soy sauce gravy.',
    calories: 610,
    tags: ['VEG', 'INDO-CHINESE'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Saturday'
  },

  // --- SUNDAY ---
  {
    id: 'sun_bf',
    name: 'Mysore Bonda & Ginger Chutney',
    mealType: 'breakfast',
    category: 'main',
    description: 'Crispy outside, soft-spongy inside fried flour dumplings made with sour curd and spices, served with fresh, spicy ginger-tamarind chutney.',
    calories: 420,
    tags: ['VEG', 'SPICY'],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Sunday'
  },
  {
    id: 'sun_lh',
    name: 'Chicken Curry / Paneer Masala & Bagara Rice',
    mealType: 'lunch',
    category: 'main',
    description: 'Rich, aromatic bagara (tempered) rice served with home-style chicken curry (or premium butter paneer masala for vegetarians) and a Sunday sweet payasam.',
    calories: 680,
    tags: ['FESTIVE SPECIAL', 'HIGH PROTEIN'],
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Sunday'
  },
  {
    id: 'sun_dn',
    name: 'Uttapam, Sambar & Coconut Chutney',
    mealType: 'dinner',
    category: 'main',
    description: 'Thick fermented rice-lentil pancakes topped with finely chopped onions, tomatoes, coriander, and green chilies, served with hot sambar and fresh chutney.',
    calories: 430,
    tags: ['VEG', 'LIGHT DINNER'],
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    dayOfWeek: 'Sunday'
  }
];

export const INITIAL_PREP_ITEMS: InventoryItem[] = [
  {
    id: 'unused_veg',
    name: 'Random Spinach',
    category: 'vegetables',
    unit: 'kg',
    currentStock: 10,
    targetStock: 20,
    reorderLevel: 5,
    status: 'In Stock',
    supplierId: '2'
  },
  // --- GRAINS & LENTILS ---
  {
    id: 'grain_1',
    name: 'Sona Masuri / Raw Rice',
    category: 'grains_lentils',
    unit: 'kg',
    currentStock: 120,
    targetStock: 150,
    reorderLevel: 40,
    status: 'In Stock',
    supplierId: undefined
  },
  {
    id: 'grain_2',
    name: 'Idli Rice & Urad Dal',
    category: 'grains_lentils',
    unit: 'kg',
    currentStock: 85,
    targetStock: 100,
    reorderLevel: 25,
    status: 'In Stock',
    supplierId: 'sup_1'
  },
  {
    id: 'grain_3',
    name: 'Basmati / Jeera Samba Rice',
    category: 'grains_lentils',
    unit: 'kg',
    currentStock: 28,
    targetStock: 60,
    reorderLevel: 20,
    status: 'Low',
    supplierId: 'sup_1'
  },
  {
    id: 'grain_4',
    name: 'Wheat Flour (Atta)',
    category: 'grains_lentils',
    unit: 'kg',
    currentStock: 110,
    targetStock: 120,
    reorderLevel: 30,
    status: 'In Stock',
    supplierId: 'sup_1'
  },
  {
    id: 'grain_5',
    name: 'Toor Dal & Moong Dal',
    category: 'grains_lentils',
    unit: 'kg',
    currentStock: 65,
    targetStock: 80,
    reorderLevel: 20,
    status: 'In Stock',
    supplierId: 'sup_1'
  },
  {
    id: 'grain_6',
    name: 'Chana Dal & Peanuts',
    category: 'grains_lentils',
    unit: 'kg',
    currentStock: 14,
    targetStock: 30,
    reorderLevel: 15,
    status: 'Low',
    supplierId: 'sup_1'
  },
  {
    id: 'grain_7',
    name: 'Rava (Semolina) & Poha',
    category: 'grains_lentils',
    unit: 'kg',
    currentStock: 35,
    targetStock: 40,
    reorderLevel: 10,
    status: 'In Stock',
    supplierId: 'sup_1'
  },
  {
    id: 'grain_8',
    name: 'Maida & Besan',
    category: 'grains_lentils',
    unit: 'kg',
    currentStock: 8,
    targetStock: 25,
    reorderLevel: 10,
    status: 'Low',
    supplierId: 'sup_1'
  },

  // --- PROTEINS & DAIRY ---
  {
    id: 'prot_1',
    name: 'Soya Chunks (Meal Maker)',
    category: 'proteins_dairy',
    unit: 'kg',
    currentStock: 18,
    targetStock: 20,
    reorderLevel: 5,
    status: 'In Stock',
    supplierId: 'sup_3'
  },
  {
    id: 'prot_2',
    name: 'White Chana (Chickpeas)',
    category: 'proteins_dairy',
    unit: 'kg',
    currentStock: 12,
    targetStock: 25,
    reorderLevel: 10,
    status: 'Low',
    supplierId: 'sup_3'
  },
  {
    id: 'prot_3',
    name: 'Milk, Curd & Buttermilk',
    category: 'proteins_dairy',
    unit: 'L',
    currentStock: 95,
    targetStock: 120,
    reorderLevel: 30,
    status: 'In Stock',
    supplierId: 'sup_3'
  },
  {
    id: 'prot_4',
    name: 'Eggs, Chicken, Paneer',
    category: 'proteins_dairy',
    unit: 'kg',
    currentStock: 0,
    targetStock: 45,
    reorderLevel: 15,
    status: 'Out',
    supplierId: 'sup_3'
  },

  // --- VEGETABLES ---
  {
    id: 'veg_1',
    name: 'Onions & Tomatoes',
    category: 'vegetables',
    unit: 'kg',
    currentStock: 42,
    targetStock: 80,
    reorderLevel: 30,
    status: 'Low',
    supplierId: 'sup_2'
  },
  {
    id: 'veg_2',
    name: 'Potatoes',
    category: 'vegetables',
    unit: 'kg',
    currentStock: 48,
    targetStock: 50,
    reorderLevel: 15,
    status: 'In Stock',
    supplierId: 'sup_2'
  },
  {
    id: 'veg_3',
    name: 'Cabbage & Carrots & Beans',
    category: 'vegetables',
    unit: 'kg',
    currentStock: 32,
    targetStock: 40,
    reorderLevel: 15,
    status: 'In Stock',
    supplierId: 'sup_2'
  },
  {
    id: 'veg_4',
    name: 'Bhindi (Okra) & Ivy Gourd',
    category: 'vegetables',
    unit: 'kg',
    currentStock: 15,
    targetStock: 30,
    reorderLevel: 12,
    status: 'Low',
    supplierId: 'sup_2'
  },
  {
    id: 'veg_5',
    name: 'Cauliflower (Gobi)',
    category: 'vegetables',
    unit: 'kg',
    currentStock: 22,
    targetStock: 25,
    reorderLevel: 8,
    status: 'In Stock',
    supplierId: 'sup_2'
  },
  {
    id: 'veg_6',
    name: 'Spinach/Palak & Mango/Gongura',
    category: 'vegetables',
    unit: 'kg',
    currentStock: 6,
    targetStock: 20,
    reorderLevel: 10,
    status: 'Low',
    supplierId: 'sup_2'
  },
  {
    id: 'veg_7',
    name: 'Coriander, Mint & Curry Leaves',
    category: 'vegetables',
    unit: 'kg',
    currentStock: 8,
    targetStock: 10,
    reorderLevel: 3,
    status: 'In Stock',
    supplierId: 'sup_2'
  },
  {
    id: 'veg_8',
    name: 'Green Chilies, Ginger & Garlic',
    category: 'vegetables',
    unit: 'kg',
    currentStock: 12,
    targetStock: 15,
    reorderLevel: 5,
    status: 'In Stock',
    supplierId: 'sup_2'
  },
  {
    id: 'veg_9',
    name: 'Fresh Coconuts',
    category: 'vegetables',
    unit: 'pcs',
    currentStock: 24,
    targetStock: 40,
    reorderLevel: 15,
    status: 'Low',
    supplierId: 'sup_2'
  },
  {
    id: 'veg_10',
    name: 'Lemons & Bananas',
    category: 'vegetables',
    unit: 'pcs',
    currentStock: 15,
    targetStock: 100,
    reorderLevel: 30,
    status: 'Low',
    supplierId: 'sup_2'
  },

  // --- SPICES & CONDIMENTS ---
  {
    id: 'spice_1',
    name: 'Cooking Oil & Ghee',
    category: 'spices_condiments',
    unit: 'L',
    currentStock: 55,
    targetStock: 60,
    reorderLevel: 15,
    status: 'In Stock',
    supplierId: 'sup_4'
  },
  {
    id: 'spice_2',
    name: 'Mustard & Cumin Seeds',
    category: 'spices_condiments',
    unit: 'kg',
    currentStock: 12,
    targetStock: 15,
    reorderLevel: 4,
    status: 'In Stock',
    supplierId: 'sup_4'
  },
  {
    id: 'spice_3',
    name: 'Whole Spices (Cloves, Cinnamon, Cardamom)',
    category: 'spices_condiments',
    unit: 'kg',
    currentStock: 4,
    targetStock: 5,
    reorderLevel: 2,
    status: 'In Stock',
    supplierId: 'sup_4'
  },
  {
    id: 'spice_4',
    name: 'Powdered Spices (Turmeric, Red Chili)',
    category: 'spices_condiments',
    unit: 'kg',
    currentStock: 14,
    targetStock: 20,
    reorderLevel: 5,
    status: 'In Stock',
    supplierId: 'sup_4'
  },
  {
    id: 'spice_5',
    name: 'Sambar & Rasam Powder',
    category: 'spices_condiments',
    unit: 'kg',
    currentStock: 18,
    targetStock: 20,
    reorderLevel: 6,
    status: 'In Stock',
    supplierId: 'sup_4'
  },
  {
    id: 'spice_6',
    name: 'Tamarind & Jaggery',
    category: 'spices_condiments',
    unit: 'kg',
    currentStock: 22,
    targetStock: 25,
    reorderLevel: 8,
    status: 'In Stock',
    supplierId: 'sup_4'
  },
  {
    id: 'spice_7',
    name: 'Salt & Dried Red Chilies',
    category: 'spices_condiments',
    unit: 'kg',
    currentStock: 30,
    targetStock: 30,
    reorderLevel: 5,
    status: 'In Stock',
    supplierId: 'sup_4'
  },
  {
    id: 'spice_8',
    name: 'Pickles & Papad',
    category: 'spices_condiments',
    unit: 'kg',
    currentStock: 25,
    targetStock: 30,
    reorderLevel: 8,
    status: 'In Stock',
    supplierId: 'sup_4'
  },
  {
    id: 'spice_9',
    name: 'Soy Sauce & Vinegar',
    category: 'spices_condiments',
    unit: 'L',
    currentStock: 4,
    targetStock: 5,
    reorderLevel: 2,
    status: 'In Stock',
    supplierId: 'sup_4'
  },
  {
    id: 'spice_10',
    name: 'Sugar / Vermicelli / Sago',
    category: 'spices_condiments',
    unit: 'kg',
    currentStock: 16,
    targetStock: 20,
    reorderLevel: 5,
    status: 'In Stock',
    supplierId: 'sup_4'
  }
];

export const INITIAL_ACTIVE_ORDERS: ActiveOrder[] = [
  {
    id: 'po_102',
    supplierName: 'Krishna Fresh Vegetable Suppliers',
    eta: 'Today',
    status: 'In Transit',
    item: 'Tomatoes',
    quantity: 50,
    price: 1200,
    date: '10/02/2026'
  },
  {
    id: 'po_103',
    supplierName: 'Golden Harvest Dairy Pvt Ltd',
    eta: 'Today',
    status: 'In Transit',
    item: 'Milk',
    quantity: 100,
    price: 3500,
    date: '10/02/2026'
  },
  {
    id: 'po_104',
    supplierName: 'Fresh Farm Poultry & Eggs Co',
    eta: 'Tomorrow',
    status: 'Placed',
    item: 'Eggs',
    quantity: 500,
    price: 2500,
    date: '10/02/2026'
  },
  {
    id: 'po_105',
    supplierName: 'Sri Venkateswara Rice & Grain Mills',
    eta: 'Delivered',
    status: 'Received',
    item: 'Sona Masuri Rice',
    quantity: 200,
    price: 8500,
    date: '08/02/2026'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup_1',
    name: 'Sri Venkateswara Rice & Grain Mills',
    category: 'Grains & Cereals',
    email: 'sales@svrgrainmills.in',
    phone: '+91 98480 11234',
    distance: '12',
    leadTime: '1 day',
    items: [
      { name: 'Sona Masuri Rice', status: 'In Stock' },
      { name: 'Raw Rice', status: 'In Stock' },
      { name: 'Idli Rice', status: 'In Stock' },
      { name: 'Basmati Rice', status: 'In Stock' },
      { name: 'Jeera Samba Rice', status: 'In Stock' }
    ],
    attentionNeeded: null,
    criticalMessage: null,
    statusText: 'All items stocked up'
  },
  {
    id: 'sup_2',
    name: 'Annapurna Pulses & Flour Traders',
    category: 'Grains & Lentils',
    email: 'orders@annapurnapulses.com',
    phone: '+91 90140 22456',
    distance: '18',
    leadTime: '2 days',
    items: [
      { name: 'Urad Dal', status: 'In Stock' },
      { name: 'Toor Dal', status: 'In Stock' },
      { name: 'Moong Dal', status: 'In Stock' },
      { name: 'Chana Dal', status: 'In Stock' },
      { name: 'Wheat Flour (Atta)', status: 'In Stock' },
      { name: 'Maida', status: 'In Stock' },
      { name: 'Besan', status: 'In Stock' },
      { name: 'Rava (Semolina)', status: 'In Stock' },
      { name: 'Poha', status: 'In Stock' },
      { name: 'Peanuts', status: 'In Stock' }
    ],
    attentionNeeded: null,
    criticalMessage: null,
    statusText: 'All items stocked up'
  },
  {
    id: 'sup_3',
    name: 'Golden Harvest Dairy Pvt Ltd',
    category: 'Dairy Products',
    email: 'supply@goldenharvestdairy.co.in',
    phone: '+91 88860 33789',
    distance: '8',
    leadTime: 'Daily',
    items: [
      { name: 'Milk', status: 'In Stock' },
      { name: 'Curd', status: 'In Stock' },
      { name: 'Buttermilk', status: 'In Stock' },
      { name: 'Paneer', status: 'In Stock' },
      { name: 'Ghee', status: 'In Stock' }
    ],
    attentionNeeded: null,
    criticalMessage: null,
    statusText: 'All items stocked up'
  },
  {
    id: 'sup_4',
    name: 'Fresh Farm Poultry & Eggs Co',
    category: 'Poultry & Eggs',
    email: 'contact@freshfarmpoultry.in',
    phone: '+91 97010 44562',
    distance: '15',
    leadTime: '1 day',
    items: [
      { name: 'Eggs', status: 'In Stock' },
      { name: 'Chicken', status: 'In Stock' }
    ],
    attentionNeeded: null,
    criticalMessage: null,
    statusText: 'All items stocked up'
  },
  {
    id: 'sup_5',
    name: 'Nature\'s Best Protein Foods',
    category: 'Packaged Proteins',
    email: 'info@naturesbestfoods.com',
    phone: '+91 96760 55891',
    distance: '22',
    leadTime: '3 days',
    items: [
      { name: 'Soya Chunks (Meal Maker)', status: 'In Stock' },
      { name: 'White Chana (Chickpeas)', status: 'In Stock' }
    ],
    attentionNeeded: null,
    criticalMessage: null,
    statusText: 'All items stocked up'
  },
  {
    id: 'sup_6',
    name: 'Krishna Fresh Vegetable Suppliers',
    category: 'Fresh Produce - Vegetables',
    email: 'orders@krishnafreshveg.in',
    phone: '+91 91009 66123',
    distance: '6',
    leadTime: 'Daily',
    items: [
      { name: 'Onions', status: 'In Stock' },
      { name: 'Tomatoes', status: 'In Stock' },
      { name: 'Potatoes', status: 'In Stock' },
      { name: 'Cabbage', status: 'In Stock' },
      { name: 'Carrots', status: 'In Stock' },
      { name: 'Beans', status: 'In Stock' },
      { name: 'Bhindi (Okra)', status: 'In Stock' },
      { name: 'Cauliflower (Gobi)', status: 'In Stock' },
      { name: 'Spinach/Palak', status: 'In Stock' },
      { name: 'Ivy Gourd', status: 'In Stock' }
    ],
    attentionNeeded: null,
    criticalMessage: null,
    statusText: 'All items stocked up'
  },
  {
    id: 'sup_7',
    name: 'Godavari Greens & Herbs Supply',
    category: 'Fresh Produce - Herbs & Greens',
    email: 'sales@godavarigreens.com',
    phone: '+91 93910 77345',
    distance: '9',
    leadTime: 'Daily',
    items: [
      { name: 'Coriander Leaves', status: 'In Stock' },
      { name: 'Mint Leaves', status: 'In Stock' },
      { name: 'Curry Leaves', status: 'In Stock' },
      { name: 'Green Chilies', status: 'In Stock' },
      { name: 'Ginger', status: 'In Stock' },
      { name: 'Garlic', status: 'In Stock' },
      { name: 'Mango/Gongura (Sour Greens)', status: 'In Stock' }
    ],
    attentionNeeded: null,
    criticalMessage: null,
    statusText: 'All items stocked up'
  },
  {
    id: 'sup_8',
    name: 'Coastal Coconut & Fruit Traders',
    category: 'Fresh Produce - Fruits & Coconut',
    email: 'orders@coastalcoconutfruits.in',
    phone: '+91 94940 88678',
    distance: '25',
    leadTime: '2 days',
    items: [
      { name: 'Fresh Coconuts', status: 'In Stock' },
      { name: 'Lemons', status: 'In Stock' },
      { name: 'Bananas', status: 'In Stock' }
    ],
    attentionNeeded: null,
    criticalMessage: null,
    statusText: 'All items stocked up'
  },
  {
    id: 'sup_9',
    name: 'Everest Spice & Masala Distributors',
    category: 'Spices & Masalas',
    email: 'wholesale@everestspices.com',
    phone: '+91 90520 99234',
    distance: '30',
    leadTime: '4 days',
    items: [
      { name: 'Mustard Seeds', status: 'In Stock' },
      { name: 'Cumin (Jeera) Seeds', status: 'In Stock' },
      { name: 'Whole Spices (Cloves, Cinnamon, Cardamom)', status: 'In Stock' },
      { name: 'Turmeric Powder', status: 'In Stock' },
      { name: 'Red Chili Powder', status: 'In Stock' },
      { name: 'Coriander Powder', status: 'In Stock' },
      { name: 'Sambar Powder', status: 'In Stock' },
      { name: 'Rasam Powder', status: 'In Stock' },
      { name: 'Dried Red Chilies', status: 'In Stock' }
    ],
    attentionNeeded: null,
    criticalMessage: null,
    statusText: 'All items stocked up'
  },
  {
    id: 'sup_10',
    name: 'Annapurna Oil & Condiments Co',
    category: 'Cooking Oils & Condiments',
    email: 'b2b@annapurnaoilco.in',
    phone: '+91 89850 10456',
    distance: '20',
    leadTime: '3 days',
    items: [
      { name: 'Cooking Oil', status: 'In Stock' },
      { name: 'Soy Sauce', status: 'In Stock' },
      { name: 'Vinegar', status: 'In Stock' },
      { name: 'Salt', status: 'In Stock' },
      { name: 'Tamarind', status: 'In Stock' },
      { name: 'Jaggery', status: 'In Stock' },
      { name: 'Sugar', status: 'In Stock' },
      { name: 'Vermicelli', status: 'In Stock' },
      { name: 'Sago', status: 'In Stock' }
    ],
    attentionNeeded: null,
    criticalMessage: null,
    statusText: 'All items stocked up'
  },
  {
    id: 'sup_11',
    name: 'MTR Pickles & Papad Distributors',
    category: 'Ready Accompaniments',
    email: 'orders@mtrpickles.com',
    phone: '+91 98450 12987',
    distance: '28',
    leadTime: '5 days',
    items: [
      { name: 'Pickles (Mango/Tomato)', status: 'In Stock' },
      { name: 'Papad', status: 'In Stock' }
    ],
    attentionNeeded: null,
    criticalMessage: null,
    statusText: 'All items stocked up'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_1',
    title: 'Breakfast Waste Logged',
    timeAgo: '10 mins ago',
    description: '1.2kg Pongal and Vada discarded. Logged by Chef Sarah M.',
    type: 'waste'
  },
  {
    id: 'act_2',
    title: 'Delivery Received',
    timeAgo: '1 hr ago',
    description: 'Grain supplies from Rice-Corp #2090 processed successfully.',
    type: 'delivery'
  },
  {
    id: 'act_3',
    title: 'Lunch Prep Completed',
    timeAgo: '2 hrs ago',
    description: 'Sona Masuri Rice & Tomato Dal stations fully set up for 150 patrons.',
    type: 'prep'
  }
];

export const INITIAL_EFFICIENCY_RECORDS: EfficiencyRecord[] = [
  {
    shift: 'Morning Prep',
    manager: 'Sarah J.',
    accuracy: 98.5,
    trend: 1.2,
    badge: 'M1'
  },
  {
    shift: 'Evening Service',
    manager: 'David L.',
    accuracy: 94.2,
    trend: 0.0,
    badge: 'E1'
  },
  {
    shift: 'Weekend Lunch',
    manager: 'Marcus T.',
    accuracy: 88.1,
    trend: -2.4,
    badge: 'W1'
  }
];
