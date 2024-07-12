import React, { useEffect, useState } from 'react';
import { subDays, format } from 'date-fns';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Card, CardHeader, CardContent, Typography, Divider, LinearProgress } from '@mui/material';

//project import
import SalesLineCard from 'views/Dashboard/card/SalesLineCard';
import SalesLineCardData from 'views/Dashboard/card/sale-chart-1';
import RevenuChartCard from 'views/Dashboard/card/RevenuChartCard';
import RevenuChartCardData from 'views/Dashboard/card/revenu-chart';
import ReportCard from './ReportCard';

import { gridSpacing } from 'config.js';

// assets
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MonetizationOnTwoTone from '@mui/icons-material/MonetizationOnTwoTone';
import DescriptionTwoTone from '@mui/icons-material/DescriptionTwoTone';
import ThumbUpAltTwoTone from '@mui/icons-material/ThumbUpAltTwoTone';
import CalendarTodayTwoTone from '@mui/icons-material/CalendarTodayTwoTone';
import useProduct from 'api/useProduct';
import useCategory from 'api/useCategory';
import useOrder from 'api/useOrder';
import PieChart from '../PieChart';
import useOrderDetail from 'api/useOrderDetail';

// custom style
const FlatCardBlock = styled((props) => <Grid item sm={6} xs={12} {...props} />)(({ theme }) => ({
  padding: '25px 25px',
  borderLeft: '1px solid' + theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    borderLeft: 'none',
    borderBottom: '1px solid' + theme.palette.background.default
  },
  [theme.breakpoints.down('md')]: {
    borderBottom: '1px solid' + theme.palette.background.default
  }
}));

