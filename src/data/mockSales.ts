import { SaleRecord } from '@/types/vinegar';

export interface SaleDetailProduct {
  icon: string;
  name: string;
  spec: string;
  price: number;
  qty: number;
  batchNo: string;
}

export interface SaleDetailPayment {
  title: string;
  desc: string;
  amount: number;
  status: 'done' | 'pending';
  time?: string;
}

export interface SaleDetailTimelineItem {
  title: string;
  desc: string;
  status: 'done' | 'doing' | 'pending';
  time: string;
}

export interface SaleOrderDetail {
  id: string;
  orderNo: string;
  status: string;
  statusType: 'paid' | 'partial' | 'unpaid';
  customerName: string;
  orderTime: string;
  salesPerson: string;
  warehouse: string;
  remark?: string;
  orderType?: string;
  deliveryType?: string;
  requiredDate?: string;

  customer: {
    avatar: string;
    name: string;
    level: string;
    contact: string;
    phone: string;
    totalOrders: number;
    totalAmount: number;
    location: string;
  };

  products: SaleDetailProduct[];

  freight: number;
  discount: number;
  taxRate: number;
  payments: SaleDetailPayment[];
  timeline: SaleDetailTimelineItem[];

  orderInfoList: { label: string; value: string }[];
  addressInfo: { label: string; value: string }[];
  invoiceInfo: { label: string; value: string }[];
}

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
  { id: 5, name: '京东自营旗舰店', contact: '运营经理', phone: '400****7890', totalOrders: 32, totalAmount: 2150000 },
  { id: 6, name: '美特好超市', contact: '赵经理', phone: '135****2468', totalOrders: 38, totalAmount: 625000 },
  { id: 7, name: '晋味食品公司', contact: '刘总', phone: '133****1357', totalOrders: 15, totalAmount: 486000 }
];

const getCustomerByName = (name: string) => {
  const c = mockCustomers.find(m => m.name === name);
  return c || mockCustomers[0];
};

const avatarFromName = (name: string) => name.charAt(0);

const statusText = (s: 'paid' | 'partial' | 'unpaid') =>
  s === 'paid' ? '已完成' : s === 'partial' ? '部分发货' : '待付款';

