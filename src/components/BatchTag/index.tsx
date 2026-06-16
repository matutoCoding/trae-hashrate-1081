import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface BatchTagProps {
  batchNo: string;
}

const BatchTag: React.FC<BatchTagProps> = ({ batchNo }) => {
  return (
    <View className={styles.batchTag}>
      <Text className={styles.batchText}>{batchNo}</Text>
    </View>
  );
};

export default BatchTag;
