import axios from "axios";

const API_URL = "http://localhost:8080";

export const addFileServices = async (formData) => {
   try {
      const response = await axios.post('http://localhost:8080/upload', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
      return response;
   } catch (error) {
      console.error('Error uploading file:', error);
   }
}

export const getFileServices = async () => {
   try {
      const response = await axios.get('http://localhost:8080/files');
      return response.data;
   } catch (error) {
      console.error('Error fetching files:', error);
   }
}

export const deleteFileServices = async (fileId) => {
   try {
      const response = await axios.delete(`http://localhost:8080/files/${fileId}`);
      return response;
   } catch (error) {
      console.error('Error deleting file:', error);
   }
}