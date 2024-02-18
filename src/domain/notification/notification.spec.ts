import { describe, expect, it } from 'vitest';
import { Notification } from './notifications';
import { randomUUID } from 'crypto';

describe('Notification', () => {
  it('should be able to create new Notification', () => {
    const subscriberId = randomUUID();

    const notification = Notification.create({
      content: 'novo capitulo lançado',
      createdAt: new Date(),
      recipientId: subscriberId,
    });

    expect(notification).toBeDefined();
    expect(notification.recipientId).toBe(subscriberId);
    expect(notification.content).toBe('novo capitulo lançado');
    expect(notification.readAt).toBe(null);
  });

  it('should be able to mark notification as read', () => {
    const subscriberId = randomUUID();

    const notification = Notification.create({
      content: 'novo capitulo lançado',
      createdAt: new Date(),
      recipientId: subscriberId,
    });

    notification.markAsRead();

    expect(notification.readAt).toBeInstanceOf(Date);
  });
});
