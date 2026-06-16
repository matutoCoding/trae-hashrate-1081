import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ProcessStatus } from '@/types/vinegar';
import { getStatusText } from '@/utils/format';

interface StatusCardProps {
  icon: string;
  title: string;
  description: string;
  count: number;
  status: ProcessStatus;
  iconBgType?: 'primary' | 'success' | 'warning' | 'info';
  onClick?: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  icon,
  title,
  description,
  count,
  status,
  iconBgType = 'primary',
  onClick
}) => {
  const iconBgClass = {
    primary: styles.iconBgPrimary,
    success: styles.iconBgSuccess,
    warning: styles.iconBgWarning,
    info: styles.iconBgInfo
  }[iconBgType];

  const statusClass = {
    pending: styles.pending,
    in_progress: styles.inProgress,
    completed: styles.completed,
    warning: styles.warning,
    error: styles.error
  }[status];

  return (
    <View className={styles.statusCard} onClick={onClick}>
      <View className={classnames(styles.iconWrapper, iconBgClass)}>
        <Text>{icon}</Text>
      </View>
      <View className={styles.cardContent}>
        <Text className={styles.title}>{title}</Text>
        <Text className={styles.description}>{description}</Text>
        <View className={styles.footer}>
          <View className={styles.countBadge}>
            <Text className={styles.count}>{count}</Text>
            <Text className={styles.unit}>个批次</Text>
          </View>
          <View className={classnames(styles.statusTag, statusClass)}>
            <Text>{getStatusText(status)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StatusCard;
