import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import { deleteProduct, getAllProduct } from "../../service/productService";
import { convertBase64ToImage } from "../../assets/data/image";
import { fetchAllSupplierNoLimit } from "../../service/userService";

const ManageProduct = () => {
  const [getProduct, setGetProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [listBrand, setListBrand] = useState([]);
  const [supplierSort, setSupplierSort] = useState("");
  const [search, setSearch] = useState("");

  const getAllProducts = async () => {
    const res = await getAllProduct(
      currentPage,
      currentLimit,
      supplierSort,
      "",
      "",
      "1,2,3,4,5,6,7",
      search
    );
    if (res && res.errCode === 0) {
      setGetProduct(res?.DT?.suppliers);
      setTotalPages(res?.DT?.totalPages);
    } else {
      toast.error(res.errMessage);
    }
  };

  const fetchBrand = async () => {
    const res = await fetchAllSupplierNoLimit();
    if (res && res.errCode === 0) {
      setListBrand(res.DT);
    }
  };

  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: "Bạn chắc chắn muốn xóa?",
      text: "Bạn sẽ không thể hoàn nguyên tùy chọn này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(id);
          Swal.fire("Đã xóa!", "Bạn đã xóa thành công!", "success");
          setGetProduct(getProduct.filter((product) => product.id !== id));
        } catch (e) {
          Swal.fire("Error", e, "error");
        }
      }
    });
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  useEffect(() => {
    getAllProducts();
  }, [currentPage, search, supplierSort]);

  useEffect(() => {
    fetchBrand();
  }, []);

  return (
    <div className="manage-product w-full mx-auto p-6 bg-gray-50 font-sans">
      <div className="bg-white rounded-lg shadow">
        {/* Header Section */}
        <div className="p-4 border-b flex flex-col lg:flex-row items-start justify-between">
          <div className="">
            <p className="text-2xl font-semibold text-gray-800">Quản lý sản phẩm</p>
            <p className="text-gray-500 text-base -mt-2">Quản lý thông tin sản phẩm và thực hiện các hành động chỉnh sửa
              hoặc xóa.</p>
          </div>

          {/* Filter Dropdown */}
          <div className="gap-2 w-full sm:w-auto">
            <div className="font-semibold text-sm text-gray-700">Lọc theo nhà cung cấp</div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setSupplierSort(e.target.value)}
            >
              <option value="default" disabled selected>
                --- Chọn ---
              </option>
              {listBrand?.length > 0 &&
                listBrand.map((item) => (
                  <option key={item?.id} value={item?.name}>
                    {item?.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Filter and Search */}
        {/* Search Input */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm"
            className="flex-1 sm:w-64 px-4 py-3 shadow-sm focus:ring-blue-500 focus:outline-none"
            onChange={(e) => setSearch(e.target.value.trim())}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white border-y">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className="px-4 py-3 font-semibold text-base"></th>
              <th className="px-4 py-3 font-semibold text-base">Tên sản phẩm</th>
              <th className="px-4 py-3 font-semibold text-base">Giá</th>
              <th className="px-4 py-3 font-semibold text-base">Giảm giá (%)</th>
              <th className="px-4 py-3 font-semibold text-base">Số lượng</th>
              <th className="px-4 py-3 font-semibold text-base">Hành động</th>
            </tr>
            </thead>
            <tbody>
            {getProduct?.length > 0 &&
              getProduct.map((item, index) => (
                <tr
                  key={item?.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{currentPage * currentLimit - currentLimit + index + 1}</td>
                  <td className="px-4 py-3">{item?.productName}</td>
                  <td className="px-4 py-3">{item?.price}đ</td>
                  <td className="px-4 py-3">{item?.discount}</td>
                  <td className="px-4 py-3">
                    {item?.inventories?.reduce(
                      (acc, current) => acc + parseInt(current.quantityInStock),
                      0
                    )}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <NavLink
                      to={`/admin/edit-product/${item?.id}`}
                      className="px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <BiEdit/>
                    </NavLink>
                    <button
                      onClick={() => handleDeleteProduct(item?.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <AiFillDelete/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <ReactPaginate
            breakLabel="..."
            nextLabel=" >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={totalPages}
            previousLabel="< "
            containerClassName="flex items-center gap-2"
            pageClassName="border border-gray-300 px-3 py-1 rounded-md cursor-pointer"
            activeClassName="bg-indigo-500 text-white"
            previousClassName="border text-indigo-500 border-gray-300 px-3 py-1 rounded-md cursor-pointer"
            nextClassName="border border-gray-300 px-3 py-1 rounded-md cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ManageProduct;