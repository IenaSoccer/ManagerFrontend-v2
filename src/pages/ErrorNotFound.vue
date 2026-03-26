<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div class="select-none flex flex-col items-center">
      <div class="w-full flex flex-row justify-center items-center top-[10px] left-0">
        <q-img class="w-32 object-contain" src="iena-logo.png" />
      </div>
      <div style="font-size: 30vh" class="font-bold">404</div>
      <div class="text-h3 font-light" style="opacity: 0.4">Cosa stavi cercando?</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Dashboard"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
//
</script>
