import { FC } from 'react';
import { TransactionData } from '../services/explorer.ts';
import { Table } from 'antd';

interface OverviewTableProps {
  transactionDataList: TransactionData[] | [];
}

const OverviewTable: FC<OverviewTableProps> = ({ transactionDataList }) => {
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
  return <Table dataSource={transactionDataList} columns={columns} bordered></Table>;
};

export default OverviewTable;
