export const summaryStats = {
  totalToolInvocations: '148,290',
  aiFitAccuracy: '96.8%',
  activeUsers: '32,450',
  pendingFraudCases: '14',
};

export const aiToolUsage = [
  { name: 'search_products', count: '78,420', percent: '53%', conv: '24.8%' },
  { name: 'compare_items', count: '45,180', percent: '30%', conv: '18.2%' },
  { name: 'add_to_cart', count: '24,690', percent: '17%', conv: '88.5%' },
  { name: 'search_products', count: '78,420', percent: '53%', conv: '24.8%' },
  { name: 'search_products', count: '78,420', percent: '53%', conv: '24.8%' },
];

export const fraudEscalationQueue = [
  { reportId: '374743572740727', reporter: 'Muhammad Arima Kousei', fraudId: 'Teknik Mesin' },
  { reportId: '180884104885849', reporter: 'Alisa Mikhailovna Kujou', fraudId: 'Teknologi Informasi' },
  { reportId: '939472937292928', reporter: 'Manhattan Cafe', fraudId: 'Kedokteran Hewan' },
  { reportId: '123943294027928', reporter: 'Bima Aryo', fraudId: 'Farmasi' },
  { reportId: '123943294027928', reporter: 'Bima Aryo', fraudId: 'Farmasi' },
];

export const aiModels = [
  { id: 'GLM-5.3-FlashX', name: 'GLM-5.3 FlashX', input: '$0.15', output: '$0.47', cache: '$0.016' },
  { id: 'DeepSeek-V4.1-Flash', name: 'DeepSeek V4.1 Flash', input: '$0.15', output: '$0.15', cache: '$0.15' },
  { id: 'Gemini-3.8-Flash', name: 'Gemini 3.8 Flash', input: '$0.15', output: '$0.15', cache: '$0.15' },
  { id: 'Muse-Spark-1.3', name: 'Muse Spark 1.3', input: '$0.15', output: '$0.15', cache: '$0.15' },
  { id: 'Muse-Spark-1.3', name: 'GLM-5.3 FlashX', input: '$0.15', output: '$0.47', cache: '$0.016' },
  { id: 'Muse-Spark-1.3', name: 'DeepSeek V4.1 Flash', input: '$0.15', output: '$0.15', cache: '$0.15' },
];

export const fraudReports = [
  { reportId: '#FR-111', reporter: 'Muhammad Arima Kousei', fraud: 'Alisa Mikhailovna Kujou', category: 'Fake KTM', status: 'Active' },
  { reportId: '#FR-113', reporter: 'Alisa Mikhailovna Kujou', fraud: 'Manhattan Cafe', category: 'Condition Mismatch', status: 'Active' },
  { reportId: '#FR-123', reporter: 'Manhattan Cafe', fraud: 'Bima Aryo', category: 'Off-Platform Payment', status: 'Active' },
  { reportId: '#FR-182', reporter: 'Bima Aryo', fraud: 'Bima Aryo', category: 'Ghosting', status: 'Active' },
  { reportId: '#FR-182', reporter: 'Bima Aryo', fraud: 'Bima Aryo', category: 'Prohibited / Dangerous Item', status: 'Active' },
];

export const studentVerificationQueue = [
  { studentId: '374743572740727', name: 'Muhammad Arima Kousei', universitas: 'Universitas Brawijaya', prodi: 'Teknik Mesin', status: 'Active' },
  { studentId: '180884104885849', name: 'Alisa Mikhailovna Kujou', universitas: 'Universitas Airlangga', prodi: 'Teknologi Informasi', status: 'Active' },
  { studentId: '939472937292928', name: 'Manhattan Cafe', universitas: 'Universitas Indonesia', prodi: 'Kedokteran Hewan', status: 'Active' },
  { studentId: '123943294027928', name: 'Bima Aryo', universitas: 'Universitas Padjajaran', prodi: 'Farmasi', status: 'Active' },
  { studentId: '374743572740727', name: 'Muhammad Arima Kousei', universitas: 'Universitas Brawijaya', prodi: 'Teknik Mesin', status: 'Active' },
];

export const supportTickets = [
  { ticketId: '#FR-111', nama: 'Muhammad Arima Kousei', username: 'Alisa Mikhailovna Kujou', category: 'Fake KTM', status: 'Active' },
  { ticketId: '#FR-113', nama: 'Alisa Mikhailovna Kujou', username: 'Manhattan Cafe', category: 'Condition Mismatch', status: 'Active' },
  { ticketId: '#FR-123', nama: 'Manhattan Cafe', username: 'Bima Aryo', category: 'Off-Platform Payment', status: 'Active' },
  { ticketId: '#FR-182', nama: 'Bima Aryo', username: 'Muhammad Arima Kousei', category: 'Ghosting', status: 'Active' },
  { ticketId: '#FR-182', nama: 'Bima Aryo', username: 'Bima Aryo', category: 'Prohibited / Dangerous Item', status: 'Active' },
];

export const supportSummary = {
  open: '148,290',
  closed: '96.8%',
  openToday: '32,450',
  closedToday: '14',
};

export const adminList = [
  { name: 'Someone', username: '@someone', role: 'Super admin', status: 'Active', isYou: true },
  { name: 'Martha', username: '@martha', role: 'Admin', status: 'Active', isYou: false },
];

export const currentUser = { name: 'Someone', role: 'Super admin' };
