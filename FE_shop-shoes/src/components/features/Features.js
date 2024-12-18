import React from "react";
import "./Features.scss";

function Features(props) {
    return (
        <div className="flex justify-center mt-3">
            <div className="ps-features w-full lg:w-[420px] xl:w-[1320px] mx-2 grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2">
                <div
                    className="ps-container shadow-sm bg-gradient-to-r from-slate-50 to-slate-100 h-full py-4 flex items-center justify-center border border-gray-300 rounded-xl">
                    <div className="ps wid">
                        <i className="icons fa-solid fa-wallet"></i>
                        <h3 className="text-2xl font-semibold text-purple-500">Cam kết chính hãng</h3>
                        <p className="font-medium text-base tracking-widest text-gray-600">100% Authentic</p>
                        <div className="t-two">
                            <p className="content-t max-w-72 line-clamp-2 tracking-wide text-center">
                                Cam kết sản phẩm nhập khẩu trực tiếp từ thị trường Châu Âu, Châu Mỹ
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className="ps-container shadow-sm bg-gradient-to-r from-slate-50 to-slate-100 h-full py-4 flex items-center justify-center border border-gray-300 rounded-xl">
                    <div className="ps wid">
                        <i className="icons fa-solid fa-truck"></i>
                        <h3 className="text-2xl font-semibold text-purple-500">Giao hàng hoả tốc</h3>
                        <p className="font-medium text-base tracking-widest text-gray-600">Express delivery</p>
                        <div className="t-two">
                            <p className="content-t max-w-72 line-clamp-2 tracking-wide text-center">
                                Ship hỏa tốc, đảm bảo 1h nhận hàng trong nội thành Hà Nội
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className="ps-container shadow-sm bg-gradient-to-r from-slate-50 to-slate-100 h-full py-4 flex items-center justify-center border border-gray-300 rounded-xl">
                    <div className="ps wid">
                        <i className="icons fa-solid fa-phone"></i>
                        <h3 className="text-2xl font-semibold text-purple-500">Hỗ trợ 24/24</h3>
                        <p className="font-medium text-base tracking-widest text-gray-600">Supporting 24/24</p>
                        <div className="t-two">
                            <p className="content-t max-w-72 line-clamp-2 tracking-wide text-center">Xin mời liên hệ với tổng đài tư vấn trực tiếp 24/24. Số điện thoại: 0913232165</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Features;
