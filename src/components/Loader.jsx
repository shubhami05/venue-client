import React from 'react'
import { RotatingTriangles } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>    
       <RotatingTriangles
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="rotating-triangles-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  )
}

export default Loader
