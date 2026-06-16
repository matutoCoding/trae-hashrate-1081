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

export interface BatchStageItem {
  key: string;
  name: string;
  icon: string;
  status: 'done' | 'doing' | 'pending';
  date?: string;
  remark?: string;
  detailRoute?: string;
}

export interface BatchDetailInfo {
  id: string;
  batchNo: string;
  productName: string;
  productSpec: string;
  grade: string;
  createTime: string;
  status: string;
  statusType: 'completed' | 'in_progress' | 'warning' | 'pending';
  currentStage: string;
  currentStageIndex: number;
  progress: number;
  cycleDays: number;
  expectedCost: number;
  expectedYield: number;
  qualityTarget: string;
  team: { master: string; assistants: string[]; total: number };
  rawMaterials: { name: string; qty: string; origin: string }[];
  costItems: { label: string; value: string }[];
  qualityItems: { label: string; value: string }[];
  stages: BatchStageItem[];
  metrics: { label: string; value: string; color: string }[];
  alerts?: { type: 'warning' | 'info'; title: string; content: string; time: string }[];
}

const stageKeys = ['steaming', 'alcohol', 'acetate', 'turning', 'leaching', 'aging', 'filtration', 'filling', 'delivery'];
const stageNames = ['原料蒸料', '酒精发酵', '醋酸醅', '翻醅倒醅', '淋醋取液', '陈酿晒露', '过滤澄清', '灌装包装', '出厂质检'];
const stageIcons = ['🌾', '🍺', '🧪', '🔄', '💧', '☀️', '🧫', '🏺', '✅'];
const stageRoutes: Record<string, string> = {
  steaming: '/pages/steaming-detail/index',
  alcohol: '/pages/alcohol-detail/index',
  acetate: '/pages/acetate-detail/index',
  turning: '/pages/turning-detail/index',
  leaching: '/pages/leaching-detail/index',
  aging: '/pages/aging-detail/index',
  filtration: undefined as any,
  filling: '/pages/filling-detail/index',
  delivery: undefined as any
};

const buildStages = (currentIdx: number, batchCreateTime: string): BatchStageItem[] => {
  const baseDate = new Date(batchCreateTime.replace(/-/g, '/'));
  const addDays = (d: Date, n: number) => {
    const nd = new Date(d.getTime()); nd.setDate(nd.getDate() + n);
    return `${nd.getMonth() + 1}-${nd.getDate().toString().padStart(2, '0')}`;
  };
  return stageKeys.map((k, idx) => {
    let status: BatchStageItem['status'];
    if (idx < currentIdx) status = 'done';
    else if (idx === currentIdx) status = 'doing';
    else status = 'pending';

    const offsets = [0, 1, 11, 18, 30, 38, 80, 100, 110];
    const date = status !== 'pending' ? addDays(baseDate, offsets[idx]) : undefined;

    let remark: string | undefined;
    if (status === 'done') remark = '工序合格 转入下一步';
    else if (status === 'doing') remark = '当前执行中';

    return {
      key: k,
      name: stageNames[idx],
      icon: stageIcons[idx],
      status,
      date,
      remark,
      detailRoute: stageRoutes[k]
    };
  });
};

