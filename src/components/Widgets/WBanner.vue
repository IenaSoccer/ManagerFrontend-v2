<template>
  <q-banner v-if="visible" inline-actions dense rounded role="status" aria-live="polite"
    class="transition-all duration-300 z-50 m-2 text-white" :class="backgroundClass">
    {{ title }}
    <template #action><q-btn flat color="white" :label="button" @click="hide" /></template>
    <template #avatar><q-icon :name="icon" color="white" /></template>
  </q-banner>
</template>

<script setup lang="ts">
import type { EventBus } from 'quasar';
import type { AlertPayload } from 'src/interfaces/alerts';
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';

type AlertKind = 'info' | 'warning' | 'error' | 'success';
type GeneralPayload = AlertPayload | string;

const bus = inject<EventBus>('bus');
const visible = ref(false);
const title = ref('');
const button = ref('Chiudi');
const kind = ref<AlertKind>('info');
let timer: ReturnType<typeof setTimeout> | undefined;

const icon = computed(() => ({ info: 'info', warning: 'warning', error: 'error', success: 'check_circle' })[kind.value]);
const backgroundClass = computed(() => ({ info: 'bg-info', warning: 'bg-warning', error: 'bg-negative', success: 'bg-positive' })[kind.value]);

const hide = () => {
  visible.value = false;
  if (timer) clearTimeout(timer);
};

const show = (alertKind: AlertKind, payload: GeneralPayload, prefix = '') => {
  if (timer) clearTimeout(timer);
  const normalized = typeof payload === 'string' ? { title: payload, button: 'Chiudi' } : payload;
  kind.value = alertKind;
  title.value = `${prefix}${normalized.title}`;
  button.value = normalized.button || 'Chiudi';
  visible.value = true;
  timer = setTimeout(hide, 5000);
};

const unauthorized = (payload: AlertPayload) => show('warning', payload, 'Non autorizzato: ');
const serverError = (payload: AlertPayload) => show('error', payload, 'Errore: ');
const validationError = (payload: AlertPayload) => show('error', payload, 'Validazione fallita: ');
const generalError = (payload: GeneralPayload) => show('error', payload);
const success = (payload: AlertPayload) => show('success', payload);
const warning = (payload: AlertPayload) => show('warning', payload);

onMounted(() => {
  bus?.on('error:unauthorized', unauthorized);
  bus?.on('error:server', serverError);
  bus?.on('error:validation', validationError);
  bus?.on('error:general', generalError);
  bus?.on('success:general', success);
  bus?.on('warning:general', warning);
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
  bus?.off('error:unauthorized', unauthorized);
  bus?.off('error:server', serverError);
  bus?.off('error:validation', validationError);
  bus?.off('error:general', generalError);
  bus?.off('success:general', success);
  bus?.off('warning:general', warning);
});
</script>
