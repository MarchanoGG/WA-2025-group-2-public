import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

export async function generateParentCodesPdf(codes: string[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const domain = window.location.origin;

  for (const code of codes) {
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const centerX = 595 / 2;
    let y = 750;

    const qrLink = `${domain}/Parents/Login?${code}`; // QR code link with code
    const visibleLink = `${domain}/Parents/Login`; // Displayed text (without code)

    // Generate QR image
    const qrImageBytes = await fetch(await QRCode.toDataURL(qrLink)).then(res => res.arrayBuffer());
    const qrImage = await pdfDoc.embedPng(qrImageBytes);

    // Helper: draw centered text
    const drawTextCentered = (text: string, y: number, size = 12, bold = false) => {
      const width = (bold ? boldFont : font).widthOfTextAtSize(text, size);
      page.drawText(text, {
        x: centerX - width / 2,
        y,
        size,
        font: bold ? boldFont : font,
        color: rgb(0, 0, 0)
      });
    };

    // Header
    drawTextCentered("Beste ouder/verzorger,", y, 14);
    y -= 30;
    drawTextCentered("U ontvangt deze ouderbrief om toegang te krijgen tot EduPlanner,", y);
    y -= 18;
    drawTextCentered("het systeem om afspraken te plannen met de mentor of decaan van uw kind.", y);
    y -= 40;

    // Parent code
    drawTextCentered("Uw unieke oudercode:", y);
    y -= 25;
    drawTextCentered(code, y, 18, true);
    y -= 40;

    // Instruction + visible link
    drawTextCentered("Scan de onderstaande QR-code of gebruik de volgende link:", y);
    y -= 20;
    drawTextCentered(visibleLink, y, 10);
    y -= 250;

    // QR image
    page.drawImage(qrImage, {
      x: centerX - 100,
      y,
      width: 200,
      height: 200
    });

    // Footer
    drawTextCentered("Met vriendelijke groet,", 90);
    drawTextCentered("Team EduPlanner", 70);
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
