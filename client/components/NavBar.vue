<script lang="ts" setup>
const terminals = [
  {
    name: 'Wcferry',
    icon: 'i-carbon:message-queue',
  },
  {
    name: '数据库',
    icon: 'i-carbon:data-base',
  },
]

const selected = {
  name: 'Wcferry',
}
</script>

<template>
  <div
    class="h-full w-full of-hidden"
    grid="~ rows-[max-content_1fr_max-content]"
  >
    <div
      flex="~"
      border="b"
      flex-1
      items-center
      n-navbar-glass
      class="n-border-base"
    >
      <button
        v-for="t of terminals"
        :key="t.name"
        border="r base"
        flex="~ gap-2"
        items-center
        px3
        py2
        class="n-border-base"
        :class="t.name === selected?.name ? 'bg-active' : ''"
      >
        <NIcon
          v-if="t.icon"
          :icon="t.icon"
        />
        <span :class="t.name === selected?.name ? '' : 'op50'">
          {{ t.name }}
        </span>
      </button>
    </div>
  </div>
</template>
