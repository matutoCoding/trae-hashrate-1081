import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { formatMoney, formatDateTime, formatDate } from '@/utils/format';

const SaleDetailPage: React.FC = () => {
  const [orderInfo] = useState({
    orderNo: 'SO202412020008',
    status: '部分发货',
    statusType: 'partial',
    customerName: '太原市美味调料批发部',
    orderTime: '2024-12-02 10:15:30',
    salesPerson: '王经理',
    warehouse: '太原中心仓'
  });

  const [amount] = useState({
    total: 86520.00,
    received: 50000.00,
    unpaid: 36520.00
  });

  const [customer] = useState({
    avatar: '美',
    name: '太原市美味调料批发部',
    level: 'VIP客户 · A级',
    contact: '张经理',
    phone: '139****6688',
    totalOrders: 58,
    totalAmount: 238.5,
    location: '山西省太原市尖草坪区调味城A-128号'
  });

  const [products] = useState([
    { icon: '🍶', name: '三年陈酿老陈醋500mL×12瓶/箱', spec: '规格：500mL×12瓶 金标A级', price: 168.00, qty: 200 },
    { icon: '🫗', name: '一年陈醋250mL×20瓶/箱', spec: '规格：250mL×20瓶 家常装', price: 125.00, qty: 240 },
    { icon: '🧴', name: '白醋500mL×15瓶/箱', spec: '规格：500mL×15瓶 酿造白醋3.5度', price: 78.00, qty: 120 }
  ]);

  const [orderInfoList] = useState([
    { label: '订单编号', value: orderInfo.orderNo },
    { label: '下单时间', value: formatDateTime(orderInfo.orderTime) },
    { label: '业务员', value: orderInfo.salesPerson },
    { label: '发货仓库', value: orderInfo.warehouse },
    { label: '订单类型', value: '常规订单 · 月结' },
    { label: '交货方式', value: '供方送货上门' },
    { label: '要求到货', value: '2024-12-05 前' },
    { label: '备注说明', value: '要老包装，新包装客户暂不接受' }
  ]);

  const [address] = useState([
    { label: '收货单位', value: customer.name },
    { label: '收货地址', value: customer.location },
    { label: '联系人', value: customer.contact + '  ' + customer.phone },
    { label: '发票抬头', value: '太原市美味调料商贸有限公司' },
    { label: '税号', value: '91140100MA0K123456' }
  ]);

  const [payments] = useState([
    { title: '预收款 30%', desc: '2024-12-02 10:18 银行转账 · 工行0688', amount: 50000, status: 'done', time: '2024-12-02 10:20' }
  ]);

  const [timeline] = useState([
    { title: '订单更新：部分发货', desc: '三年陈醋200箱已出库装车，预计12-03送达', status: 'doing', time: '今天 14:30' },
    { title: '财务确认收款', desc: '已收到50,000元预付款，安排发货', status: 'done', time: '今天 10:45' },
    { title: '客户支付预付款', desc: '网银转账 ¥50,000 至公司工行账户', status: 'done', time: '今天 10:20' },
    { title: '仓库审核通过', desc: '库存充足，可以安排发货，等待收款', status: 'done', time: '今天 10:25' },
    { title: '创建销售订单', desc: '业务员王经理提交销售订单SO202412020008', status: 'done', time: '今天 10:15' }
  ]);

  const summaryRows = [
    { label: '商品总金额', value: formatMoney(86520), sLabel: '', sValue: '' },
    { label: '运费', value: '¥ 0.00 (供方承担)', bold: false },
    { label: '商业折扣', value: '¥ -1,500.00 (老客户优惠)', bold: false },
    { label: '优惠后金额', value: formatMoney(85020), bold: true, isAmount: true },
    { label: '税额 13%', value: formatMoney(9605.40), bold: false },
    { label: '价税合计', value: formatMoney(amount.total), bold: true, isAmount: true },
    { label: '已收款', value: formatMoney(amount.received), success: true },
    { label: '待收款', value: formatMoney(amount.unpaid), warning: true }
  ];

  const handleCall = () => {
    Taro.showToast({ title: '正在呼叫客户...', icon: 'none' });
  };

  const handleMsg = () => {
    Taro.showToast({ title: '发送消息', icon: 'none' });
  };

  const handlePay = () => {
    Taro.showModal({
      title: '登记收款',
      content: `客户待收款${formatMoney(amount.unpaid)}，是否登记新的收款记录？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '打开收款登记', icon: 'none' });
        }
      }
    });
  };

  const handleDeliver = () => {
    Taro.showToast({ title: '安排发货', icon: 'none' });
  };

  const handleEdit = () => {
    Taro.showActionSheet({
      itemList: ['修改订单', '取消订单', '延期发货', '申请退款'],
      success: (res) => {
        Taro.showToast({ title: `选项${res.tapIndex + 1}`, icon: 'none' });
      }
    });
  };

  return (
    <View className="pageContainer">
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.headerBanner}>
          <View className={styles.orderRow}>
            <Text className={styles.orderNo}>订单号 {orderInfo.orderNo}</Text>
            <View className={`${styles.statusBadge} ${styles[orderInfo.statusType]}`}>
              <Text>{orderInfo.status}</Text>
            </View>
          </View>
          <Text className={styles.customerName}>{customer.name}</Text>
          <View className={styles.metaRow}>
            <Text>📅 {formatDate(orderInfo.orderTime)}</Text>
            <Text>💼 {orderInfo.salesPerson}</Text>
            <Text>🏭 {orderInfo.warehouse}</Text>
          </View>

          <View className={styles.amountBanner}>
            <View className={styles.amountItem}>
              <Text className={styles.amountLabel}>订单总金额</Text>
              <Text className={styles.amountValue}>{formatMoney(amount.total).slice(0, 8)}</Text>
            </View>
            <View className={`${styles.amountItem} ${styles.received}`}>
              <Text className={styles.amountLabel}>已收款</Text>
              <Text className={styles.amountValue}>{formatMoney(amount.received).slice(0, 8)}</Text>
            </View>
            <View className={`${styles.amountItem} ${styles.unpaid}`}>
              <Text className={styles.amountLabel}>待收款</Text>
              <Text className={styles.amountValue}>{formatMoney(amount.unpaid).slice(0, 8)}</Text>
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>👤</Text>
              <Text>客户信息</Text>
            </View>
          </View>
          <View className={styles.customerCard}>
            <View className={styles.cAvatar}>
              <Text>{customer.avatar}</Text>
            </View>
            <View className={styles.cInfo}>
              <Text className={styles.cName}>{customer.contact}</Text>
              <Text className={styles.cLevel}>{customer.level}</Text>
              <View className={styles.cMeta}>
                <Text>📞 {customer.phone}</Text>
                <Text>📦 历史{customer.totalOrders}单</Text>
                <Text>💳 {customer.totalAmount}万</Text>
              </View>
            </View>
            <View className={styles.cActions}>
              <View className={styles.aBtn} onClick={handleCall}>
                <Text>📞</Text>
              </View>
              <View className={styles.aBtn} onClick={handleMsg}>
                <Text>💬</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🛒</Text>
              <Text>商品明细 ({products.length})</Text>
            </View>
            <Text className={styles.moreLink}>添加商品</Text>
          </View>
          <View className={styles.productList}>
            {products.map((p, idx) => (
              <View key={idx} className={styles.pItem}>
                <View className={styles.pImg}>
                  <Text>{p.icon}</Text>
                </View>
                <View className={styles.pInfo}>
                  <Text className={styles.pName}>{p.name}</Text>
                  <Text className={styles.pSpec}>{p.spec}</Text>
                  <View className={styles.pBottom}>
                    <Text className={styles.pPrice}>{formatMoney(p.price)}</Text>
                    <Text className={styles.pQty}>× {p.qty} 箱</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>💴</Text>
              <Text>金额明细 / 收款</Text>
            </View>
          </View>
          <View className={styles.paymentSummary}>
            {summaryRows.map((row, idx) => (
              <View key={idx} className={`${styles.summaryRow} ${row.bold ? styles.bold : ''} ${row.success ? styles.success : ''} ${row.warning ? styles.warning : ''}`}>
                <Text className={styles.sLabel}>{row.label}</Text>
                <Text className={styles.sValue}>{row.value}</Text>
              </View>
            ))}
          </View>
          {payments.length > 0 && (
            <View style={{ marginTop: '24rpx' }}>
              <View className={styles.infoList}>
                {payments.map((pay, idx) => (
                  <View key={idx} className={styles.infoRow}>
                    <Text className={styles.infoLabel}>{pay.title}</Text>
                    <Text className={styles.infoValue} style={{ color: '#2E8B57', fontWeight: 600 }}>
                      +{formatMoney(pay.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📋</Text>
              <Text>订单信息</Text>
            </View>
          </View>
          <View className={styles.infoList}>
            {orderInfoList.map((item, idx) => (
              <View key={idx} className={styles.infoRow}>
                <Text className={styles.infoLabel}>{item.label}</Text>
                <Text className={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📍</Text>
              <Text>收货/开票信息</Text>
            </View>
          </View>
          <View className={styles.infoList}>
            {address.map((item, idx) => (
              <View key={idx} className={styles.infoRow}>
                <Text className={styles.infoLabel}>{item.label}</Text>
                <Text className={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🕐</Text>
              <Text>订单跟踪</Text>
            </View>
          </View>
          <View className={styles.timelineList}>
            {timeline.map((item, idx) => (
              <View key={idx} className={styles.tItem}>
                <View className={`${styles.tIcon} ${styles[item.status]}`}>
                  <Text>{item.status === 'done' ? '✓' : '•'}</Text>
                </View>
                <View className={styles.tContent}>
                  <Text className={styles.tTitle}>{item.title}</Text>
                  <Text className={styles.tDesc}>{item.desc}</Text>
                  <Text className={styles.tTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <View className={styles.actionBar}>
        <Button className={`${styles.btn} ${styles.outline}`} onClick={handleEdit}>
          ⚙️ 更多
        </Button>
        <Button className={`${styles.btn} ${styles.secondary}`} onClick={handleDeliver}>
          🚚 发货
        </Button>
        <Button className={`${styles.btn} ${styles.success}`} onClick={handlePay}>
          💰 登记收款
        </Button>
      </View>
    </View>
  );
};

export default SaleDetailPage;
