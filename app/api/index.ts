  import axios from "axios";
  import { useSession } from "../ctx";

  export const useApi = () => {
    const { session } = useSession(); // Correctly using session inside the functional component

    const api = axios.create({
      baseURL: "http://127.0.0.1:8000",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    api.interceptors.request.use(
      async (config) => {
        if (session) {
          config.headers.Authorization = `Bearer ${session}`; // Assuming session holds accessToken
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return {
      apiCall: {
        login: async (data: { email: string; password: string }) => {
          try {
            const response = await api.post("/api/v1/login", data);
            return response.data;
          } catch (error) {
            return error;
          }
        },
        authorization: async () => {
          try {
            const response = await api.get("/api/v1/user/self");
            return response.data;
          } catch (error) {
            return error;
          }
        },
        createEmployee: async (data: any) => {
          try {
            const response = await api.post("/api/v1/employee", data);
            return response.data;
          } catch (error) {
            return error;
          }
        },
        updateEmployee: async (id: any, data: any) => {
          try {
            const response = await api.put(`/api/v1/employee/${id}`, data);
            return response.data;
          } catch (error) {
            return error;
          }
        },
        deleteEmployee: async (id: any) => {
          try {
            const response = await api.delete(`/api/v1/employee/${id}`);
            return response.data;
          } catch (error) {
            return error;
          }
        },
        getEmployee: async (id: any) => {
          try {
            const response = await api.get(`/api/v1/employee/${id}`);
            return response.data;
          } catch (error) {
            return error;
          }
        },
        getEmployees: async (pageNum: any) => {
          try {
            const response = await api.get(`/api/v1/employee?page=${pageNum}&limit=10`);
            return response.data;
          } catch (error) {
            return error;
          }
        },
      },
    };
  };
