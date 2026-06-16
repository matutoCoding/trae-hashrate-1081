import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface MetricCardProps {
  icon: string;
  value: string | number;
  label: string;
  colorType?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  value,
  label,
  colorType = 'primary'
}) => {
  return (
    <View className={classnames(styles.metricCard, styles[colorType])}>
      <Text className={styles.icon}>{icon}</Text>
      <Text className={styles.value}>{value}</Text>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

export default MetricCard;
