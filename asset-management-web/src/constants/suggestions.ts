/**
 * Comprehensive suggestion lists for Asset Management fields.
 * These are used by the SuggestionInput component to provide autocomplete hints.
 */

export const MANUFACTURER_SUGGESTIONS = [
  // Major Laptop/PC Brands
  'Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Microsoft', 'Samsung', 'MSI', 'Gigabyte', 
  'Razer', 'Huawei', 'Xiaomi', 'LG', 'Fujitsu', 'Toshiba', 'Panasonic',
  
  // Monitor Specific Brands
  'AOC', 'BenQ', 'ViewSonic', 'Philips', 'Eizo', 'Iiyama', 'Sceptre',
  
  // Storage Brands
  'Seagate', 'Western Digital', 'Kingston', 'Crucial', 'SanDisk', 'Sabrent', 'Transcend'
];

export const CPU_SUGGESTIONS = [
  // Apple Silicon
  'Apple M1', 'Apple M1 Pro', 'Apple M1 Max', 'Apple M1 Ultra',
  'Apple M2', 'Apple M2 Pro', 'Apple M2 Max', 'Apple M2 Ultra',
  'Apple M3', 'Apple M3 Pro', 'Apple M3 Max',
  
  // Intel Core - Latest
  'Intel Core i9-14900K', 'Intel Core i9-13900H', 'Intel Core i7-14700K', 'Intel Core i7-1355U',
  'Intel Core i5-1335U', 'Intel Core Ultra 5', 'Intel Core Ultra 7', 'Intel Core Ultra 9',
  'Intel Core i7 Gen 11', 'Intel Core i5 Gen 12', 'Intel Core i3 Gen 10',
  
  // AMD Ryzen - Latest
  'AMD Ryzen 9 7950X', 'AMD Ryzen 9 5900HX', 'AMD Ryzen 7 7840U', 'AMD Ryzen 7 5800H',
  'AMD Ryzen 5 7640U', 'AMD Ryzen 5 5500U', 'AMD Ryzen Threadripper'
];

export const OS_SUGGESTIONS = [
  // Windows
  'Windows 11 Pro', 'Windows 11 Home', 'Windows 11 Enterprise',
  'Windows 10 Pro', 'Windows 10 Home', 'Windows 10 Enterprise',
  'Windows Server 2022', 'Windows Server 2019',
  
  // macOS
  'macOS Sonoma (14.x)', 'macOS Ventura (13.x)', 'macOS Monterey (12.x)', 'macOS Big Sur (11.x)',
  
  // Linux
  'Ubuntu 22.04 LTS', 'Ubuntu 20.04 LTS', 'AlmaLinux 9', 'Rocky Linux 9',
  'Debian 12', 'Fedora 39', 'CentOS Stream 9', 'Kali Linux', 'Arch Linux'
];

export const OS_VERSION_SUGGESTIONS = [
  '23H2', '22H2', '21H2', 'Build 19045', 'Version 14.2.1', 'Version 13.6', 'Kernel 6.5'
];

export const DISK_TYPE_SUGGESTIONS = [
  'NVMe SSD', 'SATA SSD', 'PCIe Gen4 SSD', 'PCIe Gen5 SSD', 'M.2 SSD', 
  'HDD (7200 RPM)', 'HDD (5400 RPM)', 'SSHD', 'External SSD', 'MicroSD'
];

export const DISK_MODEL_SUGGESTIONS = [
  // High-End NVMe
  'Samsung 990 Pro', 'Samsung 980 Pro', 'WD Black SN850X', 'Crucial T700', 'SK Hynix P41',
  
  // Mid-Range/Common
  'Kingston NV2', 'Crucial P3', 'Samsung 970 Evo Plus', 'WD Blue SN570',
  
  // SATA
  'Samsung 870 Evo', 'Crucial MX500', 'Kingston A400'
];

export const CONDITION_SUGGESTIONS = [
  'Brand New', 'Like New (Used)', 'Excellent', 'Very Good', 'Good (Normal Wear)', 
  'Fair (Visible Scratches)', 'Poor (Heavy Wear)', 'Damaged (Functional)', 'Non-Functional'
];

export const RAM_SUGGESTIONS = ['4', '8', '16', '32', '64', '128', '256'];
export const STORAGE_SUGGESTIONS = ['128', '256', '512', '1024', '2048', '4096'];
export const SCREEN_SIZE_SUGGESTIONS = ['13.3', '14.0', '15.6', '16.0', '17.3', '24.0', '27.0', '32.0', '34.0'];
