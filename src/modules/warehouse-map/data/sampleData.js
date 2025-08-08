// Sample Data Generator for Warehouse Map
import { WAREHOUSE_CONFIG } from '../config/constants';

export const generateSampleLocations = (count = 150) => {
  const locations = [];

  for (let i = 0; i < count; i++) {
    const zone = WAREHOUSE_CONFIG.ZONES[Math.floor(Math.random() * WAREHOUSE_CONFIG.ZONES.length)];
    const floor = WAREHOUSE_CONFIG.FLOORS[Math.floor(Math.random() * WAREHOUSE_CONFIG.FLOORS.length)];
    const section = String(Math.floor(Math.random() * 10) + 1).padStart(2, '0');
    const position = String(Math.floor(Math.random() * 20) + 1).padStart(3, '0');

    locations.push({
      id: `LOC-${i + 1}`,
      code: `${zone}${floor}-${section}-${position}`,
      zone,
      floor,
      section: parseInt(section),
      position: parseInt(position),
      status: Object.values(WAREHOUSE_CONFIG.LOCATION_STATUS)[
        Math.floor(Math.random() * Object.values(WAREHOUSE_CONFIG.LOCATION_STATUS).length)
      ],
      type: Math.random() > 0.8 ? 'special' : 'storage',
      capacity: Math.floor(Math.random() * 100) + 20,
      occupied: Math.floor(Math.random() * 80),
      temperature: Math.floor(Math.random() * 10) + 18,
      humidity: Math.floor(Math.random() * 30) + 40,
      lastUpdated: new Date().toISOString()
    });
  }

  return locations;
};

export const generateSampleInventory = (count = 200) => {
  const items = [];
  const productNames = [
    'Điện thoại Samsung', 'Laptop Dell', 'Tai nghe Sony', 'Bàn phím Logitech',
    'Áo sơ mi', 'Quần jeans', 'Giày sneaker', 'Túi xách',
    'Bánh kẹo', 'Nước uống', 'Thực phẩm đông lạnh', 'Gia vị',
    'Sách giáo khoa', 'Tiểu thuyết', 'Tạp chí', 'Từ điển',
    'Bàn văn phòng', 'Ghế xoay', 'Tủ tài liệu', 'Kệ sách',
    'Búa', 'Tua vít', 'Máy khoan', 'Thước đo'
  ];

  const units = ['Cái', 'Chiếc', 'Bộ', 'Kg', 'Lít', 'Hộp', 'Thùng'];

  for (let i = 0; i < count; i++) {
    const category = Object.values(WAREHOUSE_CONFIG.ITEM_CATEGORIES)[
      Math.floor(Math.random() * Object.values(WAREHOUSE_CONFIG.ITEM_CATEGORIES).length)
    ];

    const quantity = Math.floor(Math.random() * 1000) + 1;
    let stockStatus = WAREHOUSE_CONFIG.STOCK_STATUS.IN_STOCK;
    if (quantity < 10) stockStatus = WAREHOUSE_CONFIG.STOCK_STATUS.OUT_OF_STOCK;
    else if (quantity < 50) stockStatus = WAREHOUSE_CONFIG.STOCK_STATUS.LOW_STOCK;

    items.push({
      id: `ITEM-${i + 1}`,
      code: `SP-${String(i + 1).padStart(4, '0')}`,
      name: productNames[Math.floor(Math.random() * productNames.length)],
      category,
      location: `${WAREHOUSE_CONFIG.ZONES[Math.floor(Math.random() * 4)]}${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
      quantity,
      unit: units[Math.floor(Math.random() * units.length)],
      status: stockStatus,
      price: Math.floor(Math.random() * 1000000) + 10000,
      supplier: `Nhà cung cấp ${Math.floor(Math.random() * 10) + 1}`,
      description: `Mô tả sản phẩm ${i + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return items;
};

export const generateSampleStatistics = () => {
  const totalLocations = 150;
  const occupiedLocations = Math.floor(totalLocations * 0.65);
  const totalCapacity = 15000;
  const usedCapacity = Math.floor(totalCapacity * 0.76);

  return {
    totalLocations,
    occupiedLocations,
    availableLocations: totalLocations - occupiedLocations,
    totalCapacity,
    usedCapacity,
    availableCapacity: totalCapacity - usedCapacity,
    utilizationRate: Math.round((usedCapacity / totalCapacity) * 100),
    totalItems: 200,
    categories: {
      electronics: 45,
      clothing: 38,
      food: 42,
      books: 31,
      furniture: 25,
      tools: 19
    },
    zones: {
      A: { total: 40, occupied: 32 },
      B: { total: 38, occupied: 25 },
      C: { total: 35, occupied: 28 },
      D: { total: 37, occupied: 20 }
    }
  };
};

export const generateSampleZones = () => {
  const zones = [];
  const zoneTypes = ['storage', 'loading', 'office', 'maintenance'];
  const statuses = ['active', 'maintenance', 'warning', 'inactive'];

  WAREHOUSE_CONFIG.ZONES.forEach((zoneLetter, index) => {
    for (let i = 1; i <= 3; i++) {
      const capacity = Math.floor(Math.random() * 200) + 50;
      const occupied = Math.floor(capacity * (0.3 + Math.random() * 0.6));
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      zones.push({
        id: `${zoneLetter}${i}`,
        name: `Khu vực ${zoneLetter}${i}`,
        type: zoneTypes[Math.floor(Math.random() * zoneTypes.length)],
        capacity,
        occupied,
        status,
        items: generateZoneItems(),
        coordinates: {
          x: 50 + (index * 200),
          y: 50 + ((i - 1) * 150),
          width: 180,
          height: 120
        },
        temperature: Math.floor(Math.random() * 10) + 18,
        humidity: Math.floor(Math.random() * 30) + 40,
        lastUpdated: new Date().toISOString()
      });
    }
  });

  return zones;
};

const generateZoneItems = () => {
  const itemTypes = [
    'Điện tử', 'Gia dụng', 'Thời trang', 'Thực phẩm',
    'Sách vở', 'Nội thất', 'Dụng cụ', 'Đồ chơi'
  ];

  const numItems = Math.floor(Math.random() * 4) + 1;
  const selectedItems = [];

  for (let i = 0; i < numItems; i++) {
    const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    if (!selectedItems.includes(randomItem)) {
      selectedItems.push(randomItem);
    }
  }

  return selectedItems;
};
