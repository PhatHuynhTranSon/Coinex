import { HighPrecisionChart, LowPrecisionChart }from "./basechart";

const assignPrecision = (title) => {
    const postfix = title.substring(title.length - 3, title.length);

    switch (postfix) {
        case "ETH":
        case "BTC":
            return true;
        case "USDT":
            return false;
        default:
            return false;
    }
}

const CandleStickChart = ({ title, data }) => {
    //Check the symbol
    const isHighPrecision = assignPrecision(title);

    //Draw chart
    if (isHighPrecision) {
        return <HighPrecisionChart title={title} data={data}/>
    } else {
        return <LowPrecisionChart title={title} data={data}/>
    }
}   

export default CandleStickChart;