export class Modifiers {
  italic: boolean;
  bold: boolean;
  underline: boolean;

  static getActiveModifiers(): string[] {
    const m = new Modifiers();
    m.bold = document.queryCommandState('bold');
    m.italic = document.queryCommandState('italic');
    m.underline = document.queryCommandState('underline');
    return Object.keys(m).filter(k => m[ k ]);
  }
}

export const validCommands = [
  'bold',
  'underline',
  'italic',
  'createLink',
  'insertUnorderedList',
  'insertOrderedList',
  'removeFormat',
];
