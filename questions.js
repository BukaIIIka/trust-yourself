/* stage 2 content: a decision tree. Each node is a question whose answers
   point at the next node id, or 'END'. Stage 3 reads the walk as
   'node.answer' ids (see AnchorRules), so wording and order can change
   as long as the answer ids stay. */

/* stage 3 lines: the suggested thought to keep or edit */
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
  A18: "I can return to what's here now without knowing how this will turn out.",
};

/* which anchor a walk leads to: its last answer, refined by any earlier
   answer listed in `after`. First match wins. "Finish here" answers
   (id 'finish') have no rule: they skip anchoring, and A17 is offered
   only if the person asks for it. */
export var AnchorRules = [
  { last: ['release_action.now'], after: ['checking_1.new_info', 'checking_1.changed'], anchor: 'A02' },
  { last: ['release_action.now'], after: ['judge_1.put_right'], anchor: 'A03' },
  { last: ['release_action.now'], anchor: 'A01' },
  { last: ['release_action.later'], anchor: 'A04' },
  { last: ['release_uncertainty.small_task'], after: ['certainty_2.unavailable'], anchor: 'A06' },
  { last: ['release_uncertainty.small_task'], anchor: 'A05' },
  { last: ['release_uncertainty.revisit'], anchor: 'A07' },
  { last: ['release_uncertainty.leave_unknown'], anchor: 'A06' },
  { last: ['release_future.present', 'release_future.small_task'], anchor: 'A18' },
  { last: ['release_future.wait'], anchor: 'A06' },
  { last: ['release_past.write_down', 'release_past.keep_lesson'], anchor: 'A08' },
  { last: ['release_past.back_to_day'], anchor: 'A09' },
  { last: ['release_self_compassion.name_regret'], anchor: 'A03' },
  { last: ['release_self_compassion.friend'], anchor: 'A10' },
  { last: ['release_self_compassion.small_task'], anchor: 'A11' },
  { last: ['release_checking.back_to_task', 'release_checking.other_activity', 'release_checking.wait'], anchor: 'A12' },
  { last: ['release_meta.back_to_task', 'release_meta.simple_activity', 'release_meta.let_thought_be'], anchor: 'A13' },
  { last: ['release_pause.look_around', 'release_pause.feel_supported'], anchor: 'A14' },
  { last: ['release_pause.write_line'], anchor: 'A15' },
  { last: ['release_pause.ask_someone'], anchor: 'A16' },
];

