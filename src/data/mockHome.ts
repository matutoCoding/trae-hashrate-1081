import { DashboardStats, ProcessEntry, AlertItem, ProductionBatch } from '@/types/vinegar';

export const mockDashboardStats: DashboardStats = {
  totalBatches: 48,
  inProgressBatches: 12,
  todayTasks: 8,
  warningCount: 2,
  monthlyProduction: 12580,
  monthlySales: 286500
};

export const mockProcessEntries: ProcessEntry[] = [
  {
    key: 'steaming',
    name: '原料蒸料',
    icon: '🌾',
    description: '高粱麸皮蒸料润水',
    status: 'in_progress',
    count: 3
  },
  {
    key: 'alcohol',
    name: '酒精发酵',
    icon: '🍺',
    description: '糖化酒精发酵',
    status: 'in_progress',
    count: 4
  },
  {
    key: 'acetate',
    name: '醋酸醅',
    icon: '🧪',
    description: '拌入醋酸菌种',
    status: 'in_progress',
    count: 5
  },
  {
    key: 'turning',
    name: '翻醅倒醅',
    icon: '🔄',
    description: '固态醋醅翻拌',
    status: 'warning',
    count: 6
  },
  {
    key: 'leaching',
    name: '淋醋陈酿',
    icon: '💧',
    description: '套淋淋醋取液',
    status: 'in_progress',
    count: 2
  },
  {
    key: 'filling',
    name: '灌装包装',
    icon: '🏺',
    description: '灌装杀菌封口',
    status: 'pending',
    count: 0
  },
  {
    key: 'aging',
    name: '新醋陈酿',
    icon: '☀️',
    description: '新醋陈酿晒露',
    status: 'in_progress',
    count: 8
  },
  {
    key: 'sales',
    name: '销售台账',
    icon: '📊',
    description: '食醋销售台账',
    status: 'completed',
    count: 15
  }
];

export const mockAlerts: AlertItem[] = [
  {
    id: 'alert1',
    type: 'warning',
    title: '醅温偏高',
    content: '批次C20260612003醅温达到42.5℃，超过正常范围',
    batchNo: 'C20260612003',
    time: '2026-06-16 09:30'
  },
  {
    id: 'alert2',
    type: 'warning',
    title: '翻醅任务即将超时',
    content: '批次C20260610002今日翻醅任务尚未完成',
    batchNo: 'C20260610002',
    time: '2026-06-16 08:45'
  },
  {
    id: 'alert3',
    type: 'info',
    title: '发酵完成提醒',
    content: '批次C20260605001酒精发酵已完成，可转入醋酸发酵',
    batchNo: 'C20260605001',
    time: '2026-06-16 07:00'
  }
];

export const mockBatches: ProductionBatch[] = [
  {
    id: 'b1',
    batchNo: 'C20260615001',
    productName: '老陈醋',
    createTime: '2026-06-15 08:00',
    status: 'in_progress',
    currentStage: '醋酸发酵',
    progress: 45
  },
  {
    id: 'b2',
    batchNo: 'C20260614002',
    productName: '香醋',
    createTime: '2026-06-14 09:30',
    status: 'in_progress',
    currentStage: '酒精发酵',
    progress: 28
  },
  {
    id: 'b3',
    batchNo: 'C20260612003',
    productName: '米醋',
    createTime: '2026-06-12 07:00',
    status: 'warning',
    currentStage: '醋酸发酵',
    progress: 62
  },
  {
    id: 'b4',
    batchNo: 'C20260610002',
    productName: '老陈醋',
    createTime: '2026-06-10 10:00',
    status: 'in_progress',
    currentStage: '翻醅阶段',
    progress: 55
  },
  {
    id: 'b5',
    batchNo: 'C20260605001',
    productName: '香醋',
    createTime: '2026-06-05 08:00',
    status: 'completed',
    currentStage: '淋醋完成',
    progress: 100
  }
];
