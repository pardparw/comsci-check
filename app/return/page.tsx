"use client"

import React from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/footer'
import Image from 'next/image'
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { cookies } from 'next/headers'
import { formatDate, isExpired } from '../utils/formatDate'
import { checkCookie } from '../utils/checkCookie'


const fetchData = async (cookie: any, setBorrowItem: Function, setError: Function, setIsLoading: Function) => {
    try {
        setIsLoading(true);
        const response = await fetch(`/api/borrow/all`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uId: cookie
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setBorrowItem(result);

    } catch (err: any) {
        console.error("Fetching error:", err);
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
};

const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
    return cookies ? cookies.split("=")[1] : null;
};


function page() {


    const router = useRouter();


    const [cookie, setCookie] = useState<string | null>(null);
    const [borrowItem, setBorrowItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const userCookie = checkCookie()

        if (!userCookie) {
            Swal.fire({
                icon: "warning",
                title: "กรุณาเข้าสู่ระบบ",
                confirmButtonText: "เข้าสู่ระบบ",
                showCloseButton: true,
            }).then(() => router.push("../login"));
            return;
        }

        setCookie(userCookie);
        fetchData(userCookie, setBorrowItem, setError, setIsLoading);
    }, []);

    const sendPostRequest = async (bId: number) => {




        const result = await Swal.fire({
            title: "ต้องการคืนของ",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "คืน",
            cancelButtonText: "ยกเลิก"
        });

        if (!result.isConfirmed) return;

        Swal.fire({
            title: "กำลังคืน",
            timer: 2000,
            timerProgressBar: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Assuming you have a state for borrowItem, update it by removing the item with the given bId
        const updatedData = borrowItem.filter((item: any) => item.bId !== bId);

        // Update the state with filtered data (assuming setBorrowItem is the function to update state)
        try {
            const response = await fetch(`/api/borrow/return`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    bId : bId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            await response.json(); // You can use this data if needed

            await Swal.fire({
                icon: "success",
                title: "คืนสำเร็จ!",
                showCloseButton: true,
                confirmButtonText: "ปิด"
            }).then(() => {
                setBorrowItem(updatedData);

            })


        } catch (error: any) {
            console.error("Error sending request:", error);

            await Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: `Failed to send request. ${error.message}`,
                confirmButtonText: "ลองอีกครั้ง"
            });
        }
    };



    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <NavBar ></NavBar>
                <div className="relative text-[#777] font-bold pt-[2.5cm] font-medium">

                    <h1 className="text-center text-3xl">สิ่งของที่ยืมไป</h1>

                    <div className='flex flex-col gap-4 items-center mt-[10px]'>

                        {isLoading && <p>Loading...</p>}
                        {error && <p>Error: {error}</p>}
                        {!isLoading && borrowItem?.length ? (
                            borrowItem.map((value: any, index: any) => (
                                <div
                                    key={index}
                                    className="w-[80%] bg-[#f0f0f0] shadow-lg rounded-lg flex justify-between items-center p-4 mb-2"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-white rounded h-[40px] ml-[10%] shadow flex items-center justify-center">
                                            <Image
                                                className="mt-[5px] "
                                                src={`http://${process.env.DOMAIN}/comsci_chi/add/uploads/${value["oImg"]}`}
                                                width={40}
                                                height={40}
                                                alt="Laptop"
                                            />
                                        </div>
                                        <div className="flex flex-col w-[5cm] ml-[5px]">
                                            <p className="text-[#71C55D] font-semibold">{value["oName"]}</p>
                                            <p>กำหนดคืน: {formatDate(value["eDate"])}</p>
                                            {isExpired(value["eDate"]) ? <p className="text-red-500">เลยกำหนด</p> : null}

                                        </div>
                                    </div>
                                    <div>
                                        <a
                                            onClick={() => sendPostRequest(value["bId"])}
                                            className="mr-[20px] underline font-bold text-[#71C55D] cursor-pointer"
                                        >
                                            คืน
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            !isLoading && <p>No borrowed items found.</p>
                        )}


                    </div>
                </div>

            </main>
            <Footer></Footer>
        </div>
    )
}

export default page