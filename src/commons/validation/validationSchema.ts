import * as Yup from 'yup'

import {
  PASSWORD_AT_LEAST_9_CHARACTER,
  PASSWORD_AT_LESAT_1_CAPITAL_AND_1_SPECIAL,
  PASSWORD_IS_REQUIRE,
  REGEX_VALID_PASSWORD,
} from '@/types/auth/constants'
import { INCORRECT_PHONE_NUMBER, PHONEREGEXP } from '@/types/profile/constants'

import {
  CONFIRM_PASSWORD_IS_INCORRECT,
  MATCHES_CURRENT_PASSWORD,
  NOT_MATCH_PASSWORD,
  NOT_MATCH_PATTERN,
  OTP_LENGTH,
  PASSWORD_IS_INCORRECT,
  PASSWORD_MAX,
  PASSWORD_MAX_ERROR_MESSAGE,
  PASSWORD_MIN,
  PASSWORD_MIN_ERROR_MESSAGE,
  PLEASE_ENTER_A_FIRST_NAME,
  PLEASE_ENTER_A_LAST_NAME,
  PLEASE_ENTER_A_PASSWORD,
  PLEASE_ENTER_A_PHONE_NUMBER,
  PLEASE_ENTER_A_VALID_EMAIL_ADDRESS,
  PLEASE_ENTER_EMAIL_ADDRESS,
  PLEASE_ENTER_USERNAME,
  REGREX,
  THE_OTP_LEAST,
  THE_OTP_NOT_EXCEED,
  THIS_INFORMATION_IS_REQUIRED,
} from '../auth.constant'

export const CreateUserValidationSchema = Yup.object().shape({
  username: Yup.string()
    .email(PLEASE_ENTER_A_VALID_EMAIL_ADDRESS)
    .matches(REGREX, PLEASE_ENTER_A_VALID_EMAIL_ADDRESS)
    .required(PLEASE_ENTER_USERNAME),
  firstName: Yup.string().required(PLEASE_ENTER_A_FIRST_NAME),
  lastName: Yup.string().required(PLEASE_ENTER_A_LAST_NAME),
  phoneNumber: Yup.string()
    .matches(PHONEREGEXP, INCORRECT_PHONE_NUMBER)
    .required(PLEASE_ENTER_A_PHONE_NUMBER),
  password: Yup.string()
    .required(PASSWORD_IS_REQUIRE)
    .min(9, PASSWORD_AT_LEAST_9_CHARACTER)
    .matches(REGEX_VALID_PASSWORD, PASSWORD_AT_LESAT_1_CAPITAL_AND_1_SPECIAL),
})

export const signInValidationSchema = Yup.object().shape({
  password: Yup.string().required(PLEASE_ENTER_A_PASSWORD),
  username: Yup.string()
    .email(PLEASE_ENTER_A_VALID_EMAIL_ADDRESS)
    .matches(REGREX, PLEASE_ENTER_A_VALID_EMAIL_ADDRESS)
    .required(PLEASE_ENTER_USERNAME),
})

export const signUpValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(PASSWORD_MIN, PASSWORD_MIN_ERROR_MESSAGE)
    .max(PASSWORD_MAX, PASSWORD_MAX_ERROR_MESSAGE)
    .required(PLEASE_ENTER_A_PASSWORD),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], CONFIRM_PASSWORD_IS_INCORRECT)
    .required(PLEASE_ENTER_A_PASSWORD),
  email: Yup.string()
    .email(PLEASE_ENTER_A_VALID_EMAIL_ADDRESS)
    .matches(REGREX, PLEASE_ENTER_A_VALID_EMAIL_ADDRESS)
    .required(PLEASE_ENTER_EMAIL_ADDRESS),
})

export const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(PLEASE_ENTER_A_VALID_EMAIL_ADDRESS)
    .matches(REGREX, PLEASE_ENTER_A_VALID_EMAIL_ADDRESS)
    .required(PLEASE_ENTER_EMAIL_ADDRESS),
})

export const resetPasswordValidationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(PASSWORD_MIN, PASSWORD_MIN_ERROR_MESSAGE)
    .max(PASSWORD_MAX, PASSWORD_MIN_ERROR_MESSAGE)
    .required(THIS_INFORMATION_IS_REQUIRED),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], PASSWORD_IS_INCORRECT)
    .required(THIS_INFORMATION_IS_REQUIRED),
  otpCode: Yup.string()
    .min(OTP_LENGTH, THE_OTP_LEAST)
    .max(OTP_LENGTH, THE_OTP_NOT_EXCEED)
    .required(THIS_INFORMATION_IS_REQUIRED),
})

export const changePasswordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(PASSWORD_MIN, PASSWORD_MIN_ERROR_MESSAGE)
    .max(PASSWORD_MAX, PASSWORD_MIN_ERROR_MESSAGE)
    .required(THIS_INFORMATION_IS_REQUIRED),
  newPassword: Yup.string()
    .min(PASSWORD_MIN, PASSWORD_MIN_ERROR_MESSAGE)
    .max(PASSWORD_MAX, PASSWORD_MIN_ERROR_MESSAGE)
    .notOneOf([Yup.ref('currentPassword'), null], MATCHES_CURRENT_PASSWORD)
    .required(THIS_INFORMATION_IS_REQUIRED),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], CONFIRM_PASSWORD_IS_INCORRECT)
    .required(THIS_INFORMATION_IS_REQUIRED),
})

export const changeTSPasswordValidationSchema = Yup.object().shape({
  currentTransactionSecurityPassword: Yup.string()
    .min(PASSWORD_MIN, PASSWORD_MIN_ERROR_MESSAGE)
    .max(PASSWORD_MAX, PASSWORD_MIN_ERROR_MESSAGE)
    .required(THIS_INFORMATION_IS_REQUIRED),
  newTransactionSecurityPassword: Yup.string()
    .min(PASSWORD_MIN, PASSWORD_MIN_ERROR_MESSAGE)
    .max(PASSWORD_MAX, PASSWORD_MIN_ERROR_MESSAGE)
    .required(THIS_INFORMATION_IS_REQUIRED),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newTransactionSecurityPassword')], NOT_MATCH_PASSWORD)
    .required(THIS_INFORMATION_IS_REQUIRED),
})

export const createTSPasswordValidationSchema = Yup.object().shape({
  newTransactionSecurityPassword: Yup.string()
    .min(PASSWORD_MIN, PASSWORD_MIN_ERROR_MESSAGE)
    .max(PASSWORD_MAX, PASSWORD_MIN_ERROR_MESSAGE)
    .required(THIS_INFORMATION_IS_REQUIRED),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newTransactionSecurityPassword')], NOT_MATCH_PASSWORD)
    .required(THIS_INFORMATION_IS_REQUIRED),
})

export const updateProfileValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required(THIS_INFORMATION_IS_REQUIRED)
    .matches(/^[a-z0-9_]{4,20}$/, NOT_MATCH_PATTERN),
})
