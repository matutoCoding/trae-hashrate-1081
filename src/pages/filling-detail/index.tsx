import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { formatDate } from '@/utils/format';

const FillingDetailPage: React.FC = () => {
  const [batchInfo] = useState({
    batchNo: 'C20240901-005',
    productName: '一年陈醋 · 家常装',
    status: '灌装中',
    createTime: '2024-09-01',
    lineNo: '灌装生产线 2号',
    productCode: 'GB/T 18187'
  });

  const [stats] = useState([
    { value: '2,400', label: '计划瓶数' },
    { value: '1,860', label: '已灌装' },
    { value: '1,852', label: '合格数' },
    { value: '8', label: '剔除数' }
  ]);

  const [specs] = useState([
    {
      icon: '🍶',
      name: '500mL玻璃瓶装',
      rows: [
        { label: '规格', value: '500mL × 12瓶/箱' },
        { label: '标签样式', value: '红金经典款' }
      ],
      percent: 70,
      count: '1240 / 2000瓶'
    },
    {
      icon: '🫗',
      name: '250mL便携装',
      rows: [
        { label: '规格', value: '250mL × 20瓶/箱' },
        { label: '标签样式', value: '旅行小瓶装' }
      ],
      percent: 55,
      count: '220 / 400瓶'
    }
  ]);

  const [params] = useState([
    { label: '灌装速度', value: '40 瓶/分钟', range: '范围: 35-45' },
    { label: '灌装精度', value: '± 3 mL', range: '误差: < 1%' },
    { label: '杀菌温度', value: '85 ℃', range: '巴氏杀菌 15min' },
    { label: '封口扭矩', value: '1.2 N·m', range: '标准: 1.0-1.5' },
    { label: '灌装液位', value: '标准线 ±2mm', range: '视觉检测系统' },
    { label: '洁净等级', value: '10万级洁净区', range: '食品级标准' }
  ]);

  const [processSteps] = useState([
    { name: '洗瓶', status: 'done', icon: '1' },
    { name: '灌装', status: 'doing', icon: '2' },
    { name: '杀菌', status: 'doing', icon: '3' },
    { name: '封盖', status: 'pending', icon: '4' },
    { name: '贴标', status: 'pending', icon: '5' }
  ]);

  const [shelfInfo] = useState([
    { label: '产品等级', value: '一级品' },
    { label: '生产日期', value: '2024-12-02 (今天)', highlight: true },
    { label: '保质期', value: '36个月（三年）' },
    { label: '到期日期', value: '2027-12-01', highlight: true },
    { label: '批号喷码', value: 'C20241202-05 14:30 L2' },
    { label: '追溯码', value: '6901234 567890 012345' },
    { label: '存储条件', value: '阴凉干燥处，避免阳光直射' },
    { label: '质检报告编号', value: 'QA-20241202-005' },
    { label: '执行标准', value: 'GB/T 18187-2000 固态发酵' }
  ]);

  const [qaItems] = useState([
    { icon: '✓', type: 'pass', title: '外观检测', detail: '抽检100瓶，瓶身干净无裂痕，液位均在标准范围内', result: '合格' },
    { icon: '✓', type: 'pass', title: '密封性测试', detail: '倒置24小时无渗漏，瓶盖扭矩符合标准', result: '合格' },
    { icon: '✓', type: 'pass', title: '微生物抽检', detail: '菌落总数<1000CFU/mL，大肠菌群未检出', result: '合格' },
    { icon: '✓', type: 'pass', title: '酸度检测', detail: '总酸4.82g/100mL，符合标准≥4.5', result: '合格' }
  ]);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  });

  const handleRecord = () => {
    Taro.showToast({ title: '录入质检数据', icon: 'none' });
  };

  const handleComplete = () => {
    Taro.showModal({
      title: '完成灌装批次',
      content: '确认本批次灌装包装全部完成？完成后可办理入库手续并进入销售环节。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '批次已完成', icon: 'success' });
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
            <Text>🏭 {batchInfo.lineNo}</Text>
            <Text>📋 {batchInfo.productCode}</Text>
            <Text>📅 {formatDate(batchInfo.createTime)}</Text>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📦</Text>
              <Text>灌装统计</Text>
            </View>
          </View>
          <View className={styles.statsGrid}>
            {stats.map((item, idx) => (
              <View key={idx} className={styles.statItem}>
                <Text className={styles.sValue}>{item.value}</Text>
                <Text className={styles.sLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View className={styles.cardTitle} style={{ marginTop: '16rpx' }}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🍾</Text>
              <Text>包装规格进度</Text>
            </View>
          </View>
          <View className={styles.specList}>
            {specs.map((spec, idx) => (
              <View key={idx} className={styles.specCard}>
                <View className={styles.bottleIcon}>
                  <Text>{spec.icon}</Text>
                </View>
                <View className={styles.specInfo}>
                  <Text style={{
                    fontSize: '28rpx', fontWeight: '600', color: '#2C1810',
                    marginBottom: '8rpx'
                  }}>{spec.name}</Text>
                  {spec.rows.map((row, rIdx) => (
                    <View key={rIdx} className={styles.specRow}>
                      <Text className={styles.label}>{row.label}:</Text>
                      <Text className={styles.value}>{row.value}</Text>
                    </View>
                  ))}
                </View>
                <View className={styles.progressWrap}>
                  <Text className={styles.percent}>{spec.percent}%</Text>
                  <View className={styles.bar}>
                    <View className={styles.fill} style={{ width: `${spec.percent}%` }} />
                  </View>
                  <Text style={{ fontSize: '18rpx', color: '#9B7B6B', marginTop: '4rpx' }}>
                    {spec.count}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>⚙️</Text>
              <Text>工艺参数</Text>
            </View>
          </View>
          <View className={styles.paramsGrid}>
            {params.map((p, idx) => (
              <View key={idx} className={styles.paramBox}>
                <Text className={styles.pLabel}>{p.label}</Text>
                <Text className={styles.pValue}>{p.value}</Text>
                <Text className={styles.pRange}>{p.range}</Text>
              </View>
            ))}
          </View>

          <View className={styles.cardTitle} style={{ marginTop: '8rpx' }}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🔄</Text>
              <Text>灌装流水线进度</Text>
            </View>
          </View>
          <View className={styles.processBar}>
            {processSteps.map((step, idx) => (
              <View key={idx} className={`${styles.pStep} ${styles[step.status]}`}>
                <View className={styles.stepDot}>{step.icon}</View>
                <Text className={styles.stepName}>{step.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📅</Text>
              <Text>批次保质管理</Text>
            </View>
          </View>
          <View className={styles.infoList}>
            {shelfInfo.map((item, idx) => (
              <View key={idx} className={`${styles.infoRow} ${item.highlight ? styles.highlight : ''}`}>
                <Text className={styles.infoLabel}>{item.label}</Text>
                <Text className={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🔍</Text>
              <Text>出厂质检报告</Text>
            </View>
            <Text className={styles.moreLink}>查看完整PDF</Text>
          </View>
          <View className={styles.qaList}>
            {qaItems.map((item, idx) => (
              <View key={idx} className={styles.qaItem}>
                <View className={`${styles.qaIcon} ${styles[item.type]}`}>
                  <Text>{item.icon}</Text>
                </View>
                <View className={styles.qaContent}>
                  <Text className={styles.qaTitle}>{item.title}</Text>
                  <Text className={styles.qaDetail}>{item.detail}</Text>
                </View>
                <Text className={`${styles.qaResult} ${styles[item.type]}`}>{item.result}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <View className={styles.actionBar}>
        <Button className={`${styles.btn} ${styles.secondary}`} onClick={handleRecord}>
          质检录入
        </Button>
        <Button className={`${styles.btn} ${styles.primary}`} onClick={handleComplete}>
          完成批次 → 入库
        </Button>
      </View>
    </View>
  );
};

export default FillingDetailPage;
