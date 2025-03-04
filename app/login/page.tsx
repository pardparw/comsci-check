"use client"

import React from 'react'
import Footer from '../components/footer'
import NavBar from '../components/NavBar'
import Swal from 'sweetalert2';
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'



function page() {

    const router = useRouter();



    const sendPostRequest = async () => {
        let timerInterval: number;




        Swal.fire({
            title: "กำลังเข้าสู่ระบบ",
            timer: 2000,
            timerProgressBar: false,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                clearInterval(timerInterval!);
            }
        });

        try {

            let response = await fetch(`/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data != 0) {
                document.cookie = `uId=${data[0]["uId"]}; path=/;`;
                document.cookie = `uRealname=${data[0]["uRealname"]}; path=/;`;
                document.cookie = `uRole=${data[0]["uRole"]}; path=/;`;

                Swal.fire({
                    icon: "success",
                    title: "เข้าสู่ระบบสำเร็จ!",
                    showCloseButton: true,
                    confirmButtonText: "กลับ"
                }).then((result) => {
                    router.push("../")
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด!",
                    text: `ชื่อผู้ใช้หรือรหัสผ่านผิด`,
                    confirmButtonText: "ลองอีกครั้ง"
                });
            }

        } catch (error: any) {
            console.error("Error sending request:", error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: `Failed to send request. ${error.message}`,
                confirmButtonText: "ลองอีกครั้ง"
            });
        }
    };





    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <NavBar></NavBar>
                <div className="relative  font-bold pt-[2.5cm] font-medium flex flex-col items-center">

                    <h1 className="text-center text-3xl text-[#57b846]">เข้าสู่ระบบ</h1>
                    <input className="mt-4 w-[80%] h-[45px] rounded-3xl bg-white shadow text-center" name='username' value={formData.username} onChange={handleChange} placeholder="ชื่อผู้ใช้" />
                    <input className="mt-2 w-[80%] h-[45px] rounded-3xl bg-white duration-400 shadow text-center" name='password' type='password' value={formData.password} onChange={handleChange} placeholder="รหัสผ่าน" />

                    <button onClick={() => sendPostRequest()} className="mt-6 bg-[#71C55D] text-white w-[80%] h-[65px] text-xl rounded-3xl cursor-pointer duration-400 hover:bg-white hover:text-[#71C55D] hover:outline-[#71C55D] hover:outline">เข้าสู่ระบบ</button>

                </div>
            </main>
            <Footer></Footer>
        </div>
    )
}

export default page