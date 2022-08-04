import { Box, Typography } from "@mui/material"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import React, { useState, useEffect } from 'react';
import { provinces } from "../../app/provinces"
import { useGetGlobalStatisticsQuery } from "../../features/api/apiSlice";

ChartJS.register(
CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend
)

const BarChart = ({
    barChartData, barChartOptions, barChartTitle
}) => {

    const [chartData, setChartData] = useState({
        datasets: [],
    });
    const [chartOptions, setChartOptions] = useState({});

    let {
        data: stats,
        isLoading: isStatsLoading,
        isFetching: isStatsFetching,
        isSuccess: isStatsSuccess,
        isError: isStatsError,
        error: statsError,
    } = useGetGlobalStatisticsQuery();

    useEffect(()=>{
        if (isStatsSuccess){

            let existingProvinces = Object?.keys(stats);
            let farmers = new Array(10).fill(0);
            let farmlands = new Array(10).fill(0);
            
            for (let i = 0; i < provinces.length; i++){
                if (existingProvinces?.indexOf(provinces[i]) >= 0) {
                    farmers[i] = stats[provinces[i]]?.farmers ? stats[provinces[i]]?.farmers : 0;
                    farmlands[i] = stats[provinces[i]]?.farmlands ? stats[provinces[i]]?.farmlands : 0;
                }
                else {
                    farmers[i] = 0;
                    farmlands[i] = 0;
                }
            }
                    setChartData({
                        labels: provinces,
                        datasets: [{
                            label: "Produtores",
                            data: farmers,
                            borderColor: [
                                "rgb(53, 162, 235)",
                            ],
                            backgroundColor: [
                                "rgba(53, 162, 235, 1)",
                            ]
                        },
                        {
                            label: "Pomares",
                            data: farmlands,
                            borderColor: [
                                "rgb(103, 42, 200)",
                            ],
                            backgroundColor: [
                                "rgba(103, 42, 200, 1)",
                            ]
                        }
                        
                    ]
                });
                
                setChartOptions({
                    indexAxis: 'y',
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top"
                        },
                        title: {
                            display: true,
                            text: "Produtores e pomares registados"
                        }
                    },
                    elements: {
                        bar: {
                            borderWidth: 2,
                        }
                    }
                })
            }
            }, [isStatsError, isStatsSuccess])
            
  return (
    <Box sx={{ margin: "auto", padding: 1 }}>
        <Bar 
            height={"auto"}
            width={"100%"}
            options={chartOptions}
            data={chartData}
        />
    </Box>
  )
}

export default BarChart