
import { Box, Typography } from "@mui/material"
import { Chart as ChartJS, CategoryScale, ArcElement, LinearScale, BarElement, Tooltip, Title, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import React, { useState, useEffect } from 'react';
import { provinces } from "../../app/provinces"
import { useGetGlobalStatisticsQuery } from "../../features/api/apiSlice";
import { OnlinePredictionSharp } from "@mui/icons-material";

ChartJS.register(
CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend, ArcElement
)


const PieChart = ({
    pieStats, dataLabel
}) => {

    const [farmers, setFarmers] = useState([]);
    const [farmlands, setFarmlands] = useState([])
    const [pieFarmers, setPieFarmers] = useState([]);
    

    useEffect(()=>{
            
        let newFarmlands = 0;
        let oldFarmlands = 0;
        let familyFarmers = 0;
        let commercialFarmers = 0;
        let unknownFarmers = 0;

        setFarmers(pieStats);
        if (farmers){
            farmers?.map(farmer=>{
                if (farmer?.farmlands && farmer?.farmlands.length > 0) {
                    farmer?.farmlands?.map(farmland=>{
                        if (farmland?.farmlandType === 'pomar novo'){
                            newFarmlands += 1;
                        }
                        else {
                            oldFarmlands += 1;
                        }
                        return farmland;
                    })
                }

                if (farmer?.category === 'Produtor familiar') {
                    familyFarmers += 1;
                }
                else if (farmer?.category === 'Produtor comercial'){
                    commercialFarmers += 1;
                }
                else {
                    unknownFarmers += 1;
                }

                return farmer;
            })

        }

        setFarmlands(new Array(newFarmlands, oldFarmlands));
        setPieFarmers(new Array(familyFarmers, commercialFarmers, unknownFarmers));

        }, [ farmers  ]);

    const data = {
        labels: dataLabel === "farmlands" ? [   
            'Novos',
            'Antigos',
        ] : [   
            'Familiares',
            'Comerciais',
            'Desconhecidos'
        ],
        datasets: [{
            label: 'Pomares',
            data: dataLabel === "farmlands" ? farmlands : pieFarmers,
            backgroundColor: dataLabel === "farmlands" ? [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            ] : [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(120, 120, 120)',
            ],
            hoverOffset: 4
        }]
    };

    const options = {
    responsive: true,
    plugins: {
        labels: {

        },
        legend: {
            postion: "top"
        },
        datalabels: {
            display: true,
            color: "white"
        },
        title: {
            display: true,
            text: dataLabel === "farmlands" ? "Pomares" : "Produtores"
        }
    },
    elements: {
        bar: {
            borderWidth: 2,
        }
    }
  }
            
  return (
    <Box sx={{ margin: "auto", padding: 1 }}>
        <Pie 
            data={data}
            options={options}
        />
    </Box>
  )
}

export default PieChart