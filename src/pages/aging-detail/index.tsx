import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { formatDate } from '@/utils/format';

const AgingDetailPage: React.FC = () => {
  const [batchInfo] = useState({
    batchNo: 'C20240815-008',
    productName: '三年陈酿老陈醋',
    level: '金标A级',
    createTime: '2024-08-15',
    location: '陈酿窖区 A-12',
    targetDays: 1095
  });

  const [progress] = useState({
    percent: 35,
    days: 384,
    total: 1095,
    startDate: '2024-08-15',
    midDate: '2025-08-15 (一年陈)',
    endDate: '2027-08-15'
  });

  const [quality] = useState([
    { label: '总酸含量', value: '6.2 g/100mL', target: '≥ 6.0', badge: 'excellent', badgeText: '优级' },
    { label: '氨基酸态氮', value: '0.28 g/100mL', target: '≥ 0.25', badge: 'good', badgeText: '达标' },
    { label: '还原糖', value: '18.5 g/L', target: '15-25', badge: 'good', badgeText: '正常' },
    { label: '色泽评分', value: '9.2 / 10', target: '≥ 8.0', badge: 'excellent', badgeText: '优质' },
    { label: '香气评分', value: '9.0 / 10', target: '≥ 8.0', badge: 'excellent', badgeText: '醇香' },
    { label: '滋味评分', value: '8.8 / 10', target: '≥ 8.0', badge: 'good', badgeText: '醇厚' }
  ]);

  const [containers] = useState([
    { name: '陶缸 T-127', volume: '500L', material: '宜兴紫砂陶', start: '2024-08-15' },
    { name: '陶缸 T-128', volume: '500L', material: '宜兴紫砂陶', start: '2024-08-15' },
    { name: '陶缸 T-129', volume: '500L', material: '宜兴紫砂陶', start: '2024-08-15' },
    { name: '橡木桶 O-056', volume: '225L', material: '法国橡木', start: '2024-09-01' }
  ]);

  const [envData] = useState([
    { icon: '🌡️', value: '16.5℃', label: '窖区温度', target: '理想: 15-20℃' },
    { icon: '💧', value: '68%', label: '相对湿度', target: '理想: 60-75%' },
    { icon: '🌬️', value: '良好', label: '通风状态', target: '每日换气2h' },
    { icon: '☀️', value: '避光', label: '光照条件', target: '无直射光' }
  ]);

  const [events] = useState([
    { day: '20', month: '2025.09', title: '首次开缸取样', desc: '开缸品尝评估，检测酸度、色泽、香气。醋液颜色明显加深，呈琥珀色，酸香醇厚。', type: '检测', by: '质检科-张工' },
    { day: '15', month: '2025.08', title: '满一周年陈酿', desc: '陈酿满365天，达到一年陈醋基础标准。综合评分8.5分，预计三年后可达9.2分以上。', type: '里程碑', by: '系统' },
    { day: '10', month: '2025.06', title: '夏季窖区检查', desc: '高温季节加强巡检，调整通风和湿度控制。所有陶缸状态良好，无渗漏。', type: '巡检', by: '陈酿组-赵师傅' },
    { day: '28', month: '2025.03', title: '倒缸合并', desc: '将T-127/128/129三缸醋液部分合并，补充橡木桶继续陈酿。', type: '操作', by: '陈酿组-李师傅' },
    { day: '15', month: '2024.08', title: '入缸开始陈酿', desc: '淋醋完成后经硅藻土过滤，装入4个陈酿容器。初始总酸5.2g/100mL，开始记录陈酿进度。', type: '入缸', by: '陈酿组-赵师傅' }
  ]);

  const [params] = useState([
    { label: '陈酿前过滤方式', value: '硅藻土过滤 + 自然澄清7天' },
    { label: '陈酿容器类型', value: '宜兴紫砂陶缸为主，法国橡木桶为辅' },
    { label: '每年倒缸次数', value: '1-2次（夏季前/后各一次）' },
    { label: '预计出成率', value: '约 92%（考虑蒸发损耗）' },
    { label: '年蒸发损耗率', value: '约 3-4%（"秦琼卖马"）' },
    { label: '定期取样频率', value: '每3个月取样检测一次' },
    { label: '目标陈酿等级', value: '三年陈 · 金标A级 · GB/T 19777标准' },
    { label: '上市预估时间', value: '2027年Q3中秋旺季前' }
  ]);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  });

  const handleCheck = () => {
    Taro.showToast({ title: '新增品质检测', icon: 'none' });
  };

  const handleNext = () => {
    Taro.showModal({
      title: '提前出缸灌装',
      content: '当前陈酿进度35%，若提前出缸灌装将按一年陈醋等级定价。是否确认提前进入灌装？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已提交流程', icon: 'success' });
        }
      }
    });
  };

  const progressDeg = (progress.percent / 100) * 360;

  return (
    <View className="pageContainer">
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.headerBanner}>
          <View className={styles.batchRow}>
            <Text className={styles.batchNo}>批次：{batchInfo.batchNo}</Text>
            <View className={styles.levelBadge}>
              <Text>🏆 {batchInfo.level}</Text>
            </View>
          </View>
          <Text className={styles.productName}>{batchInfo.productName}</Text>
          <View className={styles.metaRow}>
            <Text>📍 {batchInfo.location}</Text>
            <Text>📅 {formatDate(batchInfo.createTime)}</Text>
            <Text>⏳ 目标{batchInfo.targetDays}天</Text>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📊</Text>
              <Text>陈酿进度总览</Text>
            </View>
          </View>
          <View className={styles.progressOverview}>
            <View className={styles.ringWrap}>
              <svg width="160" height="160" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#F0E6DA" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="10"
                  strokeDasharray={`${(progress.percent / 100) * 339.292} 339.292`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B4513" />
                    <stop offset="100%" stopColor="#DAA520" />
                  </linearGradient>
                </defs>
              </svg>
              <View className={styles.progressText}>
                <Text className={styles.percent}>{progress.percent}%</Text>
                <Text className={styles.label}>陈酿进度</Text>
              </View>
            </View>
            <View className={styles.progressInfo}>
              <View className={styles.infoRow}>
                <Text className={styles.label}>已陈酿</Text>
                <Text className={styles.value}>{progress.days} 天</Text>
              </View>
              <View className={styles.infoRow}>
                <Text className={styles.label}>下一个节点</Text>
                <Text className={styles.value}>{progress.midDate}</Text>
              </View>
              <View className={styles.infoRow}>
                <Text className={styles.label}>预计完成</Text>
                <Text className={styles.value}>{progress.endDate}</Text>
              </View>
              <View className={styles.infoRow}>
                <Text className={styles.label}>剩余时间</Text>
                <Text className={styles.value} style={{ color: '#DAA520' }}>{progress.total - progress.days} 天</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🏅</Text>
              <Text>品质评分</Text>
            </View>
            <Text className={styles.moreLink}>趋势分析</Text>
          </View>
          <View className={styles.qualityGrid}>
            {quality.map((item, idx) => (
              <View key={idx} className={styles.qualityItem}>
                <View className={styles.qHeader}>
                  <Text className={styles.qLabel}>{item.label}</Text>
                  <Text className={`${styles.qBadge} ${styles[item.badge]}`}>{item.badgeText}</Text>
                </View>
                <Text className={styles.qValue}>{item.value}</Text>
                <Text className={styles.qTarget}>目标范围: {item.target}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🏺</Text>
              <Text>陈酿环境</Text>
            </View>
          </View>
          <View className={styles.envRow}>
            {envData.slice(0, 2).map((item, idx) => (
              <View key={idx} className={styles.envItem}>
                <Text className={styles.eIcon}>{item.icon}</Text>
                <Text className={styles.eValue}>{item.value}</Text>
                <Text className={styles.eLabel}>{item.label}</Text>
                <Text className={styles.eTarget}>{item.target}</Text>
              </View>
            ))}
          </View>
          <View className={styles.envRow}>
            {envData.slice(2, 4).map((item, idx) => (
              <View key={idx} className={styles.envItem}>
                <Text className={styles.eIcon}>{item.icon}</Text>
                <Text className={styles.eValue}>{item.value}</Text>
                <Text className={styles.eLabel}>{item.label}</Text>
                <Text className={styles.eTarget}>{item.target}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>🫙</Text>
              <Text>陈酿容器 ({containers.length})</Text>
            </View>
          </View>
          <View className={styles.containerList}>
            {containers.map((item, idx) => (
              <View key={idx} className={styles.containerCard}>
                <Text className={styles.cName}>{item.name}</Text>
                <View className={styles.cDetails}>
                  <View className={styles.cRow}>容量：<span>{item.volume}</span></View>
                  <View className={styles.cRow}>材质：<span>{item.material}</span></View>
                  <View className={styles.cRow}>入缸：<span>{item.start}</span></View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📜</Text>
              <Text>陈酿大事记</Text>
            </View>
            <Text className={styles.moreLink}>完整日志</Text>
          </View>
          <View className={styles.eventList}>
            {events.map((item, idx) => (
              <View key={idx} className={styles.eventItem}>
                <View className={styles.eDate}>
                  <Text className={styles.eDay}>{item.day}</Text>
                  <Text className={styles.eMonth}>{item.month}</Text>
                </View>
                <View className={styles.eContent}>
                  <Text className={styles.eTitle}>{item.title}</Text>
                  <Text className={styles.eDesc}>{item.desc}</Text>
                  <View className={styles.eMeta}>
                    <Text>🏷️ {item.type}</Text>
                    <Text>👷 {item.by}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📋</Text>
              <Text>陈酿参数配置</Text>
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
        <Button className={`${styles.btn} ${styles.secondary}`} onClick={handleCheck}>
          品质检测
        </Button>
        <Button className={`${styles.btn} ${styles.primary}`} onClick={handleNext}>
          提前出缸灌装
        </Button>
      </View>
    </View>
  );
};

export default AgingDetailPage;
