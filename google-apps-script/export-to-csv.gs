const EXPORT_FOLDER_NAME = 'aurea-finance-export';
const DEFAULT_YEAR = 2026;
const BANK_COLORS = {
  'MercadoPago': '#00bbfe',
  'NuBank': '#9900ff',
  'Nubank': '#9900ff',
  'Banco do Brasil': '#fbbc04',
  'Inter': '#ff6d01',
  'MPInvest': '#00bbfe'
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📊 Aurea Finance')
    .addItem('Exportar todos os CSVs', 'exportAllCsvs')
    .addToUi();
}

function exportAllCsvs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const folder = getOrCreateFolder_(EXPORT_FOLDER_NAME);

  const exports = [
    buildAccountsCsv_(ss),
    buildReservesCsv_(ss),
    buildStocksCsv_(ss),
    buildCryptoCsv_(ss),
    buildLedgerCsv_(ss),
    buildCardInstallmentsCsv_(ss),
    buildFutureBillsCsv_(ss),
    buildDailySnapshotsCsv_(ss),
    buildAssetTradesCsv_(ss)
  ];

  exports.forEach(function(entry) {
    upsertCsvFile_(folder, entry.fileName, entry.headers, entry.rows);
    Logger.log('%s → %s linhas exportadas', entry.fileName, entry.rows.length);
  });

  SpreadsheetApp.getUi().alert('Exportação concluída. Os CSVs foram salvos na pasta "' + EXPORT_FOLDER_NAME + '" do Google Drive.');
}

function buildAccountsCsv_(ss) {
  const sheet = ss.getSheetByName('Contas');
  const rows = getDisplayValues_(sheet);
  const headerIndex = findHeaderRow_(rows, ['Banco', 'Tipo de Conta', 'Saldo Atual']);
  const out = [];
  if (headerIndex === -1) return { fileName: 'contas.csv', headers: ['banco','tipo_conta','saldo_atual_centavos','produto_investimento','cor_hex'], rows: out };

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    const banco = safeCell_(row[0]);
    const tipo = safeCell_(row[1]);
    const saldo = safeCell_(row[2]);
    const produto = safeCell_(row[3]);
    if (!banco || /^total$/i.test(banco)) break;
    if (!tipo) continue;
    out.push([
      banco,
      normalizeAccountType_(tipo),
      toCents_(saldo),
      produto,
      BANK_COLORS[banco] || '#6b7280'
    ]);
  }

  return { fileName: 'contas.csv', headers: ['banco','tipo_conta','saldo_atual_centavos','produto_investimento','cor_hex'], rows: out };
}

function buildReservesCsv_(ss) {
  const sheet = ss.getSheetByName('Contas');
  const rows = getDisplayValues_(sheet);
  const headerIndex = findHeaderRow_(rows, ['Reserva', 'Valor Investido', 'Valor Anterior', 'Valor Atual']);
  const out = [];
  if (headerIndex === -1) return { fileName: 'reservas.csv', headers: ['nome','valor_investido_centavos','valor_anterior_centavos','valor_atual_centavos','lucro_total_centavos','rendimento_total_percentual','lucro_mensal_centavos','rendimento_mensal_percentual'], rows: out };

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    const nome = safeCell_(row[0]);
    if (!nome || /^total/i.test(nome)) break;
    out.push([
      nome,
      toCents_(row[1]),
      toCents_(row[2]),
      toCents_(row[3]),
      toCents_(row[4]),
      toPercent_(row[5]),
      toCents_(row[6]),
      toPercent_(row[7])
    ]);
  }

  return { fileName: 'reservas.csv', headers: ['nome','valor_investido_centavos','valor_anterior_centavos','valor_atual_centavos','lucro_total_centavos','rendimento_total_percentual','lucro_mensal_centavos','rendimento_mensal_percentual'], rows: out };
}

