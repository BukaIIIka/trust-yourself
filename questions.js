/* stage 2 content: a decision tree. Each node is a question whose answers
   point at the next node id, or 'END'. Release nodes carry a `release` type
   that stage 3 uses to pick the phrase. */

export var ReleasePhrases = {
  action: "I know my next step. I don't need to solve what comes after it yet.",
  uncertainty: "I don't have new information right now. This can remain unknown for now.",
  past: "I've taken what I can learn from this. I don't need to replay it again.",
  self_criticism: "I can keep the lesson without continuing to punish myself.",
  checking: "Another check may bring relief, but I don't need to follow the urge right now.",
  meta: "The thought can still be here. I don't have to keep answering it.",
};

/* branch prefix of a node id → the release type that branch leans toward */
export var BranchRelease = {
  solve: 'action',
  certainty: 'uncertainty',
  past: 'past',
  judge: 'self_criticism',
  checking: 'checking',
  meta: 'meta',
};

export var Questions = new Map([
  [
    'root',
    {
      question: "Which sentence describes you best right now?",
      answers: [
        {
          text: "I'm trying to solve a problem, but I can't find the right solution.",
          next_option: 'solve_1',
        },
        {
          text: "I'm trying to understand for sure what happened or what will happen.",
          next_option: 'certainty_1',
        },
        {
          text: "I keep going back to something I did or didn't do.",
          next_option: 'past_1',
        },
        {
          text: "I'm judging myself for a decision I made.",
          next_option: 'judge_1',
        },
        {
          text: "I know thinking isn't helping, but I can't seem to stop.",
          next_option: 'meta_1',
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
      question: "If you kept thinking about this for another 10 minutes, do you feel it would give you something new?",
      answers: [
        {
          text: "Yes, probably.",
          next_option: 'solve_2',
        },
        {
          text: "Not really.",
          next_option: 'loop_1',
        },
        {
          text: "I'm not sure.",
          next_option: 'solve_2',
        },
      ],
    },
  ],

  [
    'solve_2',
    {
      question: "Is there one concrete action you can take that could actually change the situation?",
      answers: [
        {
          text: "Yes.",
          next_option: 'solve_3',
        },
        {
          text: "No.",
          next_option: 'certainty_2',
        },
        {
          text: "I'm not sure.",
          next_option: 'certainty_2',
        },
      ],
    },
  ],

  [
    'solve_3',
    {
      question: "Would that action change something in reality, or mostly make you feel safer for a moment?",
      answers: [
        {
          text: "It could actually change something.",
          next_option: 'solve_4',
        },
        {
          text: "It would mostly make me feel safer.",
          next_option: 'checking_1',
        },
        {
          text: "I'm not sure.",
          next_option: 'solve_4',
        },
      ],
    },
  ],

  [
    'solve_4',
    {
      question: "Can you decide on that one next step without solving everything that comes after it?",
      answers: [
        {
          text: "Yes.",
          next_option: 'release_action',
        },
        {
          text: "I still feel I need to know what happens next.",
          next_option: 'certainty_1',
        },
      ],
    },
  ],

  // -------------------------
  // UNCERTAINTY / FUTURE WORRY
  // -------------------------

  [
    'certainty_1',
    {
      question: "Are you looking for new information, or for certainty about something you can't fully know yet?",
      answers: [
        {
          text: "I think there is still information I can get.",
          next_option: 'certainty_2',
        },
        {
          text: "I'm mostly looking for certainty.",
          next_option: 'certainty_3',
        },
        {
          text: "I'm not sure.",
          next_option: 'certainty_2',
        },
      ],
    },
  ],

  [
    'certainty_2',
    {
      question: "Has any genuinely new information appeared since you started thinking about this?",
      answers: [
        {
          text: "Yes.",
          next_option: 'solve_2',
        },
        {
          text: "No.",
          next_option: 'certainty_3',
        },
      ],
    },
  ],

  [
    'certainty_3',
    {
      question: "If no new information appeared, what is your mind trying to get by continuing to think?",
      answers: [
        {
          text: "A feeling that I finally understand what will happen.",
          next_option: 'certainty_4',
        },
        {
          text: "A feeling that I'm prepared for the worst.",
          next_option: 'certainty_4',
        },
        {
          text: "I don't really know.",
          next_option: 'certainty_4',
        },
      ],
    },
  ],

  [
    'certainty_4',
    {
      question: "Does this situation actually need to be fully known right now?",
      answers: [
        {
          text: "Yes, I need to act now.",
          next_option: 'solve_2',
        },
        {
          text: "Not really.",
          next_option: 'certainty_5',
        },
        {
          text: "I'm not sure.",
          next_option: 'certainty_5',
        },
      ],
    },
  ],

  [
    'certainty_5',
    {
      question: "Could you let part of this situation remain unknown for now?",
      answers: [
        {
          text: "Yes.",
          next_option: 'release_uncertainty',
        },
        {
          text: "Maybe.",
          next_option: 'release_uncertainty',
        },
        {
          text: "Not yet.",
          next_option: 'meta_1',
        },
      ],
    },
  ],

  // -------------------------
  // PAST RUMINATION
  // -------------------------

  [
    'past_1',
    {
      question: "When you go back over what happened, are you discovering something new or repeating what you already know?",
      answers: [
        {
          text: "I'm still discovering something useful.",
          next_option: 'past_2',
        },
        {
          text: "I'm mostly repeating what I already know.",
          next_option: 'loop_1',
        },
        {
          text: "I'm not sure.",
          next_option: 'past_2',
        },
      ],
    },
  ],

  [
    'past_2',
    {
      question: "Have you already taken one useful lesson from what happened?",
      answers: [
        {
          text: "Yes.",
          next_option: 'past_3',
        },
        {
          text: "Not yet.",
          next_option: 'past_4',
        },
      ],
    },
  ],

  [
    'past_3',
    {
      question: "Is there anything more to learn right now, or has reflection started turning into repetition?",
      answers: [
        {
          text: "There is something genuinely new to learn.",
          next_option: 'past_4',
        },
        {
          text: "It's mostly repetition now.",
          next_option: 'release_past',
        },
      ],
    },
  ],

  [
    'past_4',
    {
      question: "Can you name one thing you would like to do differently next time, without needing to solve the whole past?",
      answers: [
        {
          text: "Yes.",
          next_option: 'release_past',
        },
        {
          text: "I keep coming back to what I should have done.",
          next_option: 'judge_1',
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
      question: "Are you trying to understand your decision, or are you punishing yourself for having made it?",
      answers: [
        {
          text: "I'm trying to understand it.",
          next_option: 'judge_2',
        },
        {
          text: "I'm mostly judging or punishing myself.",
          next_option: 'judge_3',
        },
        {
          text: "Both.",
          next_option: 'judge_2',
        },
      ],
    },
  ],

  [
    'judge_2',
    {
      question: "Are you judging your past decision using information you only learned later?",
      answers: [
        {
          text: "Yes.",
          next_option: 'judge_3',
        },
        {
          text: "No.",
          next_option: 'judge_4',
        },
        {
          text: "Maybe.",
          next_option: 'judge_3',
        },
      ],
    },
  ],

  [
    'judge_3',
    {
      question: "What could you realistically know at that moment, before you knew how things would turn out?",
      answers: [
        {
          text: "I had less information than I have now.",
          next_option: 'judge_4',
        },
        {
          text: "I think I still should have known better.",
          next_option: 'judge_4',
        },
      ],
    },
  ],

  [
    'judge_4',
    {
      question: "If you stopped punishing yourself for it, would there still be something useful left to learn?",
      answers: [
        {
          text: "Yes.",
          next_option: 'judge_5',
        },
        {
          text: "No.",
          next_option: 'release_self_compassion',
        },
        {
          text: "I'm not sure.",
          next_option: 'judge_5',
        },
      ],
    },
  ],

  [
    'judge_5',
    {
      question: "Can you take one lesson from this without continuing to punish yourself for it?",
      answers: [
        {
          text: "Yes.",
          next_option: 'release_self_compassion',
        },
        {
          text: "Not yet.",
          next_option: 'meta_1',
        },
      ],
    },
  ],

  // -------------------------
  // CHECKING / REASSURANCE
  // -------------------------

  [
    'checking_1',
    {
      question: "Have you already checked, replayed, searched, or asked for reassurance about this?",
      answers: [
        {
          text: "Yes.",
          next_option: 'checking_2',
        },
        {
          text: "No.",
          next_option: 'certainty_3',
        },
      ],
    },
  ],

  [
    'checking_2',
    {
      question: "Did the last check give you lasting clarity, or did you soon feel the need to check again?",
      answers: [
        {
          text: "The clarity lasted.",
          next_option: 'solve_2',
        },
        {
          text: "I wanted to check again.",
          next_option: 'checking_3',
        },
      ],
    },
  ],

  [
    'checking_3',
    {
      question: "Would checking again give you genuinely new information, or mostly temporary relief?",
      answers: [
        {
          text: "Genuinely new information.",
          next_option: 'solve_2',
        },
        {
          text: "Mostly temporary relief.",
          next_option: 'checking_4',
        },
        {
          text: "I'm not sure.",
          next_option: 'checking_4',
        },
      ],
    },
  ],

  [
    'checking_4',
    {
      question: "Could another check be part of the loop rather than the way out of it?",
      answers: [
        {
          text: "That feels true.",
          next_option: 'release_checking',
        },
        {
          text: "I'm not convinced.",
          next_option: 'certainty_5',
        },
      ],
    },
  ],

  // -------------------------
  // META-WORRY / CAN'T STOP
  // -------------------------

  [
    'meta_1',
    {
      question: "What feels harder right now: the situation itself, or the fact that your mind won't let it go?",
      answers: [
        {
          text: "The situation itself.",
          next_option: 'certainty_1',
        },
        {
          text: "The fact that I can't stop thinking.",
          next_option: 'meta_2',
        },
        {
          text: "Both.",
          next_option: 'meta_2',
        },
      ],
    },
  ],

  [
    'meta_2',
    {
      question: "Does the thought need to disappear before you can stop responding to it?",
      answers: [
        {
          text: "It feels like it does.",
          next_option: 'meta_3',
        },
        {
          text: "Maybe not.",
          next_option: 'meta_3',
        },
      ],
    },
  ],

  [
    'meta_3',
    {
      question: "Could you let the thought stay for a moment without trying to solve, fight, or answer it?",
      answers: [
        {
          text: "I'll try.",
          next_option: 'meta_4',
        },
        {
          text: "That feels too difficult right now.",
          next_option: 'release_pause',
        },
      ],
    },
  ],

  [
    'meta_4',
    {
      question: "If the thought is still here, does that mean you have to continue the conversation with it?",
      answers: [
        {
          text: "No.",
          next_option: 'release_meta',
        },
        {
          text: "It still feels like I do.",
          next_option: 'release_pause',
        },
      ],
    },
  ],

  // -------------------------
  // GENERIC LOOP
  // -------------------------

  [
    'loop_1',
    {
      question: "If thinking isn't giving you new information, what is keeping you in the loop?",
      answers: [
        {
          text: "I want to know for sure what will happen.",
          next_option: 'certainty_3',
        },
        {
          text: "I keep blaming myself for what happened.",
          next_option: 'judge_1',
        },
        {
          text: "I feel the need to check again.",
          next_option: 'checking_1',
        },
        {
          text: "I simply can't seem to let the thought go.",
          next_option: 'meta_1',
        },
      ],
    },
  ],

  // -------------------------
  // RELEASE NODES
  // `release` is the ReleasePhrases key
  // that stage 3 offers first.
  // -------------------------

  [
    'release_action',
    {
      release: 'action',
      question: "You have a next step. Does the rest need to be solved right now?",
      answers: [
        {
          text: "No. One next step is enough for now.",
          next_option: 'END',
        },
        {
          text: "I still feel I need certainty.",
          next_option: 'certainty_3',
        },
      ],
    },
  ],

  [
    'release_uncertainty',
    {
      release: 'uncertainty',
      question: "Can you leave the unanswered part unanswered for now?",
      answers: [
        {
          text: "Yes. It can stay unknown for now.",
          next_option: 'END',
        },
        {
          text: "I'm still struggling with that.",
          next_option: 'meta_1',
        },
      ],
    },
  ],

  [
    'release_past',
    {
      release: 'past',
      question: "If you already have the lesson, does going over the past again add anything useful?",
      answers: [
        {
          text: "No. I can leave it here.",
          next_option: 'END',
        },
        {
          text: "I still feel I should have done better.",
          next_option: 'judge_1',
        },
      ],
    },
  ],

  [
    'release_self_compassion',
    {
      release: 'self_criticism',
      question: "Can the lesson stay, even if the self-punishment stops?",
      answers: [
        {
          text: "Yes.",
          next_option: 'END',
        },
        {
          text: "Not yet.",
          next_option: 'meta_1',
        },
      ],
    },
  ],

  [
    'release_checking',
    {
      release: 'checking',
      question: "Can you choose not to check again right now, even without feeling completely certain?",
      answers: [
        {
          text: "Yes.",
          next_option: 'END',
        },
        {
          text: "Not yet.",
          next_option: 'certainty_5',
        },
      ],
    },
  ],

  [
    'release_meta',
    {
      release: 'meta',
      question: "Can the thought stay in the background without needing another answer from you?",
      answers: [
        {
          text: "Yes.",
          next_option: 'END',
        },
        {
          text: "I'll try, even if it feels uncomfortable.",
          next_option: 'END',
        },
      ],
    },
  ],

  [
    'release_pause',
    {
      release: 'meta',
      question: "Would it be enough to stop solving this for the next few minutes, without needing the thought to disappear?",
      answers: [
        {
          text: "Yes.",
          next_option: 'END',
        },
        {
          text: "I'll try.",
          next_option: 'END',
        },
      ],
    },
  ],
]);
