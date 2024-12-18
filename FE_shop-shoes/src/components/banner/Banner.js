import React from "react";
import "./Banner.scss";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/16/solid";

function Banner(props) {
    return (
        <div className="flex justify-center mt-3 mx-1">
            <div className="max-w-[1350px] rounded-xl shadow-sm overflow-hidden ">
                <div className="relative w-full overflow-hidden max-w-[1320px]">
                    <div className="flex w-full animate-slide">
                        <div className="w-full flex-shrink-0">
                            <img src="/banner1.jpg" className="w-full" alt="..."/>
                        </div>
                        <div className="w-full flex-shrink-0">
                            <img src="/banner2.png" className="w-full" alt="..."/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;
