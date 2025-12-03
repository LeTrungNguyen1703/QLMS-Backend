import axios from 'axios';

const API_BASE_URL = '/api';

export interface RevenueStatistics {
  totalRevenue: number;
  totalPenalties: number;
  totalRentals: number;
  totalReturned: number;
  totalPending: number;
  totalOverdue: number;
  averageRentalDuration: number;
}

export interface MonthlyRevenue {
  month: string;
  year: number;
  revenue: number;
  penalties: number;
  rentalCount: number;
}

export interface BookRentalStats {
  bookId: string;
  bookCode: string;
  bookName: string;
  author: string;
  totalRentals: number;
  currentlyRented: number;
  totalRevenue: number;
}

export interface ReaderStats {
  readerId: string;
  readerName: string;
  email: string;
  totalRentals: number;
  totalPenalties: number;
  currentRentals: number;
}

export interface DailyStats {
  date: string;
  rentals: number;
  returns: number;
  revenue: number;
}

export interface StatisticsSummary {
  totalBooks: number;
  totalReaders: number;
  revenueStats: RevenueStatistics;
  topBooks: BookRentalStats[];
  topReaders: ReaderStats[];
}

class StatisticsService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/statistics`,
  });

  constructor() {
    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Get overall revenue statistics
  async getRevenueStatistics(startDate?: string, endDate?: string): Promise<RevenueStatistics> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await this.api.get('/revenue', { params });
    return response.data.data;
  }

  // Get monthly revenue breakdown
  async getMonthlyRevenue(year?: number): Promise<MonthlyRevenue[]> {
    const params = year ? { year } : {};
    const response = await this.api.get('/monthly', { params });
    return response.data.data;
  }

  // Get top rented books
  async getTopRentedBooks(limit: number = 10): Promise<BookRentalStats[]> {
    const response = await this.api.get('/top-books', { params: { limit } });
    return response.data.data;
  }

  // Get reader statistics
  async getReaderStatistics(limit: number = 10): Promise<ReaderStats[]> {
    const response = await this.api.get('/readers', { params: { limit } });
    return response.data.data;
  }

  // Get daily statistics
  async getDailyStatistics(days: number = 30): Promise<DailyStats[]> {
    const response = await this.api.get('/daily', { params: { days } });
    return response.data.data;
  }

  // Get statistics summary
  async getStatisticsSummary(): Promise<StatisticsSummary> {
    const response = await this.api.get('/summary');
    return response.data.data;
  }
}

export const statisticsService = new StatisticsService();

