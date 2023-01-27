BLOCKCHAINS = [
  {
    tag: 'avalanche',
    network: 'avalanche',
    name: 'Avalanche  C-chain',
    family: 'ethereum',
    platform: 'Smart Contract',
    currency: 'AVAX',
    icon: 'currency/avalanche.png',
    start: Date.parse('2020-09-23')
  },
  {
    tag: 'lamina1',
    network: 'lamina1',
    name: 'Lamina1 C-chain',
    family: 'ethereum',
    platform: 'Smart Contract',
    currency: 'L1',
    icon: 'currency/lamina1.png',
    start: Date.parse('2020-09-23')
  }
].freeze

BLOCKCHAIN_BY_NAME = BLOCKCHAINS.index_by { |b| b[:network] }
