import type {Sach, TheoDoiMuonSach} from '../types/book';
import type {APIResponse} from '../types/auth';
import {apiClient} from "./base-url.ts";

export const bookService = {
    // Tìm kiếm sách (cho Đọc giả)
    async searchBooks(): Promise<Sach[]> {
        try {
            const response = await apiClient.get<APIResponse<Sach[]>>('/sach/search-sach');
            return response.data.data || [];
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể tải danh sách sách');
        }
    },

    // Lấy chi tiết sách
    async getBookById(id: string): Promise<Sach> {
        try {
            const response = await apiClient.get<APIResponse<Sach>>(`/sach/get-sach/${id}`);
            return response.data.data!;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể tải thông tin sách');
        }
    },

    // Mượn sách
    async borrowBook(data: MuonSachRequest): Promise<TheoDoiMuonSach> {
        try {
            const response = await apiClient.post<APIResponse<TheoDoiMuonSach>>(
                '/muonsach/add-muonsach',
                data
            );
            return response.data.data!;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể mượn sách. Vui lòng thử lại.');
        }
    },

    // Lấy danh sách sách đã mượn của đọc giả
    async getMyBorrowedBooks(docGiaId: string): Promise<TheoDoiMuonSach[]> {
        try {
            const response = await apiClient.get<APIResponse<TheoDoiMuonSach[]>>(
                `/muonsach/get-by-docgia/${docGiaId}`
            );
            console.log(response.data);
            return response.data.data || [];
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            // Nếu chưa có sách nào, trả về mảng rỗng
            return [];
        }
    },

    // Lấy lịch sử mượn sách (tất cả trạng thái)
    async getBorrowHistory(docGiaId: string): Promise<TheoDoiMuonSach[]> {
        try {
            const response = await apiClient.get<APIResponse<TheoDoiMuonSach[]>>(
                `/muonsach/get-by-docgia/${docGiaId}`
            );
            return response.data.data || [];
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            return [];
        }
    },

    // Tạo sách mới
    async createBook(formData: FormData): Promise<Sach> {
        try {
            const response = await apiClient.post<APIResponse<Sach>>(
                '/sach/add-sach',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data!;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể thêm sách. Vui lòng thử lại.');
        }
    },

    // Lấy tất cả sách (cho quản lý)
    async getAllBooks(): Promise<Sach[]> {
        try {
            const response = await apiClient.get<APIResponse<Sach[]>>('/sach/get-all-sach');
            return response.data.data || [];
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể tải danh sách sách');
        }
    },

    // Cập nhật thông tin sách
    async updateBook(id: string, formData: FormData): Promise<void> {
        try {
            await apiClient.put(
                `/sach/update-sach/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể cập nhật sách. Vui lòng thử lại.');
        }
    },

    // Xóa sách
    async deleteBook(id: string): Promise<void> {
        try {
            await apiClient.delete(`/sach/delete-sach/${id}`);
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể xóa sách. Vui lòng thử lại.');
        }
    },

    // Hủy yêu cầu mượn sách
    async cancelBorrowRequest(borrowId: string): Promise<void> {
        try {
            await apiClient.delete(`/muonsach/delete-muonsach/${borrowId}`);
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Không thể hủy yêu cầu mượn sách. Vui lòng thử lại.');
        }
    }
};

