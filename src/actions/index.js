/*
 * action types
 */
export const CHANGE_NAME = 'CHANGE_NAME'
export const CHANGE_AGE = 'CHANGE_AGE'
export const SHOW_PAGE = 'SHOW_PAGE'
/*
 * action creators
 */
export function changeName(text) {
  return { type: CHANGE_NAME, text }
}
export function changeAge(age) {
  return { type: CHANGE_AGE, age }
}