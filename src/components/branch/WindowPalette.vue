<template>
  <div class="window-palette">
    <h3>창구 도구</h3>
    <div class="palette-items">
      <div
        v-for="type in windowTypes"
        :key="type.id"
        class="palette-item"
        draggable="true"
        @dragstart="handleDragStart($event, type)"
      >
        <div class="window-preview" :class="type.class">
          {{ type.name }}
        </div>
      </div>

      <div
        class="palette-item entrance"
        draggable="true"
        @dragstart="handleDragStart($event, { type: 'ENTRANCE' })"
      >
        입구
      </div>
    </div>
  </div>
</template>

<script setup>
const windowTypes = [
  { id: 1, type: "NORMAL", name: "일반창구", class: "window-normal" },
  { id: 2, type: "LOAN", name: "대출창구", class: "window-loan" },
  { id: 3, type: "ENTERPRISE", name: "기업창구", class: "window-enterprise" },
];

const handleDragStart = (event, item) => {
  event.dataTransfer.setData("application/json", JSON.stringify(item));
};
</script>

<style scoped>
.window-palette {
  width: 200px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.palette-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.palette-item {
  padding: 0.5rem;
  border: 1px dashed #ccc;
  border-radius: 4px;
  cursor: grab;
}

.window-preview {
  padding: 0.5rem;
  text-align: center;
  border-radius: 4px;
}

.window-normal {
  background-color: #81c784;
}
.window-loan {
  background-color: #64b5f6;
}
.window-enterprise {
  background-color: #ffb74d;
}

.entrance {
  background-color: #9575cd;
  color: white;
  text-align: center;
  padding: 0.5rem;
}
</style>
