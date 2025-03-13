import React from 'react';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';

const ImageUpload = ({
  images,
  setImages,
  maxImages = 8,
  maxSizeInMB = 5,
  className = ''
}) => {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding new files would exceed the limit
    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      const isWithinSize = file.size <= maxSizeInMB * 1024 * 1024;
      
      if (!isValid) {
        toast.error(`${file.name} is not an image file`);
      }
      if (!isWithinSize) {
        toast.error(`${file.name} is too large (max ${maxSizeInMB}MB)`);
      }
      
      return isValid && isWithinSize;
    });

    // Create preview URLs and add to images array
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Image Upload Button */}
        {images.length < maxImages && (
          <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 transition-colors flex flex-col items-center justify-center aspect-square">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <MdCloudUpload className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Upload Images</span>
          </label>
        )}

        {/* Image Previews */}
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square group">
            <img
              src={image.preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-opacity"
              >
                <MdDelete className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Upload up to {maxImages} images (max {maxSizeInMB}MB each)
      </p>
    </div>
  );
};

export default ImageUpload; 