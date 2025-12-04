import type {NhaXuatBan} from '../types/book';
import type {APIResponse} from '../types/auth';
import {apiClient} from "./base-url.ts";

export const nhaXuatBanService = {
    // Lấy tất cả nhà xuất bản
    async getAllNhaXuatBan(): Promise<NhaXuatBan[]> {
        try {
            const response = await apiClient.get<APIResponse<NhaXuatBan[]>>('/nhaxuatban/get-all-nxb');
            return response.data.data || [];
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể tải danh sách nhà xuất bản');
        }
    },

    // Lấy nhà xuất bản theo ID
    async getNhaXuatBanById(id: string): Promise<NhaXuatBan> {
        try {
            const response = await apiClient.get<APIResponse<NhaXuatBan>>(`/nhaxuatban/get-nxb/${id}`);
            return response.data.data!;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể tải thông tin nhà xuất bản');
        }
    },

    // Thêm nhà xuất bản mới
    async createNhaXuatBan(data: Omit<NhaXuatBan, '_id' | 'MaNXB'>): Promise<NhaXuatBan> {
        try {
            const response = await apiClient.post<APIResponse<NhaXuatBan>>('/nhaxuatban/add-nxb', data);
            return response.data.data!;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể thêm nhà xuất bản');
        }
    },

    // Cập nhật nhà xuất bản
    async updateNhaXuatBan(id: string, data: Partial<NhaXuatBan>): Promise<void> {
        try {
            await apiClient.put(`/nhaxuatban/update-nxb/${id}`, data);
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể cập nhật nhà xuất bản');
        }
    },

    // Xóa nhà xuất bản
    async deleteNhaXuatBan(id: string): Promise<void> {
        try {
            await apiClient.delete(`/nhaxuatban/delete-nxb/${id}`);
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể xóa nhà xuất bản');
        }
    }
};

