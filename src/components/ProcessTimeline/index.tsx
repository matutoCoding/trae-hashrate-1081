import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ProcessStatus } from '@/types/vinegar';

interface TimelineStep {
  icon: string;
  name: string;
  description: string;
  status: ProcessStatus;
  meta?: { label: string; value: string }[];
  progress?: number;
}

interface ProcessTimelineProps {
  title: string;
  steps: TimelineStep[];
}

const statusToStyle = (status: ProcessStatus) => {
  switch (status) {
    case 'completed': return 'completed';
    case 'in_progress': return 'active';
    case 'warning': return 'warning';
    case 'error': return 'warning';
    default: return 'pending';
  }
};

const statusToText = (status: ProcessStatus) => {
  switch (status) {
    case 'completed': return '已完成';
    case 'in_progress': return '进行中';
    case 'warning': return '需关注';
    case 'error': return '异常';
    default: return '待开始';
  }
};

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ title, steps }) => {
  return (
    <View className={styles.timeline}>
      <Text className={styles.timelineTitle}>{title}</Text>
      <View className={styles.steps}>
        {steps.map((step, index) => {
          const styleType = statusToStyle(step.status);
          return (
            <View className={styles.step} key={index}>
              <View className={styles.stepLeft}>
                <View className={classnames(styles.stepIcon, styles[styleType])}>
                  <Text>{step.icon}</Text>
                </View>
                <View className={classnames(styles.stepLine, styles[styleType])} />
              </View>
              <View className={styles.stepContent}>
                <View className={styles.stepHeader}>
                  <Text className={styles.stepName}>{step.name}</Text>
                  <View className={classnames(styles.stepStatus, styles[styleType])}>
                    <Text>{statusToText(step.status)}</Text>
                  </View>
                </View>
                <Text className={styles.stepDesc}>{step.description}</Text>
                {step.meta && step.meta.length > 0 && (
                  <View className={styles.stepMeta}>
                    {step.meta.map((m, mi) => (
                      <View className={styles.metaItem} key={mi}>
                        <Text>{m.label}：</Text>
                        <Text>{m.value}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {typeof step.progress === 'number' && (
                  <>
                    <View className={styles.progressBar}>
                      <View className={styles.progressFill} style={{ width: `${step.progress}%` }} />
                    </View>
                    <Text className={styles.progressText}>进度 {step.progress}%</Text>
                  </>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ProcessTimeline;
