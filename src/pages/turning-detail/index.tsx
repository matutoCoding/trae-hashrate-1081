import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';

const TurningDetailPage: React.FC = () => {
  const [taskInfo] = useState({
    id: 'T20241202-004',
    type: '倒醅',
    title: 'B07池醋醅倒醅散热',
    status: '进行中',
    batchNo: 'C20241125-002',
    poolNo: '醋醅池 B-07',
    startTime: '今天 14:00',
    estimateEnd: '预计 15:30'
  });

  const [beforeData] = useState([
    { label: '上层醅温', value: '44.5℃' },
    { label: '下层醅温', value: '38.1℃' },
    { label: '总酸含量', value: '4.8' },
    { label: '水分含量', value: '62%' }
  ]);

  const [afterData] = useState([
    { label: '翻后均温', value: '40.2℃' },
    { label: '混合均匀度', value: '良好' },
    { label: '透气疏松度', value: '适中' },
    { label: '预计2h后', value: '38.5℃' }
  ]);

  const [steps] = useState([
    { num: 1, title: '准备工具', desc: '准备翻醅耙、温度计、酸度计，清洁工具消毒', time: '14:00 - 14:10', done: true },
    { num: 2, title: '测温测酸', desc: '测量并记录各层醅温酸度数据，确认倒醅必要性评估', time: '14:10 - 14:20', done: true },
    { num: 3, title: '分层出醅', desc: '将上层高温醋醅从池中取出，堆放于池边空地', time: '14:20 - 14:50', done: true },
    { num: 4, title: '清洁池底', desc: '清理池底残醅，检查池壁清洁并喷洒少量无菌水', time: '14:50 - 15:00', done: false },
    { num: 5, title: '重新装醅入池', desc: '将醋醅上下层交换重新装入，保证疏松均匀', time: '15:00 - 15:20', done: false },
    { num: 6, title: '整平测温', desc: '表面整平，测量最终温度酸度记录归档', time: '15:20 - 15:30', done: false }
  ]);

  const [mainStaff] = useState({
    name: '张建国', role: '主操作手', exp: '8年经验', phone: '138****8888', avatar: '张'
  });

  const [assistStaff] = useState([
    { name: '小李', short: '李' },
    { name: '小王', short: '王' },
    { name: '+2', short: '+' }
  ]);

  const [qualityData] = useState([
    { label: '翻醅前温度差', value: '6.4℃', pass: true },
    { label: '混合均匀度评估', value: '合格', pass: true },
    { label: '是否有烧醅异味', value: '无异常', pass: true },
    { label: '操作规范符合度', value: '100%', pass: true },
    { label: '质检签字确认', value: '待质检员确认', pass: false }
  ]);

  const [note] = useState('由于上层醅温达到44.5℃超过阈值，需要上下层充分交换。倒醅过程注意不要破坏菌丝体结构，保持透气性良好。完成后两小时内复查温度。');

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const handleBack = () => {
    Taro.showToast({ title: '上报异常', icon: 'none' });
  };

  const handleStartStep = () => {
    Taro.showToast({ title: '开始下一步', icon: 'none' });
  };

  const handleFinish = () => {
    Taro.showModal({
      title: '完成任务',
      content: '确认翻醅倒醅作业完成？请确认所有6个步骤全部完成。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '任务已完成', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className="pageContainer">
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.headerBanner}>
          <Text className={styles.typeTag}>🔄 {taskInfo.type}任务</Text>
          <Text className={styles.taskTitle}>{taskInfo.title}</Text>
          <View className={styles.metaRow}>
            <Text>📋 {taskInfo.batchNo}</Text>
            <Text>🏗️ {taskInfo.poolNo}</Text>
            <Text>🕐 {taskInfo.startTime}</Text>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.titleIcon}>🌡️</Text>
            <Text>翻醅前后对比</Text>
          </View>
          <View className={styles.beforeAfterGrid}>
            <View className={`${styles.baCard} ${styles.before}`}>
              <View className={`${styles.baHeader} ${styles.beforeRow}`}>
                <View className={styles.baIcon}>🌡️</View>
                <Text className={styles.baLabel}>翻醅前</Text>
              </View>
              <View className={styles.baMetrics}>
                {beforeData.map((item, idx) => (
                  <View key={idx} className={styles.mItem}>
                    <Text className={styles.mValue}>{item.value}</Text>
                    <Text className={styles.mLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={`${styles.baCard} ${styles.after}`}>
              <View className={`${styles.baHeader} ${styles.afterRow}`}>
                <View className={styles.baIcon}>✅</View>
                <Text className={styles.baLabel}>翻醅后</Text>
              </View>
              <View className={styles.baMetrics}>
                {afterData.map((item, idx) => (
                  <View key={idx} className={styles.mItem}>
                    <Text className={styles.mValue}>{item.value}</Text>
                    <Text className={styles.mLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.titleIcon}>📋</Text>
            <Text>作业步骤 (4/6)</Text>
          </View>
          <View className={styles.stepList}>
            {steps.map((step, idx) => (
              <View key={idx} className={styles.stepItem}>
                <View className={styles.stepNumber}>{step.num}</View>
                <View className={styles.stepContent}>
                  <Text className={styles.stepTitle}>{step.title}</Text>
                  <Text className={styles.stepDesc}>{step.desc}</Text>
                  <Text className={styles.stepTime}>⏰ {step.time}</Text>
                </View>
                <View className={styles.stepStatus}>
                  <Text>{step.done ? '✓' : '...'}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.titleIcon}>👷</Text>
            <Text>操作人员</Text>
          </View>
          <View className={styles.staffCard}>
            <View className={styles.avatar}>
              <Text>{mainStaff.avatar}</Text>
            </View>
            <View className={styles.staffInfo}>
              <Text className={styles.staffName}>{mainStaff.name}</Text>
              <View className={styles.staffMeta}>
                <span>{mainStaff.role}</span>
                <span>{mainStaff.exp}</span>
              </View>
            </View>
            <View className={styles.assistWrap}>
              <Text className={styles.assistTitle}>协助人员</Text>
              <View className={styles.assistAvatars}>
                {assistStaff.map((item, idx) => (
                  <View key={idx} className={styles.aAvatar}>
                    <Text>{item.short}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.titleIcon}>✅</Text>
            <Text>质量检查</Text>
          </View>
          <View className={styles.qualityCheck}>
            {qualityData.map((item, idx) => (
              <View key={idx} className={`${styles.qcRow} ${item.pass ? styles.pass : ''}`}>
                <Text className={styles.qcLabel}>{item.label}</Text>
                <Text className={styles.qcValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <Text className={styles.titleIcon}>📝</Text>
            <Text>注意事项</Text>
          </View>
          <View className={styles.noteBox}>
            <Text className={styles.noteTitle}>💡 操作提示</Text>
            <Text className={styles.noteContent}>{note}</Text>
          </View>
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <View className={styles.actionBar}>
        <Button className={`${styles.btn} ${styles.outline}`} onClick={handleBack}>
          ⚠️ 上报异常
        </Button>
        <Button className={`${styles.btn} ${styles.primary}`} onClick={handleStartStep}>
          下一步骤
        </Button>
        <Button className={`${styles.btn} ${styles.success}`} onClick={handleFinish}>
          完成任务
        </Button>
      </View>
    </View>
  );
};

export default TurningDetailPage;
