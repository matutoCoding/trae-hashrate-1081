import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { formatDate, formatDateTime } from '@/utils/format';

const SteamingDetailPage: React.FC = () => {
  const [batchInfo] = useState({
    batchNo: 'C20241201-001',
    productName: '三年陈酿老陈醋',
    status: '蒸料中',
    createTime: '2024-12-01 08:00:00',
    operator: '李建国',
    workshop: '一车间A组'
  });

  const [metrics] = useState([
    { label: '高粱重量', value: '500', unit: 'kg', type: 'weight' },
    { label: '麸皮重量', value: '150', unit: 'kg', type: 'weight' },
    { label: '润水时长', value: '4', unit: '小时', type: 'time' },
    { label: '蒸料温度', value: '100', unit: '℃', type: 'temp' }
  ]);

  const [materialInfo] = useState([
    { label: '高粱产地', value: '山西忻州' },
    { label: '高粱品种', value: '晋杂22号' },
    { label: '麸皮产地', value: '山东德州' },
    { label: '辅料比例', value: '高粱:麸皮=10:3' },
    { label: '润水量', value: '高粱重量的65%' },
    { label: '蒸料压力', value: '0.12 MPa' },
    { label: '蒸煮时间', value: '90 分钟' },
    { label: '糊化度要求', value: '≥ 85%' }
  ]);

  const [staffInfo] = useState([
    { role: '主操作手', name: '李建国', avatar: '李' },
    { role: '副操作手', name: '王德福', avatar: '王' },
    { role: '质检员', name: '张秀兰', avatar: '张' },
    { role: '班组长', name: '刘师傅', avatar: '刘' }
  ]);

  const [timeline] = useState([
    { status: 'completed', icon: '📦', title: '原料进场验收', desc: '高粱500kg、麸皮150kg验收合格入库', time: '2024-12-01 06:30' },
    { status: 'completed', icon: '💧', title: '润水拌料', desc: '加入325kg清水，润水4小时，每小时翻拌1次', time: '2024-12-01 08:00' },
    { status: 'inProgress', icon: '🔥', title: '高温蒸煮', desc: '常压蒸煮90分钟，温度100℃，定时排气', time: '2024-12-01 12:00' },
    { status: 'pending', icon: '❄️', title: '出甑冷却', desc: '出锅摊晾至30-35℃，准备入糖化池', time: '预计 14:00' },
    { status: 'pending', icon: '✅', title: '蒸料完成', desc: '检测糊化度≥85%，转入下一工序', time: '预计 15:00' }
  ]);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  });

  const handleEdit = () => {
    Taro.showToast({ title: '编辑蒸料记录', icon: 'none' });
  };

  const handleComplete = () => {
    Taro.showModal({
      title: '确认完成',
      content: '确认原料蒸料工序已全部完成？完成后将转入糖化酒精发酵工序。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '工序已完成', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className="pageContainer">
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.headerBanner}>
          <View className={styles.batchRow}>
            <Text className={styles.batchNo}>批次号：{batchInfo.batchNo}</Text>
            <View className={styles.statusBadge}>
              <Text>{batchInfo.status}</Text>
            </View>
          </View>
          <Text className={styles.productName}>{batchInfo.productName}</Text>
          <View className={styles.metaRow}>
            <Text>车间：{batchInfo.workshop}</Text>
            <Text>创建：{formatDate(batchInfo.createTime)}</Text>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.titleIcon}>📊</Text>
            <Text>蒸料参数</Text>
          </View>
          <View className={styles.metricsGrid}>
            {metrics.map((item, idx) => (
              <View key={idx} className={styles.metricItem}>
                <Text className={styles.metricLabel}>{item.label}</Text>
                <Text className={`${styles.metricValue} ${styles[item.type]}`}>
                  {item.value} <Text style={{ fontSize: '24rpx', fontWeight: 'normal' }}>{item.unit}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.titleIcon}>🌾</Text>
            <Text>原料信息</Text>
          </View>
          <View className={styles.infoList}>
            {materialInfo.map((item, idx) => (
              <View key={idx} className={styles.infoRow}>
                <Text className={styles.infoLabel}>{item.label}</Text>
                <Text className={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.titleIcon}>👷</Text>
            <Text>操作人员</Text>
          </View>
          <View className={styles.staffGrid}>
            {staffInfo.map((item, idx) => (
              <View key={idx} className={styles.staffCard}>
                <View className={styles.avatar}>
                  <Text>{item.avatar}</Text>
                </View>
                <View className={styles.staffInfo}>
                  <Text className={styles.staffRole}>{item.role}</Text>
                  <Text className={styles.staffName}>{item.name}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.titleIcon}>⏱️</Text>
            <Text>工序进度</Text>
          </View>
          <View className={styles.timelineSection}>
            {timeline.map((step, idx) => (
              <View key={idx} className={styles.stepItem}>
                <View className={`${styles.stepIcon} ${styles[step.status]}`}>
                  <Text>{step.icon}</Text>
                </View>
                <View className={styles.stepContent}>
                  <Text className={styles.stepTitle}>{step.title}</Text>
                  <Text className={styles.stepDesc}>{step.desc}</Text>
                  <Text className={styles.stepTime}>{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <View className={styles.actionBar}>
        <Button className={`${styles.btn} ${styles.secondary}`} onClick={handleEdit}>
          编辑记录
        </Button>
        <Button className={`${styles.btn} ${styles.primary}`} onClick={handleComplete}>
          完成蒸料
        </Button>
      </View>
    </View>
  );
};

export default SteamingDetailPage;
