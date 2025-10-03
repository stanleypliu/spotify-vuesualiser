module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.(ts|js)$": "babel-jest"
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node']
}
