import { Trash2 } from 'lucide-react'
import React from 'react'

const ImageCard = ({ file, handleDelete }) => {
   // Create the imageUrl inside ImageCard
   const imageUrl = `http://localhost:8080/${file.path.replace(/\\/g, '/')}`

   return (
      <div className="relative flex justify-center items-center group">
         <img
            src={imageUrl}
            alt="Uploaded"
            className="w-40 h-40 object-fill rounded-xl border-2 border-black"
         />
         <Trash2
            size={30}
            onClick={() => handleDelete(file._id)}
            className="absolute -top-2 -right-2 bg-destructive rounded-full text-white p-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
         />
      </div>
   )
}

export default ImageCard
