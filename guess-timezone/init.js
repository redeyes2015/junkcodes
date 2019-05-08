class Zone {
    constructor(origZone) {
        this._origZone = origZone;

        const {name, offsets, untils, population} = origZone;
        this.name = name;
        this.population = population;
        this.ranges = [];
        let prev = Number.NEGATIVE_INFINITY;
        for (const [i, current] of untils.entries()) {
            this.ranges.push({
                lower: prev,
                higher: current,
                offset: offsets[i],
            });
            prev = current;
        }
    }

    getOffsetAt(ts) {
        return this.ranges.find(r => r.lower <= ts && ts < r.higher).offset;
    }
}

if (require.main === module) {
    const originalZone = { name: 'America/Martinique',
        abbrs: [ 'LMT', 'FFMT', 'AST', 'ADT', 'AST' ],
        offsets: [ 244.33333333333334, 244.33333333333334, 240, 180, 240 ],
        untils:
        [ -2524506940000,
            -1851537340000,
            323841600000,
            338958000000,
            Infinity ],
        population: 390000 };

    const mart = new Zone(originalZone);
    const assert = require('assert');
    assert.equal(mart.getOffsetAt(338958000000 - 1000), 180);
    assert.equal(mart.getOffsetAt(338958000000), 240);
    assert.equal(mart.getOffsetAt(338958001000), 240);
}

class GroupingTreeNode {
    constructor(pivot, children) {
        this.pivot = pivot;
        this.children = children;
    }
    get isLeaf() {
        return false;
    }
    serialize () {
        const children = {};
        for (const [offset, child] of this.children) {
            children[offset] = child.serialize();
        }

        return {
            isLeaf: false,
            pivot: this.pivot,
            children: children,
        };
    }


    static findPivot (zones) {
        return zones
            .filter(z => z.ranges.length > 1)
            .map(z => z.ranges)
            .map(r => r[r.length - 1].lower)
            .reduce((p, l) => Math.max(p, l), Number.NEGATIVE_INFINITY) - 1;
    }

    static groupifyZones (pivot, zones) {
        const groups = new Map();

        for (const zone of zones) {
            const offset = zone.getOffsetAt(pivot);
            if (!groups.has(offset)) {
                groups.set(offset, [zone]);
                continue;
            }
            groups.get(offset).push(zone);
        }
        return groups;
    }

    static genGroupingTree (zones) {
        if (zones.length == 0) {
            throw new Error('not implemented');
        }
        if (zones.length == 1) {
            return new LeafNode(zones[0]);
        }
        const pivot = this.findPivot(zones);
        const groups = this.groupifyZones(pivot, zones);
        if (groups.size == 1) {
            const zoneWithMostPopulation = zones.reduce(
                (candidate, zone) => zone.population > candidate.population ? zone : candidate,
                {population: Number.NEGATIVE_INFINITY}
            );
            return new LeafNode(zones[0]);
        }

        const groupMap = new Map();
        for (const [tz, zones] of groups) {
            groupMap.set(tz, this.genGroupingTree(zones));
        }

        return new GroupingTreeNode(pivot, groupMap);
    }

    static serializeTree (root) {
        return JSON.stringify(root.serialize());
    }
}
class LeafNode {
    constructor(zone) {
        this.zone = zone;
    }
    get isLeaf() {
        return true;
    }
    serialize () {
        return {
            isLeaf: true,
            name: this.zone.name
        };
    }
}

function countTimezonesInTree (root) {
    if (root.isLeaf) {
        return 1;
    }
    let count = 0;
    for (const child of root.children.values()) {
        count += countTimezonesInTree(child);
    }
    return count;
}

const {tz} = require('moment-timezone');

const timezones = Object.values(tz._zones).map((packed) => new Zone(tz.unpack(packed)));

const groups = new Map();

const needle = Date.UTC(2019, 0, 1);

for (const zone of timezones) {
    const offset = zone.getOffsetAt(needle);
    if (!groups.has(offset)) {
        groups.set(offset, [zone]);
        continue;
    }
    groups.get(offset).push(zone);
}

function nonREPL (zones) {
    const tree = GroupingTreeNode.genGroupingTree(zones);
    const numberOfZonesInTree = countTimezonesInTree(tree);
    console.log(`#(zones): ${zones.length} ; in tree: ${numberOfZonesInTree}`);
    const serialized = GroupingTreeNode.serializeTree(tree);
    console.log(`serialized.l: ${serialized.length}`);
}

nonREPL(timezones);
nonREPL(groups.get(-480));
nonREPL(groups.get(600));
