import { EventBus } from 'quasar';
import { defineBoot } from '#q-app';
import type { App } from 'vue';

export default defineBoot(({ app }: { app: App }) => {
  const bus: EventBus = new EventBus();

  // for Composition API
  app.provide('bus', bus);
});
