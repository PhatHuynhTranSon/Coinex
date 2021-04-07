import axios from "axios";
import { COINS_URL } from "./config";


class BaseQuoteParser {
    parseDatum(datum) {
        const { quoteAsset, baseAsset } = datum;
        return {
            "quote": quoteAsset,
            "base": baseAsset
        };
    }

    parse(data) {
        const { symbols } = data;
        const parsedData = {};

        for (const symbol of symbols) {
            const { quote, base } = this.parseDatum(symbol);

            if (base in parsedData) {
                parsedData[base].push(quote);
            } else {
                parsedData[base] = [quote]
            }
        }

        return parsedData;
    }
}

class QuoteBaseParser {
    parseDatum(datum) {
        const { quoteAsset, baseAsset } = datum;
        return {
            "quote": quoteAsset,
            "base": baseAsset
        };
    }

    parse(data) {
        const { symbols } = data;
        const parsedData = { "BTC": [], "ETH": [] };

        for (const symbol of symbols) {
            const { quote, base } = this.parseDatum(symbol);

            if (quote === "BTC" || quote === "ETH") {
                parsedData[quote].push(base);
            }
        }

        return parsedData;
    }
}

class CoinRest {
    async get(parser) {
        return await (
            axios.get(COINS_URL)
                .then(response => {
                    const { data } = response;
                    const parsedData = parser.parse(data);
                    return parsedData;
                })
        );
    }
}

export const getAllCoins = async () => {
    const coinsWithQuote = await new CoinRest().get(new BaseQuoteParser());
    const coins = Object.keys(coinsWithQuote);
    return {
        "coins": coins,
        "coins_with_quote": coinsWithQuote
    }
}   

export const getCoinsWithQuote = async () => {
    const quotesWithCoins = await new CoinRest().get(new QuoteBaseParser());
    return quotesWithCoins;
}