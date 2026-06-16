import { AlcoholFermentation, AcetateFermentation, TempRecord, AcidRecord } from '@/types/vinegar';

export const generateTempHistory = (count: number, base: number = 30): number[] => {
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    result.push(Number((base + i * 1.2 + Math.random() * 3).toFixed(1)));
  }
  return result;
};

export const generateAcidHistory = (count: number, base: number = 1.0): number[] => {
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    result.push(Number((base + i * 0.5 + Math.random() * 0.3).toFixed(2)));
  }
  return result;
};

const generateTempRecords = (baseTemp: number, days: number): TempRecord[] => {
  const records: TempRecord[] = [];
  for (let i = 0; i < days; i++) {
    const hourOffset = i * 24;
    records.push({
      time: `第${i + 1}天 08:00`,
      value: Number((baseTemp + Math.random() * 6 - 3).toFixed(1))
    });
    records.push({
      time: `第${i + 1}天 20:00`,
      value: Number((baseTemp + Math.random() * 6 - 3 + 1).toFixed(1))
    });
  }
  return records;
};

const generateAcidRecords = (baseAcid: number, days: number): AcidRecord[] => {
  const records: AcidRecord[] = [];
  for (let i = 0; i < days; i++) {
    records.push({
      time: `第${i + 1}天`,
      value: Number((baseAcid + i * 0.3 + Math.random() * 0.2).toFixed(2))
    });
  }
  return records;
};

export const mockAlcoholFermentations: AlcoholFermentation[] = [
  {
    id: 'af1',
    batchId: 'b2',
    batchNo: 'C20260614002',
    saccharificationTemp: 60,
    saccharificationTime: '2026-06-14 12:00',
    yeastAmount: 2.5,
    fermentStartTemp: 28,
    fermentDays: 7,
    currentDay: 3,
    tempRecords: generateTempRecords(30, 3),
    alcoholContent: 5.2,
    status: 'in_progress',
    operator: '李师傅'
  },
  {
    id: 'af2',
    batchId: 'b6',
    batchNo: 'C20260616001',
    saccharificationTemp: 62,
    saccharificationTime: '2026-06-16 10:00',
    yeastAmount: 2.8,
    fermentStartTemp: 27,
    fermentDays: 7,
    currentDay: 1,
    tempRecords: generateTempRecords(29, 1),
    alcoholContent: 1.5,
    status: 'in_progress',
    operator: '张师傅'
  },
  {
    id: 'af3',
    batchId: 'b5',
    batchNo: 'C20260605001',
    saccharificationTemp: 60,
    saccharificationTime: '2026-06-06 08:00',
    yeastAmount: 2.6,
    fermentStartTemp: 28,
    fermentDays: 7,
    currentDay: 7,
    tempRecords: generateTempRecords(31, 7),
    alcoholContent: 8.5,
    status: 'completed',
    operator: '王师傅'
  },
  {
    id: 'af4',
    batchId: 'b7',
    batchNo: 'C20260613001',
    saccharificationTemp: 61,
    saccharificationTime: '2026-06-13 14:00',
    yeastAmount: 2.5,
    fermentStartTemp: 28,
    fermentDays: 7,
    currentDay: 4,
    tempRecords: generateTempRecords(32, 4),
    alcoholContent: 6.8,
    status: 'in_progress',
    operator: '李师傅'
  }
];

export const mockAcetateFermentations: AcetateFermentation[] = [
  {
    id: 'acf1',
    batchId: 'b1',
    batchNo: 'C20260615001',
    strainAmount: 15,
    mixTime: '2026-06-15 16:00',
    fermentDays: 21,
    currentDay: 8,
    tempRecords: generateTempRecords(38, 8),
    acidRecords: generateAcidRecords(0.5, 8),
    currentTemp: 40.2,
    currentAcid: 3.2,
    status: 'in_progress',
    operator: '王师傅'
  },
  {
    id: 'acf2',
    batchId: 'b3',
    batchNo: 'C20260612003',
    strainAmount: 15,
    mixTime: '2026-06-12 18:00',
    fermentDays: 21,
    currentDay: 12,
    tempRecords: generateTempRecords(39, 12),
    acidRecords: generateAcidRecords(0.5, 12),
    currentTemp: 42.5,
    currentAcid: 4.8,
    status: 'warning',
    operator: '李师傅'
  },
  {
    id: 'acf3',
    batchId: 'b4',
    batchNo: 'C20260610002',
    strainAmount: 16,
    mixTime: '2026-06-10 20:00',
    fermentDays: 21,
    currentDay: 15,
    tempRecords: generateTempRecords(38, 15),
    acidRecords: generateAcidRecords(0.5, 15),
    currentTemp: 39.5,
    currentAcid: 5.6,
    status: 'in_progress',
    operator: '张师傅'
  },
  {
    id: 'acf4',
    batchId: 'b8',
    batchNo: 'C20260608001',
    strainAmount: 15,
    mixTime: '2026-06-08 15:00',
    fermentDays: 21,
    currentDay: 21,
    tempRecords: generateTempRecords(37, 21),
    acidRecords: generateAcidRecords(0.5, 21),
    currentTemp: 35.0,
    currentAcid: 6.8,
    status: 'completed',
    operator: '王师傅'
  }
];
