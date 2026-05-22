import { TFontColor } from "@core/settings";

const Colors = {
  root: {
    text: 'rgb(255, 255, 255)',
    placeholder: "rgb(235, 235, 235)",
    errorTitle: 'rgb(119, 0, 0)',
    errorMessage: 'rgb(59, 21, 21)',
  },
  default: {
    main: 'rgb(0, 68, 79)',
    buttonInput: 'rgb(0, 57, 66)',
    textInput: 'rgb(0, 100, 107)',
    activityIndicator: 'rgb(0, 197, 181)',
    posBackround: ' rgb(0, 72, 83)',
    examplesBackround: '  rgb(0, 88, 101)',
    buttonDisabled: 'rgb(110, 110, 110)',
    textDisabled: 'rgb(145, 145, 145)',
    cursor: 'rgb(0, 197, 181)',
  },
  modal: {
    canvas: 'rgba(0, 0, 0, 0.214)',
    second: 'rgb(46, 140, 131)',
    input: 'rgb(229, 229, 229)',
    cursor: 'rgb(29, 122, 113)',
    text: 'rgb(0, 0, 0)',
    placeholder: "rgb(56, 56, 56)",
  },
}

export const textColors: Record<TFontColor, string> = {
  White: 'rgb(255, 255, 255)',
  Black: 'rgb(0, 0, 0)',
  Blue: 'rgb(0, 3, 96)',
  Pink: 'rgb(255, 192, 203)',
};

export type TColors = typeof Colors;

export default Colors;
