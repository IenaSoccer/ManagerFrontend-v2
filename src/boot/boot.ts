import { EventBus } from 'quasar';
import { boot } from 'quasar/wrappers';
import type { App } from 'vue';

export default boot(({ app }: { app: App }) => {
  const bus: EventBus = new EventBus();

  // for Composition API
  app.provide('bus', bus);
});
