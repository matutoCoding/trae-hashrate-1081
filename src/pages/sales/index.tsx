import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import BatchTag from '@/components/BatchTag';
import { mockSaleRecords } from '@/data/mockSales';
import { SaleRecord } from '@/types/vinegar';
import { formatMoney, formatDate, getPaymentStatusText } from '@/utils/format';

type FilterType = 'all' | 'paid' | 'partial' | 'unpaid';

const SalesPage: React.FC = () => {
  const [records, setRecords] = useState<SaleRecord[]>(mockSaleRecords);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  usePullDownRefresh(() => {
    setTimeout(() => Taro.stopPullDownRefresh(), 800);
  });

  const stats = useMemo(() => {
    const totalAmount = records.reduce((s, r) => s + r.totalAmount, 0);
    const paidAmount = records.reduce((s, r) => s + r.paidAmount, 0);
    const unpaid = records.reduce((s, r) => s + (r.totalAmount - r.paidAmount), 0);
    const totalQty = records.reduce((s, r) => s + r.quantity, 0);
    return { totalAmount, paidAmount, unpaid, orderCount: records.length, totalQty };
  }, [records]);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return records;
    return records.filter(r => r.paymentStatus === activeFilter);
  }, [records, activeFilter]);

  const filterCounts = useMemo(() => ({
    all: records.length,
    paid: records.filter(r => r.paymentStatus === 'paid').length,
    partial: records.filter(r => r.paymentStatus === 'partial').length,
    unpaid: records.filter(r => r.paymentStatus === 'unpaid').length
  }), [records]);

  const handleOrderClick = (id: string) => {
    console.log('[Sales] Click order:', id);
    Taro.navigateTo({ url: '/pages/sale-detail/index' });
  };

  const handleNewOrder = () => {
    console.log('[Sales] New order');
    Taro.showToast({ title: '新建销售订单', icon: 'none' });
  };

  const handleCustomer = () => {
    console.log('[Sales] Customer');
    Taro.showToast({ title: '客户管理', icon: 'none' });
  };

  const filters = [
    { key: 'all' as FilterType, label: '全部' },
    { key: 'paid' as FilterType, label: '已收款' },
    { key: 'partial' as FilterType, label: '部分收款' },
    { key: 'unpaid' as FilterType, label: '未收款' },
  ];

  return (
    <View className="pageContainer">
      <View className={styles.statsBanner}>
        <View className={styles.bannerTitle}>
          <Text>📊 本月销售概况</Text>
          <Text className={styles.dateRange}>2026.06</Text>
        </View>
        <View className={styles.bannerStats}>
          <View className={styles.bannerItem}>
            <Text className={styles.bValue}>¥{(stats.totalAmount / 10000).toFixed(1)}万</Text>
            <Text className={styles.bLabel}>销售总额</Text>
          </View>
          <View className={styles.bannerItem}>
            <Text className={styles.bValue}>{stats.orderCount}</Text>
            <Text className={styles.bLabel}>订单数量</Text>
          </View>
          <View className={styles.bannerItem}>
            <Text className={styles.bValue}>¥{(stats.unpaid / 10000).toFixed(1)}万</Text>
            <Text className={styles.bLabel}>待收款</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabRow}>
        {filters.map(f => (
          <View
            key={f.key}
            className={classnames(styles.tabChip, activeFilter === f.key && styles.active)}
            onClick={() => setActiveFilter(f.key)}
          >
            <Text>{f.label}</Text>
            <Text className={styles.count}>{filterCounts[f.key]}</Text>
          </View>
        ))}
      </View>

      <View className={styles.summaryRow}>
        <View className={styles.summaryCard}>
          <View className={styles.sHeader}>
            <Text className={styles.icon}>📦</Text>
            <Text className={styles.title}>发货数量</Text>
          </View>
          <View className={styles.sContent}>
            <Text className={styles.value}>{stats.totalQty.toLocaleString()}</Text>
            <Text className={styles.unit}>瓶</Text>
            <Text className={classnames(styles.trend, styles.up)}>↑ 15.2%</Text>
          </View>
        </View>
        <View className={styles.summaryCard}>
          <View className={styles.sHeader}>
            <Text className={styles.icon}>✅</Text>
            <Text className={styles.title}>已回款</Text>
          </View>
          <View className={styles.sContent}>
            <Text className={styles.value}>¥{(stats.paidAmount / 10000).toFixed(1)}万</Text>
            <Text className={styles.unit}>回款率 {Math.round(stats.paidAmount / stats.totalAmount * 100)}%</Text>
          </View>
        </View>
      </View>

      <View className={styles.sectionHead}>
        <Text className={styles.sectionTitleText}>销售订单</Text>
        <Text className={styles.moreLink} onClick={() => Taro.showToast({ title: '高级筛选', icon: 'none' })}>
          🔍 筛选
        </Text>
      </View>

      {filtered.map(record => (
        <View
          key={record.id}
          className={styles.saleCard}
          onClick={() => handleOrderClick(record.id)}
        >
          <View className={styles.cardHead}>
            <View className={styles.orderInfo}>
              <Text className={styles.orderNo}>订单号：{record.orderNo}</Text>
              <Text className={styles.customer}>{record.customerName}</Text>
              <View style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                <Text className={styles.product}>{record.productName}</Text>
                <BatchTag batchNo={record.batchNo} />
              </View>
            </View>
            <View className={classnames(styles.paymentBadge, {
              [styles.paid]: record.paymentStatus === 'paid',
              [styles.partial]: record.paymentStatus === 'partial',
              [styles.unpaid]: record.paymentStatus === 'unpaid'
            })}>
              <Text>{getPaymentStatusText(record.paymentStatus)}</Text>
            </View>
          </View>

          <View className={styles.detailsGrid}>
            <View className={styles.detailItem}>
              <Text className={styles.dLabel}>销售数量</Text>
              <Text className={styles.dValue}>{record.quantity.toLocaleString()} 瓶</Text>
            </View>
            <View className={classnames(styles.detailItem, styles.price)}>
              <Text className={styles.dLabel}>单价</Text>
              <Text className={styles.dValue}>{formatMoney(record.unitPrice)}</Text>
            </View>
            <View className={classnames(styles.detailItem, styles.total)}>
              <Text className={styles.dLabel}>订单金额</Text>
              <Text className={styles.dValue}>{formatMoney(record.totalAmount)}</Text>
            </View>
          </View>

          <View style={{
            marginBottom: 12,
            padding: 16,
            background: record.paymentStatus === 'unpaid' ? 'rgba(205, 92, 92, 0.05)' : 'rgba(46, 139, 87, 0.05)',
            borderRadius: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 24, color: record.paymentStatus === 'unpaid' ? '#CD5C5C' : '#2E8B57' }}>
              {record.paymentStatus === 'paid' ? '✅ 已全额收款' :
               record.paymentStatus === 'partial' ? `💰 已收款 ${formatMoney(record.paidAmount)}` :
               '⚠️ 待全额收款'}
            </Text>
            {record.paymentStatus !== 'paid' && (
              <Text style={{ fontSize: 24, color: '#CD5C5C', fontWeight: 600 }}>
                待收：{formatMoney(record.totalAmount - record.paidAmount)}
              </Text>
            )}
          </View>

          <View className={styles.cardFoot}>
            <View className={styles.footMeta}>
              <View className={styles.item}>
                <Text>📅</Text>
                <Text>下单：{formatDate(record.saleDate)}</Text>
              </View>
              {record.deliveryDate && (
                <View className={styles.item}>
                  <Text>🚚</Text>
                  <Text>发货：{formatDate(record.deliveryDate)}</Text>
                </View>
              )}
              <View className={styles.item}>
                <Text>👤</Text>
                <Text>{record.operator}</Text>
              </View>
            </View>
            <Button
              className={styles.viewBtn}
              onClick={(e) => { e.stopPropagation?.(); handleOrderClick(record.id); }}
            >
              查看详情
            </Button>
          </View>
        </View>
      ))}

      <View style={{ height: 180 }} />

      <View className={styles.floatingBar}>
        <View className={styles.btnGroup}>
          <Button className={styles.actionSecondary} onClick={handleCustomer}>
            👥 客户
          </Button>
          <Button className={styles.actionPrimary} onClick={handleNewOrder}>
            + 新建订单
          </Button>
        </View>
      </View>
    </View>
  );
};

export default SalesPage;
