import { FC, useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { TransactionData } from '../services/explorer';
import { ProtocolType, getProtocolMethod, protocolTypes } from '../protocols';
import Paragraph from 'antd/es/typography/Paragraph';
import { Select } from 'antd';
interface ChartProps {
  transactionDataList: TransactionData[] | [];
  addressList: string[];
  hideExtra?: boolean;
}
interface SeriesData {
  value: number;
  name: string;
}

const ProtocolsPie: FC<ChartProps> = ({ transactionDataList, addressList, hideExtra }) => {
  const [seriesDatas, setSeriesDatas] = useState<SeriesData[]>([]);
  const [address, setAddress] = useState<string>('');
  const [inputAddress, setInputAddress] = useState<string>('');

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
          tooltip: {
            formatter: function (params: any) {
              if (params.value === 0) {
                return; // 如果值为 0，则返回空字符串，不显示 tooltip
              }
              return params.name + ': ' + params.value;
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
  const onInputChange: React.FormEventHandler<HTMLInputElement> = (e) => {
    setInputAddress(e.target?.value);
  };
  const onSearch = () => {
    if (!addressList.includes(inputAddress)) {
      return;
    }
    setAddress(inputAddress);
  };
  return (
    <>
      <main>
        <h3 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          合约概览
        </h3>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div>
            {!hideExtra && (
              <div className="flex flex-row items-center">
                <Select className=" w-96 " onChange={handleChange} options={options} value={address} />
                <Paragraph copyable={{ text: address }} className=" ml-2">
                  {address}
                </Paragraph>
              </div>
            )}
            {!hideExtra && (
              <div className="mt-2 flex rounded-md ">
                <div className="relative flex items-stretch focus-within:z-10">
                  <input
                    id="adress"
                    className="block w-96 rounded-none rounded-l-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="请输入地址列表中的地址"
                    onInput={onInputChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={onSearch}
                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  搜索
                </button>
              </div>
            )}
          </div>
          <ReactEcharts option={option} className="flex  flex-col-reverse" />
        </div>
      </main>
    </>
  );
};
export default ProtocolsPie;
