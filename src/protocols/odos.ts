import { Transaction } from '../services/explorer.ts';
import { ProtocolState } from '../components/ProtocolsCard.tsx';
import { countTransactionPeriods } from '../utils/utils.ts';

const OdosAddresses: string[] = ['0xa269031037b4d5fa3f771c401d19e57def6cb491'];

export const Odos = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: ProtocolState = {
      name: 'Odos',
      id: 'Odos',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      approves: 0,
      url: 'https://app.odos.xyz/',
      tag: '',
    };

    transactions.forEach((transaction: Transaction) => {
      if (OdosAddresses.includes(transaction.to.toLowerCase())) {
        if (protocolState.lastActivity === '') protocolState.lastActivity = transaction.receivedAt;
        if (new Date(protocolState.lastActivity) < new Date(transaction.receivedAt))
          protocolState.lastActivity = transaction.receivedAt;
        protocolState.interactions += 1;

        const transfers = transaction.transfers.sort(
          (a, b) =>
            parseInt(b.amount) * 10 ** -b.token.decimals * b.token.price -
            parseInt(a.amount) * 10 ** -a.token.decimals * a.token.price,
        );

        if (transfers.length === 0) return;
        protocolState.volume +=
          parseInt(transfers[0].amount) * 10 ** -transfers[0].token.decimals * transfers[0].token.price;
      }
    });

    protocolState.activeDays = countTransactionPeriods(address, transactions, protocolState.id, OdosAddresses).days;

    return protocolState;
  },
  config: {
    name: 'Odos',
    id: 'Odos',
    url: 'https://app.odos.xyz/',
    tag: '',
  },
};
