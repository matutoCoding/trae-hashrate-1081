import { LeachingRecord, AgingRecord, FillingRecord } from '@/types/vinegar';

export const mockLeachingRecords: LeachingRecord[] = [
  {
    id: 'lr1',
    batchId: 'b5',
    batchNo: 'C20260605001',
    leachingLevel: 1,
    waterAmount: 500,
    soakTime: 24,
    vinegarVolume: 420,
    startTime: '2026-06-15 08:00',
    endTime: '2026-06-16 08:00',
    status: 'completed',
    operator: '王师傅'
  },
  {
    id: 'lr2',
    batchId: 'b5',
    batchNo: 'C20260605001',
    leachingLevel: 2,
    waterAmount: 500,
    soakTime: 18,
    vinegarVolume: 400,
    startTime: '2026-06-16 10:00',
    status: 'in_progress',
    operator: '王师傅'
  },
  {
    id: 'lr3',
    batchId: 'b8',
    batchNo: 'C20260608001',
    leachingLevel: 1,
    waterAmount: 600,
    soakTime: 24,
    vinegarVolume: 0,
    startTime: '2026-06-16 07:00',
    status: 'in_progress',
    operator: '李师傅'
  },
  {
    id: 'lr4',
    batchId: 'b12',
    batchNo: 'C20260528001',
    leachingLevel: 3,
    waterAmount: 500,
    soakTime: 12,
    vinegarVolume: 380,
    startTime: '2026-06-14 14:00',
    endTime: '2026-06-15 02:00',
    status: 'completed',
    operator: '张师傅'
  }
];

export const mockAgingRecords: AgingRecord[] = [
  {
    id: 'ar1',
    batchId: 'b13',
    batchNo: 'C20260415001',
    vinegarType: '老陈醋',
    volume: 2000,
    containerNo: '缸A-012',
    startDate: '2026-04-20',
    agingDays: 365,
    currentDays: 57,
    sunExposureHours: 186,
    pourCount: 8,
    qualityScore: 95,
    status: 'in_progress',
    operator: '李师傅'
  },
  {
    id: 'ar2',
    batchId: 'b14',
    batchNo: 'C20260310002',
    vinegarType: '香醋',
    volume: 1500,
    containerNo: '缸B-008',
    startDate: '2026-03-15',
    agingDays: 180,
    currentDays: 93,
    sunExposureHours: 310,
    pourCount: 15,
    qualityScore: 92,
    status: 'in_progress',
    operator: '王师傅'
  },
  {
    id: 'ar3',
    batchId: 'b15',
    batchNo: 'C20251220001',
    vinegarType: '老陈醋',
    volume: 2500,
    containerNo: '缸A-005',
    startDate: '2025-12-25',
    agingDays: 365,
    currentDays: 174,
    sunExposureHours: 520,
    pourCount: 28,
    qualityScore: 98,
    status: 'in_progress',
    operator: '张师傅'
  },
  {
    id: 'ar4',
    batchId: 'b16',
    batchNo: 'C20250908003',
    vinegarType: '三年陈酿',
    volume: 3000,
    containerNo: '缸C-003',
    startDate: '2025-09-15',
    agingDays: 1095,
    currentDays: 275,
    sunExposureHours: 856,
    pourCount: 42,
    status: 'in_progress',
    operator: '李师傅'
  }
];

export const mockFillingRecords: FillingRecord[] = [
  {
    id: 'fr1',
    batchId: 'b17',
    batchNo: 'C20260310001',
    filtrationMethod: '硅藻土过滤',
    filtrationDate: '2026-06-14',
    bottleType: '玻璃瓶',
    bottleVolume: 500,
    bottleCount: 2400,
    sterilizationTemp: 85,
    sterilizationTime: 15,
    sealCheckPass: true,
    productionDate: '2026-06-14',
    shelfLifeMonths: 24,
    expiryDate: '2028-06-13',
    status: 'completed',
    operator: '张师傅'
  },
  {
    id: 'fr2',
    batchId: 'b18',
    batchNo: 'C20260405002',
    filtrationMethod: '膜过滤',
    filtrationDate: '2026-06-15',
    bottleType: '塑料瓶',
    bottleVolume: 1000,
    bottleCount: 1200,
    sterilizationTemp: 82,
    sterilizationTime: 12,
    sealCheckPass: true,
    productionDate: '2026-06-15',
    shelfLifeMonths: 18,
    expiryDate: '2027-12-14',
    status: 'completed',
    operator: '王师傅'
  },
  {
    id: 'fr3',
    batchId: 'b14',
    batchNo: 'C20260310002',
    filtrationMethod: '自然澄清',
    filtrationDate: '2026-06-16',
    bottleType: '礼盒装',
    bottleVolume: 250,
    bottleCount: 4800,
    sterilizationTemp: 88,
    sterilizationTime: 20,
    sealCheckPass: false,
    productionDate: '2026-06-16',
    shelfLifeMonths: 36,
    expiryDate: '2029-06-15',
    status: 'warning',
    operator: '李师傅'
  }
];
