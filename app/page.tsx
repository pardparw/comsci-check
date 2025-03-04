"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import NavBar from "./components/NavBar";
import Footer from "./components/footer";
import { checkCookie, LoadRole } from "./utils/checkCookie";
import Swal from "sweetalert2";

export default function Home() {
  const router = useRouter();
  const [itemClick, setItemClick] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Cookie, SetCookie] = useState("")
  const [Role, SetRole] = useState("")

  function SaveCatalog(value: any) {
    let tName: string = "";
    let Stop: number = value.length

    value.map((value: any, index: any) => (
      tName += `${value["tName"]}${(Stop - 1) != index ? "|" : ""}`
    ))
    document.cookie = `catalogy=${tName}; path=/;`;

  }

  useEffect(() => {


    SetCookie(checkCookie()!)
    SetRole(LoadRole()!)


    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/catalogy/all`, {
          mode: "cors",
          referrerPolicy: "unsafe-url",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setCatalog(result);
        SaveCatalog(result);
      } catch (err: any) {
        console.error("Fetching error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (tName: string) => {
    if (!itemClick) {
      router.push(`./item/${tName}`);
    } else {
      setItemClick(false);
    }
  };

  const handleEditClick = (e: any, tId: number) => {
    e.stopPropagation();
    setItemClick(true);
    router.push(`./edit/catalogy/${tId}`);
  };



  //Delete
  const DeleteCatalogy = async (e: any, tId: any) => {
    e.stopPropagation();
    setItemClick(true);
    let timerInterval: number;

    const result = await Swal.fire({
      title: "ต้องการลบหมวดหมู่",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก"
    });
    if (!result.isConfirmed) return;


    Swal.fire({
      title: "กำลังลบ",
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


      let response = await fetch(`/api/catalogy/delete`, {
        method: "POST",
        mode: "cors",
        referrerPolicy: "unsafe-url",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "tId": tId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();


      Swal.fire({
        icon: "success",
        title: "ลบสำเร็จ!",
        showCloseButton: true,
        confirmButtonText: "กลับ"
      }).then((result) => {
        const updatedData = catalog.filter((item: any) => item.tId !== tId);
        setCatalog(updatedData)
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


  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow">
        <div className="relative text-center pt-[2.5cm] font-medium text-3xl">
          <h1>หมวดหมู่</h1>
        </div>

        {isLoading && (
          <div className="text-center mt-8">
            <p>Loading catalog items...</p>
          </div>
        )}

        {error && (
          <div className="text-center mt-8 text-red-500">
            <p>Error loading catalog: {error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid min-[450px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-[80%] mx-auto mt-8 mb-8">
            {catalog.map((item) => (
              <div
                key={item["tId"]}
                onClick={() => handleItemClick(item["tName"])}
                className="w-[166px] h-[250px] rounded-2xl bg-[#ffffff50] shadow-lg cursor-pointer hover:scale-[1.05] duration-300 relative"
              >
                <Image
                  src={`http://${process.env.DOMAIN}/comsci_chi/add/uploads/${item["tImg"]}`}
                  width={166}
                  height={122}
                  alt={item["tName"] || "Catalog item"}
                  className="shadow-md h-[122px] rounded-t-2xl object-cover w-full"
                />

                <div className="mt-[10px] pl-[140px]">

                  {checkCookie() != "" && LoadRole() == "admin" ? (

                    <div className="flex flex-wrap flex-col gap-2 ">
                      <svg onClick={(e) => handleEditClick(e, item["tId"])} width="16" height="16" fill="currentColor" className=" bi bi-pencil-square text-[#0055ff] hover:text-[#777] transition-colors duration-300" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                        <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" fillRule="evenodd"></path>
                      </svg>




                      <svg onClick={(e) => DeleteCatalogy(e, item["tId"])} width="16" height="16" fill="currentColor" className="bi bi-trash3-fill text-[#ff0000] hover:text-[#777] transition-colors duration-300" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
                      </svg>
                    </div>
                  ) :
                    <div className="h-[40px]">
                    </div>}

                </div>

                <div className="text-center mt-[-20px] text-lg font-bold text-[#71C55D] flex justify-center">
                  <h1 className="uppercase truncate  w-[120px]">{item["tName"]}</h1>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}