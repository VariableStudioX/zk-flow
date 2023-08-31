import { useEffect, useState } from 'react';
import { getTransactionsList, sleep, TransactionData } from '../services/explorer.ts';
import Header from '../components/Header.tsx';
import { dataTransform } from '../utils/utils.ts';
import ProtocolsPie from '../components/ProtocolsPie.tsx';

const search = window.location.search;
const params = new URLSearchParams(search);
const address = params.get('address') || '';

const addresss: string[] = [address];

const ContractPage = () => {
  const [transactionDataList, setTransactionDataList] = useState<TransactionData[]>([]);
  useEffect(() => {
    fetchTransactionList(addresss);
    console.log('fetchTransactionList');
  }, []);

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

  return (
    <>
      <Header hasSearchBar />
      <div className="min-h-full mt-60">
        <div className="bg-gray-300 pb-32">
          {/* <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">合约概览</h1>
            </div>
          </header> */}
          <main className="-mt-32">
            <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
              {Boolean(addresss[0]) && (
                <ProtocolsPie transactionDataList={transactionDataList} addressList={addresss} hideExtra></ProtocolsPie>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ContractPage;
