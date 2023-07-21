import { useEffect, useState } from 'react';
import { getTransactionsList, TransactionData } from '../services/explorer.ts';
import Header from '../components/Header.tsx';
import list from '../../address.ts';
import { dataTransform } from '../utils/utils.ts';
import OverviewTable from '../components/OverviewTable.tsx';
import { Radio, RadioChangeEvent, Tabs } from 'antd';
import Chart from '../components/Chart.tsx';
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
  }, []);

  const fetchTransactionList = async (adds: string[]) => {
    const transactionsList = await Promise.all(adds.map((ad) => getTransactionsList(ad)));
    const transactionDataList = transactionsList.map((trans, index) => dataTransform(adds[index], trans, index));
    setTransactionDataList(transactionDataList);
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  const items = itemOptios.map((item) => {
    return {
      label: item.label,
      key: item.key,
      children: <Chart transactionDataList={transactionDataList} protocol={item.key} />,
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
          <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: 700 }} items={items} />
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
    key: 'all',
  },
  {
    label: 'syncswap',
    key: 'syncswap',
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
    label: 'goal3',
    key: 'goal3',
  },
  {
    label: 'spacefi',
    key: 'spacefi',
  },
  {
    label: 'holdstation',
    key: 'holdstation',
  },
  {
    label: 'zkswap',
    key: 'zkswap',
  },
];
