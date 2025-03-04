"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkCookie, LoadRealname, LoadRole } from '../utils/checkCookie'

interface NavBarProps {
  BackLink?: string;
  ReturnLink?: string;
  ReturnCheckLink?: string;
  AddCatalogyLink?: string;
}

const NavBar: React.FC<NavBarProps> = ({ BackLink = "../", ReturnLink = "../return", ReturnCheckLink = "../returncheck", AddCatalogyLink = "../add/catalogy" }) => {

  const router = useRouter();
  const [logout, setLogout] = useState(false);
  const [role, setRole] = useState("user");
  const [realname, setRealname] = useState("");
  useEffect(() => {

    if (checkCookie() != null) {
      setLogout(true)
      setRole(LoadRole()!)
      setRealname(LoadRealname()!)

    } else {
      setLogout(false)

    }
  }, [])
  return (
    <div>
      <header className="bg-white fixed w-full shadow-sm z-3 left-0 top-0 shadow-xl">
        <a onClick={() => { router.push(BackLink) }} className="block cursor-pointer float-left px-1.2 py-1 text-[#71C55D] font-bold	px-[20px] py-[17px] text-[20px] ">COMSCI <span className='text-[#777]'>check</span></a>
        <input className="MenuBtn peer" type="checkbox" id="menu-btn"></input>
        <label className="py-[28px] px-[20px] float-right menu-icon cursor-pointer lg:hidden" htmlFor="menu-btn">
          <span className="HamburgerNav"></span>
        </label>
        <ul className=" divide-x divide-[#f4f4f4] cursor-pointer clear-both overflow-hidden lg:clear-none transition-[max-height] transition-300 ease-out peer-checked:max-h-[320px] max-h-0 lg:float-right lg:clear-none lg:max-h-none">

          {logout ? (
            <li className="lg:float-left"><a onClick={() => { router.push(ReturnLink) }} className="p-[20px] block bg-[#cecece50] text-[#71C55D] duration-300 hover:bg-[#71C55D] hover:text-[#ffffff] font-bold font-kanit" >คืนของ</a></li>

          ) : ("")}
          {logout && role == "admin" ? (
            <li className="lg:float-left"><a onClick={() => { router.push(ReturnCheckLink) }} className="p-[20px] block bg-[#cecece50] text-[#71C55D] duration-300 hover:bg-[#71C55D] hover:text-[#ffffff] font-bold" >ยืนยันการคืน</a></li>

          ) : ("")}
          {logout ? (

            <li className="lg:float-left"><a className="p-[20px] block bg-[#cecece50] text-[#71C55D] duration-300 hover:bg-[#71C55D] hover:text-[#ffffff] font-bold " >Welcome: {realname} </a></li>

          ) : ("")}
          {logout && role == "admin" ? (
            <li className="lg:float-left"><a onClick={() => {router.push(AddCatalogyLink)}} className="p-[20px] block bg-[#cecece50] text-[#71C55D] duration-300 hover:bg-[#71C55D] hover:text-[#ffffff] font-bold" >เพิ่มหมวดหมู่</a></li>

          ) : ("")}



          {logout ? (

            <li className="lg:float-left"><a onClick={() => {
              document.cookie = `uId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              document.cookie = `uRealname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              document.cookie = `uRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

              setLogout(false);
              router.push("../login")
            }} className="p-[20px] block bg-[#cecece50] text-red-600 duration-300 hover:bg-[#71C55D] hover:text-[#ffffff] font-bold">ออกจากระบบ</a></li>
          ) : (
            <li className="lg:float-left"><a onClick={() => { setLogout(false); router.push("../login") }} className="p-[20px] block bg-[#cecece50] text-[#71C55D] duration-300 hover:bg-[#71C55D] hover:text-[#ffffff] font-bold" >เข้าสู่ระบบ</a></li>
          )}
        </ul>
      </header>

    </div>
  );
};

export default NavBar