import { SaleRecord } from '@/types/vinegar';

export const mockSaleRecords: SaleRecord[] = [
  {
    id: 'sr1',
    orderNo: 'SO20260616001',
    customerName: '山西老陈醋专卖店',
    productName: '三年陈酿老陈醋',
    batchNo: 'C20250908003',
    quantity: 500,
    unitPrice: 128,
    totalAmount: 64000,
    saleDate: '2026-06-16',
    paymentStatus: 'partial',
    paidAmount: 32000,
    operator: '李经理',
    remark: '定制礼盒包装'
  },
  {
    id: 'sr2',
    orderNo: 'SO20260615002',
    customerName: '华联超市连锁',
    productName: '优质香醋500ml',
    batchNo: 'C20260310001',
    quantity: 2000,
    unitPrice: 18.5,
    totalAmount: 37000,
    saleDate: '2026-06-15',
    deliveryDate: '2026-06-16',
    paymentStatus: 'paid',
    paidAmount: 37000,
    operator: '张经理'
  },
  {
    id: 'sr3',
    orderNo: 'SO20260614003',
    customerName: '天香酒楼',
    productName: '餐饮专用米醋',
    batchNo: 'C20260405002',
    quantity: 120,
    unitPrice: 45,
    totalAmount: 5400,
    saleDate: '2026-06-14',
    deliveryDate: '2026-06-14',
    paymentStatus: 'paid',
    paidAmount: 5400,
    operator: '王经理'
  },
  {
    id: 'sr4',
    orderNo: 'SO20260612004',
    customerName: '王氏调味品批发',
    productName: '普通食用醋',
    batchNo: 'C20260415001',
    quantity: 5000,
    unitPrice: 6.8,
    totalAmount: 34000,
    saleDate: '2026-06-12',
    deliveryDate: '2026-06-13',
    paymentStatus: 'unpaid',
    paidAmount: 0,
    operator: '李经理',
    remark: '月结30天'
  },
  {
    id: 'sr5',
    orderNo: 'SO20260610005',
    customerName: '京东自营旗舰店',
    productName: '精品老陈醋礼盒',
    batchNo: 'C20251220001',
    quantity: 800,
    unitPrice: 88,
    totalAmount: 70400,
    saleDate: '2026-06-10',
    deliveryDate: '2026-06-11',
    paymentStatus: 'paid',
    paidAmount: 70400,
    operator: '张经理'
  },
  {
    id: 'sr6',
    orderNo: 'SO20260608006',
    customerName: '美特好超市',
    productName: '香醋1L装',
    batchNo: 'C20260405002',
    quantity: 3000,
    unitPrice: 12.5,
    totalAmount: 37500,
    saleDate: '2026-06-08',
    deliveryDate: '2026-06-09',
    paymentStatus: 'paid',
    paidAmount: 37500,
    operator: '王经理'
  },
  {
    id: 'sr7',
    orderNo: 'SO20260605007',
    customerName: '晋味食品公司',
    productName: '五年陈酿',
    batchNo: 'C20250908003',
    quantity: 100,
    unitPrice: 388,
    totalAmount: 38800,
    saleDate: '2026-06-05',
    paymentStatus: 'partial',
    paidAmount: 19400,
    operator: '李经理',
    remark: '高端产品，首批试销'
  }
];

export const mockCustomers = [
  { id: 1, name: '山西老陈醋专卖店', contact: '王总', phone: '138****1234', totalOrders: 28, totalAmount: 586000 },
  { id: 2, name: '华联超市连锁', contact: '李采购', phone: '139****5678', totalOrders: 45, totalAmount: 1250000 },
  { id: 3, name: '天香酒楼', contact: '张厨师长', phone: '137****9012', totalOrders: 56, totalAmount: 168000 },
  { id: 4, name: '王氏调味品批发', contact: '王总', phone: '136****3456', totalOrders: 120, totalAmount: 890000 },
  { id: 5, name: '京东自营旗舰店', contact: '运营经理', phone: '400****7890', totalOrders: 32, totalAmount: 2150000 }
];