function buildStocksCsv_(ss) {
  const sheet = ss.getSheetByName('Contas');
  const rows = getDisplayValues_(sheet);
  const headerIndex = findHeaderRow_(rows, ['Ativo', 'Quantidade', 'Valor Investido']);
  const out = [];
  if (headerIndex === -1) return { fileName: 'acoes.csv', headers: ['ticker','nome_completo','quantidade','valor_investido_centavos','valor_anterior_centavos','valor_atual_centavos','resultado_total_centavos','rentabilidade_total_percentual'], rows: out };

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    const ativo = safeCell_(row[0]);
    if (!ativo || /^total/i.test(ativo)) break;
    const parts = ativo.split('–');
    const nome = safeCell_(parts[0]);
    const ticker = safeCell_(parts[1]) || nome.toUpperCase().replace(/[^A-Z0-9]/g, '');
    out.push([
      ticker,
      ativo,
      toInteger_(row[1]),
      toCents_(row[2]),
      toCents_(row[3]),
      toCents_(row[4]),
      toCents_(row[5]),
      toPercent_(row[6])
    ]);
  }

  return { fileName: 'acoes.csv', headers: ['ticker','nome_completo','quantidade','valor_investido_centavos','valor_anterior_centavos','valor_atual_centavos','resultado_total_centavos','rentabilidade_total_percentual'], rows: out };
}

function buildCryptoCsv_(ss) {
  const sheet = ss.getSheetByName('Contas');
  const rows = getDisplayValues_(sheet);
  const headerIndex = findHeaderRow_(rows, ['Cripto', 'Quantidade', 'Valor Investido']);
  const out = [];
  if (headerIndex === -1) return { fileName: 'criptomoedas.csv', headers: ['nome','quantidade','valor_investido_centavos','valor_anterior_centavos','valor_atual_centavos','lucro_total_centavos'], rows: out };

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    const nome = safeCell_(row[0]);
    if (!nome || /^total/i.test(nome)) break;
    out.push([
      nome,
      toDecimalString_(row[1]),
      toCents_(row[2]),
      toCents_(row[3]),
      toCents_(row[4]),
      toCents_(row[5])
    ]);
  }

  return { fileName: 'criptomoedas.csv', headers: ['nome','quantidade','valor_investido_centavos','valor_anterior_centavos','valor_atual_centavos','lucro_total_centavos'], rows: out };
}

function buildLedgerCsv_(ss) {
  const sheet = ss.getSheetByName('Acompanhamento Mensal');
  const rows = getDisplayValues_(sheet);
  const out = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rawDate = safeCell_(row[1]);
    if (!isCompactDate_(rawDate)) continue;
    const conta = safeCell_(row[2]);
    const valor = safeCell_(row[3]);
    const tipo = safeCell_(row[4]).toUpperCase();
    const saldo = safeCell_(row[5]);
    if (!conta || !valor || !saldo || (tipo !== 'R' && tipo !== 'D')) continue;
    out.push([
      compactDateToIso_(rawDate),
      conta,
      conta,
      toCents_(valor),
      tipo === 'R' ? 'receita' : 'despesa',
      toCents_(saldo)
    ]);
  }
  return { fileName: 'transacoes_historicas.csv', headers: ['data_iso','conta','descricao','valor_centavos','tipo','saldo_apos_centavos'], rows: out };
}

function buildCardInstallmentsCsv_(ss) {
  const sheet = ss.getSheetByName('Cartões');
  const rows = getDisplayValues_(sheet);
  const out = [];
  collectCardInstallments_(rows, 'nubank', 1, 2, 3, 4, 11, out);
  collectCardInstallments_(rows, 'mercadopago', 6, 7, 8, 9, 13, out);
  return { fileName: 'parcelas_cartao.csv', headers: ['cartao','data_vencimento_iso','descricao_compra','valor_parcela_centavos','numero_parcela','total_parcelas','tipo','responsavel'], rows: out };
}

function buildFutureBillsCsv_(ss) {
  const sheet = ss.getSheetByName('Cartões');
  const rows = getDisplayValues_(sheet);
  const out = [];
  const seen = {};
  collectBillRows_(rows, 'nubank', 11, 12, out, seen);
  collectBillRows_(rows, 'mercadopago', 13, 14, out, seen);
  return { fileName: 'faturas_futuras.csv', headers: ['cartao','data_vencimento_iso','valor_total_centavos'], rows: out };
}

function buildDailySnapshotsCsv_(ss) {
  const sheet = ss.getSheetByName('Registro Diário de Investimentos');
  const rows = getDisplayValues_(sheet);
  const out = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rawDate = safeCell_(row[0]);
    if (!isCompactDate_(rawDate)) continue;
    const variation = safeCell_(row[6]);
    out.push([
      compactDateToIso_(rawDate),
      toCents_(row[2]),
      toCents_(row[3]),
      toCents_(row[4]),
      toCents_(row[5]),
      /^-?\d/.test(variation) ? '' : variation
    ]);
  }
  return { fileName: 'registro_diario.csv', headers: ['data_iso','saldo_conta_centavos','investimento_1_centavos','investimento_2_centavos','patrimonio_total_centavos','tipo_variacao'], rows: out };
}

