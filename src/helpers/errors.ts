import type { EventBus } from 'quasar';
import type { ServerResponse, ValidationError } from 'src/interfaces/response';

const statusMappings: Record<number, string> = {
  401: 'error:unauthorized',
  500: 'error:server',
  422: 'error:validation',
};

const handleStatus = (error: ServerResponse | ValidationError, bus: EventBus) => {
  if ('body' in error && typeof error.body?.code === 'number') {
    const key = statusMappings[error.body.code] ?? statusMappings[500];
    bus?.emit(key!, { title: error.body.message ?? 'Errore', button: 'Chiudi' });
    return;
  }

  if ('message' in error && error.message) {
    if (error.message.includes('validation'))
      bus?.emit(statusMappings[422] ?? statusMappings[500]!, {
        title: error.message,
        button: 'Chiudi',
      });
    else
      bus?.emit(statusMappings[401] ?? statusMappings[500]!, {
        title: error.message,
        button: 'Chiudi',
      });
    return;
  }

  if ('errors' in error && Array.isArray(error.errors) && error.errors.length > 0) {
    const firstError = error.errors[0];
    bus?.emit(statusMappings[422] ?? statusMappings[500]!, {
      title: firstError.message ?? 'Errore di validazione',
      button: 'Chiudi',
    });
    return;
  }

  bus?.emit(statusMappings[500]!, { title: 'Errore sconosciuto', button: 'Chiudi' });
};

export { handleStatus };
