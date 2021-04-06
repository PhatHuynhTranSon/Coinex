import axios from "axios";
import { PRICE_URL } from "./config";

//TODO: Do filtering on symbols
//Two pages: Individual coin -> View variation of individual coin
//All coins -> View data on top 300 coins
class PriceParser {
  parseSingle(data) {
    return {
      time: (+data[0]) / 1000,
      open: +data[1],
      high: +data[2],
      low: +data[3],
      close: +data[4],
      volume: +data[5]
    };
  }

  parse(data) {
    return data.map((datum) => this.parseSingle(datum));
  }
}

class PriceRest {
  constructor() {
    this.parser = new PriceParser();
  }

  get(symbol, interval, startTime, endTime) {
    return (
      axios
        .get(PRICE_URL, {
          params: {
            symbol: symbol,
            interval: interval,
            startTime: startTime,
            endTime: endTime
          }
        })
        .then((response) => {
          const { data } = response;
          const parsedData = this.parser.parse(data);
          return parsedData
        })
    );
  }

  async getMultiple(symbols, interval, startTime, endTime) {
    return await (
      Promise
        .all(symbols.map(symbol => this.get(symbol, interval, startTime, endTime)))
        .then(data => {
          const parsedData = {};
          
          symbols.forEach((symbol, index) => {
            parsedData[symbol] = data[index];
          });

          return parsedData;
        })
    );
  }
}

export const getOneCoinPrice = async(symbols, interval, startTime, endTime) => {
    const coinData = await new PriceRest().getMultiple(symbols, interval, startTime, endTime);
    return coinData;
}