import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

let lang = navigator.language;

const NUMBER_ANIMATE_SPEED = 1000;

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

function qsa(str) {
  return document.querySelectorAll(str);
}

function query(gql, fn) {
  client.query({
    query: gql,
  })
    .then(fn)
    .catch(err);
}

function humanizeNumber(num, decimals = 2) {
  if (typeof decimals != 'number') {
    decimals = parseInt(decimals);
  }

  return parseFloat(num).toLocaleString(lang, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function animateNumber(obj, start, end, duration, decimals = 0) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    let result = humanizeNumber(progress * (end - start) + start, decimals);
    obj.textContent = result;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function pageContentUpdate(content) {
  let keys = Object.keys(content);
  let divisions = qsa('[data-numerator][data-denominator]');

  keys.forEach(key => {
    let val = content[key];
    let targets = qsa('[data-feed=' + key + ']')
    ;
    targets.forEach(target => {
      animateNumber(target, 0, parseInt(val), NUMBER_ANIMATE_SPEED, target.dataset.decimals);
    });
  });

  divisions.forEach(el => {
    let data = el.dataset;
    let top = content[el.dataset.numerator];
    let bot = content[el.dataset.denominator];
    let numerator = parseFloat(top);
    let denominator = parseFloat(bot);
    let divide = denominator / numerator * 100;

    animateNumber(el, 0, parseInt(divide), NUMBER_ANIMATE_SPEED, 2);
  });
}

function init() {
  query(treasuryDataQuery, (result) => {
    let metrics = result.data.protocolMetrics;
    let latest = metrics[0];
    console.log('Metrics', latest);
    pageContentUpdate(latest);
  });

  // query(rebasesDataQuery, slog('Rebases'));
}

window.addEventListener('load', init);
