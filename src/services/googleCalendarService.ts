/**
 * Service Google Calendar (squelette). 
 * Nécessite d'ajouter vos clés dans l'environnement :
 * - VITE_GOOGLE_CLIENT_ID
 * - VITE_GOOGLE_API_KEY
 * - SCOPE: https://www.googleapis.com/auth/calendar
 * 
 * Ajoutez le script Google Identity + Google API dans index.html :
 * <script src="https://accounts.google.com/gsi/client" async defer></script>
 * <script src="https://apis.google.com/js/api.js" async defer></script>
 */
import type { Task } from '../types';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

type EnsureClientResult = {
  tokenClient: any;
  gapiLoaded: boolean;
};

// Chargement gapi + token client
export const ensureGoogleClient = async (): Promise<EnsureClientResult> => {
  if (!GOOGLE_API_KEY || !GOOGLE_CLIENT_ID) {
    throw new Error('Config Google manquante (VITE_GOOGLE_API_KEY / VITE_GOOGLE_CLIENT_ID).');
  }

  await new Promise<void>((resolve, reject) => {
    if (window.gapi?.load) {
      window.gapi.load('client', { callback: resolve, onerror: () => reject(new Error('gapi load error')) });
    } else {
      reject(new Error('gapi non chargé. Ajoutez <script src="https://apis.google.com/js/api.js"></script>'));
    }
  });

  await window.gapi.client.init({
    apiKey: GOOGLE_API_KEY,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  });

  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity non chargé. Ajoutez <script src="https://accounts.google.com/gsi/client"></script>');
  }

  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: CALENDAR_SCOPE,
    callback: () => {},
  });

  return { tokenClient, gapiLoaded: true };
};

// Demande un token OAuth (popup)
export const requestCalendarAccess = async (tokenClient: any) => {
  return new Promise<void>((resolve, reject) => {
    tokenClient.callback = (resp: any) => {
      if (resp.error) {
        reject(resp);
      } else {
        resolve();
      }
    };
    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
};

// Convertit une tâche en payload d'événement Google Calendar
const taskToEvent = (task: Task) => {
  const startDateTime = task.startDate
    ? new Date(`${task.startDate}T${task.startTime || '00:00'}`)
    : null;
  const endDateTime = task.endDate
    ? new Date(`${task.endDate}T${task.endTime || '00:30'}`)
    : null;

  if (!startDateTime || !endDateTime) {
    throw new Error('La tâche doit avoir des dates de début/fin pour être synchronisée.');
  }

  return {
    summary: task.title,
    description: task.description || '',
    start: { dateTime: startDateTime.toISOString() },
    end: { dateTime: endDateTime.toISOString() },
  };
};

// Création / mise à jour d'un événement depuis une tâche
export const upsertCalendarEventFromTask = async (task: Task, calendarId = 'primary') => {
  const eventPayload = taskToEvent(task);

  if (task.googleEventId) {
    const resp = await window.gapi.client.calendar.events.update({
      calendarId,
      eventId: task.googleEventId,
      resource: eventPayload,
    });
    return resp.result.id as string;
  }

  const resp = await window.gapi.client.calendar.events.insert({
    calendarId,
    resource: eventPayload,
  });

  return resp.result.id as string;
};

// Récupère les événements Google modifiés depuis une date
export const fetchUpdatedEvents = async (calendarId = 'primary', syncToken?: string) => {
  const resp = await window.gapi.client.calendar.events.list({
    calendarId,
    syncToken,
    singleEvents: true,
    orderBy: 'startTime',
  });
  return resp.result;
};
