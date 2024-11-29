"use client"
import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-stockcharts';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

const fetchChartData = async () => {
    const rawdata = await fetch("https://static.infragistics.com/xplatform/data/stocks/stockGoogle.json")
    const data = await rawdata.json()
    var dps1 = [], dps2 = [], dps3 = [];
    for (var i = 0; i < data.length; i++) {
        dps1.push({
            x: new Date(data[i].date),
            y: [
                Number(data[i].open),
                Number(data[i].high),
                Number(data[i].low),
                Number(data[i].close)
            ]
        });
        dps2.push({ x: new Date(data[i].date), y: Number(data[i].volume) });
        dps3.push({ x: new Date(data[i].date), y: Number(data[i].close) });
    }
    return {
        isLoaded: true,
        dataPoints1: dps1,
        dataPoints2: dps2,
        dataPoints3: dps3
    };
}

//Create StockChart
const Charts = () => {
    const [isLoading, setLoading] = useState(false)
    const [dp1, setdp1] = useState<{x: Date; y: number[]}[]>([])
    const [dp2, setdp2] = useState<{x: Date; y: number}[]>([])
    const [dp3, setdp3] = useState<{x: Date; y: number}[]>([])
    useEffect(() => {
        (async function() {
            setLoading(true);
            const data = await fetchChartData();
            setdp1(data.dataPoints1);
            setdp2(data.dataPoints2);
            setdp3(data.dataPoints3);
            setLoading(false);
        })()
    },[])
    const options = {
        theme: "light2",
        title:{
          text:"React StockChart with Date-Time Axis"
        },
        subtitles: [{
          text: "Price-Volume Trend"
        }],
        charts: [{
          axisX: {
            lineThickness: 5,
            tickLength: 0,
            labelFormatter: function() {
              return "";
            },
            crosshair: {
              enabled: true,
              snapToDataPoint: true,
              labelFormatter: function() {
                return "";
              }
            }
          },
          axisY: {
            title: "Stock Price",
            prefix: "Rs.",
            tickLength: 0
          },
          toolTip: {
            shared: true
          },
          data: [{
            name: "Price (in Rupees)",
            yValueFormatString: "#,###.##",
            type: "candlestick",
            dataPoints : dp1
          }]
        },{
          height: 100,
          axisX: {
            crosshair: {
              enabled: true,
              snapToDataPoint: true
            }
          },
          axisY: {
            title: "Volume",
            tickLength: 0
          },
          toolTip: {
            shared: true
          },
          data: [{
            name: "Volume",
            yValueFormatString: "#,###.##",
            type: "column",
            dataPoints : dp2
          }]
        }],
        navigator: {
          data: [{
            dataPoints: dp3
          }],
          slider: {
            minimum: new Date("2014-05-01"),
            maximum: new Date("2014-07-01")
          }
        }
      };
    const containerProps = {
        width: "80%",
        height: "450px",
        margin: "auto"
    };
    return (
        <div>
            <CanvasJSStockChart
                options={options}
                containerProps={containerProps}
            />
        </div>
    );
};

export default Charts;