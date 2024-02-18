export class InvalidNotificationOperation extends Error {
  constructor(message?: string) {
    super(message ?? 'Invalid notification operation');
  }
}
