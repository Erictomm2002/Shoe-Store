import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={`bg-gray-100 dark:bg-gray-800 text-gray-600 pt-10 pb-6 transition-colors duration-300 mt-28`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h5 className="text-xl font-bold text-indigo-300 uppercase">SHOES</h5>
            <p className="text-gray-100">Chuyên bán giày</p>
          </div>

          <div className="space-y-4">
            <h5 className="text-xl font-bold text-indigo-300 uppercase">Về chúng tôi</h5>
            <div className="space-y-3">
              <div><Link to="/about" className="hover:text-indigo-600 text-gray-100 transition-colors">Giới thiệu</Link></div>
              <div><Link to="/terms" className="hover:text-indigo-600 text-gray-100 transition-colors">Điều khoản sử dụng</Link></div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-xl font-bold text-indigo-300 uppercase">Chính sách</h5>
            <div className="space-y-3">
              <div><Link to="/warranty" className="hover:text-indigo-600 text-gray-100 transition-colors">Chính sách bảo hành & đổi trả</Link></div>
              <div><Link to="/shipping" className="hover:text-indigo-600 text-gray-100 transition-colors">Chính sách vận chuyển</Link></div>
              <div><Link to="/payment" className="hover:text-indigo-600 text-gray-100 transition-colors">Chính sách thanh toán</Link></div>
              <div><Link to="/privacy" className="hover:text-indigo-600 text-gray-100 transition-colors">Chính sách bảo mật</Link></div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-xl font-bold text-indigo-300 uppercase">Thông tin liên hệ</h5>
            <div className="space-y-3">
              <div className="flex items-center text-gray-100"><FaMapMarkerAlt className="mr-2 text-gray-100" /> 177 Cầu diễn, Từ Liêm, Hà Nội</div>
              <div className="flex items-center text-gray-100"><FaEnvelope className="mr-2 text-gray-100" /> admin@gmail.com</div>
              <div className="flex items-center text-gray-100"><FaPhone className="mr-2 text-gray-100" /> 0336909524</div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-300 dark:border-gray-600" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm">
            Copyright 2024 All Rights Reserved By:{' '}
            <Link to="/" className="font-bold text-indigo-600 hover:underline">
              Shoe Store
            </Link>
          </p>

          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-600 hover:text-indigo-600 transition-colors">
              <FaFacebook size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-600 hover:text-indigo-600 transition-colors">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

