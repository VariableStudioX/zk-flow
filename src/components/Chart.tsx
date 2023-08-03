import { FC, useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { TransactionData } from '../services/explorer';
import { ProtocolType, getProtocolMethod } from '../protocols';
import { ProtocolState } from './ProtocolsCard';
import Paragraph from 'antd/es/typography/Paragraph';
interface ChartProps {
  transactionDataList: TransactionData[] | [];
  protocol: ProtocolType;
}
interface Series {
  name: string;
  type: string;
  data: number[];
}
interface Legend {
  data: string[];
  selected: Record<string, boolean>;
}
const Chart: FC<ChartProps> = ({ transactionDataList, protocol = 'all' }) => {
  const [xAxisData, setXAxisData] = useState<string[]>([]);
  const [legend, setLegend] = useState<Legend[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [tooltipAddress, setTooltipAddress] = useState<string>('');
  const seriesKeys = protocolMapKeys[protocol] || DefaultKeys;

  useEffect(() => {
    setXAxisData(transactionDataList.map((it) => `${it.address}`));
    const getProtocolsState = getProtocolMethod(protocol, 'getProtocolsState');
    const series = seriesKeys.map((key: string) => {
      return {
        name: key,
        type: 'bar',
        data: transactionDataList.map((transactionData) => {
          const { transactions, address } = transactionData;
          const protocolsState = getProtocolsState(transactions, address);
          return getSerieItemData(protocol, key, protocolsState, transactionData);
        }),
      };
    });

    const selected: any = {};
    seriesKeys.forEach((key: string, index: number) => {
      selected[key] = index === 0;
    });
    const nextLegend = {
      data: seriesKeys,
      // selected,
    };
    setLegend(nextLegend as any);
    setSeries(series);
  }, [transactionDataList, protocol, seriesKeys]);

  const getOption = () => {
    const option = {
      legend: legend,
      tooltip: {
        trigger: 'axis',
        enterable: true,
        alwaysShowContent: true,
        axisPointer: {
          type: 'cross',
        },
        formatter: (params: any) => {
          setTooltipAddress(params[0].axisValue);
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          scale: true,
          axisLine: { onZero: false },
          axisTick: { show: true, alignWithLabel: true },
          splitLine: { show: false },
          axisLabel: { show: false },
          splitNumber: 20,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series,
    };
    return option;
  };
  const option = getOption();
  return (
    <>
      <div>
        <span className=" font-bold ">当前地址：</span>
        <Paragraph copyable={{ text: tooltipAddress }}>{tooltipAddress}</Paragraph>
      </div>
      <ReactEcharts option={option} className="flex  flex-col-reverse" />;
    </>
  );
};
export default Chart;

const DefaultKeys = ['interactions', 'lastActivity', 'volume', 'activeDays', 'approves'];
const protocolMapKeys: Partial<Record<ProtocolType, any>> = {
  all: ['interactions', 'interactions7Change', 'volume', 'volume7Change', 'fees', 'fees7Change'],
  // goal3: [],
  // holdstation: [],
  // izumi: [],
  // maverick: [],
  // muteio: [],
  // onchaintrade: [],
  // orbiter: [],
  // syncswap: ['activeDays'],
};

const getProtocolsStateValue = (key: keyof ProtocolState, state: ProtocolState) => state[key];
const getTransactionDataValue = (key: keyof TransactionData, data: TransactionData) => data[key];
const getSerieItemData = (prorocol: ProtocolType, key: any, state: ProtocolState, data: TransactionData) => {
  if (prorocol === 'all') {
    return getTransactionDataValue(key, data);
  }
  return getProtocolsStateValue(key, state);
};
