import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const FTM_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/spartacus-finance/ftm2';

const client = new ApolloClient({
  uri: FTM_GRAPH_URL,
  cache: new InMemoryCache()
});

const treasuryDataQuery = gql`
query {
  protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    ohmCirculatingSupply
    sOhmCirculatingSupply
    totalSupply
    ohmPrice
    marketCap
    totalValueLocked
    treasuryRiskFreeValue
    treasuryMarketValue
    nextEpochRebase
    nextDistributedOhm
    treasuryDaiRiskFreeValue
    treasuryFraxMarketValue
    treasuryDaiMarketValue
    treasuryFraxRiskFreeValue
    treasuryXsushiMarketValue
    treasuryWETHMarketValue
    currentAPY
    runway10k
    runway20k
    runway50k
    runwayCurrent
    holders
    treasuryOhmDaiPOL
    treasuryOhmFraxPOL
  }
}`;

export const rebasesDataQuery = gql`
query {
  rebases(where: {contract: "0x9863056B4Bdb32160A70107a6797dD06B56E8137"}, orderBy: timestamp, first: 1000, orderDirection: desc) {
    percentage
    timestamp
  }
}`;

function log(label) {
  return (obj) => console.log(label, obj);
}

function slog(str = null) {
  return log(str);
}

function err(error) {
  console.error(error);
}

function query(gql, fn) {
  client.query({
    query: gql,
  })
    .then(fn)
    .catch(err);
}

query(treasuryDataQuery, (result) => {
  console.log('Treasury', result.data.protocolMetrics[0]);
});

// query(rebasesDataQuery, slog('Rebases'));