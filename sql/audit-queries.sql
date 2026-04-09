-- Texto possivelmente corrompido (mojibake)
SELECT 'accounts' AS table_name, id, name AS sample FROM accounts WHERE name LIKE '%Ã%' OR name LIKE '%â%' OR name LIKE '%Â%'
UNION ALL
SELECT 'credit_cards', id, name FROM credit_cards WHERE name LIKE '%Ã%' OR name LIKE '%â%' OR name LIKE '%Â%'
UNION ALL
SELECT 'transactions', id, description FROM transactions WHERE description LIKE '%Ã%' OR description LIKE '%â%' OR description LIKE '%Â%';

-- Cartões potencialmente duplicados por slug ou nome normalizado
SELECT slug, COUNT(*) AS qty, GROUP_CONCAT(id) AS ids FROM credit_cards GROUP BY slug HAVING COUNT(*) > 1;
SELECT lower(trim(name)) AS normalized_name, COUNT(*) AS qty, GROUP_CONCAT(id) AS ids FROM credit_cards GROUP BY lower(trim(name)) HAVING COUNT(*) > 1;

-- Bills muito distantes no futuro
SELECT bill_month, due_on, credit_card_id, total_amount_cents
FROM credit_card_bills
WHERE due_on > date('now', '+24 months')
ORDER BY due_on ASC;

-- Bills sem entries auditáveis
SELECT b.id, b.bill_month, b.total_amount_cents
FROM credit_card_bills b
LEFT JOIN bill_entries e ON e.bill_id = b.id
GROUP BY b.id
HAVING COUNT(e.id) = 0 AND b.total_amount_cents > 0;

-- Regras sem ocorrências futuras
SELECT r.id, r.title, r.next_run_on
FROM recurring_rules r
LEFT JOIN recurring_occurrences o ON o.rule_id = r.id AND o.status = 'scheduled' AND o.due_on >= date('now')
WHERE r.is_active = 1
GROUP BY r.id
HAVING COUNT(o.id) = 0;

-- Fechamentos ausentes para meses com transações
SELECT t.competence_month AS month, COUNT(*) AS transactions_count
FROM transactions t
LEFT JOIN monthly_closings mc ON mc.month = t.competence_month
GROUP BY t.competence_month
HAVING COUNT(*) > 0 AND MAX(mc.id) IS NULL;

-- Lotes com JSON suspeito
SELECT id, filename, status
FROM import_batches
WHERE workbook_summary_json IS NULL OR trim(workbook_summary_json) = '' OR workbook_summary_json = '{}';
