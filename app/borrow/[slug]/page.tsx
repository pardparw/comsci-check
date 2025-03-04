"use client"

import Footer from "@/app/components/footer"
import NavBar from "@/app/components/NavBar"
import { cookies } from "next/headers"
import Image from "next/image"
import { useState, useEffect } from "react"
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { checkCookie } from "@/app/utils/checkCookie"



export default function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {

    const router = useRouter();

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [cookie, setCookie] = useState("");

    const [slug, setSlug] = useState("");



    useEffect(() => {
        const fetchData = async () => {
            let oIds = (await params).slug
            setSlug(oIds)

            try {
                setIsLoading(true);
                const response = await fetch(`/api/item/item`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        oId: oIds
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setItems(result);





            } catch (err: any) {
                console.error("Fetching error:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (checkCookie() == null) {
            Swal.fire({
                icon: "warning",
                title: "กรุณาเข้าสู่ระบบ",
                confirmButtonText: "เข้าสู่ระบบ",
                showCloseButton: true,

            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                router.push("../login")
            });
        }

    }, []);



    const [formData, setFormData] = useState({
        uId: "",
        oId: "",
        sDate: "",
        eDate: "",
        status: "borrow",
        reason: "",
        amount: 1
    });
    const sendPostRequest = async () => {
        let timerInterval: number;
        const userCookie = checkCookie()
        formData.oId = slug
        formData.uId = userCookie!;



        // Check if essential form data is missing
        if (!formData.sDate || !formData.eDate) {
            Swal.fire({
                icon: "warning",
                title: "ข้อมูลไม่ครบ!",
                text: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนทำการยืม",
                confirmButtonText: "ตกลง"
            });
            return;
        }


        Swal.fire({
            title: "กำลังยืม",
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

            let response = await fetch(`/api/borrow/add`, {
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

            Swal.fire({
                icon: "success",
                title: "ยืมสำเร็จ!",
                showCloseButton: true,
                confirmButtonText: "กลับ"
            }).then((result) => {
                router.push("../")
            });

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





    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">

                <NavBar></NavBar>
                <div className="mt-[2.5cm] flex justify-center items-center flex-col">
                    <div className="bg-white rounded-xl shadow-lg w-[230px]">

                        <Image className="w-[100%] h-[5cm] rounded-xl" src={`http://${process.env.DOMAIN}/comsci_chi/add/uploads/${!isLoading ? items[0]["oImg"] : "icon_67c1a6be4dcaf.png"}`} alt="" width={1000} height={20} />

                    </div>
                    <input className="mt-4 w-[80%] h-[45px] rounded-3xl bg-white solid outline-[#71C55D] outline text-center" name="reason" value={formData.reason} onChange={handleChange} placeholder={`เหตุผลที่ยืม ${!isLoading ? items[0]["oName"] : ""}`} />

                    <div className="flex flex-col gap-6 mt-4 items-start justify-items-start">
                        <div>
                            <label>วันที่ยืม:</label>
                            <input type="date" className="bg-white shadow" name="sDate" value={formData.sDate} onChange={handleChange}></input>
                        </div>
                        <div>
                            <label >วันที่คืน:</label>
                            <input type="date" className="bg-white shadow" name="eDate" value={formData.eDate} onChange={handleChange}></input>
                        </div>
                    </div>
                    <button onClick={() => sendPostRequest()} className="mt-10 bg-[#71C55D] text-white w-[80%] h-[65px] text-xl rounded-3xl cursor-pointer duration-400 hover:bg-white hover:text-[#71C55D] hover:outline-[#71C55D] hover:outline">ยืม</button>
                </div>

            </main>
            <Footer></Footer>
        </div>

    )
}