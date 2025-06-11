"use client"

import React, { useState, useEffect, use } from "react"
import { useRouter } from 'next/navigation'
import Image from "next/image"
import NavBar from "@/app/components/NavBar"
import Footer from "@/app/components/footer"
import { formatDate } from "@/app/utils/formatDate"
import { checkCookie, LoadRole } from "@/app/utils/checkCookie"
import Swal from "sweetalert2"

type Params = Promise<{ slug: string[] }>;
export default function Page({ params }: { params: Params }) {
  const router = useRouter();
  const [slugs, setSlug] = useState("Item");
  const [items, setItems] = useState<any[]>([]);
  const [borrowInfo, setBorrowInfo] = useState<any>({});
  const [itemInfo, setItemInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cookie, setCookie] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setCookie(checkCookie() || "");
    setRole(LoadRole() || "");

    const fetchData = async () => {
      try {
        // Use params directly
        const catalogName = (await params).slug;
        setSlug(catalogName.toString());
        setIsLoading(true);
        // console.log(catalogName)

        // Use environment variable safely with fallback

        const response = await fetch(`/api/item/all`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            oName: catalogName
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
  }, []); // Correct dependency

  const handleEditClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    router.push(`../edit/item/${itemId}`);
  };

  const handleSeeBorrow = (e: React.MouseEvent, borrowData: any) => {
    e.stopPropagation();

    if (borrowData?.bSumCount > 0) {
      const modal = document.getElementById('borrow_modal') as HTMLDialogElement;
      if (modal) modal.showModal();
      setBorrowInfo(borrowData);
    }
  };

  const handleSeeItem = (e: React.MouseEvent, itemData: any) => {
    e.stopPropagation();
    const modal = document.getElementById('Item_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
    setItemInfo(itemData);
  };

  // Delete item
  const deleteItems = async (e: React.MouseEvent, oId: string) => {
    e.stopPropagation();

    let timerInterval: number;

    const result = await Swal.fire({
      title: "ต้องการลบสิ่งของ",
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

      let response = await fetch(`/api/item/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oId: oId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();

      Swal.fire({
        icon: "success",
        title: "ลบสำเร็จ!",
        showCloseButton: true,
        confirmButtonText: "กลับ"
      }).then(() => {
        const updatedData = items.filter((item: any) => item.oId !== oId);
        setItems(updatedData);
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
  }


  const textTheme = "";

  return (


    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <NavBar />

        <div className="relative text-[#777] font-bold pt-[2.5cm] font-medium">
          <h1 className="text-center text-3xl">{slugs}</h1>

          {isLoading && (
            <div className="text-center mt-8 text-black">
              <p>Loading items...</p>
            </div>
          )}

          {error && (
            <div className="text-center mt-8 text-red-500">
              <p>Error loading items: {error}</p>
            </div>
          )}

          {!isLoading && !error && items.length === 0 && (
            <div className="text-center mt-8 text-black">
              <p>No items found in this category.</p>
            </div>
          )}

          {!isLoading && !error && items.length > 0 && (
            <div className="grid min-[450px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-[80%] mx-auto mt-8">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="w-[166px] h-[250px] rounded-2xl bg-[#ffffff50] shadow-lg"
                >
                  <div className="relative">

                    <Image

                      src={`http://${process.env.DOMAIN}/comsci_chi/add/uploads/${item.oImg}`}
                      width={166}
                      height={122}
                      alt={"Item image"}
                      className="shadow-md h-[122px] rounded-t-2xl object-cover"
                    />
                    <button
                      onClick={(e) => handleSeeItem(e, item)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill w-5 h-5 text-gray-600 cursor-pointer" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                      </svg>

                    </button>
                  </div>

                  <div className="mt-[10px] pl-[140px]">
                    {cookie !== "" && role === "admin" ? (
                      <div className="flex flex-wrap flex-col gap-2 ">
                        <button
                          onClick={(e) => handleEditClick(e, item.oId)}
                          aria-label="Edit item"
                          className="text-[#0055ff] hover:text-[#777] transition-colors duration-300"
                        >
                          <svg width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                            <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" fillRule="evenodd"></path>
                          </svg>
                        </button>

                        <button
                          onClick={(e) => deleteItems(e, item.oId)}
                          aria-label="Delete item"
                          className="text-[#ff0000] hover:text-[#777] transition-colors duration-300"
                        >
                          <svg width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="h-[40px]"></div>
                    )}
                  </div>

                  <div className="w-[135px]">
                    <div className="mt-[-45px] text-sm text-[#777] pl-[5px]">
                      <h2 className="w-[130px] h-[20px] truncate font-medium" title={item.oName}>{item.oName}</h2>
                    </div>

                    <div className="flex flex-col pl-[5px]">
                      <p>จำนวน: {item.oRemaining}</p>

                      <button
                        className="underline text-left cursor-pointer"
                        onClick={(e) => handleSeeBorrow(e, item.Borrow)}
                        disabled={!item.Borrow?.bSumCount}
                      >
                        ยืมไป: {item.Borrow?.bSumCount || 0}
                      </button>

                      {item.oRemaining > 0 ? (
                        <button
                          onClick={() => router.push(`../../borrow/${item.oId}`)}
                          className="font-bold text-[#71C55D] underline text-left cursor-pointer"
                        >
                          ต้องการยืม?
                        </button>
                      ) : (
                        <div className="h-6"></div>
                      )}

                      <p className="text-[11px] pt-[5px]">
                        LastUpdate: {formatDate(item.oDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cookie !== "" && role === "admin" ? (
            <div className="flex justify-center w-[100%] h-[2.5cm] mt-8 mb-4">
              <div onClick={() => { router.push("../add/item") }} className="flex flex-col items-center cursor-pointer duration-300">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path className="text-[#71C55D]" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path className="text-[#777]" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                  </svg>
                </div>
                <div className="mt-2">
                  <h1 className="text-2xl text-[#71C55D]">เพิ่มสิ่งของ</h1>
                </div>
              </div>
            </div>
          ) : null}

          {/* Borrow Information Modal */}
          <dialog id="borrow_modal" className="modal">
            <div className="modal-box text-center text-black dark:text-white">
              <h3 className="font-bold text-lg">ยืมโดย</h3>

              {borrowInfo?.bInfo && borrowInfo.bInfo.length > 0 ? (
                <ul className="py-4 flex flex-col items-center">
                  {borrowInfo.bInfo.map((value: any, index: number) => (
                    <div key={index} className="w-[80%] border border-dashed rounded-lg mb-2 p-2">
                      <li>ชื่อ: {value.bRealName} </li>
                      <li>วันที่ยืม: {formatDate(value.bDStart)} </li>
                      <li>วันที่คืน: {formatDate(value.bDEnd)} </li>
                      <li>เบอร์โทร: {value.bPhone !== "" ? value.bPhone : "-"} </li>
                      <li>จำนวน: {value.bCount} </li>
                      <li>เหตุผล: {value.bReason !== "" ? value.bReason : "-"} </li>
                      <li>สถานะ: {value.bStatus === "borrow" ? "กำลังยืม" : "รอคุณครูยืนยันการคืน"}</li>
                    </div>
                  ))}
                </ul>
              ) : (
                <p className="py-4">ไม่มีข้อมูลการยืม</p>
              )}

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>

            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>

          {/* Item Detail Modal */}
          <dialog id="Item_modal" className="modal">
            <div className="modal-box text-center text-black dark:text-white">
              <h3 className="font-bold text-lg ">รายละเอียด</h3>

              <ul className="py-4 flex flex-col items-center">
                <div className="w-[80%] border border-dashed rounded-lg mb-2 p-2">
                  <li>ชื่อ: {itemInfo.oName} </li>
                  <li>สถานะ: {itemInfo.oStatus} </li>
                  <li>อุปกรณ์: {itemInfo.oAccessory} </li>
                  <li>เลขที่คุรุภัณฑ์/ปีจัดซื้อ: {itemInfo.oSerial} </li>
                </div>
              </ul>

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>

            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
}