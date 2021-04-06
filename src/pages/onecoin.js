import { Autocomplete } from "@material-ui/lab";
import { makeStyles, MenuItem, Select, TextField } from "@material-ui/core";
import React from "react"
import { getAllCoins } from "../api/coins";
import MyTypography from "../components/typography";
import LoadingScreen from "./loading";
import { MarginBottomLarge, MarginBottomSmall } from "../components/spacing";
import { getOneCoinPrice } from "../api/prices";
import CandleStickChart from "../components/chart/candlechart";


const OneCoinPage = () => {
    //References
    const coinsWithQuote = React.useRef();

    const setCoinsWithQuote = (item) => {
        coinsWithQuote.current = item;
    }

    const getSymbols = (coinName) => {
        const quotes = coinsWithQuote.current.coins_with_quote[coinName];
        const filteredQuotes = filterQuotes(quotes);
        return filteredQuotes.map(quote => coinName + quote);
    }

    const filterQuotes = (quotes) => {
        return quotes.filter(quote => ["BTC", "ETH", "USDT"].includes(quote));
    }
    
    //States
    const [loadingMessage, setLoadingMessage] = React.useState("Loading coins");
    const [coinNames, setCoinNames] = React.useState([]);
    const [coinData, setCoinData] = React.useState({});

    const [interval, setInterval] = React.useState("1d");
    const [currentCoin, setCurrentCoin] = React.useState("ETH");

    React.useEffect(async () => {
        const data = await getAllCoins();
        const { coins } = data;
        setCoinNames(coins);
        setCoinsWithQuote(data);
        setLoadingMessage(null);
    }, []);

    React.useEffect(async () => {
        //Prepare parameters
        if (currentCoin && coinsWithQuote.current) {
            //Set loading
            setLoadingMessage("Loading charts");

            const symbols = getSymbols(currentCoin);
            const startTime = null;
            const endTime = null;

            //Get the data
            const data = await getOneCoinPrice(symbols, interval, startTime, endTime);
            
            //Set coin data
            setCoinData(data);

            //Set not loading
            setLoadingMessage(null);
        }
    }, [currentCoin, interval]);

    //Handle user input
    const onCoinNameChanged = (event, newValue) => {
        setCurrentCoin(newValue);
    }

    const onIntervalChanged = (event) => {
        setInterval(event.target.value);
    }   

    return (
        <>
            {
                loadingMessage ? 
                <LoadingScreen message={loadingMessage}/> :
                <>
                    <MarginBottomLarge>
                        <MarginBottomSmall>
                            <MyTypography 
                                variant="h4" 
                                component="h4">Choose your coin</MyTypography>
                        </MarginBottomSmall>
                        <Autocomplete 
                            id="coin-names"
                            options={coinNames}
                            getOptionLabel={coin => coin}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Coin name" variant="outlined" />}
                            value={currentCoin}
                            onChange={onCoinNameChanged}/>
                    </MarginBottomLarge>

                    <MarginBottomLarge>
                        <MarginBottomSmall>
                            <MyTypography variant="h4" component="h4">Choose interval</MyTypography>
                        </MarginBottomSmall>
                        <Select
                            value={interval}
                            onChange={onIntervalChanged}>
                            <MenuItem value="1h">One hour</MenuItem>
                            <MenuItem value="1d">One day</MenuItem>
                            <MenuItem value="1w">One week</MenuItem>
                        </Select>
                    </MarginBottomLarge>

                    { 
                        loadingMessage ?
                        null :
                        <MarginBottomLarge>
                        {
                            Object
                                .keys(coinData)
                                .map((key, index) => {
                                    return (
                                        <MarginBottomSmall>
                                            <CandleStickChart data={coinData[key]} title={key} key={index}/>
                                        </MarginBottomSmall>
                                    )
                                })
                        }
                        </MarginBottomLarge>
                    }
                </>
            }
        </>
    )
}

export default OneCoinPage;