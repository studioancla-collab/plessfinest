const ORDERS_SHEET = "Zamowienia";
const ITEMS_SHEET = "Pozycje";
const TOKEN_PROPERTY = "API_TOKEN";

const STATUS_TO_SHEET = {
  new: "Nowe",
  production: "W produkcji",
  ready: "Gotowe",
  done: "Zakończone",
  cancelled: "Anulowane",
};
const STATUS_FROM_SHEET = Object.fromEntries(Object.entries(STATUS_TO_SHEET).map(([key, value]) => [value, key]));
const PAYMENT_TO_SHEET = { unpaid: "Nieopłacone", partial: "Zaliczka", paid: "Opłacone" };
const PAYMENT_FROM_SHEET = Object.fromEntries(Object.entries(PAYMENT_TO_SHEET).map(([key, value]) => [value, key]));
const DELIVERY_TO_SHEET = { pickup: "Odbiór własny", shipping: "Wysyłka" };
const DELIVERY_FROM_SHEET = Object.fromEntries(Object.entries(DELIVERY_TO_SHEET).map(([key, value]) => [value, key]));
const COLOR_TO_SHEET = {
  "burgund": "Burgund", "wolf grey": "Wolf Grey", "black": "Black", "white": "White",
  "mexican green": "Mexican Green", "ivory": "Ivory", "other": "Inny / custom",
};
const COLOR_FROM_SHEET = Object.fromEntries(Object.entries(COLOR_TO_SHEET).map(([key, value]) => [value, key]));

function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet.getSheetByName(ORDERS_SHEET) || !spreadsheet.getSheetByName(ITEMS_SHEET)) {
    throw new Error("Brakuje zakładek Zamowienia lub Pozycje. Zaimportuj przygotowany szablon bez zmiany nazw zakładek.");
  }
  if (!PropertiesService.getScriptProperties().getProperty(TOKEN_PROPERTY)) {
    throw new Error("Dodaj API_TOKEN w Ustawienia projektu > Właściwości skryptu, a następnie uruchom setup ponownie.");
  }
  return "Połączenie jest gotowe.";
}

