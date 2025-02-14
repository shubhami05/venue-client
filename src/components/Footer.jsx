import { faFacebook, faInstagram, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className=" w-100 bg-orange-50 py-20">
            <div className="mx-auto px-4">
                <div className="flex container flex-wrap -mx-4">
                    <div className="w-full sm:w-1/3 px-4 mb-6">
                        <h5 className="text-xl font-bold text-gray-800 mb-4">VenueServ</h5>
                        <p className="text-gray-700 text-sm">
                            Best online venue listing & booking platform
                        </p>
                        <p className="text-gray-700 text-sm">+(123) 456-7890</p>
                        <p className="text-gray-700 text-sm">venueserv@mail.com</p>
                        <div className="mt-4 text-xl">
                            <a href="#" className="text-gray-700 transition-colors hover:text-orange-500 mr-2">
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                            <a href="#" className="text-gray-700 transition-colors hover:text-orange-500 mr-2">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a href="#" className="text-gray-700 transition-colors hover:text-orange-500 mr-2">
                                <FontAwesomeIcon icon={faYoutube} />
                            </a>
                            <a href="#" className="text-gray-700 transition-colors hover:text-orange-500 mr-2">
                                <FontAwesomeIcon icon={faLinkedin} />
                            </a>

                        </div>
                    </div>
                    <div className="w-full sm:w-1/3 px-4 mb-6">
                        <h5 className="text-xl font-bold text-gray-800 mb-4">
                            Quick Links
                        </h5>
                        <ul className="text-gray-700 text-sm">
                            <li className="mb-2">
                                <Link to="/" className="transition-colors hover:text-orange-500">
                                    Home
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/list-your-venue" className="transition-colors hover:text-orange-500">
                                    List your venue
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/explore" className="transition-colors hover:text-orange-500">
                                    Explore
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/bookings" className="transition-colors hover:text-orange-500">
                                    Bookings
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/contact" className="transition-colors hover:text-orange-500">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="w-full sm:w-1/3 px-4 mb-6">
                        <h5 className="text-xl font-bold text-gray-800 mb-4">
                            Information
                        </h5>
                        <ul className="text-gray-700 text-sm">
                            <li className="mb-2">
                                <a href="#" className="transition-colors hover:text-orange-500">
                                    About booking process
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="transition-colors hover:text-orange-500">
                                    Guideline for VenueOwners
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="transition-colors hover:text-orange-500">
                                    Payment process
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="transition-colors hover:text-orange-500">
                                    Terms and conditions
                                </a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="transition-colors hover:text-orange-500">
                                    How it works?
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
                <div className="text-center mt-8">
                    <p className="text-gray-700 text-sm">
                        © Shubham Italiya. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
