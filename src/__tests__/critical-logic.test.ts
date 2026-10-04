import test from 'node:test'
import assert from 'node:assert/strict'
import { hashPassword, comparePassword } from '../utils/password'
import { faNumber } from '../utils/persian-utils'
import { intelligenceService } from '../services/intelligence.service'
import { loginSchema } from '../validations/auth.schema'
import { createStudentSchema } from '../validations/student.schema'

test('Security & Cryptography - Password hashing and verification', async () => {
  const plain = 'SecretPassword123'
  const hash = await hashPassword(plain)

  assert.notEqual(plain, hash, 'Password hash should not match plain text')
  assert.ok(hash.startsWith('$2'), 'Hash should be a valid bcrypt string')

  const isMatch = await comparePassword(plain, hash)
  assert.equal(isMatch, true, 'Valid password should verify successfully')

  const isWrong = await comparePassword('WrongPassword', hash)
  assert.equal(isWrong, false, 'Invalid password must be rejected')
})

test('Localization Utils - Persian number formatting', () => {
  const formattedNum = faNumber(12345)
  assert.ok(formattedNum.length > 0, 'Formatted number should not be empty')

  const formattedStr = faNumber('1024')
  assert.equal(formattedStr, '۱۰۲۴', 'Numeric string should convert to Persian digits')
})

test('AI Coaching Intelligence Engine - Generates valid insights', () => {
  const student = {
    id: '1024',
    name: 'علی رضایی',
    age: 15,
    belt: 'آبی',
    targetBelt: 'قرمز',
    className: 'کلاس نوجوانان',
    attendanceRate: 88,
    overallScore: 82,
    competitionsCount: 2,
    medalsCount: 1,
    skills: [
      { name: 'آپ چاگی', score: 94, category: 'تکنیک‌ها' },
      { name: 'انعطاف‌پذیری', score: 92, category: 'آمادگی جسمانی' },
      { name: 'دفاع', score: 62, category: 'مبارزه' },
      { name: 'جابه‌جایی پا', score: 65, category: 'مبارزه' },
    ],
  }

  const report = intelligenceService.generateInsights(student)

  assert.equal(report.studentId, '1024')
  assert.equal(report.studentName, 'علی رضایی')
  assert.equal(report.nextBelt, 'قرمز')

  // Top strengths should have highest score
  assert.ok(report.strengths.length > 0, 'Should identify strengths')
  assert.equal(report.strengths[0].name, 'آپ چاگی')

  // Top weakness should have lowest score
  assert.ok(report.weaknesses.length > 0, 'Should identify weaknesses')
  assert.equal(report.weaknesses[0].name, 'دفاع')
  assert.equal(report.weaknesses[0].score, 62)

  // Recommendations and training plan should exist
  assert.equal(report.trainingPlan.sessions.length, 3, 'Training plan should provide 3 structured sessions')
  assert.ok(report.beltReadiness.score > 0, 'Belt readiness score should be calculated')
})

test('AI Coaching Intelligence Engine - Handles empty skills gracefully', () => {
  const student = {
    id: '1099',
    name: 'هنرجوی جدید',
    age: 12,
    belt: 'سفید',
    targetBelt: 'زرد',
    className: 'کلاس نونهالان',
    attendanceRate: 100,
    overallScore: 75,
    competitionsCount: 0,
    medalsCount: 0,
    skills: [],
  }

  const report = intelligenceService.generateInsights(student)

  assert.equal(report.studentId, '1099')
  assert.ok(report.strengths.length > 0, 'Should fall back to default skills without crashing')
  assert.ok(report.weaknesses.length > 0, 'Should have weaknesses even with empty initial skills')
  assert.equal(report.trainingPlan.sessions.length, 3)
})

test('Validation Schemas - Authentication and Input sanitization', async () => {
  // Valid login
  const validLogin = await loginSchema.safeParseAsync({
    body: { email: 'coach@razmyar.ir', password: 'Password123' },
  })
  assert.equal(validLogin.success, true, 'Valid login credentials should pass validation')

  // Invalid login - short password
  const shortPass = await loginSchema.safeParseAsync({
    body: { email: 'coach@razmyar.ir', password: '123' },
  })
  assert.equal(shortPass.success, false, 'Password under 6 chars must fail validation')

  // Student creation validation
  const validStudent = await createStudentSchema.safeParseAsync({
    body: { name: 'مهدی رحیمی', age: 16 },
  })
  assert.equal(validStudent.success, true, 'Valid student data should pass')
  assert.equal(validStudent.data?.body.belt, 'سفید', 'Default belt should be سفید')

  // Student with invalid age
  const invalidAge = await createStudentSchema.safeParseAsync({
    body: { name: 'مهدی رحیمی', age: 1 },
  })
  assert.equal(invalidAge.success, false, 'Age below 4 must fail validation')
})
