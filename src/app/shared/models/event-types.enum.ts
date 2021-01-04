export enum EventTypes {
  // list of user event type names that we want to track

  // activity taking interactions
  markedForRevisit = 'User marked question for a revisit later',
  navigateForward = 'User navigated forwards',
  navigateBackward = 'User navigated backwards',
  navigateToQuestion = 'User navigated using the map',

  selectedText = 'User selected text',
  highlightText = 'User highlighted text',
  removeHighlighting = 'User removed highlighting',
  strikeThroughAnswerOption = 'User Struck-through an answer option',
  removedStrikethrough = 'UserRemovedStrikethrough',

  calculatorOpened = 'User opened the calculator',
  calculatorClosed = 'User closed the calculator',
  calculationPerformed = 'User used the calculator (pressed the equals key)',

  noteAdded = 'User added a note',
  noteRemoved = 'User removed a note',
  UserModifiedNote = 'User modified note',

  answerOptionSelected = 'User selected an answer option',
  answerOptionUnselected = 'User unselected an answer option',

  securityLockTriggered = 'User triggered the security lock',
  securityUnlocked = 'Security lock removed',
  online = 'User came online',

  changedAnswer = 'User clicked change answer'
}
