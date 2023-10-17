import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});

// tests/HelloWorld.spec.ts
// import { describe, it, expect } from 'vitest'
// import { mount } from '@vue/test-utils'

// import HelloWorld from '../components/HelloWorld.vue'

// describe('HelloWorld', () => {
//   it('is a Vue instance', () => {
//     const wrapper = mount(HelloWorld)
//     expect(wrapper.vm).toBeTruthy()
//   })
// })
