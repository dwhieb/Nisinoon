/* eslint prefer-template: "off" */

export default function cleanProto(form) {
  return form
  .normalize()
  .replace(/^\//v, ``) // Remove leading slash
  .replace(/\/$/v, ``) // Remove trailing slash
  .replace(/^-\*/v, `-`) // Remove asterisk following a leading hyphen
  .replace(/^\*/v, ``) // Remove leading asterisk
}
