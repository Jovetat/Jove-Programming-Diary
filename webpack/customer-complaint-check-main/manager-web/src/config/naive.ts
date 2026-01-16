import type { GlobalThemeOverrides } from 'naive-ui'

export const naiveThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#1890ff',
    primaryColorHover: '#40a9ff',
    primaryColorPressed: '#096dd9',
    primaryColorSuppl: '#1890ff',

    successColor: '#52c41a',
    successColorHover: '#73d13d',
    successColorPressed: '#389e0d',

    warningColor: '#faad14',
    warningColorHover: '#ffc53d',
    warningColorPressed: '#d48806',

    errorColor: '#ff4d4f',
    errorColorHover: '#ff7875',
    errorColorPressed: '#d9363e',

    infoColor: '#1890ff',
    infoColorHover: '#40a9ff',
    infoColorPressed: '#096dd9',

    borderRadius: '8px',
    borderRadiusSmall: '4px',

    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '16px',
    fontSizeMini: '12px',
    fontSizeTiny: '12px',
    fontSizeSmall: '14px',
    fontSizeMedium: '16px',
    fontSizeLarge: '18px',
    fontSizeHuge: '20px',

    lineHeight: '1.5',
  },

  Button: {
    borderRadiusMedium: '8px',
    borderRadiusSmall: '6px',
    borderRadiusLarge: '10px',
    fontWeightStrong: '500',
    paddingMedium: '8px 16px',
    paddingSmall: '6px 12px',
    paddingLarge: '10px 20px',
  },

  Card: {
    borderRadius: '12px',
    paddingMedium: '24px',
    paddingSmall: '16px',
    paddingLarge: '32px',
  },

  Input: {
    borderRadius: '8px',
    heightMedium: '40px',
    heightSmall: '32px',
    heightLarge: '48px',
  },

  Select: {
    borderRadius: '8px',
    heightMedium: '40px',
    heightSmall: '32px',
    heightLarge: '48px',
  },

  Modal: {
    borderRadius: '12px',
  },

  Dialog: {
    borderRadius: '12px',
  },

  Drawer: {
    borderRadius: '12px',
  },

  Message: {
    borderRadius: '8px',
  },

  Notification: {
    borderRadius: '12px',
  },

  Tag: {
    borderRadius: '6px',
  },

  Tooltip: {
    borderRadius: '6px',
  },
}
