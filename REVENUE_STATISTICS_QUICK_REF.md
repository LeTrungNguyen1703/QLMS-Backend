# 📊 Revenue Statistics - Quick Reference

## 🚀 Quick Start

### Access Statistics Dashboard:
1. Login as **Admin**
2. Go to **Admin Dashboard**
3. Click **"Thống kê doanh thu"** tab
4. View comprehensive statistics and charts

---

## 📁 File Locations

| Type | File | Purpose |
|------|------|---------|
| Backend Service | `Backend/Services/StatisticsService.ts` | Statistical calculations |
| Backend Controller | `Backend/Controllers/StatisticsController.ts` | Request handlers |
| Backend Router | `Backend/Routers/StatisticsRouter.ts` | API routes |
| Frontend Service | `frontend/src/services/statisticsService.ts` | API client |
| Frontend Component | `frontend/src/components/RevenueStatistics.vue` | UI Dashboard |
| Documentation | `REVENUE_STATISTICS_GUIDE.md` | Complete guide |

---

## 🌐 API Endpoints

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/statistics/summary` | GET | Complete overview | Admin |
| `/api/statistics/revenue` | GET | Revenue stats | Admin |
| `/api/statistics/monthly` | GET | Monthly data | Admin |
| `/api/statistics/top-books` | GET | Top books | Admin |
| `/api/statistics/readers` | GET | Reader stats | Admin |
| `/api/statistics/daily` | GET | Daily trends | Admin |

### Query Parameters:
- `year` - Year for monthly data (e.g., 2025)
- `limit` - Number of items (default: 10)
- `days` - Number of days (default: 30)
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

---

## 📊 Dashboard Components

### Summary Cards (7):
1. 💰 **Total Revenue** - All rental income
2. ⚠️ **Total Penalties** - Late fees
3. 📚 **Total Rentals** - All-time count
4. ✅ **Total Returned** - Completed
5. ⏳ **Pending** - Awaiting approval
6. 🔴 **Overdue** - Late (>30 days)
7. 📅 **Avg Duration** - Days per rental

### Charts (2):
1. **Bar Chart** - Monthly revenue + penalties
2. **Doughnut Chart** - Revenue breakdown

### Tables (2):
1. **Top 5 Books** - Most rented
2. **Top 5 Readers** - Most active

---

## 💻 Code Examples

### Get Statistics Summary:
```typescript
import { statisticsService } from '@/services/statisticsService';

const summary = await statisticsService.getStatisticsSummary();
console.log(summary.revenueStats.totalRevenue);
```

### Get Monthly Revenue:
```typescript
const monthly = await statisticsService.getMonthlyRevenue(2025);
monthly.forEach(m => {
  console.log(`${m.month}: ${m.revenue}`);
});
```

### Get Top Books:
```typescript
const topBooks = await statisticsService.getTopRentedBooks(5);
topBooks.forEach((book, i) => {
  console.log(`#${i+1}: ${book.bookName} - ${book.totalRentals} rentals`);
});
```

---

## 🎨 UI Features

### Color Coding:
- 🔵 **Blue** - Primary metrics (revenue, rentals)
- 🟡 **Yellow** - Warnings (penalties)
- 🟢 **Green** - Success (returned)
- 🟦 **Cyan** - Info (readers, duration)
- 🔴 **Red** - Danger (overdue)
- ⚫ **Gray** - Pending

### Rank Badges:
- 🥇 **1st** - Gold (Warning color)
- 🥈 **2nd** - Silver (Secondary color)
- 🥉 **3rd** - Bronze (Info color)
- **4-5** - Light gray

---

## 🔧 Configuration

### Default Values:
```typescript
Top books limit: 10
Top readers limit: 10
Daily statistics: 30 days
Overdue threshold: 30 days
Default year: Current year
Chart height: 300px
```

### Chart.js Config:
```typescript
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
```

---

## 📱 Responsive Breakpoints

- **Desktop** (≥992px): 4 columns
- **Tablet** (768-991px): 2-3 columns
- **Mobile** (<768px): 1 column

---

## 🔒 Security

- ✅ JWT token required
- ✅ Admin role only
- ✅ Auto token injection
- ✅ Secure endpoints

---

## 🧮 Calculations

### Revenue:
```
Total Revenue = Σ(Book.DonGia × Rental.SoQuyen)
```

### Penalties:
```
Total Penalties = Σ(Rental.PhatQuaHan.SoTienPhat)
```

### Average Duration:
```
Avg = Σ(NgayTra - NgayMuon) / Count(Returned)
```

### Overdue:
```
if (Days Since Borrow > 30 && Status == DA_DUYET) {
  overdue = true;
}
```

---

## ⚡ Quick Commands

### Install Chart.js:
```bash
cd frontend
npm install
```

### Start Backend:
```bash
cd Backend
npm run dev
```

### Start Frontend:
```bash
cd frontend
npm run dev
```

### Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- API Docs: http://localhost:8080/api-docs

---

## 🐛 Troubleshooting

### Chart not rendering:
- Ensure Chart.js is installed: `npm install chart.js`
- Check canvas ref is not null
- Verify data is loaded before rendering

### No data showing:
- Check if backend is running
- Verify JWT token is valid
- Ensure user is Admin
- Check browser console for errors

### Currency format wrong:
- Uses Vietnamese Dong (VND) by default
- Format: `1.500.000 ₫`

### Year selector not working:
- Ensure `selectedYear` is reactive
- Check `loadMonthlyRevenue()` is called on change

---

## 📊 Data Sources

| Metric | Database Collection | Fields Used |
|--------|-------------------|-------------|
| Revenue | THEODOIMUONSACH + SACH | DonGia, SoQuyen |
| Penalties | THEODOIMUONSACH | PhatQuaHan.SoTienPhat |
| Status | THEODOIMUONSACH | TrangThai |
| Book Info | SACH | TenSach, TacGia, MaSach |
| Reader Info | DOCGIA | HoTenDocGia, Email |
| Dates | THEODOIMUONSACH | NgayMuon, NgayTra |

---

## ✅ Feature Checklist

Statistics Dashboard:
- [x] Summary cards with 7 metrics
- [x] Monthly revenue bar chart
- [x] Revenue breakdown pie chart
- [x] Top 5 books table
- [x] Top 5 readers table
- [x] Year selector
- [x] Loading states
- [x] Error handling
- [x] Responsive design
- [x] Currency formatting
- [x] Interactive charts

Backend:
- [x] 6 API endpoints
- [x] Admin authentication
- [x] Statistical calculations
- [x] Date range filtering
- [x] Sorting & ranking
- [x] Error handling

---

## 🎯 Key Metrics Explained

| Metric | Definition | Importance |
|--------|------------|------------|
| Total Revenue | Sum of all rental income | Overall business performance |
| Total Penalties | Late fees collected | Policy enforcement |
| Total Rentals | All-time rental count | Usage metrics |
| Returned | Completed transactions | Success rate |
| Pending | Awaiting approval | Workload indicator |
| Overdue | Late returns (>30d) | Risk indicator |
| Avg Duration | Average rental time | Service efficiency |

---

## 📖 Related Documentation

- **Complete Guide**: `REVENUE_STATISTICS_GUIDE.md`
- **API Docs**: Available at `/api-docs` (Swagger)
- **Component Docs**: See inline comments in files

---

## 🎊 Success Indicators

✅ Dashboard loads < 2 seconds
✅ Charts render smoothly
✅ All data displays correctly
✅ Responsive on all devices
✅ No console errors
✅ Currency formatted properly
✅ Rankings are correct

---

## 📞 Support

**Issues?**
1. Check browser console
2. Verify backend is running
3. Ensure Admin login
4. Check network tab
5. Review error messages

---

**Status**: ✅ Production Ready
**Last Updated**: December 3, 2025

---

## 🚀 Get Started Now!

1. Start backend
2. Start frontend
3. Login as Admin
4. Click "Thống kê doanh thu"
5. View statistics! 📊