export const mockSaleOrderDetails: Record<string, SaleOrderDetail> = {
  'sr1': {
    id: 'sr1',
    orderNo: 'SO20260616001',
    status: statusText('partial'),
    statusType: 'partial',
    customerName: '山西老陈醋专卖店',
    orderTime: '2026-06-16 10:15:30',
    salesPerson: '李经理',
    warehouse: '太原中心仓',
    remark: '定制礼盒包装，客户指定老包装设计',
    orderType: '常规订单 · 月结',
    deliveryType: '供方送货上门',
    requiredDate: '2026-06-18 前',
    customer: (() => {
      const c = getCustomerByName('山西老陈醋专卖店');
      return {
        avatar: avatarFromName(c.name),
        name: c.name,
        level: 'VIP客户 · A级',
        contact: c.contact,
        phone: c.phone,
        totalOrders: c.totalOrders,
        totalAmount: Math.round(c.totalAmount / 10000 * 10) / 10,
        location: '山西省太原市迎泽区食品街56号老陈醋专卖店'
      };
    })(),
    products: [
      { icon: '🍶', name: '三年陈酿老陈醋500mL×12瓶/箱', spec: '规格：500mL×12瓶 金标A级 礼盒装', price: 168.00, qty: 200, batchNo: 'C20250908003' },
      { icon: '🫗', name: '一年陈醋250mL×20瓶/箱', spec: '规格：250mL×20瓶 家常装', price: 125.00, qty: 120, batchNo: 'C20250910004' },
      { icon: '🧴', name: '白醋500mL×15瓶/箱', spec: '规格：500mL×15瓶 酿造白醋3.5度', price: 78.00, qty: 80, batchNo: 'C20260508001' }
    ],
    freight: 0,
    discount: 1500,
    taxRate: 0.13,
    payments: [
      { title: '预付款 50%', desc: '2026-06-16 10:35 银行转账 · 工行太原分行尾号0688', amount: 32000, status: 'done', time: '2026-06-16 10:40' }
    ],
    timeline: [
      { title: '仓库备货中：定制礼盒包装', desc: '已领取定制礼盒包装材料，安排包装班组', status: 'doing', time: '今天 14:30' },
      { title: '财务确认收款', desc: '已收到32,000元预付款（50%），安排备货', status: 'done', time: '今天 10:45' },
      { title: '客户支付预付款', desc: '网银转账 ¥32,000 至公司工行账户', status: 'done', time: '今天 10:35' },
      { title: '仓库审核通过', desc: '库存充足，可按订单备货，等待收款确认', status: 'done', time: '今天 10:25' },
      { title: '创建销售订单', desc: '业务员李经理提交销售订单SO20260616001', status: 'done', time: '今天 10:15' }
    ],
    orderInfoList: [
      { label: '订单编号', value: 'SO20260616001' },
      { label: '下单时间', value: '2026-06-16 10:15:30' },
      { label: '业务员', value: '李经理' },
      { label: '发货仓库', value: '太原中心仓' },
      { label: '订单类型', value: '常规订单 · 月结' },
      { label: '交货方式', value: '供方送货上门' },
      { label: '要求到货', value: '2026-06-18 前' },
      { label: '备注说明', value: '定制礼盒包装，客户指定老包装设计' }
    ],
    addressInfo: [
      { label: '收货单位', value: '山西老陈醋专卖店' },
      { label: '收货地址', value: '山西省太原市迎泽区食品街56号' },
      { label: '联系人', value: '王总  138****1234' },
      { label: '发票抬头', value: '山西老陈醋商贸有限公司' },
      { label: '税号', value: '91140100MA0K888123' }
    ],
    invoiceInfo: []
  },
  'sr2': {
    id: 'sr2',
    orderNo: 'SO20260615002',
    status: '全部发货',
    statusType: 'paid',
    customerName: '华联超市连锁',
    orderTime: '2026-06-15 09:20:15',
    salesPerson: '张经理',
    warehouse: '华北分仓',
    remark: '华联618大促补货订单',
    orderType: 'KA重点客户',
    deliveryType: '第三方物流配送',
    requiredDate: '2026-06-16 前',
    customer: (() => {
      const c = getCustomerByName('华联超市连锁');
      return {
        avatar: avatarFromName(c.name),
        name: c.name,
        level: '战略客户 · S级',
        contact: c.contact,
        phone: c.phone,
        totalOrders: c.totalOrders,
        totalAmount: Math.round(c.totalAmount / 10000 * 10) / 10,
        location: '北京市朝阳区建国路88号华联总部采购中心'
      };
    })(),
    products: [
      { icon: '🍶', name: '优质香醋500ml×15瓶/箱', spec: '规格：500mL×15瓶 红标优级', price: 18.50, qty: 2000, batchNo: 'C20260310001' }
    ],
    freight: 1200,
    discount: 2280,
    taxRate: 0.13,
    payments: [
      { title: '全款结算', desc: '2026-06-15 14:22 对公电汇 · 招行北京分行', amount: 37000, status: 'done', time: '2026-06-15 14:30' }
    ],
    timeline: [
      { title: '客户签收确认', desc: '华联物流中心收货2000箱，破损0，已签收', status: 'done', time: '昨天 16:20' },
      { title: '物流配送完成', desc: '德邦物流运单号DB2026061500123，已送达北京', status: 'done', time: '昨天 11:05' },
      { title: '出库装车', desc: '华北分仓拣货完成，2000箱装车发运', status: 'done', time: '6-15 18:30' },
      { title: '财务确认收款', desc: '全款到账37,000元，安排出库', status: 'done', time: '6-15 14:30' },
      { title: '创建销售订单', desc: '张经理提交KA客户618大促补货订单', status: 'done', time: '6-15 09:20' }
    ],
    orderInfoList: [
      { label: '订单编号', value: 'SO20260615002' },
      { label: '下单时间', value: '2026-06-15 09:20:15' },
      { label: '业务员', value: '张经理' },
      { label: '发货仓库', value: '华北分仓' },
      { label: '订单类型', value: 'KA重点客户' },
      { label: '交货方式', value: '第三方物流配送（德邦）' },
      { label: '要求到货', value: '2026-06-16 前' },
      { label: '备注说明', value: '华联618大促补货订单' }
    ],
    addressInfo: [
      { label: '收货单位', value: '华联超市连锁股份有限公司' },
      { label: '收货地址', value: '北京市通州区联华物流园3号库' },
      { label: '联系人', value: '李采购  139****5678' },
      { label: '发票抬头', value: '华联超市连锁股份有限公司' },
      { label: '税号', value: '91110000MA01ABCD99' }
    ],
    invoiceInfo: []
  },
  'sr3': {
    id: 'sr3',
    orderNo: 'SO20260614003',
    status: '已完成',
    statusType: 'paid',
    customerName: '天香酒楼',
    orderTime: '2026-06-14 11:08:00',
    salesPerson: '王经理',
    warehouse: '太原中心仓',
    remark: '酒楼端午宴席备货，加急送货',
    orderType: '餐饮客户',
    deliveryType: '自有配送车',
    requiredDate: '2026-06-14 当日',
    customer: (() => {
      const c = getCustomerByName('天香酒楼');
      return {
        avatar: avatarFromName(c.name),
        name: c.name,
        level: '优质客户 · B级',
        contact: c.contact,
        phone: c.phone,
        totalOrders: c.totalOrders,
        totalAmount: Math.round(c.totalAmount / 10000 * 10) / 10,
        location: '山西省太原市小店区长治路123号天香酒楼总店'
      };
    })(),
    products: [
      { icon: '🫙', name: '餐饮专用米醋5L桶装', spec: '规格：5L×4桶/箱 餐饮实惠装', price: 45.00, qty: 120, batchNo: 'C20260405002' }
    ],
    freight: 0,
    discount: 0,
    taxRate: 0.13,
    payments: [
      { title: '货到付款 现金结算', desc: '2026-06-14 15:00 酒楼财务现金支付', amount: 5400, status: 'done', time: '2026-06-14 15:10' }
    ],
    timeline: [
      { title: '订单完成归档', desc: '款项两清，订单归档', status: 'done', time: '6-14 17:00' },
      { title: '酒楼签收并付款', desc: '张厨师长验收120箱，现金付款5400元', status: 'done', time: '6-14 15:00' },
      { title: '配送到达', desc: '自有配送车晋A·88888送达，卸货完成', status: 'done', time: '6-14 14:20' },
      { title: '出库装车', desc: '120箱米醋装车，端午宴席备货加急', status: 'done', time: '6-14 13:40' },
      { title: '创建销售订单', desc: '王经理接天香酒楼端午加急订单', status: 'done', time: '6-14 11:08' }
    ],
    orderInfoList: [
      { label: '订单编号', value: 'SO20260614003' },
      { label: '下单时间', value: '2026-06-14 11:08:00' },
      { label: '业务员', value: '王经理' },
      { label: '发货仓库', value: '太原中心仓' },
      { label: '订单类型', value: '餐饮客户 · 加急' },
      { label: '交货方式', value: '自有配送车 当日送达' },
      { label: '要求到货', value: '2026-06-14 当日' },
      { label: '备注说明', value: '酒楼端午宴席备货，加急送货' }
    ],
    addressInfo: [
      { label: '收货单位', value: '天香酒楼' },
      { label: '收货地址', value: '山西省太原市小店区长治路123号 后厨收货区' },
      { label: '联系人', value: '张厨师长  137****9012' },
      { label: '发票抬头', value: '太原市天香餐饮管理有限公司' },
      { label: '税号', value: '91140100MA0H987654' }
    ],
    invoiceInfo: []
  },
  'sr4': {
    id: 'sr4',
    orderNo: 'SO20260612004',
    status: '已发货 待收款',
    statusType: 'unpaid',
    customerName: '王氏调味品批发',
    orderTime: '2026-06-12 16:42:18',
    salesPerson: '李经理',
    warehouse: '太原中心仓',
    remark: '月结30天 老客户信用发货',
    orderType: '经销商客户 · 月结',
    deliveryType: '供方送货上门',
    requiredDate: '2026-06-13 前',
    customer: (() => {
      const c = getCustomerByName('王氏调味品批发');
      return {
        avatar: avatarFromName(c.name),
        name: c.name,
        level: '金牌经销商 · A级',
        contact: c.contact,
        phone: c.phone,
        totalOrders: c.totalOrders,
        totalAmount: Math.round(c.totalAmount / 10000 * 10) / 10,
        location: '山西省太原市尖草坪区北方商贸城调味品区A座88号'
      };
    })(),
    products: [
      { icon: '🧴', name: '普通食用醋500mL×20瓶/箱', spec: '规格：500mL×20瓶 流通装 3.5度', price: 6.80, qty: 5000, batchNo: 'C20260415001' }
    ],
    freight: 680,
    discount: 0,
    taxRate: 0.13,
    payments: [],
    timeline: [
      { title: '催款提醒：超期风险', desc: '月结30天客户，距离发货已超4天未回款', status: 'doing', time: '今天 09:00' },
      { title: '客户正常收货', desc: '王氏仓库签收5000箱，回执已返回', status: 'done', time: '6-13 16:30' },
      { title: '送达客户仓库', desc: '北方商贸城卸货完成', status: 'done', time: '6-13 11:20' },
      { title: '安排发货装车', desc: '信用审批通过，安排5000箱发货', status: 'done', time: '6-13 08:30' },
      { title: '信用审核通过', desc: '月结30天老客户，信用额度20万内', status: 'done', time: '6-12 17:30' },
      { title: '创建销售订单', desc: '李经理提交流通大货订单5000箱', status: 'done', time: '6-12 16:42' }
    ],
    orderInfoList: [
      { label: '订单编号', value: 'SO20260612004' },
      { label: '下单时间', value: '2026-06-12 16:42:18' },
      { label: '业务员', value: '李经理' },
      { label: '发货仓库', value: '太原中心仓' },
      { label: '订单类型', value: '经销商 · 月结30天' },
      { label: '交货方式', value: '供方送货上门' },
      { label: '要求到货', value: '2026-06-13 前' },
      { label: '备注说明', value: '月结30天 老客户信用发货' }
    ],
    addressInfo: [
      { label: '收货单位', value: '王氏调味品批发部' },
      { label: '收货地址', value: '山西省太原市尖草坪区北方商贸城调味品区A座88号' },
      { label: '联系人', value: '王总  136****3456' },
      { label: '发票抬头', value: '太原市王氏商贸有限公司' },
      { label: '税号', value: '91140100MA0L111222' }
    ],
    invoiceInfo: []
  },
  'sr5': {
    id: 'sr5',
    orderNo: 'SO20260610005',
    status: '已完成',
    statusType: 'paid',
    customerName: '京东自营旗舰店',
    orderTime: '2026-06-10 14:25:50',
    salesPerson: '张经理',
    warehouse: '京东协同仓（太原）',
    remark: '京东618大促备货订单 平台结算',
    orderType: '电商平台 · T+7结算',
    deliveryType: '京东TC入仓',
    requiredDate: '2026-06-11 前',
    customer: (() => {
      const c = getCustomerByName('京东自营旗舰店');
      return {
        avatar: avatarFromName(c.name),
        name: c.name,
        level: '平台大客户 · S级',
        contact: c.contact,
        phone: c.phone,
        totalOrders: c.totalOrders,
        totalAmount: Math.round(c.totalAmount / 10000 * 10) / 10,
        location: '京东集团线上自营平台（京东太原TC仓收货）'
      };
    })(),
    products: [
      { icon: '🎁', name: '精品老陈醋礼盒 2瓶×500mL装', spec: '规格：500mL×2瓶 精美礼盒 618促销款', price: 88.00, qty: 800, batchNo: 'C20251220001' }
    ],
    freight: 0,
    discount: 5400,
    taxRate: 0.13,
    payments: [
      { title: '京东T+7平台结算', desc: '京东金融平台自动划扣，6月17日到账预计', amount: 70400, status: 'done', time: '2026-06-17 10:05' }
    ],
    timeline: [
      { title: '京东平台确认收货', desc: '京东TC仓质检通过，800套礼盒上架入库', status: 'done', time: '6-12 09:00' },
      { title: '平台货款到账', desc: 'T+7结算完成，京东金融划款70400元', status: 'done', time: '6-17 10:05' },
      { title: '送达京东TC仓', desc: '京东太原榆次TC仓卸货，等待质检', status: 'done', time: '6-11 15:30' },
      { title: '协同仓出库', desc: '京东协同仓（太原）拣货800套礼盒发运', status: 'done', time: '6-11 08:15' },
      { title: '创建销售订单', desc: '张经理提交京东618大促备货单', status: 'done', time: '6-10 14:25' }
    ],
    orderInfoList: [
      { label: '订单编号', value: 'SO20260610005' },
      { label: '下单时间', value: '2026-06-10 14:25:50' },
      { label: '业务员', value: '张经理' },
      { label: '发货仓库', value: '京东协同仓（太原）' },
      { label: '订单类型', value: '电商平台 · T+7结算' },
      { label: '交货方式', value: '京东TC入仓' },
      { label: '要求到货', value: '2026-06-11 前' },
      { label: '备注说明', value: '京东618大促备货订单' }
    ],
    addressInfo: [
      { label: '收货单位', value: '北京京东世纪贸易有限公司' },
      { label: '收货地址', value: '山西省晋中市榆次区京东亚洲一号太原TC仓' },
      { label: '联系人', value: '京东运营经理  400****7890' },
      { label: '发票抬头', value: '北京京东世纪贸易有限公司' },
      { label: '税号', value: '91110302660527653P' }
    ],
    invoiceInfo: []
  },
  'sr6': {
    id: 'sr6',
    orderNo: 'SO20260608006',
    status: '已完成',
    statusType: 'paid',
    customerName: '美特好超市',
    orderTime: '2026-06-08 08:30:22',
    salesPerson: '王经理',
    warehouse: '太原中心仓',
    remark: '美特好端午节庆补货',
    orderType: '本地连锁超市',
    deliveryType: '第三方物流配送',
    requiredDate: '2026-06-09 前',
    customer: (() => {
      const c = getCustomerByName('美特好超市');
      return {
        avatar: avatarFromName(c.name),
        name: c.name,
        level: '区域重点 · A级',
        contact: c.contact,
        phone: c.phone,
        totalOrders: c.totalOrders,
        totalAmount: Math.round(c.totalAmount / 10000 * 10) / 10,
        location: '山西省太原市晋源区美特好总部配送中心'
      };
    })(),
    products: [
      { icon: '🍾', name: '香醋1L装×12瓶/箱', spec: '规格：1L×12瓶 红标香醋', price: 12.50, qty: 3000, batchNo: 'C20260405002' }
    ],
    freight: 420,
    discount: 3450,
    taxRate: 0.13,
    payments: [
      { title: '电汇对公结算', desc: '2026-06-10 15:20 美特好财务部电汇', amount: 37500, status: 'done', time: '2026-06-10 15:40' }
    ],
    timeline: [
      { title: '订单完成', desc: '货款两清，订单圆满完成', status: 'done', time: '6-11 09:30' },
      { title: '财务确认货款到账', desc: '美特好电汇37500元到账', status: 'done', time: '6-10 15:40' },
      { title: '美特好签收回单', desc: '配送中心收货3000箱，回执单盖章返回', status: 'done', time: '6-09 17:00' },
      { title: '送达美特好配送中心', desc: '晋中市榆次区卸货，质检通过', status: 'done', time: '6-09 11:40' },
      { title: '3000箱装车发运', desc: '第三方物流晋A·物流001装车', status: 'done', time: '6-09 07:30' },
      { title: '创建销售订单', desc: '王经理提交美特好端午补货订单', status: 'done', time: '6-08 08:30' }
    ],
    orderInfoList: [
      { label: '订单编号', value: 'SO20260608006' },
      { label: '下单时间', value: '2026-06-08 08:30:22' },
      { label: '业务员', value: '王经理' },
      { label: '发货仓库', value: '太原中心仓' },
      { label: '订单类型', value: '本地连锁超市' },
      { label: '交货方式', value: '第三方物流配送' },
      { label: '要求到货', value: '2026-06-09 前' },
      { label: '备注说明', value: '美特好端午节庆补货' }
    ],
    addressInfo: [
      { label: '收货单位', value: '美特好超市连锁有限公司' },
      { label: '收货地址', value: '山西省太原市晋源区美特好总部配送中心3号口' },
      { label: '联系人', value: '赵经理  135****2468' },
      { label: '发票抬头', value: '山西省美特好连锁超市股份有限公司' },
      { label: '税号', value: '91140000701135791A' }
    ],
    invoiceInfo: []
  },
  'sr7': {
    id: 'sr7',
    orderNo: 'SO20260605007',
    status: '部分发货',
    statusType: 'partial',
    customerName: '晋味食品公司',
    orderTime: '2026-06-05 15:10:08',
    salesPerson: '李经理',
    warehouse: '太原中心仓',
    remark: '高端产品首批试销，后续预计加单至500瓶',
    orderType: '高端品牌定制',
    deliveryType: '专车配送',
    requiredDate: '2026-06-06 前',
    customer: (() => {
      const c = getCustomerByName('晋味食品公司');
      return {
        avatar: avatarFromName(c.name),
        name: c.name,
        level: '潜力客户 · 新客户B级',
        contact: c.contact,
        phone: c.phone,
        totalOrders: c.totalOrders,
        totalAmount: Math.round(c.totalAmount / 10000 * 10) / 10,
        location: '山西省临汾市翼城县晋味食品深加工产业园'
      };
    })(),
    products: [
      { icon: '🏆', name: '五年陈酿·金标陶坛 500mL精品', spec: '规格：500mL×6瓶/箱 宜兴紫砂陶坛陈酿', price: 388.00, qty: 100, batchNo: 'C20250908003' }
    ],
    freight: 580,
    discount: 2200,
    taxRate: 0.13,
    payments: [
      { title: '首付款 50%', desc: '2026-06-05 16:55 客户网银转账 试销保证金', amount: 19400, status: 'done', time: '2026-06-05 17:05' }
    ],
    timeline: [
      { title: '试销反馈跟踪', desc: '5年陈酿高端产品试销期，关注终端动销', status: 'doing', time: '今天 11:20' },
      { title: '首付款到账确认', desc: '客户打款19400元（50%），剩余50%试销结束结算', status: 'done', time: '6-05 17:05' },
      { title: '客户专车提货', desc: '晋味公司派车自提100箱（6瓶×100=600瓶）', status: 'done', time: '6-06 10:30' },
      { title: '高端成品仓出库', desc: '宜兴紫砂陶坛5年陈酿，手工打包防震，温度控制', status: 'done', time: '6-06 09:00' },
      { title: '高端订单审批通过', desc: '总经理签字：首批试销扶持，后续加单可享返点', status: 'done', time: '6-05 16:45' },
      { title: '创建销售订单', desc: '李经理提交晋味食品公司高端陈酿试销订单', status: 'done', time: '6-05 15:10' }
    ],
    orderInfoList: [
      { label: '订单编号', value: 'SO20260605007' },
      { label: '下单时间', value: '2026-06-05 15:10:08' },
      { label: '业务员', value: '李经理' },
      { label: '发货仓库', value: '太原中心仓（高端成品区）' },
      { label: '订单类型', value: '高端品牌定制 · 首批试销' },
      { label: '交货方式', value: '客户专车自提' },
      { label: '要求到货', value: '2026-06-06 前' },
      { label: '备注说明', value: '高端产品首批试销，后续预计加单至500瓶' }
    ],
    addressInfo: [
      { label: '收货单位', value: '山西晋味食品股份有限公司' },
      { label: '收货地址', value: '山西省临汾市翼城县晋味食品深加工产业园展示中心' },
      { label: '联系人', value: '刘总  133****1357' },
      { label: '发票抬头', value: '山西晋味食品股份有限公司' },
      { label: '税号', value: '91141000MA0KX99988' }
    ],
    invoiceInfo: []
  }
};

