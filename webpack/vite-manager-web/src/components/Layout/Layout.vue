<template>
  <div class="app-layout">
    <a-layout class="layout-inner">
      <a-layout-sider
        v-model:collapsed="collapsed"
        collapsible
        :width="200"
        :collapsed-width="71"
        class="sider"
      >
        <a-menu
          v-model:selected-keys="selectedKeys"
          v-model:open-keys="openKeys"
          theme="dark"
          mode="inline"
          :inline-collapsed="collapsed"
          :items="menuItems"
          class="sider-menu"
          @click="onMenuClick"
        ></a-menu>
      </a-layout-sider>

      <a-layout class="content-layout">
        <a-layout-content class="app-content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { menuItems } from '@/router';

const router = useRouter();
const route = useRoute();

const collapsed = ref(false);
const selectedKeys = ref([route.path]);
const openKeys = ref([]);

const onMenuClick = ({ key }) => {
  router.push(key);
};

const findParentMenu = path => {
  return menuItems.find(item =>
    item.children?.some(child => child.key === path),
  );
};

const updateMenuState = path => {
  selectedKeys.value = [path];
  const parentMenu = findParentMenu(path);
  if (parentMenu && !collapsed.value) {
    openKeys.value = [parentMenu.key];
  }
};

watch(() => route.path, updateMenuState, { immediate: true });

watch(collapsed, val => {
  if (val) {
    openKeys.value = [];
  } else {
    const parentMenu = findParentMenu(route.path);
    if (parentMenu) {
      openKeys.value = [parentMenu.key];
    }
  }
});
</script>

<style scoped lang="scss">
.app-layout {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $bg-color;
  overflow: hidden;
}

.layout-inner {
  width: 100%;
  height: 100%;
  background: transparent;
}

.sider {
  background: #001529;
  overflow-y: auto;
  overflow-x: hidden;
}

.sider-menu {
  height: calc(100% - 48px);
  border-right: none;

  :deep(.ant-menu-item-selected) {
    background-color: $primary-color !important;
  }

  :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title) {
    color: #fff;
  }

  :deep(.ant-menu-sub) {
    background: #001529 !important;
  }
}

.content-layout {
  flex: 1;
  background: $bg-color;
  padding: $padding-15;
  overflow: auto;
}

.app-content {
  width: 100%;
  background: $bg-color-white;
  padding: $padding-20;
}
</style>
