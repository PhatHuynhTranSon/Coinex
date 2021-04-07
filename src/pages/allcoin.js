import React from "react";
import { MenuItem, Select, Grid } from "@material-ui/core"
import { MarginBottomLarge, MarginBottomSmall } from "../components/spacing"
import MyTypograhpy from "../components/typography"
import { getCoinsWithQuote } from "../api/coins";
import LoadingScreen from "./loading";
import { Pagination } from "@material-ui/lab";
import { getOneCoinPrice } from "../api/prices";

import CandleStickChart from "../components/chart/candlechart";

const COINS_PER_PAGE = 10;

const AllCoinsPage = () => {
    //References
    const coinsWithQuotes = React.useRef();

    const setCoinsWithQuotes = (data) => {
        coinsWithQuotes.current = data;
    }

    const getCoins = (quote) => {
        const data = coinsWithQuotes.current[quote];
        return data.map(coin => coin + quote);
    }

    //State
    const [quote, setQuote] = React.useState("BTC");
    const [loadingMessage, setLoadingMessage] = React.useState(null);
    const [priceLoading, setPriceLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState();
    const [coinData, setCoinData] = React.useState({});

    const onQuoteChanged = (event) => {
        setQuote(event.target.value);
    };

    const onPageChanged = (event, newValue) => {
        setCurrentPage(newValue);
    }

    React.useEffect(async () => {
        setLoadingMessage("Loading coins")
        const data = await getCoinsWithQuote();
        setCoinsWithQuotes(data);
        setLoadingMessage(null);
        initialize();
    }, []);

    React.useEffect(async() => {
        //On quote changed -> Retrieve the coins
        initialize();
    }, [quote, currentPage]);

    const initialize = async () => {
        //On quote changed -> Retrieve the coins
        if (coinsWithQuotes.current) {
            //Get the symbols
            const symbols = getCoins(quote);

            //Set the total page
            const totalPages = Math.floor(symbols.length / COINS_PER_PAGE);
            setTotalPages(totalPages);

            //Get the starting positon
            const startPage = currentPage;
            const filteredSymbols = symbols.slice(startPage, startPage + COINS_PER_PAGE);

            //Get the coin price data
            setPriceLoading(true);
            const priceData = await getOneCoinPrice(filteredSymbols, "1d", null, null);
            setPriceLoading(false);
            setCoinData(priceData);
        }
    }

    return (
        <>
            {
                loadingMessage ?
                <LoadingScreen message={loadingMessage}/> :
                <>
                    <MarginBottomLarge>
                        <MarginBottomSmall>
                            <MyTypograhpy variant="h4" component="h4">Choose variation</MyTypograhpy>
                        </MarginBottomSmall>

                        <Select
                            value={quote}
                            onChange={onQuoteChanged}>
                            <MenuItem value="BTC">BTC</MenuItem>
                            <MenuItem value="ETH">ETH</MenuItem>
                        </Select>
                    </MarginBottomLarge>

                    <MarginBottomLarge>
                    {
                        priceLoading ? 
                        <LoadingScreen message="Loading price graphs"/> :
                        <Grid container>
                        {
                            Object
                            .keys(coinData)
                            .map((key, index) => {
                                return (
                                    <Grid item xs={4} key={index}>
                                        <CandleStickChart data={coinData[key]} title={key}/>
                                    </Grid>
                                )
                            })
                        }
                        </Grid>
                    }
                    </MarginBottomLarge>

                    <Pagination 
                        count={totalPages}
                        onChange={onPageChanged}/>
                </>
            }
        </>
    );
}

export default AllCoinsPage;