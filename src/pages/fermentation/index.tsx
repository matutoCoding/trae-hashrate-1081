import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import BatchTag from '@/components/BatchTag';
import DataChart from '@/components/DataChart';
import { mockAlcoholFermentations, mockAcetateFermentations } from '@/data/mockFermentation';
import { formatNumber } from '@/utils/format';

type TabType = 'alcohol' | 'acetate';

const FermentationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('acetate');
  const [alcoholList] = useState(mockAlcoholFermentations);
  const [acetateList] = useState(mockAcetateFermentations);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 800);
  });

  const summary = useMemo(() => {
    if (activeTab === 'alcohol') {
      return {
        total: alcoholList.length,
        inProgress: alcoholList.filter(f => f.status === 'in_progress').length,
        completed: alcoholList.filter(f => f.status === 'completed').length,
        warning: alcoholList.filter(f => f.status === 'warning' || f.status === 'error').length
      };
    }
    return {
      total: acetateList.length,
      inProgress: acetateList.filter(f => f.status === 'in_progress').length,
      completed: acetateList.filter(f => f.status === 'completed').length,
      warning: acetateList.filter(f => f.status === 'warning' || f.status === 'error').length
    };
  }, [activeTab, alcoholList, acetateList]);

  const chartData = useMemo(() => {
    if (activeTab === 'acetate') {
      const target = acetateList.find(f => f.status === 'warning') || acetateList[0];
      if (target) {
        const len = Math.min(target.acidRecords.length, 7);
        return target.acidRecords.slice(-len).map((r, i) => ({
          label: `D${i + 1}`,
          values: [
            { key: 'temp', value: target.tempRecords[i * 2]?.value || 38 },
            { key: 'acid', value: r.value }
          ]
        }));
      }
    } else {
      const target = alcoholList[0];
      if (target) {
        const len = Math.min(target.currentDay * 2, 12);
        return target.tempRecords.slice(0, len).map((r, i) => ({
          label: i % 2 === 0 ? `D${Math.floor(i / 2) + 1}A` : `D${Math.floor(i / 2) + 1}P`,
          values: [
            { key: 'temp', value: r.value },
            { key: 'acid', value: 0 }
          ]
        }));
      }
    }
    return [];
  }, [activeTab, alcoholList, acetateList]);

  const handleCardClick = (id: string, type: TabType) => {
    console.log('[Fermentation] Click:', type, id);
    Taro.navigateTo({
      url: type === 'alcohol' ? '/pages/alcohol-detail/index' : '/pages/acetate-detail/index'
    });
  };

  const handleAdd = () => {
    console.log('[Fermentation] Add new');
    Taro.showToast({ title: '新建发酵批次', icon: 'none' });
  };

  const handleRecord = () => {
    console.log('[Fermentation] Record data');
    Taro.showToast({ title: '记录监测数据', icon: 'none' });
  };

  return (
    <View className="pageContainer">
      <View className={styles.tabBar}>
        <View
          className={classnames(styles.tabItem, activeTab === 'alcohol' && styles.active)}
          onClick={() => setActiveTab('alcohol')}
        >
          <Text>酒精发酵</Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'acetate' && styles.active)}
          onClick={() => setActiveTab('acetate')}
        >
          <Text>醋酸醅发酵</Text>
        </View>
      </View>

      <View className={styles.summaryRow}>
        <View className={styles.summaryItem}>
          <Text className={styles.value}>{summary.total}</Text>
          <Text className={styles.label}>总批次</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.value}>{summary.inProgress}</Text>
          <Text className={styles.label}>发酵中</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.value}>{summary.completed}</Text>
          <Text className={styles.label}>已完成</Text>
        </View>
        <View className={styles.summaryItem}>
          <Text className={styles.value} style={{ color: summary.warning > 0 ? '#DAA520' : undefined }}>
            {summary.warning}
          </Text>
          <Text className={styles.label}>异常</Text>
        </View>
      </View>

      <View className={styles.chartSection}>
        <DataChart
          title={activeTab === 'acetate' ? '醅温醅酸趋势' : '酒醪温度趋势'}
          data={chartData}
          maxValue={activeTab === 'acetate' ? 50 : 50}
          type="bar"
          seriesConfig={activeTab === 'acetate' ? [
            { key: 'temp', label: '醅温(℃)', color: 'temp' },
            { key: 'acid', label: '酸度(%)', color: 'acid' }
          ] : [
            { key: 'temp', label: '温度(℃)', color: 'temp' }
          ]}
        />
      </View>

      <View className="sectionTitle">
        <Text>{activeTab === 'alcohol' ? '酒精发酵批次' : '醋酸醅批次'}</Text>
      </View>

      {(activeTab === 'alcohol' ? alcoholList : acetateList).map((item: any) => {
        const progress = Math.round((item.currentDay / item.fermentDays) * 100);
        return (
          <View
            key={item.id}
            className={styles.fermentCard}
            onClick={() => handleCardClick(item.id, activeTab)}
          >
            <View className={styles.cardHeader}>
              <View className={styles.headerLeft}>
                <View className={styles.titleRow}>
                  <Text className={styles.productName}>
                    {activeTab === 'alcohol' ? '酒精发酵' : '醋酸发酵'}
                  </Text>
                  <View className={classnames(styles.statusBadge, {
                    [styles.inProgress]: item.status === 'in_progress',
                    [styles.completed]: item.status === 'completed',
                    [styles.warning]: item.status === 'warning',
                    [styles.pending]: item.status === 'pending'
                  })}>
                    <Text>{item.status === 'completed' ? '已完成' : item.status === 'warning' ? '需关注' : '发酵中'}</Text>
                  </View>
                </View>
                <View className={styles.metaRow}>
                  <View className={styles.metaItem}>
                    <BatchTag batchNo={item.batchNo} />
                  </View>
                  <View className={styles.metaItem}>
                    <Text>👤</Text>
                    <Text>{item.operator}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className={styles.metricsSection}>
              {activeTab === 'acetate' ? (
                <>
                  <View className={classnames(styles.metricBox, styles.temp)}>
                    <Text className={styles.metricValue}>{formatNumber(item.currentTemp, 1)}℃</Text>
                    <Text className={styles.metricLabel}>当前醅温</Text>
                  </View>
                  <View className={classnames(styles.metricBox, styles.acid)}>
                    <Text className={styles.metricValue}>{formatNumber(item.currentAcid, 2)}%</Text>
                    <Text className={styles.metricLabel}>当前酸度</Text>
                  </View>
                  <View className={classnames(styles.metricBox, styles.day)}>
                    <Text className={styles.metricValue}>{item.currentDay}/{item.fermentDays}</Text>
                    <Text className={styles.metricLabel}>发酵天数</Text>
                  </View>
                </>
              ) : (
                <>
                  <View className={classnames(styles.metricBox, styles.temp)}>
                    <Text className={styles.metricValue}>{formatNumber(item.fermentStartTemp, 0)}℃</Text>
                    <Text className={styles.metricLabel}>起始温度</Text>
                  </View>
                  <View className={classnames(styles.metricBox, styles.alcohol)}>
                    <Text className={styles.metricValue}>{formatNumber(item.alcoholContent, 1)}°</Text>
                    <Text className={styles.metricLabel}>酒精度</Text>
                  </View>
                  <View className={classnames(styles.metricBox, styles.day)}>
                    <Text className={styles.metricValue}>{item.currentDay}/{item.fermentDays}</Text>
                    <Text className={styles.metricLabel}>发酵天数</Text>
                  </View>
                </>
              )}
            </View>

            <View className={styles.progressSection}>
              <View className={styles.progressHeader}>
                <Text className={styles.progressLabel}>发酵进度</Text>
                <Text className={styles.progressValue}>{progress}%</Text>
              </View>
              <View className={styles.progressBar}>
                <View className={styles.fill} style={{ width: `${progress}%` }} />
              </View>
            </View>
          </View>
        );
      })}

      <View style={{ height: 160 }} />

      <View className={styles.quickActions}>
        <Button className={classnames(styles.actionBtn, styles.secondary)} onClick={handleRecord}>
          📝 记录数据
        </Button>
        <Button className={classnames(styles.actionBtn, styles.primary)} onClick={handleAdd}>
          + 新建批次
        </Button>
      </View>
    </View>
  );
};

export default FermentationPage;
