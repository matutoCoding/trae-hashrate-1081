import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import BatchTag from '@/components/BatchTag';
import { ProcessStatus } from '@/types/vinegar';
import { getStatusText, formatDateTime } from '@/utils/format';

interface InfoField {
  label: string;
  value: string | number;
}

interface TaskItemProps {
  typeIcon?: string;
  title: string;
  batchNo: string;
  time: string;
  operator?: string;
  status: ProcessStatus;
  infoFields?: InfoField[];
  remark?: string;
  actionText?: string;
  onAction?: () => void;
  onClick?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  typeIcon = '📋',
  title,
  batchNo,
  time,
  operator,
  status,
  infoFields = [],
  remark,
  actionText,
  onAction,
  onClick
}) => {
  const statusClass = {
    pending: styles.pending,
    in_progress: styles.inProgress,
    completed: styles.completed,
    warning: styles.warning,
    error: styles.error
  }[status];

  return (
    <View className={styles.taskItem} onClick={onClick}>
      <View className={styles.header}>
        <View className={styles.headerLeft}>
          <View className={styles.taskTitle}>
            <Text className={styles.typeIcon}>{typeIcon}</Text>
            <Text className={styles.titleText}>{title}</Text>
          </View>
          <View className={styles.metaInfo}>
            <BatchTag batchNo={batchNo} />
            <View className={styles.metaItem}>
              <Text>⏰</Text>
              <Text>{formatDateTime(time)}</Text>
            </View>
            {operator && (
              <View className={styles.metaItem}>
                <Text>👤</Text>
                <Text>{operator}</Text>
              </View>
            )}
          </View>
        </View>
        <View className={classnames(styles.statusBadge, statusClass)}>
          <Text>{getStatusText(status)}</Text>
        </View>
      </View>

      {infoFields.length > 0 && (
        <View className={styles.content}>
          <View className={styles.infoGrid}>
            {infoFields.map((field, i) => (
              <View className={styles.infoItem} key={i}>
                <Text className={styles.label}>{field.label}</Text>
                <Text className={styles.value}>{field.value}</Text>
              </View>
            ))}
          </View>

          {(remark || actionText) && (
            <View className={styles.footer}>
              {remark && <Text className={styles.remark}>{remark}</Text>}
              {actionText && (
                <Button
                  className={classnames(styles.actionBtn, status === 'completed' && styles.outline)}
                  onClick={(e) => {
                    e.stopPropagation?.();
                    onAction?.();
                  }}
                >
                  {actionText}
                </Button>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default TaskItem;
