<template>
  <q-banner
    inline-actions
    dense
    rounded
    class="transition transition-all duration-500 ease-in-out z-50 m-2"
    :class="{
      hidden: hidden,
      'text-white bg-info': severity === 0,
      'text-white bg-warning': severity === 1,
      'text-white bg-accent': severity === 2,
      'text-white bg-primary': severity === 3,
    }"
  >
    {{ title }}
    <template v-slot:action>
      <q-btn flat color="white" :label="button" @click="hidden = true" />
    </template>
    <template v-slot:avatar>
      <q-icon :name="icon[severity]" color="white" />
    </template>
  </q-banner>
</template>

<style scoped></style>

<script lang="ts">
import type { EventBus } from 'quasar';
import type { AlertPayload } from 'src/interfaces/alerts';
import { Severity } from 'src/interfaces/alerts';
import { defineComponent } from 'vue';
import { ref, inject } from 'vue';

export default defineComponent({
  name: 'WBanner',
  setup() {
    return {
      severity: ref<Severity>(Severity.INFO),
      title: ref<string>(''),
      button: ref<string>(''),
      hidden: ref<boolean>(true),
      icon: ['info', 'warning', 'error', 'check_circle'],
    };
  },
  mounted() {
    const bus = inject<EventBus>('bus');

    bus!.on('error:unauthorized', ({ title, button }: AlertPayload) => {
      this.severity = Severity.WARNING;
      this.title = `Non autorizzato: ${title}`;
      this.button = button;
      this.hidden = false;
      setTimeout(() => (this.hidden = true), 5000);
    });

    bus!.on('error:server', ({ title, button }: AlertPayload) => {
      this.severity = Severity.ERROR;
      this.title = `Errore: ${title}`;
      this.button = button;
      this.hidden = false;
      setTimeout(() => (this.hidden = true), 5000);
    });

    bus!.on('error:validation', ({ title, button }: AlertPayload) => {
      this.severity = Severity.ERROR;
      this.title = `Validazione fallita: ${title}`;
      this.button = button;
      this.hidden = false;
      setTimeout(() => (this.hidden = true), 5000);
    });

    bus!.on('success:general', ({ title, button }: AlertPayload) => {
      this.severity = Severity.SUCCESS;
      this.title = `${title}`;
      this.button = button;
      this.hidden = false;
      setTimeout(() => (this.hidden = true), 5000);
    });

    bus!.on('warning:general', ({ title, button }: AlertPayload) => {
      this.severity = Severity.WARNING;
      this.title = `${title}`;
      this.button = button;
      this.hidden = false;
      setTimeout(() => (this.hidden = true), 5000);
    });
  },
});
</script>
