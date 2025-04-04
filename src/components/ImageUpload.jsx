import React, { useEffect } from 'react';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';

const ImageUpload = ({
  images,
  prevImages,
  setImages,
  maxImages = 8,
  maxSizeInMB = 5,
  className = ''
}) => {
  const handleImageChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    
    // Check if adding new files would exceed the limit
    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Validate files
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= maxSizeInMB * 1024 * 1024;

      if (!isValidType) {
        toast.error(`${file.name} is not a valid image type (JPG, PNG, or GIF only)`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} exceeds ${maxSizeInMB}MB size limit`);
        return false;
      }

      return true;
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
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Cleanup function for object URLs
  useEffect(() => {

    if (prevImages) {
      setImages(prevImages.map(image => ({
        file: null,
        preview: image
      })));
    }
    return () => {
      images.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Image Upload Button */}
        {images.length < maxImages && (
          <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 transition-colors flex flex-col items-center justify-center aspect-square">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleImageChange}
              onClick={(e) => e.target.value = null}
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
        {images.length} of {maxImages} images uploaded
      </p>
    </div>
  );
};

export default ImageUpload;