/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import DataJSON from '../DataJSON.js';
import DataModifier from './DataModifier.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
/**
 * Modifies a table with the help of modifiers in an ordered chain.
 */
var ChainDataModifier = /** @class */ (function (_super) {
    __extends(ChainDataModifier, _super);
    /* *
     *
     *  Constructors
     *
     * */
    /**
     * Constructs an instance of the modifier chain.
     *
     * @param {DeepPartial<ChainDataModifier.Options>} [options]
     * Options to configure the modifier chain.
     *
     * @param {...DataModifier} [modifiers]
     * Modifiers in order for the modifier chain.
     */
    function ChainDataModifier(options) {
        var modifiers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            modifiers[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        var completeOptions = merge(ChainDataModifier.defaultOptions, options);
        _this.modifiers = modifiers;
        _this.options = completeOptions;
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Converts a class JSON to a modifier chain. All modifier references in the
     * JSON have to be registered on call to get converted to an instance.
     *
     * @param {ChainDataModifier.ClassJSON} json
     * Class JSON to convert to an instance of modifier chain.
     *
     * @return {ChainDataModifier}
     * Modifier chain of the class JSON.
     */
    ChainDataModifier.fromJSON = function (json) {
        var jsonModifiers = json.modifiers, modifiers = [];
        var modifier;
        for (var i = 0, iEnd = jsonModifiers.length; i < iEnd; ++i) {
            modifier = DataJSON.fromJSON(jsonModifiers[i]);
            if (modifier) {
                modifiers.push(modifier);
            }
        }
        return new (ChainDataModifier.bind.apply(ChainDataModifier, __spreadArrays([void 0, json.options], modifiers)))();
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Adds a configured modifier to the end of the modifier chain. Please note,
     * that the modifier can be added multiple times.
     *
     * @param {DataModifier} modifier
     * Configured modifier to add.
     */
    ChainDataModifier.prototype.add = function (modifier) {
        this.modifiers.push(modifier);
    };
    /**
     * Clears all modifiers from the chain.
     */
    ChainDataModifier.prototype.clear = function () {
        this.modifiers.length = 0;
    };
    /**
     * Applies modifications to the table rows and returns a new table with the
     * modified rows.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @return {DataTable}
     * New modified table.
     */
    ChainDataModifier.prototype.execute = function (table) {
        var modifier = this, modifiers = (modifier.options.reverse ?
            modifier.modifiers.reverse() :
            modifier.modifiers.slice());
        modifier.emit({ type: 'execute', table: table });
        for (var i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
            table = modifiers[i].execute(table);
        }
        modifier.emit({ type: 'afterExecute', table: table });
        return table;
    };
    /**
     * Removes a configured modifier from all positions of the modifier chain.
     *
     * @param {DataModifier} modifier
     * Configured modifier to remove.
     */
    ChainDataModifier.prototype.remove = function (modifier) {
        var modifiers = this.modifiers;
        modifiers.splice(modifiers.indexOf(modifier), 1);
    };
    /**
     * Converts the modifier chain to a class JSON, including all containing all
     * modifiers.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this modifier chain.
     */
    ChainDataModifier.prototype.toJSON = function () {
        var modifiers = this.modifiers, json = {
            $class: 'ChainDataModifier',
            modifiers: [],
            options: merge(this.options)
        };
        for (var i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
            json.modifiers.push(modifiers[i].toJSON());
        }
        return json;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Default option for the ordered modifier chain.
     */
    ChainDataModifier.defaultOptions = {
        modifier: 'Chain',
        reverse: false
    };
    return ChainDataModifier;
}(DataModifier));
/* *
 *
 *  Register
 *
 * */
DataJSON.addClass(ChainDataModifier);
DataModifier.addModifier(ChainDataModifier);
/* *
 *
 *  Export
 *
 * */
export default ChainDataModifier;
