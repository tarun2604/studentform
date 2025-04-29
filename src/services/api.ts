import axios from 'axios';
import { FormResponse, UserData } from '../types/form';

const API_BASE_URL = 'https://dynamic-form-generator-9rl7.onrender.com';

export const createUser = async (userData: UserData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-user`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      throw new Error('This roll number is already registered. Please try a different roll number.');
    }
    throw new Error('Failed to create user. Please try again.');
  }
};

export const getForm = async (rollNumber: string) => {
  try {
    const response = await axios.get<FormResponse>(`${API_BASE_URL}/get-form?rollNumber=${rollNumber}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Form not found for this roll number.');
    }
    throw new Error('Failed to fetch form. Please try again.');
  }
}; 