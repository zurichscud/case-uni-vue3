<script setup></script>

<template>
  <view>案件</view>
  <wd-grid clickable :column="4" >
    <wd-grid-item icon="picture" text="全部案件" use-icon-slot>
      <template #icon>
        <i class="iconfont icon-case-file"></i>
      </template>
    </wd-grid-item>
  </wd-grid>
  <view>团队</view>
  <wd-grid clickable :column="4">
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
  </wd-grid>
  <view>政策</view>
  <wd-grid clickable :column="4">
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
  </wd-grid>
  <view>文章</view>
  <wd-grid clickable>
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
    <wd-grid-item icon="picture" text="文字" />
  </wd-grid>
</template>

<style scoped></style>
