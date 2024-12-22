import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import "./Sale.scss";
import Footer from "../footer/Footer";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { getProductSale } from "../../service/productService";
import ItemProductCart from "../card/ItemProductCart";

const SaleProduct = () => {
  const [getAllProductsSell, setGetAllProductsSell] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  const getAllProducts = async () => {
    let res = await getProductSale(currentPage, currentLimit);
    if (res && res.errCode === 0) {
      setGetAllProductsSell(res?.DT?.suppliers);
      setTotalPages(res?.DT?.totalPages);
    } else {
      toast.error(res.errMessage);
    }
  };
  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };
  useEffect(() => {
    getAllProducts();
  }, [currentPage]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-y-16 justify-center align-center mt-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 max-w-[1320px] mx-2">
          {getAllProductsSell?.length > 0 &&
            getAllProductsSell?.map((item, index) => {
              return (
                <ItemProductCart item={item} key={index}></ItemProductCart>
              );
            })}
        </div>
        <div className="paginate">
          <ReactPaginate
            breakLabel="..."
            nextLabel=" >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={4}
            pageCount={totalPages}
            previousLabel="< "
            containerClassName="flex justify-center items-center space-x-2"
            pageClassName="px-3 py-1 rounded border border-2 hover:bg-gray-100 font-semibold"
            activeClassName="bg-purple-600 text-white"
            disabledClassName="text-gray-300 cursor-not-allowed"
            previousClassName	={"text-gray-800 mr-1"}
            nextClassName	={"text-gray-800 ml-1"}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SaleProduct;
