import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { formatDate, formatDateTime, formatMoney } from '@/utils/format';
import {
  findBatchDetailById,
  findBatchDetailByBatchNo,
  BatchDetailInfo,
  BatchStageItem
} from '@/data/mockHome';

const stageDetailMap: Record<string, string> = {
  steaming: '/pages/steaming-detail/index',
  alcohol: '/pages/alcohol-detail/index',
  acetate: '/pages/acetate-detail/index',
  turning: '/pages/turning-detail/index',
  leaching: '/pages/leaching-detail/index',
  aging: '/pages/aging-detail/index',
  filling: '/pages/filling-detail/index'
};

const stageDescriptions = [
  '高粱、麸皮蒸料润水，确保糊化度达标，冷却后入发酵池',
  '接种SY-202酿酒酵母，控温糖化酒精发酵，酒精度≥6.5%',
  '拌入成熟醋醅+沪酿1.01醋酸菌，分层入醅池，疏松度适中',
  '每日定时翻醅倒醅，调节温度、氧气，上热中温下凉控制',
  '成熟醋醅一淋、二淋、三淋套淋法取液，醋液色泽棕亮',
  '新醋入宜兴紫砂陶缸，日晒夜露陈酿，酯化增香提色',
  '硅藻土过滤+板框过滤+自然澄清7天，去除沉淀物',
  '洗瓶→灌装→巴氏杀菌→旋盖封盖→贴标喷码→装箱入库',
  '13项出厂质检（总酸、还原糖、菌落总数等），合格放行'
];

const BatchDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params?.id || 'b1';
  const batchNoParam = router.params?.batchNo;

  const [detail, setDetail] = useState<BatchDetailInfo | null>(() => {
    let found: BatchDetailInfo | undefined;
    if (batchNoParam) found = findBatchDetailByBatchNo(batchNoParam);
    if (!found) found = findBatchDetailById(id);
    if (!found) found = findBatchDetailById('b1');
    return found || null;
  });

  useEffect(() => {
    if (!detail) Taro.showToast({ title: '批次不存在', icon: 'none' });
  }, [detail]);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 800);
  });

  const createEndDate = useMemo(() => {
    if (!detail) return '';
    const d = new Date(detail.createTime.replace(/-/g, '/'));
    d.setDate(d.getDate() + detail.cycleDays);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }, [detail]);

  const handleStageClick = (stage: BatchStageItem) => {
    if (!detail) return;
    if (stage.status === 'pending') {
      Taro.showToast({ title: `${stage.name} 尚未开始`, icon: 'none' });
      return;
    }
    const route = stageDetailMap[stage.key];
    if (route) {
      Taro.navigateTo({ url: `${route}?batchId=${detail.id}&batchNo=${detail.batchNo}` });
    } else {
      Taro.showToast({ title: `${stage.name} 详情即将上线`, icon: 'none' });
    }
  };

  const handleReport = () => {
    Taro.showToast({ title: `生成 ${detail?.batchNo} 批次报告`, icon: 'none' });
  };

  const handleAction = () => {
    Taro.showActionSheet({
      itemList: ['新增任务', '分配人员', '调整计划', '暂停批次'],
      success: (res) => {
        Taro.showToast({ title: `已选择: 选项${res.tapIndex + 1}`, icon: 'none' });
      }
    });
  };

  if (!detail) {
    return (
      <View className="pageContainer" style={{ padding: 40, alignItems: 'center', justifyContent: 'center' }}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const headerColorMap: Record<string, string> = {
    completed: 'linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)',
    warning: 'linear-gradient(135deg, #CD5C5C 0%, #E07A5F 100%)',
    pending: 'linear-gradient(135deg, #696969 0%, #808080 100%)'
  };
  const headerBg = headerColorMap[detail.statusType] || 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)';

  const statusBadgeClass =
    detail.statusType === 'completed' ? styles.completedBadge :
    detail.statusType === 'warning' ? styles.warningBadge : styles.progressBadge;

  return (
    <View className="pageContainer">
      <ScrollView scrollY style={{ height: '100vh' }}>
        <View className={styles.headerBanner} style={{ background: headerBg }}>
          <View className={styles.batchRow}>
            <Text className={styles.batchNo}>批次号 {detail.batchNo}</Text>
            <View className={`${styles.statusBadge} ${statusBadgeClass}`}>
              <Text>{detail.status}</Text>
            </View>
          </View>
          <Text className={styles.productName}>{detail.productName} · {detail.grade}</Text>
          <View className={styles.metaRow}>
            <Text>📦 {detail.productSpec}</Text>
            <Text>🏷️ {detail.grade}</Text>
            <Text>📅 创建：{formatDate(detail.createTime)}</Text>
          </View>

          <View className={styles.progressSection}>
            <View className={styles.progressHeader}>
              <Text className={styles.label}>总体进度</Text>
              <Text className={styles.value}>
                {detail.progress}% · {detail.progress === 100 ? '全部工序已完成' : `进行中（第${detail.currentStageIndex + 1}/${detail.stages.length}道工序：${detail.currentStage}）`}
              </Text>
            </View>
            <View className={styles.progressBar}>
              <View className={styles.fill} style={{ width: `${detail.progress}%` }} />
            </View>
            <View className={styles.progressLabels}>
              <Text>开始 {formatDate(detail.createTime)}</Text>
              <Text>预计完成 {createEndDate}</Text>
            </View>
          </View>
        </View>

        {detail.alerts && detail.alerts.length > 0 && (
          <View style={{ padding: '24rpx 32rpx 0' }}>
            {detail.alerts.map((a, i) => (
              <View key={i} style={{
                padding: '20rpx 24rpx',
                marginBottom: 16,
                borderRadius: 12,
                background: a.type === 'warning' ? 'rgba(205,92,92,0.08)' : 'rgba(61,90,128,0.08)',
                borderLeft: `6rpx solid ${a.type === 'warning' ? '#CD5C5C' : '#3D5A80'}`
              }}>
                <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={{ fontSize: 26, fontWeight: 700, color: a.type === 'warning' ? '#CD5C5C' : '#3D5A80' }}>
                    {a.type === 'warning' ? '⚠️ ' : '💡 '}{a.title}
                  </Text>
                  <Text style={{ fontSize: 20, color: '#888' }}>{a.time}</Text>
                </View>
                <Text style={{ fontSize: 24, color: '#555', lineHeight: '1.6' }}>{a.content}</Text>
              </View>
            ))}
          </View>
        )}

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📊</Text>
              <Text>核心数据</Text>
            </View>
          </View>
          <View className={styles.coreMetrics}>
            {detail.metrics.map((item, idx) => (
              <View key={idx} className={styles.metricBox}>
                <Text className={styles.mValue} style={{ color: item.color }}>
                  {item.value}
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
              <Text>工艺流程进度 ({detail.stages.length}道工序)</Text>
            </View>
            <Text className={styles.moreLink}>流程图</Text>
          </View>
          <View className={styles.processTimeline}>
            {detail.stages.map((stage, idx) => (
              <View key={idx} className={styles.stageItem} onClick={() => handleStageClick(stage)}>
                <View className={`${styles.stageIcon} ${styles[stage.status]}`}>
                  <Text>{stage.icon}</Text>
                </View>
                <View className={styles.stageContent}>
                  <View className={styles.stageHeader}>
                    <Text className={styles.stageName}>
                      {idx + 1}. {stage.name}
                      {stage.status === 'doing' && (
                        <Text style={{ marginLeft: 12, fontSize: 20, padding: '2rpx 12rpx', background: '#DAA520', color: '#fff', borderRadius: 6 }}>
                          当前工序
                        </Text>
                      )}
                    </Text>
                    <Text className={styles.stageTime}>
                      {stage.date || '待开始'}
                    </Text>
                  </View>
                  <Text className={styles.stageDesc}>
                    {stageDescriptions[idx]}
                  </Text>
                  <View className={styles.stageTags}>
                    <Text className={`${styles.tag} ${stage.status === 'done' ? styles.doneTag : stage.status === 'doing' ? styles.doingTag : styles.pendingTag}`}>
                      {stage.status === 'done' ? '✅ 已完成' : stage.status === 'doing' ? '⏳ 执行中' : '⏸️ 待开始'}
                    </Text>
                    {stage.detailRoute && stage.status !== 'pending' && (
                      <Text className={`${styles.tag} ${styles.detailBtn}`}>
                        🔍 查看详情 →
                      </Text>
                    )}
                    {stage.remark && (
                      <Text className={styles.tag} style={{ color: '#666' }}>
                        {stage.remark}
                      </Text>
                    )}
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
            <View className={styles.infoCard}>
              <Text className={styles.infoTitle}>🌾 原料配置</Text>
              {detail.rawMaterials.map((r, i) => (
                <View key={i} className={styles.infoRow}>
                  <Text className={styles.label}>{r.name}</Text>
                  <Text className={styles.value}>{r.qty} <Text style={{ fontSize: 20, color: '#999' }}> · {r.origin}</Text></Text>
                </View>
              ))}
            </View>

            <View className={styles.infoCard}>
              <Text className={styles.infoTitle}>👷 团队人员</Text>
              <View>
                <View style={{
                  display: 'flex', alignItems: 'center',
                  padding: '16rpx 20rpx', background: '#FFF8F0',
                  borderRadius: 10, border: '1rpx solid #E8C898', marginBottom: 12
                }}>
                  <Text style={{
                    width: 60, height: 60, borderRadius: 30,
                    background: '#8B4513', color: '#fff',
                    fontWeight: 700, fontSize: 28, textAlign: 'center',
                    lineHeight: '60rpx', marginRight: 16
                  }}>{detail.team.master.charAt(0)}</Text>
                  <View>
                    <Text style={{ fontSize: 26, fontWeight: 700, color: '#8B4513' }}>{detail.team.master}</Text>
                    <Text style={{ fontSize: 22, color: '#999' }}>制醋班组 · 组长/总负责</Text>
                  </View>
                </View>
                <View className={styles.staffAvatars}>
                  {detail.team.assistants.map((p, pIdx) => (
                    <View key={pIdx} className={styles.aItem}>
                      <Text>{p.charAt(0)}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ marginTop: 12, fontSize: 22, color: '#9B7B6B' }}>
                  共 {detail.team.total} 人 · {detail.team.assistants.join('、')}
                </View>
              </View>
            </View>

            <View className={styles.infoCard}>
              <Text className={styles.infoTitle}>💰 成本明细</Text>
              {detail.costItems.map((c, i) => (
                <View key={i} className={styles.infoRow}>
                  <Text className={styles.label}>{c.label}</Text>
                  <Text className={styles.value} style={{
                    fontWeight: c.label.includes('总成本') ? 700 : 400,
                    color: c.label.includes('总成本') ? '#8B4513' : '#333'
                  }}>{c.value}</Text>
                </View>
              ))}
            </View>

            <View className={styles.infoCard}>
              <Text className={styles.infoTitle}>📊 质量目标</Text>
              {detail.qualityItems.map((q, i) => (
                <View key={i} className={styles.infoRow}>
                  <Text className={styles.label}>{q.label}</Text>
                  <Text className={styles.value} style={{
                    fontWeight: q.value.includes('✅') ? 700 : 400,
                    color: q.value.includes('✅') ? '#2E8B57' : '#333'
                  }}>{q.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.cardTitle}>
            <View className={styles.titleLeft}>
              <Text className={styles.titleIcon}>📋</Text>
              <Text>批次信息汇总</Text>
            </View>
          </View>
          <View style={{ padding: 8 }}>
            <View className={styles.infoRow}>
              <Text className={styles.label}>批次号</Text>
              <Text className={styles.value} style={{ fontWeight: 700, color: '#8B4513', letterSpacing: 1 }}>{detail.batchNo}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.label}>产品名称</Text>
              <Text className={styles.value}>{detail.productName} / {detail.productSpec}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.label}>创建时间</Text>
              <Text className={styles.value}>{formatDateTime(detail.createTime)}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.label}>班组负责</Text>
              <Text className={styles.value}>{detail.team.master}（{detail.team.total}人）</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.label}>质量目标说明</Text>
              <Text className={styles.value}>{detail.qualityTarget}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <View className={styles.actionBar}>
        <Button className={`${styles.btn} ${styles.outline}`} onClick={handleReport}>
          📄 批次报告
        </Button>
        <Button className={`${styles.btn} ${styles.primary}`} onClick={handleAction}>
          ⚙️ 批次操作
        </Button>
      </View>
    </View>
  );
};

export default BatchDetailPage;
