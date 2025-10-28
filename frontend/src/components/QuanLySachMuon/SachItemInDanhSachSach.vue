<script setup lang="ts">

import type {SachMuonItem} from "../../services/tinhTrangSachMuonService.ts";

defineProps<{
  item: SachMuonItem
}>();

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const getFullName = (sach: SachMuonItem): string => {
  // Placeholder function, replace with actual logic to get full name
  return `${sach.MaDocGia.HoLot} ${sach.MaDocGia.Ten}`;
};
</script>

<template>
  <td><strong>{{ item.MaSach.TenSach }}</strong></td>
  <td>{{ item.MaDocGia.MaDocGia }}</td>
  <td>{{ getFullName(item) }}</td>
  <td>{{ formatDate(item.NgayMuon) }}</td>
  <td>{{ formatDate(item.NgayTra) }}</td>
</template>

<style scoped>

</style>