function doGet(event) {
  try {
    assertToken_(event.parameter.token || "");
    const action = event.parameter.action || "list";
    if (action === "ping") return json_({ ok: true, message: "Połączenie działa." });
    if (action === "list") return json_({ ok: true, orders: readOrders_() });
    throw new Error("Nieznana akcja.");
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function doPost(event) {
  try {
    const request = JSON.parse(event.postData?.contents || "{}");
    assertToken_(request.token || "");
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      if (request.action === "saveOrder") {
        saveOrder_(request.order);
      } else if (request.action === "deleteOrder") {
        deleteOrder_(String(request.id || ""));
      } else if (request.action === "replaceAll") {
        replaceAll_(Array.isArray(request.orders) ? request.orders : []);
      } else if (request.action !== "ping") {
        throw new Error("Nieznana akcja.");
      }
      SpreadsheetApp.flush();
      return json_({ ok: true, message: "Zapisano." });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function assertToken_(provided) {
  const expected = PropertiesService.getScriptProperties().getProperty(TOKEN_PROPERTY);
  if (!expected) throw new Error("Brak API_TOKEN we właściwościach skryptu.");
  if (provided !== expected) throw new Error("Nieprawidłowy klucz połączenia.");
}

function getSheets_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const orders = spreadsheet.getSheetByName(ORDERS_SHEET);
  const items = spreadsheet.getSheetByName(ITEMS_SHEET);
  if (!orders || !items) throw new Error("Nie znaleziono zakładek Zamowienia i Pozycje.");
  return { orders, items };
}

function readOrders_() {
  const { orders: ordersSheet, items: itemsSheet } = getSheets_();
  const orderRows = ordersSheet.getLastRow() > 1
    ? ordersSheet.getRange(2, 1, ordersSheet.getLastRow() - 1, 15).getValues()
    : [];
  const itemRows = itemsSheet.getLastRow() > 1
    ? itemsSheet.getRange(2, 1, itemsSheet.getLastRow() - 1, 11).getValues()
    : [];
  const itemsByOrder = {};
  itemRows.filter(row => row[0]).forEach(row => {
    const id = String(row[0]);
    (itemsByOrder[id] ||= []).push({
      model: cleanRead_(row[2]),
      size: cleanRead_(row[3]),
      color: COLOR_FROM_SHEET[cleanRead_(row[4])] || String(cleanRead_(row[4])).toLowerCase(),
      quantity: Number(row[5]) || 1,
      price: Number(row[6]) || 0,
      isCustom: cleanRead_(row[8]) === "Tak",
      customPrint: cleanRead_(row[9]),
      customDetails: cleanRead_(row[10]),
    });
  });
  return orderRows.filter(row => row[0]).map(row => ({
    id: String(row[0]),
    createdAt: isoDateTime_(row[1]),
    updatedAt: isoDateTime_(row[2]),
    isSample: false,
    customer: { name: cleanRead_(row[3]), phone: cleanRead_(row[4]), email: cleanRead_(row[5]), social: cleanRead_(row[6]) },
    items: itemsByOrder[String(row[0])] || [],
    delivery: DELIVERY_FROM_SHEET[cleanRead_(row[7])] || "pickup",
    shippingAddress: cleanRead_(row[8]),
    shippingCost: Number(row[9]) || 0,
    status: STATUS_FROM_SHEET[cleanRead_(row[10])] || "new",
    payment: PAYMENT_FROM_SHEET[cleanRead_(row[11])] || "unpaid",
    dueDate: dateOnly_(row[12]),
    notes: cleanRead_(row[13]),
  }));
}

function saveOrder_(order) {
  if (!order || !order.id) throw new Error("Brak danych zamówienia.");
  const { orders, items } = getSheets_();
  const now = new Date();
  const total = (order.items || []).reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0) + (Number(order.shippingCost) || 0);
  const row = [
    safeCell_(order.id), parseDate_(order.createdAt) || now, parseDate_(order.updatedAt) || now,
    safeCell_(order.customer?.name), safeCell_(order.customer?.phone), safeCell_(order.customer?.email), safeCell_(order.customer?.social),
    DELIVERY_TO_SHEET[order.delivery] || "Odbiór własny", safeCell_(order.shippingAddress), Number(order.shippingCost) || 0,
    STATUS_TO_SHEET[order.status] || "Nowe", PAYMENT_TO_SHEET[order.payment] || "Nieopłacone", parseDate_(order.dueDate) || "",
    safeCell_(order.notes), total,
  ];
  const existingRow = findRowById_(orders, order.id);
  if (existingRow) orders.getRange(existingRow, 1, 1, row.length).setValues([row]);
  else orders.appendRow(row);
  deleteItemRows_(items, order.id);
  const itemRows = (order.items || []).map((item, index) => [
    safeCell_(order.id), index + 1, safeCell_(item.model), safeCell_(item.size), COLOR_TO_SHEET[item.color] || safeCell_(item.color),
    Number(item.quantity) || 1, Number(item.price) || 0, (Number(item.quantity) || 1) * (Number(item.price) || 0),
    item.isCustom ? "Tak" : "Nie", safeCell_(item.customPrint), safeCell_(item.customDetails),
  ]);
  if (itemRows.length) items.getRange(items.getLastRow() + 1, 1, itemRows.length, 11).setValues(itemRows);
}

function deleteOrder_(id) {
  if (!id) return;
  const { orders, items } = getSheets_();
  const row = findRowById_(orders, id);
  if (row) orders.deleteRow(row);
  deleteItemRows_(items, id);
}

function replaceAll_(allOrders) {
  const { orders, items } = getSheets_();
  if (orders.getLastRow() > 1) orders.getRange(2, 1, orders.getLastRow() - 1, 15).clearContent();
  if (items.getLastRow() > 1) items.getRange(2, 1, items.getLastRow() - 1, 11).clearContent();
  allOrders.filter(order => !order.isSample).forEach(saveOrder_);
}

function findRowById_(sheet, id) {
  if (sheet.getLastRow() < 2) return 0;
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues();
  const index = values.findIndex(row => row[0] === String(id));
  return index < 0 ? 0 : index + 2;
}

function deleteItemRows_(sheet, id) {
  if (sheet.getLastRow() < 2) return;
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues();
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (values[index][0] === String(id)) sheet.deleteRow(index + 2);
  }
}

function safeCell_(value) {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function cleanRead_(value) {
  const text = String(value ?? "");
  return /^'[=+\-@]/.test(text) ? text.slice(1) : text;
}

function parseDate_(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isoDateTime_(value) {
  const date = parseDate_(value);
  return date ? date.toISOString() : "";
}

function dateOnly_(value) {
  const date = parseDate_(value);
  return date ? Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd") : "";
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
