import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface ChartSeries {
  label: string;
  value: number;
  color?: string;
}

interface ChartDataV1 {
  label: string;
  values: { key: string; value: number }[];
}

interface DataChartProps {
  title?: string;
  data?: ChartDataV1[];
  labels?: string[];
  data1?: ChartSeries[];
  data2?: ChartSeries[];
  primaryLabel?: string;
  secondaryLabel?: string;
  maxValue?: number;
  type?: 'bar' | 'line';
  height?: number;
  showLegend?: boolean;
  seriesConfig?: { key: string; label: string; color: string }[];
}

const DataChart: React.FC<DataChartProps> = ({
  title = '',
  data,
  labels,
  data1,
  data2,
  primaryLabel = '系列1',
  secondaryLabel = '系列2',
  maxValue,
  type = 'bar',
  height = 240,
  showLegend = true,
  seriesConfig = [
    { key: 'temp', label: '温度', color: 'temp' },
    { key: 'acid', label: '酸度', color: 'acid' }
  ]
}) => {
  let normalizedData: ChartDataV1[] = [];
  let legendItems: { label: string; color: string }[] = [];
  let computedMax = 0;

  if (data && data.length > 0) {
    normalizedData = data;
    legendItems = seriesConfig.map(s => ({
      label: s.label,
      color: s.color === 'temp' ? '#E07A5F' : s.color === 'acid' ? '#3D5A80' : '#81B29A'
    }));
    data.forEach(d => {
      d.values.forEach(v => {
        if (v.value > computedMax) computedMax = v.value;
      });
    });
  } else if (labels && (data1 || data2)) {
    const hasData1 = data1 && data1.length > 0;
    const hasData2 = data2 && data2.length > 0;
    legendItems = [];
    if (hasData1) legendItems.push({ label: primaryLabel, color: '#E07A5F' });
    if (hasData2) legendItems.push({ label: secondaryLabel, color: '#3D5A80' });

    normalizedData = labels.map((label, idx) => {
      const values: { key: string; value: number }[] = [];
      if (hasData1 && data1[idx]) {
        values.push({ key: 'series1', value: data1[idx].value });
        if (data1[idx].value > computedMax) computedMax = data1[idx].value;
      }
      if (hasData2 && data2[idx]) {
        values.push({ key: 'series2', value: data2[idx].value });
        if (data2[idx].value > computedMax) computedMax = data2[idx].value;
      }
      return { label, values };
    });
  }

  if (normalizedData.length === 0) {
    return (
      <View className={styles.chartContainer}>
        {title && (
          <View className={styles.chartHeader}>
            <Text className={styles.title}>{title}</Text>
          </View>
        )}
        <View className={styles.noData}>暂无数据</View>
      </View>
    );
  }

  computedMax = maxValue || (computedMax * 1.2 || 100);
  computedMax = Math.ceil(computedMax / 10) * 10;
  const yLabels = [];
  for (let i = 4; i >= 0; i--) {
    yLabels.push(Math.round((computedMax / 4) * i));
  }

  const seriesCount = legendItems.length;
  const seriesColors: Record<string, string> = {};
  if (data && data.length > 0) {
    seriesCount > 0 && (seriesColors[seriesConfig[0]?.key || 'temp'] = '#E07A5F');
    seriesCount > 1 && (seriesColors[seriesConfig[1]?.key || 'acid'] = '#3D5A80');
  } else {
    seriesColors['series1'] = '#E07A5F';
    seriesColors['series2'] = '#3D5A80';
  }

  return (
    <View className={styles.chartContainer}>
      {(title || showLegend) && (
        <View className={styles.chartHeader}>
          {title && <Text className={styles.title}>{title}</Text>}
          {showLegend && legendItems.length > 0 && (
            <View className={styles.legend}>
              {legendItems.map((s, idx) => (
                <View className={styles.legendItem} key={idx}>
                  <View className={styles.dot} style={{ background: s.color }} />
                  <Text className={styles.label}>{s.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={{ paddingLeft: 50 }}>
        <View className={styles.chartArea} style={{ height: `${height}rpx` }}>
          <View className={styles.yAxis}>
            {yLabels.map((v, i) => (
              <Text className={styles.yLabel} key={i}>{v}</Text>
            ))}
          </View>

          {type === 'bar' && (
            <View className={styles.bars}>
              {normalizedData.map((item, index) => (
                <View className={styles.barGroup} key={index}>
                  <View className={styles.barWrapper} style={{ gap: seriesCount > 1 ? '6rpx' : '0' }}>
                    {item.values.map((v, vi) => (
                      <View
                        className={styles.bar}
                        key={vi}
                        style={{
                          height: `${Math.max(6, (v.value / computedMax) * (height - 40))}rpx`,
                          background: seriesColors[v.key] || '#81B29A',
                          minWidth: seriesCount > 1 ? `${100 / seriesCount - 5}%` : '60%'
                        }}
                      />
                    ))}
                  </View>
                  <Text className={styles.xLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          )}

          {type === 'line' && (
            <View className={styles.lineChart}>
              <svg
                className={styles.svgLine}
                viewBox={`0 0 ${normalizedData.length * 80} ${height - 20}`}
                preserveAspectRatio="none"
                style={{ width: '100%', height: `${height - 20}rpx` }}
              >
                {legendItems.map((series, si) => {
                  const keyName = (data && data.length > 0) ? seriesConfig[si]?.key : `series${si + 1}`;
                  const points = normalizedData.map((d, i) => {
                    const val = d.values.find(v => v.key === keyName)?.value || 0;
                    return `${i * 80 + 40},${height - 20 - (val / computedMax) * (height - 60)}`;
                  }).join(' ');

                  return (
                    <React.Fragment key={si}>
                      <polyline
                        fill="none"
                        stroke={series.color}
                        strokeWidth="2"
                        points={points}
                      />
                      {normalizedData.map((d, i) => {
                        const val = d.values.find(v => v.key === keyName)?.value || 0;
                        return (
                          <circle
                            key={i}
                            cx={i * 80 + 40}
                            cy={height - 20 - (val / computedMax) * (height - 60)}
                            r="3"
                            fill={series.color}
                          />
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </svg>
            </View>
          )}
        </View>

        {type === 'line' && (
          <View style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8 }}>
            {normalizedData.map((item, index) => (
              <Text key={index} className={styles.xLabel}>{item.label}</Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default DataChart;
