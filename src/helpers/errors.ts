import type { EventBus } from 'quasar';
import type { ServerResponse, ValidationError } from 'src/interfaces/response';

const statusMappings: Record<number, string> = {
  401: 'error:unauthorized',
  500: 'error:server',
  422: 'error:validation',
};

const handleStatus = (error: unknown, bus?: EventBus) => {
  if (!bus) return;
  if (typeof error === 'object' && error !== null && 'body' in error) {
    const serverError = error as ServerResponse;
    if (typeof serverError.body?.code !== 'number') return;
    const key = statusMappings[serverError.body.code] ?? statusMappings[500];
    bus.emit(key!, { title: serverError.body.message ?? 'Errore', button: 'Chiudi' });
    return;
  }

  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const validation = error as ValidationError;
    const firstError = Object.values(validation.errors ?? {}).flat()[0];
    if (firstError) {
      bus.emit(statusMappings[422]!, { title: firstError, button: 'Chiudi' });
      return;
    }
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = typeof error.message === 'string' ? error.message : '';
    if (message) {
      bus.emit(message.toLowerCase().includes('validation') ? statusMappings[422]! : statusMappings[500]!, {
        title: message,
        button: 'Chiudi',
      });
      return;
    }
  }

  bus.emit(statusMappings[500]!, { title: 'Errore sconosciuto', button: 'Chiudi' });
};

export { handleStatus };
