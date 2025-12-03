import TheoDoiMuonSach from "../Models/THEODOIMUONSACH";
import Sach from "../Models/SACH";
import DOCGIA from "../Models/DOCGIA";
import { TrangThai } from "../Enums/TrangThai";

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

class StatisticsService {
    // Get overall revenue statistics
    async getRevenueStatistics(startDate?: Date, endDate?: Date): Promise<RevenueStatistics> {
        const query: any = {};

        if (startDate || endDate) {
            query.NgayMuon = {};
            if (startDate) query.NgayMuon.$gte = startDate;
            if (endDate) query.NgayMuon.$lte = endDate;
        }

        const rentals = await TheoDoiMuonSach.find(query).populate('MaSach');

        let totalRevenue = 0;
        let totalPenalties = 0;
        let totalRentals = rentals.length;
        let totalReturned = 0;
        let totalPending = 0;
        let totalOverdue = 0;
        let totalDuration = 0;
        let rentalsWithDuration = 0;

        for (const rental of rentals) {
            if (rental.MaSach && typeof rental.MaSach !== 'string') {
                totalRevenue += (rental.MaSach as any).DonGia * rental.SoQuyen;
            }

            totalPenalties += rental.PhatQuaHan?.SoTienPhat || 0;

            if (rental.TrangThai === TrangThai.DA_TRA) {
                totalReturned++;
                if (rental.NgayTra && rental.NgayMuon) {
                    const duration = Math.ceil((rental.NgayTra.getTime() - rental.NgayMuon.getTime()) / (1000 * 60 * 60 * 24));
                    totalDuration += duration;
                    rentalsWithDuration++;
                }
            } else if (rental.TrangThai === TrangThai.CHO_DUYET) {
                totalPending++;
            } else if (rental.TrangThai === TrangThai.DA_DUYET) {
                // Check if overdue (more than 30 days)
                const daysSinceBorrow = Math.ceil((Date.now() - rental.NgayMuon.getTime()) / (1000 * 60 * 60 * 24));
                if (daysSinceBorrow > 30) {
                    totalOverdue++;
                }
            }
        }

        return {
            totalRevenue,
            totalPenalties,
            totalRentals,
            totalReturned,
            totalPending,
            totalOverdue,
            averageRentalDuration: rentalsWithDuration > 0 ? totalDuration / rentalsWithDuration : 0
        };
    }

    // Get monthly revenue breakdown
    async getMonthlyRevenue(year?: number): Promise<MonthlyRevenue[]> {
        const targetYear = year || new Date().getFullYear();
        const startDate = new Date(targetYear, 0, 1);
        const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

        const rentals = await TheoDoiMuonSach.find({
            NgayMuon: { $gte: startDate, $lte: endDate }
        }).populate('MaSach');

        const monthlyData: { [key: number]: MonthlyRevenue } = {};

        // Initialize all months
        for (let i = 0; i < 12; i++) {
            monthlyData[i] = {
                month: new Date(targetYear, i).toLocaleString('vi-VN', { month: 'long' }),
                year: targetYear,
                revenue: 0,
                penalties: 0,
                rentalCount: 0
            };
        }

        for (const rental of rentals) {
            const month = rental.NgayMuon.getMonth();

            if (rental.MaSach && typeof rental.MaSach !== 'string') {
                monthlyData[month].revenue += (rental.MaSach as any).DonGia * rental.SoQuyen;
            }

            monthlyData[month].penalties += rental.PhatQuaHan?.SoTienPhat || 0;
            monthlyData[month].rentalCount++;
        }

        return Object.values(monthlyData);
    }

    // Get top rented books
    async getTopRentedBooks(limit: number = 10): Promise<BookRentalStats[]> {
        const rentals = await TheoDoiMuonSach.find().populate('MaSach');

        const bookStats: { [key: string]: BookRentalStats } = {};

        for (const rental of rentals) {
            if (rental.MaSach && typeof rental.MaSach !== 'string') {
                const book = rental.MaSach as any;
                const bookId = book._id.toString();

                if (!bookStats[bookId]) {
                    bookStats[bookId] = {
                        bookId,
                        bookCode: book.MaSach,
                        bookName: book.TenSach,
                        author: book.TacGia,
                        totalRentals: 0,
                        currentlyRented: 0,
                        totalRevenue: 0
                    };
                }

                bookStats[bookId].totalRentals++;
                bookStats[bookId].totalRevenue += book.DonGia * rental.SoQuyen;

                if (rental.TrangThai !== TrangThai.DA_TRA) {
                    bookStats[bookId].currentlyRented += rental.SoQuyen;
                }
            }
        }

        return Object.values(bookStats)
            .sort((a, b) => b.totalRentals - a.totalRentals)
            .slice(0, limit);
    }

    // Get reader statistics
    async getReaderStatistics(limit: number = 10): Promise<ReaderStats[]> {
        const rentals = await TheoDoiMuonSach.find().populate('MaDocGia');

        const readerStats: { [key: string]: ReaderStats } = {};

        for (const rental of rentals) {
            if (rental.MaDocGia && typeof rental.MaDocGia !== 'string') {
                const reader = rental.MaDocGia as any;
                const readerId = reader._id.toString();

                if (!readerStats[readerId]) {
                    readerStats[readerId] = {
                        readerId,
                        readerName: reader.HoTenDocGia,
                        email: reader.Email,
                        totalRentals: 0,
                        totalPenalties: 0,
                        currentRentals: 0
                    };
                }

                readerStats[readerId].totalRentals++;
                readerStats[readerId].totalPenalties += rental.PhatQuaHan?.SoTienPhat || 0;

                if (rental.TrangThai !== TrangThai.DA_TRA) {
                    readerStats[readerId].currentRentals++;
                }
            }
        }

        return Object.values(readerStats)
            .sort((a, b) => b.totalRentals - a.totalRentals)
            .slice(0, limit);
    }

    // Get daily statistics for the last N days
    async getDailyStatistics(days: number = 30): Promise<DailyStats[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        const rentals = await TheoDoiMuonSach.find({
            NgayMuon: { $gte: startDate }
        }).populate('MaSach');

        const dailyData: { [key: string]: DailyStats } = {};

        // Initialize all days
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];

            dailyData[dateKey] = {
                date: dateKey,
                rentals: 0,
                returns: 0,
                revenue: 0
            };
        }

        for (const rental of rentals) {
            const rentalDate = rental.NgayMuon.toISOString().split('T')[0];

            if (dailyData[rentalDate]) {
                dailyData[rentalDate].rentals++;

                if (rental.MaSach && typeof rental.MaSach !== 'string') {
                    dailyData[rentalDate].revenue += (rental.MaSach as any).DonGia * rental.SoQuyen;
                }
            }

            if (rental.NgayTra && rental.TrangThai === TrangThai.DA_TRA) {
                const returnDate = rental.NgayTra.toISOString().split('T')[0];
                if (dailyData[returnDate]) {
                    dailyData[returnDate].returns++;
                }
            }
        }

        return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
    }

    // Get statistics summary
    async getStatisticsSummary() {
        const [
            totalBooks,
            totalReaders,
            revenueStats,
            topBooks,
            topReaders
        ] = await Promise.all([
            Sach.countDocuments(),
            DOCGIA.countDocuments(),
            this.getRevenueStatistics(),
            this.getTopRentedBooks(5),
            this.getReaderStatistics(5)
        ]);

        return {
            totalBooks,
            totalReaders,
            revenueStats,
            topBooks,
            topReaders
        };
    }
}

export default new StatisticsService();

