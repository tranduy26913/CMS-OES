import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from 'utils/formatNumber';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
//   '& .apexcharts-legend': {
//     height: LEGEND_HEIGHT,
//     alignContent: 'center',
//     position: 'relative !important',
//     borderTop: `solid 1px ${theme.palette.divider}`,
//     top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
//   },
}));

// ----------------------------------------------------------------------

BarChartPoint.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartColors: PropTypes.arrayOf(PropTypes.string),
  chartData: PropTypes.array,
};

export default function BarChartPoint({ title, subheader,seriesData, chartColors, chartData, ...other }) {
  const theme = useTheme();

  const series= [{
    name: 'Doanh thu',
    type: 'column',
    data: seriesData.map(e=>e.amount)
  }, {
    name: 'Số lượng',
    type: 'line',
    data: seriesData.map(e=>e.count)
  }]

  const labels = seriesData.map(e=>e.label)
  
  const chartOptions =  {
    //colors: chartColors,
    labels: labels,
    stroke: { width: [0, 4]},
    //legend: { floating: true, horizontalAlign: 'center' },
    title: {
      text: 'Biểu đồ doanh thu theo ngày',
      align:'center'
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1]
    },
    xaxis: {
      type: 'datetime'
    },
    height:'70%',
    yaxis: [{
      title: {
        text: 'Số lượng',
      },
    
    }, {
      opposite: true,
      title: {
        text: 'Doanh thu'
      }
    }]
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="line" series={series} options={chartOptions} 
        height={280}
         />
      </ChartWrapperStyle>
    </Card>
  );
}