function buildAssetTradesCsv_(ss) {
  const sheet = ss.getSheetByName('Transações');
  const rows = getDisplayValues_(sheet);
  const out = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const action = safeCell_(row[0]);
    const date = safeCell_(row[3]);
    const isCompleted = safeCell_(row[11]).toUpperCase();
    const description = safeCell_(row[10]);
    if (!/^(Comprei|Vendi)$/i.test(action) || !isCompactDate_(date)) continue;
    if (isCompleted === 'FALSE' || /Tipo de transação inválido/i.test(description)) continue;
    out.push([
      /^vendi$/i.test(action) ? 'venda' : 'compra',
      safeCell_(row[1]),
      toDecimalString_(row[2]),
      compactDateToIso_(date),
      toCents_(row[5]),
      toCents_(row[6]),
      toCents_(row[7]),
      toCents_(row[8]),
      toPercent_(row[9]),
      description,
      '1'
    ]);
  }
  return { fileName: 'operacoes_ativos.csv', headers: ['action','asset_name','quantity','trade_date','total_initial_cents','price_per_unit_initial_cents','total_current_cents','price_per_unit_current_cents','yield_percent','description_text','is_completed'], rows: out };
}

function collectCardInstallments_(rows, cardName, dateCol, descriptionCol, valueCol, typeCol, responsibleCol, out) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rawDate = safeCell_(row[dateCol]);
    const descriptionRaw = safeCell_(row[descriptionCol]);
    if (!isCompactDate_(rawDate) && !isSlashDate_(rawDate)) continue;
    if (!descriptionRaw || /^-+$/.test(descriptionRaw)) continue;
    const parsed = parseInstallmentDescription_(descriptionRaw);
    const typeCell = safeCell_(row[typeCol]).toUpperCase();
    const tipo = parsed.numero_parcela ? 'parcelado' : (typeCell === 'R' ? 'recorrente' : 'parcelado');
    out.push([
      cardName,
      normalizeAnyDateToIso_(rawDate),
      parsed.descricao_compra,
      toCents_(row[valueCol]),
      parsed.numero_parcela === null ? '' : parsed.numero_parcela,
      parsed.total_parcelas === null ? '' : parsed.total_parcelas,
      tipo,
      safeCell_(row[responsibleCol])
    ]);
  }
}

function collectBillRows_(rows, cardName, textCol, valueCol, out, seen) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const text = safeCell_(row[textCol]);
    const value = safeCell_(row[valueCol]);
    const parsed = parseBillRow_(text, value);
    if (!parsed) continue;
    const key = cardName + '|' + parsed.date_iso;
    if (seen[key]) continue;
    seen[key] = true;
    out.push([cardName, parsed.date_iso, parsed.valor_total_centavos]);
  }
}

function parseBillRow_(textCell, valueCell) {
  const text = safeCell_(textCell);
  const value = safeCell_(valueCell);
  if (!text && !value) return null;

  var day = null;
  var month = null;
  var year = DEFAULT_YEAR;
  var cents = '';

  const textMatch = text.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
  if (textMatch) {
    day = Number(textMatch[1]);
    month = Number(textMatch[2]);
    year = inferBillYear_(month);
    if (textMatch[3]) {
      const y = Number(textMatch[3]);
      year = y < 100 ? 2000 + y : y;
    }
  }

  if (!day && isSlashDate_(text)) {
    const parts = text.split('/');
    day = Number(parts[0]);
    month = Number(parts[1]);
    year = parts[2] ? Number(parts[2]) : inferBillYear_(month);
  }

  if (value) cents = String(toCents_(value));
  if (!cents) {
    const valueMatch = (text + ' ' + value).match(/R\$\s*([\d\.,-]+)/i);
    if (valueMatch) cents = String(toCents_(valueMatch[1]));
  }

  if (!day || !month || cents === '') return null;
  return { date_iso: isoDateParts_(year, month, day), valor_total_centavos: cents };
}

