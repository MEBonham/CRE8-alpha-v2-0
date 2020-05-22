
export const charDefault = {
    bio: {
        appearance: "",
        background: "",
        beliefs: "",
        ecology: "",
        possessions: "",
        personality: "",
        quirks: "",
        relationships: "",
        tactics: ""
    },
    monster_flag: false,
    stats: {
        active_conditions: [],
        armor_value: 2,
        attacks: [{
            accuracy: 10,
            name: "Unarmed Strike",
            type: "natural_weapon",
            range: "Melee reach 1 (short)",
            detail: "",
            impact_num_dice: 1,
            impact_dice_sides: 4,
            impact_total_mod: 0,
            damage_type: {
                base: {
                    bludgeoning: true
                }
            },
            peril_mod: 0,
            peril_rating: 0
        }],
        av_mods: {},
        awesome_check: 5,
        awesome_mods: {},
        awesome_mods_total: 0,
        bulk_carried: 0,
        caster_level: 0,
        caster_level_kits: {},
        caster_level_kits_total: 0,
        coast_number: 6,
        coast_number_kits: {},
        coast_number_kits_total: 0,
        defense_mods: {},
        defense_total: 0,
        epithet: "Adventurer",
        extended_rest_actions: [],
        feats: {},
        fighting_level: 0,
        fighting_level_kits: {},
        fighting_level_kits_total: 0,
        fortitude_base_total: 2,
        fortitude_mods: {
            base: {
                "Original Good Save": {
                    level: 1,
                    num: 2,
                    srcType: "automatic"
                }
            }
        },
        fortitude_total: 2,
        free_actions: [],
        good_save: "fortitude",
        heroic_bonus: 0,
        inventory: [],
        kits: {},
        level: 1,
        level_max8: 1,
        move_actions: [],
        mp: 0,
        mp_max: 0,
        mp_mods: {},
        mp_mods_total: 0,
        next_level_at: 100,
        opportunity_actions: [],
        passives: [],
        reflex_base_total: 0,
        reflex_mods: {
            base: {}
        },
        reflex_mods_total: 0,
        resistance_mods: {},
        resistance_value: 6,
        rp: 4,
        rp_max: 4,
        rp_mods: {},
        rp_mods_total: 0,
        short_rest_actions: [],
        size_final: 0,
        size_mods: {},
        skill_mods: {},
        skill_mods_net: {},
        skill_ranks: {},
        skill_ranks_history: {},
        speed: 20,
        speed_mods: {},
        speed_mods_total: 0,
        spell_accuracy_mods: {},
        spell_impact_mods: {},
        spellcraft_check: 0,
        spellcraft_mods: {},
        spellcraft_mods_total: 0,
        standard_actions: [],
        swift_actions: [],
        synergy_bonuses: {
            Brawn: [
                {
                    to: "av_mods",
                    display: "Armor Value",
                    primary: false,
                    source: "automatic",
                    srcType: "automatic"
                },
                {
                    to: "weapon_impact_mods",
                    display: "Weapon Impact",
                    primary: false,
                    source: "automatic",
                    srcType: "automatic"
                }
            ]
        },
        talents: {},
        trained_skills: [],
        trained_skills_history: {
            0: {
                default1: {
                    skill: false,
                    srcType: "automatic"
                },
                default2: {
                    skill: false,
                    srcType: "automatic"
                }
            }
        },
        traits_from_feats: [],
        traits_from_kits: [],
        traits_from_talents: [],
        vp: 9,
        vp_kits: {},
        vp_kits_total: 0,
        vp_max: 9,
        wealth: 20,
        wealth_mods: {
            buy_history: []
        },
        wealth_undo_used: true,
        weapon_accuracy_mods: {},
        weapon_impact_mods: {},
        willpower_base_total: 0,
        willpower_mods: {
            base: {}
        },
        willpower_mods_total: 0,
        xp: 0,
        xp_award: 15,
        xp_base: 0,
        xp_buffer: 1,
        xp_parcels_total: 0
    }
};

export const attackDefault = {
    accuracy: 10,
    name: "",
    type: "natural_weapon",
    range: "Melee reach 1 (medium)",
    detail: "",
    impact_num_dice: 1,
    impact_dice_sides: 6,
    impact_total_mod: 0,
    damage_type: {
        base: {
            bludgeoning: true
        }
    },
    peril_mod: 2,
    peril_rating: 2
};

export const rollDefault = {
    processedLocally: false,
    processedBy: [],
    dieModsMisc: {},
    coasting: 0
};

export const kitDefault = {
    name: "",
    tags: [],
    prereqs: "",
    expectation: "",
    attacks: [],
    benefit_traits: [],
    bonus_feat: false,
    bonus_talents: [],
    bonus_trained_skills: [],
    can_repeat: false,
    caster_level_boost: false,
    caster_OR_coast_boost: false,
    coast_number_boost: false,
    drawback_traits: [],
    extended_rest_actions: [],
    fighting_level_boost: false,
    fighting_OR_caster_boost: false,
    fighting_OR_coast_boost: false,
    fightingRpBoost_OR_rpPlus2: false,
    grow_bigger_level: 0,
    intended_level: 1,
    passives: [],
    selected_options: {},
    select_one_from_attacks: false,
    short_rest_actions: [],
    various_bonuses: [],
    various_penalties: [],
    vp_boost: "0",
    vpPlus2_OR_mpPlus2: false,
    xp_parcels: [],
    xp_parcels_acquired: []
}

export const featDefault = {
    name: "",
    tags: [],
    prereqs: "",
    expectation: "",
    applicable_seeds: "",
    attacks: [],
    augment_options: [],
    benefit_traits: [],
    bonus_talents: [],
    can_repeat: false,
    drawback_traits: [],
    extended_rest_actions: [],
    free_actions: [],
    intended_level: 1,
    move_actions: [],
    normal: "",
    opportunity_actions: [],
    passives: [],
    seed_effects: [],
    selected_options: {},
    selective_passives: {},
    short_rest_actions: [],
    standard_actions: [],
    swift_actions: [],
    various_bonuses: [],
    various_penalties: []
}

export const talentDefault = {
    name: "",
    tags: [],
    prereqs: "",
    expectation: "",
    attacks: [],
    benefit_traits: [],
    bonus_talents: [],
    can_repeat: false,
    claw_rend: false,
    drawback_traits: [],
    extended_rest_actions: [],
    free_actions: [],
    intended_level: 1,
    lightning_agility: false,
    mighty_constitution: false,
    normal: "",
    passives: [],
    selected_options: {},
    selective_passives: {},
    short_rest_actions: [],
    special_note: "",
    standard_actions: [],
    steely_focus: false,
    swift_actions: [],
    various_bonuses: [],
    various_penalties: []
}

export const itemDefault = {
    name: "",
    tags: [],
    price: 10,
    bulk: 1,
    description: "",
    attacks: [],
    hands_occupied: "1",
    halve_bulk_capacity: 0,
    hardness: "4",
    held_items: [],
    investments: {},
    location: "Readily Available",
    magic_item: false,
    passives: [],
    resistance: "8",
    selected_options: {},
    selective_passives: {},
    structural_save: "0",
    various_bonuses: [],
    various_penalties: [],
    weapon_grade: "martial",
    weapon_heft: "Light",
    worn_or_wielded: false
}