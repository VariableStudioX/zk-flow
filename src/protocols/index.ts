import { Orbiter } from './orbiter.ts';
import { Holdstation } from './holdstation.ts';
import { IzumiFinance as Izumi } from './izumi.ts';
import { Maverick } from './maverick.ts';
import { OnchainTrade } from './onchaintrade.ts';
import { SpaceFi } from './spacefi.ts';
import { Starmaker } from './starmaker.ts';
import { Goal3 } from './goal3.ts';
import { Rollup } from './rollup.ts';
import { ZkSyncId } from './zksyncid.ts';
import { ZkSwap } from './zkswap.ts';
import { XYFinance } from './xyfinance.ts';
import { All } from './all.ts';
import { SyncSwap } from './syncswap.ts';
import { ZkSyncEraPortal } from './zksynceraportal.ts';
import { ZkSyncNameService } from './zksyncnameservice.ts';
import { Mute } from './muteio.ts';
import { Velocore } from './velocore.ts';

export type ProtocolType =
  | 'all'
  | 'goal3'
  | 'holdstation'
  | 'izumi'
  | 'maverick'
  | 'muteio'
  | 'spacefi'
  | 'onchaintrade'
  | 'orbiter'
  | 'zkSyncid'
  | 'zkswap'
  | 'rollup'
  | 'starmaker'
  | 'xyfinance'
  | 'zksynceraportal'
  | 'velocore'
  | 'zksyncnameservice'
  | 'syncswap';

export function getProtocolMethod(protocol: ProtocolType, key: 'getProtocolsState' = 'getProtocolsState') {
  const handlers: Record<ProtocolType, any> = {
    all: All,
    orbiter: Orbiter,
    holdstation: Holdstation,
    izumi: Izumi,
    maverick: Maverick,
    onchaintrade: OnchainTrade,
    spacefi: SpaceFi,
    starmaker: Starmaker,
    goal3: Goal3,
    rollup: Rollup,
    zkSyncid: ZkSyncId,
    zkswap: ZkSwap,
    xyfinance: XYFinance,
    syncswap: SyncSwap,
    zksyncnameservice: ZkSyncNameService,
    zksynceraportal: ZkSyncEraPortal,
    muteio: Mute,
    velocore: Velocore,
  };
  return handlers[protocol][key];
}
