import { defineStore } from "pinia";
import axios from "axios";

export const useKioskButtonStore = defineStore("kioskButton", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("kioskButtons") || "[]"),
    draggedItem: null,
  }),

  getters: {
    visibleItems: (state) => {
      return state.items.filter((item) => item && item.visible);
    },
  },

  actions: {
    setDraggedItem(item) {
      this.draggedItem = item;
    },

    reorderItems(targetItem) {
      if (!this.draggedItem || !targetItem) return;

      const draggedIndex = this.items.findIndex(
        (item) => item.buttonId === this.draggedItem.buttonId
      );
      const targetIndex = this.items.findIndex(
        (item) => item.buttonId === targetItem.buttonId
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
        localStorage.setItem("kioskButtons", JSON.stringify(this.items));
      }
    },

    updateVisibility(items) {
      this.items = items.map((item) => ({
        buttonId: item.buttonId,
        buttonName: item.buttonName,
        visible: item.visible !== undefined ? item.visible : true,
        position: item.position,
      }));
      // 상태 업데이트 시 localStorage 저장
      localStorage.setItem("kioskButtons", JSON.stringify(this.items));
    },

    async applySettingsToBackend(updatedItems) {
      try {
        const payload = updatedItems.map((item) => ({
          deptId: item.deptId,
          buttonId: item.buttonId,
          position: item.position,
          visible: item.visible,
        }));

        await axios.put("/api/kiosk/buttons/update", payload);
        // 성공적으로 업데이트된 경우 localStorage 갱신
        localStorage.setItem("kioskButtons", JSON.stringify(this.items));
      } catch (error) {
        console.error("Failed to update settings:", error);
        throw error; // 에러를 상위로 전파하여 처리할 수 있도록 함
      }
    },

    // 로그아웃 시 호출할 메서드
    clearButtonData() {
      this.items = [];
      localStorage.removeItem("kioskButtons");
    },

    // 단일 버튼 업데이트
    updateButton(updatedButton) {
      const index = this.items.findIndex(
        (item) => item.buttonId === updatedButton.buttonId
      );
      if (index !== -1) {
        this.items[index] = {
          ...this.items[index],
          ...updatedButton,
        };
        localStorage.setItem("kioskButtons", JSON.stringify(this.items));
      }
    },

    // 버튼 삭제
    removeButton(buttonId) {
      this.items = this.items.filter((item) => item.buttonId !== buttonId);
      localStorage.setItem("kioskButtons", JSON.stringify(this.items));
    },

    // 버튼 추가
    addButton(newButton) {
      this.items.push(newButton);
      localStorage.setItem("kioskButtons", JSON.stringify(this.items));
    },
  },
});