export var Questions = new Map([
  [
    'root',
    {
      question: "What is your mind trying to do right now?",
      answers: [
        {
          id: 'solve',
          text: "Figure out what I should do.",
          next_option: 'solve_1',
        },
        {
          id: 'future_worry',
          text: "Figure out what is going to happen.",
          next_option: 'future_1',
        },
        {
          id: 'replaying',
          text: "Go over what already happened.",
          next_option: 'past_1',
        },
        {
          id: 'blaming',
          text: "Judge myself for what happened.",
          next_option: 'judge_1',
        },
        {
          id: 'checking',
          text: "Check something again to feel more certain.",
          next_option: 'checking_1',
        },
        {
          id: 'cant_stop',
          text: "The thoughts just keep going.",
          next_option: 'meta_1',
        },
        {
          id: 'body_activated',
          text: "My body feels too activated to think clearly.",
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

  [
    'solve_1',
    {
      question: "Do you already know one concrete next step?",
      answers: [
        {
          id: 'has_step',
          text: "Yes. I know one concrete thing I could do.",
          next_option: 'solve_2',
        },
        {
          id: 'need_fact',
          text: "Not yet. I need one specific fact first.",
          next_option: 'certainty_value',
        },
        {
          id: 'circles',
          text: "No. I'm going in circles.",
          next_option: 'meta_1',
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
    'solve_2',
    {
      question: "What would that next step involve?",
      answers: [
        {
          id: 'change',
          text: "Change something, repair something, or try a solution.",
          next_option: 'release_action',
        },
        {
          id: 'get_information',
          text: "Get information I need to make a decision.",
          next_option: 'certainty_value',
        },
        {
          id: 'reassurance_check',
          text: "Check something to feel more sure.",
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

  [
    'future_1',
    {
      question: "Can anything you do now change the actual situation?",
      answers: [
        {
          id: 'has_step',
          text: "Yes. There is one concrete thing I can do.",
          next_option: 'solve_2',
        },
        {
          id: 'need_fact',
          text: "Maybe. I need one specific piece of information.",
          next_option: 'future_info',
        },
        {
          id: 'predicting',
          text: "No. I'm trying to predict what will happen.",
          next_option: 'release_uncertainty',
        },
        {
          id: 'worst_cases',
          text: "I keep going through worse and worse possibilities.",
          next_option: 'release_future',
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
    'future_info',
    {
      question: "Do you need one specific piece of information before you can act?",
      answers: [
        {
          id: 'needed_fact',
          text: "Yes. One fact would help me decide what to do.",
          next_option: 'certainty_value',
        },
        {
          id: 'outcome',
          text: "No. I mostly want to know how this will turn out.",
          next_option: 'release_uncertainty',
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
    'certainty_1',
    {
      question: "What are you trying to get from more thinking?",
      answers: [
        {
          id: 'fact',
          text: "One specific fact I don't have yet.",
          next_option: 'certainty_value',
        },
        {
          id: 'predict',
          text: "To know for sure what will happen.",
          next_option: 'release_uncertainty',
        },
        {
          id: 'prevent_bad',
          text: "To feel certain that nothing bad will happen.",
          next_option: 'release_uncertainty',
        },
        {
          id: 'recheck',
          text: "Another confirmation of something I already know.",
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
    'certainty_value',
    {
      question: "Would knowing this change what you actually do next?",
      answers: [
        {
          id: 'useful',
          text: "Yes. It would change what I do next.",
          next_option: 'certainty_2',
        },
        {
          id: 'reassurance',
          text: "No. I mostly want to feel more certain.",
          next_option: 'release_uncertainty',
        },
        {
          id: 'enough',
          text: "I already have enough information to act.",
          next_option: 'release_action',
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
      question: "Can you get that information right now?",
      answers: [
        {
          id: 'available',
          text: "Yes. I know where to get it.",
          next_option: 'checking_1',
        },
        {
          id: 'unavailable',
          text: "No. That information isn't available right now.",
          next_option: 'release_uncertainty',
        },
        {
          id: 'speculate',
          text: "I could only guess or ask someone what they think.",
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

  [
    'past_1',
    {
      question: "Is there anything you can change, repair, or do differently now?",
      answers: [
        {
          id: 'has_step',
          text: "Yes. There is something concrete I can do now.",
          next_option: 'solve_2',
        },
        {
          id: 'lesson',
          text: "No, but one lesson is already clear.",
          next_option: 'release_past',
        },
        {
          id: 'replaying',
          text: "No. I'm mostly replaying it.",
          next_option: 'release_past',
        },
        {
          id: 'why',
          text: "I'm still trying to understand why I did it.",
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

  [
    'judge_1',
    {
      question: "Is there something specific you need to take responsibility for?",
      answers: [
        {
          id: 'put_right',
          text: "Yes. There is something I can repair or do.",
          next_option: 'solve_1',
        },
        {
          id: 'cannot_change',
          text: "Yes, but I can't change it now.",
          next_option: 'release_past',
        },
        {
          id: 'lesson',
          text: "I've already understood what I'd do differently.",
          next_option: 'release_self_compassion',
        },
        {
          id: 'judging',
          text: "No. I'm mostly judging myself again.",
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

  [
    'checking_1',
    {
      question: "What would this check give you?",
      answers: [
        {
          id: 'new_info',
          text: "New information I need to make a decision.",
          next_option: 'release_action',
        },
        {
          id: 'changed',
          text: "Something has changed, so I need updated information.",
          next_option: 'release_action',
        },
        {
          id: 'reassurance',
          text: "I already have the answer, but I want to feel sure again.",
          next_option: 'release_checking',
        },
        {
          id: 'reassurance_from_other',
          text: "I want someone else to tell me the bad outcome won't happen.",
          next_option: 'release_checking',
        },
        {
          id: 'idle_check',
          text: "I want to see whether anything has changed, even though I don't expect new information.",
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

  [
    'meta_1',
    {
      question: "Does it feel like you need to resolve this thought before you can do anything else?",
      answers: [
        {
          id: 'need_resolution',
          text: "Yes. It feels like I can't move on until I solve it.",
          next_option: 'release_meta',
        },
        {
          id: 'small_step',
          text: "Maybe not. I could do something small while it's still here.",
          next_option: 'release_meta',
        },
        {
          id: 'not_sure',
          text: "I can't tell right now.",
          next_option: 'release_pause',
        },
      ],
    },
  ],

  [
    'release_action',
    {
      question: "When will you take that one step?",
      answers: [
        {
          id: 'now',
          text: "Now. I'll do only that one step.",
          next_option: 'END',
        },
        {
          id: 'later',
          text: "Later. I'll choose a specific time for it.",
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
      question: "What can you do while the answer is still unknown?",
      answers: [
        {
          id: 'small_task',
          text: "Return to one small task without knowing the answer yet.",
          next_option: 'END',
        },
        {
          id: 'revisit',
          text: "Choose when to revisit this if new information appears.",
          next_option: 'END',
        },
        {
          id: 'leave_unknown',
          text: "Let the answer stay unknown for now.",
          next_option: 'END',
        },
        {
          id: 'finish',
          text: "Nothing else right now. Finish here.",
          next_option: 'END',
        },
      ],
    },
  ],

  [
    'release_future',
    {
      question: "What can you do without solving the future first?",
      answers: [
        {
          id: 'present',
          text: "Return to what is actually happening right now.",
          next_option: 'END',
        },
        {
          id: 'small_task',
          text: "Do one small thing that matters today.",
          next_option: 'END',
        },
        {
          id: 'wait',
          text: "Wait for new information instead of predicting it.",
          next_option: 'END',
        },
        {
          id: 'finish',
          text: "Nothing else right now. Finish here.",
          next_option: 'END',
        },
      ],
    },
  ],

  [
    'release_past',
    {
      question: "What would help you leave the past where it is for now?",
      answers: [
        {
          id: 'write_down',
          text: "If one lesson is already clear, write it in one sentence.",
          next_option: 'END',
        },
        {
          id: 'keep_lesson',
          text: "Keep the lesson I already have without looking for a better one.",
          next_option: 'END',
        },
        {
          id: 'back_to_day',
          text: "Return to my day even without fully understanding what happened.",
          next_option: 'END',
        },
        {
          id: 'finish',
          text: "Just finish here for now.",
          next_option: 'END',
        },
      ],
    },
  ],

  [
    'release_self_compassion',
    {
      question: "What would be a fairer way to respond to yourself right now?",
      answers: [
        {
          id: 'name_regret',
          text: "Name what I regret without turning it into a judgment about who I am.",
          next_option: 'END',
        },
        {
          id: 'friend',
          text: "Say one sentence I'd say to someone I care about in this situation.",
          next_option: 'END',
        },
        {
          id: 'small_task',
          text: "Return to something small even if I still feel upset.",
          next_option: 'END',
        },
        {
          id: 'finish',
          text: "Nothing else right now. Finish here.",
          next_option: 'END',
        },
      ],
    },
  ],

  [
    'release_checking',
    {
      question: "What could you do instead of checking for certainty again?",
      answers: [
        {
          id: 'back_to_task',
          text: "Return to what I was doing without checking again.",
          next_option: 'END',
        },
        {
          id: 'other_activity',
          text: "Choose another small activity for a few minutes.",
          next_option: 'END',
        },
        {
          id: 'wait',
          text: "Wait until there is genuinely new information.",
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
      question: "What could you do while the thought is still there?",
      answers: [
        {
          id: 'back_to_task',
          text: "Return to one small part of what I was doing while the thought stays.",
          next_option: 'END',
        },
        {
          id: 'simple_activity',
          text: "Do one simple physical task without trying to solve the thought.",
          next_option: 'END',
        },
        {
          id: 'let_thought_be',
          text: "Let the thought be there without answering it right now.",
          next_option: 'END',
        },
        {
          id: 'finish',
          text: "Nothing right now. Finish here.",
          next_option: 'END',
        },
      ],
    },
  ],

  [
    'release_pause',
    {
      question: "What feels manageable right now?",
      answers: [
        {
          id: 'look_around',
          text: "Look around and notice three things I can see.",
          next_option: 'END',
        },
        {
          id: 'feel_supported',
          text: "Feel my feet or body supported by the floor or chair.",
          next_option: 'END',
        },
        {
          id: 'write_line',
          text: "Write one line about the issue and leave it there for now.",
          next_option: 'END',
        },
        {
          id: 'ask_someone',
          text: "Ask someone to help me choose one practical action — not predict the outcome.",
          next_option: 'END',
        },
        {
          id: 'finish',
          text: "Nothing else right now. Finish here.",
          next_option: 'END',
        },
      ],
    },
  ],

]);
