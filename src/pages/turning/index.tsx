import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import BatchTag from '@/components/BatchTag';
import { mockTurningTasks } from '@/data/mockTurning';
import { TurningTask, ProcessStatus } from '@/types/vinegar';
import { formatDateTime } from '@/utils/format';

type FilterType = 'all' | 'turn' | 'dump' | 'pending' | 'in_progress' | 'completed';

const TurningPage: React.FC = () => {
  const [tasks, setTasks] = useState<TurningTask[]>(mockTurningTasks);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedDate, setSelectedDate] = useState<number>(16);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 800);
  });

  const stats = useMemo(() => {
    const today = tasks.filter(t => t.plannedTime.startsWith('2026-06-16'));
    return {
      turnCount: tasks.filter(t => t.taskType === 'turn').length,
      dumpCount: tasks.filter(t => t.taskType === 'dump').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      pending: tasks.filter(t => t.status === 'pending' || t.status === 'warning' || t.status === 'in_progress').length
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (activeFilter === 'turn') result = result.filter(t => t.taskType === 'turn');
    else if (activeFilter === 'dump') result = result.filter(t => t.taskType === 'dump');
    else if (activeFilter === 'pending') result = result.filter(t => t.status === 'pending');
    else if (activeFilter === 'in_progress') result = result.filter(t => t.status === 'in_progress' || t.status === 'warning');
    else if (activeFilter === 'completed') result = result.filter(t => t.status === 'completed');
    return result;
  }, [tasks, activeFilter]);

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    const firstDay = 1;
    for (let i = 1; i < 3; i++) days.push(null);
    for (let d = 1; d <= 30; d++) days.push(d);
    return days;
  }, []);

  const getTaskDots = (day: number) => {
    const dayStr = `2026-06-${String(day).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.plannedTime.startsWith(dayStr));
    const dots: string[] = [];
    if (dayTasks.some(t => t.status === 'warning')) dots.push('#DAA520');
    if (dayTasks.some(t => t.status === 'in_progress')) dots.push('#3D5A80');
    if (dayTasks.some(t => t.status === 'completed')) dots.push('#2E8B57');
    return dots.slice(0, 3);
  };

  const handleTaskAction = (taskId: string, action: string) => {
    console.log('[Turning] Action:', action, taskId);
    if (action === 'start') {
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: 'in_progress' as ProcessStatus, actualTime: new Date().toISOString() } : t
      ));
      Taro.showToast({ title: '已开始任务', icon: 'success' });
    } else if (action === 'complete') {
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: 'completed' as ProcessStatus, uniformityScore: 90 + Math.floor(Math.random() * 10) } : t
      ));
      Taro.showToast({ title: '任务已完成', icon: 'success' });
    }
  };

  const handleAddTask = () => {
    console.log('[Turning] Add new task');
    Taro.showToast({ title: '新建翻醅任务', icon: 'none' });
  };

  const handleTaskClick = (taskId: string) => {
    console.log('[Turning] Click task:', taskId);
    Taro.navigateTo({ url: '/pages/turning-detail/index' });
  };

  const filters = [
    { key: 'all' as FilterType, label: '全部' },
    { key: 'turn' as FilterType, label: '翻醅' },
    { key: 'dump' as FilterType, label: '倒醅' },
    { key: 'pending' as FilterType, label: '待执行' },
    { key: 'in_progress' as FilterType, label: '进行中' },
    { key: 'completed' as FilterType, label: '已完成' },
  ];

  return (
    <View className="pageContainer">
      <View className={styles.filterBar}>
        {filters.map(f => (
          <View
            key={f.key}
            className={classnames(styles.filterItem, activeFilter === f.key && styles.active)}
            onClick={() => setActiveFilter(f.key)}
          >
            <Text>{f.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <View className={classnames(styles.statIcon, styles.turn)}>
            <Text>🔄</Text>
          </View>
          <View className={styles.statInfo}>
            <Text className={styles.statValue}>{stats.turnCount}</Text>
            <Text className={styles.statLabel}>翻醅任务</Text>
          </View>
        </View>
        <View className={styles.statCard}>
          <View className={classnames(styles.statIcon, styles.dump)}>
            <Text>📤</Text>
          </View>
          <View className={styles.statInfo}>
            <Text className={styles.statValue}>{stats.dumpCount}</Text>
            <Text className={styles.statLabel}>倒醅任务</Text>
          </View>
        </View>
        <View className={styles.statCard}>
          <View className={classnames(styles.statIcon, styles.todo)}>
            <Text>📋</Text>
          </View>
          <View className={styles.statInfo}>
            <Text className={styles.statValue}>{stats.pending}</Text>
            <Text className={styles.statLabel}>待处理</Text>
          </View>
        </View>
        <View className={styles.statCard}>
          <View className={classnames(styles.statIcon, styles.done)}>
            <Text>✅</Text>
          </View>
          <View className={styles.statInfo}>
            <Text className={styles.statValue}>{stats.completed}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
        </View>
      </View>

      <View className="sectionTitle">
        <Text>任务日历</Text>
      </View>
      <View className={styles.calendarHeader}>
        <Text className={styles.calendarTitle}>2026年6月</Text>
        <View className={styles.navBtns}>
          <View className={styles.navBtn}><Text>‹</Text></View>
          <View className={styles.navBtn}><Text>›</Text></View>
        </View>
      </View>
      <View className={styles.calendarGrid}>
        <View className={styles.weekRow}>
          {['一', '二', '三', '四', '五', '六', '日'].map(d => (
            <View className={styles.weekDay} key={d}><Text>{d}</Text></View>
          ))}
        </View>
        <View className={styles.daysGrid}>
          {calendarDays.map((day, i) => {
            if (day === null) return <View key={i} className={classnames(styles.dayCell, styles.empty)} />;
            const dots = getTaskDots(day);
            return (
              <View
                key={i}
                className={classnames(styles.dayCell, {
                  [styles.today]: day === 16,
                  [styles.selected]: day === selectedDate,
                  [styles.hasTask]: dots.length > 0
                })}
                onClick={() => setSelectedDate(day)}
              >
                <Text className={styles.dayNum}>{day}</Text>
                <View className={styles.dots}>
                  {dots.map((c, di) => (
                    <View key={di} className={styles.dot} style={{ background: c }} />
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View className="sectionTitle">
        <Text>任务列表</Text>
        <Text className="moreText">共 {filteredTasks.length} 项</Text>
      </View>
      <View className={styles.taskList}>
        {filteredTasks.map(task => (
          <View
            key={task.id}
            className={classnames(styles.taskItem, task.taskType === 'turn' ? styles.typeTurn : styles.typeDump)}
            onClick={() => handleTaskClick(task.id)}
          >
            <View className={styles.taskHeader}>
              <View className={styles.taskLeft}>
                <View className={styles.taskTitle}>
                  <Text className={styles.typeIcon}>{task.taskType === 'turn' ? '🔄' : '📤'}</Text>
                  <Text className={styles.name}>
                    {task.taskType === 'turn' ? '翻醅作业' : '倒醅作业'}
                  </Text>
                </View>
                <View className={styles.taskMeta}>
                  <BatchTag batchNo={task.batchNo} />
                  <View className={styles.meta}>
                    <Text>⏰</Text>
                    <Text>{formatDateTime(task.plannedTime)}</Text>
                  </View>
                  {task.operator && (
                    <View className={styles.meta}>
                      <Text>👤</Text>
                      <Text>{task.operator}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View className={classnames(styles.statusTag, {
                [styles.pending]: task.status === 'pending',
                [styles.inProgress]: task.status === 'in_progress',
                [styles.completed]: task.status === 'completed',
                [styles.warning]: task.status === 'warning'
              })}>
                <Text>
                  {task.status === 'completed' ? '已完成' :
                   task.status === 'in_progress' ? '进行中' :
                   task.status === 'warning' ? '需关注' : '待开始'}
                </Text>
              </View>
            </View>

            <View className={styles.taskBody}>
              <View className={styles.infoGrid}>
                <View className={styles.infoItem}>
                  <Text className={styles.label}>醅层数</Text>
                  <Text className={styles.value}>{task.layerCount} 层</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.label}>均匀度评分</Text>
                  <Text className={styles.value} style={{ color: task.uniformityScore ? '#2E8B57' : '#C9B8A8' }}>
                    {task.uniformityScore || '--'}
                  </Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.label}>实际完成</Text>
                  <Text className={styles.value} style={{ fontSize: task.actualTime ? '20rpx' : '28rpx' }}>
                    {task.actualTime ? formatDateTime(task.actualTime) : '--'}
                  </Text>
                </View>
              </View>

              <View className={styles.taskFooter}>
                {task.remark ? (
                  <Text className={styles.remarkText}>💬 {task.remark}</Text>
                ) : <View style={{ flex: 1 }} />}
                <View className={styles.actionBtns}>
                  {(task.status === 'pending' || task.status === 'warning') && (
                    <Button
                      className={classnames(styles.btn, styles.primary)}
                      onClick={(e) => { e.stopPropagation?.(); handleTaskAction(task.id, 'start'); }}
                    >
                      开始执行
                    </Button>
                  )}
                  {task.status === 'in_progress' && (
                    <Button
                      className={classnames(styles.btn, styles.primary)}
                      onClick={(e) => { e.stopPropagation?.(); handleTaskAction(task.id, 'complete'); }}
                    >
                      完成任务
                    </Button>
                  )}
                  {task.status === 'completed' && (
                    <Button
                      className={classnames(styles.btn, styles.outline)}
                      onClick={(e) => { e.stopPropagation?.(); Taro.navigateTo({ url: '/pages/turning-detail/index' }); }}
                    >
                      查看详情
                    </Button>
                  )}
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.fabBtn} onClick={handleAddTask}>
        <Text>+</Text>
      </View>
    </View>
  );
};

export default TurningPage;
