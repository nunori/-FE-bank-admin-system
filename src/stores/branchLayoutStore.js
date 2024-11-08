// stores/branchLayoutStore.js

import { defineStore } from "pinia";
import axiosInstance from "@/axios.js"; // axiosInstance 임포트

export const useBranchLayoutStore = defineStore("branchLayout", {
  state: () => ({
    floors: [],
    currentFloor: null,
    layouts: {},
  }),

  actions: {
    // 층 목록 조회
    async loadFloors(deptId) {
      try {
        const response = await axiosInstance.get(
          `/branch-layout/floors/${deptId}`
        );
        this.floors = response.data;
      } catch (error) {
        console.error("층 목록을 불러오는 중 오류 발생:", error);
      }
    },

    // 층 선택 시 해당 층의 레이아웃 로드
    async loadFloorLayout(floorId) {
      try {
        const response = await axiosInstance.get(
          `/branch-layout/floor/${floorId}`
        );
        this.layouts[floorId] = response.data; // 선택한 층의 레이아웃 저장
        this.currentFloor = floorId; // 현재 선택한 층 업데이트
      } catch (error) {
        console.error("층 레이아웃을 불러오는 중 오류 발생:", error);
      }
    },

    // 레이아웃 저장
    async saveLayout(floorId, layoutData) {
      try {
        await axiosInstance.post("/branch-layout/save", {
          floorId,
          layout: layoutData,
        });
        console.log("레이아웃 저장 완료");
      } catch (error) {
        console.error("레이아웃 저장 중 오류 발생:", error);
      }
    },

    // 새로운 층 추가
    async addFloor(deptId, floorNumber, floorName = "") {
      try {
        const response = await axiosInstance.post("/branch-layout/floors", {
          deptId,
          floorNumber,
          floorName,
        });
        console.log("새 층이 추가되었습니다:", response.data);
        // 추가된 층 데이터를 floors 배열에 추가
        this.floors.push(response.data);
      } catch (error) {
        console.error("층 추가 중 오류 발생:", error);
      }
    },

    // 최적화 요청
    async optimizeLayout(floorId) {
      try {
        const response = await axiosInstance.post(
          `/branch-layout/optimize/${floorId}`
        );
        console.log("최적화된 레이아웃 데이터:", response.data);
        this.layouts[floorId] = response.data; // 최적화된 레이아웃 저장
      } catch (error) {
        console.error("레이아웃 최적화 중 오류 발생:", error);
      }
    },
  },
});
