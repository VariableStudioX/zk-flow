import { useEffect, useState } from 'react';
import { getTransactionsList, TransactionData } from '../services/explorer.ts';
import Header from '../components/Header.tsx';
import list from '../../address';
import { Table } from 'antd';
import { dataTransform } from '../utils/utils.ts';

const AddressListPage = () => {
  const addresss = list;
  const [transactionDataList, setTransactionDataList] = useState<TransactionData[]>([]);

  useEffect(() => {
    console.log(111);
    fetchTransactionList(addresss);
  }, [addresss]);

  const fetchTransactionList = async (ads: string[]) => {
    const transactionsList = await Promise.all(ads.map((ad) => getTransactionsList(ad)));
    const transactionDataList = transactionsList.map((trans, index) => dataTransform(ads[index], trans, index));

    setTransactionDataList(transactionDataList);
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_text: number) => `${_text + 1}`,
    },
    {
      title: '交互',
      dataIndex: 'interactions',
      key: 'interactions',
    },
    {
      title: '近七日 交互数',
      dataIndex: 'interactions7Change',
      key: 'interactions7Change',
    },
    {
      title: '近七日 volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (volume: number) => {
        return `$${Math.round(volume)}`;
      },
    },
    {
      title: '最近七日 volume-change',
      dataIndex: 'volume7Change',
      key: 'volume7Change',
      render: (volume: number) => {
        return `$${Math.round(volume)}`;
      },
    },
    {
      title: 'fees',
      dataIndex: 'fees',
      key: 'fees',
      render: (fees: number) => {
        return `$${fees}`;
      },
    },
    {
      title: '近七日 fees-Change',
      dataIndex: 'fees7Change',
      key: 'fees7Change',
      render: (fees7Change: number) => {
        return `$${fees7Change}`;
      },
    },
  ];
  return (
    <>
      <Header hasSearchBar />
      <Table
        dataSource={transactionDataList}
        columns={columns}
        bordered
        className="mt-20 place-items-center mb-20 ml-10 mr-10 bg-slate-100"
      ></Table>
    </>
  );
};

export default AddressListPage;
