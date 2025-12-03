import { Router } from "express";
import {
    getRevenueStatistics,
    getMonthlyRevenue,
    getTopRentedBooks,
    getReaderStatistics,
    getDailyStatistics,
    getStatisticsSummary
} from "../Controllers/StatisticsController";
import TokenMiddleware from "../Middleware/Token";
import { UserRole } from "../Enums/UserRole";

const routerStatistics = Router();

// All routes require Admin authentication
routerStatistics.get("/revenue",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    getRevenueStatistics
);

routerStatistics.get("/monthly",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    getMonthlyRevenue
);

routerStatistics.get("/top-books",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    getTopRentedBooks
);

routerStatistics.get("/readers",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    getReaderStatistics
);

routerStatistics.get("/daily",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    getDailyStatistics
);

routerStatistics.get("/summary",
    TokenMiddleware.authenticate,
    TokenMiddleware.authorize(UserRole.ADMIN),
    getStatisticsSummary
);

export default routerStatistics;

