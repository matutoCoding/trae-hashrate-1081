import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import {
  findSaleDetailById,
  findSaleDetailByOrderNo,
  calcSaleOrderAmount,
  SaleOrderDetail
} from '@/data/mockSales';
import BatchTag from '@/components/BatchTag';
import { formatMoney, formatDateTime, formatDate } from '@/utils/format';

const SaleDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params?.id || 'sr1';
  const orderNoFromParam = router.params?.orderNo;

  const [detail, setDetail] = useState<SaleOrderDetail | null>(() => {
    let found: SaleOrderDetail | undefined;
    if (orderNoFromParam) found = findSaleDetailByOrderNo(orderNoFromParam);
    if (!found) found = findSaleDetailById(id);
    if (!found) found = findSaleDetailById('sr1');
    return found || null;
  });

  useEffect(() => {
    if (!detail) {
      Taro.showToast({ title: '订单不存在', icon: 'none' });
    }
  }, [detail]);

  const amount = useMemo(() => detail ? calcSaleOrderAmount(detail) : null, [detail]);

  const summaryRows = useMemo(() => {
    if (!detail || !amount) return [];
    const rows = [];
    rows.push({ label: '商品总金额', value: formatMoney(amount.goodsTotal), bold: false });
    if (amount.freight > 0) {
      rows.push({ label: '运费', value: formatMoney(amount.freight), bold: false });
    } else {
      rows.push({ label: '运费', value: '¥ 0.00 (供方承担)', bold: false });
    }
    if (amount.discount > 0) {
      rows.push({
        label: '商业折扣',
        value: `¥ -${formatMoney(amount.discount).replace('¥ ', '')} (${detail.orderType?.includes('KA') ? '大促折扣' : detail.orderType?.includes('月结') ? '老客户优惠' : '活动折扣'})`,
        bold: false
      });
    }
    rows.push({ label: '优惠后金额（不含税）', value: formatMoney(amount.afterDiscount - amount.tax), bold: true, isAmount: true });
    rows.push({ label: `税额 ${Math.round(detail.taxRate * 100)}%`, value: formatMoney(amount.tax), bold: false });
    rows.push({ label: '价税合计', value: formatMoney(amount.grandTotal), bold: true, isAmount: true });
    rows.push({ label: '已收款', value: formatMoney(amount.paid), success: true });
    rows.push({ label: '待收款', value: formatMoney(amount.unpaid), warning: true });
    return rows;
  }, [detail, amount]);

  const handleCall = () => {
    Taro.showToast({ title: `正在呼叫${detail?.customer.contact}...`, icon: 'none' });
  };

  const handleMsg = () => {
    Taro.showToast({ title: '发送消息', icon: 'none' });
  };

  const handlePay = () => {
    if (!detail || !amount) return;
    Taro.showModal({
      title: '登记收款',
      content: `订单【${detail.orderNo}】\n待收款：${formatMoney(amount.unpaid)}\n\n是否登记新的收款记录？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '打开收款登记', icon: 'none' });
        }
      }
    });
  };

  const handleDeliver = () => {
    Taro.showToast({ title: `安排发货 ${detail?.orderNo}`, icon: 'none' });
  };

  const handleEdit = () => {
    Taro.showActionSheet({
      itemList: ['修改订单', '取消订单', '延期发货', '申请退款'],
      success: (res) => {
        Taro.showToast({ title: `选项${res.tapIndex + 1}`, icon: 'none' });
      }
    });
  };

  if (!detail || !amount) {
    return (
      <View className="pageContainer" style={{ padding: 40, alignItems: 'center', justifyContent: 'center' }}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className="pageContainer">
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.headerBanner}>
          <View className={styles.orderRow}>
            <Text className={styles.orderNo}>订单号 {detail.orderNo}</Text>
            <View className={`${styles.statusBadge} ${styles[detail.statusType]}`}>
              <Text>{detail.status}</Text>
            </View>
          </View>
          <Text className={styles.customerName}>{detail.customer.name}</Text>
          <View className={styles.metaRow}>
            <Text>📅 {formatDate(detail.orderTime)}</Text>
            <Text>💼 {detail.salesPerson}</Text>
            <Text>🏭 {detail.warehouse}</Text>
          </View>

          <View className={styles.amountBanner}>
            <View className={styles.amountItem}>
              <Text className={styles.amountLabel}>价税合计</Text>
              <Text className={styles.amountValue}>{formatMoney(amount.grandTotal).slice(0, 10)}</Text>
            </View>
            <View className={`${styles.amountItem} ${styles.received}`}>
              <Text className={styles.amountLabel}>已收款</Text>
              <Text className={styles.amountValue}>{formatMoney(amount.paid).slice(0, 10)}</Text>
            </View>
            <View className={`${styles.amountItem} ${styles.unpaid}`}>
              <Text className={styles.amountLabel}>待收款</Text>
              <Text className={styles.amountValue}>{formatMoney(amount.unpaid).slice(0, 10)}</Text>
            </View>
          </View>
          {amount.unpaid > 0 && (
            <View style={{ marginTop: 16, padding: '12rpx 24rpx', background: 'rgba(255,255,255,0.15)', borderRadius: 8, alignSelf: 'flex-start' }}>
              <Text style={{ fontSize: 22, color: '#FFF8DC' }}>
                对账核对：¥{formatMoney(amount.grandTotal).replace('¥ ', '')} = ¥{formatMoney(amount.paid).replace('¥ ', '')} + ¥{formatMoney(amount.unpaid).replace('¥ ', '')}
              </Text>
            </View>
          )}
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
              <Text>{detail.customer.avatar}</Text>
            </View>
            <View className={styles.cInfo}>
              <Text className={styles.cName}>{detail.customer.contact}</Text>
              <Text className={styles.cLevel}>{detail.customer.level}</Text>
              <View className={styles.cMeta}>
                <Text>📞 {detail.customer.phone}</Text>
                <Text>📦 历史{detail.customer.totalOrders}单</Text>
                <Text>💳 {detail.customer.totalAmount}万</Text>
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
              <Text>商品明细 ({detail.products.length})</Text>
            </View>
            <Text className={styles.moreLink}>添加商品</Text>
          </View>
          <View className={styles.productList}>
            {detail.products.map((p, idx) => (
              <View key={idx} className={styles.pItem}>
                <View className={styles.pImg}>
                  <Text>{p.icon}</Text>
                </View>
                <View className={styles.pInfo}>
                  <Text className={styles.pName}>{p.name}</Text>
                  <Text className={styles.pSpec}>{p.spec}</Text>
                  <View style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                    <BatchTag batchNo={p.batchNo} small />
                  </View>
                  <View className={styles.pBottom}>
                    <Text className={styles.pPrice}>{formatMoney(p.price)}</Text>
                    <Text className={styles.pQty}>× {p.qty.toLocaleString()} 箱</Text>
                    <Text style={{ marginLeft: 'auto', color: '#8B4513', fontWeight: 600, fontSize: 24 }}>
                      小计 {formatMoney(p.price * p.qty)}
                    </Text>
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
              <Text>金额明细 / 收款登记</Text>
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
          <View style={{ marginTop: 24, padding: '16rpx 20rpx', background: '#F5F1EA', borderRadius: 12, border: '1rpx dashed #C9A56A' }}>
            <Text style={{ fontSize: 22, color: '#8B7355', display: 'block', marginBottom: 8 }}>
              📌 核算公式核对（13%税率，按价税分离反推）：
            </Text>
            <Text style={{ fontSize: 22, color: '#8B7355', display: 'block', lineHeight: '1.6' }}>
              优惠后（含增值税）= 商品 {formatMoney(amount.goodsTotal)} {amount.freight > 0 ? `+ 运费 ${formatMoney(amount.freight)}` : ''} {amount.discount > 0 ? `- 折扣 ${formatMoney(amount.discount)}` : ''} = <Text style={{ fontWeight: 700, color: '#8B4513' }}>{formatMoney(amount.afterDiscount)}</Text>
            </Text>
            <Text style={{ fontSize: 22, color: '#8B7355', display: 'block', lineHeight: '1.6', marginTop: 4 }}>
              不含税净额 = {formatMoney(amount.afterDiscount)} ÷ 1.13 = {formatMoney(amount.afterDiscount - amount.tax)}
            </Text>
            <Text style={{ fontSize: 22, color: '#8B7355', display: 'block', lineHeight: '1.6', marginTop: 4 }}>
              应收 = 已收 {formatMoney(amount.paid)} + 待收 {formatMoney(amount.unpaid)} = <Text style={{ fontWeight: 700, color: '#2E8B57' }}>{formatMoney(amount.grandTotal)}</Text>
            </Text>
          </View>
          {detail.payments.length > 0 && (
            <View style={{ marginTop: '24rpx' }}>
              <View className={styles.cardTitle} style={{ padding: 0, marginBottom: 12 }}>
                <View className={styles.titleLeft}>
                  <Text className={styles.titleIcon}>✅</Text>
                  <Text>已收款记录（{detail.payments.length}笔）</Text>
                </View>
              </View>
              <View className={styles.infoList}>
                {detail.payments.map((pay, idx) => (
                  <View key={idx} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '20rpx 24rpx', background: '#F0FAF4', borderRadius: 12, marginBottom: 12
                  }}>
                    <View>
                      <Text style={{ fontSize: 26, fontWeight: 600, color: '#2E8B57', display: 'block' }}>
                        {pay.title}
                      </Text>
                      <Text style={{ fontSize: 22, color: '#666', display: 'block', marginTop: 6, lineHeight: '1.5' }}>
                        {pay.desc}
                      </Text>
                    </View>
                    <Text style={{ color: '#2E8B57', fontWeight: 700, fontSize: 28 }}>
                      +{formatMoney(pay.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {detail.statusType !== 'paid' && (
            <View style={{ marginTop: 24 }}>
              <Button
                className={`${styles.btn} ${styles.success}`}
                style={{ width: '100%', height: 80, lineHeight: '80rpx', borderRadius: 12 }}
                onClick={handlePay}
              >
                💰 登记收款（待收 {formatMoney(amount.unpaid)}）
              </Button>
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
            {detail.orderInfoList.map((item, idx) => (
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
            {detail.addressInfo.map((item, idx) => (
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
            {detail.timeline.map((item, idx) => (
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
