
export const charDefault = {
    stats: {
        active_conditions: [],
        awesome_check: 5,
        awesome_mods: {},
        awesome_mods_total: 0,
        caster_level: 0,
        caster_level_kits: {},
        caster_level_kits_total: 0,
        coast_number: 6,
        coast_number_kits: {},
        coast_number_kits_total: 0,
        defense_mods: {},
        defense_total: 0,
        epithet: "Adventurer",
        fighting_level: 0,
        fighting_level_kits: {},
        fighting_level_kits_total: 0,
        fortitude_base_total: 2,
        fortitude_mods: {
            base: {
                "Original Good Save": {
                    level: 1,
                    num: 2
                }
            }
        },
        fortitude_total: 2,
        good_save: "fortitude",
        heroic_bonus: 0,
        level: 1,
        level_max8: 1,
        mp: 0,
        mp_max: 0,
        mp_mods: {},
        mp_mods_total: 0,
        next_level_at: 100,
        reflex_base_total: 0,
        reflex_mods: {
            base: {}
        },
        reflex_mods_total: 0,
        rp: 4,
        rp_max: 4,
        rp_mods: {},
        rp_mods_total: 0,
        skill_mods: {},
        skill_mods_net: {},
        skill_ranks: {},
        skill_ranks_history: {},
        speed: 20,
        speed_mods: {},
        speed_mods_total: 0,
        spellcraft_check: 0,
        spellcraft_mods: {},
        spellcraft_mods_total: 0,
        trained_skills: [],
        trained_skills_history: {
            0: {
                default1: "Choose",
                default2: "Choose"
            }
        },
        vp: 9,
        vp_kits: {},
        vp_kits_total: 0,
        vp_max: 9,
        willpower_base_total: 0,
        willpower_mods: {
            base: {}
        },
        willpower_mods_total: 0,
        xp: 0,
        xp_base: 0,
        xp_parcels: {},
        xp_parcels_total: 0
    }
};

export const rollDefault = {
    processedLocally: false,
    processedBy: [],
    dieModsMisc: {},
    coasting: 0
};

export const kitDefault = {
    name: "",
    prereqs: "",
    bonus_talents: [],
    fighting_level_boost: false,
    caster_level_boost: false,
    caster_OR_coast_boost: false,
    coast_number_boost: false,
    fighting_OR_caster_boost: false,
    fighting_OR_coast_boost: false,
    vp_boost: "0",
    xp_parcels: []
}