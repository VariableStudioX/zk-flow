import { Transaction } from '../services/explorer.ts';
import { ProtocolState } from '../components/ProtocolsCard.tsx';

export const Default = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: ProtocolState = {
      name: 'all',
      id: 'all',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      approves: 0,
      url: '',
      tag: 'all',
    };

    return protocolState;
  },
};
