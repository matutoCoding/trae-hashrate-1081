export type ProcessStatus = 'pending' | 'in_progress' | 'completed' | 'warning' | 'error';

export interface ProductionBatch {
  id: string;
  batchNo: string;
  productName: string;
  createTime: string;
  status: ProcessStatus;
  currentStage: string;
  progress: number;
}

export interface SteamingRecord {
  id: string;
  batchId: string;
  batchNo: string;
  sorghumWeight: number;
  branWeight: number;
  waterAmount: number;
  soakStartTime: string;
  soakDuration: number;
  steamTemperature: number;
  steamDuration: number;
  status: ProcessStatus;
  operator: string;
  createTime: string;
  remark?: string;
}

export interface AlcoholFermentation {
  id: string;
  batchId: string;
  batchNo: string;
  saccharificationTemp: number;
  saccharificationTime: string;
  yeastAmount: number;
  fermentStartTemp: number;
  fermentDays: number;
  currentDay: number;
  tempRecords: TempRecord[];
  alcoholContent: number;
  status: ProcessStatus;
  operator: string;
}

export interface AcetateFermentation {
  id: string;
  batchId: string;
  batchNo: string;
  strainAmount: number;
  mixTime: string;
  fermentDays: number;
  currentDay: number;
  tempRecords: TempRecord[];
  acidRecords: AcidRecord[];
  currentTemp: number;
  currentAcid: number;
  status: ProcessStatus;
  operator: string;
}

export interface TempRecord {
  time: string;
  value: number;
}

export interface AcidRecord {
  time: string;
  value: number;
}

export interface TurningTask {
  id: string;
  batchId: string;
  batchNo: string;
  taskType: 'turn' | 'dump';
  plannedTime: string;
  actualTime?: string;
  layerCount: number;
  uniformityScore?: number;
  status: ProcessStatus;
  operator?: string;
  remark?: string;
}

export interface LeachingRecord {
  id: string;
  batchId: string;
  batchNo: string;
  leachingLevel: 1 | 2 | 3;
  waterAmount: number;
  soakTime: number;
  vinegarVolume: number;
  startTime: string;
  endTime?: string;
  status: ProcessStatus;
  operator: string;
}

export interface AgingRecord {
  id: string;
  batchId: string;
  batchNo: string;
  vinegarType: string;
  volume: number;
  containerNo: string;
  startDate: string;
  agingDays: number;
  currentDays: number;
  sunExposureHours: number;
  pourCount: number;
  qualityScore?: number;
  status: ProcessStatus;
  operator: string;
}

export interface FillingRecord {
  id: string;
  batchId: string;
  batchNo: string;
  filtrationMethod: string;
  filtrationDate: string;
  bottleType: string;
  bottleVolume: number;
  bottleCount: number;
  sterilizationTemp: number;
  sterilizationTime: number;
  sealCheckPass: boolean;
  productionDate: string;
  shelfLifeMonths: number;
  expiryDate: string;
  status: ProcessStatus;
  operator: string;
}

export interface SaleRecord {
  id: string;
  orderNo: string;
  customerName: string;
  productName: string;
  batchNo: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  saleDate: string;
  deliveryDate?: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paidAmount: number;
  operator: string;
  remark?: string;
}

export interface DashboardStats {
  totalBatches: number;
  inProgressBatches: number;
  todayTasks: number;
  warningCount: number;
  monthlyProduction: number;
  monthlySales: number;
}

export interface ProcessEntry {
  key: string;
  name: string;
  icon: string;
  description: string;
  status: ProcessStatus;
  count: number;
}

export interface AlertItem {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  content: string;
  batchNo: string;
  time: string;
}
