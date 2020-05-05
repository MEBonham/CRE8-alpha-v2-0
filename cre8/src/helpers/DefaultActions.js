export const defaultActions = {
    standard: [
        "Make a melee or ranged weapon attack. A ranged weapon attack provokes opportunity attacks.",
        "Make a special attack.",
        "Draw an item out of a backpack or similar container.",
        "Withdraw: move up to your Speed + 10 ft, without provoking opportunity attacks for your first 5 ft of movement.",
        "Stand from Prone Defensively: remove the prone condition from yourself without provoking opportunity attacks.",
        "Communicate: speak in a manner that requires coherence and coordination, limited to about ten seconds. TNs for social interaction are still higher than they are outside of combat, but they are possible.",
        "Total Defense: Until the start of your next turn, you may use your Awesome Check in place of your Defense Save.",
        "Aid an Ally.",
        "If you have momentum, encourage an ally who can hear you. Make a TN 15 Charisma or Glibness check (whichever is better). On a success, the target ally gains momentum.",
        "Administer first aid."
    ],
    special_attacks: [
        "Charge: move up to your Speed + 10 ft in a straight line with a clear path, provoking opportunity attacks if you move through threatened areas. At the end of your movement, make a melee attack.",
        "Coup de Grace: provoke opportunity attacks. Make a melee attack against a target that is dropped or otherwise helpless. Roll impact normally, including the +1d4 bonus if the target is Prone. If the impact roll exceeds the target's AV, the target dies. Otherwise, the target still dies unless it succeeds on a TN 15 Fortitude save.",
        "Disarm:",
        "Grab: a target within the threatened area of your unarmed strike must make a Defense Save against your unarmed strike Accuracy. On a failure, the target becomes Grabbed until some effect or action ends the grapple.",
        "Shove: provoke opportunity attacks. A target within the threatened area of your unarmed strike must make an Athletics or Brawn check (whichever is better) to keep its footing. The TN is the Accuracy of your unarmed strike. If the check fails, you may inflict the Prone condition on the target or shove it up to 5 ft away from you. If you are bigger than the target, this increases by 5 ft for each size category of difference.",
        "Sunder: declare an object your foe holds, wears, or wields as your target. Make a normal weapon attack, except instead of the normal Hazard Menu, if your attack Impact exceeds the target's AV, the object must succeed at a Structural Save against your attack's Accuracy or be destroyed."
    ],
    move: [
        "Standard Movement: move up to your Speed + 10 ft, provoking opportunity attacks if you move through threatened areas. Make a Speed Check (TN = number of feet moved). If it succeeds, add a Maneuver to your movement.",
        "Standard Shifting: move up to 5 ft without provoking opportunity attacks.",
        "Stand from Prone: remove the prone condition from yourself. Provoke opportunity attacks.",
        "Escape Attempt: make an Athletics or Brawn check to remove the Grabbed condition from yourself. The TN of this check is the unarmed strike Accuracy of the grabbing creature."
    ],
    maneuvers: [
        "Mount or dismount a willing creature.",
        "Pick up an unattended item.",
        "Take Cover: gain cover against attacks as permitted by terrain."
    ],
    swift: [
        "Drop Prone: give yourself the Prone condition voluntarily.",
        "Draw a readily available item.",
        "Draw and load normal ammunition.",
        "Open or Close an Ordinary Door: this may be done mid-movement. Depending on whether the door is fastened and which direction it swings, a free hand may be required."
    ],
    opportunity: [
        "Opportunity Attack: make a melee attack against a creature you threaten who takes an action that provokes opportunity attacks.",
        "Carry out a readied standard (or move) action."
    ],
    free: [
        "Once per round on your turn, if no creature in the encounter has momentum, attempt to Surge. Roll a d20 with no modifiers. On a result of 16+, gain momentum.",
        "Speak a brief phrase that does not require a response.",
        "Drop an object.",
        "Switch an object between two hands and one hand.",
        "Cease sustaining a spell."
    ]
}