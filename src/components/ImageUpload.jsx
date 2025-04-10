import React, { useEffect } from 'react';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import toast from 'react-hot-toast';

const ImageUpload = ({
  photos,
  prevPhotos,
  setPhotos,
  maxPhotos = 8,
  maxSizeInMB = 5,
  className = '',
  onRemovePhoto
}) => {
  const handlePhotoChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    
    // Check if adding new files would exceed the limit
    if (photos.length + files.length > maxPhotos) {
      toast.error(`You can only upload up to ${maxPhotos} photos`);
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

    // Create preview URLs and add to photos array
    const newPhotos = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index) => {
    if (onRemovePhoto) {
      onRemovePhoto(index);
    } else {
      setPhotos(prev => {
        const newPhotos = [...prev];
        if (newPhotos[index].preview.startsWith('blob:')) {
          URL.revokeObjectURL(newPhotos[index].preview);
        }
        newPhotos.splice(index, 1);
        return newPhotos;
      });
    }
  };

  // Cleanup function for object URLs
  useEffect(() => {
    if (prevPhotos) {
      setPhotos(prevPhotos.map(photo => ({
        file: null,
        preview: photo,
        isExisting: true
      })));
    }
    return () => {
      photos.forEach(photo => {
        if (photo.preview && photo.preview.startsWith('blob:')) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    };
  }, []);

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Photo Upload Button */}
        {photos.length < maxPhotos && (
          <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-500 transition-colors flex flex-col items-center justify-center aspect-square">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handlePhotoChange}
              onClick={(e) => e.target.value = null}
              className="hidden"
            />
            <MdCloudUpload className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Upload Photos</span>
          </label>
        )}

        {/* Photo Previews */}
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square group">
            <img
              src={photo.preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center">
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-opacity"
              >
                <MdDelete className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {photos.length} of {maxPhotos} photos uploaded
      </p>
    </div>
  );
};

export default ImageUpload;