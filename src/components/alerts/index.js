// src/components/alerts/index.js
import { AlertQueue } from '@/components/alerts/alertQueue';

export const alertQueue = new AlertQueue();

export const alert = {
  error: alertQueue.createAlertFunction('error'),
  warn: alertQueue.createAlertFunction('warn'),
  info: alertQueue.createAlertFunction('info'),
};