export const mockBatchDetails: Record<string, BatchDetailInfo> = {
  'b1': {
    id: 'b1',
    batchNo: 'C20260615001',
    productName: '老陈醋',
    productSpec: '500mL×12瓶 金标A级',
    grade: '优级酿造食醋',
    createTime: '2026-06-15 08:00',
    status: '醋酸发酵中',
    statusType: 'in_progress',
    currentStage: '醋酸发酵',
    currentStageIndex: 2,
    progress: 45,
    cycleDays: 82,
    expectedCost: 32800,
    expectedYield: 89.2,
    qualityTarget: '总酸≥6.0g/100mL 不挥发酸≥1.5g',
    team: { master: '张建国', assistants: ['李师傅', '王刚', '赵明'], total: 4 },
    rawMaterials: [
      { name: '优质高粱', qty: '1500 kg', origin: '山西晋中市高粱基地' },
      { name: '麸皮', qty: '450 kg', origin: '本地小麦加工副产品' },
      { name: '大曲', qty: '300 kg', origin: '本厂自制红心大曲' },
      { name: '谷糠', qty: '220 kg', origin: '本地谷子加工副产品' }
    ],
    costItems: [
      { label: '原料采购', value: '¥ 18,500' },
      { label: '人工成本', value: '¥ 8,600' },
      { label: '能源水电', value: '¥ 3,900' },
      { label: '包材辅料', value: '¥ 1,800' },
      { label: '其他费用', value: '¥ 0 (暂无)' }
    ],
    qualityItems: [
      { label: '总酸目标', value: '≥ 6.0 g/100mL' },
      { label: '还原糖', value: '≥ 2.5 g/L' },
      { label: '可溶性无盐固形物', value: '≥ 10 g/100mL' },
      { label: '色泽气味', value: '深棕琥珀 陈酿酯香' }
    ],
    metrics: [
      { label: '总周期', value: '82 天', color: '#8B4513' },
      { label: '预计总酸', value: '6.2 g/100mL', color: '#2E8B57' },
      { label: '预计出醋率', value: '3.2 kg原料/L', color: '#3D5A80' },
      { label: '预计成本', value: '¥ 3.28万', color: '#DAA520' }
    ],
    stages: buildStages(2, '2026-06-15 08:00')
  },
  'b2': {
    id: 'b2',
    batchNo: 'C20260614002',
    productName: '香醋',
    productSpec: '500mL×15瓶 红标优级',
    grade: '一级酿造香醋',
    createTime: '2026-06-14 09:30',
    status: '酒精发酵第3天',
    statusType: 'in_progress',
    currentStage: '酒精发酵',
    currentStageIndex: 1,
    progress: 28,
    cycleDays: 75,
    expectedCost: 26500,
    expectedYield: 91.5,
    qualityTarget: '总酸≥5.0g/100mL 香气突出',
    team: { master: '李师傅', assistants: ['王磊', '孙强'], total: 3 },
    rawMaterials: [
      { name: '糯米', qty: '1200 kg', origin: '江苏金坛糯米基地' },
      { name: '麦麸', qty: '380 kg', origin: '江苏本地副产品' },
      { name: '酒曲 SY-202', qty: '8 kg', origin: '本厂专用酿酒酵母' },
      { name: '醋酸菌 沪酿1.01', qty: '6 kg', origin: '本院微生物所提供' }
    ],
    costItems: [
      { label: '原料采购', value: '¥ 14,200' },
      { label: '人工成本', value: '¥ 7,100' },
      { label: '能源水电', value: '¥ 3,200' },
      { label: '包材辅料', value: '¥ 2,000' },
      { label: '其他费用', value: '¥ 0 (暂无)' }
    ],
    qualityItems: [
      { label: '总酸目标', value: '≥ 5.0 g/100mL' },
      { label: '还原糖', value: '≥ 12 g/L (香醋偏甜)' },
      { label: '香气评分', value: '≥ 90分(酯香+米香)' },
      { label: '色泽', value: '红棕透亮' }
    ],
    metrics: [
      { label: '总周期', value: '75 天', color: '#8B4513' },
      { label: '预计酒精度', value: '6.8 %vol', color: '#2E8B57' },
      { label: '预计出醋率', value: '3.5 kg原料/L', color: '#3D5A80' },
      { label: '预计成本', value: '¥ 2.65万', color: '#DAA520' }
    ],
    stages: buildStages(1, '2026-06-14 09:30')
  },
  'b3': {
    id: 'b3',
    batchNo: 'C20260612003',
    productName: '米醋',
    productSpec: '5L×4桶 餐饮实惠装',
    grade: '一级酿造米醋',
    createTime: '2026-06-12 07:00',
    status: '醅温偏高预警⚠️',
    statusType: 'warning',
    currentStage: '醋酸发酵',
    currentStageIndex: 2,
    progress: 62,
    cycleDays: 68,
    expectedCost: 19800,
    expectedYield: 92.8,
    qualityTarget: '总酸≥3.5g/100mL 米香纯净',
    team: { master: '王师傅', assistants: ['周明', '吴浩', '郑涛', '钱伟'], total: 5 },
    rawMaterials: [
      { name: '碎大米', qty: '2000 kg', origin: '东北黑龙江大米副产物' },
      { name: '米糠', qty: '500 kg', origin: '本地米厂新鲜米糠' },
      { name: '酒曲', qty: '7 kg', origin: '安琪酿酒高活性干酵母' },
      { name: '醋酸菌', qty: '5 kg', origin: 'AS 1.41醋酸杆菌' }
    ],
    costItems: [
      { label: '原料采购', value: '¥ 9,800' },
      { label: '人工成本', value: '¥ 5,500' },
      { label: '能源水电', value: '¥ 2,800' },
      { label: '包材辅料', value: '¥ 1,700' },
      { label: '温控应急', value: '¥ 0 (降温措施已启动)' }
    ],
    qualityItems: [
      { label: '总酸目标', value: '≥ 3.5 g/100mL' },
      { label: 'pH值', value: '2.8 - 3.2' },
      { label: '米香评分', value: '≥ 85分' },
      { label: '色泽', value: '浅黄透亮' }
    ],
    metrics: [
      { label: '总周期', value: '68 天', color: '#8B4513' },
      { label: '当前醅温', value: '42.5 ℃ ⚠️', color: '#CD5C5C' },
      { label: '出醋率目标', value: '4.2 kg原料/L', color: '#3D5A80' },
      { label: '预计成本', value: '¥ 1.98万', color: '#DAA520' }
    ],
    alerts: [
      { type: 'warning', title: '醅温偏高预警', content: '今日13:00测温上中层42.5℃，超过42℃正常上限，已开启翻醅降温+通风措施', time: '今天 13:15' },
      { type: 'info', title: '翻醅加急处理', content: '今日已安排两次翻醅（10:00、15:00），预计1小时内降至40℃以下', time: '今天 14:50' }
    ],
    stages: buildStages(2, '2026-06-12 07:00')
  },
  'b4': {
    id: 'b4',
    batchNo: 'C20260610002',
    productName: '老陈醋',
    productSpec: '250mL×20瓶 家常装',
    grade: '二级酿造食醋',
    createTime: '2026-06-10 10:00',
    status: '第4轮翻醅进行中',
    statusType: 'in_progress',
    currentStage: '翻醅阶段',
    currentStageIndex: 3,
    progress: 55,
    cycleDays: 80,
    expectedCost: 28600,
    expectedYield: 88.0,
    qualityTarget: '总酸≥4.5g/100mL 家常风味',
    team: { master: '张建国', assistants: ['王刚', '赵明', '陈伟'], total: 4 },
    rawMaterials: [
      { name: '高粱（二级）', qty: '1800 kg', origin: '山西吕梁高粱基地' },
      { name: '麸皮', qty: '540 kg', origin: '本地小麦加工副产品' },
      { name: '普通大曲', qty: '280 kg', origin: '本厂自制普通大曲' },
      { name: '谷糠稻壳', qty: '360 kg', origin: '本地农副加工副产品' }
    ],
    costItems: [
      { label: '原料采购', value: '¥ 15,200' },
      { label: '人工成本', value: '¥ 7,800' },
      { label: '能源水电', value: '¥ 3,400' },
      { label: '包材辅料', value: '¥ 2,200' },
      { label: '其他费用', value: '¥ 0 (暂无)' }
    ],
    qualityItems: [
      { label: '总酸目标', value: '≥ 4.5 g/100mL' },
      { label: '还原糖', value: '≥ 1.8 g/L' },
      { label: '可溶性无盐固形物', value: '≥ 6 g/100mL' },
      { label: '翻醅次数', value: '≥ 8次 (分层均匀)' }
    ],
    metrics: [
      { label: '总周期', value: '80 天', color: '#8B4513' },
      { label: '翻醅进度', value: '第 4 / 8 轮', color: '#DAA520' },
      { label: '分层均匀度', value: '93% 合格', color: '#2E8B57' },
      { label: '预计成本', value: '¥ 2.86万', color: '#DAA520' }
    ],
    alerts: [
      { type: 'warning', title: '翻醅任务临近超时', content: '今日16:00前需完成第4轮翻醅任务，当前进度60%', time: '今天 14:20' }
    ],
    stages: buildStages(3, '2026-06-10 10:00')
  },
  'b5': {
    id: 'b5',
    batchNo: 'C20260605001',
    productName: '香醋',
    productSpec: '1L×12瓶 家庭装',
    grade: '一级酿造香醋',
    createTime: '2026-06-05 08:00',
    status: '已完成出厂交付 🎉',
    statusType: 'completed',
    currentStage: '淋醋完成',
    currentStageIndex: 8,
    progress: 100,
    cycleDays: 11,
    expectedCost: 24200,
    expectedYield: 93.6,
    qualityTarget: '总酸≥5.0g/100mL 已验收合格',
    team: { master: '李师傅', assistants: ['王磊', '孙强', '钱伟'], total: 4 },
    rawMaterials: [
      { name: '糯米', qty: '1100 kg', origin: '江苏金坛糯米基地' },
      { name: '麦麸', qty: '330 kg', origin: '江苏本地副产品' },
      { name: '酒曲 SY-202', qty: '7.5 kg', origin: '本厂专用酿酒酵母' },
      { name: '醋酸菌 沪酿1.01', qty: '5.5 kg', origin: '本院微生物所' }
    ],
    costItems: [
      { label: '原料采购', value: '¥ 13,400' },
      { label: '人工成本', value: '¥ 6,800' },
      { label: '能源水电', value: '¥ 2,600' },
      { label: '包材辅料', value: '¥ 1,400' },
      { label: '实际总成本', value: '¥ 24,200 (符合预算)' }
    ],
    qualityItems: [
      { label: '总酸实测', value: '5.28 g/100mL ✅ 达标' },
      { label: '还原糖实测', value: '13.5 g/L ✅ 达标' },
      { label: '可溶性无盐固形物', value: '9.2 g/100mL ✅ 达标' },
      { label: '出厂质检', value: '全部合格 13项指标通过' }
    ],
    metrics: [
      { label: '实际周期', value: '11 天', color: '#8B4513' },
      { label: '实际总酸', value: '5.28 g/100mL', color: '#2E8B57' },
      { label: '实际出醋率', value: '93.6% 超预期', color: '#3D5A80' },
      { label: '实际总成本', value: '¥ 2.42万', color: '#DAA520' }
    ],
    stages: buildStages(8, '2026-06-05 08:00')
  }
};

export const findBatchDetailById = (id: string): BatchDetailInfo | undefined => mockBatchDetails[id];

export const findBatchDetailByBatchNo = (batchNo: string): BatchDetailInfo | undefined =>
  Object.values(mockBatchDetails).find(d => d.batchNo === batchNo);

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
