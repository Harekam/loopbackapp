/**
 * Created by harekamsingh on 8/22/16.
 */
'use strict';
const REGEX = {
  SPECIAL_CHAR_REMOVAL: /[^A-Z0-9]/ig,
  OBJECT_ID: /^[0-9a-fA-F]{24}$/,
  ALPHA_SPACE_DOT: /^[a-zA-Z\s\.]+$/,
  ALPHA_NUM_UNDER: /^[a-z0-9_]*$/,
  PHONE_NUMBER: /^[1-9][0-9]*$/,
  NUMBER_ONLY: /^[0-9]+$/,
  OTP_NUMBER: /^[0-9]*$/,
  YEAR_NUMBER_ONLY: /^[1-9][0-9]*$/,
  ALPHABET_ONLY: /^[a-zA-Z ]*$/
};
module.exports = {REGEX};
