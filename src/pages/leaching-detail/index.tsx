import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { formatDate } from '@/utils/format';

const LeachingDetailPage: React.FC = () => {
  const [batchInfo] = useState({
    batchNo: 'C20241120-001',
    productName: '特制五粮老陈醋',
    status: '正在二级淋醋',
    createTime: '2024-11-20 10:00:00',
    tankNo: '淋醋罐组 L-02',
    days: '第2天'
  });

  const [outputStats] = useState([
    { label: '预计出醋', value: '2,800', unit: 'L', type: 'volume', sub: '原料4,000kg' },
    { label: '平均酸度', value: '5.2', unit: 'g/100mL', type: 'acid', sub: '头淋5.8 / 二淋5.0' },
    { label: '出醋率', value: '70', unit: '%', type: 'ratio', sub: '行业水平65%' }
  ]);

  const [activeStage, setActiveStage] = useState(2);

  const [stages] = useState([
    { label: '一级淋醋(头淋)', value: '2,000L 已完成', status: 'done' },
    { label: '二级淋醋(二淋)', value: '进行中 约60%', status: 'active' },
    { label: '三级淋醋(三淋)', value: '待开始', status: 'pending' }
  ]);

  const [stageDetail] = useState({
    title: '二级套淋',
    tag: '正在进行',
    params: [
      { label: '加入二淋水量', value: '1,500 L' },
      { label: '浸泡时长', value: '12 小时 (已8h)' },
      { label: '淋出液酸度', value: '5.0 g/100mL' },
      { label: '已收集量', value: '900 L / 目标1,500L' },
      { label: '淋出温度', value: '25 ℃ (常温)' },
      { label: '过滤精度', value: '200 目滤布' }
    ],
    timeline: [
      { label: '开始', time: '今天 06:00', status: 'done' },
      { label: '浸泡6h', time: '今天 12:00', status: 'done' },
      { label: '开始收集', time: '今天 12:30', status: 'doing' },
      { label: '完成', time: '预计 18:00', status: 'pending' }
    ]
  });

  const [processFlow] = useState([
    { icon: '🧱', title: '醋醅装池', desc: '将成熟醋醅均匀装入淋醋池，压实平整' },
    { icon: '💧', title: '加水浸泡', desc: '加入上批二淋/三淋醋液，浸泡12h' },
    { icon: '⚗️', title: '淋出收集', desc: '开放淋醋口控制流速，收集头淋醋液' },
    { icon: '🔁', title: '二级套淋', desc: '头淋后加水浸泡淋出二淋醋' },
    { icon: '🪣', title: '三级套淋', desc: '二淋后加水浸泡淋出三淋醋(淡醋)' },
    { icon: '🏺', title: '醋液合并', desc: '头淋为主，二淋调配酸度' }
  ]);

  const [params] = useState([
    { label: '淋醋池编号', value: 'L-02-A / L-02-B (2池并联)' },
    { label: '醋醅投入量', value: '4,000 kg（总酸5.1%）' },
    { label: '头淋用水量', value: '2,000 L（上批三淋醋液回用）' },
    { label: '二淋用水量', value: '1,500 L（上批三淋+清水）' },
    { label: '三淋用水量', value: '1,000 L（清水）' },
    { label: '淋醋方式', value: '套淋法（逆流循环）' },
    { label: '流速控制', value: '先慢后快，淋口半开' },
    { label: '淋渣处理', value: '三淋后醋渣晒干作饲料' }
  ]);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  });

  const handleRecord = () => {
    Taro.showToast({ title: '记录淋醋数据', icon: 'none' });
  };

  const handleNext = () => {
    Taro.showModal({
      title: '进入下一工序',
      content: '淋醋即将完成，确认将收集到的醋液转入过滤澄清及陈酿工序？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已提交转序', icon: 'success' });
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
            <Text>🏺 {batchInfo.tankNo}</Text>
            <Text>📅 {formatDate(batchInfo.createTime)}</Text>
            <Text>⏱️ {batchInfo.days}</Text>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📊</Text>
              <Text>产出概览</Text>
            </View>
          </View>
          <View className={styles.outputStats}>
            {outputStats.map((item, idx) => (
              <View key={idx} className={styles.statBox}>
                <Text className={`${styles.statValue} ${styles[item.type]}`}>
                  {item.value}{item.unit}
                </Text>
                <Text className={styles.statLabel}>{item.label}</Text>
                <Text className={styles.statSub}>{item.sub}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🪜</Text>
              <Text>套淋阶段</Text>
            </View>
          </View>
          <View className={styles.stageTabs}>
            {stages.map((stage, idx) => (
              <View
                key={idx}
                className={`${styles.stageTab} ${stage.status === 'active' ? styles.active : ''} ${stage.status === 'done' ? styles.done : ''}`}
                onClick={() => setActiveStage(idx)}
              >
                <Text className={styles.stageLabel}>{stage.label.split('(')[0]}</Text>
                <Text className={styles.stageValue}>{stage.value}</Text>
              </View>
            ))}
          </View>

          <View className={styles.stageDetail}>
            <View className={styles.stageTitle}>
              <Text>{stageDetail.title} - 详情</Text>
              <Text className={styles.tag}>{stageDetail.tag}</Text>
            </View>
            <View className={styles.paramsGrid}>
              {stageDetail.params.map((p, idx) => (
                <View key={idx} className={styles.paramItem}>
                  <Text className={styles.paramLabel}>{p.label}</Text>
                  <Text className={styles.paramValue}>{p.value}</Text>
                </View>
              ))}
            </View>
            <View className={styles.timelineMini}>
              {stageDetail.timeline.map((t, idx) => (
                <React.Fragment key={idx}>
                  <View className={`${styles.timePoint} ${styles[t.status]}`}>
                    <View className={styles.tDot} />
                    <Text className={styles.tLabel}>{t.time}</Text>
                  </View>
                  {idx < stageDetail.timeline.length - 1 && <View className={styles.tLine} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🔁</Text>
              <Text>套淋工艺流程</Text>
            </View>
          </View>
          <View className={styles.flowDiagram}>
            {processFlow.map((step, idx) => (
              <View key={idx} className={styles.flowStep}>
                <View className={styles.fIcon}>
                  <Text>{step.icon}</Text>
                </View>
                <View className={styles.fContent}>
                  <Text className={styles.fTitle}>
                    {idx + 1}. {step.title}
                  </Text>
                  <Text className={styles.fDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📋</Text>
              <Text>淋醋参数配置</Text>
            </View>
          </View>
          <View className={styles.infoList}>
            {params.map((item, idx) => (
              <View key={idx} className={styles.infoRow}>
                <Text className={styles.infoLabel}>{item.label}</Text>
                <Text className={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <View className={styles.actionBar}>
        <Button className={`${styles.btn} ${styles.secondary}`} onClick={handleRecord}>
          记录数据
        </Button>
        <Button className={`${styles.btn} ${styles.primary}`} onClick={handleNext}>
          完成淋醋 → 陈酿
        </Button>
      </View>
    </View>
  );
};

export default LeachingDetailPage;
