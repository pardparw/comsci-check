"use client"

import NavBar from '@/app/components/NavBar'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Footer from '@/app/components/footer'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

export default function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {


    const [slugs, SetSlugs] = useState("")
    const [Catalogy, SetCatalogy] = useState([])
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const SetSlug = async () => {
        
            try {
                // Use params directly since it's no longer a Promise in modern Next.js
                const slug = (await params).slug
                SetSlugs(slug);
                setIsLoading(true);


                // Use environment variable safely with fallback

                const response = await fetch(`/api/catalogy/catalogy`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
      
                    body: JSON.stringify({
                       tId: slug
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                SetCatalogy(result);
                setImage(`http://${process.env.DOMAIN}/comsci_chi/add/uploads/${result[0]["tImg"]}`)
                formData.tId = result[0]["tId"];
                formData.tImg = result[0]["tImg"];
                formData.tName = result[0]["tName"];
            } catch (err: any) {
                console.error("Fetching error:", err);
                // setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }




        SetSlug()
    }, [slugs])

    const router = useRouter();

    const [image, setImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({tId: '', tImg: '', tName: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const sendPostRequest = async () => {
        


        // Check if essential form data is missing
        if (!formData.tImg || !formData.tName) {
            Swal.fire({
                icon: "warning",
                title: "ข้อมูลไม่ครบ!",
                text: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนแก้ไข",
                confirmButtonText: "ตกลง"
            });
            return;
        }



        try {

            let response = await fetch(`/api/catalogy/update`, {
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
                title: "แก้ไขสำเร็จ!",
                showCloseButton: true,
                confirmButtonText: "กลับ"
            }).then((result) => {
                router.push("../../")
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


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        formData.tImg = ""
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setImage(URL.createObjectURL(file)); // Preview the selected image
        }
    };

    const uploadImage = async () => {

        if (!formData.tName) {
            Swal.fire({
                icon: "warning",
                title: "ข้อมูลไม่ครบ!",
                text: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนแก้ไข",
                confirmButtonText: "ตกลง"
            });
            return;
        }
        if(formData.tImg){
            setIsUploading(true);
            sendPostRequest()
            return;
        }
        if (!selectedFile) return Swal.fire({
            icon: "warning",
            title: "ข้อมูลไม่ครบ!",
            text: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนแก้ไข",
            confirmButtonText: "ตกลง"
        });

        let timerInterval: number;

        Swal.fire({
          title: "กำลังแก้ไข",
          timer: 2000,
          timerProgressBar: false,
          didOpen: () => {
            Swal.showLoading();
          },
          willClose: () => {
            clearInterval(timerInterval!);
          }
        });

        setIsUploading(true);
        const formDatas = new FormData();
        formDatas.append("image", selectedFile);

        try {
            const response = await fetch(`/api/upload`, {
                method: "POST",
                body: formDatas,
            });

            const data = await response.json();
            if (response.ok) {

                formData.tImg = data.imageUrl
                sendPostRequest()
            } else {
                alert("Upload failed!");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: `Error uploading image: ${error}`,
                confirmButtonText: "ลองอีกครั้ง"
            });

        } finally {
            setIsUploading(false);
        }
    };




    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <NavBar BackLink="../../" ReturnLink='../../return' ReturnCheckLink='../../returncheck' AddCatalogyLink='../../add/catalogy'></NavBar>
                <div className="mt-[2.5cm] flex justify-center items-center flex-col">
                    <div className="bg-white rounded-xl shadow-lg w-[230px]">

                        <div className="relative w-full h-[5cm]">
                            {!isLoading && image ? (
                                <Image
                                    className="w-full h-full rounded-xl object-cover"
                                    src={image}
                                    alt="Uploaded"
                                    width={1000}
                                    height={200}
                                />
                            ) : (
                                <div className="skeleton w-full h-full rounded-xl"></div>
                            )}



                            {!image && (
                                <label htmlFor="fileInput" className="absolute text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer duration-300 hover:bg-blue-600">
                                    เลือกรูปภาพ
                                </label>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileInput" />
                            {image && (
                                <button
                                    onClick={() => { setImage(""); formData.tImg = "" }}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill w-5 h-5 text-gray-600" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                                    </svg>

                                </button>
                            )}
                        </div>
                    </div>
                    <input className="mt-4 w-[80%] h-[45px] rounded-3xl bg-white solid outline-[#71C55D] outline text-center" name='tName' value={formData.tName} onChange={handleChange} placeholder="ชื่อหมวดหมู่" />





                    <button onClick={uploadImage} className="mt-10 bg-[#71C55D] text-white w-[80%] h-[65px] text-xl rounded-3xl cursor-pointer duration-400 hover:bg-white hover:text-[#71C55D] hover:outline-[#71C55D] hover:outline" disabled={isUploading}> {isUploading ? "กำลังแก้ไข..." : "แก้ไข"}</button>

                </div>
            </main>
            <Footer></Footer>

        </div>
    )
}