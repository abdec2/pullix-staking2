import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import { GlobalContext } from 'context/GlobalContext';

// chart options
const areaChartOptions = {
    chart: {
        height: 195,
        type: 'line',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        strokeDashArray: 10
    }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot }) => {
    const theme = useTheme();
    const { blockchainData } = useContext(GlobalContext)

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState(areaChartOptions);

    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: ["#F5331E"],
            xaxis: {
                categories:
                    ['1', '2', '3', '4', '5', '6', '7'],
                labels: {
                    style: {
                        colors: ["#000515"],
                        fontSize: '14px', 
                        fontFamily: 'Space Grotesk',
                        lineHeight: '17.86px', 
                        fontWeight: 400

                    }
                },
                axisBorder: {
                    show: true,
                    color: "#ccc"
                },
                tickAmount: 7
            },
            yaxis: {
                labels: {
                    formatter: function (value) {
                        return "" + value
                    },
                    style: {
                        colors: ["#000515"],
                        fontSize: '14px', 
                        fontFamily: 'Space Grotesk',
                        lineHeight: '17.86px', 
                        fontWeight: 400
                    }
                }
            },
            grid: {
                borderColor: '#d5d5d5',
                
            },
            tooltip: {
                theme: 'light'
            }
        }));
    }, []);

    const [series, setSeries] = useState([[
        {
            name: 'Staked',
            data: [31, 40, 28, 51, 42, 109, 100]
        }
    ]]);

    useEffect(() => {
        setSeries([
            {
                name: 'Staked',
                data: [31, 40, 28, 51, 42, 109, 100]
            }
        ]);
    }, [slot]);

    return <ReactApexChart options={options} series={series} type="line" height={205} />;
};

IncomeAreaChart.propTypes = {
    slot: PropTypes.string
};

export default IncomeAreaChart;
