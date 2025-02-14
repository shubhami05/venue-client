import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const OwnerVenues = ({ searchTerm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to display per page
  const [totalPages, setTotalPages] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const navigate = useNavigate();
  const productData = [
    {

      name: 'Apple Watch Series 7',
      category: 'Electronics',
      price: 296,
      sold: 22,
      profit: 45,
    },
    {

      name: 'Macbook Pro M1',
      category: 'Electronics',
      price: 546,
      sold: 12,
      profit: 125,
    },
    {

      name: 'Dell Inspiron 15',
      category: 'Electronics',
      price: 443,
      sold: 64,
      profit: 247,
    },
    {

      name: 'HP Probook 450',
      category: 'Electronics',
      price: 499,
      sold: 72,
      profit: 103,
    },
    {

      name: 'HP Probook 450',
      category: 'Electronics',
      price: 499,
      sold: 72,
      profit: 103,
    },
    {

      name: 'HP Probook 450',
      category: 'Electronics',
      price: 499,
      sold: 72,
      profit: 103,
    },
    {

      name: 'HP Probook 450',
      category: 'Electronics',
      price: 499,
      sold: 72,
      profit: 103,
    },
    {

      name: 'HP Probook 450',
      category: 'Electronics',
      price: 499,
      sold: 72,
      profit: 103,
    },
    {

      name: 'HP Probook 450',
      category: 'Electronics',
      price: 499,
      sold: 72,
      profit: 103,
    },

  ];

  useEffect(() => {
    console.log(searchTerm);
  }, [searchTerm]);
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedSearchTerm(searchTerm);
  //   }, 200); // Adjust the delay as needed
  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [searchTerm]);

  useEffect(() => {
    const filteredData = productData.filter(item =>
      item.name.toLowerCase().includes((debouncedSearchTerm || "").toLowerCase())
    );
    // Calculate the index of the first and last item on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(filteredData.slice(indexOfFirstItem, indexOfLastItem));

    // Calculate total pages
    setTotalPages(Math.ceil(productData.length / itemsPerPage));
  }, [debouncedSearchTerm]);



  // Calculate the index of the first and last item on the current page
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


  // // Calculate total pages
  // const totalPages = Math.ceil(productData.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="rounded-sm border border-stroke text-orange-900 bg-orange-50 shadow-default dark:border-strokedark dark:bg-boxdark px-5 min-h-screen">
      <div className="py-6 px-4 md:px-6 xl:px-7 flex justify-between">
        <h4 className="text-3xl font-bold text-orange-900 dark:text-white">
          All Venues
        </h4>
        <button className={`bg-orange-600 shadow-lg transition-colors hover:bg-orange-700 text-orange-50 font-bold py-2 px-4 rounded flex items-center gap-2`} onClick={() => navigate('/owner/venues/new')}>
          <FaPlus/>
          Add New Venue
        </button>
      </div>

      <div className="grid grid-cols-6 border border-zinc-500 py-4 px-4 bg-orange-600 text-orange-50 sm:grid-cols-8 md:px-6 2xl:px-7 ">
        <div className="col-span-1 flex items-center">
          <p className="font-semibold text-lg">Actions</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-semibold text-lg">Venue Name</p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-semibold text-lg">Category</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-semibold text-lg">Price</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-semibold text-lg">Reviews</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-semibold text-lg">Inquiries</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-semibold text-lg">Booking</p>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {currentItems.map((product, key) => (
          <div
            className="grid grid-cols-6 border border-orange-100 bg-zinc-50 text-zinc-900 py-4 px-4 sm:grid-cols-8 md:px-6 2xl:px-7"
            key={key}
          >
            <div className="col-span-1 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-md">.....</p>
              </div>
            </div>
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-md">{product.name}</p>
              </div>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="text-md">{product.category}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-md">${product.price}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-md">{product.sold}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-md">{product.sold}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-md text-meta-3">${product.profit}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center py-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-orange-500 text-white' : 'bg-orange-200 text-orange-900'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};


export default OwnerVenues;
