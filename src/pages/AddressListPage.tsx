import { useEffect, useState } from 'react';
import { getTransactionsList, sleep, TransactionData } from '../services/explorer.ts';
import Header from '../components/Header.tsx';
import list from '../../address.ts';
import { dataTransform } from '../utils/utils.ts';
import OverviewTable from '../components/OverviewTable.tsx';
import { Radio, RadioChangeEvent, Tabs } from 'antd';
import Chart from '../components/Chart.tsx';
import ProtocolsPie from '../components/ProtocolsPie.tsx';
import { ProtocolType } from '../protocols/index.ts';

type TabPosition = 'table' | 'chart';
const search = window.location.search;
const params = new URLSearchParams(search);
const addresslist = params.get('addresslist');

let addresss: string[] = [];
if (!addresslist) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addresss = list.wwx_evm;
}

if (addresslist === 'wwx_evm') {
  addresss = list.wwx_evm;
}

if (addresslist === 'gkk_evm') {
  addresss = list.gkk_evm;
}

const AddressListPage = () => {
  const [transactionDataList, setTransactionDataList] = useState<TransactionData[]>([]);
  const [mode, setMode] = useState<TabPosition>('chart');
  useEffect(() => {
    fetchTransactionList(addresss);
    console.log('fetchTransactionList');
  }, []);

  // const fetchTransactionList = async (adds: string[]) => {
  //   const transactionsList = await Promise.all(adds.map((ad) => getTransactionsList(ad)));
  //   const transactionDataList = transactionsList.map((trans, index) => dataTransform(adds[index], trans, index));
  //   setTransactionDataList(transactionDataList);
  // };

  // 并行改串行
  const fetchTransactionList = async (adds: string[]) => {
    const transactionDataList = [];
    for (const ad of adds) {
      const trans = await getTransactionsList(ad);
      await sleep(200);
      const transactionData = dataTransform(ad, trans, adds.indexOf(ad));
      transactionDataList.push(transactionData);
    }
    setTransactionDataList(transactionDataList);
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };
  const items = itemOptios.map((item) => {
    return {
      label: (
        <div className="flex flex-row items-center ">
          <img
            className={'w-4 h-4 rounded-full mr-2 '}
            src={'/zk-flow/protocol/' + item.key + '.png'}
            alt=""
            // onClick={() => {
            //   window.open(item.url, '_blank');
            // }}
          />
          <div className=" mr-2 w-20 text-ellipsis overflow-hidden text-left"> {item.label}</div>
        </div>
      ),
      key: item.key,
      children: (
        <div className=" overflow-y-auto">
          <Chart transactionDataList={transactionDataList} protocol={item.key} />
          {item.key === 'overview' && <ProtocolsPie transactionDataList={transactionDataList} addressList={addresss} />}
        </div>
      ),
    };
  });
  return (
    <>
      <Header hasSearchBar />
      <div className="mt-20 place-items-center mb-20 ml-10 mr-10 bg-slate-100">
        <Radio.Group onChange={handleModeChange} value={mode} className="mb-4 pt-4 pl-2">
          <Radio.Button value="chart">Chart</Radio.Button>
          <Radio.Button value="table">Table</Radio.Button>
        </Radio.Group>
        {mode === 'table' ? (
          <OverviewTable transactionDataList={transactionDataList} />
        ) : (
          <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: '100%' }} items={items} />
        )}
      </div>
    </>
  );
};

export default AddressListPage;

const itemOptios: {
  label: string;
  key: ProtocolType;
}[] = [
  {
    label: '概览',
    key: 'overview',
  },
  {
    label: 'syncswap',
    key: 'syncswap',
  },
  {
    label: 'odos',
    key: 'odos',
  },
  {
    label: 'velocore',
    key: 'velocore',
  },
  {
    label: 'maverick',
    key: 'maverick',
  },
  {
    label: 'muteio',
    key: 'muteio',
  },
  {
    label: 'izumi',
    key: 'izumi',
  },
  {
    label: 'goal3',
    key: 'goal3',
  },
  {
    label: 'spacefi',
    key: 'spacefi',
  },
  {
    label: 'starmaker',
    key: 'starmaker',
  },
  {
    label: 'xyfinance',
    key: 'xyfinance',
  },
  {
    label: 'Rollup Finance',
    key: 'rollup',
  },
  {
    label: 'Pancakeswap Finance',
    key: 'pancakeswap',
  },
  {
    label: 'zkswap',
    key: 'zkSwap',
  },
  {
    label: 'zkSyncid',
    key: 'zksyncid',
  },
  {
    label: 'holdstation',
    key: 'holdstation',
  },
  {
    label: 'orbiter',
    key: 'orbiter',
  },

  {
    label: 'zkSyncEra Bridge',
    key: 'zksynceraportal',
  },
];
