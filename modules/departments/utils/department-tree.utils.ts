/**
 * Department Tree Utilities
 * Contains helper functions for working with department tree data.
 */
import type { Department } from '../types';

/**
 * Flattens a tree of departments into a flat array.
 * @param depts The array of departments (tree structure) to flatten.
 * @returns A flat array of departments.
 */
export function flattenDepartments(depts: Department[]): Department[] {
  if (!Array.isArray(depts)) {
    console.warn("flattenDepartments received a non-array input:", depts);
    return [];
  }
  const result: Department[] = [];
  function recurse(list: Department[]) {
    // Redundant check for safety, main check is at the start
    if (!Array.isArray(list)) return;
    for (const dept of list) {
      result.push(dept);
      if (dept.childDepartments && dept.childDepartments.length > 0) {
        recurse(dept.childDepartments);
      }
    }
  }
  recurse(depts);
  return result;
}

/**
 * Recursively removes a department and all its children from a department tree.
 * @param depts The department tree.
 * @param id The ID of the department to remove.
 * @returns A new department tree with the specified department removed.
 */
export function removeDepartmentFromTree(depts: Department[], id: number): Department[] {
  return depts
    .filter(dept => dept.id !== id)
    .map(dept => ({
      ...dept,
      childDepartments: dept.childDepartments ? removeDepartmentFromTree(dept.childDepartments, id) : []
    }));
} 