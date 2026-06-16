import { TurningTask } from '@/types/vinegar';

export const mockTurningTasks: TurningTask[] = [
  {
    id: 'tt1',
    batchId: 'b4',
    batchNo: 'C20260610002',
    taskType: 'turn',
    plannedTime: '2026-06-16 10:00',
    layerCount: 6,
    status: 'in_progress',
    operator: '张师傅',
    remark: '注意底层散热'
  },
  {
    id: 'tt2',
    batchId: 'b3',
    batchNo: 'C20260612003',
    taskType: 'turn',
    plannedTime: '2026-06-16 08:00',
    actualTime: '2026-06-16 08:15',
    layerCount: 5,
    uniformityScore: 92,
    status: 'completed',
    operator: '李师傅'
  },
  {
    id: 'tt3',
    batchId: 'b1',
    batchNo: 'C20260615001',
    taskType: 'dump',
    plannedTime: '2026-06-16 14:00',
    layerCount: 8,
    status: 'pending'
  },
  {
    id: 'tt4',
    batchId: 'b9',
    batchNo: 'C20260611001',
    taskType: 'turn',
    plannedTime: '2026-06-16 11:00',
    layerCount: 7,
    status: 'warning',
    remark: '醅温偏高，需加快翻醅节奏'
  },
  {
    id: 'tt5',
    batchId: 'b8',
    batchNo: 'C20260608001',
    taskType: 'dump',
    plannedTime: '2026-06-16 16:00',
    layerCount: 10,
    status: 'pending'
  },
  {
    id: 'tt6',
    batchId: 'b2',
    batchNo: 'C20260614002',
    taskType: 'turn',
    plannedTime: '2026-06-17 09:00',
    layerCount: 6,
    status: 'pending'
  },
  {
    id: 'tt7',
    batchId: 'b10',
    batchNo: 'C20260609002',
    taskType: 'turn',
    plannedTime: '2026-06-16 06:00',
    actualTime: '2026-06-16 06:20',
    layerCount: 7,
    uniformityScore: 88,
    status: 'completed',
    operator: '王师傅'
  },
  {
    id: 'tt8',
    batchId: 'b11',
    batchNo: 'C20260613002',
    taskType: 'dump',
    plannedTime: '2026-06-15 15:00',
    actualTime: '2026-06-15 15:30',
    layerCount: 9,
    uniformityScore: 90,
    status: 'completed',
    operator: '李师傅',
    remark: '倒醅后温度分布均匀'
  }
];
