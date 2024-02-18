import { InMemoryNotificationRepository } from '@test/mocks/in-memory-notification-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { SendNotificationUseCase } from './send-notification';

describe('Send Notification', () => {
  let notificationRepository: InMemoryNotificationRepository;

  let stu: SendNotificationUseCase;

  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();

    stu = new SendNotificationUseCase(notificationRepository);
  });

  it('should be able to send a notification to a recipient', async () => {
    await stu.execute({ content: 'Hello', recipientId: '123' });

    expect(notificationRepository.notifications).toHaveLength(1);
  });
});
