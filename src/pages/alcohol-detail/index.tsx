import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { formatDate } from '@/utils/format';
import DataChart from '@/components/DataChart';
import { generateTempHistory, generateAcidHistory } from '@/data/mockFermentation';

const AlcoholDetailPage: React.FC = () => {
  const [batchInfo] = useState({
    batchNo: 'C20241128-003',
    productName: '精品五粮醋',
    status: '发酵第5天',
    createTime: '2024-11-28 09:00:00',
    tankNo: 'A-03号糖化池',
    operator: '王师傅'
  });

  const [metrics] = useState([
    { label: '酒精度', value: '6.8', unit: '%', type: 'alcohol', trend: '↑ 0.3%' },
    { label: '还原糖', value: '2.3', unit: '%', type: 'sugar', trend: '↓ 0.5%', trendDown: true },
    { label: '品温', value: '31.2', unit: '℃', type: 'temp', trend: '↑ 0.8℃' }
  ]);

  const [progress] = useState({
    percent: 50,
    current: '第5天',
    total: '共10天',
    startDate: '2024-11-28',
    endDate: '预计2024-12-08'
  });

  const [chartData] = useState({
    labels: ['第1天', '第2天', '第3天', '第4天', '第5天'],
    primary: generateTempHistory(5).map((t, i) => ({
      label: `第${i + 1}天`,
      value: t,
      color: '#E07A5F'
    })),
    secondary: generateAcidHistory(5).map((a, i) => ({
      label: `第${i + 1}天`,
      value: a * 10,
      color: '#3D5A80'
    }))
  });

  const [dailyRecords] = useState([
    { day: '第5天', time: '今天 08:30', temp: '31.2', alcohol: '6.8', sugar: '2.3', operator: '王师傅' },
    { day: '第4天', time: '昨天 08:30', temp: '30.4', alcohol: '6.5', sugar: '2.8', operator: '王师傅' },
    { day: '第3天', time: '12-01 08:30', temp: '29.8', alcohol: '5.9', sugar: '3.5', operator: '李师傅' },
    { day: '第2天', time: '11-30 08:30', temp: '28.5', alcohol: '4.8', sugar: '4.8', operator: '李师傅' },
    { day: '第1天', time: '11-29 08:30', temp: '26.0', alcohol: '2.1', sugar: '8.2', operator: '王师傅' }
  ]);

  const [processInfo] = useState([
    { label: '糖化酶添加量', value: '120 单位/克原料' },
    { label: '活性干酵母', value: '0.3%（按原料计）' },
    { label: '入池温度', value: '26 ℃' },
    { label: '主发酵控温', value: '30-34 ℃' },
    { label: '后发酵控温', value: '25-28 ℃' },
    { label: '每日搅拌', value: '前3天每天2次' },
    { label: '发酵容器', value: 'A-03号糖化池 (5吨级)' },
    { label: '目标酒精度', value: '≥ 7.5%' }
  ]);

  const [strainInfo] = useState({
    name: '高活性酿酒酵母',
    code: 'Angel SY-202',
    dosage: '接种量 0.3%',
    temp: '适温 28-32℃',
    ph: 'pH 4.0-5.0'
  });

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  });

  const handleRecord = () => {
    Taro.showToast({ title: '录入发酵数据', icon: 'none' });
  };

  const handleNext = () => {
    Taro.showModal({
      title: '转入醋酸发酵',
      content: '酒精发酵即将完成，确认转入醋酸发酵工序？将进行拌入醋酸菌种操作。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已提交转序申请', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className="pageContainer">
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.headerBanner}>
          <View className={styles.batchRow}>
            <Text className={styles.batchNo}>批次：{batchInfo.batchNo}</Text>
            <View className={styles.statusBadge}>
              <Text>{batchInfo.status}</Text>
            </View>
          </View>
          <Text className={styles.productName}>{batchInfo.productName}</Text>
          <View className={styles.metaRow}>
            <Text>{batchInfo.tankNo}</Text>
            <Text>创建：{formatDate(batchInfo.createTime)}</Text>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📊</Text>
              <Text>核心指标</Text>
            </View>
          </View>
          <View className={styles.coreMetrics}>
            {metrics.map((item, idx) => (
              <View key={idx} className={styles.metricBox}>
                <Text className={`${styles.metricValue} ${styles[item.type]}`}>
                  {item.value}<Text style={{ fontSize: '22rpx', fontWeight: 'normal' }}>{item.unit}</Text>
                </Text>
                <Text className={styles.metricLabel}>{item.label}</Text>
                <Text className={`${styles.metricTrend} ${item.trendDown ? styles.down : ''}`}>{item.trend}</Text>
              </View>
            ))}
          </View>

          <View className={styles.progressSection}>
            <View className={styles.progressHeader}>
              <Text className={styles.label}>发酵进度</Text>
              <Text className={styles.value}>{progress.current} / {progress.total}</Text>
            </View>
            <View className={styles.progressBar}>
              <View className={styles.fill} style={{ width: `${progress.percent}%` }} />
            </View>
            <View className={styles.progressMeta}>
              <Text>开始：{progress.startDate}</Text>
              <Text style={{ color: '$color-success' }}>完成度 {progress.percent}%</Text>
              <Text>结束：{progress.endDate}</Text>
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📈</Text>
              <Text>温度酸度趋势</Text>
            </View>
            <Text className={styles.moreLink}>查看完整数据</Text>
          </View>
          <DataChart
            type="bar"
            title=""
            labels={chartData.labels}
            primaryLabel="品温(℃)"
            secondaryLabel="酸度(×0.1%)"
            data1={chartData.primary}
            data2={chartData.secondary}
            height={320}
          />
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🧪</Text>
              <Text>酒曲菌种信息</Text>
            </View>
          </View>
          <View className={styles.strainInfo}>
            <View className={styles.strainIcon}>
              <Text>🦠</Text>
            </View>
            <View className={styles.strainContent}>
              <Text className={styles.strainName}>{strainInfo.name}</Text>
              <Text className={styles.strainCode}>菌株编号：{strainInfo.code}</Text>
              <View className={styles.strainParams}>
                <Text className={styles.paramItem}>💧 {strainInfo.dosage}</Text>
                <Text className={styles.paramItem}>🌡️ {strainInfo.temp}</Text>
                <Text className={styles.paramItem}>⚗️ {strainInfo.ph}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📋</Text>
              <Text>工艺参数</Text>
            </View>
          </View>
          <View className={styles.infoList}>
            {processInfo.map((item, idx) => (
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
              <Text className={styles.titleIcon}>📝</Text>
              <Text>每日检测记录</Text>
            </View>
            <Text className={styles.moreLink}>全部记录</Text>
          </View>
          <View className={styles.recordList}>
            {dailyRecords.map((record, idx) => (
              <View key={idx} className={styles.recordItem}>
                <View className={styles.recordHeader}>
                  <Text className={styles.recordTime}>{record.time}</Text>
                  <Text className={styles.recordDay}>{record.day}</Text>
                </View>
                <View className={styles.recordGrid}>
                  <View className={styles.gridItem}>
                    <Text className={styles.gridValue}>{record.temp}℃</Text>
                    <Text className={styles.gridLabel}>品温</Text>
                  </View>
                  <View className={styles.gridItem}>
                    <Text className={styles.gridValue}>{record.alcohol}%</Text>
                    <Text className={styles.gridLabel}>酒精度</Text>
                  </View>
                  <View className={styles.gridItem}>
                    <Text className={styles.gridValue}>{record.sugar}%</Text>
                    <Text className={styles.gridLabel}>还原糖</Text>
                  </View>
                </View>
                <View style={{ marginTop: '16rpx', fontSize: '22rpx', color: '#9B7B6B' }}>
                  操作人：{record.operator}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <View className={styles.actionBar}>
        <Button className={`${styles.btn} ${styles.secondary}`} onClick={handleRecord}>
          录入数据
        </Button>
        <Button className={`${styles.btn} ${styles.primary}`} onClick={handleNext}>
          完成酒精发酵
        </Button>
      </View>
    </View>
  );
};

export default AlcoholDetailPage;
