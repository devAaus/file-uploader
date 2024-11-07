import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { addFileServices, deleteFileServices, getFileServices } from './services/upload.services'
import { Button } from './components/ui/button'
import toast from 'react-hot-toast'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ImageUp } from 'lucide-react'
import ImageCard from './components/ImageCard'  // Import the ImageCard component

const App = () => {
  const [file, setFile] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      const data = await getFileServices()
      setFiles(data.files || [])
    } catch (error) {
      console.error('Error fetching files:', error)
      toast.error('Failed to fetch files')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0]
      uploadedFile.preview = URL.createObjectURL(uploadedFile)
      setFile(uploadedFile)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { 'image/*': [] },
    maxSize: 1024 * 1024 * 4
  })

  const uploadFile = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setLoading(true)
    try {
      const res = await addFileServices(formData)
      if (res.status === 201) {
        toast.success(res?.data?.message || 'File uploaded successfully')
        setFile(null)
        fetchData()
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload file')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
    }
  }, [file])

  const handleDelete = async (id) => {
    try {
      const res = await deleteFileServices(id)
      if (res.status === 200) {
        toast.success(res?.data?.message || 'File deleted successfully')
        fetchData()
      }
    } catch (error) {
      toast.error('Failed to delete file')
    }
  }

  return (
    <div className='w-full gap-10 flex flex-col items-center justify-center p-10'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl text-center'>Upload Image</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center gap-3 w-[600px]'>
          <div className='outline-dashed outline-1 outline-gray-500 p-3 rounded-xl min-h-40 w-full flex items-center justify-center' {...getRootProps()}>
            <input {...getInputProps()} />
            {!file
              ? (
                <div className='flex flex-col items-center'>
                  <ImageUp size={48} className="mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Select</span>
                    &nbsp; or drag and drop to upload
                  </p>
                </div>
              )
              : (
                <img
                  src={file.preview}
                  alt="Preview"
                  className="w-40 h-40 object-fill rounded-xl border-2 border-black"
                />
              )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className='disabled:cursor-not-allowed'
            onClick={uploadFile}
            disabled={!file || loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </CardFooter>
      </Card>

      <div className='grid grid-cols-3 gap-3'>
        {files.length > 0 ? (
          files.map((file) => (
            <ImageCard key={file._id} file={file} handleDelete={handleDelete} /> // Pass the entire file object to ImageCard
          ))
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  )
}

export default App
