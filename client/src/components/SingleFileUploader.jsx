import { useState } from "react";
import {
   FileUploader,
   FileUploaderContent,
   FileUploaderItem,
   FileInput,
} from "@/components/ui/fileUploader";
import { Paperclip } from "lucide-react";
import { ImageUp } from "lucide-react";

const FileSvgDraw = () => {
   return (
      <>
         <ImageUp size={48} className="mb-4 text-gray-500 dark:text-gray-400" />
         <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Select</span>
            &nbsp; or drag and drop to upload
         </p>
      </>
   );
};

const SingleFileUploader = ({ file, setFile }) => {

   const dropZoneConfig = {
      maxFiles: 1,
      maxSize: 1024 * 1024 * 4,
      accept: {
         'image/png': ['.png'],
         'image/jpeg': ['.jpg', '.jpeg'],
      }
   };

   const renderFilePreview = (file) => {
      const objectURL = URL.createObjectURL(file);
      return <img src={objectURL} alt={file.name} className="w-10 h-10 object-cover mt-2" />;
   };

   return (
      <FileUploader
         value={file}
         onValueChange={setFile}
         dropzoneOptions={dropZoneConfig}
         className="relative bg-background rounded-lg shadow-xl p-2"
      >
         <FileInput className="outline-dashed outline-1 outline-gray-500">
            <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
               <FileSvgDraw />
            </div>
         </FileInput>
         <FileUploaderContent>
            {file && file.length > 0 && file.map((file, i) => (
               <FileUploaderItem key={i} index={i}>
                  {renderFilePreview(file)}
                  <div className="flex items-center gap-2">
                     <Paperclip className="h-4 w-4 stroke-current" />
                     <span>{file.name}</span>
                  </div>
               </FileUploaderItem>
            ))}
         </FileUploaderContent>
      </FileUploader>
   );
};

export default SingleFileUploader;
