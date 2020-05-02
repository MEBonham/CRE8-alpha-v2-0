const gc = {
    base_awesome_bonus: 4,
    base_coast_number: 6,
    base_reserve_points: 4,
    base_speed: 20,
    base_trained_skills: 2,
    base_vitality_points: 5,
    basic_conditions: [
        "Momentum",
        "Exerted",
        "Wounded"
    ],
    benefit_traits: [
        "Darkvision",
        "Ignore Armor Speed Penalty",
        "Low-Light Vision",
        "Martial Weaponry",
        "Skill Ranks for Parcels",
        "Stability",
        "Stack 1st-Level Kits"
    ],
    bonus_targets: [
        { name: "Armor Value", code: "av_mods" },
        { name: "Athletics", code: "Athletics" },
        { name: "Brawn", code: "Brawn" },
        { name: "Charisma", code: "Charisma" },
        { name: "Dexterity", code: "Dexterity" },
        { name: "Fortitude", code: "fortitude_mods" },
        { name: "Gadgetry", code: "Gadgetry" },
        { name: "Glibness", code: "Glibness" },
        { name: "Knowledge", code: "Knowledge" },
        { name: "Magic Points Pool", code: "mp_mods" },
        { name: "Nature", code: "Nature" },
        { name: "Perception", code: "Perception" },
        { name: "Reflex", code: "reflex_mods" },
        { name: "Reserve Points Pool", code: "rp_mods" },
        { name: "Speed", code: "speed_mods" },
        { name: "Spellcraft", code: "spellcraft_mods" },
        { name: "Stealth", code: "Stealth" },
        { name: "Weapon Impact", code: "weapon_impact_mods" },
        { name: "Willpower", code: "willpower_mods" },
    ],
    bonus_types: [
        "Base",
        "Circumstance",
        "Feat",
        "Item",
        "Racial",
        "Size",
        "Synergy",
        "Untyped"
    ],
    drawback_traits: [
        "Arcane Aversion"
    ],
    epic_level_xp_increment: 500,
    good_save_boost: 2,
    kit_tags: [
        "Core",
        "Epic",
        "Monster",
        "Racial"
    ],
    max_level_pre_epic: 8,
    other_conditions: [
        "Unconscious",
        "Dying",
        "Shaken",
        "Prone"
    ],
    skills_list: [
        "Athletics",
        "Brawn",
        "Charisma",
        "Dexterity",
        "Gadgetry",
        "Glibness",
        "Knowledge",
        "Nature",
        "Perception",
        "Stealth"
    ],
    skills_list_num: 10,
    skill_ranks_per_level: 5,
    talent_tags: [
        "Buff",
        "Core",
        "Epic",
        "Flaw",
        "Ki",
        "Luck",
        "Monster",
        "Proficiency",
        "Seed",
        "Skill Trick"
    ],
    trained_skill_extra_ranks: 2,
    wounded_save_penalty: -2,
    xp_increment_per_level: 100,
    xp_per_parcel: 30
};

export default gc;