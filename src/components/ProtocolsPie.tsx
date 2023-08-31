import { FC, useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { TransactionData } from '../services/explorer';
import { ProtocolType, getProtocolMethod, protocolTypes } from '../protocols';
import Paragraph from 'antd/es/typography/Paragraph';
import { Select } from 'antd';
interface ChartProps {
  transactionDataList: TransactionData[] | [];
  addressList: string[];
}
interface SeriesData {
  value: number;
  name: string;
}

const ProtocolsPie: FC<ChartProps> = ({ transactionDataList, addressList }) => {
  const [seriesDatas, setSeriesDatas] = useState<SeriesData[]>([]);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const nextAddress = address ? address : addressList[0];
    const transactionData = transactionDataList.find((it) => it.address === nextAddress);
    const seriesDatas = protocolTypes.map((protocol) => {
      const getProtocolsState = getProtocolMethod(protocol as ProtocolType, 'getProtocolsState');
      const protocolsState = transactionData?.transactions
        ? getProtocolsState(transactionData?.transactions, address)
        : {};
      return {
        value: protocolsState.interactions,
        name: protocolsState.name,
      };
    });
    setAddress(nextAddress);
    setSeriesDatas(seriesDatas);
  }, [transactionDataList, addressList, address]);

  const getOption = () => {
    const option = {
      title: {
        text: '协议一览',
        left: 'center',
        top: 0,
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'tx',
          type: 'pie',
          radius: '50%',
          data: seriesDatas,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    return option;
  };
  const option = getOption();
  const handleChange = (value: string) => {
    setAddress(value);
  };
  const options = addressList.map((it) => {
    return {
      value: it,
      label: it,
    };
  });
  return (
    <>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div>
            <div className="flex flex-row items-center">
              <Select style={{ width: 120 }} onChange={handleChange} options={options} value={address} />
              <Paragraph copyable={{ text: address }} className=" ml-2">
                {address}
              </Paragraph>
            </div>
          </div>
          <ReactEcharts option={option} className="flex  flex-col-reverse" />
        </div>
      </main>
    </>
  );
};
export default ProtocolsPie;
