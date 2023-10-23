import type { DefaultTheme } from 'styled-components';

export const colors = {
  white: '#FFF',
  black: '#000',
  blue: '#007AFF',
  royalBlue: '#4169E1',
  purple: '#823FE8',
  red: '#FF3B30',
  yellow: '#FFCC00',
  greyWithBlur: '#00000033',
  grey10: '#E5E5E5',
  grey20: '#CCC',
  grey30: '#B3B3B3',
  grey40: '#999',
  grey50: '#808080',
  grey60: '#666',
  grey70: '#4D4D4D',
  grey80: '#333',
  grey90: '#1A1A1A',
};

const radius = {
  small: '6px',
  medium: '10px',
  large: '16px',
  half: '50%',
};

const fontSize = {
  xxSmall: '12px',
  xSmall: '14px',
  small: '16px',
  sMedium: '24px',
  medium: '32px',
  large: '48px',
  xLarge: '64px',
};

const opacity = {
  hover: 0.8,
  press: 0.64,
  disabled: 0.32,
  transparent: 0.04,
};

export const designSystem = {
  color: {
    neutralText: colors.grey90,
    neutralTextWeak: colors.grey80,
    neutralTextStrong: colors.black,
    neutralBackground: colors.grey10,
    neutralBackgroundBold: colors.grey40,
    neutralBorder: colors.grey50,
    neutralBorderStrong: colors.grey70,
    neutralOverlay: colors.greyWithBlur,

    accentText: colors.white,
    accentBorder: colors.white,
    accentBackground: colors.royalBlue,
    accentPrimary: colors.royalBlue,
    accentSecondary: colors.purple,

    systemWarning: colors.red,
    systemBackground: colors.white,
    systemBackgroundWeak: colors.grey10,

    player1: colors.black,
    player2: colors.red,
    player3: colors.blue,
    player4: colors.yellow,
  },
  filter: {
    neutralText:
      'invert(0%) sepia(20%) saturate(7313%) hue-rotate(106deg) brightness(79%) contrast(80%)',
    neutralTextWeak:
      'invert(13%) sepia(0%) saturate(1%) hue-rotate(193deg) brightness(93%) contrast(80%)',
    neutralTextStrong:
      'invert(0%) sepia(93%) saturate(0%) hue-rotate(235deg) brightness(107%) contrast(107%)',
    neutralBackground:
      'invert(100%) sepia(3%) saturate(758%) hue-rotate(270deg) brightness(116%) contrast(80%)',
    neutralBackgroundBold:
      'invert(81%) sepia(0%) saturate(37%) hue-rotate(298deg) brightness(74%) contrast(104%)',
    neutralBorder:
      'invert(58%) sepia(0%) saturate(623%) hue-rotate(256deg) brightness(87%) contrast(76%)',
    neutralBorderStrong:
      'invert(29%) sepia(1%) saturate(0%) hue-rotate(135deg) brightness(92%) contrast(84%)',
    neutralOverlay: '',

    accentText:
      'invert(100%) sepia(100%) saturate(2%) hue-rotate(93deg) brightness(103%) contrast(101%)',
    accentBorder:
      'invert(100%) sepia(100%) saturate(2%) hue-rotate(93deg) brightness(103%) contrast(101%)',
    accentBackground:
      'invert(40%) sepia(13%) saturate(6951%) hue-rotate(209deg) brightness(90%) contrast(96%)',
    accentPrimary:
      'invert(40%) sepia(13%) saturate(6951%) hue-rotate(209deg) brightness(90%) contrast(96%)',
    accentSecondary:
      'invert(33%) sepia(84%) saturate(4403%) hue-rotate(252deg) brightness(92%) contrast(98%)',

    systemWarning:
      'invert(29%) sepia(64%) saturate(2063%) hue-rotate(339deg) brightness(108%) contrast(108%)',
    systemBackground:
      'invert(100%) sepia(100%) saturate(2%) hue-rotate(93deg) brightness(103%) contrast(101%)',
    systemBackgroundWeak:
      'invert(100%) sepia(3%) saturate(758%) hue-rotate(270deg) brightness(116%) contrast(80%)',
  },
  fontSize,
  opacity,
  radius,
};

export const theme: DefaultTheme = {
  ...designSystem,
};
