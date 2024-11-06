import { defineStore } from "pinia";
import axios from "axios";

export const usePreviewStore = defineStore("previewStore", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("previewItems") || "[]"),
    draggedItem: null,
  }),

  getters: {
    visibleItems: (state) => {
      return state.items
        .filter((item) => item && item.visible !== undefined && item.visible)
        .map((item) => ({
          id: item.ticketButtonId,
          name: item.buttonName,
          description: item.buttonDescription,
          visible: item.visible,
          position: item.buttonPosition,
        }));
    },
  },

  actions: {
    setDraggedItem(item) {
      this.draggedItem = item;
    },

    reorderItems(targetItem) {
      if (!this.draggedItem || !targetItem) return;

      const draggedIndex = this.items.findIndex(
        (item) => item.ticketButtonId === this.draggedItem.ticketButtonId
      );
      const targetIndex = this.items.findIndex(
        (item) => item.ticketButtonId === targetItem.ticketButtonId
      );

      if (
        draggedIndex !== -1 &&
        targetIndex !== -1 &&
        draggedIndex !== targetIndex
      ) {
        const reorderedItems = [...this.items];
        const [movedItem] = reorderedItems.splice(draggedIndex, 1);
        reorderedItems.splice(targetIndex, 0, movedItem);

        this.items = reorderedItems;
        // 상태 변경 시 localStorage 업데이트
        localStorage.setItem("previewItems", JSON.stringify(this.items));
      }
    },

    updateVisibility(items) {
      this.items = items.map((item) => ({
        ticketButtonId: item.ticketButtonId,
        buttonName: item.buttonName,
        buttonDescription: item.buttonDescription,
        visible: item.visible !== undefined ? item.visible : true,
        position: item.buttonPosition,
      }));
      // 상태 업데이트 시 localStorage 저장
      localStorage.setItem("previewItems", JSON.stringify(this.items));
    },

    async applySettingsToBackend(updatedItems) {
      try {
        const payload = updatedItems.map((item) => ({
          deptId: item.deptId,
          ticketButtonId: item.ticketButtonId,
          buttonDescription: item.buttonDescription,
          position: item.position,
          visible: item.visible,
        }));

        await axios.put("/api/kiosk/ticket-layout/update", payload);
        // 성공적으로 업데이트된 경우 localStorage 갱신
        localStorage.setItem("previewItems", JSON.stringify(this.items));
      } catch (error) {
        console.error("Failed to update settings:", error);
        throw error; // 에러를 상위로 전파하여 처리할 수 있도록 함
      }
    },

    // 로그아웃 시 호출할 메서드
    clearPreviewData() {
      this.items = [];
      localStorage.removeItem("previewItems");
    },
  },
});
