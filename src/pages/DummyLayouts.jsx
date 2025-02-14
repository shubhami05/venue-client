import React from 'react'
import Slider from "@ant-design/react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DummyLayouts = () => {


    var SliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };


    return (
        <div>
            <section className="container mx-auto py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-orange-50 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Simple & easy way to find your dream Appointment</h3>
                        <p className="text-gray-600 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best. every pleasure is to be welcomed.</p>
                        <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900">Get Started</button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <img src="https://via.placeholder.com/300x200" alt="Property Image" className="w-full rounded-lg" />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <img src="https://via.placeholder.com/300x200" alt="Property Image" className="w-full rounded-lg" />
                    </div>
                </div>
            </section>

            <section className="container mx-auto py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img src="https://via.placeholder.com/600x400" alt="Property Image" className="w-full rounded-lg" />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-2xl font-bold mb-4">Best rated host on popular rental sites</h3>
                        <p className="text-gray-600 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. In a free hour, when our power of choice is untrammelled.</p>
                        <ul className="list-disc list-inside text-gray-600 mb-4">
                            <li>Find excellent deals</li>
                            <li>Friendly host & Fast support</li>
                            <li>Secure payment system</li>
                        </ul>
                        <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900">Learn more</button>
                    </div>
                </div>
            </section>

            <section className="container mx-auto py-12">
                <Slider {...SliderSettings} className=' overflow-y-hidden'>
                    <div className="bg-orange-50  p-6 rounded-lg shadow">
                        <div className="flex sm:flex-row flex-col justify-between items-center mb-4">
                            <img src="https://via.placeholder.com/100x100" alt="Profile Image" className="w-16 h-16 rounded-full" />
                            <div>
                                <h3 className="text-xl sm:text-right text-center text-zinc-700 font-bold mb-1">Taylor Wilson</h3>
                                <p className="text-gray-600">Product Manager - Static Mania</p>
                            </div>

                        </div>
                        <p className="text-gray-600 mb-4">Eget eu massa et consectetur. Mauris donec. Leo a, id sed duis proin sodales. Turpis viverra diam porttitor mattis morbi ac amet. Euismod commodo. We get you customer relationships that last.</p>
                        <div className="flex justify-between font-medium">
                            <button className="bg-orange-500 transition-colors text-white px-4 py-2 rounded-md hover:bg-orange-600">Previous</button>
                            <button className="bg-orange-500 transition-colors text-white px-4 py-2 rounded-md hover:bg-orange-600">Next</button>
                        </div>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg shadow">
                        <div className="flex sm:flex-row flex-col justify-between items-center mb-4">
                            <img src="https://via.placeholder.com/100x100" alt="Profile Image" className="w-16 h-16 rounded-full" />
                            <div>
                                <h3 className="text-xl sm:text-right text-center text-zinc-700 font-bold mb-1">Taylor Wilson</h3>
                                <p className="text-gray-600">Product Manager - Static Mania</p>
                            </div>

                        </div>
                        <p className="text-gray-600 mb-4">Eget eu massa et consectetur. Mauris donec. Leo a, id sed duis proin sodales. Turpis viverra diam porttitor mattis morbi ac amet. Euismod commodo. We get you customer relationships that last.</p>
                        <div className="flex justify-between font-medium">
                            <button className="bg-orange-500 transition-colors text-white px-4 py-2 rounded-md hover:bg-orange-600">Previous</button>
                            <button className="bg-orange-500 transition-colors text-white px-4 py-2 rounded-md hover:bg-orange-600">Next</button>
                        </div>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg shadow">
                        <div className="flex sm:flex-row flex-col justify-between items-center mb-4">
                            <img src="https://via.placeholder.com/100x100" alt="Profile Image" className="w-16 h-16 rounded-full" />
                            <div>
                                <h3 className="text-xl sm:text-right text-center text-zinc-700 font-bold mb-1">Taylor Wilson</h3>
                                <p className="text-gray-600">Product Manager - Static Mania</p>
                            </div>

                        </div>
                        <p className="text-gray-600 mb-4">Eget eu massa et consectetur. Mauris donec. Leo a, id sed duis proin sodales. Turpis viverra diam porttitor mattis morbi ac amet. Euismod commodo. We get you customer relationships that last.</p>
                        <div className="flex justify-between font-medium">
                            <button className="bg-orange-500 transition-colors text-white px-4 py-2 rounded-md hover:bg-orange-600">Previous</button>
                            <button className="bg-orange-500 transition-colors text-white px-4 py-2 rounded-md hover:bg-orange-600">Next</button>
                        </div>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg shadow">
                        <div className="flex sm:flex-row flex-col justify-between items-center mb-4">
                            <img src="https://via.placeholder.com/100x100" alt="Profile Image" className="w-16 h-16 rounded-full" />
                            <div>
                                <h3 className="text-xl sm:text-right text-center text-zinc-700 font-bold mb-1">Taylor Wilson</h3>
                                <p className="text-gray-600">Product Manager - Static Mania</p>
                            </div>

                        </div>
                        <p className="text-gray-600 mb-4">Eget eu massa et consectetur. Mauris donec. Leo a, id sed duis proin sodales. Turpis viverra diam porttitor mattis morbi ac amet. Euismod commodo. We get you customer relationships that last.</p>
                        <div className="flex justify-between font-medium">
                            <button className="bg-orange-500 transition-colors text-white px-4 py-2 rounded-md hover:bg-orange-600">Previous</button>
                            <button className="bg-orange-500 transition-colors text-white px-4 py-2 rounded-md hover:bg-orange-600">Next</button>
                        </div>
                    </div>

                </Slider>
                <div className="bg-orange-50 p-6 rounded-lg shadow">
                    <div className="flex sm:flex-row flex-col justify-between items-center mb-4">
                        <img src="https://via.placeholder.com/100x100" alt="Profile Image" className="w-16 h-16 rounded-full" />
                        <div>
                            <h3 className="text-xl sm:text-right text-center text-zinc-700 font-bold mb-1">Taylor Wilson</h3>
                            <p className="text-gray-600">Product Manager - Static Mania</p>
                        </div>

                    </div>
                    <p className="text-gray-600 mb-4">Eget eu massa et consectetur. Mauris donec. Leo a, id sed duis proin sodales. Turpis viverra diam porttitor mattis morbi ac amet. Euismod commodo. We get you customer relationships that last.</p>
                    <div className="flex justify-between font-medium">
                        <button className="bg-orange-500 transition-colors text-white px-4 py-2 rounded-md hover:bg-orange-600">Previous</button>
                        <button className="bg-orange-500 transition-colors text-white px-4 py-2 rounded-md hover:bg-orange-600">Next</button>
                    </div>
                </div>
            </section>

            <section className="container mx-auto py-12 bg-zinc-800">
        <h2 className="text-3xl font-bold mb-4 text-white text-center overflow-y-hidden">News & Consult</h2>
        <div className="flex justify-end mb-4">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Explore All →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <img src="https://via.placeholder.com/300x200" alt="News Image" className="w-full rounded-lg" />
            <h3 className="text-gray-800 font-bold mt-2">9 Easy-to-Ambitious DIY Projects to Improve Your Home</h3>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 mt-2">Read the Article →</button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <img src="https://via.placeholder.com/300x200" alt="News Image" className="w-full rounded-lg" />
            <h3 className="text-gray-800 font-bold mt-2">Serie Shophouse Launch In July, Opportunity For Investors</h3>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 mt-2">Read the Article →</button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <img src="https://via.placeholder.com/300x200" alt="News Image" className="w-full rounded-lg" />
            <h3 className="text-gray-800 font-bold mt-2">Looking for a New Place? Use This Time to Create Your Wishlist</h3>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 mt-2">Read the Article →</button>
          </div>
        </div>
      </section>

        </div>
    )
}

export default DummyLayouts