function parseInstallmentDescription_(input) {
  const text = safeCell_(input);
  const match = text.match(/^(.*?)(?:\s+(\d+)\/(\d+))?$/);
  const descricao = safeCell_(match ? match[1] : text);
  const numero = match && match[2] ? Number(match[2]) : null;
  const total = match && match[3] ? Number(match[3]) : null;
  return {
    descricao_compra: descricao,
    numero_parcela: Number.isFinite(numero) ? numero : null,
    total_parcelas: Number.isFinite(total) ? total : null
  };
}

function normalizeAccountType_(value) {
  const text = safeCell_(value).toLowerCase();
  if (text.indexOf('fundo') !== -1) return 'fundos_investimento';
  if (text.indexOf('corrente') !== -1) return 'conta_corrente';
  return text.replace(/\s+/g, '_');
}

function getDisplayValues_(sheet) {
  return sheet ? sheet.getDataRange().getDisplayValues() : [];
}

function findHeaderRow_(rows, headerNames) {
  for (let i = 0; i < rows.length; i++) {
    const joined = rows[i].join(' | ').toLowerCase();
    const ok = headerNames.every(function(name) { return joined.indexOf(name.toLowerCase()) !== -1; });
    if (ok) return i;
  }
  return -1;
}

function safeCell_(value) {
  if (value === null || value === undefined) return '';
  const text = String(value).trim();
  if (!text) return '';
  if (/^#(REF!|DIV\/0!|VALUE!|N\/A)/i.test(text)) return '';
  return text;
}

function toInteger_(value) {
  const text = safeCell_(value).replace(/\./g, '').replace(',', '.');
  const num = Number(text);
  return Number.isFinite(num) ? Math.trunc(num) : 0;
}

function toDecimalString_(value) {
  const text = safeCell_(value).replace(/\./g, '').replace(',', '.');
  const num = Number(text);
  return Number.isFinite(num) ? String(num) : '0';
}

function toPercent_(value) {
  const text = safeCell_(value).replace('%', '').replace(/\./g, '').replace(',', '.');
  const num = Number(text);
  return Number.isFinite(num) ? String(num) : '';
}

function toCents_(value) {
  const text = safeCell_(value);
  if (!text) return 0;
  const normalized = text.replace(/\./g, '').replace(/,/g, '.').replace(/[^0-9.-]/g, '');
  const num = Number(normalized);
  return Number.isFinite(num) ? Math.round(num * 100) : 0;
}

function isCompactDate_(value) {
  return /^\d{8}$/.test(safeCell_(value));
}

function isSlashDate_(value) {
  return /^\d{1,2}\/\d{1,2}(?:\/\d{2,4})?$/.test(safeCell_(value));
}

function compactDateToIso_(value) {
  const text = safeCell_(value);
  const day = Number(text.slice(0, 2));
  const month = Number(text.slice(2, 4));
  const year = Number(text.slice(4, 8));
  return isoDateParts_(year, month, day);
}

function normalizeAnyDateToIso_(value) {
  const text = safeCell_(value);
  if (isCompactDate_(text)) return compactDateToIso_(text);
  if (isSlashDate_(text)) {
    const parts = text.split('/');
    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const year = parts[2] ? Number(parts[2].length === 2 ? '20' + parts[2] : parts[2]) : inferBillYear_(month);
    return isoDateParts_(year, month, day);
  }
  return '';
}

function inferBillYear_(month) {
  return month < 3 ? 2027 : 2026;
}

function isoDateParts_(year, month, day) {
  return year + '-' + pad2_(month) + '-' + pad2_(day);
}

function pad2_(value) {
  return ('0' + Number(value)).slice(-2);
}

function getOrCreateFolder_(name) {
  const folders = DriveApp.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(name);
}

function upsertCsvFile_(folder, fileName, headers, rows) {
  const csv = buildCsv_(headers, rows);
  const existing = folder.getFilesByName(fileName);
  while (existing.hasNext()) {
    existing.next().setTrashed(true);
  }
  folder.createFile(fileName, csv, MimeType.CSV);
}

function buildCsv_(headers, rows) {
  const lines = [headers, ...rows].map(function(row) {
    return row.map(csvEscape_).join(',');
  });
  return lines.join('\n');
}

function csvEscape_(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return '"' + text.replace(/"/g, '""') + '"';
}
