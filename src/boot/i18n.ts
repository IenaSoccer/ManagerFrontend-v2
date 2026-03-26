import { boot } from 'quasar/wrappers';
import type { I18nConfig } from 'src/interfaces/i18n';

export default boot(({ app }) => {
  const i18n: I18nConfig = {
    auth: {
      login: {
        422: {
          message: 'Credenziali invalide',
          severity: 1,
        },
        500: {
          message: 'Errore di login',
          severity: 2,
        },
        200: {
          message: 'Accesso eseguito',
          severity: 0,
        },
      },
      register: {
        422: {
          message: 'Campi non corretti',
          severity: 1,
        },
        500: {
          message: 'Errore di registrazione',
          severity: 2,
        },
        200: {
          message: 'Registrazione eseguita',
          severity: 0,
        },
      },
      checkCapabilities: {
        401: {
          message: 'Token invalido',
          severity: 1,
        },
        200: {
          message: 'Token registrato',
          severity: 0,
        },
      },
      logout: {
        500: {
          message: 'Errore di logout',
          severity: 2,
        },
        200: {
          message: 'Disconnessione eseguita',
          severity: 0,
        },
      },
      me: {
        200: {
          message: "Hai già eseguito l'accesso",
          severity: 0,
        },
        401: {
          message: "Devi eseguire prima l'accesso",
          severity: 0,
        },
      },
    },
    token: {
      register: {
        201: {
          message: 'Token registrato correttamente',
          severity: 0,
        },
        404: {
          message: 'Token invalido',
          severity: 1,
        },
      },
      unregister: {
        204: {
          message: 'Token revocato correttamente',
          severity: 0,
        },
      },
      capabilities: {
        200: {
          message: 'Lista permessi recuperata',
          severity: 0,
        },
        204: {
          message: 'Sei un admin',
          severity: 0,
        },
      },
      fetch: {
        200: {
          message: 'Lista token recuperata',
          severity: 0,
        },
      },
      add: {
        201: {
          message: 'Token aggiunto correttamento',
          severity: 0,
        },
      },
      remove: {
        204: {
          message: 'Token eliminato correttamento',
          severity: 0,
        },
      },
    },
    user: {
      changePass: {
        200: {
          message: 'Password cambiata',
          severity: 0,
        },
        401: {
          message: 'Password invalida',
          severity: 1,
        },
      },
      editAccount: {
        204: {
          message: 'Account aggiornato',
          severity: 0,
        },
      },
      deleteUser: {
        204: {
          message: 'Utente eliminato',
          severity: 0,
        },
      },
      saveUser: {
        204: {
          message: 'Utente modificato',
          severity: 0,
        },
      },
      editThumbnail: {
        204: {
          message: 'Immagine profilo aggiornata',
          severity: 0,
        },
      },
    },
    resources: {
      delete: {
        204: {
          message: 'Risorsa eliminata',
          severity: 0,
        },
      },
      add: {
        201: {
          message: 'Risorsa aggiunta',
          severity: 0,
        },
      },
      edit: {
        204: {
          message: 'Risorsa modificata',
          severity: 0,
        },
      },
    },
    folders: {
      add: {
        201: {
          message: 'Cartella aggiunta',
          severity: 0,
        },
      },
      edit: {
        204: {
          message: 'Cartella modificata',
          severity: 0,
        },
      },
      delete: {
        204: {
          message: 'Cartella eliminata',
          severity: 0,
        },
      },
    },
    attachments: {
      add: {
        201: {
          message: 'File aggiunto',
          severity: 0,
        },
      },
      edit: {
        204: {
          message: 'Allegato aggiornato',
          severity: 0,
        },
      },
      fetch: {
        200: {
          message: 'Allegati recuperati',
          severity: 0,
        },
      },
      delete: {
        204: {
          message: 'File eliminato',
          severity: 0,
        },
      },
      deleteAll: {
        204: {
          message: 'Files eliminati',
          severity: 0,
        },
      },
    },
    mappings: {
      add: {
        201: {
          message: 'Mapping aggiunto',
          severity: 0,
        },
      },
      fetch: {
        200: {
          message: 'Mappings recuperati',
          severity: 0,
        },
      },
      delete: {
        204: {
          message: 'Mapping eliminato',
          severity: 0,
        },
      },
    },
    alerts: {
      add: {
        201: {
          message: 'Messaggio aggiunto',
          severity: 0,
        },
      },
      fetch: {
        200: {
          message: 'Messaggi recuperati',
          severity: 0,
        },
      },
      delete: {
        204: {
          message: 'Messaggio eliminato',
          severity: 0,
        },
      },
    },
    globals: {
      422: {
        message: 'Parametri invalidi',
        severity: 1,
      },
      403: {
        message: 'Accesso negato',
        severity: 1,
      },
      401: {
        message: 'Non autorizzato',
        severity: 1,
      },
      404: {
        message: 'Non trovato',
        severity: 1,
      },
      500: {
        message: 'Errore interno',
        severity: 2,
      },
      200: {
        message: 'OK',
        severity: 0,
      },
      429: {
        message: 'Troppi tentativi',
        severity: 2,
      },
    },
  };

  app.provide('i18n', i18n);
});
