<template>
  <div class="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
    <!-- Animated SVG blobs background (royal blue & light orange) -->
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"
      class="absolute inset-0 w-[120%] h-[120%] -translate-y-10 opacity-80">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0" stop-color="#2116F7" />
          <stop offset="1" stop-color="#2B21EB" />
        </linearGradient>
        <linearGradient id="g2" x1="0" x2="1">
          <stop offset="0" stop-color="#FF7F00" />
          <stop offset="1" stop-color="#F77B16" />
        </linearGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feBlend in="SourceGraphic" in2="blur" mode="screen" />
        </filter>
      </defs>

      <g transform="translate(120,120)" filter="url(#softGlow)">
        <circle cx="100" cy="80" r="140" fill="url(#g1)" opacity="0.95">
          <animate attributeName="cx" dur="8s" values="100; 180; 70; 100" repeatCount="indefinite" />
          <animate attributeName="cy" dur="10s" values="80; 30; 120; 80" repeatCount="indefinite" />
          <animate attributeName="r" dur="12s" values="120;140;100;120" repeatCount="indefinite" />
        </circle>
      </g>

      <g transform="translate(520,360)" filter="url(#softGlow)">
        <circle cx="0" cy="0" r="160" fill="url(#g2)" opacity="0.95">
          <animate attributeName="cx" dur="9s" values="0; -40; 50; 0" repeatCount="indefinite" />
          <animate attributeName="r" dur="7s" values="140;160;120;140" repeatCount="indefinite" />
        </circle>
      </g>

      <rect width="100%" height="100%" fill="black" opacity="0" />
    </svg>

    <!-- Card -->
    <div
      class="relative z-20 w-full max-w-[360px] mx-4 p-7 rounded-xl backdrop-blur-md bg-gradient-to-br from-[rgba(0,0,0,0.85)] via-[rgba(65,105,225,0.06)] to-[rgba(255,179,102,0.06)] shadow-2xl text-white transform transition-transform duration-300 hover:-translate-y-1 hover:scale-105">
      <div class="flex items-center gap-3 mb-3">
        <div class="flex items-center justify-center font-bold text-black">
        </div>
        <q-img src="~@/assets/iena-logo.png" class="w-12 object-contain" />
        <div>
          <div class="text-lg font-extrabold tracking-tight">Benvenuto</div>
          <div class="text-xs text-white/70">Accedi per continuare sulla piattaforma</div>
        </div>
      </div>

      <form @submit.prevent="onLogin" class="flex flex-col gap-3">
        <!-- Email -->
        <div class="relative">
          <input v-model="loginData.email" required type="email" id="email" placeholder=" " autocomplete="email"
            class="w-full px-3 py-3 rounded-lg border border-white/8 bg-transparent text-inherit outline-none text-sm transition-shadow duration-150 focus:ring-2 focus:ring-[rgba(65,105,225,0.18)] focus:border-[rgba(65,105,225,0.35)]" />
          <label for="email" :class="loginData.email ? 'text-xs -translate-y-3 scale-95' : 'text-sm translate-y-0'"
            class="absolute left-3 top-3 pointer-events-none transition-all duration-150 text-white/70">
            Email
          </label>
        </div>
        <!-- Password -->
        <div class="relative flex items-center">
          <input v-model="loginData.password" :type="reveal ? 'text' : 'password'" required id="password" autocomplete="current-password"
            placeholder=" "
            class="flex-1 px-3 py-3 pr-12 rounded-lg border border-white/8 bg-transparent text-inherit outline-none text-sm transition-shadow duration-150 focus:ring-2 focus:ring-[rgba(33,22,247,0.18)] focus:border-[rgba(33,22,247,0.35)]" />
          <label for="password" :class="loginData.password ? 'text-xs -translate-y-3 scale-95' : 'text-sm translate-y-0'
            " class="absolute left-3 top-3 pointer-events-none transition-all duration-150 text-white/70">
            Password
          </label>
          <button type="button" @click="reveal = !reveal" :aria-label="reveal ? 'Nascondi password' : 'Mostra password'"
            class="absolute right-2 text-white/75 cursor-pointer text-sm bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] rounded-md px-2 py-1 transition-colors duration-150">
            {{ reveal ? 'Nascondi' : 'Mostra' }}
          </button>
        </div>
        <div class="recaptcha-wrapper"><RecaptchaV2 @load-callback="handleLoadCallback" @expired-callback="handleExpiredCallback" size="normal" /></div>
        <div class="flex justify-between items-center text-sm text-white/80">
          <label class="inline-flex items-center gap-2">
            <input v-model="loginData.remember_me" type="checkbox" class="w-3.5 h-3.5 rounded-sm accent-[#2116F7]" />
            Ricordami
          </label>
          <a href="#" @click.prevent="displayModal" class="text-[#F77B16] no-underline hover:underline">Password
            dimenticata?</a>
        </div>
        <button type="submit" :disabled="isSubmitting || !loginData['g-recaptcha-response']"
          class="mt-1 py-3 rounded-lg cursor-pointer bg-gradient-to-r from-[#4169E1] to-[#FFB366] text-black font-bold shadow-2xl transform transition duration-200 hover:scale-102 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60">
          {{ isSubmitting ? 'Accesso in corso…' : 'Accedi' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import type { LoginPayload } from '../interfaces/payloads';
import type { ServerResponse, ValidationError } from '@/interfaces/response';
import type { EventBus } from 'quasar';
import { handleStatus } from '@/helpers/errors';
import { useRoute, useRouter } from 'vue-router';
import type { Globals } from '@/interfaces/globals';
import { RecaptchaV2 } from 'vue3-recaptcha-v2';

const handleLoadCallback = (response: unknown) => {
  loginData.value['g-recaptcha-response'] = response as string;
};
const handleExpiredCallback = () => {
  loginData.value['g-recaptcha-response'] = '';
};

const globals = inject('globals') as Globals;
const router = useRouter();
const route = useRoute();
const bus = inject<EventBus>('bus');
const authStore = globals.stores.auth;

const reveal = ref(false);
const isSubmitting = ref(false);
const loginData = ref<LoginPayload>({
  email: '',
  password: '',
  remember_me: false,
  'g-recaptcha-response': '',
});

const onLogin = () => {
  if (isSubmitting.value || !loginData.value['g-recaptcha-response']) return;
  isSubmitting.value = true;
  authStore
    .login(loginData.value)
    .then(async (response) => {
      if (response) {
        bus?.emit('success:general', {
          title: 'Accesso effettuato con successo!',
          button: 'Chiudi',
        });
        const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null;
        await router.push(redirect?.startsWith('/') ? redirect : { name: 'IndexPage' });
      }
    })
    .catch((error: ServerResponse | ValidationError) => {
      handleStatus(error, bus);
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};

const displayModal = () => {
  bus?.emit('warning:general', {
    title: 'Contatta un amministratore per reimpostare la password.',
    button: 'Chiudi',
  });
};
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  :deep(*) { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
@media (max-width: 360px) {
  .recaptcha-wrapper { transform: scale(0.75); transform-origin: left center; width: 304px; height: 59px; }
}
</style>
