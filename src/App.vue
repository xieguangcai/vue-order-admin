<template>
  <div id="app">
    <keep-alive :include="['NewNativeLayout','EditNativeLayout', 'AddActivityInfo', 'ActivityInfoDetail', 'SubsidyAdd', 'ActivityInfoList']">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default class App extends Vue {
}
</script>
