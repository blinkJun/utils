/** @module Tree */

/**
 * @method toTree
 * @description 表格数据转换为树形结构
 * @param {Array} list 平铺的数据数组，每一项应该包含一个{itemKey}和[parentIdKey]：[{id,name,parentId},{id,name,parentId}]
 * @param {String} [itemKey = 'id'] 每一项的唯一键
 * @param {Number | String} [topItemValue = 0] 最上级菜单的唯一键的值
 * @param {String} [parentIdKey = 'parentId'] 每一项的父级键
 * @return {Array} [{id,name,parentId,children:[{id,name,parentId}]}]
 * @example
 * const list = [
 *   {id:1,name:'item-1',parentId:0},
 *   {id:2,name:'item-2',parentId:0},
 *   {id:3,name:'item-3',parentId:1}
 * ]
 * toTree(list)
 * // [
 * //    {id:1,name:'item-1',parentId:0,children:[{id:3,name:'item-3',parentId:1}]},
 * //    {id:2,name:'item-2',parentId:0},
 * // ]
 */
export function toTree(
    list,
    itemKey = "id",
    topItemValue = 0,
    parentIdKey = "parentId"
) {
    const tree = [];
    const treeMap = {};
    for (let i = 0; i < list.length; i++) {
        const row = list[i];
        row.title = row.name;
        row.label = row.name;
        row.value = row[itemKey];
        const parentId = Number(row[parentIdKey]);
        if (parentId === topItemValue) {
            row.expand = true;
            tree.push(row);
        } else {
            if (treeMap[parentId]) {
                treeMap[parentId].push(row);
            } else {
                treeMap[parentId] = [row];
            }
        }
    }

    const createInfinite = function (rows) {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (treeMap[row[itemKey]]) {
                row.children = treeMap[row[itemKey]];
                delete treeMap[row[itemKey]];
                createInfinite(row.children);
            }
        }
    };
    createInfinite(tree);

    return tree;
}

/**
 * @method treeToCascaderValue
 * @description 树形数据转换为级联值
 * @param {Array} tree 树形结构
 * @param {Number | String} focusId 当前选中的值
 * @param {Number | String} [itemKey = 'id'] 树形结构需要取出对比的键
 * @return {Array} [1,2,3] 树形结构数组
 * @example
 * const tree = [
 *     {id:1,name:'item-1',parentId:0,children:[{id:3,name:'item-3',parentId:1}]},
 *     {id:2,name:'item-2',parentId:0},
 * ]
 * treeToCascaderValue(tree,3)
 * // [1,3]
 */
export function treeToCascaderValue(tree, focusId, itemKey = "id") {
    const parseData = function (tree, start = []) {
        for (const item of tree) {
            // 与当前的id相同 返回级联结构
            const treeItemKeyValue = item[itemKey];
            if (treeItemKeyValue === Number(focusId)) {
                return start.concat(treeItemKeyValue);
            } else {
                // 与当前id不同 查询其子级
                if (item.children && item.children.length) {
                    const chilrenTree = parseData(
                        item.children,
                        start.concat(treeItemKeyValue)
                    );
                    // 子级查询到匹配id则直接返回
                    if (chilrenTree.length > 0) {
                        return chilrenTree;
                    }
                }
            }
        }
        // 否则返回空
        return [];
    };

    return parseData(tree);
}
