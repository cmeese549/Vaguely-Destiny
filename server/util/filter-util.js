module.exports = {
    determineLocation,
    determineWeaponType,
    determineIfNeedsFireteam,
    determineIfNeedsSolo,
    determineActivityTypes,
    determineSubclassTypes
};

//Helper functions

function descriptionMatch (record, pattern) {
    return record.displayProperties.description.toLowerCase().match(new RegExp(pattern.toLowerCase()));
}

function nameMatch (record, pattern) {
    return record.displayProperties.name.toLowerCase().match(new RegExp(pattern.toLowerCase()));
}

function basicDoubleMatch (record, pattern) {
    let match = descriptionMatch(record, pattern);
    if (match === null) {
        match = descriptionMatch(record, pattern);
        if (match === null) return false;
        return true;
    } else {
        return true;
    }
}

//End helper functions

const locationNames = [
    'Europa',
    'Moon',
    'EDZ',
    'Cosmodrome',
    'Nessus',
    'Tangled Shore',
    'Dreaming City',
    'The Tower'
];

function determineLocation (record) {
    const locations = [];
    locationNames.forEach(location => {
        let match = descriptionMatch(record, location);
        if (match === null) {
            match = nameMatch(record, location);
            if (match === null) return;
            locations.push(match[0]);
        } else {
            locations.push(match[0])
        }
    });
    return locations;
}

const weaponTypes = [
    'Auto Rifle',
    'Bow',
    'Hand Cannon',
    'Pulse Rifle',
    'Scout Rifle',
    'Sidearm',
    'Submachine Gun',
    'Shotgun',
    'Sniper',
    'Trace Rifle',
    'Grenade Launcher',
    'Linear Fusion Rifle',
    'Fusion Rifle'
];

function determineWeaponType (record) {
    const weapons = [];
    weaponTypes.forEach(weapon => {
        let match = descriptionMatch(record, weapon);
        if (match === null) {
            match = nameMatch(record, weapon);
            if (match === null) return;
            weapons.push(match[0]);
        } else {
            weapons.push(match[0])
        }
    });
    return weapons;
}

//not including vanguard cuz reasons
const allActivityTypes = [
    'Gambit',
    'Crucible',
    'Raid',
    'Override',
    'Expunge',
    'Astral Alignment',
    'Shattered Realm',
    'Dungeon',
    'Empire Hunt',
    'Exo Challenges',
    'Wrathborn',
    'Presage',
    'Harbinger',
    'Dares of Eternity',
    'Trials of Osiris',
    'Iron Banner',
    'Public event',
    'Patrol',
    'Lost Sector',
    'Bounties',
    'Battlegrounds',
    'Glory'
];

function determineActivityTypes (record) {
    let activityTypes = [];
    //vanguard stuff is funky and not in the array of activity types
    if (basicDoubleMatch(record, 'Strike')) {
        if (basicDoubleMatch(record, 'Nightfall'))
            activityTypes.push('Nightfall');
        else
            activityTypes.push('Strikes');
    }
    allActivityTypes.forEach(activity => {
        if (basicDoubleMatch(record, activity)) activityTypes.push(activity);
    });
    return activityTypes;
}

const subclasses = [
    'Dawnblade',
    'Voidwalker',
    'Stormcaller',
    'Gunslinger',
    'Arcstrider',
    'Nightstalker',
    'Striker',
    'Sentinel',
    'Sunbreaker',
    'Shadebinder',
    'Revenant',
    'Behemoth'
];

function determineSubclassTypes (record) {
    let subclassTypes = [];
    subclasses.forEach(subclass => {
        if (basicDoubleMatch(record, subclass)) subclassTypes.push(subclass);
    });
    return subclassTypes;
}

function determineIfNeedsFireteam (record) {
    let match = descriptionMatch(record, 'with a fireteam');
    if (match === null) {
        match = descriptionMatch(record, 'in a fireteam');
        if (match === null) return false;
        return true;
    } else {
        return true;
    }
}

function determineIfNeedsSolo (record) {
    const match = descriptionMatch(record, 'without a fireteam');
    if (match === null) return false;
    return true;
}