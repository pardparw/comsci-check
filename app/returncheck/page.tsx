"use client"

import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/footer'
import Image from 'next/image'
import { formatDate } from '../utils/formatDate'
import Swal from 'sweetalert2'


const fetchData = async (setBorrowItem: Function, setError: Function, setIsLoading: Function) => {
    try {
        setIsLoading(true);
        const response = await fetch(`http://${process.env.DOMAIN}:3002/borrow/check/`);

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

function page() {


    const [borrowItem, setBorrowItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        fetchData(setBorrowItem, setError, setIsLoading);

    }, []);


    const sendPostRequest = async (bId: number) => {




        const result = await Swal.fire({
            title: "ต้องการยืนยัน",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก"
        });

        if (!result.isConfirmed) return;

        Swal.fire({
            title: "กำลังยืนยัน",
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
            const response = await fetch(`http://${process.env.DOMAIN}:3002/borrow/returncheck/${bId}`, {
                method: "PUT",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            await response.json(); // You can use this data if needed

            await Swal.fire({
                icon: "success",
                title: "ยืนยันสำเร็จ!",
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

                    <h1 className="text-center text-3xl">สิ่งของที่รอยืนยันการคืน</h1>

                    <div className='flex flex-col gap-4 items-center mt-[10px]'>

                        {isLoading && <p>Loading...</p>}
                        {error && <p>Error: {error}</p>}
                        {!isLoading && borrowItem?.length ? (
                            borrowItem.map((value: any, index: any) => (
                                <div key={index} className='w-[80%]  bg-[#f0f0f0] shadow-lg rounded-lg flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <div key={index} className='bg-white rounded h-[40px]  ml-[10%] shadow'>
                                            <Image className='mt-[5px]' src={`http://${process.env.DOMAIN}/comsci_chi/add/uploads/${value["oImg"]}`} width={45} height={45} alt='' />

                                        </div>
                                        <div className="ml-[5px] w-[5cm]">

                                            <p className='text-[#71C55D] '>{value["oName"]}</p>
                                            <p>วันที่คืน: {formatDate(value["rDate"])}</p>
                                            <p>วันที่ยืม: {formatDate(value["sDate"])}</p>
                                            <p>กำหนดคืน: {formatDate(value["eDate"])}</p>
                                            <p>ยืมโดย: {value["uRealname"]}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <a onClick={() => { sendPostRequest(value["bId"]) }} className='mr-[20px] mt underline font-bold text-[#71C55D] cursor-pointer'>ยืนยัน</a>

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