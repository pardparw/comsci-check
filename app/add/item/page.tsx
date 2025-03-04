"use client"

import NavBar from '@/app/components/NavBar'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Footer from '@/app/components/footer'
import { LoadCatalogy } from '@/app/utils/checkCookie'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

function page() {

  const [isOpen, setIsOpen] = useState(false);
  const [Catalogy, setCatalogy] = useState<any>([]);
  useEffect(() => {
    setCatalogy(LoadCatalogy())
  }, []);
  // function

  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    oImg: '',
    oName: '',
    oUnit: '',
    oType: '',
    oSerial: '',
    oAccessory: '',
    oStatus: 'ปกติ',
    oAmount: 1,
    oDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const [accessoryss, setAccessoryss] = useState<boolean[]>(new Array(4).fill(false));
  const accessoryNames = ["เมาส์", "คีย์บอร์ด", "สายไฟ", "สายชารจ์"];

  function toggleAccessory(index: number) {
    setAccessoryss((prev) => {
      const updatedAccessories = [...prev]; // Create a new array to avoid mutation
      updatedAccessories[index] = !prev[index];

      // Update form data
      formData.oAccessory = updatedAccessories
        .map((value, i) => (value ? accessoryNames[i] : null))
        .filter(Boolean) // Remove null values
        .join(" ");

      return updatedAccessories;
    });
  }

  const sendPostRequest = async () => {


    // Check if essential form data is missing
    if (!formData.oName ||
      !formData.oUnit ||
      !formData.oType ||
      !formData.oSerial ||
      !selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบ!",
        text: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนเพิ่ม",
        confirmButtonText: "ตกลง"
      });
      return;
    }


    try {

      let response = await fetch(`/api/item/add`, {
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
        title: "เพิ่มสำเร็จ!",
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


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImage(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  const uploadImage = async () => {




    setIsUploading(true);
    let timerInterval: number;

    Swal.fire({
      title: "กำลังเพิ่ม",
      timer: 2000,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval!);
      }
    });

    const formDatas = new FormData();
    formDatas.append("image", selectedFile!);

    try {
      const response = await fetch(`/api/upload`, {
        method: "POST",
        body: formDatas,
      });

      const data = await response.json();
      if (response.ok) {

        formData.oImg = data.imageUrl
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


  const AddItems = async () => {

    const d = new Date();
    d.getDate();
    formData.oDate = d.toISOString();
    if (
      !formData.oName ||
      !formData.oUnit ||
      !formData.oType ||
      !formData.oSerial ||
      !selectedFile
    ) return Swal.fire({

      icon: "warning",
      title: "ข้อมูลไม่ครบ!",
      text: "กรุณากรอกข้อมูลให้ครบถ้วนก่อนเพิ่ม",
      confirmButtonText: "ตกลง"
    });
    if (!formData.oAccessory) {
      const result = await Swal.fire({
        title: "สิ่งของไม่มี อุปกรณ์",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ไม่มี",
        cancelButtonText: "มี"
      });

      if (result.isConfirmed) {
        uploadImage();

      };



    } else {
      uploadImage();

    }


  }


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">


        <NavBar></NavBar>
        <div className="mt-[2.5cm] flex justify-center items-center flex-col">
          <div className="bg-white rounded-xl shadow-lg w-[230px]">

            <div className="relative w-full h-[5cm]">
              {image ? (
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
                  onClick={() => { setImage("") }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill w-5 h-5 text-gray-600" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                  </svg>

                </button>
              )}
            </div>
          </div>
          <input className="mt-4 w-[80%] h-[45px] rounded-3xl bg-white solid outline-[#71C55D] outline text-center" placeholder="ชื่อสิ่งของ" name='oName' value={formData.oName} onChange={handleChange} />
          <input className="mt-2 w-[80%] h-[45px] rounded-3xl bg-white solid outline-[#71C55D] outline text-center" placeholder="เลขที่คุรุภัณฑ์/ปีจัดซื้อ" name='oSerial' value={formData.oSerial} onChange={handleChange} />

          <div className="flex gap-6 mt-2 w-[80%] justify-between">

            <select name="unit" defaultValue={"-"} id="object-unit" className='w-[50%] h-[50px] rounded-3xl  bg-white solid outline-[#71C55D] outline text-center' onChange={(e) => { formData.oUnit = (e.target.value) }}>
              <option className='text-[#777]' value="-" disabled={true} >หน่วย</option>
              <option value="ชิ้น">ชิ้น</option>
              <option value="เครื่อง">เครื่อง</option>
            </select>
            <select name="unit" defaultValue={"-"} id="object-catalogy" className='w-[50%] h-[50px] rounded-3xl  bg-white solid outline-[#71C55D] outline text-center' onChange={(e) => { formData.oType = (e.target.value) }}>
              <option className='text-[#777]' value="-" disabled={true}>หมวดหมู่</option>
              {Catalogy && (
                Catalogy.map((value: any, index: any) => (
                  <option value={value} key={index}>{value}</option>
                ))
              )}

            </select>

          </div>

          <button
            className="mt-2 w-[80%] h-[45px] text-xl rounded-3xl cursor-pointer duration-400 bg-white hover:text-[#71C55D] outline-[#71C55D] outline flex items-center justify-center relative px-6"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="absolute left-1/2 -translate-x-1/2">อุปกรณ์</span>
            <svg
              className={`ml-auto transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                }`}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              ></path>
            </svg>
          </button>

          {isOpen && (

            <div
              className={`overflow-hidden transition-all duration-300 shadow-xl w-[80%] mt-2 p-4 rounded-lg shadow-md bg-white  max-[430px]:overflow-y-auto ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="flex gap-5 flex-wrap ">
                {accessoryNames.map((name, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-success"
                      onChange={() => toggleAccessory(index)}
                      checked={accessoryss[index]}
                    />
                    {name}
                  </label>
                ))}


              </div>
              <hr className=" mt-[5px] text-[#dee2e6] w-[100%]" />
              <p>การใช้งาน</p>
              <div className="flex flex-col mt-[5px]">
                <div>
                  <input type="radio" id="oSatus1" name="statts" value="ปกติ" className='radio radio-accent' onChange={() => setFormData((prevData) => ({ ...prevData, oStatus: "ปกติ" }))} defaultChecked={formData.oStatus == "ปกติ" ? true : false}></input>
                  <label form="html"> ปกติ</label>

                </div>
                <div>
                  <input type="radio" id="oSatus2" name="statts" className='radio radio-accent' value="เสีย" onChange={() => setFormData((prevData) => ({ ...prevData, oStatus: "เสีย" }))} defaultChecked={formData.oStatus == "เสีย" ? true : false}></input>
                  <label form="html"> เสีย</label>
                </div>
                <div>
                  <input type="radio" id="oSatus3" name="statts" className='radio radio-accent' value="ส่งซ่อม" onChange={() => setFormData((prevData) => ({ ...prevData, oStatus: "ส่งซ่อม" }))} defaultChecked={formData.oStatus == "ส่งซ่อม" ? true : false}></input>
                  <label form="html"> ส่งซ่อม</label>
                </div>
              </div>


            </div>

          )}



          <button onClick={() => AddItems()} className="mt-10 bg-[#71C55D] text-white w-[80%] h-[65px] text-xl rounded-3xl cursor-pointer duration-400 hover:bg-white hover:text-[#71C55D] hover:outline-[#71C55D] hover:outline" disabled={isUploading}>{isUploading ? "กำลังเพิ่ม..." : "เพิ่ม"}</button>
        </div>
      </main>
      <Footer></Footer>
    </div>

  )
}

export default page