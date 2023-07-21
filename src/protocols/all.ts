import { Transaction } from '../services/explorer.ts';
import { ProtocolState } from '../components/ProtocolsCard.tsx';
import { countTransactionPeriods } from '../utils/utils.ts';

const goal3Addresses: string[] = [
  '0xd2ca21df45479824f954a6e1759d436a57d63faf',
  '0x1f090f91ee09768ca36dcd52640f4a5eae146555',
  '0xc523df658dbec88dc03fb23a703bcbd7ffb5ea01',
  '0x116a4a5ed4c7d5712e109d4188e17616d8e5784a',
  '0x8d123a2a0a7c98555931ceda6917b865b7345164',
];

export const All = {
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
