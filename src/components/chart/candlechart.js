import React from "react";
import { createChart } from "lightweight-charts";
import MyTypograhpy from "../typography";
import styled from "styled-components";
import { MarginBottomSmall } from "../spacing";

const Wrapper = styled.div`
    width: 100%;
`

const CandleStickChart = ({ title, data, key }) => {
    //Reference
    const divRef = React.useRef();
    const wrapperRef = React.useRef();
    const divId = "container-id-" + title;
    const chartRef = React.useRef();

    //On mount
    React.useEffect(() => {
        //Get width
        const width = wrapperRef.current.offsetWidth;

        //Create and save chart
        const chart = createChart(divId, { width, height: 400 });
        chartRef.current = chart;

        //Create series and set data
        const candlestickSeries = chart.addCandlestickSeries();
        candlestickSeries.setData(data);

        //On unmount -> Clean up
        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        }
    });

    //Render
    return (
        <Wrapper ref={wrapperRef}>
            <MarginBottomSmall>
                <MyTypograhpy variant="h5" component="h5">{ title }</MyTypograhpy>
            </MarginBottomSmall>
            <div 
                ref={divRef}
                id={divId}/>
        </Wrapper>
    )
}   

export default CandleStickChart;