import assert from 'node:assert/strict';
import { calculateBalance, calculateProjectedBalance, splitInstallments, resolveBillMonthForPurchase, generateInstallments, materializeOccurrences, closeMonthSnapshot, parseInstallmentLabel } from './lib/finance.ts';
import { generateOccurrences } from './lib/domain/recurrence.ts';
import { guessColumns } from './lib/domain/import-mapping.ts';

assert.equal(calculateBalance(10000, [
  { direction: 'income', amountCents: 2500, status: 'posted' },
  { direction: 'expense', amountCents: 1200, status: 'posted' },
  { direction: 'expense', amountCents: 800, status: 'scheduled' },
  { direction: 'transfer_out', amountCents: 300, status: 'void' }
]), 11300);
assert.equal(calculateProjectedBalance(10000, [
  { direction: 'income', amountCents: 2500, status: 'posted' },
  { direction: 'expense', amountCents: 1200, status: 'posted' },
  { direction: 'expense', amountCents: 800, status: 'scheduled' },
  { direction: 'transfer_out', amountCents: 300, status: 'void' }
]), 10500);
assert.deepEqual(splitInstallments(10000,3), [3334,3333,3333]);
assert.equal(resolveBillMonthForPurchase('2026-03-05',10), '2026-03');
assert.equal(resolveBillMonthForPurchase('2026-03-25',10), '2026-04');
const plan = generateInstallments({purchaseDate:'2026-03-25', totalAmountCents:12000, installmentCount:3, closeDay:10, dueDay:15});
assert.deepEqual(plan[0], { installmentNumber:1, amountCents:4000, billMonth:'2026-04', billClosedOn:'2026-04-10', billDueOn:'2026-05-15' });
assert.deepEqual(plan[2], { installmentNumber:3, amountCents:4000, billMonth:'2026-06', billClosedOn:'2026-06-10', billDueOn:'2026-07-15' });
assert.deepEqual(materializeOccurrences({nextRunOn:'2026-03-10', frequency:'monthly', amountCents:14990, direction:'expense'},3).map(i=>i.dueOn), ['2026-03-10','2026-04-10','2026-05-10','2026-06-10']);
assert.deepEqual(closeMonthSnapshot({openingBalanceCents:100000,incomesCents:25000,expensesCents:18000,transfersNetCents:-3000,projectedBillPaymentsCents:9000}), {realizedNetCents:7000, closingBalanceCents:104000, projectedFreeCashCents:95000});
assert.deepEqual(parseInstallmentLabel('Violino (4/10)'), { current:4, total:10 });
assert.equal(parseInstallmentLabel('Compra sem parcela'), null);
assert.ok(generateOccurrences({startDate:new Date('2026-03-10'), frequency:'monthly', monthsAhead:3, dayOfMonth:10})[0].referenceKey.includes('2026-03-10'));
const guesses = guessColumns(['Data','Descrição','Valor','Conta']).map(item => item.target);
assert.ok(guesses.includes('transactionDate'));
assert.ok(guesses.includes('amountCents'));
console.log('domain-smoke: ok');
