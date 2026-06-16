import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import BatchTag from '@/components/BatchTag';
import { mockLeachingRecords, mockAgingRecords, mockFillingRecords } from '@/data/mockBottling';
import { formatDate, formatNumber } from '@/utils/format';

type TabType = 'leaching' | 'aging' | 'filling';

const BottlingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('leaching');
  const [leachingList] = useState(mockLeachingRecords);
  const [agingList] = useState(mockAgingRecords);
  const [fillingList] = useState(mockFillingRecords);

  usePullDownRefresh(() => {
    setTimeout(() => Taro.stopPullDownRefresh(), 800);
  });

  const overview = useMemo(() => {
    const totalLeaching = leachingList.reduce((s, l) => s + l.vinegarVolume, 0);
    const totalAging = agingList.reduce((s, a) => s + a.volume, 0);
    const totalFilling = fillingList.reduce((s, f) => s + f.bottleCount * f.bottleVolume / 1000, 0);
    const avgQuality = Math.round(
      agingList.filter(a => a.qualityScore).reduce((s, a) => s + (a.qualityScore || 0), 0) /
      Math.max(agingList.filter(a => a.qualityScore).length, 1)
    );
    return { totalLeaching, totalAging, totalFilling, avgQuality };
  }, [leachingList, agingList, fillingList]);

  const handleCardClick = (type: TabType, id: string) => {
    console.log('[Bottling] Click:', type, id);
    const routes: Record<TabType, string> = {
      leaching: '/pages/leaching-detail/index',
      aging: '/pages/aging-detail/index',
      filling: '/pages/filling-detail/index'
    };
    Taro.navigateTo({ url: routes[type] });
  };

  const handleAdd = () => {
    console.log('[Bottling] Add new');
    const titles: Record<TabType, string> = {
      leaching: '新建淋醋任务',
      aging: '入缸陈酿登记',
      filling: '创建灌装计划'
    };
    Taro.showToast({ title: titles[activeTab], icon: 'none' });
  };

  return (
    <View className="pageContainer">
      <View className={styles.segmented}>
        <View
          className={classnames(styles.segItem, activeTab === 'leaching' && styles.active)}
          onClick={() => setActiveTab('leaching')}
        >
          <Text className={styles.icon}>💧</Text>
          <Text>淋醋管理</Text>
        </View>
        <View
          className={classnames(styles.segItem, activeTab === 'aging' && styles.active)}
          onClick={() => setActiveTab('aging')}
        >
          <Text className={styles.icon}>☀️</Text>
          <Text>陈酿管理</Text>
        </View>
        <View
          className={classnames(styles.segItem, activeTab === 'filling' && styles.active)}
          onClick={() => setActiveTab('filling')}
        >
          <Text className={styles.icon}>🏺</Text>
          <Text>灌装包装</Text>
        </View>
      </View>

      <View className={styles.overviewCards}>
        <View className={styles.overviewCard}>
          <Text className={styles.iconBg}>💧</Text>
          <Text className={styles.label}>累计淋醋</Text>
          <Text className={styles.value}>{overview.totalLeaching}</Text>
          <Text className={styles.unit}>升（L）</Text>
          <View className={classnames(styles.trend, styles.up)}>
            <Text>↑ 本周 +12.5%</Text>
          </View>
        </View>
        <View className={styles.overviewCard}>
          <Text className={styles.iconBg}>☀️</Text>
          <Text className={styles.label}>陈酿存量</Text>
          <Text className={styles.value}>{overview.totalAging / 1000}k</Text>
          <Text className={styles.unit}>升（L）</Text>
          <View className={classnames(styles.trend, styles.up)}>
            <Text>⭐ 品质 {overview.avgQuality}分</Text>
          </View>
        </View>
      </View>

      {activeTab === 'leaching' && (
        <>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>淋醋记录</Text>
            <Text className={styles.sectionAction} onClick={() => Taro.showToast({ title: '筛选', icon: 'none' })}>
              筛选
            </Text>
          </View>
          {leachingList.map(item => (
            <View
              key={item.id}
              className={styles.listCard}
              onClick={() => handleCardClick('leaching', item.id)}
            >
              <View className={styles.cardTop}>
                <View className={styles.cardTitle}>
                  <View className={styles.name}>
                    <Text className={styles.icon}>💧</Text>
                    <Text className={styles.text}>
                      第{item.leachingLevel}级套淋
                      {item.leachingLevel === 1 ? '（头淋）' : item.leachingLevel === 2 ? '（二淋）' : '（三淋）'}
                    </Text>
                  </View>
                  <View className={styles.subMeta}>
                    <BatchTag batchNo={item.batchNo} />
                    <Text>👤 {item.operator}</Text>
                  </View>
                </View>
                <View className={classnames(styles.statusTag, {
                  [styles.inProgress]: item.status === 'in_progress',
                  [styles.completed]: item.status === 'completed',
                  [styles.warning]: item.status === 'warning',
                  [styles.pending]: item.status === 'pending'
                })}>
                  <Text>{item.status === 'completed' ? '已完成' : item.status === 'in_progress' ? '淋取中' : '待开始'}</Text>
                </View>
              </View>
              <View className={styles.dataGrid}>
                <View className={styles.dataItem}>
                  <Text className={styles.dLabel}>加水量</Text>
                  <Text className={styles.dValue}>{item.waterAmount}L</Text>
                </View>
                <View className={styles.dataItem}>
                  <Text className={styles.dLabel}>浸泡时长</Text>
                  <Text className={styles.dValue}>{item.soakTime}h</Text>
                </View>
                <View className={styles.dataItem}>
                  <Text className={styles.dLabel}>取醋量</Text>
                  <Text className={styles.dValue} style={{ color: item.vinegarVolume > 0 ? '#2E8B57' : '#C9B8A8' }}>
                    {item.vinegarVolume > 0 ? `${item.vinegarVolume}L` : '--'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </>
      )}

      {activeTab === 'aging' && (
        <>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>陈酿管理</Text>
            <Text className={styles.sectionAction}>{agingList.length} 缸在酿</Text>
          </View>
          {agingList.map(item => {
            const progress = Math.round((item.currentDays / item.agingDays) * 100);
            const circumference = 2 * Math.PI * 52;
            const offset = circumference * (1 - progress / 100);
            return (
              <View
                key={item.id}
                className={classnames(styles.listCard, styles.agingCard)}
                onClick={() => handleCardClick('aging', item.id)}
              >
                <View className={styles.progressCircle}>
                  <View className={styles.bgCircle} />
                  <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#D2B48C" strokeWidth="8"
                      strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
                  </svg>
                  <Text className={styles.percentText}>{progress}%</Text>
                </View>
                <View className={styles.agingInfo}>
                  <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View>
                      <Text className={styles.agingTitle}>{item.vinegarType}</Text>
                      <View style={{ marginTop: 4, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <BatchTag batchNo={item.batchNo} />
                        <Text style={{ fontSize: 24, color: '#9B7B6B' }}>📍 {item.containerNo}</Text>
                      </View>
                    </View>
                    {item.qualityScore && (
                      <View className={styles.qualityBadge}>⭐ {item.qualityScore}分</View>
                    )}
                  </View>
                  <View className={styles.agingMeta} style={{ marginTop: 12 }}>
                    <Text>陈酿：{item.currentDays}/{item.agingDays} 天</Text>
                    <Text style={{ marginLeft: 16 }}>容量：{item.volume}L</Text>
                    <View style={{ marginTop: 4 }}>
                      <Text>晒露：{item.sunExposureHours}h</Text>
                      <Text style={{ marginLeft: 16 }}>倒缸：{item.pourCount}次</Text>
                      <Text style={{ marginLeft: 16 }}>入缸：{formatDate(item.startDate)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </>
      )}

      {activeTab === 'filling' && (
        <>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>灌装批次</Text>
            <Text className={styles.sectionAction}>保质期管理</Text>
          </View>
          {fillingList.map(item => (
            <View
              key={item.id}
              className={styles.listCard}
              onClick={() => handleCardClick('filling', item.id)}
            >
              <View className={styles.cardTop}>
                <View className={styles.cardTitle}>
                  <View className={styles.name}>
                    <Text className={styles.icon}>🏺</Text>
                    <Text className={styles.text}>{item.bottleType} {item.bottleVolume}ml</Text>
                  </View>
                  <View className={styles.subMeta}>
                    <BatchTag batchNo={item.batchNo} />
                    <Text>👤 {item.operator}</Text>
                  </View>
                </View>
                <View className={classnames(styles.statusTag, {
                  [styles.inProgress]: item.status === 'in_progress',
                  [styles.completed]: item.status === 'completed',
                  [styles.warning]: item.status === 'warning',
                  [styles.pending]: item.status === 'pending'
                })}>
                  <Text>
                    {item.status === 'completed' ? '已完成' :
                     item.status === 'warning' ? '检验异常' :
                     item.status === 'in_progress' ? '灌装中' : '待生产'}
                  </Text>
                </View>
              </View>

              <View className={styles.fillingStats}>
                <View className={styles.statBox}>
                  <Text className={styles.sLabel}>过滤方式</Text>
                  <Text className={styles.sValue}>{item.filtrationMethod}</Text>
                </View>
                <View className={styles.statBox}>
                  <Text className={styles.sLabel}>灌装数量</Text>
                  <Text className={styles.sValue}>{item.bottleCount}瓶</Text>
                </View>
                <View className={classnames(styles.statBox, styles.ok)}>
                  <Text className={styles.sLabel}>杀菌温度/时间</Text>
                  <Text className={styles.sValue}>{item.sterilizationTemp}℃ / {item.sterilizationTime}min</Text>
                </View>
                <View className={classnames(styles.statBox, item.sealCheckPass ? styles.ok : styles.warn)}>
                  <Text className={styles.sLabel}>封口检验</Text>
                  <Text className={styles.sValue}>{item.sealCheckPass ? '✓ 合格' : '⚠ 需复检'}</Text>
                </View>
              </View>

              <View className={styles.dataGrid}>
                <View className={styles.dataItem}>
                  <Text className={styles.dLabel}>生产日期</Text>
                  <Text className={styles.dValue}>{formatDate(item.productionDate)}</Text>
                </View>
                <View className={styles.dataItem}>
                  <Text className={styles.dLabel}>保质期</Text>
                  <Text className={styles.dValue}>{item.shelfLifeMonths}个月</Text>
                </View>
                <View className={styles.dataItem}>
                  <Text className={styles.dLabel}>到期日期</Text>
                  <Text className={styles.dValue} style={{ color: '#DAA520' }}>{formatDate(item.expiryDate)}</Text>
                </View>
              </View>
            </View>
          ))}
        </>
      )}

      <View style={{ height: 160 }} />

      <View className={styles.fixedFooter}>
        <Button className={styles.primaryBtn} onClick={handleAdd}>
          + {activeTab === 'leaching' ? '新建淋醋' : activeTab === 'aging' ? '登记入缸' : '创建灌装'}
        </Button>
      </View>
    </View>
  );
};

export default BottlingPage;
