var GlobalY = 0; //Y position of line at current page

var client = invoice.client;
var account = invoice.account;
var currencyId = client.currency_id;

layout.headerRight = 550;
layout.rowHeight = 15;

doc.setFontSize(9);

if (invoice.image) {
  var left = layout.headerRight - invoice.imageWidth;
  doc.addImage(invoice.image, 'JPEG', layout.marginLeft, 30);
}

if (!invoice.is_pro && logoImages.imageLogo1) {
  pageHeight = 820;
  y = pageHeight - logoImages.imageLogoHeight1;
  doc.addImage(logoImages.imageLogo1, 'JPEG', layout.marginLeft, y, logoImages.imageLogoWidth1, logoImages.imageLogoHeight1);
}

doc.setFontSize(9);
SetPdfColor('LightBlue', doc, 'primary');
displayAccount(doc, invoice, 220, layout.accountTop, layout);

SetPdfColor('LightBlue', doc, 'primary');
doc.setFontSize('11');
doc.text(50, layout.headerTop, (invoice.is_quote ? invoiceLabels.quote : invoiceLabels.invoice).toUpperCase());


SetPdfColor('Black', doc); //set black color
doc.setFontSize(9);

var invoiceHeight = displayInvoice(doc, invoice, 50, 170, layout);
var clientHeight = displayClient(doc, invoice, 220, 170, layout);
var detailsHeight = Math.max(invoiceHeight, clientHeight);
layout.tableTop = Math.max(layout.tableTop, layout.headerTop + detailsHeight + (3 * layout.rowHeight));

doc.setLineWidth(0.3);
doc.setDrawColor(200, 200, 200);
doc.line(layout.marginLeft - layout.tablePadding, layout.headerTop + 6, layout.marginRight + layout.tablePadding, layout.headerTop + 6);
doc.line(layout.marginLeft - layout.tablePadding, layout.headerTop + detailsHeight + 14, layout.marginRight + layout.tablePadding, layout.headerTop + detailsHeight + 14);

doc.setFontSize(10);
doc.setFontType('bold');
displayInvoiceHeader(doc, invoice, layout);
var y = displayInvoiceItems(doc, invoice, layout);

doc.setFontSize(9);
doc.setFontType('bold');

GlobalY = GlobalY + 25;


doc.setLineWidth(0.3);
doc.setDrawColor(241, 241, 241);
doc.setFillColor(241, 241, 241);
var x1 = layout.marginLeft - 12;
var y1 = GlobalY - layout.tablePadding;

var w2 = 510 + 24;
var h2 = doc.internal.getFontSize() * 3 + layout.tablePadding * 2;

if (invoice.discount) {
  h2 += doc.internal.getFontSize() * 2;
}
if (invoice.tax_amount) {
  h2 += doc.internal.getFontSize() * 2;
}

//doc.rect(x1, y1, w2, h2, 'FD');

doc.setFontSize(9);
displayNotesAndTerms(doc, layout, invoice, y);
y += displaySubtotals(doc, layout, invoice, y, layout.unitCostRight);


doc.setFontSize(10);
Msg = invoice.is_quote ? invoiceLabels.total : invoiceLabels.balance_due;
var TmpMsgX = layout.unitCostRight - (doc.getStringUnitWidth(Msg) * doc.internal.getFontSize());

doc.text(TmpMsgX, y, Msg);

SetPdfColor('LightBlue', doc, 'primary');
AmountText = formatMoney(invoice.balance_amount, currencyId);
headerLeft = layout.headerRight + 400;
var AmountX = layout.lineTotalRight - (doc.getStringUnitWidth(AmountText) * doc.internal.getFontSize());
doc.text(AmountX, y, AmountText);