import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import LoginForm from '../client/components/LoginForm.vue';
import { useSpotifyAuth } from '../client/composables/useSpotifyAuth';

const mockRedirectToSpotifyAuthorize = jest.fn();
jest.mock('../client/composables/useSpotifyAuth')

useSpotifyAuth.mockImplementation(() => ({
  redirectToSpotifyAuthorize: mockRedirectToSpotifyAuthorize,
}),)

describe('LoginForm.vue', () => {
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = mount(LoginForm, {
      global: {
        plugins: [createTestingPinia()],
      }
    });
  });

  test('It displays the right text', () => {
    expect(wrapper.text()).toContain('To begin, please authorise your Spotify account.');
  });

  test('It calls redirectToSpotifyAuthorize on button click', async () => {
    await wrapper.get('button').trigger('click');
    expect(mockRedirectToSpotifyAuthorize).toHaveBeenCalled();
  });
});
