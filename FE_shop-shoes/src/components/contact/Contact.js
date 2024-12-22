import React from "react";
import Navbar from "../navbar/Navbar";
import "./Contact.scss";
import Footer from "../footer/Footer";

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center -mb-28">
        <div className="w-[95%] sm:w-2/3 lg:w-1/2 xl:w-1/3 -mt-48">
          <div className="bg-white shadow rounded-lg py-6">
            <p className="text-2xl text-center font-semibold mt-2 mb-4 text-gray-800 border-b pb-4">
              Liên hệ với chúng tôi
            </p>
            <form className="space-y-4 px-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Nội dung
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="3"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                ></textarea>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Tên
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="mt-2 w-full bg-indigo-500 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Gửi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Contact;