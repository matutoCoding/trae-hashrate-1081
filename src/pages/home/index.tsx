import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatusCard from '@/components/StatusCard';
import MetricCard from '@/components/MetricCard';
import { mockDashboardStats, mockProcessEntries, mockAlerts, mockBatches } from '@/data/mockHome';
import { formatMoney, formatDate } from '@/utils/format';

const HomePage: React.FC = () => {
  const [stats] = useState(mockDashboardStats);
  const [processEntries] = useState(mockProcessEntries);
  const [alerts] = useState(mockAlerts);
  const [batches] = useState(mockBatches);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  });

  const handleProcessClick = (key: string) => {
    console.log('[Home] Click process:', key);
    const routeMap: Record<string, string> = {
      steaming: '/pages/steaming-detail/index',
      alcohol: '/pages/fermentation/index',
      acetate: '/pages/fermentation/index',
      turning: '/pages/turning/index',
      leaching: '/pages/bottling/index',
      aging: '/pages/bottling/index',
      filling: '/pages/bottling/index',
      sales: '/pages/sales/index'
    };
    const route = routeMap[key];
    if (route) {
      Taro.navigateTo({ url: route }).catch(() => {
        Taro.switchTab({ url: route });
      });
    }
  };

  const handleAlertClick = (alert: typeof alerts[0]) => {
    console.log('[Home] Click alert:', alert.id);
    Taro.navigateTo({ url: '/pages/acetate-detail/index' });
  };

  const handleBatchClick = (batchId: string) => {
    console.log('[Home] Click batch:', batchId);
    Taro.navigateTo({ url: '/pages/batch-detail/index' });
  };

  const handleAddBatch = () => {
    console.log('[Home] Add new batch');
    Taro.showToast({ title: '新建批次功能', icon: 'none' });
  };

  return (
    <View className="pageContainer">
      <View className={styles.headerSection}>
        <Text className={styles.greeting}>早上好，李师傅 👋</Text>
        <Text className={styles.title}>醋厂生产管理系统</Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.totalBatches}</Text>
            <Text className={styles.statLabel}>总批次</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.inProgressBatches}</Text>
            <Text className={styles.statLabel}>生产中</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.todayTasks}</Text>
            <Text className={styles.statLabel}>今日任务</Text>
          </View>
        </View>
      </View>

      <View className={styles.metricRow}>
        <MetricCard icon="⚠️" value={stats.warningCount} label="异常告警" colorType="warning" />
        <MetricCard icon="🏭" value={`${stats.monthlyProduction}L`} label="本月产量" colorType="primary" />
        <MetricCard icon="💰" value={formatMoney(stats.monthlySales).slice(0, 7) + '万'} label="本月销售" colorType="success" />
        <MetricCard icon="📈" value="8.6%" label="产量增幅" colorType="info" />
      </View>

      <View className="sectionTitle">
        <Text>工艺流程</Text>
        <Text className={styles.moreText}>查看全部</Text>
      </View>
      <View className={styles.processGrid}>
        {processEntries.map((entry) => (
          <StatusCard
            key={entry.key}
            icon={entry.icon}
            title={entry.name}
            description={entry.description}
            count={entry.count}
            status={entry.status}
            iconBgType={entry.status === 'warning' ? 'warning' : entry.status === 'completed' ? 'success' : 'primary'}
            onClick={() => handleProcessClick(entry.key)}
          />
        ))}
      </View>

      <View className={styles.alertSection}>
        <View className="sectionTitle">
          <Text>异常提醒</Text>
          <Text className={styles.moreText}>共 {alerts.length} 条</Text>
        </View>
        <View className={styles.alertList}>
          {alerts.map((alert) => (
            <View
              key={alert.id}
              className={classnames(styles.alertCard, styles[alert.type])}
              onClick={() => handleAlertClick(alert)}
            >
              <View className={classnames(styles.alertIcon, styles[alert.type])}>
                <Text>{alert.type === 'warning' ? '⚠️' : alert.type === 'error' ? '❌' : 'ℹ️'}</Text>
              </View>
              <View className={styles.alertContent}>
                <Text className={styles.alertTitle}>{alert.title}</Text>
                <Text className={styles.alertDesc}>{alert.content}</Text>
                <View className={styles.alertMeta}>
                  <Text>批次：{alert.batchNo}</Text>
                  <Text>时间：{alert.time.split(' ')[1]}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.batchSection}>
        <View className="sectionTitle">
          <Text>生产批次</Text>
          <Text className={styles.moreText}>全部批次</Text>
        </View>
        {batches.map((batch) => (
          <View
            key={batch.id}
            className={styles.batchCard}
            onClick={() => handleBatchClick(batch.id)}
          >
            <View className={styles.batchHeader}>
              <View className={styles.batchInfo}>
                <Text className={styles.productName}>{batch.productName}</Text>
                <Text className={styles.batchNo}>批次号：{batch.batchNo}</Text>
              </View>
              <View className={classnames(styles.stageTag, {
                [styles.inProgress]: batch.status === 'in_progress',
                [styles.completed]: batch.status === 'completed',
                [styles.warning]: batch.status === 'warning'
              })}>
                <Text>{batch.currentStage}</Text>
              </View>
            </View>
            <View className={styles.progressArea}>
              <View className={styles.progressLabel}>
                <Text>生产进度</Text>
                <Text className={styles.progressText}>{batch.progress}%</Text>
              </View>
              <View className={styles.progressBar}>
                <View className={styles.progressFill} style={{ width: `${batch.progress}%` }} />
              </View>
            </View>
            <View className={styles.batchFooter}>
              <Text>创建时间：{formatDate(batch.createTime)}</Text>
              <Text>查看详情 →</Text>
            </View>
          </View>
        ))}

        <Button className={styles.addBtn} onClick={handleAddBatch}>
          + 新建生产批次
        </Button>
      </View>
    </View>
  );
};

export default HomePage;
