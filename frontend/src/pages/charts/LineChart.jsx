
import { Box , Typography} from '@mui/material'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend,
LineController, LineElement, PointElement,    } from "chart.js";
import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from 'react';
import { provinces } from "../../app/provinces"
import { useGetGlobalStatisticsQuery } from "../../features/api/apiSlice";

ChartJS.register(
CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend,
LineController, LineElement, PointElement
)

const LineChart = ({
    // barChartData, barChartOptions, barChartTitle
    monthlyVisits
}) => {

    const [chartData, setChartData] = useState({
        datasets: [],
    });
    const [chartOptions, setChartOptions] = useState({});

  useEffect(()=>{
    if (monthlyVisits){

      // let labels = Object?.keys(monthlyVisits);
      // let farmers = new Array(10).fill(0);
      // let farmlands = new Array(10).fill(0);
      
      // for (let i = 0; i < provinces.length; i++){
      //     if (existingProvinces?.indexOf(provinces[i]) >= 0) {
      //         farmers[i] = stats[provinces[i]]?.farmers ? stats[provinces[i]]?.farmers : 0;
      //         farmlands[i] = stats[provinces[i]]?.farmlands ? stats[provinces[i]]?.farmlands : 0;
      //     }
      //     else {
      //         farmers[i] = 0;
      //         farmlands[i] = 0;
      //     }
      // }
      //         setChartData({
      //             labels: provinces,
      //             datasets: [{
      //                 label: "Produtores",
      //                 data: farmers,
      //                 borderColor: [
      //                     "rgb(53, 162, 235)",
      //                 ],
      //                 backgroundColor: [
      //                     "rgba(53, 162, 235, 1)",
      //                 ]
      //             },
      //             {
      //                 label: "Pomares",
      //                 data: farmlands,
      //                 borderColor: [
      //                     "rgb(103, 42, 200)",
      //                 ],
      //                 backgroundColor: [
      //                     "rgba(103, 42, 200, 1)",
      //                 ]
      //             }
                  
      //         ]
      //     });
          
      //     setChartOptions({
      //         indexAxis: 'y',
      //         responsive: true,
      //         plugins: {
      //             legend: {
      //                 position: "top"
      //             },
      //             title: {
      //                 display: true,
      //                 text: "Produtores e pomares registados"
      //             }
      //         },
      //         elements: {
      //             bar: {
      //                 borderWidth: 2,
      //             }
      //         }
      //     })
      }
  }, [
    monthlyVisits
  ])

  const data = {
  labels: [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Out",
  "Nov",
  "Dez",
],
  datasets: [{
    label: 'Monitorias',
    data: monthlyVisits,
    fill: false,
    pointRadius: 3.0,
    pointBackgroundColor: 'rgba(255, 66, 66, 0.8)',
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgb(75, 192, 192)',
    tension: 0.1,
    pointHoverRadius: 12,
    pointHitRadius: 30,
    pointBorderWidth: 1,
  }]
};

const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: `Ano: ${new Date().getFullYear()}`
          }
        },
        scales: {
            x: {
              id: 'x',
            },
            y: {
              id: 'y',
            }
        }}
            
  return (
    <Box sx={{ margin: "auto", padding: 1 }}>
        <Line 
          height={"auto"}
          width={"100%"}
          options={options}
          data={data}
        />
    </Box>
  )
}

export default LineChart