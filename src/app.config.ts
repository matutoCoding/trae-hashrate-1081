export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/fermentation/index',
    'pages/turning/index',
    'pages/bottling/index',
    'pages/sales/index',
    'pages/steaming-detail/index',
    'pages/alcohol-detail/index',
    'pages/acetate-detail/index',
    'pages/turning-detail/index',
    'pages/leaching-detail/index',
    'pages/aging-detail/index',
    'pages/filling-detail/index',
    'pages/batch-detail/index',
    'pages/sale-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#8B4513',
    navigationBarTitleText: '醋厂生产管理',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FDF8F3'
  },
  tabBar: {
    color: '#9B7B6B',
    selectedColor: '#8B4513',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/fermentation/index',
        text: '发酵'
      },
      {
        pagePath: 'pages/turning/index',
        text: '翻醅'
      },
      {
        pagePath: 'pages/bottling/index',
        text: '淋醋灌装'
      },
      {
        pagePath: 'pages/sales/index',
        text: '销售台账'
      }
    ]
  }
})
