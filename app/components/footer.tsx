import React from 'react'

const Footer = () => {
    return (
        <div>
            <hr className=" mt-[15px] text-[#dee2e6] w-[90%] ml-[5%]" />
            <footer  className="text-center p-[3px] relative font-[13px] t-[2cm] bt-[1px] border-solid">
                <p className="text-[#777]"> <a className="text-[#a5dc86]">Copyright ©2023 COMSCI CHECK</a>
                <br></br>
                    Developed by:<a href="https://www.facebook.com/pheemmpong.rodvaree/" target='_blank' className="text-[#777] font-bold underline"> pheemmapong rodvaree</a>
                </p>
            </footer>
        </div>
    );
}

export default Footer