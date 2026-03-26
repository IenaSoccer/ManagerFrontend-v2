import { boot } from 'quasar/wrappers';
import type { App } from 'vue';
import { install } from 'vue3-recaptcha-v2';

export default boot(({ app }: { app: App }) => {
  app.provide(
    'recaptcha',
    install(app, {
      sitekey: '6Le_qIspAAAAAE-LWzHolzIZCeW2XWKIvdMGUnXC',
    }),
  );
});