export interface SaleOrderAmountCalcResult {
  goodsTotal: number;
  freight: number;
  discount: number;
  afterDiscount: number;
  tax: number;
  grandTotal: number;
  paid: number;
  unpaid: number;
}

export const calcSaleOrderAmount = (detail: SaleOrderDetail): SaleOrderAmountCalcResult => {
  const goodsTotal = detail.products.reduce((s, p) => s + p.price * p.qty, 0);
  const freight = detail.freight || 0;
  const discount = detail.discount || 0;
  const afterDiscount = goodsTotal + freight - discount;
  const netAmount = afterDiscount / (1 + detail.taxRate);
  const tax = afterDiscount - netAmount;
  const grandTotal = afterDiscount;
  const paid = detail.payments.reduce((s, p) => p.status === 'done' ? s + p.amount : s, 0);
  const unpaid = Math.max(0, grandTotal - paid);

  return { goodsTotal, freight, discount, afterDiscount, tax, grandTotal, paid, unpaid };
};

export const findSaleDetailById = (id: string): SaleOrderDetail | undefined => {
  return mockSaleOrderDetails[id];
};

export const findSaleDetailByOrderNo = (orderNo: string): SaleOrderDetail | undefined => {
  return Object.values(mockSaleOrderDetails).find(d => d.orderNo === orderNo);
};
