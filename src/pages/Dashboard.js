import {
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  WindmillContext,
} from "@windmill/react-ui";
import LineChart from "components/chart/LineChart/LineChart";
import PieChart from "components/chart/Pie/PieChart";
import CardItem from "components/dashboard/CardItem";
import CardItemTwo from "components/dashboard/CardItemTwo";
import ChartCard from "components/chart/ChartCard";
import OrderTable from "components/order/OrderTable";
import TableLoading from "components/preloader/TableLoading";
import NotFound from "components/table/NotFound";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import * as dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck } from "react-icons/fi";
import { ImCreditCard, ImStack } from "react-icons/im";
import OrderServices from "services/OrderServices";
import ProductServices from 'services/ProductServices';
import SyncData from "components/common/SyncProgress";
//internal import

const Dashboard = () => {
  const { globalSetting } = useFilter();
  const { mode } = useContext(WindmillContext);

  dayjs.extend(isBetween);
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);

  const { currentPage, handleChangePage, lang } = useContext(SidebarContext);
  const [products, setproducts] = useState([]);
  // react hook
  const [todayOrderAmount, setTodayOrderAmount] = useState(0);
  const [yesterdayOrderAmount, setYesterdayOrderAmount] = useState(0);
  const [salesReport, setSalesReport] = useState([]);
  const [todayCashPayment, setTodayCashPayment] = useState(0);
  const [todayCardPayment, setTodayCardPayment] = useState(0);
  const [todayCreditPayment, setTodayCreditPayment] = useState(0);
  const [yesterdayCashPayment, setYesterdayCashPayment] = useState(0);
  const [yesterdayCardPayment, setYesterdayCardPayment] = useState(0);
  const [yesterdayCreditPayment, setYesterdayCreditPayment] = useState(0);

  const { data: bestSellerProductChart, loading: loadingBestSellerProduct } =
    useAsync(OrderServices.getBestSellerProductChart);

  const { data: dashboardRecentOrder, loading: loadingRecentOrder } = useAsync(
    () => OrderServices.getDashboardRecentOrder({ page: currentPage, limit: 8 })
  );

  const { data: dashboardOrderCount, loading: loadingOrderCount } = useAsync(
    OrderServices.getDashboardCount
  );

  const { data: dashboardOrderAmount, loading: loadingOrderAmount } = useAsync(
    OrderServices.getDashboardAmount
  );

  const currency = globalSetting?.default_currency || "$";

  // console.log("dashboardOrderCount", dashboardOrderCount);

  const { dataTable, serviceData } = useFilter(dashboardRecentOrder?.orders);

  const { t } = useTranslation();

  useEffect(() => {
  const getproductdata = async () => {

    const all_products =  await ProductServices.getshopifyproduct();
   
    setproducts(all_products.nodes);
    console.log(products);
    }
      getproductdata();
  }, [products]);
  

  // use effect for reading data file through url

  const [jsonData, setJsonData] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('https://storage.googleapis.com/shopify-tiers-assets-prod-us-east1/f2t0nq1ydgih78cwfmww8xkon4ly?GoogleAccessId=assets-us-prod%40shopify-tiers.iam.gserviceaccount.com&Expires=1688625588&Signature=FG9zH5H%2BGOiJNWujiwaN%2BuwH4wmxMrLCU40V8jsgjKQWTHQCsQyyVG%2ByLWyutEgNYmL6CxX54nTFqrWzD2Mrbtx2q%2FCY8ZWN3MSmSF0NjijLd49LVQxcyY1j%2Flh4JjQESGC0cUMexjycZCXnMi3lpbibellhZiiq6CTISScSNB5hSSPHDwTeuT7DeZ%2BUEtGGkpZvqEu0uS9idvmLK9BXrtq6tApPZAbYJQuPvBMtICyr8KVpga7ROxcLCEo%2FkbZzfkA5DcqOA4Cxf2rXKXeiXsOVwvkl9xXHdMXcO1EY6n3IjZqwZQoE1bdUSf03gW0fPuX65kZo4G57rfc5EtglqA%3D%3D&response-content-disposition=attachment%3B+filename%3D%22bulk-3229798924600.jsonl%22%3B+filename%2A%3DUTF-8%27%27bulk-3229798924600.jsonl&response-content-type=application%2Fjsonl');
  //       const reader = response.body.getReader();
  //       let data = '';
  //       let done = false;

  //       while (!done) {
  //         const { value, done: readerDone } = await reader.read();

  //         if (readerDone) {
  //           done = true;
  //           break;
  //         }

  //         const chunk = new TextDecoder('utf-8').decode(value);
  //         data += chunk;

  //         const lines = data.split('\n');
  //         data = lines.pop();

  //         for (const line of lines) {
  //           const jsonLine = JSON.parse(line);
  //           setJsonData((prevData) => [...prevData, jsonLine]);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);


  // use effect for reading data file through url

  useEffect(() => {
    // today orders show
    const todayOrder = dashboardOrderAmount?.ordersData?.filter((order) =>
      dayjs(order.updatedAt).isToday()
    );
    //  console.log('todayOrder',dashboardOrderAmount.ordersData)
    const todayReport = todayOrder?.reduce((pre, acc) => pre + acc.total, 0);
    setTodayOrderAmount(todayReport);

    // yesterday orders
    const yesterdayOrder = dashboardOrderAmount?.ordersData?.filter((order) =>
      dayjs(order.updatedAt).set(-1, "day").isYesterday()
    );

    const yesterdayReport = yesterdayOrder?.reduce(
      (pre, acc) => pre + acc.total,
      0
    );
    setYesterdayOrderAmount(yesterdayReport);

    // sales orders chart data
    const salesOrderChartData = dashboardOrderAmount?.ordersData?.filter(
      (order) =>
        dayjs(order.updatedAt).isBetween(
          new Date().setDate(new Date().getDate() - 7),
          new Date()
        )
    );

    salesOrderChartData?.reduce((res, value) => {
      let onlyDate = value.updatedAt.split("T")[0];

      if (!res[onlyDate]) {
        res[onlyDate] = { date: onlyDate, total: 0, order: 0 };
        salesReport.push(res[onlyDate]);
      }
      res[onlyDate].total += value.total;
      res[onlyDate].order += 1;
      return res;
    }, {});

    setSalesReport(salesReport);

    const todayPaymentMethodData = [];
    const yesterDayPaymentMethodData = [];

    // today order payment method
    dashboardOrderAmount?.ordersData?.filter((item, value) => {
      if (dayjs(item.updatedAt).isToday()) {
        if (item.paymentMethod === "Cash") {
          let cashMethod = {
            paymentMethod: "Cash",
            total: item.total,
          };
          todayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Credit") {
          const cashMethod = {
            paymentMethod: "Credit",
            total: item.total,
          };

          todayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Card") {
          const cashMethod = {
            paymentMethod: "Card",
            total: item.total,
          };

          todayPaymentMethodData.push(cashMethod);
        }
      }

      return item;
    });
    // yesterday order payment method
    dashboardOrderAmount?.ordersData?.filter((item, value) => {
      if (dayjs(item.updatedAt).set(-1, "day").isYesterday()) {
        if (item.paymentMethod === "Cash") {
          let cashMethod = {
            paymentMethod: "Cash",
            total: item.total,
          };
          yesterDayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Credit") {
          const cashMethod = {
            paymentMethod: "Credit",
            total: item?.total,
          };

          yesterDayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Card") {
          const cashMethod = {
            paymentMethod: "Card",
            total: item?.total,
          };

          yesterDayPaymentMethodData.push(cashMethod);
        }
      }

      return item;
    });

    const todayCsCdCit = Object.values(
      todayPaymentMethodData.reduce((r, { paymentMethod, total }) => {
        if (!r[paymentMethod]) {
          r[paymentMethod] = { paymentMethod, total: 0 };
        }
        r[paymentMethod].total += total;

        return r;
      }, {})
    );
    const today_cash_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Cash"
    );
    setTodayCashPayment(today_cash_payment?.total);
    const today_card_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Card"
    );
    setTodayCardPayment(today_card_payment?.total);
    const today_credit_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Credit"
    );
    setTodayCreditPayment(today_credit_payment?.total);

    const yesterDayCsCdCit = Object.values(
      yesterDayPaymentMethodData.reduce((r, { paymentMethod, total }) => {
        if (!r[paymentMethod]) {
          r[paymentMethod] = { paymentMethod, total: 0 };
        }
        r[paymentMethod].total += total;

        return r;
      }, {})
    );
    const yesterday_cash_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Cash"
    );
    setYesterdayCashPayment(yesterday_cash_payment?.total);
    const yesterday_card_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Card"
    );
    setYesterdayCardPayment(yesterday_card_payment?.total);
    const yesterday_credit_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Credit"
    );
    setYesterdayCreditPayment(yesterday_credit_payment?.total);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardOrderAmount]);

  return (
    <>
    <SyncData />
    <div>
    {jsonData.map((lineData, index) => (
        <div key={index}>
          {JSON.stringify(lineData)}
        </div>
      ))}
    </div>
      <PageTitle>{t("DashboardOverview")}</PageTitle>

      <div className="grid gap-4 mb-8 md:grid-cols-4 xl:grid-cols-4">
{/* 
        <div className="data">
        {products.map((item) => (
        <p key={item}>{item.title}</p>
      ))}
        </div> */}

        <CardItemTwo
          mode={mode}
          currency={currency}
          title="Today Order"
          title2="TodayOrder"
          Icon={ImStack}
          cash={todayCashPayment || 0}
          card={todayCardPayment || 0}
          credit={todayCreditPayment || 0}
          price={todayOrderAmount || 0}
          className="text-white dark:text-green-100 bg-teal-500"
          loading={loadingOrderAmount}
        />

        <CardItemTwo
          mode={mode}
          currency={currency}
          title="Yesterday Order"
          title2="YesterdayOrder"
          Icon={ImStack}
          cash={yesterdayCashPayment || 0}
          card={yesterdayCardPayment || 0}
          credit={yesterdayCreditPayment || 0}
          price={yesterdayOrderAmount || 0}
          className="text-white dark:text-orange-100 bg-orange-400"
          loading={loadingOrderAmount}
        />

        <CardItemTwo
          mode={mode}
          currency={currency}
          title2="ThisMonth"
          Icon={FiShoppingCart}
          price={dashboardOrderAmount?.thisMonthlyOrderAmount || 0}
          className="text-white dark:text-green-100 bg-blue-500"
          loading={loadingOrderAmount}
        />

        <CardItemTwo
          mode={mode}
          currency={currency}
          title2="AllTimeSales"
          Icon={ImCreditCard}
          price={dashboardOrderAmount?.totalAmount || 0}
          className="text-white dark:text-green-100 bg-green-500"
          loading={loadingOrderAmount}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardItem
          title={t("TodayOrder")}
          Icon={FiShoppingCart}
          loading={loadingOrderCount}
          quantity={dashboardOrderCount?.totalOrder || 0}
          className="text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500"
        />
        <CardItem
          title={t("OrderPending")}
          Icon={FiRefreshCw}
          loading={loadingOrderCount}
          quantity={dashboardOrderCount?.totalPendingOrder?.count || 0}
          amount={dashboardOrderCount?.totalPendingOrder?.total || 0}
          className="text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500"
        />
        <CardItem
          title={t("OrderProcessing")}
          Icon={FiTruck}
          loading={loadingOrderCount}
          quantity={dashboardOrderCount?.totalProcessingOrder || 0}
          className="text-teal-600 dark:text-teal-100 bg-teal-100 dark:bg-teal-500"
        />
        <CardItem
          title={t("OrderDelivered")}
          Icon={FiCheck}
          loading={loadingOrderCount}
          quantity={dashboardOrderCount?.totalDeliveredOrder || 0}
          className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 my-8">
        <ChartCard
          mode={mode}
          loading={loadingOrderAmount}
          title={t("WeeklySales")}
        >
          <LineChart salesReport={salesReport} />
        </ChartCard>

        <ChartCard
          mode={mode}
          loading={loadingBestSellerProduct}
          title={t("BestSellingProducts")}
        >
          <PieChart data={bestSellerProductChart} />
        </ChartCard>
      </div>

      <PageTitle>{t("RecentOrder")}</PageTitle>

      {/* <Loading loading={loading} /> */}

      {loadingRecentOrder ? (
        <TableLoading row={5} col={4} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>{t("InvoiceNo")}</TableCell>
                <TableCell>{t("TimeTbl")}</TableCell>
                <TableCell>{t("CustomerName")} </TableCell>
                <TableCell> {t("MethodTbl")} </TableCell>
                <TableCell> {t("AmountTbl")} </TableCell>
                <TableCell>{t("OderStatusTbl")}</TableCell>
                <TableCell>{t("ActionTbl")}</TableCell>
                <TableCell className="text-right">{t("InvoiceTbl")}</TableCell>
              </tr>
            </TableHeader>

            <OrderTable
              lang={lang}
              orders={dataTable}
              globalSetting={globalSetting}
              currency={globalSetting?.default_currency || "$"}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={dashboardRecentOrder?.totalOrder}
              resultsPerPage={8}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no orders right now." />
      )}
    </>
  );
};

export default Dashboard;
