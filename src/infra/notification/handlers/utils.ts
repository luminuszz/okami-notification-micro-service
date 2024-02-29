import { Providers, ChannelsLabels, ProvidersLabels } from '@domain/notification/notifications';

export const createChannelSubscriber = (channel: ChannelsLabels, provider: ProvidersLabels) => `${channel}-${provider}`;

export const EventCreators = {
  webPush: (channel: ChannelsLabels) => createChannelSubscriber(channel, Providers.WEB_PUSH),
  telegram: (channel: ChannelsLabels) => createChannelSubscriber(channel, Providers.TELEGRAM),
  mobilePush: (channel: ChannelsLabels) => createChannelSubscriber(channel, Providers.MOBILE_PUSH),
};
