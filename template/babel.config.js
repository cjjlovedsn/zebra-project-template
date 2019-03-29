module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    <%_ if (options.theme) { _%>
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': '~src/theme'
      }
    ]
    <%_ } _%>
  ]
}