const Default = () => {
  const theme = useTheme();
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [totalCategoryByProduct, setTotalCategoryByProduct] = useState({});
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [chart, setChartTotal] = useState();

  const { getAll, getProduct } = useProduct();
  const { get } = useCategory();
  const { sastify } = useOrderDetail();

  const handleProduct = async () => {
    const { data, success } = await getAll();
    if (success) {
      setTotalProduct(data.data.length);
    }
  };

  const handleOrder = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const { data, success } = await sastify({
      startDate: formattedDate,
      endDate: formattedDate
    });
    if (success) {
      setTotalOrder(data.data.length);
      const totalUnitPrice = data.data.reduce((accumulator, currentOrder) => {
        return accumulator + currentOrder.UnitPrice;
      }, 0);
      setTotalValue(totalUnitPrice);
    }
  };

  const handleOrderPerDay = async () => {
    const today = new Date();
    const days = Array.from({ length: 2 }, (_, i) => subDays(today, i)).map((date) => format(date, 'yyyy-MM-dd'));

    const promises = days.map((day) => sastify({ startDate: day, endDate: day }));
    const results = await Promise.all(promises);

    if (results.every((result) => result.success)) {
      const totalUnitPrices = results.map((result) => {
        return result.data.data.reduce((accumulator, currentOrder) => {
          return accumulator + currentOrder.UnitPrice;
        }, 0);
      });

      const chartData = {
        type: 'line',
        height: 115,
        options: {
          chart: {
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          colors: ['#fff'],
          stroke: {
            curve: 'smooth',
            width: 3
          },
          yaxis: {
            min: 0,
            max: 1000000
          },
          tooltip: {
            theme: 'light',
            fixed: {
              enabled: false
            },
            x: {
              show: false
            },
            y: {
              title: {
                formatter: () => 'Sales/Order Per Day'
              }
            },
            marker: {
              show: false
            }
          }
        },
        series: [
          {
            name: 'series1',
            data: totalUnitPrices.reverse() // Đảm bảo dữ liệu được sắp xếp theo thứ tự ngày tăng dần
          }
        ]
      };

      setChartTotal(chartData); // Cập nhật chartData với dữ liệu mới
    }
  };

  console.log(chart);
  const handleCategory = async () => {
    const { data, success } = await get();
    if (success) {
      setTotalCategory(data.data.length);
      const promises = data.data.map(async (cate) => {
        const { data: cateGory, success: cateGorySuccess } = await getProduct(cate._id);
        if (cateGorySuccess) {
          return { categoryName: cate.CategoryName, total: cateGory.data.length };
        }
        return [{ categoryName: cate.CategoryName, total: 0 }];
      });
      const cateGoryData = await Promise.all(promises);
      setTotalCategoryByProduct(cateGoryData);
    }
  };
  useEffect(() => {
    handleProduct();
    handleCategory();
    handleOrder();
    handleOrderPerDay();
  }, []);
  let labels;
  let data;
  if (totalCategoryByProduct && totalCategoryByProduct.length > 0) {
    labels = totalCategoryByProduct.map((item) => item.categoryName);
    data = totalCategoryByProduct.map((item) => item.total);
  }
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalCategory}
              secondary="Category"
              color={theme.palette.warning.main}
              iconPrimary={MonetizationOnTwoTone}
              iconFooter={TrendingUpIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalProduct}
              secondary="Products"
              color={theme.palette.error.main}
              iconPrimary={CalendarTodayTwoTone}
              iconFooter={TrendingDownIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={totalCategory}
              secondary="Category"
              color={theme.palette.success.main}
              iconPrimary={DescriptionTwoTone}
              iconFooter={TrendingUpIcon}
            />
          </Grid>
          {/* <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary="500"
              secondary="Downloads"
              color={theme.palette.primary.main}
              footerData="1k download in App store"
              iconPrimary={ThumbUpAltTwoTone}
              iconFooter={TrendingUpIcon}
            />
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={8} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <SalesLineCard
                      chartData={chart}
                      title="Sales Per Day"
                      percentage="5%"
                      icon={<TrendingDownIcon />}
                      footerData={[
                        {
                          value: totalOrder,
                          label: 'Total order'
                        },
                        {
                          value: totalValue,
                          label: 'Today Sales'
                        }
                      ]}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sx={{ display: { md: 'block', sm: 'none' } }}>
                    <Card>
                      <CardContent sx={{ p: '0 !important' }}>
                        <Grid container alignItems="center" spacing={0}>
                          <FlatCardBlock>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item>
                                <Typography variant="subtitle2" align="left">
                                  REALTY
                                </Typography>
                              </Grid>
                              <Grid item sm zeroMinWidth>
                                <Typography variant="h5" sx={{ color: theme.palette.error.main }} align="right">
                                  -0.99
                                </Typography>
                              </Grid>
                            </Grid>
                          </FlatCardBlock>
                          <FlatCardBlock>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item>
                                <Typography variant="subtitle2" align="left">
                                  INFRA
                                </Typography>
                              </Grid>
                              <Grid item sm zeroMinWidth>
                                <Typography variant="h5" sx={{ color: theme.palette.success.main }} align="right">
                                  -7.66
                                </Typography>
                              </Grid>
                            </Grid>
                          </FlatCardBlock>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid> */}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                {totalCategoryByProduct && totalCategoryByProduct.length > 0 && <PieChart labels={labels} data={data} />}
                <span
                  style={{
                    margin: '10px 0',
                    textAlign: 'center'
                  }}
                >
                  {' '}
                  <p>Total category</p>
                </span>
                {/* <RevenuChartCard chartData={totalCategoryByProduct} /> */}
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item lg={4} xs={12}>
            <Card>
              <CardHeader
                title={
                  <Typography component="div" className="card-header">
                    Traffic Sources
                  </Typography>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Direct</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          80%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="direct" value={80} color="primary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Social</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          50%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Social" value={50} color="secondary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Referral</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          20%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Referral" value={20} color="primary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Bounce</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          60%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Bounce" value={60} color="secondary" />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item sm zeroMinWidth>
                        <Typography variant="body2">Internet</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" align="right">
                          40%
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <LinearProgress variant="determinate" aria-label="Internet" value={40} color="primary" />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Default;
