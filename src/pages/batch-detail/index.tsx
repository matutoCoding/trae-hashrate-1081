import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { formatDate, formatDateTime } from '@/utils/format';

const BatchDetailPage: React.FC = () => {
  const [batchInfo] = useState({
    batchNo: 'C20241125-002',
    productName: '山西老陈醋 · 金标',
    status: '醋酸发酵阶段',
    createTime: '2024-11-25 10:00:00',
    productSpec: 'GB/T 19777 地理标志产品',
    level: '一级'
  });

  const [progress] = useState({
    percent: 48,
    text: '进行中 (第5/9道工序)',
    startDate: '2024-11-25',
    expectEnd: '预计2025-02-15'
  });

  const [metrics] = useState([
    { label: '预计周期', value: '82', unit: '天', type: 'time' },
    { label: '生产成本', value: '3.28', unit: '万', type: 'cost' },
    { label: '预计出成', value: '87.5', unit: '%', type: 'yield' }
  ]);

  const [stages] = useState([
    {
      icon: '🌾', name: '原料蒸料', status: 'done',
      time: '11-25 10:00 - 15:00',
      desc: '高粱500kg+麸皮150kg，润水4h，蒸料90min，糊化度88%',
      tags: [{ text: '主操作：李师傅', type: '' }, { text: '查看详情', type: 'detailBtn', page: 'steaming' }]
    },
    {
      icon: '🍶', name: '糖化酒精发酵', status: 'done',
      time: '11-28 09:00 - 12-08 18:00',
      desc: '酒精度7.2%，发酵10天，前3天每天翻拌2次',
      tags: [{ text: '酒醅: 3,200kg', type: '' }, { text: '查看详情', type: 'detailBtn', page: 'alcohol' }]
    },
    {
      icon: '🦠', name: '拌入醋酸菌种', status: 'done',
      time: '12-09 08:00 - 11:30',
      desc: '接种10%成熟醋醅，麸皮20%，谷壳疏松剂10%',
      tags: [{ text: '菌种：沪酿1.01', type: '' }]
    },
    {
      icon: '🔄', name: '翻醅倒醅管理', status: 'doing',
      time: '12-10 至今',
      desc: '已完成翻醅8次，倒醅2次，上层温度控制在38-42℃',
      tags: [{ text: '异常:温度偏高', type: '' }, { text: '查看详情', type: 'detailBtn', page: 'turning' }]
    },
    {
      icon: '🌡️', name: '醅温醅酸监测', status: 'doing',
      time: '每日监测中',
      desc: '总酸4.8g/100mL，平均醅温41.2℃，水分62%',
      tags: [{ text: '当前醋酸发酵12天', type: '' }, { text: '查看详情', type: 'detailBtn', page: 'acetate' }]
    },
    {
      icon: '⚗️', name: '套淋淋醋取液', status: 'pending',
      time: '预计 12-15 开始',
      desc: '一淋二淋三淋套淋法，预计出醋2,800L',
      tags: [{ text: '待开始', type: '' }]
    },
    {
      icon: '🏺', name: '新醋陈酿晒露', status: 'pending',
      time: '预计 12-18 开始',
      desc: '宜兴紫砂陶缸陈酿，目标一年期',
      tags: [{ text: '陈酿期1年', type: '' }]
    },
    {
      icon: '🧪', name: '过滤澄清灌装', status: 'pending',
      time: '预计 2025-12 进行',
      desc: '硅藻土过滤+自然澄清+巴氏杀菌',
      tags: [{ text: '待开始', type: '' }]
    },
    {
      icon: '📦', name: '包装入库销售', status: 'pending',
      time: '待定',
      desc: '500mL×12瓶/箱，喷码追溯入库',
      tags: [{ text: '待开始', type: '' }]
    }
  ]);

  const [infoCards] = useState([
    {
      title: '📋 原料配置',
      rows: [
        { label: '主料高粱', value: '500 kg' },
        { label: '辅料麸皮', value: '150 kg' },
        { label: '谷壳疏松', value: '50 kg' },
        { label: '合计粮醅', value: '4,000 kg' }
      ]
    },
    {
      title: '👷 团队人员',
      custom: true
    },
    {
      title: '💰 成本预估',
      rows: [
        { label: '原料成本', value: '¥ 15,600' },
        { label: '人工成本', value: '¥ 8,400' },
        { label: '能耗包装', value: '¥ 6,200' },
        { label: '管理摊销', value: '¥ 2,600' }
      ]
    },
    {
      title: '📊 质量目标',
      rows: [
        { label: '总酸含量', value: '≥ 5.0%' },
        { label: '氨基酸氮', value: '≥ 0.25%' },
        { label: '成品等级', value: '一级品以上' },
        { label: '合格率', value: '≥ 98%' }
      ]
    }
  ]);

  const [team] = useState([
    { name: '李', role: '制醅组组长' },
    { name: '王', role: '发酵操作工' },
    { name: '张', role: '翻醅操作工' },
    { name: '赵', role: '陈酿管理员' },
    { name: '刘', role: '质检员' }
  ]);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  });

  const handleStageClick = (page?: string) => {
    if (!page) return;
    const routeMap: Record<string, string> = {
      steaming: '/pages/steaming-detail/index',
      alcohol: '/pages/alcohol-detail/index',
      acetate: '/pages/acetate-detail/index',
      turning: '/pages/turning-detail/index',
      leaching: '/pages/leaching-detail/index'
    };
    const route = routeMap[page];
    if (route) Taro.navigateTo({ url: route });
  };

  const handleReport = () => {
    Taro.showToast({ title: '生成批次报告', icon: 'none' });
  };

  const handleAction = () => {
    Taro.showActionSheet({
      itemList: ['新增任务', '分配人员', '调整计划', '暂停批次'],
      success: (res) => {
        Taro.showToast({ title: `已选择: 选项${res.tapIndex + 1}`, icon: 'none' });
      }
    });
  };

  return (
    <View className="pageContainer">
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.headerBanner}>
          <View className={styles.batchRow}>
            <Text className={styles.batchNo}>批次号 {batchInfo.batchNo}</Text>
            <View className={styles.statusBadge}>
              <Text>{batchInfo.status}</Text>
            </View>
          </View>
          <Text className={styles.productName}>{batchInfo.productName}</Text>
          <View className={styles.metaRow}>
            <Text>📋 {batchInfo.productSpec}</Text>
            <Text>⭐ {batchInfo.level}</Text>
            <Text>📅 创建：{formatDate(batchInfo.createTime)}</Text>
          </View>

          <View className={styles.progressSection}>
            <View className={styles.progressHeader}>
              <Text className={styles.label}>总体进度</Text>
              <Text className={styles.value}>{progress.percent}% · {progress.text}</Text>
            </View>
            <View className={styles.progressBar}>
              <View className={styles.fill} style={{ width: `${progress.percent}%` }} />
            </View>
            <View className={styles.progressLabels}>
              <Text>开始 {progress.startDate}</Text>
              <Text>预计完成 {progress.expectEnd}</Text>
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📊</Text>
              <Text>核心数据</Text>
            </View>
          </View>
          <View className={styles.coreMetrics}>
            {metrics.map((item, idx) => (
              <View key={idx} className={styles.metricBox}>
                <Text className={`${styles.mValue} ${styles[item.type]}`}>
                  {item.value}{item.unit}
                </Text>
                <Text className={styles.mLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🔀</Text>
              <Text>工艺流程进度 (9道工序)</Text>
            </View>
            <Text className={styles.moreLink}>流程图</Text>
          </View>
          <View className={styles.processTimeline}>
            {stages.map((stage, idx) => (
              <View key={idx} className={styles.stageItem}>
                <View className={`${styles.stageIcon} ${styles[stage.status]}`}>
                  <Text>{stage.icon}</Text>
                </View>
                <View className={styles.stageContent}>
                  <View className={styles.stageHeader}>
                    <Text className={styles.stageName}>{idx + 1}. {stage.name}</Text>
                    <Text className={styles.stageTime}>{stage.time}</Text>
                  </View>
                  <Text className={styles.stageDesc}>{stage.desc}</Text>
                  <View className={styles.stageTags}>
                    {stage.tags.map((tag, tIdx) => (
                      <Text
                        key={tIdx}
                        className={`${styles.tag} ${tag.type === 'detailBtn' ? styles.detailBtn : ''}`}
                        onClick={() => handleStageClick(tag.page)}
                      >
                        {tag.text}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📑</Text>
              <Text>更多批次信息</Text>
            </View>
          </View>
          <View className={styles.infoGrid}>
            {infoCards.map((card, idx) => (
              <View key={idx} className={styles.infoCard}>
                <Text className={styles.infoTitle}>{card.title}</Text>
                {card.custom ? (
                  <View>
                    <View className={styles.staffAvatars}>
                      {team.map((p, pIdx) => (
                        <View key={pIdx} className={styles.aItem}>
                          <Text>{p.name}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={{ marginTop: '16rpx', fontSize: '22rpx', color: '#9B7B6B' }}>
                      共 {team.length} 人 · 点击查看
                    </View>
                  </View>
                ) : (
                  card.rows?.map((row, rIdx) => (
                    <View key={rIdx} className={styles.infoRow}>
                      <Text className={styles.label}>{row.label}</Text>
                      <Text className={styles.value}>{row.value}</Text>
                    </View>
                  ))
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <View className={styles.actionBar}>
        <Button className={`${styles.btn} ${styles.outline}`} onClick={handleReport}>
          📄 批次报告
        </Button>
        <Button className={`${styles.btn} ${styles.primary}`} onClick={handleAction}>
          批次操作
        </Button>
      </View>
    </View>
  );
};

export default BatchDetailPage;
