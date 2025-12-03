import { Request, Response } from "express";
import StatisticsService from "../Services/StatisticsService";
import { APIResponse } from "../DTO/Response/APIResponse";
import { catchAsync } from "../Middleware/ErrorHandler";

// Get overall revenue statistics
export const getRevenueStatistics = catchAsync(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;

    const stats = await StatisticsService.getRevenueStatistics(start, end);

    return res.status(200).json({
        message: "Lấy thống kê doanh thu thành công",
        data: stats
    });
});

// Get monthly revenue
export const getMonthlyRevenue = catchAsync(async (req: Request, res: Response) => {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const monthlyData = await StatisticsService.getMonthlyRevenue(year);

    return res.status(200).json({
        message: "Lấy doanh thu theo tháng thành công",
        data: monthlyData
    });
});

// Get top rented books
export const getTopRentedBooks = catchAsync(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const topBooks = await StatisticsService.getTopRentedBooks(limit);

    return res.status(200).json({
        message: "Lấy danh sách sách được mượn nhiều nhất thành công",
        data: topBooks
    });
});

// Get reader statistics
export const getReaderStatistics = catchAsync(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const readerStats = await StatisticsService.getReaderStatistics(limit);

    return res.status(200).json({
        message: "Lấy thống kê độc giả thành công",
        data: readerStats
    });
});

// Get daily statistics
export const getDailyStatistics = catchAsync(async (req: Request, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;

    const dailyStats = await StatisticsService.getDailyStatistics(days);

    return res.status(200).json({
        message: "Lấy thống kê theo ngày thành công",
        data: dailyStats
    });
});

// Get statistics summary
export const getStatisticsSummary = catchAsync(async (req: Request, res: Response) => {
    const summary = await StatisticsService.getStatisticsSummary();

    return res.status(200).json({
        message: "Lấy tổng quan thống kê thành công",
        data: summary
    });
});

