export const useBranchLayoutStore = defineStore("branchLayout", {
  state: () => ({
    floors: [],
    currentFloor: 1,
    layouts: {},
    templates: [],
  }),

  actions: {
    // 층별 레이아웃 로드
    async loadFloorLayout(floorId) {
      const response = await axios.get(`/api/branch-layout/floor/${floorId}`);
      this.layouts[floorId] = response.data;
    },

    // 레이아웃 저장
    async saveLayout(floorId, layoutData) {
      await axios.post("/api/branch-layout/save", {
        floorId,
        layout: layoutData,
      });
    },

    // 템플릿으로 저장
    async saveAsTemplate(name, layoutData) {
      await axios.post("/api/branch-layout/template", {
        name,
        layout: layoutData,
      });
    },

    // 최적화 요청
    async optimizeLayout(floorId) {
      const response = await axios.post(
        `/api/branch-layout/optimize/${floorId}`
      );
      return response.data;
    },
  },
});
