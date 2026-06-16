import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { formatDate } from '@/utils/format';
import DataChart from '@/components/DataChart';
import { generateTempHistory, generateAcidHistory } from '@/data/mockFermentation';

const AcetateDetailPage: React.FC = () => {
  const [batchInfo] = useState({
    batchNo: 'C20241125-002',
    productName: '山西老陈醋',
    status: '高温发酵期',
    createTime: '2024-11-25 10:00:00',
    poolNo: '醋醅池 B-07',
    layerCount: '4层',
    days: 12
  });

  const [alertInfo] = useState({
    show: true,
    title: '醅温偏高预警',
    desc: '上层醅温达到44.5℃，超过44℃阈值，请尽快安排翻醅散热，防止烧醅影响品质。'
  });

  const [metrics] = useState([
    { label: '总酸含量', value: '4.8', unit: 'g/100mL', type: 'acid' },
    { label: '平均醅温', value: '41.2', unit: '℃', type: 'temp', alert: true },
    { label: '醅含水量', value: '62', unit: '%', type: 'moisture' },
    { label: '发酵天数', value: '12', unit: '天', type: 'day' }
  ]);

  const [layerData] = useState([
    { name: '第1层（上层）', temp: '44.5', acid: '5.2', hot: true },
    { name: '第2层（中上层）', temp: '42.3', acid: '4.9', middle: true },
    { name: '第3层（中下层）', temp: '39.8', acid: '4.6', middle: true },
    { name: '第4层（下层）', temp: '38.1', acid: '4.3', bottom: true }
  ]);

  const [chartData] = useState({
    labels: ['第1天', '第3天', '第5天', '第7天', '第9天', '第11天'],
    primary: generateTempHistory(6).map((t, i) => ({
      label: `第${i * 2 + 1}天`,
      value: 36 + t * 0.15,
      color: '#E07A5F'
    })),
    secondary: generateAcidHistory(6).map((a, i) => ({
      label: `第${i * 2 + 1}天`,
      value: a * 5,
      color: '#3D5A80'
    }))
  });

  const [processInfo] = useState([
    { label: '酒醅投入量', value: '3,200 kg（酒精度7.2%）' },
    { label: '醋酸菌接种量', value: '10% 成熟醋醅作为种子' },
    { label: '麸皮添加量', value: '640 kg（酒醅的20%）' },
    { label: '谷壳添加量', value: '320 kg（疏松剂）' },
    { label: '接种温度', value: '32 ℃' },
    { label: '最佳发酵温区', value: '38-42 ℃' },
    { label: '每日翻醅次数', value: '1-2次（高温期增加）' },
    { label: '目标总酸含量', value: '≥ 5.0 g/100mL' },
    { label: '发酵周期', value: '20-25天' },
    { label: '操作班组', value: '制醅二班（张师傅组）' }
  ]);

  const [strainInfo] = useState({
    name: '沪酿1.01醋酸杆菌',
    code: 'Acetobacter AS1.41',
    source: '中国科学院微生物研究所',
    acid: '产酸 ≥ 4.5%',
    temp: '适温 38-42℃',
    alcohol: '耐酒精度 8%'
  });

  const [records] = useState([
    {
      time: '今天 14:30',
      tags: [{ text: '翻醅', type: 'turn' }, { text: '温度高', type: 'warn' }],
      metrics: [
        { label: '上层温', value: '44.5' },
        { label: '下层温', value: '38.1' },
        { label: '总酸', value: '4.8' },
        { label: '水分', value: '62' }
      ],
      operator: '张建国',
      note: '上层醅温偏高，已进行翻醅散热处理'
    },
    {
      time: '今天 08:00',
      tags: [{ text: '常规检测', type: 'check' }],
      metrics: [
        { label: '上层温', value: '41.8' },
        { label: '下层温', value: '37.5' },
        { label: '总酸', value: '4.6' },
        { label: '水分', value: '61' }
      ],
      operator: '李师傅',
      note: '发酵正常，温度略升，注意下午监控'
    },
    {
      time: '昨天 14:00',
      tags: [{ text: '翻醅', type: 'turn' }],
      metrics: [
        { label: '上层温', value: '40.2' },
        { label: '下层温', value: '36.8' },
        { label: '总酸', value: '4.2' },
        { label: '水分', value: '63' }
      ],
      operator: '张建国',
      note: '例行翻醅，倒醅一次，上下交换均匀'
    }
  ]);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  });

  const handleRecordTemp = () => {
    Taro.showToast({ title: '录入醅温醅酸', icon: 'none' });
  };

  const handleTurn = () => {
    Taro.showModal({
      title: '发起翻醅任务',
      content: '检测到上层醅温偏高，建议立即安排翻醅散热。是否创建翻醅任务？',
      confirmText: '立即翻醅',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '翻醅任务已创建', icon: 'success' });
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
            <Text>🧱 {batchInfo.poolNo}</Text>
            <Text>📚 {batchInfo.layerCount}</Text>
            <Text>📅 {formatDate(batchInfo.createTime)}</Text>
          </View>
        </View>

        {alertInfo.show && (
          <View className={styles.warningBanner}>
            <Text className={styles.warnIcon}>⚠️</Text>
            <View className={styles.warnContent}>
              <Text className={styles.warnTitle}>{alertInfo.title}</Text>
              <Text className={styles.warnDesc}>{alertInfo.desc}</Text>
            </View>
          </View>
        )}

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🌡️</Text>
              <Text>醅温醅酸监测</Text>
            </View>
          </View>
          <View className={styles.coreMetrics}>
            {metrics.map((item, idx) => (
              <View key={idx} className={`${styles.metricBox} ${item.alert ? styles.alert : ''}`}>
                <Text className={`${styles.metricValue} ${styles[item.type]}`}>
                  {item.value}
                </Text>
                <Text className={styles.metricLabel}>{item.label}</Text>
                <Text style={{ fontSize: '20rpx', color: '#9B7B6B' }}>{item.unit}</Text>
              </View>
            ))}
          </View>

          <View className={styles.cardTitle} style={{ marginBottom: '16rpx' }}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📚</Text>
              <Text>分层温度酸度</Text>
            </View>
          </View>
          <View className={styles.layerInfo}>
            {layerData.map((layer, idx) => (
              <View
                key={idx}
                className={`${styles.layerCard} ${layer.hot ? styles.hot : ''} ${layer.middle ? styles.middle : ''} ${layer.bottom ? styles.bottom : ''}`}
              >
                <Text className={styles.layerName}>{layer.name}</Text>
                <View className={styles.layerMetrics}>
                  <View className={styles.layerMetric}>
                    <Text className={styles.mValue}>{layer.temp}℃</Text>
                    <Text className={styles.mLabel}>醅温</Text>
                  </View>
                  <View className={styles.layerMetric}>
                    <Text className={styles.mValue}>{layer.acid}</Text>
                    <Text className={styles.mLabel}>酸度</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📈</Text>
              <Text>发酵趋势图</Text>
            </View>
            <Text className={styles.moreLink}>导出数据</Text>
          </View>
          <DataChart
            type="bar"
            title=""
            labels={chartData.labels}
            primaryLabel="平均醅温(℃)"
            secondaryLabel="总酸(×0.1%)"
            data1={chartData.primary}
            data2={chartData.secondary}
            height={320}
          />
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🧬</Text>
              <Text>醋酸菌种信息</Text>
            </View>
          </View>
          <View className={styles.strainCard}>
            <View className={styles.strainIcon}>
              <Text>🦠</Text>
            </View>
            <View className={styles.strainContent}>
              <Text className={styles.strainName}>{strainInfo.name}</Text>
              <Text className={styles.strainCode}>菌株编号：{strainInfo.code}</Text>
              <View className={styles.strainParams}>
                <Text>🏛️ 来源：{strainInfo.source}</Text>
                <Text>⚗️ {strainInfo.acid}</Text>
                <Text>🌡️ {strainInfo.temp}</Text>
                <Text>🍶 {strainInfo.alcohol}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📋</Text>
              <Text>工艺参数配置</Text>
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
              <Text>操作记录</Text>
            </View>
            <Text className={styles.moreLink}>全部记录</Text>
          </View>
          <View className={styles.recordList}>
            {records.map((rec, idx) => (
              <View key={idx} className={styles.recordItem}>
                <View className={styles.recordHeader}>
                  <Text className={styles.recordTime}>{rec.time}</Text>
                  <View className={styles.recordTags}>
                    {rec.tags.map((tag, tIdx) => (
                      <Text key={tIdx} className={`${styles.tag} ${styles[tag.type]}`}>
                        {tag.text}
                      </Text>
                    ))}
                  </View>
                </View>
                <View className={styles.recordGrid}>
                  {rec.metrics.map((m, mIdx) => (
                    <View key={mIdx} className={styles.gridItem}>
                      <Text className={styles.gridValue}>{m.value}</Text>
                      <Text className={styles.gridLabel}>{m.label}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ fontSize: '22rpx', color: '#6B4423', marginBottom: '8rpx' }}>
                  💬 {rec.note}
                </View>
                <View className={styles.operatorRow}>
                  <Text>操作人：{rec.operator}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <View className={styles.actionBar}>
        <Button className={`${styles.btn} ${styles.secondary}`} onClick={handleRecordTemp}>
          录入数据
        </Button>
        <Button className={`${styles.btn} ${styles.warning}`} onClick={handleTurn}>
          🔄 立即翻醅
        </Button>
      </View>
    </View>
  );
};

export default AcetateDetailPage;
