/**
 * TechNova IT Helpdesk - Configuración Global del Front-end
 * Conecta el cliente web SPA con la API REST de Spring Boot.
 */
export const API_BASE = 'http://localhost:8080';

export const APP_NAME = 'TechNova IT Helpdesk';
export const APP_THEME = 'Lumina Support';

export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  TECHNICIAN: 'TECHNICIAN',
  USER: 'USER',
});

export const STATUS_FLOW = Object.freeze([
  'ABIERTA',
  'ASIGNADA',
  'EN_PROCESO',
  'RESUELTA',
  'CERRADA',
]);

export const STATUS_LABELS = Object.freeze({
  ABIERTA: 'Abierta',
  ASIGNADA: 'Asignada',
  EN_PROCESO: 'En Proceso',
  RESUELTA: 'Resuelta',
  CERRADA: 'Cerrada',
});

export const PRIORITY_LABELS = Object.freeze({
  BAJA: 'Baja (24h)',
  MEDIA: 'Media (8h)',
  ALTA: 'Alta (4h)',
  CRITICA: 'Crítica (1h)',
});
