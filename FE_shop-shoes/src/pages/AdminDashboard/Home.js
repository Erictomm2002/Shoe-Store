import React, { useEffect, useRef, useState } from "react";
import "./Home.scss";
import "./Home.css";
import { BsFillArchiveFill, BsPeopleFill } from "react-icons/bs";
import { FaMoneyBillAlt } from "react-icons/fa";
import { MdOutlineBorderColor } from "react-icons/md";
import Nav from "./Nav";
import ApexCharts from "react-apexcharts";
// import axios from "axios";
import { getAllOrder, getDataManageAdmin } from "../../service/productService";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPaginate from "react-paginate";

const Home = () => {
  const [dataManage, setDataManage] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalOrdersPending: 0,
    totalRevenueWeek: 0,
    totalRevenueYear: 0,
    monthlyRevenue: [],
  });
  const [dataChartMonth, setDataChartMonth] = useState({
    data: [10],
    categories: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [dataOrder, setDataOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const chartRef = useRef(null);

  const formatDay = (item) => {
    const date = new Date(item.day);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  };

  const fetchDataManage = async () => {
    let res = await getDataManageAdmin();
    if (res && res.errCode === 0) {
      setDataManage(res.DT);
      setDataChartMonth({
        data: res.DT?.monthlyRevenue?.map((item) => item.totalMoney),
        categories: res.DT?.monthlyRevenue?.map((item) => formatDay(item)),
      });
    } else {
      toast.error(res.errMessage);
    }
  };

  const getDataOrder = async () => {
    let res = await getAllOrder(
      currentPage,
      currentLimit,
      "",
      startDate || "",
      endDate || "",
      1
    );
    if (res && res.errCode === 0) {
      setDataOrder(res?.DT?.suppliers);
      setTotalPages(res?.DT?.totalPages);
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    fetchDataManage();
  }, []);

  useEffect(() => {
    getDataOrder();
  }, [dateRange, currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const optionsbyMonth = {
    series: [
      {
        name: "Tổng tiền",
        data: dataChartMonth.data,
      },
    ],
    chart: {
      height: 350,
      type: "line",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "straight" },
    title: { text: "Thống kê theo ngày", align: "left" },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: { categories: dataChartMonth.categories },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Tổng doanh thu</h3>
            <FaMoneyBillAlt className="text-xl sm:text-2xl text-green-500" />
          </div>
          <p className="text-lg sm:text-2xl font-bold">{dataManage.totalRevenue?.toLocaleString("vi-VN")} đ</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Khách Hàng</h3>
            <BsPeopleFill className="text-xl sm:text-2xl text-blue-500" />
          </div>
          <p className="text-lg sm:text-2xl font-bold">{dataManage.totalCustomers}</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Sản phẩm</h3>
            <BsFillArchiveFill className="text-xl sm:text-2xl text-yellow-500" />
          </div>
          <p className="text-lg sm:text-2xl font-bold">{dataManage.totalProducts}</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Đang chờ duyệt</h3>
            <MdOutlineBorderColor className="text-xl sm:text-2xl text-red-500" />
          </div>
          <p className="text-lg sm:text-2xl font-bold">{dataManage.totalOrdersPending}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Thống kê doanh thu theo tháng và năm</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
            <div id="chartByMonth" ref={chartRef}>
              <ApexCharts
                options={optionsbyMonth}
                series={optionsbyMonth.series}
                type="line"
                height={350}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Doanh thu tuần</h3>
              <p className="text-lg sm:text-2xl font-bold">{dataManage.totalRevenueWeek?.toLocaleString("vi-VN")} đ</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Doanh thu tháng</h3>
              <p className="text-lg sm:text-2xl font-bold">{dataManage.totalRevenueYear?.toLocaleString("vi-VN")} đ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8">
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Chọn ngày:</h3>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable={true}
            className="border rounded p-2 w-full sm:w-auto"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên khách hàng</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Giao</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {dataOrder?.map((item, index) => {
              const createdAtDate = new Date(item?.createdAt);
              const formattedDate = `${createdAtDate.getDate()}/${
                createdAtDate.getMonth() + 1
              }/${createdAtDate.getFullYear()} ${createdAtDate.getHours()}:${
                createdAtDate.getMinutes() < 10
                  ? "0" + createdAtDate.getMinutes()
                  : createdAtDate.getMinutes()
              }`;

              const updatedAtDate = new Date(item?.updatedAt);
              const dateUpdate = `${updatedAtDate.getDate()}/${
                updatedAtDate.getMonth() + 1
              }/${updatedAtDate.getFullYear()} ${updatedAtDate.getHours()}:${
                updatedAtDate.getMinutes() < 10
                  ? "0" + updatedAtDate.getMinutes()
                  : updatedAtDate.getMinutes()
              }`;

              return (
                <tr key={index}>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">#{item?.id}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">{item?.username}</td>
                  <td className="px-3 py-4 text-sm">
                    {item?.orderDetail?.map((product, i) => (
                      <div key={i}>
                        <p>{product?.product?.productName}</p>
                        <p className="text-xs text-gray-500">Kích thước: {product?.size}</p>
                      </div>
                    ))}
                  </td>
                  <td className="px-3 py-4 text-sm">
                    {item?.orderDetail?.map((product, i) => (
                      <p key={i}>{parseInt(product?.price).toLocaleString("vi-VN")}đ</p>
                    ))}
                  </td>
                  <td className="px-3 py-4 text-sm">
                    {item?.orderDetail?.map((product, i) => (
                      <p key={i}>{parseInt(product?.quantity).toLocaleString("vi-VN")}</p>
                    ))}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">{parseInt(item?.totalMoney).toLocaleString("vi-VN")}đ</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">{formattedDate}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">{dateUpdate}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">Đã giao</td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel=" >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={totalPages}
        previousLabel="< "
        pageClassName="inline-block mx-1"
        pageLinkClassName="px-3 py-2 bg-white text-blue-500 border border-gray-300 rounded hover:bg-blue-100 text-sm sm:text-base"
        previousClassName="inline-block mx-1"
        previousLinkClassName="px-3 py-2 bg-white text-blue-500 border border-gray-300 rounded hover:bg-blue-100 text-sm sm:text-base"
        nextClassName="inline-block mx-1"
        nextLinkClassName="px-3 py-2 bg-white text-blue-500 border border-gray-300 rounded hover:bg-blue-100 text-sm sm:text-base"
        breakClassName="inline-block mx-1"
        breakLinkClassName="px-3 py-2 bg-white text-blue-500 border border-gray-300 rounded hover:bg-blue-100 text-sm sm:text-base"
        containerClassName="flex flex-wrap justify-center items-center mt-8"
        activeClassName="bg-blue-500 text-white"
      />
    </div>
  );
};

export default Home;
