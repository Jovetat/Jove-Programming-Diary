import type { GlobalThemeOverrides } from 'naive-ui'

export const naiveThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#6496FF',
    primaryColorHover: '#78AAFF',
    primaryColorPressed: '#5078FF',
    primaryColorSuppl: '#6496FF',

    successColor: '#52c41a',
    successColorHover: '#73d13d',
    successColorPressed: '#389e0d',

    warningColor: '#faad14',
    warningColorHover: '#ffc53d',
    warningColorPressed: '#d48806',

    errorColor: '#ff4d4f',
    errorColorHover: '#ff7875',
    errorColorPressed: '#d9363e',

    infoColor: '#6496FF',
    infoColorHover: '#78AAFF',
    infoColorPressed: '#5078FF',

    borderRadius: '8px',
    borderRadiusSmall: '4px',

    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '14px',
    fontSizeMini: '12px',
    fontSizeTiny: '12px',
    fontSizeSmall: '14px',
    fontSizeMedium: '16px',
    fontSizeLarge: '18px',
    fontSizeHuge: '20px',

    lineHeight: '1.5',

    // 深色主题颜色
    baseColor: '#0A0E27',
    bodyColor: 'rgba(10, 14, 39, 0.95)',
    cardColor: 'rgba(26, 31, 58, 0.98)',
    modalColor: 'rgba(26, 31, 58, 0.98)',
    popoverColor: 'rgba(26, 31, 58, 0.98)',
    tableColor: 'rgba(26, 31, 58, 0.5)',

    textColorBase: '#ffffff',
    textColor1: 'rgba(255, 255, 255, 0.9)',
    textColor2: 'rgba(255, 255, 255, 0.7)',
    textColor3: 'rgba(255, 255, 255, 0.5)',

    placeholderColor: 'rgba(255, 255, 255, 0.25)',
    placeholderColorDisabled: 'rgba(255, 255, 255, 0.15)',

    borderColor: 'rgba(255, 255, 255, 0.1)',
    dividerColor: 'rgba(255, 255, 255, 0.08)',

    hoverColor: 'rgba(255, 255, 255, 0.08)',
    pressedColor: 'rgba(255, 255, 255, 0.12)',

    inputColor: 'rgba(255, 255, 255, 0.03)',
    inputColorDisabled: 'rgba(255, 255, 255, 0.02)',

    closeIconColor: 'rgba(255, 255, 255, 0.5)',
    closeIconColorHover: 'rgba(255, 255, 255, 0.7)',
    closeIconColorPressed: 'rgba(255, 255, 255, 0.9)',
    closeColorHover: 'rgba(255, 255, 255, 0.08)',
    closeColorPressed: 'rgba(255, 255, 255, 0.12)',
  },

  Button: {
    borderRadiusMedium: '8px',
    borderRadiusSmall: '6px',
    borderRadiusLarge: '10px',
    fontWeightStrong: '500',
    paddingMedium: '8px 16px',
    paddingSmall: '6px 12px',
    paddingLarge: '10px 20px',

    // 深色主题按钮
    textColorPrimary: '#ffffff',
    textColorHoverPrimary: '#ffffff',
    textColorPressedPrimary: '#ffffff',
    textColorFocusPrimary: '#ffffff',

    colorPrimary: 'linear-gradient(135deg, rgba(100, 150, 255, 0.9) 0%, rgba(80, 120, 255, 1) 100%)',
    colorHoverPrimary: 'linear-gradient(135deg, rgba(120, 170, 255, 1) 0%, rgba(100, 140, 255, 1) 100%)',
    colorPressedPrimary: 'linear-gradient(135deg, rgba(80, 130, 255, 1) 0%, rgba(60, 100, 255, 1) 100%)',

    borderPrimary: '1px solid rgba(100, 150, 255, 0.3)',
    borderHoverPrimary: '1px solid rgba(120, 170, 255, 0.5)',
    borderPressedPrimary: '1px solid rgba(80, 130, 255, 0.5)',

    textColor: 'rgba(255, 255, 255, 0.7)',
    textColorHover: 'rgba(255, 255, 255, 0.9)',
    textColorPressed: 'rgba(255, 255, 255, 0.9)',

    color: 'rgba(255, 255, 255, 0.03)',
    colorHover: 'rgba(255, 255, 255, 0.08)',
    colorPressed: 'rgba(255, 255, 255, 0.12)',

    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderHover: '1px solid rgba(255, 255, 255, 0.2)',
    borderPressed: '1px solid rgba(255, 255, 255, 0.2)',
  },

  Card: {
    borderRadius: '12px',
    paddingMedium: '24px',
    paddingSmall: '16px',
    paddingLarge: '32px',

    color: 'rgba(26, 31, 58, 0.98)',
    colorModal: 'rgba(26, 31, 58, 0.98)',
    colorTarget: 'rgba(26, 31, 58, 0.98)',
    colorEmbedded: 'rgba(26, 31, 58, 0.5)',

    textColor: 'rgba(255, 255, 255, 0.9)',
    titleTextColor: '#ffffff',

    borderColor: 'rgba(255, 255, 255, 0.08)',

    closeBorderRadius: '6px',
    closeColorHover: 'rgba(255, 255, 255, 0.08)',
    closeColorPressed: 'rgba(255, 255, 255, 0.12)',
    closeIconColor: 'rgba(255, 255, 255, 0.5)',
    closeIconColorHover: 'rgba(255, 255, 255, 0.7)',
    closeIconColorPressed: 'rgba(255, 255, 255, 0.9)',
  },

  Input: {
    borderRadius: '8px',
    heightMedium: '40px',
    heightSmall: '32px',
    heightLarge: '48px',

    color: 'rgba(255, 255, 255, 0.03)',
    colorDisabled: 'rgba(255, 255, 255, 0.02)',
    colorFocus: 'rgba(255, 255, 255, 0.05)',

    textColor: 'rgba(255, 255, 255, 0.9)',
    textColorDisabled: 'rgba(255, 255, 255, 0.4)',

    placeholderColor: 'rgba(255, 255, 255, 0.25)',
    placeholderColorDisabled: 'rgba(255, 255, 255, 0.15)',

    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderHover: '1px solid rgba(255, 255, 255, 0.2)',
    borderFocus: '1px solid rgba(100, 150, 255, 0.5)',
    borderDisabled: '1px solid rgba(255, 255, 255, 0.08)',

    boxShadowFocus: '0 0 0 2px rgba(100, 150, 255, 0.1)',

    caretColor: 'rgba(100, 150, 255, 1)',
  },

  Form: {
    labelTextColor: 'rgba(255, 255, 255, 0.7)',
    labelFontSizeTopSmall: '14px',
    labelFontSizeTopMedium: '14px',
    labelFontSizeTopLarge: '14px',
    labelFontSizeLeftSmall: '14px',
    labelFontSizeLeftMedium: '14px',
    labelFontSizeLeftLarge: '14px',

    feedbackTextColor: 'rgba(255, 255, 255, 0.7)',
    feedbackTextColorError: '#ff4d4f',
    feedbackTextColorWarning: '#faad14',
  },

  Select: {
    borderRadius: '8px',
    heightMedium: '40px',
    heightSmall: '32px',
    heightLarge: '48px',
  },

  Modal: {
    borderRadius: '12px',
    color: 'rgba(26, 31, 58, 0.98)',
    textColor: 'rgba(255, 255, 255, 0.9)',
    titleTextColor: '#ffffff',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },

  Dialog: {
    borderRadius: '12px',
    color: 'rgba(26, 31, 58, 0.98)',
    textColor: 'rgba(255, 255, 255, 0.9)',
    titleTextColor: '#ffffff',
  },

  Drawer: {
    borderRadius: '12px',
    color: 'rgba(26, 31, 58, 0.98)',
    textColor: 'rgba(255, 255, 255, 0.9)',
    titleTextColor: '#ffffff',
  },

  Message: {
    borderRadius: '8px',
    color: 'rgba(26, 31, 58, 0.98)',
    textColor: 'rgba(255, 255, 255, 0.9)',
  },

  Notification: {
    borderRadius: '12px',
    color: 'rgba(26, 31, 58, 0.98)',
    textColor: 'rgba(255, 255, 255, 0.9)',
    titleTextColor: '#ffffff',
  },

  Tag: {
    borderRadius: '6px',
  },

  Tooltip: {
    borderRadius: '6px',
    color: 'rgba(26, 31, 58, 0.98)',
    textColor: 'rgba(255, 255, 255, 0.9)',
  },
}
