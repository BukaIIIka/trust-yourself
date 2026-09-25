/* stage 2 content: a decision tree. Each node is a question whose answers
   point at the next node id, or 'END'. Stage 3 reads the walk as
   'node.answer' ids (see AnchorRules), so wording and order can change
   as long as the answer ids stay. */

/* stage 3 lines: the suggested thought and an alternative wording */
export var Anchors = {
  A01: "I can take the next step without solving everything that comes after it.",
  A02: "I can look for a specific answer without needing certainty about everything.",
  A03: "I can address what happened without blaming myself over and over.",
  A04: "I can choose a time for this step and leave it for now.",
  A05: "I can take a small step while I still feel unsure.",
  A06: "I can leave this open until there's more information.",
  A07: "I can choose when to revisit this without solving it now.",
  A08: "I can take one lesson forward without replaying the whole situation.",
  A09: "I can leave this for now without finding a lesson.",
  A10: "I can speak to myself with the care I'd offer a friend.",
  A11: "I can take a small step while I still feel upset.",
  A12: "I can let the urge to check be there while I do something else.",
  A13: "The thought can stay while I do something else.",
  A14: "I can take a pause without solving this first.",
  A15: "I can leave myself a reminder and return to this later.",
  A16: "I don't have to work out the next step alone.",
  A17: "I don't need to force a takeaway right now.",
};

/* which anchor a walk leads to: its last answer, refined by any earlier
   answer listed in `after`. First match wins. "Finish here" answers
   (id 'finish') have no rule: they skip anchoring, and A17 is offered
   only if the person asks for it. */
export var AnchorRules = [
  { last: ['release_action.now'], after: ['checking_1.not_checked', 'checking_1.changed'], anchor: 'A02' },
  { last: ['release_action.now'], after: ['judge_1.put_right'], anchor: 'A03' },
  { last: ['release_action.now'], anchor: 'A01' },
  { last: ['release_action.later'], anchor: 'A04' },
  { last: ['release_uncertainty.small_task'], after: ['certainty_2.unavailable'], anchor: 'A06' },
  { last: ['release_uncertainty.small_task'], anchor: 'A05' },
  { last: ['release_uncertainty.revisit'], anchor: 'A07' },
  { last: ['release_past.write_down'], anchor: 'A08' },
  { last: ['release_past.back_to_day'], anchor: 'A09' },
  { last: ['release_self_compassion.friend'], anchor: 'A10' },
  { last: ['release_self_compassion.small_task'], anchor: 'A11' },
  { last: ['release_checking.back_to_task', 'release_checking.other_activity'], anchor: 'A12' },
  { last: ['release_meta.back_to_task', 'release_meta.simple_activity'], anchor: 'A13' },
  { last: ['release_pause.look_around'], anchor: 'A14' },
  { last: ['release_pause.write_line'], anchor: 'A15' },
  { last: ['release_pause.ask_someone'], anchor: 'A16' },
];

export var Questions = new Map([
  [
    'root',
    {
      question: 'What feels closest right now?',
      answers: [
        {
          id: 'stuck',
          text: "I'm stuck on a problem.",
          next_option: 'solve_1',
        },
        {
          id: 'definite_answer',
          text: 'I keep looking for a definite answer.',
          next_option: 'certainty_1',
        },
        {
          id: 'replaying',
          text: 'I keep replaying something that happened.',
          next_option: 'past_1',
        },
        {
          id: 'blaming',
          text: 'I keep blaming myself.',
          next_option: 'judge_1',
        },
        {
          id: 'cant_stop',
          text: "I can't stop thinking about it.",
          next_option: 'meta_1',
        },
        {
          id: 'not_sure',
          text: "I'm not sure which one fits.",
          next_option: 'release_pause',
        },
      ],
    },
  ],

  // -------------------------
  // SOLVING A PROBLEM
  // -------------------------

  [
    'solve_1',
    {
      question: 'Do you have a next step in mind?',
      answers: [
        {
          id: 'has_step',
          text: 'Yes, I know one thing I could do.',
          next_option: 'solve_2',
        },
        {
          id: 'need_fact',
          text: 'Not yet. I need one specific fact first.',
          next_option: 'certainty_2',
        },
        {
          id: 'no_start',
          text: "No, I don't know where to start.",
          next_option: 'release_pause',
        },
      ],
    },
  ],

  [
    'solve_2',
    {
      question: 'What would that step involve?',
      answers: [
        {
          id: 'change',
          text: 'Changing something or trying a solution.',
          next_option: 'release_action',
        },
        {
          id: 'look_up',
          text: 'Looking something up, checking, or asking for an answer.',
          next_option: 'checking_1',
        },
        {
          id: 'not_sure',
          text: "I'm not sure yet.",
          next_option: 'release_pause',
        },
      ],
    },
  ],

  // -------------------------
  // LOOKING FOR AN ANSWER
  // -------------------------

  [
    'certainty_1',
    {
      question: 'What are you looking for?',
      answers: [
        {
          id: 'fact',
          text: 'One specific fact.',
          next_option: 'certainty_2',
        },
        {
          id: 'feel_sure',
          text: 'The feeling of being completely sure.',
          next_option: 'release_uncertainty',
        },
        {
          id: 'recheck',
          text: 'Another check of an answer I already have.',
          next_option: 'checking_1',
        },
        {
          id: 'not_sure',
          text: "I'm not sure.",
          next_option: 'release_pause',
        },
      ],
    },
  ],

  [
    'certainty_2',
    {
      question: 'Can you get that information right now?',
      answers: [
        {
          id: 'available',
          text: 'Yes, I know where to look or whom to ask.',
          next_option: 'checking_1',
        },
        {
          id: 'unavailable',
          text: "No, it isn't available right now.",
          next_option: 'release_uncertainty',
        },
        {
          id: 'not_sure',
          text: "I'm not sure where to look.",
          next_option: 'release_pause',
        },
      ],
    },
  ],

  // -------------------------
  // REPLAYING THE PAST
  // -------------------------

  [
    'past_1',
    {
      question: 'Can you do anything useful about what happened?',
      answers: [
        {
          id: 'has_step',
          text: 'Yes, I know a step I could take.',
          next_option: 'solve_2',
        },
        {
          id: 'lesson',
          text: 'I can keep one lesson for next time.',
          next_option: 'release_past',
        },
        {
          id: 'not_now',
          text: 'Not right now.',
          next_option: 'release_past',
        },
        {
          id: 'not_sure',
          text: "I'm not sure.",
          next_option: 'release_pause',
        },
      ],
    },
  ],

  // -------------------------
  // SELF-CRITICISM
  // -------------------------

  [
    'judge_1',
    {
      question: 'What would be helpful right now?',
      answers: [
        {
          id: 'put_right',
          text: 'Finding a step to put something right.',
          next_option: 'solve_1',
        },
        {
          id: 'lesson',
          text: 'Keeping one lesson for next time.',
          next_option: 'release_past',
        },
        {
          id: 'kinder',
          text: 'Being a little kinder to myself.',
          next_option: 'release_self_compassion',
        },
        {
          id: 'not_sure',
          text: "I'm not sure.",
          next_option: 'release_pause',
        },
      ],
    },
  ],

  // -------------------------
  // CHECKING
  // -------------------------

  [
    'checking_1',
    {
      question: 'What is the reason for this check?',
      answers: [
        {
          id: 'not_checked',
          text: "I haven't checked this information yet.",
          next_option: 'release_action',
        },
        {
          id: 'changed',
          text: 'Something has changed, or this check is required.',
          next_option: 'release_action',
        },
        {
          id: 'reassurance',
          text: 'I have the answer, but I want to feel sure again.',
          next_option: 'release_checking',
        },
        {
          id: 'not_sure',
          text: "I'm not sure.",
          next_option: 'release_pause',
        },
      ],
    },
  ],

  // -------------------------
  // DIFFICULTY DISENGAGING
  // -------------------------

  [
    'meta_1',
    {
      question: 'What feels manageable right now?',
      answers: [
        {
          id: 'simple_thing',
          text: 'Doing one simple thing while the thought is still there.',
          next_option: 'release_meta',
        },
        {
          id: 'pause',
          text: 'Just taking a pause.',
          next_option: 'release_pause',
        },
        {
          id: 'not_sure',
          text: "I'm not sure.",
          next_option: 'release_pause',
        },
      ],
    },
  ],

  // -------------------------
  // RELEASE NODES
  //
  // END is a terminal marker, not a question node.
  // Keep the release node ID and the selected answer for stage 3.
  // "Finish here" should close the flow without starting an exercise.
  // -------------------------

  [
    'release_action',
    {
      question: 'When would you like to take that one step?',
      answers: [
        {
          id: 'now',
          text: "Now. I'll focus on just that step.",
          next_option: 'END',
        },
        {
          id: 'later',
          text: "Later. I'll choose a time for it.",
          next_option: 'END',
        },
        {
          id: 'finish',
          text: "I don't want to decide right now. Finish here.",
          next_option: 'END',
        },
      ],
    },
  ],

  [
    'release_uncertainty',
    {
      question: 'What would you like to do while you feel unsure?',
      answers: [
        {
          id: 'small_task',
          text: 'Return to one small task, even without a definite answer.',
          next_option: 'END',
        },
        {
          id: 'revisit',
          text: 'Choose when to revisit this, then leave it for now.',
          next_option: 'END',
        },
        {
          id: 'finish',
          text: 'Nothing else right now. Finish here.',
          next_option: 'END',
        },
      ],
    },
  ],

  [
    'release_past',
    {
      question: 'What would you like to do now?',
      answers: [
        {
          id: 'write_down',
          text: 'Write down one thing to try next time.',
          next_option: 'END',
        },
        {
          id: 'back_to_day',
          text: 'Return to my day, even without a clear lesson.',
          next_option: 'END',
        },
        {
          id: 'finish',
          text: 'Just finish here for now.',
          next_option: 'END',
        },
      ],
    },
  ],

  [
    'release_self_compassion',
    {
      question: 'What would you like to try now?',
      answers: [
        {
          id: 'friend',
          text: "Write one sentence I'd say to a friend in this situation.",
          next_option: 'END',
        },
        {
          id: 'small_task',
          text: 'Return to a small task, even if I still feel upset.',
          next_option: 'END',
        },
        {
          id: 'finish',
          text: 'Nothing else right now. Finish here.',
          next_option: 'END',
        },
      ],
    },
  ],

  [
    'release_checking',
    {
      question: 'What would you like to do instead of checking again?',
      answers: [
        {
          id: 'back_to_task',
          text: 'Return to what I was doing for a few minutes.',
          next_option: 'END',
        },
        {
          id: 'other_activity',
          text: 'Choose another small activity for a few minutes.',
          next_option: 'END',
        },
        {
          id: 'finish',
          text: "I'm not ready to try that. Finish here.",
          next_option: 'END',
        },
      ],
    },
  ],

  [
    'release_meta',
    {
      question: 'What could you do while the thought is still there?',
      answers: [
        {
          id: 'back_to_task',
          text: 'Return to one small part of what I was doing.',
          next_option: 'END',
        },
        {
          id: 'simple_activity',
          text: 'Try a simple activity, like washing a cup.',
          next_option: 'END',
        },
        {
          id: 'finish',
          text: 'Nothing right now. Finish here.',
          next_option: 'END',
        },
      ],
    },
  ],

  [
    'release_pause',
    {
      question: 'What would help you step away for a moment?',
      answers: [
        {
          id: 'look_around',
          text: 'Look around and notice three things I can see.',
          next_option: 'END',
        },
        {
          id: 'write_line',
          text: 'Write one line about the issue and choose when to return to it.',
          next_option: 'END',
        },
        {
          id: 'ask_someone',
          text: 'Ask someone to help me choose one practical next step.',
          next_option: 'END',
        },
        {
          id: 'finish',
          text: 'Nothing else right now. Finish here.',
          next_option: 'END',
        },
      ],
    },
  ],
]);
