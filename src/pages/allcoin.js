import React from "react";
import { MenuItem, Select, Grid } from "@material-ui/core"
import { MarginBottomLarge, MarginBottomSmall } from "../components/spacing"
import MyTypograhpy from "../components/typography"
import { getCoinsWithQuote } from "../api/coins";
import LoadingScreen from "./loading";
import { Pagination } from "@material-ui/lab";
import { getOneCoinPrice } from "../api/prices";

import CandleStickChart from "../components/chart/candlechart";

const COINS_PER_PAGE = 60;

const AllCoinsPage = () => {
    //References
    const coinsWithQuotes = React.useRef();

    const setCoinsWithQuotes = (data) => {
        coinsWithQuotes.current = data;
    }

    const getCoins = (quote, sorted) => {
        let data;

        if (sorted) {
            data = [...coinsWithQuotes.current[quote]];
            data = data.sort();
        } else {
            data = coinsWithQuotes.current[quote];
        }

        return data.map(coin => coin + quote);
    }

    //State
    const [quote, setQuote] = React.useState("BTC");
    const [loadingMessage, setLoadingMessage] = React.useState(null);
    const [priceLoading, setPriceLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState();
    const [coinData, setCoinData] = React.useState({});
    const [interval, setInterval] = React.useState("1d");
    const [sorted, setSorted] = React.useState(false);

    const onQuoteChanged = (event) => {
        setQuote(event.target.value);
    };

    const onPageChanged = (event, newValue) => {
        setCurrentPage(newValue);
    }
    
    const onIntervalChanged = (event) => {
        setInterval(event.target.value);
    }

    const onSortedChanged = (event) => {
        const value = event.target.value;

        if (value === "None") {
            setSorted(false);
        } else {
            setSorted(true);
        }
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
    }, [quote, interval, sorted, currentPage]);

    const initialize = async () => {
        //On quote changed -> Retrieve the coins
        if (coinsWithQuotes.current) {
            //Get the symbols
            const symbols = getCoins(quote, sorted);

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
                        <Grid container>
                            <Grid item xs={4}>
                                <MarginBottomSmall>
                                    <MyTypograhpy variant="h4" component="h4">Choose variation</MyTypograhpy>
                                </MarginBottomSmall>

                                <Select
                                    value={quote}
                                    onChange={onQuoteChanged}>
                                    <MenuItem value="BTC">BTC</MenuItem>
                                    <MenuItem value="ETH">ETH</MenuItem>
                                    <MenuItem value="USDT">USDT</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item xs={4}>
                                <MarginBottomSmall>
                                    <MyTypograhpy variant="h4" component="h4">Choose interval</MyTypograhpy>
                                </MarginBottomSmall>

                                <Select
                                    value={interval}
                                    onChange={onIntervalChanged}>
                                    <MenuItem value="1h">One hour</MenuItem>
                                    <MenuItem value="4h">Four hours</MenuItem>
                                    <MenuItem value="1d">One day</MenuItem>
                                    <MenuItem value="1w">One week</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item xs={4}>
                                <MarginBottomSmall>
                                    <MyTypograhpy variant="h4" component="h4">Sort by</MyTypograhpy>
                                </MarginBottomSmall>

                                <Select
                                    value={sorted ? "A-Z" : "None"}
                                    onChange={onSortedChanged}>
                                    <MenuItem value="None">None</MenuItem>
                                    <MenuItem value="A-Z">A-Z</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
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