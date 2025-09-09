import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import NotFound from '@/views/NotFound.vue'

describe('NotFound.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(NotFound, {
      global: {
        plugins: [createPinia()],
        stubs: ['router-link'],
      },
    })
    
    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('Page Not Found')
  })
})
