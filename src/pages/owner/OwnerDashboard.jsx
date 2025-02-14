import React, { useState } from 'react'
import {   FaMoneyBill,  FaQuestionCircle, FaStar, FaUserTag } from 'react-icons/fa'
import { Link, Navigate } from 'react-router-dom'

const OwnerDashboard = () => {
    const [isLoading,setIsLoading] = useState(false);
    


    if(isLoading){
        return <Loader />
    }

    return (
        <div className='xl:container xl:mx-auto bg-zinc-100 min-h-screen  px-2 py-10'>
            {/* Cards top */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                

                <div className="shadow-lg bg-white text-orange-700 p-4 rounded-md ">
                    <div className='flex justify-end'>
                        <FaMoneyBill className='h-9 w-9 my-2 ' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">125</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Total Bookings</h3>
                    </div>
                </div>
                <div className="shadow-lg bg-white text-orange-700 p-4 rounded-md ">
                    <div className='flex justify-end'>
                        <FaQuestionCircle className='h-9 w-9 my-2 ' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">105</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Total Inquiries</h3>
                    </div>
                </div>
                <div className="shadow-lg bg-white text-orange-700 p-4 rounded-md ">
                    <div className='flex justify-end'>
                        <FaUserTag className='h-9 w-9 my-2 ' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">84</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Total Reviews</h3>
                    </div>
                </div>
                <div className="shadow-lg bg-white text-orange-700 p-4 rounded-md ">
                    <div className='flex justify-end'>
                        <FaStar className='h-9 w-9 my-2 ' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">4.5</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Average Rating</h3>
                    </div>
                </div>


            </div>

            <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                 <div className="shadow-lg bg-white text-orange-700 p-4 rounded-md ">
                    <div className='flex justify-end'>
                        <FaMoneyBill className='h-9 w-9 my-2 ' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">125</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Total Bookings</h3>
                    </div>
                </div>
                 <div className="shadow-lg bg-white text-orange-700 p-4 rounded-md ">
                    <div className='flex justify-end'>
                        <FaMoneyBill className='h-9 w-9 my-2 ' />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-orange-900">125</h3>
                        <h3 className="text-lg font-semibold text-orange-900">Total Bookings</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerDashboard
