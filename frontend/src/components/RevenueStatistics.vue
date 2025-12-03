<template>
  <div class="statistics-dashboard">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2 text-muted">Đang tải thống kê...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
    </div>

    <!-- Statistics Content -->
    <div v-else>
      <!-- Summary Cards -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="stat-card card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-primary bg-opacity-10 text-primary">
                  <i class="bi bi-cash-stack"></i>
                </div>
                <div class="ms-3 flex-grow-1">
                  <p class="text-muted mb-1 small">Tổng doanh thu</p>
                  <h4 class="mb-0 fw-bold">{{ formatCurrency(revenueStats.totalRevenue) }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="stat-card card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-warning bg-opacity-10 text-warning">
                  <i class="bi bi-exclamation-triangle"></i>
                </div>
                <div class="ms-3 flex-grow-1">
                  <p class="text-muted mb-1 small">Tiền phạt</p>
                  <h4 class="mb-0 fw-bold">{{ formatCurrency(revenueStats.totalPenalties) }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="stat-card card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-success bg-opacity-10 text-success">
                  <i class="bi bi-book"></i>
                </div>
                <div class="ms-3 flex-grow-1">
                  <p class="text-muted mb-1 small">Tổng lượt mượn</p>
                  <h4 class="mb-0 fw-bold">{{ revenueStats.totalRentals }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="stat-card card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-info bg-opacity-10 text-info">
                  <i class="bi bi-check-circle"></i>
                </div>
                <div class="ms-3 flex-grow-1">
                  <p class="text-muted mb-1 small">Đã trả</p>
                  <h4 class="mb-0 fw-bold">{{ revenueStats.totalReturned }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Stats Row -->
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <div class="stat-card card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-secondary bg-opacity-10 text-secondary">
                  <i class="bi bi-clock-history"></i>
                </div>
                <div class="ms-3 flex-grow-1">
                  <p class="text-muted mb-1 small">Chờ duyệt</p>
                  <h4 class="mb-0 fw-bold">{{ revenueStats.totalPending }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="stat-card card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-danger bg-opacity-10 text-danger">
                  <i class="bi bi-hourglass-split"></i>
                </div>
                <div class="ms-3 flex-grow-1">
                  <p class="text-muted mb-1 small">Quá hạn</p>
                  <h4 class="mb-0 fw-bold">{{ revenueStats.totalOverdue }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="stat-card card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-primary bg-opacity-10 text-primary">
                  <i class="bi bi-calendar-range"></i>
                </div>
                <div class="ms-3 flex-grow-1">
                  <p class="text-muted mb-1 small">Thời gian mượn TB</p>
                  <h4 class="mb-0 fw-bold">{{ revenueStats.averageRentalDuration.toFixed(1) }} ngày</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="row g-4 mb-4">
        <!-- Monthly Revenue Chart -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 pt-3">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="bi bi-bar-chart-fill me-2 text-primary"></i>
                  Doanh thu theo tháng
                </h5>
                <select v-model="selectedYear" @change="loadMonthlyRevenue" class="form-select form-select-sm" style="width: auto;">
                  <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>
            <div class="card-body">
              <div class="chart-container">
                <canvas ref="monthlyChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Breakdown Pie Chart -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 pt-3">
              <h5 class="mb-0">
                <i class="bi bi-pie-chart-fill me-2 text-success"></i>
                Phân bổ doanh thu
              </h5>
            </div>
            <div class="card-body">
              <div class="chart-container">
                <canvas ref="pieChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Books and Readers -->
      <div class="row g-4">
        <!-- Top Rented Books -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 pt-3">
              <h5 class="mb-0">
                <i class="bi bi-trophy-fill me-2 text-warning"></i>
                Top 5 sách được mượn nhiều nhất
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="px-3" style="width: 50px;">#</th>
                      <th>Tên sách</th>
                      <th class="text-center">Lượt mượn</th>
                      <th class="text-end pe-3">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(book, index) in topBooks" :key="book.bookId">
                      <td class="px-3">
                        <span class="badge" :class="getRankBadgeClass(index)">{{ index + 1 }}</span>
                      </td>
                      <td>
                        <div class="fw-bold">{{ book.bookName }}</div>
                        <small class="text-muted">{{ book.author }}</small>
                      </td>
                      <td class="text-center">
                        <span class="badge bg-primary">{{ book.totalRentals }}</span>
                      </td>
                      <td class="text-end pe-3">
                        <strong>{{ formatCurrency(book.totalRevenue) }}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Readers -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 pt-3">
              <h5 class="mb-0">
                <i class="bi bi-person-fill me-2 text-info"></i>
                Top 5 độc giả mượn nhiều nhất
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="px-3" style="width: 50px;">#</th>
                      <th>Tên độc giả</th>
                      <th class="text-center">Lượt mượn</th>
                      <th class="text-end pe-3">Tiền phạt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(reader, index) in topReaders" :key="reader.readerId">
                      <td class="px-3">
                        <span class="badge" :class="getRankBadgeClass(index)">{{ index + 1 }}</span>
                      </td>
                      <td>
                        <div class="fw-bold">{{ reader.readerName }}</div>
                        <small class="text-muted">{{ reader.email }}</small>
                      </td>
                      <td class="text-center">
                        <span class="badge bg-info">{{ reader.totalRentals }}</span>
                      </td>
                      <td class="text-end pe-3">
                        <strong :class="reader.totalPenalties > 0 ? 'text-danger' : ''">
                          {{ formatCurrency(reader.totalPenalties) }}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { statisticsService, type RevenueStatistics, type MonthlyRevenue, type BookRentalStats, type ReaderStats } from '../services/statisticsService';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// State
const loading = ref(false);
const error = ref('');
const revenueStats = ref<RevenueStatistics>({
  totalRevenue: 0,
  totalPenalties: 0,
  totalRentals: 0,
  totalReturned: 0,
  totalPending: 0,
  totalOverdue: 0,
  averageRentalDuration: 0
});
const monthlyRevenue = ref<MonthlyRevenue[]>([]);
const topBooks = ref<BookRentalStats[]>([]);
const topReaders = ref<ReaderStats[]>([]);

// Chart refs
const monthlyChart = ref<HTMLCanvasElement | null>(null);
const pieChart = ref<HTMLCanvasElement | null>(null);
let monthlyChartInstance: Chart | null = null;
let pieChartInstance: Chart | null = null;

// Year selection
const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const availableYears = ref([currentYear - 2, currentYear - 1, currentYear, currentYear + 1]);

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Get rank badge class
const getRankBadgeClass = (index: number): string => {
  if (index === 0) return 'bg-warning text-dark';
  if (index === 1) return 'bg-secondary';
  if (index === 2) return 'bg-info';
  return 'bg-light text-dark';
};

// Load all statistics
const loadStatistics = async () => {
  loading.value = true;
  error.value = '';

  try {
    const summary = await statisticsService.getStatisticsSummary();
    revenueStats.value = summary.revenueStats;
    topBooks.value = summary.topBooks;
    topReaders.value = summary.topReaders;

    await loadMonthlyRevenue();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Không thể tải thống kê';
    console.error('Error loading statistics:', err);
  } finally {
    loading.value = false;
  }
};

// Load monthly revenue
const loadMonthlyRevenue = async () => {
  try {
    monthlyRevenue.value = await statisticsService.getMonthlyRevenue(selectedYear.value);
    await nextTick();
    renderMonthlyChart();
    renderPieChart();
  } catch (err: any) {
    console.error('Error loading monthly revenue:', err);
  }
};

// Render monthly revenue chart
const renderMonthlyChart = () => {
  if (!monthlyChart.value) return;

  if (monthlyChartInstance) {
    monthlyChartInstance.destroy();
  }

  const ctx = monthlyChart.value.getContext('2d');
  if (!ctx) return;

  monthlyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: monthlyRevenue.value.map(m => m.month),
      datasets: [
        {
          label: 'Doanh thu',
          data: monthlyRevenue.value.map(m => m.revenue),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Tiền phạt',
          data: monthlyRevenue.value.map(m => m.penalties),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += formatCurrency(context.parsed.y);
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return new Intl.NumberFormat('vi-VN', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(value as number);
            }
          }
        }
      }
    }
  });
};

// Render pie chart
const renderPieChart = () => {
  if (!pieChart.value) return;

  if (pieChartInstance) {
    pieChartInstance.destroy();
  }

  const ctx = pieChart.value.getContext('2d');
  if (!ctx) return;

  const totalRevenue = revenueStats.value.totalRevenue;
  const totalPenalties = revenueStats.value.totalPenalties;

  pieChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Doanh thu mượn sách', 'Tiền phạt'],
      datasets: [{
        data: [totalRevenue, totalPenalties],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              label += formatCurrency(context.parsed);

              const total = totalRevenue + totalPenalties;
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              label += ` (${percentage}%)`;

              return label;
            }
          }
        }
      }
    }
  });
};

// Load on mount
onMounted(() => {
  loadStatistics();
});
</script>

<style scoped>
.statistics-dashboard {
  padding: 1rem;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.chart-container {
  position: relative;
  height: 300px;
}

.card {
  border-radius: 12px;
}

.card-header {
  padding: 1rem 1.25rem;
}

.table {
  font-size: 0.9rem;
}

.table thead th {
  font-weight: 600;
  color: #344767;
  border-bottom: 2px solid #dee2e6;
  padding: 0.75rem 0.5rem;
}

.table tbody td {
  padding: 0.75rem 0.5rem;
  vertical-align: middle;
}

.badge {
  padding: 0.35rem 0.65rem;
  font-weight: 600;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08) !important;
}
</style>

