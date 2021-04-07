import React from "react";
import { getAllCoins } from "../api/coins";
import { MarginBottomLarge, MarginBottomSmall } from "../components/spacing"
import MyTypograhpy from "../components/typography"
import LoadingScreen from "./loading";
import { 
    Grid, 
    Card, 
    Select, 
    MenuItem, 
    TextField, 
    makeStyles, 
    Button,  
    ListItemText, 
    List, 
    ListItem, 
    ListItemIcon,
    ListItemSecondaryAction,
    IconButton,
    ListItemAvatar,
    Avatar
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { addCoinToPreferences, getCoinPreferences, removeCoinFromPreferences } from "../api/storage";
import { MonetizationOn, Delete } from "@material-ui/icons";

import { getOneCoinPrice } from "../api/prices";

import CandleStickChart from "../components/chart/candlechart";

const useStyles = makeStyles({
    card: {
        padding: "2rem",
        margin: "2rem"
    }
})

const ProfilePage = () => {
    //Styles
    const classes = useStyles();

    //References
    const coinsWithsQuotes = React.useRef({});

    const setCoinsWithsQuotes = (data) => {
        coinsWithsQuotes.current = data;
    }

    const getQuotes = (coin) => coinsWithsQuotes.current.coins_with_quote[coin];
    const getCoins = () => coinsWithsQuotes.current.coins;

    //States
    const [loadingCoin, setLoadingCoins] = React.useState(true);
    const [currentCoin, setCurrentCoin] = React.useState("ETH");
    const [currentQuote, setCurrentQuote] = React.useState("BTC");
    const [preferences, setPreferences] = React.useState([]);

    const [coinData, setCoinData] = React.useState({});
    const [loadingPrice, setLoadingPrice] = React.useState(false);

    //Effects
    React.useEffect(async () => {
        //Get coin data
        setLoadingCoins(true);
        const data = await getAllCoins();
        setCoinsWithsQuotes(data);

        //Get preferences
        setPreferences(getCoinPreferences());
        setLoadingCoins(false);
    }, []);

    React.useEffect(async () => {
        drawChart();
    }, [preferences]);

    const drawChart = async () => {
        //Get data
        setLoadingPrice(true);
        const data = await getOneCoinPrice(preferences, "1d", null, null);
        setCoinData(data);
        setLoadingPrice(false);
    }

    const onCoinChanged = (event, newValue) => {
        const coin = newValue;

        if (coin) {
            setCurrentCoin(coin);
            setCurrentQuote(getQuotes(coin));
        }
    }

    const onQuoteChanged = (event) => {
        const quote = event.target.value;
        setCurrentQuote(quote);
    }

    const onNewCoinAdded = () => {
        //Add coin to preferences
        addCoinToPreferences(currentCoin + currentQuote);

        //Set preferences
        setPreferences(getCoinPreferences());
    }

    const onRemoveButtonClicked = (coin) => {
        removeCoinFromPreferences(coin);
        setPreferences(getCoinPreferences());
    }

    return (
        <>
            {
                loadingCoin ? 
                <LoadingScreen message="Loading coins"/> :
                <>
                    <MarginBottomLarge>
                        <MarginBottomSmall>
                            <MyTypograhpy variant="h4" component="h4">
                                View coins according to your preferences
                            </MyTypograhpy>
                        </MarginBottomSmall>
                        <MyTypograhpy>
                            You can choose to add many different coin to personal references
                        </MyTypograhpy>
                    </MarginBottomLarge>

                    <MarginBottomLarge>
                        <Grid container>
                            <Grid item xs={8}>
                                <Grid container spacing={4}>
                                {
                                    loadingPrice ?
                                    <LoadingScreen message="Loading charts"/> :
                                    Object
                                        .keys(coinData)
                                        .map((coin, index) => {
                                            return (
                                                <Grid item xs={6} key={index}>
                                                    <CandleStickChart data={coinData[coin]} title={coin}/>
                                                </Grid>
                                            )
                                        })
                                }
                                </Grid>
                            </Grid>

                            <Grid item xs={4}>
                                <Card classes={{ root: classes.card }}>
                                    <MyTypograhpy variant="h5" component="h5">Preferences</MyTypograhpy>
                                    {
                                        preferences.length > 0 ?
                                        <List>
                                        {
                                            preferences.map((coin, index) => {
                                                return ( 
                                                    <ListItem button key={index}>
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <MonetizationOn />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText>{ coin }</ListItemText>
                                                        <ListItemSecondaryAction>
                                                            <IconButton 
                                                                edge="end" 
                                                                aria-label="delete"
                                                                onClick={() => onRemoveButtonClicked(coin)}>
                                                            <Delete />
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                );
                                            })
                                        }
                                        </List> : <MyTypograhpy>No coin added yet</MyTypograhpy>
                                    }
                                </Card>
                                <Card classes={{ root: classes.card }}>
                                    <MarginBottomSmall>
                                        <MyTypograhpy variant="h5" component="h5">Add coin</MyTypograhpy>
                                    </MarginBottomSmall>

                                    <MarginBottomSmall>
                                        <MarginBottomSmall>
                                            <MyTypograhpy>
                                                Choose the coin name
                                            </MyTypograhpy>
                                        </MarginBottomSmall>

                                        <Autocomplete 
                                            id="coin-names"
                                            options={getCoins()}
                                            getOptionLabel={coin => coin}
                                            renderInput={(params) => <TextField {...params} label="Coin name" variant="outlined" />}
                                            value={currentCoin}
                                            onChange={onCoinChanged}/>
                                    </MarginBottomSmall>

                                    <MarginBottomSmall>
                                        <MarginBottomSmall>
                                            <MyTypograhpy>
                                                Choose the coin quote
                                            </MyTypograhpy>
                                        </MarginBottomSmall>

                                        <Select
                                            value={currentQuote}
                                            onChange={onQuoteChanged}>
                                        {
                                            getQuotes(currentCoin)
                                                .map((quote, index) => {
                                                    return <MenuItem value={quote} key={index}>{ quote }</MenuItem>
                                                })
                                        }
                                        </Select>
                                    </MarginBottomSmall>

                                    <Button 
                                        color="primary" 
                                        variant="contained"
                                        onClick={onNewCoinAdded}>
                                        Add coin
                                    </Button>
                                </Card>
                            </Grid>
                        </Grid>
                    </MarginBottomLarge>
                </>
            }
        </>
    )
}

export default ProfilePage;