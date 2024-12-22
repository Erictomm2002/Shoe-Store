import React, {useEffect, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import ReactPaginate from "react-paginate";
import {toast} from "react-toastify";
import {getAllProduct} from "../../service/productService";
import {fetchAllSupplierNoLimit} from "../../service/userService";
import { motion } from 'framer-motion';

// Assuming these components exist in your project
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import ItemProductCart from "../card/ItemProductCart";

// Assuming these images are imported correctly
import shoe01 from "../../assets/images/sieu-sale-4.4-cata-1140x500.png";
import shoe02 from "../../assets/images/banner02.jpg";
import shoe03 from "../../assets/images/banner03.jpg";
import shoe04 from "../../assets/images/banner04.jpg";
import TopBanner from "../top-banner/top-banner";
import {FunnelIcon, XMarkIcon} from "@heroicons/react/24/outline";

const priceRanges = [
  {value: 500, title: "500.000₫", minPrice: 0, maxPrice: 500000},
  {value: 1000, title: "500.000₫ - 1.000.000₫", minPrice: 500000, maxPrice: 1000000},
  {value: 2000, title: "1.000.000₫ - 2.000.000₫", minPrice: 1000000, maxPrice: 2000000},
  {value: 3000, title: "2.000.000₫ - 3.000.000₫", minPrice: 2000000, maxPrice: 3000000},
  {value: 4000, title: "3.000.000₫ - 4.000.000₫", minPrice: 3000000, maxPrice: 4000000},
  {value: 4000, title: "> 4.000.000₫", minPrice: 4000000, maxPrice: 100000000},
];

const shoeImages = [shoe02, shoe03, shoe04, shoe01];


const ProductPage = () => {
  const [listSupplier, setListSupplier] = useState([]);
  const [getProduct, setGetProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [supplierActive, setSupplierActive] = useState("");
  const [filterPrice, setFilterPrice] = useState([0, 0]);
  const [filterSize, setFilterSize] = useState([]);

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const slug = window.location.pathname.split("/")[2];

  useEffect(() => {
    if (slug) {
      setSupplierActive(slug);
    }
    fetchSupplier();
  }, [slug]);

  useEffect(() => {
    getAllProducts();
  }, [currentPage, supplierActive, filterPrice, filterSize]);

  const getAllProducts = async () => {
    try {
      const res = await getAllProduct(
        currentPage,
        currentLimit,
        supplierActive,
        filterPrice[0],
        filterPrice[1],
        filterSize.join(",")
      );
      if (res && res.errCode === 0) {
        setGetProduct(res?.DT?.suppliers);
        setTotalPages(res?.DT?.totalPages);
      } else {
        toast.error(res.errMessage);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("An error occurred while fetching products");
    }
  };

  const fetchSupplier = async () => {
    try {
      const res = await fetchAllSupplierNoLimit();
      if (res && res.errCode === 0) {
        setListSupplier(res.DT);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("An error occurred while fetching suppliers");
    }
  };

  const handlePageClick = ({selected}) => {
    setCurrentPage(selected + 1);
  };

  const handlePriceChange = (minPrice, maxPrice) => {
    setFilterPrice([minPrice, maxPrice]);
  };

  const handleFilterSize = (size) => {
    setFilterSize(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  return (
    <div>
      <div className="">
        <TopBanner/>
        <Navbar/>
        <main className="flex-grow container mx-auto px-4 py-8 mt-4">
          <div className="flex flex-col lg:items-start lg:flex-row gap-y-8 gap-x-10">
            {/* Sidebar */}
            <div className="w-full lg:w-1/4 lg:sticky lg:top-20 space-y-6 hidden lg:block">
              {/* Brand Filter */}
              <motion.div
                className="bg-white rounded-lg p-6 shadow-md border border-gray-200"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
              >
                <p className="font-bold text-xl text-gray-800 mb-4 bg-white text-start">Thương hiệu</p>
                <div className="space-y-3">
                  {listSupplier?.map((item) => (
                    <motion.div
                      key={item?.id}
                      className={`cursor-pointer capitalize transition-all duration-300 ease-in-out ${
                        supplierActive === item?.name
                          ? "text-blue-600 font-semibold"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                      onClick={() =>
                        setSupplierActive((prev) => (prev === item?.name ? "" : item?.name))
                      }
                      whileHover={{scale: 1.05}}
                      whileTap={{scale: 0.95}}
                    >
                      {item?.name}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Price Filter */}
              <motion.div
                className="bg-white rounded-lg p-6 shadow-md border border-gray-200"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.1}}
              >
                <p className="font-bold text-xl text-gray-800 mb-4 bg-white text-start">Giá</p>
                <div className="space-y-3">
                  {priceRanges.map((range) => (
                    <div key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`price-${range.value}`}
                        name="price"
                        className="mr-3 focus:ring-2 focus:ring-blue-400 text-blue-500 border-gray-300"
                        onChange={() => handlePriceChange(range.minPrice, range.maxPrice)}
                      />
                      <label htmlFor={`price-${range.value}`}
                             className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        {range.title}
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Size Filter */}
              <motion.div
                className="bg-white rounded-lg p-6 shadow-md border border-gray-200"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.2}}
              >
                <p className="font-bold text-xl text-gray-800 mb-4 bg-white text-start">Kích thước</p>
                <div className="grid grid-cols-3 gap-4">
                  {[36, 37, 38, 39, 40, 41, 42].map((size) => (
                    <div key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        className="mr-3 focus:ring-2 focus:ring-blue-400 text-blue-500 border-gray-300"
                        onChange={() => handleFilterSize(size)}
                      />
                      <label htmlFor={`size-${size}`}
                             className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {/* Banner */}
              <div className="mb-8">
                <Swiper
                  className="rounded-lg overflow-hidden" // Tailwind CSS classes
                  spaceBetween={10} // Khoảng cách giữa các slide
                  slidesPerView={1} // Số lượng slide hiển thị
                  loop={true} // Kích hoạt chế độ lặp
                >
                  {shoeImages.map((shoe, index) => (
                    <SwiperSlide key={index}>
                      <img src={shoe} alt={`Banner ${index + 1}`} className="w-full h-auto object-cover"/>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Product List */}
              {getProduct?.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 -mt-4 mb-12">
                    {getProduct.map((item, index) => (
                      <ItemProductCart key={index} item={item}/>
                    ))}
                  </div>
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={totalPages}
                    previousLabel="<"
                    containerClassName="flex justify-center items-center space-x-2"
                    pageClassName="px-3 py-1 rounded border border-2 hover:bg-gray-100 font-semibold"
                    activeClassName="bg-purple-600 text-white"
                    disabledClassName="text-gray-300 cursor-not-allowed"
                    previousClassName	={"text-gray-800 mr-1"}
                    nextClassName	={"text-gray-800 ml-1"}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 text-lg">Không có sản phẩm nào tồn tại....</p>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer/>
      </div>

      <FunnelIcon onClick={() => {
        setIsOpenFilter(true)
      }} className="lg:hidden fixed w-12 h-12 right-2 bottom-2 border bg-white p-2 rounded-full hover:text-indigo-700" />

      {isOpenFilter && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-800/50"></div>

          {/*Mobile Bar*/}
          <div className="absolute w-full lg:w-1/4 bottom-0 space-y-2 z-50 bg-white h-2/3 overflow-scroll">
            <div className="flex pt-3 justify-between border-b pb-3 sticky top-0 bg-white">
              <div className="flex text-gray-500 gap-x-1.5 px-6 text-lg">
                <FunnelIcon className="w-6 h-6"/>
                <span className="font-semibold">Bộ lọc</span>
              </div>
              <XMarkIcon onClick={() => {
                setIsOpenFilter(false)
              }} className="w-8 h-8 mr-4"/>
            </div>
            {/* Brand Filter */}
            <motion.div
              className="p-6"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5}}
            >
              <p className="font-bold text-xl text-gray-800 mb-4 bg-white text-start">Thương hiệu</p>
              <div className="space-y-3">
                {listSupplier?.map((item) => (
                  <motion.div
                    key={item?.id}
                    className={`cursor-pointer capitalize transition-all duration-300 ease-in-out ${
                      supplierActive === item?.name
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                    onClick={() =>
                      setSupplierActive((prev) => (prev === item?.name ? "" : item?.name))
                    }
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                  >
                    {item?.name}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Price Filter */}
            <motion.div
              className="p-6"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.1}}
            >
              <p className="font-bold text-xl text-gray-800 mb-4 bg-white text-start">Giá</p>
              <div className="space-y-3">
                {priceRanges.map((range) => (
                  <div key={range.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`price-${range.value}`}
                      name="price"
                      className="mr-3 focus:ring-2 focus:ring-blue-400 text-blue-500 border-gray-300"
                      onChange={() => handlePriceChange(range.minPrice, range.maxPrice)}
                    />
                    <label htmlFor={`price-${range.value}`}
                           className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      {range.title}
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Size Filter */}
            <motion.div
              className="p-6"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.2}}
            >
              <p className="font-bold text-xl text-gray-800 mb-4 bg-white text-start">Kích thước</p>
              <div className="grid grid-cols-3 gap-4">
                {[36, 37, 38, 39, 40, 41, 42].map((size, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`size-${size}`}
                      className="mr-3 focus:ring-2 focus:ring-blue-400 text-blue-500 border-gray-300"
                      onChange={() => handleFilterSize(size)}
                    />
                    <label htmlFor={`size-${size}`}
                           className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="pr-12 pb-3">
              <div onClick={() => {
                setIsOpenFilter(false)
              }} className="mx-4 w-full bg-indigo-500 text-white font-semibold text-center p-2 rounded-md hover:bg-indigo-700">
                Done
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default ProductPage;

