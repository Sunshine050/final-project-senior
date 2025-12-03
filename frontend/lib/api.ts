import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add token
    this.client.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post<{
      accessToken: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        organizationId?: string;
      };
    }>("/auth/login", { email, password });
    return response.data;
  }

  async getProfile() {
    const response = await this.client.get<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      organizationId?: string;
    }>("/auth/profile");
    return response.data;
  }

  // SOS endpoints
  async getAllEmergencies(query?: {
    status?: string;
    severity?: string;
    hospitalId?: string;
    rescueTeamId?: string;
    page?: number;
    limit?: number;
  }) {
    // Filter out empty strings to avoid validation errors
    const cleanParams: Record<string, any> = {};
    if (query) {
      Object.keys(query).forEach((key) => {
        const value = query[key as keyof typeof query];
        if (value !== undefined && value !== null && value !== '') {
          cleanParams[key] = value;
        }
      });
    }
    const response = await this.client.get("/sos/all", { params: cleanParams });
    return response.data;
  }

  async getEmergency(id: string) {
    const response = await this.client.get(`/sos/${id}`);
    return response.data;
  }

  async assignEmergency(id: string, data: {
    hospitalId?: string;
    rescueTeamId?: string;
    notes?: string;
  }) {
    const response = await this.client.post(`/sos/${id}/assign`, data);
    return response.data;
  }

  async updateEmergencyStatus(id: string, data: {
    status: string;
    notes?: string;
    estimatedArrival?: string;
  }) {
    const response = await this.client.put(`/sos/${id}/status`, data);
    return response.data;
  }

  async getActiveEmergencies() {
    const response = await this.client.get("/sos/dashboard/active-emergencies");
    return response.data;
  }

  async getAssignedCases() {
    const response = await this.client.get("/sos/rescue/assigned-cases");
    return response.data;
  }

  // Hospital endpoints
  async getHospitals() {
    const response = await this.client.get("/hospitals");
    return response.data;
  }

  async getHospital(id: string) {
    const response = await this.client.get(`/hospitals/${id}`);
    return response.data;
  }

  async updateHospitalBeds(id: string, availableBeds: number) {
    const response = await this.client.patch(`/hospitals/${id}/beds`, {
      availableBeds,
    });
    return response.data;
  }

  // Rescue Team endpoints
  async getRescueTeams() {
    const response = await this.client.get("/rescue-teams");
    return response.data;
  }

  async getAvailableRescueTeams() {
    const response = await this.client.get("/rescue-teams/available");
    return response.data;
  }

  // Organization endpoints
  async getOrganizations() {
    const response = await this.client.get("/organizations");
    return response.data;
  }

  async createOrganization(data: any) {
    const response = await this.client.post("/organizations", data);
    return response.data;
  }

  async updateOrganization(id: string, data: any) {
    const response = await this.client.put(`/organizations/${id}`, data);
    return response.data;
  }

  async deleteOrganization(id: string) {
    await this.client.delete(`/organizations/${id}`);
  }

  // Notification endpoints
  async getNotifications(limit = 50) {
    const response = await this.client.get("/notifications", {
      params: { limit },
    });
    return response.data;
  }

  async markNotificationRead(id: string) {
    const response = await this.client.patch(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllNotificationsRead() {
    const response = await this.client.post("/notifications/mark-all-read");
    return response.data;
  }
}

export const api = new ApiClient();

